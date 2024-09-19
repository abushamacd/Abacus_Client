/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable no-extra-boolean-cast */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { Button, Card, Input, Row } from "antd";
import Form from "../../../components/Forms/Forms";
import FormInput from "../../../components/Forms/FormInput";
import { SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { addRouteSchema } from "../../../schemas/vehicle";
import {
  useCreateVehicleRouteMutation,
  useDeleteVehicleRouteMutation,
  useGetVehicleRoutesQuery,
  useUpdateVehicleRouteMutation,
} from "../../../redux/api/vehicleRoute";
import { toast } from "react-toastify";
import Title from "antd/es/typography/Title";
import { useState } from "react";
import {
  useAppDispatch,
  useAppSelector,
  useDebounced,
} from "../../../redux/hooks";
import { ReloadOutlined } from "@ant-design/icons";
import DataTable from "../../../components/ui/DataTable";
import { MdDeleteForever } from "react-icons/md";
import { FiEdit } from "react-icons/fi";
import { setEdit } from "../../../redux/features/siteSlice";
import Modal from "antd/es/modal/Modal";

type UserFormValues = {
  name: string;
  phone: string;
  address: string;
};

export const VehicleRoutes = () => {
  const dispatch = useAppDispatch();
  const { edit } = useAppSelector((state) => state.site);

  const query: Record<string, any> = {};
  const [page, setPage] = useState<number>(1);
  const [size, setSize] = useState<number>(10);
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

  const { data, isLoading } = useGetVehicleRoutesQuery({ ...query });
  const [createVehicleRoute] = useCreateVehicleRouteMutation();
  const [updateVehicleRoute] = useUpdateVehicleRouteMutation();
  const [deleteVehicleRoute] = useDeleteVehicleRouteMutation();

  // @ts-ignore
  const vehicleRoutes: any = data?.vehicleRoutes;
  // @ts-ignore
  const meta = data?.meta;
  const editVehicleRoute: any = edit?.data;

  const defaultValues = {
    name: editVehicleRoute?.name || "",
  };

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      sorter: true,
    },
    {
      title: "Action",
      render: function (vehicleRoute: any) {
        return (
          <div className="flex gap-2">
            <FiEdit
              style={{ color: "#008A3F" }}
              onClick={() => openEdit(vehicleRoute)}
              size={22}
            />
            <MdDeleteForever
              onClick={() => deleteHandler(vehicleRoute?.id)}
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

  const openEdit = (vehicleRoute: any) => {
    dispatch(setEdit({ data: vehicleRoute, state: true }));
  };

  const closeEdit = () => {
    dispatch(setEdit({ data: null, state: false }));
  };

  const createHandler: SubmitHandler<UserFormValues> = async (data: {
    name: string;
  }) => {
    try {
      await createVehicleRoute(data).unwrap();
      toast.success("Add Route successfully");
    } catch (err: any) {
      toast.error(`${err.data?.message}`);
    }
  };

  const updateHandler: SubmitHandler<UserFormValues> = async (data: any) => {
    try {
      await updateVehicleRoute({
        id: editVehicleRoute.id,
        body: data,
      }).unwrap();
      toast("Route name updated successfully");
    } catch (err: any) {
      toast.error(`${err.data?.message}`);
    }
  };

  const deleteHandler = async (id: string) => {
    try {
      await deleteVehicleRoute(id).unwrap();
      toast("Route name deleted successfully");
    } catch (err: any) {
      toast.error(`${err.data?.message}`);
    }
  };

  return (
    <div className="md:flex flex-row gap-5">
      {/* all routes */}
      <div className="md:w-4/6 w-full dark:bg-bg_dark bg-white p-4 rounded-md">
        <div className="">
          <div className="w-full dark:bg-bg_dark bg-white py-5 rounded-md md:mb-0 mb-5 flex md:flex-row flex-col justify-between md:items-center items-start">
            <Title
              className="text-mirage dark:text-white !font-medium"
              level={4}
            >
              All Routes
            </Title>
            <div className="flex items-center">
              <Input
                type="text"
                size="middle"
                className="bg-bg text-mirage placeholder:text-mirage dark:placeholder:text-white dark:bg-black dark:text-white focus-within:!border-primary hover:!border-primary"
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
            dataSource={vehicleRoutes}
            pageSize={size}
            totalPages={meta?.total}
            showSizeChanger={true}
            onPaginationChange={onPaginationChange}
            onTableChange={onTableChange}
            showPagination={true}
          />
        </div>
      </div>
      {/* add route */}
      <div className="md:w-2/6 w-full dark:bg-bg_dark bg-white p-4 rounded-md">
        <Card
          title="Add New Route"
          className="dark:bg-bg_dark bg-white text-mirage dark:text-white !border-secondary border-2"
        >
          <Form
            submitHandler={createHandler}
            resolver={yupResolver(addRouteSchema)}
          >
            <div className="w-full flex md:flex-row flex-col items-start justify-between gap-5">
              <div className="w-full">
                <FormInput
                  name="name"
                  type="text"
                  size="middle"
                  label="Route Name"
                  required
                />
              </div>
            </div>
            <Row justify="start" align="middle">
              <Button
                className="bg-primary hover:!bg-primary text-mirage !bg-opacity-[.8] duration-300 transition-all mt-4"
                size="middle"
                htmlType="submit"
                type="primary"
                // block
              >
                Add Route
              </Button>
            </Row>
          </Form>
        </Card>
      </div>

      {/* edit modal */}
      <Modal
        title={`Update Route Name`}
        open={edit.editState}
        centered
        footer={null}
        onCancel={closeEdit}
      >
        <Form submitHandler={updateHandler} defaultValues={defaultValues}>
          <div
            style={{
              margin: "15px 0px",
            }}
          >
            <FormInput
              name="name"
              type="text"
              size="middle"
              label="Route Name"
              required
            />
          </div>

          <Row justify="start" align="middle">
            <Button
              className="bg-primary hover:!bg-primary text-mirage !bg-opacity-[.8] duration-300 transition-all mt-4"
              size="middle"
              htmlType="submit"
              type="primary"
              // block
            >
              Update
            </Button>
          </Row>
        </Form>
      </Modal>
    </div>
  );
};
