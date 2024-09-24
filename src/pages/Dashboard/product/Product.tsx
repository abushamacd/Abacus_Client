/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Badge, Button, Card, Col, Modal, Row } from "antd";
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
import { useCreateProductMutation } from "../../../redux/api/product";

type ProductFormValues = {
  name: string;
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
  const [isAdd, setIsAdd] = useState(false);
  const { data: supplersData, isLoading: suppliersLoading } =
    useGetSuppliersQuery({});
  const { data: unitsData, isLoading: unitLoading } = useGetUnitsQuery({});
  const [createSupplier] = useCreateSupplierMutation();
  const [createProduct] = useCreateProductMutation();
  // @ts-ignore
  const allSuppliers: any = supplersData?.suppliers;

  // @ts-ignore
  const allUnits: any = unitsData?.units;

  const suppliers: any[] = [];
  allSuppliers?.forEach((supplier: any) => {
    suppliers?.push({ label: supplier?.name, value: supplier?.id });
  });

  const units: any[] = [];
  allUnits?.forEach((unit: any) => {
    units?.push({ label: unit?.name, value: unit?.id });
  });

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

  if (suppliersLoading || unitLoading) return <Loading />;

  return (
    <div>
      {/* add vehicle */}
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
                md={6}
                style={{
                  marginBottom: "15px",
                  paddingLeft: "0px",
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
                md={6}
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
                md={6}
                style={{
                  marginBottom: "15px",
                  paddingLeft: "0px",
                }}
              >
                <FormInput
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
                md={6}
                style={{
                  marginBottom: "15px",
                  paddingLeft: "0px",
                }}
              >
                <FormInput
                  name="minQuantity"
                  type="number"
                  size="middle"
                  label="Min. Quantity"
                  placeholder="Enter minimum quantity"
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
                }}
              >
                <FormInput
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
                md={6}
                style={{
                  marginBottom: "15px",
                  paddingLeft: "0px",
                }}
              >
                <FormInput
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
                md={6}
                style={{
                  marginBottom: "15px",
                  paddingLeft: "0px",
                }}
              >
                <FormInput
                  name="retail"
                  type="number"
                  size="middle"
                  label="Retail Price"
                  placeholder="Enter retail price"
                  required
                />
              </Col>
              <Col
                className="gutter-row relative w-full"
                sm={24}
                md={6}
                style={{
                  marginBottom: "15px",
                  paddingLeft: "0px",
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
                md={24}
                style={{
                  marginBottom: "15px",
                  paddingLeft: "0px",
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
              Add Suppliers
            </Button>
          </Row>
        </Form>
      </Modal>
    </div>
  );
};
