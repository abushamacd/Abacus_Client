/* eslint-disable no-extra-boolean-cast */
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
import { Button, Col, Row, Select } from "antd";
import { setView } from "../../../redux/features/siteSlice";
import Form from "../../../components/Forms/Forms";
import FormInput from "../../../components/Forms/FormInput";
import FormDatePicker from "../../../components/Forms/FormDatePicker";
import FormSelectField from "../../../components/Forms/FormSelectField";
import { SelectOptions } from "../../../types";
import { FiEdit } from "react-icons/fi";
import { MdDeleteForever } from "react-icons/md";
import { yupResolver } from "@hookform/resolvers/yup";
import { createInvoiceSchema } from "../../../schemas/store";

export const Invoice = () => {
  // Format the date to Bangladesh Standard Time (BST)
  const formattedDate = new Date().toLocaleString("en-GB", {
    timeZone: "Asia/Dhaka",
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  const role = [
    {
      label: "Owner",
      value: "Owner",
    },
    {
      label: "Manager",
      value: "Manager",
    },
    {
      label: "Staff",
      value: "Staff",
    },
    {
      label: "Retailer",
      value: "Retailer",
    },
    {
      label: "Consumer",
      value: "Consumer",
    },
  ];

  const dispatch = useAppDispatch();
  const { view } = useAppSelector((state) => state.site);

  const allProducts: any = [];

  const selectdUser: any = view?.data;

  const query: Record<string, any> = {};
  const [searchTerm, setSearchTerm] = useState<string>("Unknown");
  const debouncedTerm = useDebounced({
    searchQuery: searchTerm,
    delay: 600,
  });

  if (!!debouncedTerm) {
    query["searchTerm"] = debouncedTerm;
  }

  const { data: usersData, isLoading: staffsLoading } = useGetUsersQuery({
    ...query,
  });
  // @ts-ignore
  const allUser: any = usersData?.users;

  const users: any[] = [];
  allUser?.forEach((user: any) => {
    users?.push({ label: `${user?.name}- ${user?.address} `, value: user?.id });
  });

  useEffect(() => {
    if (searchTerm === "") {
      setSearchTerm("Unknown");
    }
  }, [searchTerm]);

  const onSearch = (value: string) => {
    setSearchTerm(value);
    dispatch(setView({ data: null, state: false }));
  };

  const onChange = (value: string) => {
    const filteredUser = allUser.filter((user: any) => user.id === value);
    dispatch(
      setView({
        data: filteredUser.length > 0 ? filteredUser?.[0] : null,
        state: filteredUser.length > 0 && true,
      })
    );
  };

  const createHandler = (data: any) => {
    const { date, name, role, ...product } = data;
    allProducts.push(product);
    console.log(date, name, role, product);
    console.log(allProducts);
  };

  const defaultValues = {
    name: selectdUser?.name || "",
    role: selectdUser?.role || "",
  };

  if (staffsLoading) {
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
          </div>
          <div className="md:w-64 flex items-center justify-center mx-auto px-4">
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
            <Form
              submitHandler={createHandler}
              resolver={yupResolver(createInvoiceSchema)}
              defaultValues={defaultValues}
            >
              <Row
                className="!mx-0 border-b-2 border-secondary mb-4 justify-between"
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
                  <FormDatePicker
                    name="date"
                    label="Invoice Date"
                    size="middle"
                    required
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
                  <FormSelectField
                    name="role"
                    label="Customer Type"
                    options={role as SelectOptions[]}
                    size="middle"
                    placeholder="Select unit"
                    required
                  />
                </Col>
              </Row>
              <div className="overflow-x-auto">
                <table className="md:min-w-full w-[800px] table-auto border-separate">
                  <thead>
                    <tr className="bg-secondary">
                      <th className="text-left p-2 w-[40%]">Particulers</th>
                      <th className="text-right p-2 w-[20%]">Quantity</th>
                      <th className="text-right p-2 w-[10%]">Amount</th>
                      <th className="text-right p-2 w-[10%]">Total</th>
                      <th className="text-right p-2 w-[10%]">Profit</th>
                      <th className="text-center p-2 w-[10%]">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="hover:bg-secondary duration-300">
                      <td className="p-2 text-start">Product Name</td>
                      <td className="p-2 text-right">2 (KG)</td>
                      <td className="p-2 text-right">price per unit</td>
                      <td className="p-2 text-right">total price</td>
                      <td className="p-2 text-right">profit</td>
                      <td className="p-2 flex gap-2 justify-center items-center">
                        <FiEdit
                          style={{ color: "#008A3F" }}
                          // onClick={() => openEdit(VehicleStatement)}
                          size={20}
                        />
                        <MdDeleteForever
                          // onClick={() => deleteHandler(VehicleStatement?.id)}
                          size={20}
                          style={{ color: "#D92728" }}
                        />
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
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
                  <FormSelectField
                    name="product"
                    label="Product"
                    options={
                      [{ label: "Shama", value: "shama" }] as SelectOptions[]
                    }
                    size="middle"
                    placeholder="Select Product"
                  />
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
                  <FormInput
                    suffix={"৳"}
                    name="quantity"
                    label="Quantity"
                    type="number"
                    size="middle"
                    placeholder="Quantity"
                  />
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
                  <FormInput
                    suffix={"৳"}
                    name="amount"
                    label="Amount"
                    type="number"
                    size="middle"
                    placeholder="Amount"
                  />
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
                  <FormInput
                    suffix={"৳"}
                    name="total"
                    label="Total"
                    type="number"
                    size="middle"
                    placeholder="Total"
                  />
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
                  <FormInput
                    suffix={"৳"}
                    name="profit"
                    label="Profit"
                    type="number"
                    size="middle"
                    placeholder="Profit"
                  />
                </Col>
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
                    htmlType="submit"
                    type="primary"
                    // block
                  >
                    + Add
                  </Button>
                </Col>
              </Row>
              <Row justify="start" align="middle">
                <Button
                  className="bg-primary hover:!bg-primary text-mirage !bg-opacity-[.8] duration-300 transition-all mt-4"
                  size="middle"
                  // htmlType="submit"
                  type="primary"
                  // block
                >
                  Create
                </Button>
              </Row>
            </Form>
          </div>
        </div>
      </section>
    </div>
  );
};
