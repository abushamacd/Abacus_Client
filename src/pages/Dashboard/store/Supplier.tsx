/* eslint-disable no-extra-boolean-cast */
/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button, Card, Col, Input, Row } from "antd";
import Form from "../../../components/Forms/Forms";
import FormInput from "../../../components/Forms/FormInput";
import { SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { addSupplierSchema } from "../../../schemas/store";
import FormTextArea from "../../../components/Forms/FormTextArea";
import {
  useCreateSupplierMutation,
  useDeleteSupplierMutation,
  useGetSuppliersQuery,
} from "../../../redux/api/supplier";
import { toast } from "react-toastify";
import { useState } from "react";
import Loading from "../../../components/ui/Loading";
import Title from "antd/es/typography/Title";
import { ReloadOutlined } from "@ant-design/icons";
import DataTable from "../../../components/ui/DataTable";
import { FaRegEye } from "react-icons/fa";
import { MdDeleteForever } from "react-icons/md";
import { useDebounced } from "../../../redux/hooks";
import { useNavigate } from "react-router-dom";

type SupplierFormValues = {
  name: string;
  address: string;
  ownerName: string;
  ownerPhone: string;
  srName: string;
  srPhone: string;
  comment?: string;
};

export const Supplier = () => {
  const navigate = useNavigate();
  const [createSupplier] = useCreateSupplierMutation();
  const [deleteSupplier] = useDeleteSupplierMutation();
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

  const { data, isLoading } = useGetSuppliersQuery({ ...query });

  // @ts-ignore
  const suppliers: any = data?.suppliers;
  // @ts-ignore
  const meta = data?.meta;

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      sorter: true,
    },
    {
      title: "Address",
      dataIndex: "address",
      sorter: true,
    },
    {
      title: "SR. Name",
      dataIndex: "srName",
      sorter: true,
    },
    {
      title: "SR. Phone",
      dataIndex: "srPhone",
      sorter: true,
    },
    {
      title: "Action",
      render: function (supplier: any) {
        return (
          <div className="flex gap-2">
            <FaRegEye
              style={{ color: "#008A3F" }}
              onClick={() => openView(supplier)}
              size={22}
            />
            <MdDeleteForever
              onClick={() => deleteHandler(supplier?.id)}
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

  const openView = (supplier: any) => {
    navigate(`${supplier.id}`, { replace: true });
  };

  const createHandler: SubmitHandler<SupplierFormValues> = async (
    data: SupplierFormValues
  ) => {
    try {
      await createSupplier(data).unwrap();
      toast.success("Add supplier successfully");
    } catch (err: any) {
      toast.error(`${err.data?.message}`);
    }
  };

  const deleteHandler = async (id: string) => {
    try {
      await deleteSupplier(id).unwrap();
      toast("Supplier deleted successfully");
    } catch (err: any) {
      toast.error(`${err.data?.message}`);
    }
  };

  if (isLoading) return <Loading />;
  return (
    <div>
      {/* add supplier */}
      <div className="dark:bg-bg_dark bg-white p-4 rounded-md">
        <Card
          title="Add New Supplier"
          className="dark:bg-bg_dark bg-white text-mirage dark:text-white !border-secondary border-2"
        >
          <Form
            submitHandler={createHandler}
            resolver={yupResolver(addSupplierSchema)}
          >
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
                  label="Supplier Name"
                  placeholder="Abacus Treders"
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
                  name="ownerName"
                  type="text"
                  size="middle"
                  label="Owner Name"
                  placeholder="Md Abdullah"
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
                  name="srName"
                  type="text"
                  size="middle"
                  label="SR. Name"
                  placeholder="Md Abdullah"
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
                  placeholder="Dhaka"
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
                  name="ownerPhone"
                  type="text"
                  size="middle"
                  label="Owner Phone"
                  placeholder="017XXXXXXXX"
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
                  name="srPhone"
                  type="text"
                  size="middle"
                  label="SR. Phone"
                  placeholder="017XXXXXXXX"
                  required
                />
              </Col>
              <Col
                className="gutter-row"
                sm={24}
                md={24}
                style={{
                  marginBottom: "15px",
                  paddingLeft: "0px",
                  width: "100%",
                }}
              >
                <FormTextArea
                  name="comment"
                  label="Details"
                  placeholder="Note"
                />
              </Col>
            </Row>
            <Row justify="start" align="middle">
              <Button
                className="bg-primary hover:!bg-primary text-mirage !bg-opacity-[.8] duration-300 transition-all mt-4"
                size="middle"
                htmlType="submit"
                type="primary"
              >
                Add Supplier
              </Button>
            </Row>
          </Form>
        </Card>
      </div>

      {/* all supplier */}
      <div className="dark:bg-bg_dark bg-white p-4 rounded-md mt-5">
        <div className="">
          <div className="w-full dark:bg-bg_dark bg-white py-5 rounded-md md:mb-0 mb-5 flex md:flex-row flex-col justify-between md:items-center items-start">
            <Title
              className="text-mirage dark:text-white !font-medium"
              level={4}
            >
              All Suppliers ({meta?.total})
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
            dataSource={suppliers}
            pageSize={size}
            totalPages={meta?.total}
            showSizeChanger={true}
            onPaginationChange={onPaginationChange}
            onTableChange={onTableChange}
            showPagination={true}
            isSelection={false}
          />
        </div>
      </div>
    </div>
  );
};
