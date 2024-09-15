/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Button, Card, Col, Row } from "antd";
import Form from "../../../components/Forms/Forms";
import FormSelectField from "../../../components/Forms/FormSelectField";
import { SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { addVStatementSchema } from "../../../schemas/vehicle";
import { useGetVehicleRoutesQuery } from "../../../redux/api/vehicleRoute";
import Loading from "../../../components/ui/Loading";
import { SelectOptions } from "../../../types";
import FormDatePicker from "../../../components/Forms/FormDatePicker";
import { useGetVehiclesQuery } from "../../../redux/api/vehicle";
import FormInput from "../../../components/Forms/FormInput";
import FormTextArea from "../../../components/Forms/FormTextArea";
import { useCreateVehicleStatementMutation } from "../../../redux/api/vehicleStatement";
import { toast } from "react-toastify";

type VStatementFormValues = {
  vehicleId: string;
  routes: string;
  route?: string;
  oil: number;
  income: number;
  expense: number;
  welfare: number;
  servicing: number;
  comment: string;
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

  const { data: vData, isLoading: vLoading } = useGetVehiclesQuery({});
  // @ts-ignore
  const allVehicles: any = vData?.vehicles;

  const vehicles: any[] = [];
  allVehicles?.forEach((vehicle: any) => {
    vehicles?.push({ label: vehicle?.vNumber, value: vehicle?.id });
  });

  const [createVehicleStatement] = useCreateVehicleStatementMutation();

  const createHandler: SubmitHandler<VStatementFormValues> = async (
    data: VStatementFormValues
  ) => {
    const { routes, ...details } = data;
    details.route = routes[0];
    try {
      await createVehicleStatement(details).unwrap();
      toast.success("Add statement successfully");
    } catch (err: any) {
      toast.error(`${err.data?.message}`);
    }
  };

  if (vRoutesLoading || vLoading) return <Loading />;

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
                <FormSelectField
                  name="vehicleId"
                  label="Vehicle No."
                  options={vehicles as SelectOptions[]}
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
                  name="routes"
                  label="Route"
                  mode="tags"
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
                }}
              >
                <FormInput
                  name="oil"
                  type="number"
                  size="middle"
                  label="Oil (Litter)"
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
                  name="income"
                  type="number"
                  size="middle"
                  label="Income"
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
                  name="expense"
                  type="number"
                  size="middle"
                  label="Expense"
                  required
                />
              </Col>
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
                  name="welfare"
                  type="number"
                  size="middle"
                  label="Welfare Cost"
                  required
                />
              </Col>
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
                  name="servicing"
                  type="number"
                  size="middle"
                  label="Servicing Cost"
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
