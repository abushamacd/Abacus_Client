/* eslint-disable no-extra-boolean-cast */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Button, Card, Col, Input, Row } from "antd";
import Form from "../../../components/Forms/Forms";
import FormInput from "../../../components/Forms/FormInput";
import { yupResolver } from "@hookform/resolvers/yup";
import { SubmitHandler } from "react-hook-form";
import { addVehicleSchema } from "../../../schemas/vehicle";
import FormSelectField from "../../../components/Forms/FormSelectField";
import { useGetVehicleRoutesQuery } from "../../../redux/api/vehicleRoute";
import Loading from "../../../components/ui/Loading";
import { useGetUsersQuery } from "../../../redux/api/userApi";
import {
  useCreateVehicleMutation,
  useDeleteVehicleMutation,
  useGetVehiclesQuery,
} from "../../../redux/api/vehicle";
import { toast } from "react-toastify";
import { SelectOptions } from "../../../types";
import { useState } from "react";
import { useDebounced } from "../../../redux/hooks";
import { FaRegEye } from "react-icons/fa";
import { MdDeleteForever } from "react-icons/md";
import Title from "antd/es/typography/Title";
import { ReloadOutlined } from "@ant-design/icons";
import DataTable from "../../../components/ui/DataTable";
import { useNavigate } from "react-router-dom";

type VehicleFormValues = {
  vNumber: string;
  routes: string;
  route?: string;
  driverId: string;
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
  const [deleteVehicle] = useDeleteVehicleMutation();

  // @ts-ignore
  const vehicleRoutes: any = vRoutes?.vehicleRoutes;
  // @ts-ignore
  const allStaff: any = users?.users;

  const query: Record<string, any> = {};
  const [page, setPage] = useState<number>(1);
  const [size, setSize] = useState<number>(5);
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

  const { data, isLoading } = useGetVehiclesQuery({ ...query });

  // @ts-ignore
  const vehicles: any = data?.vehicles;
  // @ts-ignore
  const meta = data?.meta;

  const routes: any[] = [];
  vehicleRoutes?.forEach((route: any) => {
    routes?.push({ label: route?.name, value: route?.name });
  });

  const staffs: any[] = [];
  allStaff?.forEach((staff: any) => {
    staffs?.push({ label: staff?.name, value: staff?.id });
  });

  const columns = [
    {
      title: "Vehicle No.",
      dataIndex: "vNumber",
      sorter: true,
    },
    {
      title: "Route",
      dataIndex: "route",
      sorter: true,
    },
    {
      title: "Running Route",
      dataIndex: "runningRoute",
      sorter: true,
    },
    {
      title: `Total Oil (Litre) `,
      dataIndex: "oil",
      sorter: true,
    },
    {
      title: "Action",
      render: function (vehicle: any) {
        return (
          <div className="flex gap-2">
            <FaRegEye
              style={{ color: "#008A3F" }}
              onClick={() => openView(vehicle)}
              size={22}
            />
            <MdDeleteForever
              onClick={() => deleteHandler(vehicle?.id)}
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

  const resetFilters = () => {
    setSortBy("");
    setSortOrder("");
    setSearchTerm("");
  };

  const navigate = useNavigate();

  const openView = (vehicle: any) => {
    navigate(`${vehicle.id}`, { replace: true });
  };

  const createHandler: SubmitHandler<VehicleFormValues> = async (
    data: VehicleFormValues
  ) => {
    const { routes, ...details } = data;
    details.route = routes[0];
    try {
      await createVehicle(details).unwrap();
      toast.success("Add vehicle successfully");
    } catch (err: any) {
      toast.error(`${err.data?.message}`);
    }
  };

  const deleteHandler = async (id: string) => {
    try {
      await deleteVehicle(id).unwrap();
      toast("Vehicle deleted successfully");
    } catch (err: any) {
      toast.error(`${err.data?.message}`);
    }
  };

  if (vRoutesLoading || staffsLoading || isLoading) return <Loading />;

  return (
    <div className="">
      {/* add vehicle */}
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
                size="middle"
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
      {/* all vehicles */}
      <div className="dark:bg-bg_dark bg-white p-4 rounded-md mt-5">
        <div className="">
          <div className="w-full dark:bg-bg_dark bg-white py-5 rounded-md md:mb-0 mb-5 flex md:flex-row flex-col justify-between md:items-center items-start">
            <Title
              className="text-mirage dark:text-white !font-medium"
              level={4}
            >
              All Vehicles ({meta?.total})
            </Title>
            <div className="flex items-center">
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
            dataSource={vehicles}
            pageSize={size}
            totalPages={meta?.total}
            showSizeChanger={true}
            onPaginationChange={onPaginationChange}
            onTableChange={onTableChange}
            showPagination={true}
          />
        </div>
      </div>
    </div>
  );
};
