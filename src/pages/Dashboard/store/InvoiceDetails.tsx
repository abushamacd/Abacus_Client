/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-explicit-any */
import text_logo from "../../../assets/text_logo.png";
import { useParams } from "react-router-dom";
import Loading from "../../../components/ui/Loading";
import { useGetInvoiceQuery } from "../../../redux/api/invoice";
import { useEffect, useState } from "react";
import { FaEdit } from "react-icons/fa";
import { MdDeleteForever, MdOutlineCancel } from "react-icons/md";
import {
  Button,
  Card,
  Checkbox,
  Col,
  DatePicker,
  DatePickerProps,
  Input,
  Row,
  Select,
} from "antd";
import { useGetUsersQuery } from "../../../redux/api/userApi";
import { useDebounced } from "../../../redux/hooks";
import dayjs from "dayjs";
import { SelectOptions } from "../../../types";
import TextArea from "antd/es/input/TextArea";

const formatedDate = (date: string) => {
  const newDate = new Date(date);

  // Extract the date components
  const day = String(newDate.getDate()).padStart(2, "0");
  const month = String(newDate.getMonth() + 1).padStart(2, "0"); // getMonth() returns 0-based month, so we add 1
  const year = newDate.getFullYear();

  // Manually format the date as DD/MM/YYYY
  const result = `${day}/${month}/${year}`;
  return result;
};

export const InvoiceDetails = () => {
  const params = useParams();
  const { data: invoiceData, isLoading: invoiceLoading } = useGetInvoiceQuery(
    params?.id
  );

  const invoice: any = invoiceData;

  // Roles
  const roles = [
    { label: "Owner", value: "Owner" },
    { label: "Manager", value: "Manager" },
    { label: "Staff", value: "Staff" },
    { label: "Retailer", value: "Retailer" },
    { label: "Consumer", value: "Consumer" },
  ];

  const [isEdit, setIsEdit] = useState(true);
  const [errMessage, setErrMessage] = useState("");
  const [selectdUser, setSelectdUser] = useState<any>(null);
  const [showProfit, setShowProfit] = useState(false);
  const [invoiceDate, setInvoiceDate] = useState(invoice?.date);
  const [role, setRole] = useState("");
  const [note, setNote] = useState("");
  const [fullPaid, setFullPaid] = useState(false);
  const [discount, setDiscount] = useState<number>(0);
  const [afterReturnDue, setAfterReturnDue] = useState<number>(0);
  const [returnAmount, setReturnAmount] = useState<number>(0);
  const [remainAmount, setRemainAmount] = useState<number>(0);
  const [paid, setPaid] = useState<number>(0);
  const [allProducts, setAllProducts] = useState<any[]>([]);
  const [removedProducts, setRemovedProducts] = useState<any[]>([]);

  let products: [];

  // Customer query
  const [customerSearchTerm, setCustomerSearchTerm] = useState<string>(
    invoice?.customerName
  );

  const customerDebouncedTerm = useDebounced({
    searchQuery: customerSearchTerm,
    delay: 600,
  });

  const customerQuery: Record<string, any> = customerDebouncedTerm
    ? { searchTerm: customerDebouncedTerm }
    : {};

  const { data: usersData, isLoading: userLoading } = useGetUsersQuery({
    ...customerQuery,
  });
  // @ts-ignore
  const allUser: any = usersData?.users;

  const users = allUser?.map((user: any) => ({
    label: `${user?.name} - ${user?.address}`,
    value: user?.id,
  }));

  const onCustomerSearch = (value: string) => {
    setCustomerSearchTerm(value);
    setErrMessage("");
  };

  const onCustomerChange = (value: string) => {
    const filteredUser = allUser.filter((user: any) => user.id === value);
    setSelectdUser(filteredUser[0]);
    setErrMessage("");
  };

  const onRoleChange = (value: string) => setRole(value);

  const onDateChange: DatePickerProps["onChange"] = (
    _date: any,
    dateString: any
  ) => {
    setInvoiceDate(dateString);
  };

  const invoiceInputHandler = (e: any) => {
    const { name, value } = e.target;
    if (name === "discount") setDiscount(+value);
    if (name === "paid") setPaid(+value);
    if (name === "note") setNote(value);
  };

  useEffect(() => {
    if (customerSearchTerm === "") {
      setCustomerSearchTerm("Unknown");
    } else if (customerSearchTerm?.length > 0) {
      setCustomerSearchTerm(customerSearchTerm);
    } else {
      setCustomerSearchTerm(invoice?.customerName);
    }
  }, [customerSearchTerm, invoice]);

  useEffect(() => {
    setInvoiceDate(invoice?.date);
    setAfterReturnDue(invoice?.due);
    setRemainAmount(invoice?.total);
    // setPaid(invoice?.total - invoice?.due);
  }, [invoice]);

  useEffect(() => {
    const returns = removedProducts?.reduce(
      (acc: any, item: { total: any }) => acc + item.total,
      0
    );

    if (invoice?.due > 0 && returns > 0) {
      const afterReturn = returns - invoice?.due;
      if (afterReturn > 0) {
        setReturnAmount(afterReturn);
        setAfterReturnDue(0);
        setRemainAmount(invoice?.total - returns);
      } else {
        setAfterReturnDue(-afterReturn);
        setRemainAmount(invoice?.total - returns);
      }
    } else if (returns > 0) {
      setReturnAmount(returns);
      setRemainAmount(invoice?.total - returns);
    }

    // setReturnAmount(returns);
  }, [removedProducts, invoice, allProducts]);

  // console.log(invoice);

  useEffect(() => {
    setSelectdUser(allUser?.[0]);
  }, [allUser]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/exhaustive-deps
    if (invoice) products = JSON.parse(invoice?.products);
    setAllProducts(products);
  }, [invoice]);

  if (invoiceLoading || userLoading) {
    return <Loading />;
  }

  const totalProfit = allProducts?.reduce(
    (acc: any, item: { profit: any }) => acc + item.profit,
    0
  );
  const totalAmount = allProducts?.reduce(
    (acc: any, item: { total: any }) => acc + item.total,
    0
  );

  const afterDiscount = +totalAmount?.toFixed(2);
  const due = +(afterDiscount - paid)?.toFixed(2);

  const removeHandler = (index: number) => {
    const removedProduct: any = allProducts[index];
    setRemovedProducts([...removedProducts, removedProduct]);

    const updatedProducts = allProducts.filter((_, i) => i !== index);

    setAllProducts(updatedProducts);
  };

  const invoiceHandler = async () => {
    if (selectdUser === null) {
      setErrMessage("Must be select the customer");
      return;
    }

    const data = {
      customerId: selectdUser?.id,
      customerName: selectdUser?.name,
      date: invoiceDate,
      note: note,
      // due: due || 0,
      // profit: totalProfit - discount || 0,
      // total: afterDiscount || 0,
      discount: discount || 0,
      // products: allProducts,
    };

    console.log(data);

    // try {
    //   await createInvoice(data).unwrap();
    //   toast.success("Create invoice successfully");
    //   setSelectdUser(null);
    //   setRole("");
    //   setAllProducts([]);
    //   setPaid(0);
    //   setDiscount(0);
    // } catch (err: any) {
    //   toast.error(`${err.data?.message}`);
    // }
  };

  return (
    <div>
      <section className="dark:bg-bg_dark bg-white p-4 rounded-md">
        <Card
          title={
            <div className="flex gap-1 items-center">
              <span className="">Invoice Details</span>
              <span onClick={() => setIsEdit(!isEdit)} className="">
                {isEdit ? (
                  <FaEdit className={`text-xl text-primary`} />
                ) : (
                  <MdOutlineCancel className={`text-xl text-primary`} />
                )}
              </span>
            </div>
          }
          className="dark:bg-bg_dark bg-white text-mirage dark:text-white !border-secondary border-2 mb-5"
        >
          {/* create invoice */}
          <section className="dark:bg-bg_dark bg-white p-4 rounded-md">
            <div className="dark:bg-bg_dark bg-white text-mirage dark:text-white !border-secondary border-2 rounded-md">
              {/* store info */}
              <div className="store_info p-2">
                <img
                  src={text_logo}
                  alt="User Cover"
                  className="w-auto h-[2rem] md:h-[4rem] mx-auto"
                />
                <h4 className="text-center text-[.6rem] md:text-[1rem]">
                  Notun Dorbespur, Meherpur.
                </h4>
                <p className="text-center text-[.6rem] md:text-[1rem]">
                  {invoiceDate}
                </p>

                <span className="flex justify-center ">
                  <Checkbox
                    className="text-mirage dark:text-white"
                    onChange={() => setShowProfit(!showProfit)}
                  >
                    Show Profit
                  </Checkbox>
                </span>
              </div>
              {/* user info */}
              <div className="md:w-64 flex items-center justify-center mx-auto px-4">
                <div className="">
                  <Select
                    disabled={isEdit}
                    allowClear
                    className="w-full"
                    showSearch
                    placeholder="Search customer"
                    optionFilterProp="label"
                    onChange={onCustomerChange}
                    onSearch={onCustomerSearch}
                    options={users}
                  />
                  {errMessage?.includes("customer") && (
                    <small style={{ color: "red" }}>{errMessage}</small>
                  )}
                </div>
              </div>
              <div className="py-4 border-t-2 border-secondary mt-4 mx-4">
                <Row
                  className="!mx-0"
                  gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}
                >
                  <Col
                    className="gutter-row"
                    sm={24}
                    md={6}
                    style={{
                      marginBottom: "15px",
                      paddingLeft: "0px",
                    }}
                  >
                    <span className="tracking-wide block">
                      <span className="!font-bold">Customer Name: </span>
                      <span className="italic">{selectdUser?.name}</span>
                    </span>
                  </Col>
                  <Col
                    className="gutter-row"
                    sm={24}
                    md={6}
                    style={{
                      marginBottom: "15px",
                      paddingLeft: "0px",
                    }}
                  >
                    <span className="tracking-wide block">
                      <span className="!font-bold">Address: </span>
                      <span className="italic">{selectdUser?.address}</span>
                    </span>
                  </Col>
                  <Col
                    className="gutter-row"
                    sm={24}
                    md={6}
                    style={{
                      marginBottom: "15px",
                      paddingLeft: "0px",
                    }}
                  >
                    <div className="tracking-wide flex items-center gap-1">
                      <div className="!font-bold">Status: </div>
                      <div
                        style={{ backgroundColor: `${selectdUser?.status}` }}
                        className="italic h-4 w-4 rounded-full"
                      ></div>
                    </div>
                  </Col>
                  <Col
                    className="gutter-row"
                    sm={24}
                    md={6}
                    style={{
                      marginBottom: "15px",
                      paddingLeft: "0px",
                    }}
                  >
                    <span className="tracking-wide flex justify-between">
                      <span className="!font-bold">Paid:</span>
                      <span className={`italic `}> {invoice?.paid}</span>
                    </span>
                    <span className="tracking-wide flex justify-between">
                      <span className="!font-bold">Due:</span>
                      <span
                        className={`italic ${
                          afterReturnDue > 0 && "text-[#D31818] !font-bold"
                        }`}
                      >
                        {afterReturnDue}
                      </span>
                    </span>
                    <span className="tracking-wide flex justify-between border-t">
                      <span className="!font-bold">Total:</span>
                      <span className={`italic `}>{invoice?.total}</span>
                    </span>
                    <span className="tracking-wide flex justify-between">
                      <span className="!font-bold">Return:</span>
                      <span
                        className={`italic ${
                          returnAmount > 0 && "text-[#D31818] !font-bold"
                        }`}
                      >
                        {returnAmount || 0}
                      </span>
                    </span>
                    <span className="tracking-wide flex justify-between border-t">
                      <span className="!font-bold">Remain:</span>
                      <span className={`italic `}>{remainAmount}</span>
                    </span>
                  </Col>
                </Row>
              </div>

              {/* products info */}
              <div className="p-4">
                <Row
                  className="!mx-0  justify-between"
                  gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}
                >
                  <Col
                    className="gutter-row"
                    sm={24}
                    md={6}
                    style={{
                      marginBottom: "15px",
                      paddingLeft: "0px",
                      width: "100%",
                    }}
                  >
                    <div className="mb-1">
                      <span className="text-mirage dark:text-white">
                        Invoice Date
                      </span>
                      <span
                        style={{
                          color: "red",
                          marginLeft: "2px",
                        }}
                      >
                        *
                      </span>
                    </div>
                    <DatePicker
                      disabled={isEdit}
                      name="invoiceDate"
                      className="bg-white text-mirage dark:bg-bg_dark dark:text-white focus-within:!border-primary hover:!border-primary disabled:text-mirage dark:disabled:text-white"
                      defaultValue={dayjs(formatedDate(invoice?.date))}
                      format={"DD/MM/YYYY"}
                      onChange={onDateChange}
                      size="middle"
                      style={{ width: "100%" }}
                    />
                  </Col>
                  <Col
                    className="gutter-row"
                    sm={24}
                    md={6}
                    style={{
                      marginBottom: "15px",
                      paddingLeft: "0px",
                      width: "100%",
                    }}
                  >
                    <div className="mb-1">
                      <span className="text-mirage dark:text-white">
                        Customer Type
                      </span>
                      <span
                        style={{
                          color: "red",
                          marginLeft: "2px",
                        }}
                      >
                        *
                      </span>
                    </div>
                    <Select
                      disabled={isEdit}
                      allowClear
                      value={role || selectdUser?.role}
                      className="w-full"
                      showSearch
                      placeholder="Select Customer Type"
                      optionFilterProp="label"
                      onChange={onRoleChange}
                      options={roles as SelectOptions[]}
                    />
                  </Col>
                </Row>
                <div className="overflow-x-auto border-y-2 border-secondary py-4 mb-4">
                  <table className="md:min-w-full w-[800px] table-auto border-separate">
                    <thead>
                      <tr className="bg-secondary">
                        <th className="text-left p-2 w-[40%]">Particulers</th>
                        <th className="text-right p-2 w-[15%]">Quantity</th>
                        <th className="text-right p-2 w-[15%]">Rate</th>
                        <th className="text-right p-2 w-[10%]">Total (৳)</th>
                        {showProfit && (
                          <th className="text-right p-2 w-[10%]">Profit (৳)</th>
                        )}

                        <th className="text-center p-2 w-[10%]">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {allProducts?.map((product: any, i: number) => {
                        return (
                          <tr
                            key={i}
                            className="hover:bg-secondary duration-300"
                          >
                            <td className="p-2 text-start flex justify-between items-center">
                              <span> {product?.product}</span>{" "}
                              <span>{`ADS-${product?.purchase}T`}</span>
                            </td>
                            <td className="p-2 text-right">
                              {product?.quantity} ({product?.unit})
                            </td>
                            <td className="p-2 text-right">
                              {product?.rate} (৳ /{product?.unit})
                            </td>
                            <td className="p-2 text-right">{product?.total}</td>
                            {showProfit && (
                              <td className="p-2 text-right">
                                {product?.profit}
                              </td>
                            )}
                            <td className="p-2 flex gap-2 justify-center items-center">
                              <FaEdit
                                style={{ color: "#008A3F" }}
                                // onClick={() => openView(invoice?.id)}
                                size={22}
                              />
                              <MdDeleteForever
                                onClick={() => removeHandler(i)}
                                size={20}
                                style={{ color: "#D92728" }}
                              />
                            </td>
                          </tr>
                        );
                      })}
                      {showProfit && (
                        <tr className="hover:bg-secondary duration-300">
                          <td colSpan={4} className="p-2 text-right">
                            Total Profit ={" "}
                          </td>

                          <td className="p-2 text-right">{totalProfit}</td>
                          <td className="p-2 text-right"></td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
                {/* calculation */}
                <Row
                  className="!mx-0 border-b-2 border-secondary mb-4 px-2 justify-between"
                  gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}
                >
                  <Col
                    className="gutter-row"
                    sm={24}
                    md={16}
                    style={{
                      marginBottom: "15px",
                      paddingLeft: "0px",
                      width: "100%",
                    }}
                  >
                    <div className="mb-1">
                      <span className="text-mirage dark:text-white">Note</span>
                    </div>
                    <TextArea
                      className="bg-white text-mirage dark:bg-bg_dark dark:text-white focus-within:!border-primary hover:!border-primary disabled:text-mirage dark:disabled:text-white placeholder:text-[#ddddddbb]"
                      name="note"
                      rows={9}
                      onChange={invoiceInputHandler}
                      placeholder="Type note"
                    />
                  </Col>
                  <Col
                    className="gutter-row mt-6 border-2 border-primary p-4 rounded-md"
                    sm={24}
                    md={6}
                    style={{
                      marginBottom: "15px",
                      paddingLeft: "0px",
                      paddingRight: "0px",
                      width: "100%",
                    }}
                  >
                    <div className="flex justify-between items-center px-4 text-primary">
                      <span className="subtotal !font-bold text-lg">
                        Total:{" "}
                      </span>
                      <span className="subtotal !font-bold text-lg">
                        {afterDiscount || 0}
                      </span>
                    </div>
                    <div className="flex justify-between items-center px-4">
                      <span className="subtotal">
                        Paid:{" "}
                        <Checkbox
                          className="text-mirage dark:text-white"
                          onChange={() => setFullPaid(!fullPaid)}
                        ></Checkbox>
                      </span>
                      <Input
                        value={paid}
                        className="bg-white text-mirage dark:bg-bg_dark dark:text-white focus-within:!border-primary hover:!border-primary disabled:text-mirage dark:disabled:text-white !placeholder:text-[#ddddddbb] w-20 relative left-[15px]"
                        name="paid"
                        step={1}
                        type="number"
                        variant={"filled"}
                        min={0}
                        max={afterDiscount}
                        size="small"
                        defaultValue={0}
                        placeholder="Discount"
                        onChange={invoiceInputHandler}
                      />
                    </div>
                    <hr className="mx-4 my-2" />
                    <div
                      className={`flex justify-between items-center px-4 ${
                        due > 0 ? "text-[#D92728]" : ""
                      }`}
                    >
                      <span className="subtotal !font-bold text-lg">Due: </span>
                      <span className="subtotal !font-bold text-lg">
                        {due - returnAmount || 0}
                      </span>
                    </div>
                  </Col>
                  <Button
                    className="bg-primary hover:!bg-primary text-mirage !bg-opacity-[.8] duration-300 transition-all my-5 "
                    size="middle"
                    onClick={invoiceHandler}
                    type="primary"
                    block
                  >
                    Update Invoice
                  </Button>
                </Row>
              </div>
            </div>
          </section>
        </Card>
      </section>
    </div>
  );
};
