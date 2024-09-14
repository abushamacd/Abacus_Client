/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Button, Card, Col, Row } from "antd";
import Form from "../../../components/Forms/Forms";
import FormInput from "../../../components/Forms/FormInput";
import { yupResolver } from "@hookform/resolvers/yup";
import { SubmitHandler } from "react-hook-form";
import { addVehicleSchema } from "../../../schemas/vehicle";
import FormSelectField from "../../../components/Forms/FormSelectField";
import { useGetVehicleRoutesQuery } from "../../../redux/api/vehicleRoute";
import Loading from "../../../components/ui/Loading";
import { useGetUsersQuery } from "../../../redux/api/userApi";
import { useCreateVehicleMutation } from "../../../redux/api/vehicle";
import { toast } from "react-toastify";
import { SelectOptions } from "../../../types";

type UserFormValues = {
  vNumber: string;
  startRoute: string;
  endRoute: string;
  driverId: string;
  route?: string;
  supervisorId: string;
};

export const Vehicle = () => {
  const { data: vRoutes, isLoading: vRoutesLoading } = useGetVehicleRoutesQuery(
    {}
  );
  const { data: users, isLoading: staffsLoading } = useGetUsersQuery({
    role: "Staff",
  });
  const [createVehicle] = useCreateVehicleMutation();

  // @ts-ignore
  const vehicleRoutes: any = vRoutes?.vehicleRoutes;
  // @ts-ignore
  const allStaff: any = users?.users;

  const routes: any[] = [];
  vehicleRoutes?.forEach((route: any) => {
    routes?.push({ label: route?.name, value: route?.name });
  });

  const staffs: any[] = [];
  allStaff?.forEach((staff: any) => {
    staffs?.push({ label: staff?.name, value: staff?.id });
  });

  const createHandler: SubmitHandler<UserFormValues> = async (
    data: UserFormValues
  ) => {
    const { startRoute, endRoute, ...details } = data;
    details.route = `${startRoute} - ${endRoute}`;
    try {
      await createVehicle(details).unwrap();
      toast.success("Add vehicle successfully");
    } catch (err: any) {
      toast.error(`${err.data?.message}`);
    }
  };

  if (vRoutesLoading || staffsLoading) return <Loading />;

  return (
    <div className="">
      <div className="dark:bg-bg_dark bg-white p-4 rounded-md">
        <Card
          title="Add New Vehicle"
          className="dark:bg-bg_dark bg-white text-mirage dark:text-white !border-secondary border-2"
        >
          <Form
            submitHandler={createHandler}
            resolver={yupResolver(addVehicleSchema)}
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
                  placeholder="2131"
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
                md={12}
                style={{
                  marginBottom: "15px",
                  paddingLeft: "0px",
                  width: "100%",
                }}
              >
                <FormSelectField
                  name="driverId"
                  label="Driver"
                  options={staffs as SelectOptions[]}
                  size="middle"
                  placeholder="Select"
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
                  width: "100%",
                }}
              >
                <FormSelectField
                  name="supervisorId"
                  label="Supervisor"
                  options={staffs as SelectOptions[]}
                  size="middle"
                  placeholder="Select"
                  required
                />
              </Col>
            </Row>
            <Row justify="start" align="middle">
              <Button
                className="bg-primary hover:!bg-primary text-mirage !bg-opacity-[.8] duration-300 transition-all mt-4"
                size="large"
                htmlType="submit"
                type="primary"
                // block
              >
                Add Vehicle
              </Button>
            </Row>
          </Form>
        </Card>
      </div>
    </div>
  );
};
