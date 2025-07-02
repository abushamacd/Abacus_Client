/* eslint-disable no-extra-boolean-cast */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Badge, Button, Card, Col, Input, Modal, Row } from "antd";
import Form from "../../../components/Forms/Forms";
import FormInput from "../../../components/Forms/FormInput";
import { SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { addProductSchema, addSupplierSchema } from "../../../schemas/store";
import FormTextArea from "../../../components/Forms/FormTextArea";
import {
  useCreateSupplierMutation,
  useGetSuppliersQuery,
} from "../../../redux/api/supplier";
import Loading from "../../../components/ui/Loading";
import FormSelectField from "../../../components/Forms/FormSelectField";
import { SelectOptions } from "../../../types";
import { useGetUnitsQuery } from "../../../redux/api/unit";
import { useState } from "react";
import { toast } from "react-toastify";
import {
  useCreateProductMutation,
  useDeleteProductMutation,
  useDeleteProductsMutation,
  useGetProductsQuery,
} from "../../../redux/api/product";
import { useDebounced } from "../../../redux/hooks";
import { FaRegEye } from "react-icons/fa";
import { MdDeleteForever } from "react-icons/md";
import Title from "antd/es/typography/Title";
import { ReloadOutlined } from "@ant-design/icons";
import DataTable from "../../../components/ui/DataTable";
import { useNavigate } from "react-router-dom";

type ProductFormValues = {
  name: string;
  slug: string;
  supplierId?: string;
  unitId: string;
  quantity: number;
  minQuantity: number;
  purchase: number;
  sell: number;
  retail: number;
  comment?: string;
};

type SupplierFormValues = {
  name: string;
  address: string;
  ownerName: string;
  ownerPhone: string;
  srName: string;
  srPhone: string;
  comment?: string;
};

export const Product = () => {
  const navigate = useNavigate();
  const [isAdd, setIsAdd] = useState(false);
  const [selectedIds, setSelectedIds] = useState<React.Key[]>([]);
  const query: Record<string, any> = {};
  const [page, setPage] = useState<number>(1);
  const [size, setSize] = useState<number>(50);
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

  const { data: supplersData, isLoading: suppliersLoading } =
    useGetSuppliersQuery({});
  const { data: unitsData, isLoading: unitLoading } = useGetUnitsQuery({});
  const [createSupplier] = useCreateSupplierMutation();
  const [createProduct] = useCreateProductMutation();
  const [deleteProduct] = useDeleteProductMutation();
  const [deleteProducts] = useDeleteProductsMutation();

  const { data, isLoading } = useGetProductsQuery({ ...query });
  // @ts-ignore
  const allSuppliers: any = supplersData?.suppliers;
  // @ts-ignore
  const allUnits: any = unitsData?.units;

  // @ts-ignore
  const products: any = data?.products;
  // @ts-ignore
  const meta = data?.meta;

  const suppliers: any[] = [];
  allSuppliers?.forEach((supplier: any) => {
    suppliers?.push({ label: supplier?.name, value: supplier?.id });
  });

  const units: any[] = [];
  allUnits?.forEach((unit: any) => {
    units?.push({ label: unit?.name, value: unit?.id });
  });

  const openView = (porduct: any) => {
    navigate(`${porduct.id}`, { replace: true });
  };

  // Handlers
  const createHandler: SubmitHandler<ProductFormValues> = async (
    data: ProductFormValues
  ) => {
    try {
      await createProduct(data).unwrap();
      toast.success("Add product successfully");
    } catch (err: any) {
      toast.error(`${err.data?.message}`);
    }
  };

  const supplierCreateHandler: SubmitHandler<SupplierFormValues> = async (
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
      await deleteProduct(id).unwrap();
      toast("Porduct deleted successfully");
    } catch (err: any) {
      toast.error(`${err.data?.message}`);
    }
  };

  const deletesHandler = async (data: React.Key[]) => {
    try {
      await deleteProducts(data).unwrap();
      toast.success("Delete selected products");
    } catch (err: any) {
      toast.error(`${err.data?.message}`);
    }
  };

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      sorter: true,
    },
    {
      title: "Quantity",
      render: function (product: any) {
        return (
          <span
            className={`${
              product?.quantity < product?.minQuantity &&
              "text-[#D31818] !font-bold"
            }`}
          >
            {product?.quantity} ({product?.unit?.name})
          </span>
        );
      },
    },
    {
      title: "Purchase Price",
      dataIndex: "purchase",
      sorter: true,
    },
    {
      title: "Retail Price",
      dataIndex: "retail",
      sorter: true,
    },
    {
      title: "Sell Price",
      dataIndex: "sell",
      sorter: true,
    },
    {
      title: "Action",
      render: function (porduct: any) {
        return (
          <div className="flex gap-2">
            <FaRegEye
              style={{ color: "#008A3F" }}
              onClick={() => openView(porduct)}
              size={22}
            />
            <MdDeleteForever
              onClick={() => deleteHandler(porduct?.id)}
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

  const resetFilters = () => {
    setSortBy("");
    setSortOrder("");
    setSearchTerm("");
  };

  if (suppliersLoading || unitLoading || isLoading) return <Loading />;

  return (
    <>
      {/* add product */}
      <div className="dark:bg-bg_dark bg-white p-4 rounded-md">
        <Card
          title="Add New Product"
          className="dark:bg-bg_dark bg-white text-mirage dark:text-white !border-secondary border-2"
        >
          <Form
            submitHandler={createHandler}
            resolver={yupResolver(addProductSchema)}
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
                  label="Product Name"
                  placeholder="Enter product name"
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
                  name="slug"
                  type="text"
                  size="middle"
                  label="Product Slug"
                  placeholder="Enter product slug"
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
                <FormSelectField
                  name="unitId"
                  label="Unit"
                  options={units as SelectOptions[]}
                  size="middle"
                  placeholder="Select unit"
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
                  step={0.01}
                  name="quantity"
                  type="number"
                  size="middle"
                  label="Quantity"
                  placeholder="Enter quantity"
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
                  step={0.01}
                  name="minQuantity"
                  type="number"
                  size="middle"
                  label="Min. Quantity"
                  placeholder="Enter minimum quantity"
                  required
                />
              </Col>
              <Col
                className="gutter-row relative w-full"
                sm={24}
                md={8}
                style={{
                  marginBottom: "15px",
                  paddingLeft: "0px",
                  width: "100%",
                }}
              >
                <FormSelectField
                  name="supplierId"
                  label="Supplier"
                  options={suppliers as SelectOptions[]}
                  size="middle"
                  placeholder="Select Supplier"
                  required
                />
                <div
                  className="absolute md:right-[15px] md:top-[-6px] right-[2px] top-[-7px]"
                  onClick={() => setIsAdd(!isAdd)}
                >
                  <Badge.Ribbon
                    text="Add New"
                    className="cursor-pointer"
                    color="#3fb0ac"
                  ></Badge.Ribbon>
                </div>
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
                  step={0.01}
                  name="purchase"
                  type="number"
                  size="middle"
                  label="Purchase Price"
                  placeholder="Enter purchase price"
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
                  step={0.01}
                  name="sell"
                  type="number"
                  size="middle"
                  label="Selling Price"
                  placeholder="Enter selling price"
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
                  step={0.01}
                  name="retail"
                  type="number"
                  size="middle"
                  label="Retail Price"
                  placeholder="Enter retail price"
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
                  rows={4}
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
                // block
              >
                Add Products
              </Button>
            </Row>
          </Form>
        </Card>
      </div>
      {/* all product */}
      <div className="dark:bg-bg_dark bg-white p-4 rounded-md mt-5">
        <div className="">
          <div className="w-full dark:bg-bg_dark bg-white py-5 rounded-md md:mb-0 mb-5 flex md:flex-row flex-col justify-between md:items-center items-start">
            <Title
              className="text-mirage dark:text-white !font-medium"
              level={4}
            >
              All Products ({meta?.total})
            </Title>
            <div className="flex items-center">
              {selectedIds?.length > 0 && (
                <>
                  <MdDeleteForever
                    className=""
                    onClick={() => deletesHandler(selectedIds)}
                    size={35}
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
            loading={isLoading}
            columns={columns}
            dataSource={products}
            pageSize={size}
            totalPages={meta?.total}
            showSizeChanger={true}
            onPaginationChange={onPaginationChange}
            onTableChange={onTableChange}
            showPagination={true}
            onSelection={onSelection}
          />
        </div>
      </div>
      {/* add new supplier */}
      <Modal
        title={`Add New Supplier`}
        open={isAdd}
        centered
        footer={null}
        onCancel={() => setIsAdd(!isAdd)}
      >
        <Form
          submitHandler={supplierCreateHandler}
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
                placeholder="Allardan Treders"
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
              <FormTextArea name="comment" label="Details" placeholder="Note" />
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
      </Modal>
    </>
  );
};
