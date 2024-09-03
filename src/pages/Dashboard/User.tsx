/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-extra-boolean-cast */
/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-explicit-any */
import Card from "antd/es/card/Card";
import Form from "../../components/Forms/Forms";
import FormInput from "../../components/Forms/FormInput";
import { Button, Row } from "antd";
import { SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { addUserSchema } from "../../schemas/user";
import { useSignUpMutation } from "../../redux/api/authApi";
import { toast } from "react-toastify";
import Title from "antd/es/typography/Title";
import Input from "antd/es/input/Input";
import DataTable from "../../components/ui/DataTable";
import { useGetUsersQuery } from "../../redux/api/userApi";
import { FaRegEye } from "react-icons/fa";
import { FiEdit } from "react-icons/fi";
import { MdDeleteForever } from "react-icons/md";
import { ReloadOutlined } from "@ant-design/icons";
import { useDebounced } from "../../redux/hooks";
import { useState } from "react";

type UserFormValues = {
  name: string;
  phone: string;
  address: string;
};

export const User = () => {
  // const dispatch = useAppDispatch();
  const [signUp] = useSignUpMutation();

  const query: Record<string, any> = {};
  const [page, setPage] = useState<number>(1);
  const [size, setSize] = useState<number>(10);
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

  console.log(data);

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      sorter: true,
    },
    {
      title: "Role",
      dataIndex: "role",
      sorter: true,
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
              style={{ color: "#F37017" }}
              // onClick={() => openView(user)}
              size={22}
            />
            <FiEdit
              // onClick={() => openEdit(user)}
              size={22}
              style={{ color: "#159246" }}
            />
            <MdDeleteForever
              // onClick={() => deleteHandler(user?.id)}
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
  return (
    <div className="">
      {/* add user */}
      <div className="dark:bg-bg_dark bg-white p-4 rounded-md">
        <Card
          title="Add New User"
          className="dark:bg-bg_dark bg-white text-mirage dark:text-white !border-secondary border-2"
        >
          <Form submitHandler={addUser} resolver={yupResolver(addUserSchema)}>
            <div className="w-full flex md:flex-row flex-col items-start justify-between gap-5">
              <div className="w-full">
                <FormInput
                  name="name"
                  type="text"
                  size="middle"
                  label="Name"
                  required
                />
              </div>
              <div className="w-full">
                <FormInput
                  name="phone"
                  type="phone"
                  size="middle"
                  label="Phone"
                  required
                />
              </div>
              <div className="w-full">
                <FormInput
                  name="address"
                  type="text"
                  size="middle"
                  label="Address"
                  required
                />
              </div>
            </div>
            <Row justify="start" align="middle">
              <Button
                className="bg-primary hover:!bg-primary text-mirage !bg-opacity-[.8] duration-300 transition-all mt-4"
                size="large"
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
              level={5}
            >
              All Users
            </Title>
            <div className="mb-5 flex items-center">
              <Input
                type="text"
                size="middle"
                className="bg-bg text-mirage placeholder:text-mirage dark:placeholder:text-white dark:bg-black dark:text-white focus-within:!border-primary hover:!border-primary"
                placeholder="Search..."
                // onChange={(e) => {
                //   setSearchTerm(e.target.value);
                // }}
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
    </div>
  );
};
