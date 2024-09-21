/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable no-extra-boolean-cast */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useParams } from "react-router-dom";
import {
  useGetVehicleQuery,
  useUpdateVehicleMutation,
} from "../../../redux/api/vehicle";
import Loading from "../../../components/ui/Loading";
import { Button, Card, Col, Input, Modal, Row } from "antd";
import { useState } from "react";
import { FaEdit } from "react-icons/fa";
import { MdDeleteForever, MdOutlineCancel } from "react-icons/md";
import {
  useDeleteVehicleStatementMutation,
  useGetVehicleStatementsQuery,
  useUpdateVehicleStatementMutation,
} from "../../../redux/api/vehicleStatement";
import {
  useAppDispatch,
  useAppSelector,
  useDebounced,
} from "../../../redux/hooks";
import Title from "antd/es/typography/Title";
import { ReloadOutlined } from "@ant-design/icons";
import DataTable from "../../../components/ui/DataTable";
import { FiEdit } from "react-icons/fi";
import { toast } from "react-toastify";
import Form from "../../../components/Forms/Forms";
import { SubmitHandler } from "react-hook-form";
import FormInput from "../../../components/Forms/FormInput";
import { SelectOptions } from "../../../types";
import FormSelectField from "../../../components/Forms/FormSelectField";
import { useGetVehicleRoutesQuery } from "../../../redux/api/vehicleRoute";
import { useGetUsersQuery } from "../../../redux/api/userApi";
import FormTextArea from "../../../components/Forms/FormTextArea";
import { setEdit } from "../../../redux/features/siteSlice";
import FormDatePicker from "../../../components/Forms/FormDatePicker";

type VehicleFormValues = {
  vNumber: string;
  routes: string;
  route?: string;
  driverId: string;
  supervisorId: string;
  comment: string;
};

type VStatementFormValues = {
  route: string;
  oil: number;
  income: number;
  expense: number;
  welfare: number;
  servicing: number;
  comment: string;
};

export const VehicleDetails = () => {
  const params = useParams();
  const [isEdit, setIsEdit] = useState(true);
  const dispatch = useAppDispatch();
  const { edit } = useAppSelector((state) => state.site);
  const { data: vehicleData, isLoading: vehicleLoading } = useGetVehicleQuery(
    params?.id
  );
  const vehicle: any = vehicleData;

  const { data: vRoutes } = useGetVehicleRoutesQuery({});

  const { data: users } = useGetUsersQuery({
    role: "Staff",
  });

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

  const defaultValues = {
    vNumber: vehicle?.vNumber || "",
    route: vehicle?.route || "",
    runningRoute: vehicle?.runningRoute || "",
    driverId: vehicle?.driverId || "",
    supervisorId: vehicle?.supervisorId || "",
    comment: vehicle?.comment || "",
  };

  // total calculation
  const totalIncome = vehicle?.income + vehicle?.welfare;
  const totalExpense = vehicle?.expense + vehicle?.servicing;
  const netProfitLoss = totalIncome - totalExpense;

  const query: Record<string, any> = {};
  const [page, setPage] = useState<number>(1);
  const [size, setSize] = useState<number>(50);
  const [sortBy, setSortBy] = useState<string>("");
  const [sortOrder, setSortOrder] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState<string>("");

  query["vehicleId"] = params?.id;
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

  const { data: vehicleStatementData, isLoading: vehicleStatementLoading } =
    useGetVehicleStatementsQuery({ ...query });

  const [deleteVehicleStatement] = useDeleteVehicleStatementMutation();

  const [updateVehicle] = useUpdateVehicleMutation();
  const [updateVehicleStatement] = useUpdateVehicleStatementMutation();

  // @ts-ignore
  const vehicleStatements: any = vehicleStatementData?.vehicleStatements;
  // @ts-ignore
  const meta = vehicleStatementData?.meta;

  const queryIncome = vehicleStatements?.reduce(
    (sum: any, record: { income: any }) => sum + record.income,
    0
  );
  const queryExpense = vehicleStatements?.reduce(
    (sum: any, record: { expense: any }) => sum + record.expense,
    0
  );
  const queryWelfare = vehicleStatements?.reduce(
    (sum: any, record: { welfare: any }) => sum + record.welfare,
    0
  );
  const queryServicing = vehicleStatements?.reduce(
    (sum: any, record: { servicing: any }) => sum + record.servicing,
    0
  );
  const queryOil = vehicleStatements?.reduce(
    (sum: any, record: { oil: any }) => sum + record.oil,
    0
  );

  const queryNetProfitLoss =
    queryIncome + queryWelfare - (queryExpense + queryServicing);

  const openEdit = (vehicleRoute: any) => {
    dispatch(setEdit({ data: vehicleRoute, state: true }));
  };

  const closeEdit = () => {
    dispatch(setEdit({ data: null, state: false }));
  };

  const editVehicleStatement: any = edit?.data;

  const statementDefaultValues = {
    date: editVehicleStatement?.date || "",
    route: editVehicleStatement?.route || "",
    comment: editVehicleStatement?.comment || "",
    oil: editVehicleStatement?.oil,
    income: editVehicleStatement?.income || 0,
    expense: editVehicleStatement?.expense || 0,
    servicing: editVehicleStatement?.servicing || 0,
    welfare: editVehicleStatement?.welfare || 0,
  };

  const deleteHandler = async (id: string) => {
    try {
      await deleteVehicleStatement(id).unwrap();
      toast("Statement deleted successfully");
    } catch (err: any) {
      toast.error(`${err.data?.message}`);
    }
  };

  const updateHandler: SubmitHandler<VehicleFormValues> = async (
    data: VehicleFormValues
  ) => {
    try {
      await updateVehicle({
        id: params?.id,
        body: data,
      }).unwrap();
      toast("Vehicle updated successfully");
    } catch (err: any) {
      toast.error(`${err.data?.message}`);
    }
  };

  const statementUpdateHandler: SubmitHandler<VStatementFormValues> = async (
    formData: VStatementFormValues
  ) => {
    const { comment, ...others } = formData;
    const data: { [key: string]: string | number } = {};

    for (const [key, value] of Object.entries(others)) {
      data[key] = isNaN(Number(value)) ? value : Number(value);
    }

    data.comment = comment;

    const newDate = new Date(data?.date);

    // Format the date to Bangladesh Standard Time (BST)
    const formattedDate = newDate.toLocaleString("en-GB", {
      timeZone: "Asia/Dhaka",
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
    data.date = formattedDate;

    try {
      await updateVehicleStatement({
        id: editVehicleStatement?.id,
        body: data,
      }).unwrap();
      toast("Statement updated successfully");
    } catch (err: any) {
      toast.error(`${err.data?.message}`);
    }
  };

  const columns = [
    {
      title: "Date",
      dataIndex: "date",
      sorter: true,
    },
    {
      title: "Route",
      dataIndex: "route",
      sorter: true,
    },
    {
      title: `Oil (${queryOil} Litre) `,
      dataIndex: "oil",
      sorter: true,
    },
    {
      title: "Profit/Loss",
      render: function (statement: any) {
        const profitLoss =
          statement?.income +
          statement?.welfare -
          (statement?.expense + statement?.servicing);
        return (
          <span
            className={`${profitLoss > 0 ? "text-primary" : "text-[#D31818]"}`}
          >
            {profitLoss}
          </span>
        );
      },
    },
    {
      title: "Action",
      render: function (VehicleStatement: any) {
        return (
          <div className="flex gap-2">
            <FiEdit
              style={{ color: "#008A3F" }}
              onClick={() => openEdit(VehicleStatement)}
              size={22}
            />
            <MdDeleteForever
              onClick={() => deleteHandler(VehicleStatement?.id)}
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

  const fullDate = new Date().toLocaleString("en-GB", {
    timeZone: "Asia/Dhaka",
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  if (vehicleLoading || vehicleStatementLoading) return <Loading />;

  return (
    <div>
      {/* details */}
      <section className="dark:bg-bg_dark bg-white p-4 rounded-md">
        <h1 className="w-full  border-2 border-secondary rounded-md mb-4 text-[8vw] text-center text-primary ao">
          {vehicle?.vNumber}
        </h1>
        <Card
          title={
            <div className="flex gap-1 items-center">
              <span className="">Vehicle Details</span>
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
                Route Info
              </h1>
              <span className="tracking-wide block">
                <span className="!font-bold">Registerd Route: </span>
                <span className="italic">{vehicle?.route}</span>
              </span>
              <span className="tracking-wide block">
                <span className="!font-bold">Running Route: </span>
                <span className="italic">{vehicle?.runningRoute}</span>
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
                Driver Info
              </h1>
              <span className="tracking-wide block">
                <span className="!font-bold">Name: </span>
                <span className="italic">{vehicle?.driver?.name}</span>
              </span>
              <span className="tracking-wide block">
                <span className="!font-bold">Phone: </span>
                <span className="italic">{vehicle?.driver?.phone}</span>
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
                Supervisor Info
              </h1>
              <span className="tracking-wide block">
                <span className="!font-bold">Name: </span>
                <span className="italic">{vehicle?.supervisor?.name}</span>
              </span>
              <span className="tracking-wide block">
                <span className="!font-bold">Phone: </span>
                <span className="italic">{vehicle?.supervisor?.phone}</span>
              </span>
            </Col>
            {vehicle?.comment && (
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
                  <span className="italic">{vehicle?.comment}</span>
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
                    }}
                  >
                    <FormInput
                      name="vNumber"
                      type="text"
                      size="middle"
                      label="Vehicle No."
                      placeholder="2131"
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
                      name="route"
                      label="Route"
                      options={routes as SelectOptions[]}
                      size="middle"
                      placeholder="Select"
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
                      name="runningRoute"
                      label="Running Route"
                      options={routes as SelectOptions[]}
                      size="middle"
                      placeholder="Select"
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
      {/* Total income statement */}
      <div className="dark:bg-bg_dark bg-white p-4 mt-5 rounded-md">
        <div className=" p-4 rounded-md  text-mirage dark:text-white !border-secondary border-2">
          <div className="income_statement">
            <div className="text-center py-4">
              <h1 className="mb-1 text-lg text-primary ">Income Statement</h1>
              <span className="">{fullDate} (Total) </span>
            </div>
            <div className="overflow-x-auto">
              <table className="md:min-w-full w-[500px] table-auto border-separate">
                <thead>
                  <tr className="bg-secondary">
                    <th className="text-left p-1 w-[60%]">Particulers</th>
                    <th className="text-right p-1 w-[20%]">Amount (BDT) </th>
                    <th className="text-right p-1 w-[20%]">Amount (BDT) </th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="hover:bg-secondary duration-300">
                    <td className="p-1 underline">Income</td>
                    <td className="p-1"></td>
                    <td className="p-1"></td>
                  </tr>
                  <tr className="hover:bg-secondary duration-300">
                    <td className="p-1 pl-6">Revenue</td>
                    <td className="p-1 text-right">{vehicle?.income}</td>
                    <td className="p-1 text-right"></td>
                  </tr>
                  <tr className="hover:bg-secondary duration-300">
                    <td className="p-1 pl-6">Welfare</td>
                    <td className="p-1 text-right">{vehicle?.welfare}</td>
                    <td className="p-1"></td>
                  </tr>
                  <tr className="hover:bg-secondary duration-300 text-primary">
                    <td className="p-1 text-right">Total Income = </td>
                    <td className="p-1 text-right">-------------</td>
                    <td className="p-1 text-right ">{totalIncome}</td>
                  </tr>
                  <tr className="hover:bg-secondary duration-300">
                    <td className="p-1 underline">Expense</td>
                    <td className="p-1"></td>
                    <td className="p-1"></td>
                  </tr>
                  <tr className="hover:bg-secondary duration-300">
                    <td className="p-1 pl-6">Oil and Staff Cost</td>
                    <td className="p-1 text-right">{vehicle?.expense}</td>
                    <td className="p-1 text-right"></td>
                  </tr>
                  <tr className="hover:bg-secondary duration-300">
                    <td className="p-1 pl-6">Servicing</td>
                    <td className="p-1 text-right">{vehicle?.servicing}</td>
                    <td className="p-1"></td>
                  </tr>
                  <tr className="hover:bg-secondary duration-300 text-primary">
                    <td className="p-1 text-right">Total Expense = </td>
                    <td className="p-1 text-right">-------------</td>
                    <td className="p-1 text-right ">{totalExpense}</td>
                  </tr>
                  <tr className="hover:bg-secondary duration-300 text-primary">
                    <td className="p-1 text-right"></td>
                    <td className="p-1 text-right"></td>
                    <td className="p-1 text-right">-------------</td>
                  </tr>
                  <tr
                    className={`hover:bg-secondary duration-300 ${
                      netProfitLoss > 0 ? "text-primary" : "text-[#D31818]"
                    }`}
                  >
                    <td className="p-1 text-right">Net Profit/Loss = </td>
                    <td className="p-1 text-right">-------------</td>
                    <td className="p-1 text-right">{netProfitLoss}</td>
                  </tr>
                  <tr
                    className={`hover:bg-secondary duration-300 ${
                      netProfitLoss > 0 ? "text-primary" : "text-[#D31818]"
                    }`}
                  >
                    <td className="p-1 text-right"></td>
                    <td className="p-1 text-right"></td>
                    <td className="p-1 text-right">=============</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      {/* Query income statement */}
      <div className="dark:bg-bg_dark bg-white p-4 mt-5 rounded-md">
        <div className=" p-4 rounded-md  text-mirage dark:text-white !border-secondary border-2">
          <div className="income_statement">
            <div className="text-center py-4">
              <h1 className="mb-1 text-lg text-primary ">Income Statement</h1>
              <span className="">{fullDate} (Query) </span>
            </div>
            <div className="overflow-x-auto">
              <table className="md:min-w-full w-[500px] table-auto border-separate">
                <thead>
                  <tr className="bg-secondary">
                    <th className="text-left p-1 w-[60%]">Particulers</th>
                    <th className="text-right p-1 w-[20%]">Amount (BDT) </th>
                    <th className="text-right p-1 w-[20%]">Amount (BDT) </th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="hover:bg-secondary duration-300">
                    <td className="p-1 underline">Income</td>
                    <td className="p-1"></td>
                    <td className="p-1"></td>
                  </tr>
                  <tr className="hover:bg-secondary duration-300">
                    <td className="p-1 pl-6">Revenue</td>
                    <td className="p-1 text-right">{queryIncome}</td>
                    <td className="p-1 text-right"></td>
                  </tr>
                  <tr className="hover:bg-secondary duration-300">
                    <td className="p-1 pl-6">Welfare</td>
                    <td className="p-1 text-right">{queryWelfare}</td>
                    <td className="p-1"></td>
                  </tr>
                  <tr className="hover:bg-secondary duration-300 text-primary">
                    <td className="p-1 text-right">Total Income = </td>
                    <td className="p-1 text-right">-------------</td>
                    <td className="p-1 text-right ">
                      {queryIncome + queryWelfare}
                    </td>
                  </tr>
                  <tr className="hover:bg-secondary duration-300">
                    <td className="p-1 underline">Expense</td>
                    <td className="p-1"></td>
                    <td className="p-1"></td>
                  </tr>
                  <tr className="hover:bg-secondary duration-300">
                    <td className="p-1 pl-6">Oil and Staff Cost</td>
                    <td className="p-1 text-right">{queryExpense}</td>
                    <td className="p-1 text-right"></td>
                  </tr>
                  <tr className="hover:bg-secondary duration-300">
                    <td className="p-1 pl-6">Servicing</td>
                    <td className="p-1 text-right">{queryServicing}</td>
                    <td className="p-1"></td>
                  </tr>
                  <tr className="hover:bg-secondary duration-300 text-primary">
                    <td className="p-1 text-right">Total Expense = </td>
                    <td className="p-1 text-right">-------------</td>
                    <td className="p-1 text-right ">
                      {queryExpense + queryServicing}
                    </td>
                  </tr>
                  <tr className="hover:bg-secondary duration-300 text-primary">
                    <td className="p-1 text-right"></td>
                    <td className="p-1 text-right"></td>
                    <td className="p-1 text-right">-------------</td>
                  </tr>
                  <tr
                    className={`hover:bg-secondary duration-300 ${
                      queryNetProfitLoss > 0 ? "text-primary" : "text-[#D31818]"
                    }`}
                  >
                    <td className="p-1 text-right">Net Profit/Loss = </td>
                    <td className="p-1 text-right">-------------</td>
                    <td className="p-1 text-right">{queryNetProfitLoss}</td>
                  </tr>
                  <tr
                    className={`hover:bg-secondary duration-300 ${
                      queryNetProfitLoss > 0 ? "text-primary" : "text-[#D31818]"
                    }`}
                  >
                    <td className="p-1 text-right"></td>
                    <td className="p-1 text-right"></td>
                    <td className="p-1 text-right">=============</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      {/* Statement */}
      <div className="dark:bg-bg_dark bg-white p-4 rounded-md mt-5">
        <div className="">
          <div className="w-full dark:bg-bg_dark bg-white py-5 rounded-md md:mb-0 mb-5 flex md:flex-row flex-col justify-between md:items-center items-start">
            <Title
              className="text-mirage dark:text-white !font-medium"
              level={4}
            >
              Statements
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
            loading={vehicleStatementLoading}
            columns={columns}
            dataSource={vehicleStatements}
            pageSize={size}
            totalPages={meta?.total}
            showSizeChanger={true}
            onPaginationChange={onPaginationChange}
            onTableChange={onTableChange}
            showPagination={true}
          />
        </div>
      </div>
      {/* edit modal */}
      <Modal
        title={`Update Statement (${editVehicleStatement?.date})`}
        open={edit.editState}
        centered
        footer={null}
        onCancel={closeEdit}
      >
        <Form
          submitHandler={statementUpdateHandler}
          defaultValues={statementDefaultValues}
        >
          <Row className="!mx-0" gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
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
              md={12}
              style={{
                marginBottom: "15px",
                paddingLeft: "0px",
                width: "100%",
              }}
            >
              <FormSelectField
                name="route"
                label="Route"
                options={routes as SelectOptions[]}
                size="middle"
                placeholder="Select"
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
              md={12}
              style={{
                marginBottom: "15px",
                paddingLeft: "0px",
                width: "100%",
              }}
            >
              <FormInput
                name="income"
                type="number"
                size="middle"
                label="Income"
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
                name="expense"
                type="number"
                size="middle"
                label="Expense"
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
                name="welfare"
                type="number"
                size="middle"
                label="Welfare Cost"
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
                name="servicing"
                type="number"
                size="middle"
                label="Servicing Cost"
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
              <FormTextArea name="comment" label="Details" placeholder="Note" />
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
              Update
            </Button>
          </Row>
        </Form>
      </Modal>
    </div>
  );
};
