/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Button, Card, Col, Row } from "antd";
import { DBConnTest } from "../../../components/ui/DBConnTest";
import FormSelectField from "../../../components/Forms/FormSelectField";
import { SelectOptions } from "../../../types";
import Form from "../../../components/Forms/Forms";
import { SubmitHandler } from "react-hook-form";
import { searchSchema } from "../../../schemas/store";
import { yupResolver } from "@hookform/resolvers/yup";

type searchFormValues = {
  schemaName: string;
};

export const LtoR = () => {
  const units = [
    { label: "User", value: "user" },
    { label: "Unit", value: "unit" },
    { label: "Supplier", value: "supplier" },
    { label: "Product", value: "product" },
    { label: "Invoice", value: "invoice" },
    { label: "VehicleRoute", value: "vehicleRoute" },
    { label: "Vehicle", value: "vehicle" },
    { label: "VehicleStatement", value: "vehicleStatement" },
  ];

  const getHandler: SubmitHandler<searchFormValues> = (data) => {
    console.log(data);
  };

  return (
    <div className="">
      <div className="dark:bg-bg_dark bg-white p-4 rounded-md">
        <Card
          className="dark:bg-bg_dark bg-white text-mirage dark:text-white !border-secondary border-2"
          title=<>
            <div className="flex flex-wrap md:justify-between justify-center items-center gap-2 py-4">
              <p>DB Sync L to R</p>
              <DBConnTest />
            </div>
          </>
        >
          <div className="">
            <Form
              submitHandler={getHandler}
              resolver={yupResolver(searchSchema)}
            >
              <Row
                className="!mx-0 items-center"
                gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}
              >
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
                    name="schemaName"
                    label="Schema Name"
                    options={units as SelectOptions[]}
                    size="middle"
                    placeholder="Select Schema"
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
                  <Button
                    className="bg-primary hover:!bg-primary text-mirage !bg-opacity-[.8] duration-300 transition-all md:mt-6 mt-2"
                    size="middle"
                    htmlType="submit"
                    type="primary"
                    // block
                  >
                    Get Unsyncs
                  </Button>
                </Col>
                <Col
                  className="gutter-row md:flex justify-end"
                  sm={24}
                  md={12}
                  style={{
                    marginBottom: "15px",
                    paddingLeft: "0px",
                    paddingRight: "0px",
                    width: "100%",
                  }}
                >
                  <Button
                    className="bg-primary hover:!bg-primary text-mirage !bg-opacity-[.8] duration-300 transition-all md:mt-6 mt-2"
                    size="middle"
                    type="primary"
                    // block
                  >
                    Send Unsynces
                  </Button>
                </Col>
              </Row>
            </Form>
          </div>
        </Card>
      </div>
    </div>
  );
};
