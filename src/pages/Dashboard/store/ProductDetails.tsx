/* eslint-disable @typescript-eslint/no-explicit-any */
import { useParams } from "react-router-dom";
import { useGetProductQuery } from "../../../redux/api/product";
import Loading from "../../../components/ui/Loading";
import { Card, Col, Row } from "antd";
import { useState } from "react";
import { FaEdit } from "react-icons/fa";
import { MdOutlineCancel } from "react-icons/md";

export const ProductDetails = () => {
  const params = useParams();
  const [isEdit, setIsEdit] = useState(true);

  const { data: productData, isLoading: productLoading } = useGetProductQuery(
    params?.id
  );
  //   const [updateProduct] = useUpdateProductMutation();

  const product: any = productData;

  console.log(product);

  if (productLoading) {
    return <Loading />;
  }
  return (
    <div>
      {/* product details */}
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
              md={8}
              style={{
                marginBottom: "15px",
                paddingLeft: "0px",
              }}
            >
              <h1 className="mb-1 text-lg text-primary border-b border-secondary">
                Quantity Info
              </h1>
              <span className="tracking-wide block">
                <span className="!font-bold">Available: </span>
                <span className="italic">{product?.quantity}</span>
              </span>
              <span className="tracking-wide block">
                <span className="!font-bold">Phone: </span>
                <span className="italic">{product?.ownerPhone}</span>
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
                <span className="italic">{product?.srName}</span>
              </span>
              <span className="tracking-wide block">
                <span className="!font-bold">Phone: </span>
                <span className="italic">{product?.srPhone}</span>
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

          {/* {!isEdit && (
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
                    }}
                  >
                    <FormInput
                      name="name"
                      type="text"
                      size="middle"
                      label="Product Name"
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
          )} */}
        </Card>
      </section>
    </div>
  );
};
