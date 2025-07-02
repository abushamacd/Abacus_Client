/* eslint-disable no-extra-boolean-cast */
/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-explicit-any */
import Card from "antd/es/card/Card";
import Form from "../../../components/Forms/Forms";
import FormInput from "../../../components/Forms/FormInput";
import { Button, Col, Row, Select } from "antd";
import { SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { addUserSchema } from "../../../schemas/user";
import { useSignUpMutation } from "../../../redux/api/authApi";
import { toast } from "react-toastify";
import Title from "antd/es/typography/Title";
import Input from "antd/es/input/Input";
import DataTable from "../../../components/ui/DataTable";
import {
  useDeleteUserMutation,
  useGetUsersQuery,
  useUpdateRoleMutation,
  useUpdateUserAccessMutation,
} from "../../../redux/api/userApi";
import { FaRegEye } from "react-icons/fa";
import { MdDeleteForever } from "react-icons/md";
import { ReloadOutlined } from "@ant-design/icons";
import { useDebounced } from "../../../redux/hooks";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

type UserFormValues = {
  name: string;
  phone: string;
  address: string;
  due: number;
  balance: number;
};

export const User = () => {
  const navigate = useNavigate();
  const [signUp] = useSignUpMutation();
  const [deleteUser] = useDeleteUserMutation();
  const [updateRole] = useUpdateRoleMutation();
  const [updateUserAccess] = useUpdateUserAccessMutation();

  const query: Record<string, any> = {};
  const [page, setPage] = useState<number>(1);
  const [size, setSize] = useState<number>(5);
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

  const { data, isLoading } = useGetUsersQuery({ ...query });

  // @ts-ignore
  const users: any = data?.users;
  // @ts-ignore
  const meta = data?.meta;

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      sorter: true,
    },
    {
      title: "Role",
      // dataIndex: "role",
      sorter: true,
      render: function (user: any) {
        return (
          <Select
            size="small"
            disabled={user.role === "Owner"}
            defaultValue={user?.role}
            style={{ width: 130 }}
            onChange={roleUpdate}
            options={[
              { id: user?.id, value: "Consumer", label: "Consumer" },
              { id: user?.id, value: "Retailer", label: "Retailer" },
              { id: user?.id, value: "Manager", label: "Manager" },
              { id: user?.id, value: "Owner", label: "Owner" },
            ]}
          />
        );
      },
    },
    {
      title: "Access",
      render: function (user: any) {
        return (
          <Select
            size="small"
            disabled={user.role === "Owner"}
            defaultValue={user?.hasAccess}
            style={{ width: 120 }}
            onChange={updateAccess}
            options={[
              { id: user?.id, value: true, label: "Unblock" },
              { id: user?.id, value: false, label: "Block" },
            ]}
          />
        );
      },
    },
    {
      title: "Phone",
      dataIndex: "phone",
      sorter: true,
    },
    {
      title: "Address",
      dataIndex: "address",
      sorter: true,
    },
    {
      title: "Action",
      render: function (user: any) {
        return (
          <div className="flex gap-2">
            <FaRegEye
              style={{ color: "#008A3F" }}
              onClick={() => openView(user)}
              size={22}
            />
            <MdDeleteForever
              onClick={() => deleteHandler(user?.id)}
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

  const resetFilters = () => {
    setSortBy("");
    setSortOrder("");
    setSearchTerm("");
  };

  const openView = (user: any) => {
    navigate(`${user.id}`, { replace: true });
  };

  const addUser: SubmitHandler<UserFormValues> = async (
    data: UserFormValues
  ) => {
    try {
      await signUp(data).unwrap();
      toast.success("Add user successfully");
    } catch (err: any) {
      toast.error(`${err.data?.message}`);
    }
  };

  const deleteHandler = async (id: string) => {
    try {
      await deleteUser(id).unwrap();
      toast("User deleted successfully");
    } catch (err: any) {
      toast.error(`${err.data?.message}`);
    }
  };

  const roleUpdate = async (_value: any, options: any) => {
    try {
      await updateRole({ id: options?.id, role: options?.value }).unwrap();
      toast.success("Update Role");
    } catch (err: any) {
      toast.error(`${err.data?.message}`);
    }
  };

  const updateAccess = async (_value: any, options: any) => {
    try {
      await updateUserAccess({
        id: options?.id,
        body: { value: options?.value },
      }).unwrap();
      toast.success("Update Access");
    } catch (err: any) {
      toast.error(`${err.data?.message}`);
    }
  };

  return (
    <>
      {/* add user */}
      <div className="dark:bg-bg_dark bg-white p-4 rounded-md">
        <Card
          title="Add New User"
          className="dark:bg-bg_dark bg-white text-mirage dark:text-white !border-secondary border-2"
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
        </Card>
      </div>
      {/* all users */}
      <div className="dark:bg-bg_dark bg-white p-4 rounded-md mt-5">
        <div className="">
          <div className="w-full dark:bg-bg_dark bg-white py-5 rounded-md md:mb-0 mb-5 flex md:flex-row flex-col justify-between md:items-center items-start">
            <Title
              className="text-mirage dark:text-white !font-medium"
              level={4}
            >
              All Users ({meta?.total})
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
            loading={isLoading}
            columns={columns}
            dataSource={users}
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
