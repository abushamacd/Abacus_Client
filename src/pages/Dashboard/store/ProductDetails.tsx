/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useParams } from "react-router-dom";
import {
  useGetProductQuery,
  useUpdateProductMutation,
} from "../../../redux/api/product";
import Loading from "../../../components/ui/Loading";
import { Badge, Button, Card, Col, Modal, Row } from "antd";
import { useState } from "react";
import { FaEdit } from "react-icons/fa";
import { MdOutlineCancel } from "react-icons/md";
import Form from "../../../components/Forms/Forms";
import { SubmitHandler } from "react-hook-form";
import FormInput from "../../../components/Forms/FormInput";
import FormSelectField from "../../../components/Forms/FormSelectField";
import { SelectOptions } from "../../../types";
import FormTextArea from "../../../components/Forms/FormTextArea";
import {
  useCreateSupplierMutation,
  useGetSuppliersQuery,
} from "../../../redux/api/supplier";
import { toast } from "react-toastify";
import { useGetUnitsQuery } from "../../../redux/api/unit";
import { yupResolver } from "@hookform/resolvers/yup";
import { addProductSchema, addSupplierSchema } from "../../../schemas/store";

type ProductFormValues = {
  name: string;
  slug: string;
  supplierId: string;
  unitId: string;
  quantity: number;
  minQuantity: number;
  purchase: number;
  sell: number;
  retail: number;
  comment: string;
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

export const ProductDetails = () => {
  const params = useParams();
  const [isEdit, setIsEdit] = useState(true);
  const [isAdd, setIsAdd] = useState(false);

  const { data: productData, isLoading: productLoading } = useGetProductQuery(
    params?.id
  );

  const [createSupplier] = useCreateSupplierMutation();
  const [updateProduct] = useUpdateProductMutation();
  const { data: unitsData } = useGetUnitsQuery({});
  const { data: supplersData } = useGetSuppliersQuery({});

  // @ts-ignore
  const allUnits: any = unitsData?.units;

  // @ts-ignore
  const allSuppliers: any = supplersData?.suppliers;

  const suppliers: any[] = [];
  allSuppliers?.forEach((supplier: any) => {
    suppliers?.push({ label: supplier?.name, value: supplier?.id });
  });

  const units: any[] = [];
  allUnits?.forEach((unit: any) => {
    units?.push({ label: unit?.name, value: unit?.id });
  });

  const product: any = productData;

  const defaultValues = {
    name: product?.name || "",
    slug: product?.slug || "",
    comment: product?.comment || "",
    supplierId: product?.supplierId || "",
    unitId: product?.unitId || "",
    quantity: product?.quantity || 0,
    minQuantity: product?.minQuantity || 0,
    purchase: product?.purchase || 0,
    retail: product?.retail || 0,
    sell: product?.sell || 0,
  };

  // Handlers
  const updateHandler: SubmitHandler<ProductFormValues> = async (
    data: ProductFormValues
  ) => {
    try {
      await updateProduct({
        id: params?.id,
        body: data,
      }).unwrap();
      toast("Product updated successfully");
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

  if (productLoading) {
    return <Loading />;
  }

  return (
    <div>
      {/* Product details */}
      <section className="dark:bg-bg_dark bg-white p-4 rounded-md">
        <Card
          title={
            <div className="flex gap-1 items-center">
              <span className="">Product Details</span>
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
          {/* show product details */}
          <Row className="!mx-0" gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
            <Col
              className="gutter-row"
              sm={24}
              md={12}
              lg={6}
              style={{
                marginBottom: "15px",
                paddingLeft: "0px",
                width: "100%",
              }}
            >
              <h1 className="mb-1 text-lg text-primary border-b border-secondary">
                Product Info
              </h1>
              <span className="tracking-wide block">
                <span className="!font-bold">Product Name: </span>
                <span className="italic">{product?.name}</span>
              </span>
              <span className="tracking-wide block">
                <span className="!font-bold">Update by: </span>
                <span className="italic">{product?.updateBy}</span>
              </span>
            </Col>
            <Col
              className="gutter-row"
              sm={24}
              md={12}
              lg={6}
              style={{
                marginBottom: "15px",
                paddingLeft: "0px",
                width: "100%",
              }}
            >
              <h1 className="mb-1 text-lg text-primary border-b border-secondary">
                Quantity Info
              </h1>
              <span
                className={`tracking-wide block ${
                  product?.quantity < product?.minQuantity && "text-[#D31818]"
                }`}
              >
                <span className={`!font-bold`}>Available: </span>
                <span className="italic">
                  {product?.quantity} {product?.unit?.name}
                </span>
              </span>
              <span className="tracking-wide block">
                <span className="!font-bold">Minimum: </span>
                <span className="italic">
                  {product?.minQuantity} {product?.unit?.name}
                </span>
              </span>
            </Col>
            <Col
              className="gutter-row"
              sm={24}
              md={12}
              lg={6}
              style={{
                marginBottom: "15px",
                paddingLeft: "0px",
                width: "100%",
              }}
            >
              <h1 className="mb-1 text-lg text-primary border-b border-secondary">
                Price Info
              </h1>
              <span className="tracking-wide block">
                <span className="!font-bold">Purchase price: </span>
                <span className="italic">{product?.purchase} ৳</span>
              </span>
              <span className="tracking-wide block">
                <span className="!font-bold">Retail price: </span>
                <span className="italic">{product?.retail} ৳</span>
              </span>
              <span className="tracking-wide block">
                <span className="!font-bold">Sell price: </span>
                <span className="italic">{product?.sell} ৳</span>
              </span>
            </Col>
            <Col
              className="gutter-row"
              sm={24}
              md={12}
              lg={6}
              style={{
                marginBottom: "15px",
                paddingLeft: "0px",
                width: "100%",
              }}
            >
              <h1 className="mb-1 text-lg text-primary border-b border-secondary">
                Supplier Info
              </h1>
              <span className="tracking-wide block">
                <span className="!font-bold">Supplier: </span>
                <span className="italic">{product?.supplier?.name}</span>
              </span>
              <span className="tracking-wide block">
                <span className="!font-bold">SR. Name: </span>
                <span className="italic">{product?.supplier?.srName}</span>
              </span>
              <span className="tracking-wide block">
                <span className="!font-bold">SR. Phone: </span>
                <span className="italic">{product?.supplier?.srPhone}</span>
              </span>
            </Col>
            {product?.comment && (
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
                <h1 className="mb-1 text-lg text-primary border-b border-secondary">
                  Details
                </h1>
                <span className="tracking-wide block">
                  <span className="italic">{product?.comment}</span>
                </span>
              </Col>
            )}
          </Row>
          {/* edit products */}
          {!isEdit && (
            <div className="edit_details border-t border-secondary mt-4 pt-4">
              <Form
                submitHandler={updateHandler}
                resolver={yupResolver(addProductSchema)}
                defaultValues={defaultValues}
              >
                <Row
                  className="!mx-0"
                  gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}
                >
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
                  >
                    Update
                  </Button>
                </Row>
              </Form>
            </div>
          )}
        </Card>
      </section>
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
    </div>
  );
};
