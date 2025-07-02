/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable no-extra-boolean-cast */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useNavigate, useParams } from "react-router-dom";
import Loading from "../../../components/ui/Loading";
import {
  useGetUserQuery,
  useUpdateUserMutation,
} from "../../../redux/api/userApi";
import text_logo from "../../../assets/text_logo.png";
import { Button, Card, Col, Input, Row } from "antd";
import Form from "../../../components/Forms/Forms";
import FormInput from "../../../components/Forms/FormInput";
import { SubmitHandler } from "react-hook-form";
import { FaEdit, FaRegEye } from "react-icons/fa";
import { useState } from "react";
import { MdOutlineCancel } from "react-icons/md";
import { toast } from "react-toastify";
import { yupResolver } from "@hookform/resolvers/yup";
import { updateUserSchema } from "../../../schemas/user";
import Title from "antd/es/typography/Title";
import { ReloadOutlined } from "@ant-design/icons";
import { useDebounced } from "../../../redux/hooks";
import { useGetInvoicesQuery } from "../../../redux/api/invoice";
import DataTable from "../../../components/ui/DataTable";

type FormValues = {
  name: string;
  phone: string;
  email: string | null;
  address: string;
};

const db_url = import.meta.env.VITE_REDIRECT_URL;

export const UserDetails = () => {
  const params = useParams();
  const navigate = useNavigate();
  const [isEdit, setIsEdit] = useState(true);
  const [updateUser] = useUpdateUserMutation();

  const { data: userData, isLoading: loading } = useGetUserQuery(params?.id);
  const user: any = userData;

  const query: Record<string, any> = {};
  const [page, setPage] = useState<number>(1);
  const [size, setSize] = useState<number>(5);
  const [sortBy, setSortBy] = useState<string>("due");
  const [sortOrder, setSortOrder] = useState<string>("desc");
  const [searchTerm, setSearchTerm] = useState<string>("");

  query["limit"] = size;
  query["page"] = page;
  query["sortBy"] = sortBy;
  query["sortOrder"] = sortOrder;
  query["customerId"] = params?.id;

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
  const invoices: any = invoicesData?.invoices;
  // @ts-ignore
  const meta = invoicesData?.meta;

  const defaultValues = {
    name: user?.name || "",
    phone: user?.phone || "",
    email: user?.email || null,
    address: user?.address || "",
    balance: user?.balance || 0,
    due: user?.due || 0,
  };

  const updateProfile: SubmitHandler<FormValues> = async (data: any) => {
    try {
      await updateUser({ id: params?.id, body: data }).unwrap();
      toast("Update user successfully!");
    } catch (err: any) {
      toast.error(`${err.data?.message}`);
    }
  };

  const columns = [
    {
      title: "Date",
      dataIndex: "date",
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
      title: "Create / Update By",
      dataIndex: "updateBy",
    },
    {
      title: "Action",
      render: function (invoice: any) {
        return (
          <div className="flex gap-2">
            <FaRegEye
              style={{ color: "#008A3F" }}
              onClick={() => openView(invoice?.id)}
              size={22}
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

  const resetFilters = () => {
    setSortBy("");
    setSortOrder("");
    setSearchTerm("");
  };

  const openView = (id: string) => {
    navigate(`/${db_url}/invoices/${id}`, { replace: true });
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <>
      <section className="dark:bg-bg_dark bg-white p-4 pb-0 rounded-md">
        <div className="flex flex-col">
          <img
            src={text_logo}
            alt="User Cover"
            className="w-full xl:h-[20rem] lg:h-[18rem] md:h-[12rem] border-2 border-primary rounded-md p-2"
          />

          <div className="sm:w-[80%] xs:w-[90%] mx-auto flex ">
            <div className="">
              <section>
                <div className="lg:w-[12rem] lg:h-[12rem] md:w-[10rem] md:h-[10rem] w-[4rem] h-[4rem] outline outline-2 outline-offset-2 outline-primary relative lg:bottom-[3rem] md:bottom-[2rem] bottom-[.5rem] rounded-md flex justify-center items-center">
                  <img
                    src={user?.url}
                    alt="User Profile"
                    className="w-full h-full object-cover rounded-md"
                  />
                </div>
              </section>
            </div>

            <div className="">
              <h1 className="w-full md:px-4 md:pt-3  px-2  text-gray-800 dark:text-white lg:text-4xl md:text-3xl ao">
                {user?.name}
              </h1>
              <p className="w-full md:px-4 md:pt-3  px-2  text-gray-800 dark:text-white lg:text-base md:text-xl text-xs">
                {user?.role}
              </p>
            </div>
          </div>
        </div>
      </section>
      {/* datails */}
      <div className="profile_update my-4">
        <Card
          title={
            <div className="flex gap-2 items-center">
              <span className="">Personal Information</span>
              <span onClick={() => setIsEdit(!isEdit)} className="">
                {isEdit ? (
                  <FaEdit className={`text-xl text-primary`} />
                ) : (
                  <MdOutlineCancel className={`text-xl text-primary`} />
                )}
              </span>
            </div>
          }
          className="dark:bg-bg_dark bg-white text-mirage dark:text-white !border-secondary border-2"
        >
          <Form
            submitHandler={updateProfile}
            resolver={yupResolver(updateUserSchema)}
            defaultValues={defaultValues}
          >
            <Row className="!mx-0" gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
              <Col
                className="gutter-row"
                sm={24}
                md={8}
                style={{
                  marginBottom: "15px",
                  paddingLeft: "0px",
                }}
              >
                <FormInput
                  name="name"
                  type="text"
                  size="middle"
                  label="Name"
                  disabled={isEdit}
                />
              </Col>
              <Col
                className="gutter-row"
                sm={24}
                md={8}
                style={{
                  marginBottom: "15px",
                  paddingLeft: "0px",
                }}
              >
                <FormInput
                  name="phone"
                  type="phone"
                  size="middle"
                  label="Phone"
                  disabled={isEdit}
                />
              </Col>
              <Col
                className="gutter-row"
                sm={24}
                md={8}
                style={{
                  marginBottom: "15px",
                  paddingLeft: "0px",
                }}
              >
                <FormInput
                  name="email"
                  type="email"
                  size="middle"
                  label="Email"
                  disabled={isEdit}
                />
              </Col>
              <Col
                className="gutter-row"
                sm={24}
                md={8}
                style={{
                  marginBottom: "15px",
                  paddingLeft: "0px",
                }}
              >
                <FormInput
                  name="address"
                  type="text"
                  size="middle"
                  label="Address"
                  disabled={isEdit}
                />
              </Col>
              <Col
                className="gutter-row"
                sm={24}
                md={8}
                style={{
                  marginBottom: "15px",
                  paddingLeft: "0px",
                }}
              >
                <FormInput
                  name="balance"
                  type="text"
                  size="middle"
                  label="Balance"
                  disabled={isEdit}
                />
              </Col>
              <Col
                className="gutter-row"
                sm={24}
                md={8}
                style={{
                  marginBottom: "15px",
                  paddingLeft: "0px",
                }}
              >
                <FormInput
                  name="due"
                  type="text"
                  size="middle"
                  label="Due"
                  disabled={isEdit}
                />
              </Col>
            </Row>
            <Row justify="start" align="middle">
              {!isEdit && (
                <Button
                  className="bg-primary hover:!bg-primary text-mirage !bg-opacity-[.8] duration-300 transition-all"
                  size="middle"
                  htmlType="submit"
                  type="primary"
                  // block
                >
                  Update Profile
                </Button>
              )}
            </Row>
          </Form>
        </Card>
      </div>
      {/* all invoices */}
      <div className="dark:bg-bg_dark bg-white p-4 rounded-md mt-5">
        <div className="">
          <div className="w-full dark:bg-bg_dark bg-white py-5 rounded-md md:mb-0 mb-5 flex md:flex-row flex-col justify-between md:items-center items-start">
            <Title
              className="text-mirage dark:text-white !font-medium"
              level={4}
            >
              All Invoices ({meta?.total || 0})
            </Title>
            <div className="flex items-center">
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
            dataSource={invoices}
            pageSize={size}
            totalPages={meta?.total}
            showSizeChanger={true}
            onPaginationChange={onPaginationChange}
            onTableChange={onTableChange}
            showPagination={true}
          />
        </div>
      </div>
    </>
  );
};
