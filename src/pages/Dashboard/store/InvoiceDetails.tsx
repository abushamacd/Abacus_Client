/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-explicit-any */
import text_logo from "../../../assets/text_logo.png";
import { useNavigate, useParams } from "react-router-dom";
import Loading from "../../../components/ui/Loading";
import {
  useGetInvoiceQuery,
  useUpdateInvoiceMutation,
} from "../../../redux/api/invoice";
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
import { toast } from "react-toastify";

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
  const code = Math.floor(100 + Math.random() * 900).toString();
  const params = useParams();
  const navigate = useNavigate();
  const { data: invoiceData, isLoading: invoiceLoading } = useGetInvoiceQuery(
    params?.id
  );
  const [updateInvoice] = useUpdateInvoiceMutation();

  const invoice: any = invoiceData;

  // Roles
  const roles = [
    { label: "Owner", value: "Owner" },
    { label: "Manager", value: "Manager" },
    { label: "Retailer", value: "Retailer" },
    { label: "Consumer", value: "Consumer" },
  ];

  const [isEdit, setIsEdit] = useState(false);
  const [reduce, setReduce] = useState(false);
  const [errMessage, setErrMessage] = useState("");
  const [selectdUser, setSelectdUser] = useState<any>(null);
  const [showProfit, setShowProfit] = useState(false);
  const [invoiceDate, setInvoiceDate] = useState(invoice?.date);
  const [role, setRole] = useState("");
  const [note, setNote] = useState("");
  const [afterReturnDue, setAfterReturnDue] = useState<number>(0);
  const [afterReturnPaid, setAfterReturnPaid] = useState<number>(0);
  const [returnAmount, setReturnAmount] = useState<number>(0);
  const [remainAmount, setRemainAmount] = useState<number>(0);
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
    if (name === "note") setNote(value);
    if (name === "paid") {
      setAfterReturnPaid(+value);
      setAfterReturnDue(remainAmount - +value);
    }
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
  }, [invoice]);

  useEffect(() => {
    const returns = removedProducts?.reduce(
      (acc: any, item: { total: any }) => acc + item.total,
      0
    );

    if (invoice?.due > 0 && returns > 0) {
      const afterReturn = returns - invoice?.due;
      if (afterReturn > 0) {
        setReturnAmount(+afterReturn.toFixed(2));
        setAfterReturnDue(0);
        setRemainAmount(+(invoice?.total - returns).toFixed(2));
      } else {
        setAfterReturnDue(-afterReturn.toFixed(2));
        setRemainAmount(+(invoice?.total - returns).toFixed(2));
      }
    } else if (returns > 0) {
      setReturnAmount(+returns.toFixed(2));
      setRemainAmount(+(invoice?.total - returns).toFixed(2));
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

  useEffect(() => {
    if (returnAmount > 0) {
      setAfterReturnPaid(invoice?.paid - returnAmount);
    } else {
      setAfterReturnPaid(invoice?.paid);
    }
  }, [invoice, returnAmount]);

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

  const productHandler = (e: any, index: number) => {
    const { name, value } = e.target;
    if (name === "quantity") {
      allProducts[index].quantity = +value;
      allProducts[index].total =
        allProducts[index].quantity * allProducts[index].rate;
      allProducts[index].profit = +(
        allProducts[index].total -
        allProducts[index]?.purchase * allProducts[index]?.quantity
      );
      setAllProducts(allProducts);
      setReduce(!reduce);
    }
    if (name === "total") {
      allProducts[index].total = +value;
      allProducts[index].profit = +(
        allProducts[index].total -
        allProducts[index]?.purchase * allProducts[index]?.quantity
      );
      setAllProducts(allProducts);
      setReduce(!reduce);
    }
  };

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
      due: +afterReturnDue?.toFixed(2) || 0,
      paid: afterReturnPaid || 0,
      profit: +totalProfit.toFixed(2) || 0,
      total: afterDiscount || 0,
      products: allProducts,
      removed: removedProducts,
    };

    try {
      await updateInvoice({
        id: params?.id,
        body: data,
      }).unwrap();
      toast.success("Update invoice successfully");
      if (allProducts?.length <= 0) {
        navigate(`/abacusdb/invoices`, { replace: true });
      } else {
        navigate(0);
      }
    } catch (err: any) {
      toast.error(`${err.data?.message}`);
    }
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
                  <MdOutlineCancel className={`text-xl text-primary`} />
                ) : (
                  <FaEdit className={`text-xl text-primary`} />
                )}
              </span>
            </div>
          }
          className="dark:bg-bg_dark bg-white text-mirage dark:text-white !border-secondary border-2"
        >
          {/* create invoice */}
          <div className="dark:bg-bg_dark bg-white text-mirage dark:text-white rounded-md">
            {/* store info */}
            <div className="store_info">
              <img
                src={text_logo}
                alt="User Cover"
                className="w-auto h-[2rem] md:h-[4rem] mx-auto"
              />
              <h4 className="text-center text-[.6rem] md:text-[1rem]">
                121/9, Dowlatdiar, Chuadanga.
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
            <div className="md:w-64 flex items-center justify-center mx-auto">
              <div className="">
                <Select
                  disabled={!isEdit}
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
            <div className="py-4 border-t-2 border-secondary mt-4">
              <Row className="!mx-0" gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
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
                    paddingRight: "0px",
                    width: "100%",
                  }}
                >
                  <span className="tracking-wide flex justify-between">
                    <span className="!font-bold">Balance:</span>
                    <span
                      className={`italic ${
                        selectdUser?.balance > 0 && "!font-bold"
                      }`}
                    >
                      {selectdUser?.balance}
                    </span>
                  </span>
                  <span className="tracking-wide flex justify-between">
                    <span className="!font-bold">Due:</span>
                    <span
                      className={`italic ${
                        selectdUser?.due > 0 && "text-[#D31818] !font-bold"
                      }`}
                    >
                      {selectdUser?.due}
                    </span>
                  </span>
                  <span className="tracking-wide flex justify-end border-t">
                    <span
                      className={`italic !font-bold ${
                        selectdUser?.balance - selectdUser?.due > 0
                          ? "text-primary"
                          : "text-[#D31818]"
                      }`}
                    >
                      {+(selectdUser?.balance - selectdUser?.due).toFixed(2) ||
                        0}
                    </span>
                  </span>
                </Col>
              </Row>
            </div>

            {/* products info */}
            <div className="">
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
                    disabled={!isEdit}
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
                    paddingRight: "0px",
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
                    disabled={!isEdit}
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
                      <th className="text-left p-2 w-[35%]">Particulers</th>
                      <th className="text-right p-2 w-[20%]">Quantity</th>
                      <th className="text-right p-2 w-[15%]">Rate</th>
                      <th className="text-right p-2 w-[10%]">Total (৳)</th>
                      {showProfit && (
                        <th className="text-right p-2 w-[10%]">Profit (৳)</th>
                      )}
                      {isEdit && (
                        <th className="text-center p-2 w-[10%]">Action</th>
                      )}
                    </tr>
                  </thead>
                  <tbody>
                    {allProducts?.map((product: any, i: number) => {
                      return (
                        <tr key={i} className="hover:bg-secondary duration-300">
                          <td className="p-2 text-start flex justify-between items-center">
                            <span> {product?.product}</span>{" "}
                            <span>{`${code.slice(0, 2)}${
                              product?.purchase
                            }${code.slice(2)}`}</span>
                          </td>
                          <td className="p-2 text-right">
                            <Input
                              disabled={true}
                              value={product?.quantity}
                              className="bg-white text-mirage dark:bg-bg_dark dark:text-white focus-within:!border-primary hover:!border-primary disabled:text-mirage dark:disabled:text-white !placeholder:text-[#ddddddbb] w-20 disabled:border-0"
                              name="quantity"
                              step={0.01}
                              type="number"
                              variant={"filled"}
                              min={0}
                              size="small"
                              placeholder="Quantity"
                              onChange={(e) => productHandler(e, i)}
                            />{" "}
                            ({product?.unit})
                          </td>
                          <td className="p-2 text-right">
                            {product?.rate} (৳ /{product?.unit})
                          </td>
                          <td className="p-2 text-right">
                            <Input
                              disabled={true}
                              value={+product?.total.toFixed(2)}
                              className="bg-white text-mirage dark:bg-bg_dark dark:text-white focus-within:!border-primary hover:!border-primary disabled:text-mirage dark:disabled:text-white !placeholder:text-[#ddddddbb] w-20 disabled:border-0"
                              name="total"
                              step={0.01}
                              type="number"
                              variant={"filled"}
                              max={(product?.rate * product?.quantity).toFixed(
                                2
                              )}
                              min={product?.purchase * product?.quantity}
                              size="small"
                              placeholder="Total"
                              onChange={(e) => productHandler(e, i)}
                            />
                          </td>
                          {showProfit && (
                            <td className="p-2 text-right">
                              {product?.profit.toFixed(2)}
                            </td>
                          )}
                          {isEdit && (
                            <td className="p-2 flex gap-2 justify-center items-center">
                              <MdDeleteForever
                                onClick={() => removeHandler(i)}
                                size={20}
                                style={{ color: "#D92728" }}
                              />
                            </td>
                          )}
                        </tr>
                      );
                    })}
                    {showProfit && (
                      <tr className="hover:bg-secondary duration-300">
                        <td colSpan={4} className="p-2 text-right">
                          Total Profit ={" "}
                        </td>

                        <td className="p-2 text-right">
                          {+totalProfit.toFixed(2)}
                        </td>
                        {isEdit && <td className="p-2 text-right"></td>}
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
              <div className="mb-2">
                <h6 className="italic text-[#D31818]">
                  N.B: First return than do the calculation.
                </h6>
              </div>
              {/* calculation */}
              <Row
                className="!mx-0 justify-between"
                gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}
              >
                <Col
                  className="gutter-row"
                  sm={24}
                  md={13}
                  style={{
                    marginBottom: "0px",
                    paddingLeft: "0px",
                    paddingRight: "0px",
                    width: "100%",
                  }}
                >
                  <div className="mb-1">
                    <span className="text-mirage dark:text-white">Note</span>
                  </div>
                  <TextArea
                    defaultValue={invoice?.note}
                    disabled={!isEdit}
                    className="bg-white text-mirage dark:bg-bg_dark dark:text-white focus-within:!border-primary hover:!border-primary disabled:text-mirage dark:disabled:text-white placeholder:text-[#ddddddbb]"
                    name="note"
                    rows={4}
                    onChange={invoiceInputHandler}
                    placeholder="Type note"
                  />
                </Col>
                <Col
                  className="gutter-row mt-6"
                  sm={24}
                  md={5}
                  style={{
                    marginBottom: "0px",
                    paddingLeft: "0px",
                    paddingRight: "0px",
                    width: "100%",
                  }}
                >
                  <div className="p-4 border-2 border-primary rounded-md">
                    <span className="tracking-wide flex justify-between">
                      <span className="!font-bold">Total:</span>
                      {/* <span className={`italic `}>{invoice?.total || 0}</span> */}
                      <span className={`italic `}>{remainAmount || 0}</span>
                    </span>
                    <span className="tracking-wide flex justify-between border-b">
                      <span className="!font-bold">Paid:</span>
                      {/* <span className={`italic `}> {invoice?.paid || 0}</span> */}
                      <Input
                        value={afterReturnPaid}
                        className="bg-white text-mirage dark:bg-bg_dark dark:text-white focus-within:!border-primary hover:!border-primary disabled:text-mirage dark:disabled:text-white !placeholder:text-[#ddddddbb] w-20 relative left-[15px]"
                        name="paid"
                        step={0.01}
                        type="number"
                        variant={"filled"}
                        min={0}
                        max={afterDiscount.toFixed(2)}
                        size="small"
                        defaultValue={0}
                        placeholder="Discount"
                        onChange={invoiceInputHandler}
                      />
                    </span>
                    <span className="tracking-wide flex justify-between">
                      <span className="!font-bold">Due:</span>
                      {/* <span
                        className={`italic ${invoice?.due > 0 && "!font-bold"}`}
                      >
                        {invoice?.due || 0}
                      </span> */}
                      <span
                        className={`italic ${
                          afterReturnDue > 0 && "text-[#D31818] !font-bold"
                        }`}
                      >
                        {+afterReturnDue?.toFixed(2) || 0}
                      </span>
                    </span>
                  </div>
                </Col>
                <Col
                  className="gutter-row mt-6"
                  sm={24}
                  md={5}
                  style={{
                    marginBottom: "15px",
                    paddingLeft: "0px",
                    paddingRight: "0px",
                    width: "100%",
                  }}
                >
                  <div className="p-4 border-2 border-primary rounded-md">
                    <span className="tracking-wide flex justify-between">
                      <span className="!font-bold">Return PP:</span>
                      <span className={`italic `}>
                        {invoice?.total - remainAmount || 0}
                      </span>
                    </span>
                    <span className="tracking-wide flex justify-between border-b">
                      <span className="!font-bold">Due:</span>
                      <span
                        className={`italic ${
                          afterReturnDue > 0 && "text-[#D31818] !font-bold"
                        }`}
                      >
                        {+afterReturnDue?.toFixed(2) || 0}
                      </span>
                      {/* <span
                        className={`italic ${invoice?.due > 0 && "!font-bold"}`}
                      >
                        {invoice?.due || 0}
                      </span> */}
                    </span>
                    <span className="tracking-wide flex justify-between">
                      <span
                        className={`italic ${
                          returnAmount > 0 && "text-[#D31818] !font-bold"
                        }`}
                      >
                        Return:
                      </span>
                      <span
                        className={`italic ${
                          returnAmount > 0 && "text-[#D31818] !font-bold"
                        }`}
                      >
                        {returnAmount || 0}
                      </span>
                    </span>
                    {/* <span className="tracking-wide flex justify-between ">
                      <span className="!font-bold">Remain:</span>
                      <span className={`italic `}>{remainAmount || 0}</span>
                    </span> */}
                  </div>
                </Col>
                {isEdit && (
                  <Button
                    className="bg-primary hover:!bg-primary text-mirage !bg-opacity-[.8] duration-300 transition-all"
                    size="middle"
                    onClick={invoiceHandler}
                    type="primary"
                    block
                  >
                    Update Invoice
                  </Button>
                )}
              </Row>
            </div>
          </div>
        </Card>
      </section>
    </div>
  );
};
