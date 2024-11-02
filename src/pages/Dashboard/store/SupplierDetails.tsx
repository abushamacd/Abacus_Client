/* eslint-disable @typescript-eslint/no-explicit-any */
import { useNavigate, useParams } from "react-router-dom";
import {
  useGetSupplierQuery,
  useUpdateSupplierMutation,
} from "../../../redux/api/supplier";
import Loading from "../../../components/ui/Loading";
import { Button, Card, Col, Row } from "antd";
import { FaEdit, FaRegEye } from "react-icons/fa";
import { MdDeleteForever, MdOutlineCancel } from "react-icons/md";
import { useState } from "react";
import { SubmitHandler } from "react-hook-form";
import FormInput from "../../../components/Forms/FormInput";
import Form from "../../../components/Forms/Forms";
import FormTextArea from "../../../components/Forms/FormTextArea";
import { toast } from "react-toastify";
import Title from "antd/es/typography/Title";
import DataTable from "../../../components/ui/DataTable";
import { useDeleteProductMutation } from "../../../redux/api/product";

type SupplierFormValues = {
  name: string;
  address: string;
  ownerName: string;
  ownerPhone: string;
  srName: string;
  srPhone: string;
  comment?: string;
};

export const SupplierDetails = () => {
  const params = useParams();
  const navigate = useNavigate();
  const [isEdit, setIsEdit] = useState(true);

  const { data: supplierData, isLoading: supplierLoading } =
    useGetSupplierQuery(params?.id);
  const [updateSupplier] = useUpdateSupplierMutation();
  const [deleteProduct] = useDeleteProductMutation();

  const supplier: any = supplierData;

  const defaultValues = {
    name: supplier?.name || "",
    address: supplier?.address || "",
    ownerName: supplier?.ownerName || "",
    ownerPhone: supplier?.ownerPhone || "",
    srName: supplier?.srName || "",
    srPhone: supplier?.srPhone || "",
    comment: supplier?.comment || "",
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
      title: "Sell Price",
      dataIndex: "sell",
      sorter: true,
    },
    {
      title: "Retail Price",
      dataIndex: "retail",
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

  const openView = (porduct: any) => {
    navigate(`/adbmsdb/products/${porduct.id}`, { replace: true });
  };

  const deleteHandler = async (id: string) => {
    try {
      await deleteProduct(id).unwrap();
      toast("Porduct deleted successfully");
    } catch (err: any) {
      toast.error(`${err.data?.message}`);
    }
  };

  const updateHandler: SubmitHandler<SupplierFormValues> = async (
    data: SupplierFormValues
  ) => {
    try {
      await updateSupplier({
        id: params?.id,
        body: data,
      }).unwrap();
      toast("Supplier updated successfully");
    } catch (err: any) {
      toast.error(`${err.data?.message}`);
    }
  };

  if (supplierLoading) {
    return <Loading />;
  }

  return (
    <div className="">
      {/* supplier details */}
      <section className="dark:bg-bg_dark bg-white p-4 rounded-md">
        <Card
          title={
            <div className="flex gap-1 items-center">
              <span className="">Supplier Details</span>
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
              <h1 className="mb-1 text-lg text-primary border-b border-secondary">
                Supplier Info
              </h1>
              <span className="tracking-wide block">
                <span className="!font-bold">Supplier Name: </span>
                <span className="italic">{supplier?.name}</span>
              </span>
              <span className="tracking-wide block">
                <span className="!font-bold">Address: </span>
                <span className="italic">{supplier?.address}</span>
              </span>
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
              <h1 className="mb-1 text-lg text-primary border-b border-secondary">
                Owner Info
              </h1>
              <span className="tracking-wide block">
                <span className="!font-bold">Name: </span>
                <span className="italic">{supplier?.ownerName}</span>
              </span>
              <span className="tracking-wide block">
                <span className="!font-bold">Phone: </span>
                <span className="italic">{supplier?.ownerPhone}</span>
              </span>
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
              <h1 className="mb-1 text-lg text-primary border-b border-secondary">
                SR. Info
              </h1>
              <span className="tracking-wide block">
                <span className="!font-bold">Name: </span>
                <span className="italic">{supplier?.srName}</span>
              </span>
              <span className="tracking-wide block">
                <span className="!font-bold">Phone: </span>
                <span className="italic">{supplier?.srPhone}</span>
              </span>
            </Col>
            {supplier?.comment && (
              <Col
                className="gutter-row"
                sm={24}
                md={24}
                style={{
                  marginBottom: "15px",
                  paddingLeft: "0px",
                }}
              >
                <h1 className="mb-1 text-lg text-primary border-b border-secondary">
                  Details
                </h1>
                <span className="tracking-wide block">
                  <span className="italic">{supplier?.comment}</span>
                </span>
              </Col>
            )}
          </Row>

          {!isEdit && (
            <div className="edit_details border-t border-secondary mt-4 pt-4">
              <Form submitHandler={updateHandler} defaultValues={defaultValues}>
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
                      label="Supplier Name"
                      placeholder="Allardan Treders"
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
      {/* supplier's product */}
      {supplier?.products?.length > 0 && (
        <div className="dark:bg-bg_dark bg-white p-4 rounded-md mt-5">
          <div className="">
            <div className="w-full dark:bg-bg_dark bg-white py-5 rounded-md md:mb-0 mb-5 flex md:flex-row flex-col justify-between md:items-center items-start">
              <Title
                className="text-mirage dark:text-white !font-medium"
                level={4}
              >
                Products ({supplier?.products?.length})
              </Title>
            </div>
            <DataTable
              loading={supplierLoading}
              columns={columns}
              dataSource={supplier?.products}
              showSizeChanger={true}
              showPagination={false}
            />
          </div>
        </div>
      )}
    </div>
  );
};
