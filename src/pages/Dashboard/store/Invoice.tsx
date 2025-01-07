/* eslint-disable no-extra-boolean-cast */
/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import text_logo from "../../../assets/text_logo.png";
import Loading from "../../../components/ui/Loading";
import { useGetUsersQuery } from "../../../redux/api/userApi";
import { useDebounced } from "../../../redux/hooks";
import {
  Badge,
  Button,
  Checkbox,
  Col,
  DatePicker,
  DatePickerProps,
  Input,
  Row,
  Select,
} from "antd";
import { SelectOptions } from "../../../types";
import { MdDeleteForever } from "react-icons/md";
import { useGetProductsQuery } from "../../../redux/api/product";
import dayjs from "dayjs";
import TextArea from "antd/es/input/TextArea";
import {
  useCreateInvoiceMutation,
  useDeleteInvoiceMutation,
  useDeleteInvoicesMutation,
  useGetInvoicesQuery,
} from "../../../redux/api/invoice";
import { toast } from "react-toastify";
import { FaRegEye } from "react-icons/fa";
import Title from "antd/es/typography/Title";
import { ReloadOutlined } from "@ant-design/icons";
import DataTable from "../../../components/ui/DataTable";
import { useNavigate } from "react-router-dom";
import { Modal } from "antd";
import Form from "./../../../components/Forms/Forms";
import { yupResolver } from "@hookform/resolvers/yup";
import { addUserSchema } from "../../../schemas/user";
import FormInput from "../../../components/Forms/FormInput";
import { SubmitHandler } from "react-hook-form";
import { useSignUpMutation } from "../../../redux/api/authApi";

type UserFormValues = {
  name: string;
  phone: string;
  address: string;
  due: number;
  balance: number;
};

export const Invoice = () => {
  const navigate = useNavigate();
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
  const [selectedIds, setSelectedIds] = useState<React.Key[]>([]);
  const [role, setRole] = useState("");
  const [isAdd, setIsAdd] = useState(false);
  const [invoiceDate, setInvoiceDate] = useState(
    dayjs(Date.now()).format("DD/MM/YYYY")
  );
  const [note, setNote] = useState("");
  const [reduce, setReduce] = useState(false);
  const [showProfit, setShowProfit] = useState(false);
  const [fullPaid, setFullPaid] = useState(false);
  const [errMessage, setErrMessage] = useState("");
  const [selectdUser, setSelectdUser] = useState<any>(null);
  const [paid, setPaid] = useState<number>(0);
  const [allProducts, setAllProducts] = useState<any[]>([]);
  const [rate, setRate] = useState(0);
  const [customerSearchTerm, setCustomerSearchTerm] =
    useState<string>("Unknown");
  const [createInvoice] = useCreateInvoiceMutation();
  const [deleteInvoices] = useDeleteInvoicesMutation();
  const [signUp] = useSignUpMutation();

  const totalProfit = allProducts.reduce((acc, item) => acc + item.profit, 0);
  const totalAmount = allProducts.reduce((acc, item) => acc + item.total, 0);

  const afterPaid = +totalAmount.toFixed(2);
  const due = +(afterPaid - paid).toFixed(2);

  const productValues: {
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

  const [deleteInvoice] = useDeleteInvoiceMutation();

  const customerDebouncedTerm = useDebounced({
    searchQuery: customerSearchTerm,
    delay: 600,
  });

  // Customer query
  const customerQuery: Record<string, any> = customerDebouncedTerm
    ? { searchTerm: customerDebouncedTerm }
    : {};

  const { data: usersData, isLoading: staffsLoading } = useGetUsersQuery({
    ...customerQuery,
  });
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

  // invoice query
  const query: Record<string, any> = {};
  const [page, setPage] = useState<number>(1);
  const [size, setSize] = useState<number>(20);
  const [sortBy, setSortBy] = useState<string>("");
  const [sortOrder, setSortOrder] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState<string>("");

  query["limit"] = size;
  query["page"] = page;
  query["sortBy"] = sortBy;
  query["sortOrder"] = sortOrder;

  const debouncedTerm = useDebounced({
    searchQuery: searchTerm,
    delay: 600,
  });

  if (!!debouncedTerm) {
    query["searchTerm"] = debouncedTerm;
  }
  const { data: invoicesData, isLoading: invoicesLoading } =
    useGetInvoicesQuery({ ...query });
  // @ts-ignore
  const allInvoices: any = invoicesData?.invoices;
  // @ts-ignore
  const meta = invoicesData?.meta;

  // Handlers
  const onCustomerSearch = (value: string) => {
    setCustomerSearchTerm(value);
    setErrMessage("");
  };

  const onCustomerChange = (value: string) => {
    const filteredUser = allUser.filter((user: any) => user.id === value);
    setSelectdUser(filteredUser[0]);
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
    if (customerSearchTerm === "") {
      setCustomerSearchTerm("Unknown");
    }
  }, [customerSearchTerm]);

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
    if (name === "paid") setPaid(+value);
    if (name === "note") setNote(value);
    setErrMessage("");
  };

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

  const insertProduct = (e: any, productValues: any) => {
    e.preventDefault();
    if (!productValues.product) {
      setErrMessage("Please select a product");
      return;
    }
    if (productValues.quantity === 0) {
      setErrMessage("Please enter quantity");
      return;
    }
    if (productValues.rate < selectedProduct[0]?.purchase) {
      setErrMessage("Rate is lower then purchase");
      return;
    }
    setAllProducts((prevProducts) => [...prevProducts, productValues]);
    setSelectedProduct([]);
    setInputData({ quantity: 0 });
  };

  const removeHandler = (index: number) => {
    const updatedProducts = allProducts.filter((_, i) => i !== index);
    setAllProducts(updatedProducts);
  };

  const invoiceHandler = async () => {
    if (selectdUser === null) {
      setErrMessage("Must be select the customer");
      toast.error(`Must be select the customer`);
      return;
    }

    if (due < 0) {
      setErrMessage("Due won't be negative");
      toast.error(`Due won't be negative`);
      return;
    }

    const data = {
      customerId: selectdUser?.id,
      customerName: selectdUser?.name,
      date: invoiceDate,
      note: note,
      total: afterPaid || 0,
      paid: paid || 0,
      due: due || 0,
      profit: totalProfit || 0,
      products: allProducts,
    };

    try {
      await createInvoice(data).unwrap();
      toast.success("Create invoice successfully");
      setSelectdUser(null);
      setRole("");
      setAllProducts([]);
      setPaid(0);
    } catch (err: any) {
      toast.error(`${err.data?.message}`);
    }
  };

  const deleteHandler = async (id: string) => {
    try {
      await deleteInvoice(id).unwrap();
      toast("Invoice deleted successfully");
    } catch (err: any) {
      toast.error(`${err.data?.message}`);
    }
  };

  const openView = (id: string) => {
    navigate(`${id}`, { replace: true });
  };

  const addUser: SubmitHandler<UserFormValues> = async (data: {
    name: string;
    phone: string;
    address: string;
  }) => {
    try {
      await signUp(data).unwrap();
      toast.success("Add user successfully");
    } catch (err: any) {
      toast.error(`${err.data?.message}`);
    }
  };

  const columns = [
    {
      title: "Invoice No.",
      dataIndex: "invoiceNumber",
      sorter: true,
    },
    {
      title: "Date",
      dataIndex: "date",
      sorter: true,
    },
    {
      title: "Customer Name",
      dataIndex: "customerName",
      sorter: true,
    },
    {
      title: "Update By",
      dataIndex: "updateBy",
      sorter: true,
    },
    {
      title: "Total",
      dataIndex: "total",
      sorter: true,
    },
    {
      title: "Paid",
      dataIndex: "paid",
      sorter: true,
    },
    {
      title: "Due",
      render: function (invoice: any) {
        return (
          <span
            className={`${invoice?.due > 0 && "text-[#D31818] !font-bold"}`}
          >
            {invoice?.due}
          </span>
        );
      },
    },
    {
      title: "Action",
      render: function (invoice: any) {
        return (
          <div className="flex gap-2 ml-3">
            <FaRegEye
              style={{ color: "#008A3F" }}
              onClick={() => openView(invoice?.id)}
              size={22}
            />
            <MdDeleteForever
              onClick={() => deleteHandler(invoice?.id)}
              size={22}
              style={{ color: "#D92728" }}
            />
          </div>
        );
      },
    },
  ];

  const onPaginationChange = (page: number, pageSize: number) => {
    setPage(page);
    setSize(pageSize);
  };
  // @ts-ignore
  const onTableChange = (pagination: any, filter: any, sorter: any) => {
    const { order, field } = sorter;
    setSortBy(field as string);
    setSortOrder(order === "ascend" ? "asc" : "desc");
  };

  const onSelection = (ids: React.Key[]) => {
    setSelectedIds(ids);
  };

  const deletesHandler = async (data: React.Key[]) => {
    try {
      await deleteInvoices(data).unwrap();
      toast.success("Delete selected invoices");
    } catch (err: any) {
      toast.error(`${err.data?.message}`);
    }
  };

  const resetFilters = () => {
    setSortBy("");
    setSortOrder("");
    setSearchTerm("");
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

  // Role setting based on selected user
  useEffect(() => {
    setRole(selectdUser?.role);
  }, [selectdUser]);

  // Role setting based on selected user
  useEffect(() => {
    setAllProducts(allProducts);
  }, [allProducts, reduce]);

  // Role setting based on selected user
  useEffect(() => {
    if (fullPaid) {
      setPaid(afterPaid);
    } else {
      setPaid(0);
    }
  }, [afterPaid, fullPaid]);

  if (staffsLoading || productsLoading) {
    return <Loading />;
  }

  return (
    <div className="">
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
            <div className="relative">
              <Select
                allowClear
                className="w-full"
                showSearch
                placeholder="Search customer"
                optionFilterProp="label"
                onChange={onCustomerChange}
                onSearch={onCustomerSearch}
                options={users}
              />
              <div
                className="absolute md:right-[-2px] right-[0px] top-[-32px]"
                onClick={() => setIsAdd(!isAdd)}
              >
                <Badge.Ribbon
                  text="+"
                  className="cursor-pointer"
                  color="#3fb0ac"
                ></Badge.Ribbon>
              </div>
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
                    {/* {selectdUser?.balance - selectdUser?.due > 0 &&
                      +(selectdUser?.balance - selectdUser?.due).toFixed(2)} */}
                    {+(selectdUser?.balance - selectdUser?.due).toFixed(2) || 0}
                  </span>
                </span>
              </Col>
            </Row>
          </div>

          {/* products info */}
          <div className="p-4 pt-0">
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
                          <Input
                            value={product?.quantity}
                            className="bg-white text-mirage dark:bg-bg_dark dark:text-white focus-within:!border-primary hover:!border-primary disabled:text-mirage dark:disabled:text-white !placeholder:text-[#ddddddbb] w-20"
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
                            value={product?.total}
                            className="bg-white text-mirage dark:bg-bg_dark dark:text-white focus-within:!border-primary hover:!border-primary disabled:text-mirage dark:disabled:text-white !placeholder:text-[#ddddddbb] w-20"
                            name="total"
                            step={0.1}
                            type="number"
                            variant={"filled"}
                            max={product?.rate * product?.quantity}
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
                        <td className="p-2 flex gap-2 justify-center items-center">
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
                        Total Profit =
                      </td>
                      <td className="p-2 text-right">
                        {totalProfit.toFixed(2)}
                      </td>
                      <td className="p-2 text-right"></td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            {/* calculation */}
            <Row
              className="!mx-0 border-b-2 border-secondary mb-4 justify-between"
              gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}
            >
              <Col
                className="gutter-row"
                sm={24}
                md={16}
                style={{
                  marginBottom: "0px",
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
                  rows={6}
                  onChange={invoiceInputHandler}
                  placeholder="Type note"
                />
              </Col>
              <Col
                className="gutter-row mt-6 border-2 border-primary p-4 rounded-md"
                sm={24}
                md={6}
                style={{
                  marginBottom: "0px",
                  paddingLeft: "0px",
                  paddingRight: "0px",
                  width: "100%",
                }}
              >
                <div className="flex justify-between items-center px-4 text-primary">
                  <span className="total !font-bold text-lg">Total: </span>
                  <span className="total !font-bold text-lg">
                    {afterPaid || 0}
                  </span>
                </div>
                <div className="flex justify-between items-center px-4">
                  <span className="total">
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
                    step={0.01}
                    type="number"
                    variant={"filled"}
                    min={0}
                    max={afterPaid}
                    size="small"
                    defaultValue={0}
                    placeholder="Paid"
                    onChange={invoiceInputHandler}
                  />
                </div>
                <hr className="mx-4 my-2" />
                <div className={` px-4 ${due > 0 ? "text-[#D92728]" : ""}`}>
                  <span className="flex justify-between items-center">
                    <span className="subtotal !font-bold text-lg">Due: </span>
                    <span className="subtotal !font-bold text-lg">
                      {due || 0}
                    </span>
                  </span>
                  {errMessage?.includes("Due") && (
                    <small style={{ color: "red" }}>{errMessage}</small>
                  )}
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
              className="!mx-0 border-b-2 border-secondary"
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
                  allowClear
                  className="w-full"
                  showSearch
                  placeholder="Search Product"
                  optionFilterProp="value"
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
                  suffix={`৳`}
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
                  value={productValues?.total}
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
                    value={productValues?.profit}
                    className="bg-white text-mirage dark:bg-bg_dark dark:text-white focus-within:!border-primary hover:!border-primary disabled:text-mirage dark:disabled:text-white !placeholder:text-[#ddddddbb]"
                    name="profit"
                    suffix={"৳"}
                    step={0.01}
                    type="number"
                    min={0}
                    size="middle"
                    placeholder="Profit"
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
                  className="bg-primary hover:!bg-primary text-mirage !bg-opacity-[.8] duration-300 transition-all mt-0 md:mt-5"
                  size="middle"
                  onClick={(e) => insertProduct(e, productValues)}
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
      {/* all Invoice */}
      <div className="dark:bg-bg_dark bg-white p-4 rounded-md mt-5">
        <div className="">
          <div className="w-full dark:bg-bg_dark bg-white py-5 rounded-md md:mb-0 mb-5 flex md:flex-row flex-col justify-between md:items-center items-start">
            <Title
              className="text-mirage dark:text-white !font-medium"
              level={4}
            >
              All Invoices ({meta?.total})
            </Title>
            <div className="flex items-center">
              {selectedIds?.length > 0 && (
                <>
                  <MdDeleteForever
                    className=""
                    onClick={() => deletesHandler(selectedIds)}
                    size={36}
                    style={{ color: "#D92728" }}
                  />
                  <span className="mr-2 text-mirage dark:text-white text-lg">
                    ({selectedIds?.length})
                  </span>
                </>
              )}
              <Input
                type="text"
                size="middle"
                className="bg-white text-mirage placeholder:text-mirage dark:placeholder:text-white dark:bg-black dark:text-white focus-within:!border-primary hover:!border-primary"
                placeholder="Search..."
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                }}
              />
              <div>
                {(!!sortBy || !!sortOrder || !!searchTerm) && (
                  <Button
                    onClick={resetFilters}
                    className="bg-primary hover:!bg-primary text-mirage !bg-opacity-[.8] duration-300 transition-all ml-4"
                    size="middle"
                    htmlType="submit"
                    type="primary"
                    // block
                  >
                    <ReloadOutlined />
                  </Button>
                )}
              </div>
            </div>
          </div>
          <DataTable
            loading={invoicesLoading}
            columns={columns}
            dataSource={allInvoices}
            pageSize={size}
            totalPages={meta?.total}
            showSizeChanger={true}
            onPaginationChange={onPaginationChange}
            onTableChange={onTableChange}
            showPagination={true}
            isSelection={true}
            onSelection={onSelection}
          />
        </div>
      </div>
      <Modal
        title={`Add New Customer`}
        open={isAdd}
        centered
        footer={null}
        onCancel={() => setIsAdd(!isAdd)}
      >
        <Form submitHandler={addUser} resolver={yupResolver(addUserSchema)}>
          <Row className="!mx-0" gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
            <Col
              className="gutter-row"
              sm={24}
              md={8}
              style={{
                marginBottom: "15px",
                paddingLeft: "0px",
                width: "100%",
              }}
            >
              <FormInput
                name="name"
                type="text"
                size="middle"
                label="Name"
                required
              />
            </Col>
            <Col
              className="gutter-row"
              sm={24}
              md={8}
              style={{
                marginBottom: "15px",
                paddingLeft: "0px",
                width: "100%",
              }}
            >
              <FormInput
                name="phone"
                type="phone"
                size="middle"
                label="Phone"
                required
              />
            </Col>
            <Col
              className="gutter-row"
              sm={24}
              md={8}
              style={{
                marginBottom: "15px",
                paddingLeft: "0px",
                width: "100%",
              }}
            >
              <FormInput
                name="address"
                type="text"
                size="middle"
                label="Address"
                required
              />
            </Col>
            <Col
              className="gutter-row"
              sm={24}
              md={12}
              style={{
                marginBottom: "15px",
                paddingLeft: "0px",
                width: "100%",
              }}
            >
              <FormInput
                step={0.01}
                name="balance"
                type="number"
                size="middle"
                label="Balance"
              />
            </Col>
            <Col
              className="gutter-row"
              sm={24}
              md={12}
              style={{
                marginBottom: "15px",
                paddingLeft: "0px",
                width: "100%",
              }}
            >
              <FormInput
                step={0.01}
                name="due"
                type="number"
                size="middle"
                label="Due"
              />
            </Col>
          </Row>
          <Row justify="start" align="middle">
            <Button
              className="bg-primary hover:!bg-primary text-mirage !bg-opacity-[.8] duration-300 transition-all"
              size="middle"
              htmlType="submit"
              type="primary"
              // block
            >
              Add User
            </Button>
          </Row>
        </Form>
      </Modal>
    </div>
  );
};
