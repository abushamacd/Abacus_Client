/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-extra-boolean-cast */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useParams } from "react-router-dom";
import { useGetVehicleQuery } from "../../../redux/api/vehicle";
import Loading from "../../../components/ui/Loading";
import { Button, Card, Col, Input, Row } from "antd";
import { useState } from "react";
import { FaEdit } from "react-icons/fa";
import { MdDeleteForever, MdOutlineCancel } from "react-icons/md";
import { useGetVehicleStatementsQuery } from "../../../redux/api/vehicleStatement";
import { useDebounced } from "../../../redux/hooks";
import Title from "antd/es/typography/Title";
import { ReloadOutlined } from "@ant-design/icons";
import DataTable from "../../../components/ui/DataTable";
import { FiEdit } from "react-icons/fi";

export const VehicleDetails = () => {
  const params = useParams();
  const [isEdit, setIsEdit] = useState(true);
  const { data: vehicleData, isLoading: vehicleLoading } = useGetVehicleQuery(
    params?.id
  );
  const vehicle: any = vehicleData;

  // total calculation
  const totalIncome = vehicle?.income + vehicle?.welfare;
  const totalExpense = vehicle?.expense + vehicle?.servicing;
  const netProfitLoss = totalIncome - totalExpense;

  const query: Record<string, any> = {};
  const [page, setPage] = useState<number>(1);
  const [size, setSize] = useState<number>(10);
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

  // @ts-ignore
  const vehicleStatements: any = vehicleStatementData?.vehicleStatements;
  // @ts-ignore
  const meta = vehicleStatementData?.meta;

  console.log(vehicleStatements?.[0]);

  // console.log(vehicle);

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

  console.log("Total Income:", queryIncome);
  console.log("Total Expense:", queryExpense);
  console.log("Total Welfare:", queryWelfare);
  console.log("Total Servicing:", queryServicing);

  const columns = [
    {
      title: "Date",
      dataIndex: "date",
      sorter: true,
      render: function (statement: string) {
        const dateArray = statement.split(" ");
        return (
          <span className="">{`${dateArray[1]} ${dateArray[2]} ${dateArray[3]}`}</span>
        );
      },
    },
    {
      title: "Route",
      dataIndex: "route",
      sorter: true,
    },
    {
      title: "Oil (Liter) ",
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
      render: function (vehicleRoute: any) {
        return (
          <div className="flex gap-2">
            <FiEdit
              style={{ color: "#008A3F" }}
              // onClick={() => openEdit(vehicleRoute)}
              size={22}
            />
            <MdDeleteForever
              // onClick={() => deleteHandler(vehicleRoute?.id)}
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

  const fullDate = new Date().toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
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
          </Row>
        </Card>
      </section>
      {/* Total income statement */}
      <div className="dark:bg-bg_dark bg-white p-4 mt-5">
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
      <div className="dark:bg-bg_dark bg-white p-4 mt-5">
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
            <div className="mb-5 flex items-center">
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
    </div>
  );
};
