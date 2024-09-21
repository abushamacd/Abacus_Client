import { Button, Card, Col, Row } from "antd";
import Form from "../../../components/Forms/Forms";
import FormInput from "../../../components/Forms/FormInput";
import { SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { addProductSchema } from "../../../schemas/product";

type ProductFormValues = {
  vNumber: string;
  routes: string;
  route?: string;
  driverId: string;
  supervisorId: string;
};

export const Product = () => {
  const createHandler: SubmitHandler<ProductFormValues> = async (
    data: ProductFormValues
  ) => {
    console.log(data);
    // const { routes, ...details } = data;
    // details.route = routes[0];
    // try {
    //   await createVehicle(details).unwrap();
    //   toast.success("Add vehicle successfully");
    // } catch (err: any) {
    //   toast.error(`${err.data?.message}`);
    // }
  };
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
                md={12}
                style={{
                  marginBottom: "15px",
                  paddingLeft: "0px",
                }}
              >
                <FormInput
                  name="vNumber"
                  type="text"
                  size="middle"
                  label="Vehicle No."
                  placeholder="2131"
                  required
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
    </div>
  );
};
