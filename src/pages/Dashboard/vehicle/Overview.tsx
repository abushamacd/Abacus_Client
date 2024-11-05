/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-extra-boolean-cast */
/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button, Col, Input, Row, Select } from "antd";
import { BsGraphUpArrow } from "react-icons/bs";
import { BsGraphDownArrow } from "react-icons/bs";
import { FaSackDollar } from "react-icons/fa6";
import Loading from "../../../components/ui/Loading";
import { useGetVehicleStatementsQuery } from "../../../redux/api/vehicleStatement";
import { useState } from "react";
import { useDebounced } from "../../../redux/hooks";
import { SelectOptions } from "../../../types";
import { useGetVehiclesQuery } from "../../../redux/api/vehicle";
import { ReloadOutlined } from "@ant-design/icons";
import DataTable from "../../../components/ui/DataTable";
import Title from "antd/es/typography/Title";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

export const VehiclesOverview = () => {
  const query: Record<string, any> = {};
  const [page, setPage] = useState<number>(1);
  const [size, setSize] = useState<number>();
  const [vId, setVId] = useState<string>();
  const [sortBy, setSortBy] = useState<string>("");
  const [sortOrder, setSortOrder] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState<string>("");

  query["limit"] = size;
  query["vehicleId"] = vId;
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
    setVId(undefined);
    setSize(undefined);
    setSearchTerm("");
  };

  const data = [
    {
      name: "Page A",
      uv: 4000,
      pv: 2400,
      amt: 2400,
    },
    {
      name: "Page B",
      uv: 3000,
      pv: 1398,
      amt: 2210,
    },
    {
      name: "Page C",
      uv: 2000,
      pv: 9800,
      amt: 2290,
    },
    {
      name: "Page D",
      uv: 2780,
      pv: 3908,
      amt: 2000,
    },
    {
      name: "Page E",
      uv: 1890,
      pv: 4800,
      amt: 2181,
    },
    {
      name: "Page F",
      uv: 2390,
      pv: 3800,
      amt: 2500,
    },
    {
      name: "Page G",
      uv: 3490,
      pv: 4300,
      amt: 2100,
    },
  ];

  if (vehicleStatementLoading || vLoading) return <Loading />;

  return (
    <div>
      <Row className="!mx-0" gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
        <Col className="gutter-row w-full mb-5 !px-0" sm={24} md={12} lg={8}>
          <div className="mr-0 md:mr-5 overflow-hidden rounded-md">
            <div
              className={`card_container before:bg-[#7c162e] after:bg-[#7c162e] relative bg-secondary p-4 rounded-md text-mirage dark:text-white`}
            >
              <div className="relative z-10">
                <BsGraphUpArrow
                  size={40}
                  className="border border-primary p-2 rounded-md"
                />
                <h1 className="text-3xl ao my-4">{totalIncome} ৳</h1>
                <p className="text-lg my-2">Total Income</p>
              </div>
            </div>
          </div>
        </Col>
        <Col className="gutter-row w-full mb-5 !px-0" sm={24} md={12} lg={8}>
          <div className="mr-0 md:mr-0 lg:mr-5 overflow-hidden rounded-md">
            <div
              className={`card_container before:bg-[#7c162e] after:bg-[#7c162e] relative bg-secondary p-4 rounded-md text-mirage dark:text-white`}
            >
              <div className="relative z-10">
                <BsGraphDownArrow
                  size={40}
                  className="border border-primary p-2 rounded-md"
                />
                <h1 className="text-3xl ao my-4">{totalExpanse} ৳</h1>
                <p className="text-lg my-2">Total Expanse</p>
              </div>
            </div>
          </div>
        </Col>
        <Col className="gutter-row w-full mb-5 !px-0" sm={24} md={24} lg={8}>
          <div className="overflow-hidden rounded-md">
            <div
              className={`card_container before:bg-[#7c162e] after:bg-[#7c162e] relative bg-secondary p-4 rounded-md text-mirage dark:text-white`}
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
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" padding={{ left: 0, right: 0 }} />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="pv"
              stroke="#8884d8"
              activeDot={{ r: 8 }}
            />
            <Line type="monotone" dataKey="uv" stroke="#82ca9d" />
          </LineChart>
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
        <Col className="gutter-row w-full mb-5 !px-0" sm={24} md={8}>
          <div className="overflow-hidden rounded-md">
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
    </div>
  );
};
