/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import text_logo from "../../../assets/text_logo.png";
import Loading from "../../../components/ui/Loading";
import { useGetUsersQuery } from "../../../redux/api/userApi";
import {
  useAppDispatch,
  useAppSelector,
  useDebounced,
} from "../../../redux/hooks";
import {
  Button,
  Checkbox,
  Col,
  DatePicker,
  DatePickerProps,
  Input,
  Row,
  Select,
} from "antd";
import { setView } from "../../../redux/features/siteSlice";
import { SelectOptions } from "../../../types";
import { MdDeleteForever } from "react-icons/md";
import { useGetProductsQuery } from "../../../redux/api/product";
import dayjs from "dayjs";
import TextArea from "antd/es/input/TextArea";
import { useCreateInvoiceMutation } from "../../../redux/api/invoice";
import { toast } from "react-toastify";

export const Invoice = () => {
  // Date formatting
  const formattedDate = new Date().toLocaleString("en-GB", {
    timeZone: "Asia/Dhaka",
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  // Roles
  const roles = [
    { label: "Owner", value: "Owner" },
    { label: "Manager", value: "Manager" },
    { label: "Staff", value: "Staff" },
    { label: "Retailer", value: "Retailer" },
    { label: "Consumer", value: "Consumer" },
  ];

  // State management
  const [inputData, setInputData] = useState({ quantity: 0 });
  const [selectedProduct, setSelectedProduct] = useState<any[]>([]);
  const [role, setRole] = useState("");
  const [invoiceDate, setInvoiceDate] = useState(
    dayjs(Date.now()).format("DD/MM/YYYY")
  );
  const [note, setNote] = useState("");
  const [showProfit, setShowProfit] = useState(false);
  const [errMessage, setErrMessage] = useState("");
  const [discount, setDiscount] = useState<number>(0);
  const [paid, setPaid] = useState<number>(0);
  const [allProducts, setAllProducts] = useState<any[]>([]);
  const [rate, setRate] = useState(0);
  const [searchTerm, setSearchTerm] = useState<string>("Unknown");
  const [createInvoice] = useCreateInvoiceMutation();

  const dispatch = useAppDispatch();
  const { view } = useAppSelector((state) => state.site);
  const selectdUser: any = view?.data;

  const totalProfit = allProducts.reduce((acc, item) => acc + item.profit, 0);
  const totalAmount = allProducts.reduce((acc, item) => acc + item.total, 0);

  const afterDiscount = +(totalAmount - discount).toFixed(2);
  const due = +(afterDiscount - paid).toFixed(2);

  const defaultValues: {
    unit: any;
    purchase: any;
    product: any;
    rate: number;
    quantity: number;
    total: number;
    profit: number;
  } = {
    unit: selectedProduct[0]?.unit?.name,
    purchase: selectedProduct[0]?.purchase,
    product: selectedProduct[0]?.name,
    rate: rate || 0,
    quantity: +inputData.quantity,
    total: +(+inputData.quantity * rate).toFixed(2),
    profit: +(
      +inputData.quantity * rate -
      selectedProduct[0]?.purchase * +inputData.quantity
    ).toFixed(2),
  };

  const debouncedTerm = useDebounced({
    searchQuery: searchTerm,
    delay: 600,
  });

  // Customer query
  const query: Record<string, any> = debouncedTerm
    ? { searchTerm: debouncedTerm }
    : {};

  const { data: usersData, isLoading: staffsLoading } = useGetUsersQuery(query);
  // @ts-ignore
  const allUser: any = usersData?.users;

  const users = allUser?.map((user: any) => ({
    label: `${user?.name} - ${user?.address}`,
    value: user?.id,
  }));

  // Product query
  const { data: productsData, isLoading: productsLoading } =
    useGetProductsQuery({});
  // @ts-ignore
  const allProduct: any = productsData?.products;

  const products = allProduct?.map((product: any) => ({
    label: (
      <span
        className={product?.quantity <= 0 ? "text-[#D31818] !font-bold" : ""}
      >
        {product?.name} ({product?.quantity} {product?.unit?.name})
      </span>
    ),
    value: product?.name,
  }));

  // Handlers
  const onSearch = (value: string) => {
    setSearchTerm(value);
    dispatch(setView({ data: null, state: false }));
    setErrMessage("");
  };

  const onChange = (value: string) => {
    const filteredUser = allUser.filter((user: any) => user.id === value);
    dispatch(
      setView({
        data: filteredUser.length > 0 ? filteredUser[0] : null,
        state: filteredUser.length > 0,
      })
    );
    setRole(filteredUser?.role);
    setErrMessage("");
  };

  const onProductChange = (value: string) => {
    const filteredProduct = allProduct.filter(
      (product: any) => product.name === value
    );
    setSelectedProduct(filteredProduct);
    setErrMessage("");
  };

  const onRoleChange = (value: string) => setRole(value);

  const onDateChange: DatePickerProps["onChange"] = (
    _date: any,
    dateString: any
  ) => {
    setInvoiceDate(dateString);
  };

  useEffect(() => {
    if (searchTerm === "") {
      setSearchTerm("Unknown");
    }
  }, [searchTerm]);

  const inputHandle = (e: any) => {
    if (e.target.name === "rate") {
      setRate(+e.target.value);
    } else {
      setInputData({ ...inputData, [e.target.name]: e.target.value });
    }
    setErrMessage("");
  };

  const invoiceInputHandler = (e: any) => {
    const { name, value } = e.target;
    if (name === "discount") setDiscount(+value);
    if (name === "paid") setPaid(+value);
    if (name === "note") setNote(value);
  };

  const insertProduct = (e: any, defaultValues: any) => {
    e.preventDefault();
    if (!defaultValues.product) {
      setErrMessage("Please select a product");
      return;
    }
    if (defaultValues.quantity === 0) {
      setErrMessage("Please enter quantity");
      return;
    }
    if (defaultValues.rate < selectedProduct[0]?.purchase) {
      setErrMessage("Rate is lower then purchase");
      return;
    }
    setAllProducts((prevProducts) => [...prevProducts, defaultValues]);
    setSelectedProduct([]);
    setInputData({ quantity: 0 });
  };

  const deleteHandler = (index: number) => {
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
      due: due,
      profit: totalProfit,
      total: afterDiscount,
      discount: discount,
      products: allProducts,
    };

    try {
      await createInvoice(data).unwrap();
      toast.success("Create invoice successfully");
    } catch (err: any) {
      toast.error(`${err.data?.message}`);
    }
  };

  // Rate setting based on role
  useEffect(() => {
    if (role === "Owner") {
      setRate(selectedProduct[0]?.purchase || 0);
    } else if (["Manager", "Staff", "Retailer"].includes(role)) {
      setRate(selectedProduct[0]?.retail || 0);
    } else {
      setRate(selectedProduct[0]?.sell || 0);
    }
  }, [role, selectedProduct, selectdUser]);

  useEffect(() => {
    setRole(selectdUser?.role);
  }, [selectdUser]);

  if (staffsLoading || productsLoading) {
    return <Loading />;
  }

  return (
    <div className="">
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
              {formattedDate}
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
          <div className="md:w-64 flex items-center justify-center mx-auto px-4">
            <div className="">
              <Select
                allowClear
                className="w-full"
                showSearch
                placeholder="Search customer"
                optionFilterProp="label"
                onChange={onChange}
                onSearch={onSearch}
                options={users}
              />
              {errMessage?.includes("customer") && (
                <small style={{ color: "red" }}>{errMessage}</small>
              )}
            </div>
          </div>
          {/* user info */}
          <div className="py-4 border-t-2 border-secondary mt-4 mx-4">
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
                }}
              >
                <span className="tracking-wide block">
                  <span className="!font-bold">Due:</span>
                  <span
                    className={`italic ${
                      selectdUser?.previous > 0 && "text-[#D31818] !font-bold"
                    }`}
                  >
                    {selectdUser?.previous}
                  </span>
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
                  name="invoiceDate"
                  className="bg-white text-mirage dark:bg-bg_dark dark:text-white focus-within:!border-primary hover:!border-primary disabled:text-mirage dark:disabled:text-white"
                  defaultValue={dayjs(Date.now())}
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
                      <tr key={i} className="hover:bg-secondary duration-300">
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
                          <td className="p-2 text-right">{product?.profit}</td>
                        )}
                        <td className="p-2 flex gap-2 justify-center items-center">
                          <MdDeleteForever
                            onClick={() => deleteHandler(i)}
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
                <div className="flex justify-between items-center px-4">
                  <span className="subtotal">Subtotal: </span>
                  <span className="subtotal">{totalAmount}</span>
                </div>
                <div className="flex justify-between items-center px-4">
                  <span className="subtotal">Discount: </span>
                  <Input
                    className="bg-white text-mirage dark:bg-bg_dark dark:text-white focus-within:!border-primary hover:!border-primary disabled:text-mirage dark:disabled:text-white !placeholder:text-[#ddddddbb] w-16 relative left-[15px]"
                    name="discount"
                    step={1}
                    type="number"
                    variant={"filled"}
                    max={totalProfit}
                    min={0}
                    size="small"
                    placeholder="Discount"
                    onChange={invoiceInputHandler}
                  />
                </div>
                <hr className="mx-4 my-2" />
                <div className="flex justify-between items-center px-4 text-primary">
                  <span className="subtotal !font-bold text-lg">Total: </span>
                  <span className="subtotal !font-bold text-lg">
                    {afterDiscount || 0}
                  </span>
                </div>
                <div className="flex justify-between items-center px-4">
                  <span className="subtotal">Paid: </span>
                  <Input
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
                    {due || 0}
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
                Create Invoice
              </Button>
            </Row>
            {/* Product input */}
            <Row
              className="!mx-0 border-b-2 border-secondary mb-4"
              gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}
            >
              <Col
                className="gutter-row"
                sm={24}
                md={10}
                style={{
                  marginBottom: "15px",
                  paddingLeft: "0px",
                  width: "100%",
                }}
              >
                <div className="mb-1">
                  <span className="text-mirage dark:text-white">
                    Select Product
                  </span>
                </div>
                <Select
                  value={selectedProduct[0]?.name}
                  suffixIcon={`ADS-${
                    selectedProduct[0]?.purchase > 0
                      ? selectedProduct[0]?.purchase
                      : 0
                  }T`}
                  // allowClear
                  className="w-full"
                  showSearch
                  placeholder="Search Product"
                  optionFilterProp="label"
                  onChange={onProductChange}
                  options={products as SelectOptions[]}
                />
                {errMessage?.includes("product") && (
                  <small style={{ color: "red" }}>{errMessage}</small>
                )}
              </Col>
              <Col
                className="gutter-row"
                sm={24}
                md={showProfit ? 3 : 6}
                style={{
                  marginBottom: "15px",
                  paddingLeft: "0px",
                  width: "100%",
                }}
              >
                <div className="mb-1">
                  <span className="text-mirage dark:text-white">Quantity</span>
                </div>
                <Input
                  value={inputData.quantity}
                  className="bg-white text-mirage dark:bg-bg_dark dark:text-white focus-within:!border-primary hover:!border-primary disabled:text-mirage dark:disabled:text-white !placeholder:text-[#ddddddbb]"
                  name="quantity"
                  suffix={selectedProduct[0]?.unit?.name}
                  step={0.01}
                  type="number"
                  min={0}
                  size="middle"
                  placeholder="Quantity"
                  onChange={inputHandle}
                />
                {errMessage?.includes("quantity") && (
                  <small style={{ color: "red" }}>{errMessage}</small>
                )}
              </Col>
              <Col
                className="gutter-row"
                sm={24}
                md={3}
                style={{
                  marginBottom: "15px",
                  paddingLeft: "0px",
                  width: "100%",
                }}
              >
                <div className="mb-1">
                  <span className="text-mirage dark:text-white">Rate</span>
                </div>
                <Input
                  // disabled
                  value={rate}
                  className="bg-white text-mirage dark:bg-bg_dark dark:text-white focus-within:!border-primary hover:!border-primary disabled:text-mirage dark:disabled:text-white !placeholder:text-[#ddddddbb]"
                  name="rate"
                  suffix={`৳ / ${selectedProduct[0]?.unit?.name || ""}`}
                  step={0.1}
                  type="number"
                  min={selectedProduct[0]?.purchase}
                  size="middle"
                  placeholder="Product rate"
                  onChange={inputHandle}
                />
                {errMessage?.includes("Rate") && (
                  <small style={{ color: "red" }}>{errMessage}</small>
                )}
              </Col>
              <Col
                className="gutter-row"
                sm={24}
                md={3}
                style={{
                  marginBottom: "15px",
                  paddingLeft: "0px",
                  width: "100%",
                }}
              >
                <div className="mb-1">
                  <span className="text-mirage dark:text-white">Total</span>
                </div>
                <Input
                  disabled
                  value={defaultValues?.total}
                  className="bg-white text-mirage dark:bg-bg_dark dark:text-white focus-within:!border-primary hover:!border-primary disabled:text-mirage dark:disabled:text-white !placeholder:text-[#ddddddbb]"
                  name="total"
                  suffix={"৳"}
                  step={0.01}
                  type="number"
                  min={0}
                  size="middle"
                  placeholder="Total"
                  onChange={inputHandle}
                />
              </Col>
              {showProfit && (
                <Col
                  className="gutter-row"
                  sm={24}
                  md={3}
                  style={{
                    marginBottom: "15px",
                    paddingLeft: "0px",
                    width: "100%",
                  }}
                >
                  <div className="mb-1">
                    <span className="text-mirage dark:text-white">Profit</span>
                  </div>
                  <Input
                    disabled
                    value={defaultValues?.profit}
                    className="bg-white text-mirage dark:bg-bg_dark dark:text-white focus-within:!border-primary hover:!border-primary disabled:text-mirage dark:disabled:text-white !placeholder:text-[#ddddddbb]"
                    name="total"
                    suffix={"৳"}
                    step={0.01}
                    type="number"
                    min={0}
                    size="middle"
                    placeholder="Total"
                    onChange={inputHandle}
                  />
                </Col>
              )}

              <Col
                className="gutter-row flex justify-center items-center"
                sm={24}
                md={2}
                style={{
                  marginBottom: "15px",
                  paddingLeft: "0px",
                  width: "100%",
                }}
              >
                <Button
                  className="bg-primary hover:!bg-primary text-mirage !bg-opacity-[.8] duration-300 transition-all mt-5"
                  size="small"
                  onClick={(e) => insertProduct(e, defaultValues)}
                  type="primary"
                  // block
                >
                  + Add
                </Button>
              </Col>
            </Row>
          </div>
        </div>
      </section>
    </div>
  );
};
