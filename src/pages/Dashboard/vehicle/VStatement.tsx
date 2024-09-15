/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Button, Card, Col, Row } from "antd";
import Form from "../../../components/Forms/Forms";
import FormInput from "../../../components/Forms/FormInput";
import FormSelectField from "../../../components/Forms/FormSelectField";
import { SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { addVStatementSchema } from "../../../schemas/vehicle";
import { useGetVehicleRoutesQuery } from "../../../redux/api/vehicleRoute";
import Loading from "../../../components/ui/Loading";
import { SelectOptions } from "../../../types";
import FormDatePicker from "../../../components/Forms/FormDatePicker";

type UserFormValues = {
  vNumber: string;
  startRoute: string;
  endRoute: string;
  driverId: string;
  route?: string;
  supervisorId: string;
};

export const VStatement = () => {
  const { data: vRoutes, isLoading: vRoutesLoading } = useGetVehicleRoutesQuery(
    {}
  );
  // @ts-ignore
  const vehicleRoutes: any = vRoutes?.vehicleRoutes;

  const routes: any[] = [];
  vehicleRoutes?.forEach((route: any) => {
    routes?.push({ label: route?.name, value: route?.name });
  });

  const createHandler: SubmitHandler<UserFormValues> = async (
    data: UserFormValues
  ) => {
    console.log(data);
    // const { startRoute, endRoute, ...details } = data;
    // details.route = `${startRoute} - ${endRoute}`;
    // try {
    //   await createVehicle(details).unwrap();
    //   toast.success("Add vehicle successfully");
    // } catch (err: any) {
    //   toast.error(`${err.data?.message}`);
    // }
  };

  if (vRoutesLoading) return <Loading />;

  return (
    <div>
      <div className="dark:bg-bg_dark bg-white p-4 rounded-md">
        <Card
          title="Add New Vehicle"
          className="dark:bg-bg_dark bg-white text-mirage dark:text-white !border-secondary border-2"
        >
          <Form
            submitHandler={createHandler}
            resolver={yupResolver(addVStatementSchema)}
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
                  name="vNumber"
                  type="text"
                  size="middle"
                  label="Vehicle No."
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
                  name="startRoute"
                  label="Start Route"
                  options={routes as SelectOptions[]}
                  size="middle"
                  placeholder="Select"
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
                  name="endRoute"
                  label="End Route"
                  options={routes as SelectOptions[]}
                  size="middle"
                  placeholder="Select"
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
                <FormDatePicker
                  name="date"
                  label="Trip Date"
                  size="middle"
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
                Add Statement
              </Button>
            </Row>
          </Form>
        </Card>
      </div>
    </div>
  );
};
