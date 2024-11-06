/* eslint-disable no-extra-boolean-cast */
/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button, Col, Input, Modal, Row, Select } from "antd";
import { BsGraphUpArrow } from "react-icons/bs";
import { BsGraphDownArrow } from "react-icons/bs";
import { FaSackDollar } from "react-icons/fa6";
import Loading from "../../../components/ui/Loading";
import {
  useGetVehicleStatementsQuery,
  useUpdateVehicleStatementMutation,
} from "../../../redux/api/vehicleStatement";
import { useState } from "react";
import {
  useAppDispatch,
  useAppSelector,
  useDebounced,
} from "../../../redux/hooks";
import { SelectOptions } from "../../../types";
import { useGetVehiclesQuery } from "../../../redux/api/vehicle";
import { ReloadOutlined } from "@ant-design/icons";
import DataTable from "../../../components/ui/DataTable";
import Title from "antd/es/typography/Title";
import {
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area,
} from "recharts";
import { FiEdit } from "react-icons/fi";
import { setEdit } from "../../../redux/features/siteSlice";
import Form from "../../../components/Forms/Forms";
import FormDatePicker from "../../../components/Forms/FormDatePicker";
import FormInput from "../../../components/Forms/FormInput";
import FormSelectField from "../../../components/Forms/FormSelectField";
import FormTextArea from "../../../components/Forms/FormTextArea";
import { useGetVehicleRoutesQuery } from "../../../redux/api/vehicleRoute";
import { SubmitHandler } from "react-hook-form";
import { toast } from "react-toastify";

type VStatementFormValues = {
  route: string;
  oil: number;
  income: number;
  expense: number;
  welfare: number;
  servicing: number;
  comment: string;
};

export const VehiclesOverview = () => {
  const dispatch = useAppDispatch();
  const { edit } = useAppSelector((state) => state.site);
  const editVehicleStatement: any = edit?.data;

  const query: Record<string, any> = {};
  const [page, setPage] = useState<number>(1);
  const [size, setSize] = useState<number>();
  const [vId, setVId] = useState<string>();
  const [sortBy, setSortBy] = useState<string>("");
  const [sortOrder, setSortOrder] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState<string>("");

  query["vehicleId"] = vId;
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
  // @ts-ignore
  const vehicleStatements: any = vehicleStatementData?.vehicleStatements;
  // @ts-ignore
  const meta = vehicleStatementData?.meta;

  const { data: vData, isLoading: vLoading } = useGetVehiclesQuery({});
  // @ts-ignore
  const allVehicles: any = vData?.vehicles;

  const vehicles: any[] = [];
  allVehicles?.forEach((vehicle: any) => {
    vehicles?.push({ label: vehicle?.vNumber, value: vehicle?.id });
  });

  const { data: vRoutes } = useGetVehicleRoutesQuery({});
  // @ts-ignore
  const vehicleRoutes: any = vRoutes?.vehicleRoutes;

  const routes: any[] = [];
  vehicleRoutes?.forEach((route: any) => {
    routes?.push({ label: route?.name, value: route?.name });
  });

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

  const totalIncome = queryIncome + queryWelfare;
  const totalExpanse = queryExpense + queryServicing;

  const columns = [
    {
      title: "Date",
      dataIndex: "date",
      sorter: true,
    },
    {
      title: "Vehicle No.",
      render: function (VehicleStatement: any) {
        return (
          <div className="flex gap-2">{VehicleStatement?.vehicle?.vNumber}</div>
        );
      },
    },
    {
      title: "Route",
      dataIndex: "route",
      sorter: true,
    },
    {
      title: `Oil (${+queryOil?.toFixed(2)} Litre) `,
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
            {profitLoss.toFixed(2)}
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
          </div>
        );
      },
    },
  ];

  const openEdit = (vehicleRoute: any) => {
    dispatch(setEdit({ data: vehicleRoute, state: true }));
  };

  const closeEdit = () => {
    dispatch(setEdit({ data: null, state: false }));
  };

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
    setVId(undefined);
    setSize(undefined);
    setSearchTerm("");
  };

  const CustomTooltip = ({
    active,
    payload,
    label,
  }: {
    active?: any;
    payload?: any;
    label?: any;
  }) => {
    if (active && payload && payload.length) {
      return (
        <div className="custom-tooltip bg-white dark:bg-bg_dark text-mirage dark:text-white p-2 rounded-md">
          <h4 className="italic text-lg">
            Vehicle No.: {payload[0].payload?.vehicle?.vNumber}
          </h4>
          <h4 className="italic text-base text-primary">On Date: {label}</h4>
          <hr />
          <p className="label capitalize">{`${
            payload[0].dataKey
          } : ${payload[0].value.toFixed(2)}`}</p>
          <p className="label capitalize">{`${
            payload[1].dataKey
          } : ${payload[1].value.toFixed(2)}`}</p>
          <p className="label capitalize">{`${
            payload[2].dataKey
          } : ${payload[2].value.toFixed(2)}`}</p>
          <p className="label capitalize">{`${
            payload[3].dataKey
          } : ${payload[3].value.toFixed(2)}`}</p>
          <p className="label capitalize">{`${
            payload[4].dataKey
          } : ${payload[4].value.toFixed(2)}`}</p>
          <p
            className={`label capitalize ${
              payload[1].value +
                payload[2].value -
                (payload[3].value + payload[4].value) >
              0
                ? "text-primary"
                : "text-[#D31818]"
            }`}
          >{`Profit: ${(
            payload[1].value +
            payload[2].value -
            (payload[3].value + payload[4].value)
          ).toFixed(2)}`}</p>
        </div>
      );
    }

    return null;
  };

  const [updateVehicleStatement] = useUpdateVehicleStatementMutation();

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

  if (vehicleStatementLoading || vLoading) return <Loading />;

  return (
    <div>
      <Row className="!mx-0" gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
        <Col className="gutter-row w-full mb-5 !px-0" sm={24} md={12} lg={8}>
          <div className="mr-0 md:mr-5 overflow-hidden rounded-md">
            <div
              className={`card_container before:bg-[#cdb4db] after:bg-[#cdb4db] relative bg-secondary p-4 rounded-md text-mirage dark:text-white`}
            >
              <div className="relative z-10">
                <BsGraphUpArrow
                  size={40}
                  className="border border-primary p-2 rounded-md"
                />
                <h1 className="text-3xl ao my-4">{totalIncome.toFixed(2)} ৳</h1>
                <p className="text-lg my-2">Total Income</p>
              </div>
            </div>
          </div>
        </Col>
        <Col className="gutter-row w-full mb-5 !px-0" sm={24} md={12} lg={8}>
          <div className="mr-0 md:mr-0 lg:mr-5 overflow-hidden rounded-md">
            <div
              className={`card_container before:bg-[#b5c6e0] after:bg-[#b5c6e0] relative bg-secondary p-4 rounded-md text-mirage dark:text-white`}
            >
              <div className="relative z-10">
                <BsGraphDownArrow
                  size={40}
                  className="border border-primary p-2 rounded-md"
                />
                <h1 className="text-3xl ao my-4">
                  {totalExpanse.toFixed(2)} ৳
                </h1>
                <p className="text-lg my-2">Total Expanse</p>
              </div>
            </div>
          </div>
        </Col>
        <Col className="gutter-row w-full mb-5 !px-0" sm={24} md={24} lg={8}>
          <div className="overflow-hidden rounded-md">
            <div
              className={`card_container before:bg-[#c3cfa0] after:bg-[#c3cfa0] relative bg-secondary p-4 rounded-md text-mirage dark:text-white`}
            >
              <div className="relative z-10">
                <FaSackDollar
                  size={40}
                  className="border border-primary p-2 rounded-md"
                />
                <h1 className="text-3xl ao my-4">
                  {(totalIncome - totalExpanse).toFixed(2)} ৳
                </h1>
                <p className="text-lg my-2">Total Profit</p>
              </div>
            </div>
          </div>
        </Col>
      </Row>
      {/* chart */}
      <div className="border border-primary rounded-md p-4 mb-5">
        <ResponsiveContainer width={"100%"} height={300}>
          <AreaChart
            data={vehicleStatements}
            margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
          >
            <defs>
              <linearGradient id="oil" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#82ca9d" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="income" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="welfare" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#f19c79" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#f19c79" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="expense" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#52b2cf" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#52b2cf" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="servicing" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#d0b8ac" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#d0b8ac" stopOpacity={0} />
              </linearGradient>
            </defs>
            {/* <CartesianGrid strokeDasharray="3 3" /> */}
            <XAxis dataKey="date" padding={{ left: 0, right: 0 }} />
            <YAxis />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Area
              type="monotone"
              dataKey="oil"
              stroke="#82ca9d"
              fillOpacity={1}
              fill="url(#oil)"
            />
            <Area
              type="monotone"
              dataKey="income"
              stroke="#8884d8"
              fillOpacity={1}
              fill="url(#income)"
            />
            <Area
              type="monotone"
              dataKey="welfare"
              stroke="#f19c79"
              fillOpacity={1}
              fill="url(#welfare)"
            />
            <Area
              type="monotone"
              dataKey="expense"
              stroke="#52b2cf"
              fillOpacity={1}
              fill="url(#expense)"
            />
            <Area
              type="monotone"
              dataKey="servicing"
              stroke="#d0b8ac"
              fillOpacity={1}
              fill="url(#servicing)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      {/* Query */}
      <Row className="!mx-0" gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
        <Col className="gutter-row w-full mb-5 !px-0" sm={24} md={8}>
          <div className="mr-0 md:mr-5 overflow-hidden rounded-md">
            <Select
              allowClear
              value={vId}
              className="w-full"
              showSearch
              placeholder="Select Vehicle"
              optionFilterProp="label"
              onChange={(value: string) => setVId(value)}
              options={vehicles as SelectOptions[]}
            />
          </div>
        </Col>
        <Col className="gutter-row w-full mb-5 !px-0" sm={24} md={8}>
          <div className="mr-0 md:mr-5 overflow-hidden rounded-md">
            <Input
              value={searchTerm}
              type="text"
              size="middle"
              className="bg-white text-mirage placeholder:text-mirage dark:placeholder:text-white dark:bg-black dark:text-white focus-within:!border-primary hover:!border-primary"
              placeholder="Search..."
              onChange={(e) => {
                setSearchTerm(e.target.value);
              }}
            />
          </div>
        </Col>
        <Col className="gutter-row w-full mb-5 !px-0" sm={24} md={8}>
          <div className="overflow-hidden rounded-md">
            <Input
              value={size}
              type="text"
              size="middle"
              className="bg-white text-mirage placeholder:text-mirage dark:placeholder:text-white dark:bg-black dark:text-white focus-within:!border-primary hover:!border-primary"
              placeholder="Number of Statements"
              onChange={(e) => {
                setSize(+e.target.value);
              }}
            />
          </div>
        </Col>
        <Col className="gutter-row w-full !px-0" sm={24} md={24} lg={24}>
          <div className="overflow-hidden rounded-md">
            <div>
              {(!!sortBy || !!sortOrder || !!vId || !!size || !!searchTerm) && (
                <Button
                  onClick={resetFilters}
                  className="bg-primary hover:!bg-primary text-mirage !bg-opacity-[.8] duration-300 transition-all mb-5"
                  size="middle"
                  htmlType="submit"
                  type="primary"
                  block
                >
                  Reset Query <ReloadOutlined />
                </Button>
              )}
            </div>
          </div>
        </Col>
      </Row>
      {/* Statement */}
      <div className="dark:bg-bg_dark bg-white p-4 rounded-md">
        <div className="">
          <div className="w-full dark:bg-bg_dark bg-white py-5 rounded-md md:mb-0 mb-5 flex md:flex-row flex-col justify-between md:items-center items-start">
            <Title
              className="text-mirage dark:text-white !font-medium"
              level={4}
            >
              Statements ( {meta?.total} )
            </Title>
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
            isSelection={false}
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
              md={8}
              style={{
                marginBottom: "15px",
                paddingLeft: "0px",
                width: "100%",
              }}
            >
              <FormInput
                name="oil"
                step={0.1}
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
                width: "100%",
              }}
            >
              <FormInput
                name="income"
                step={0.1}
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
                step={0.1}
                type="number"
                size="middle"
                label="Expense"
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
                name="welfare"
                step={0.1}
                type="number"
                size="middle"
                label="Welfare Cost"
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
                name="servicing"
                step={0.1}
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
