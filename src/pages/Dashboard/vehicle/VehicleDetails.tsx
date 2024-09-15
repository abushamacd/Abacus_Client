/* eslint-disable @typescript-eslint/no-explicit-any */
import { useParams } from "react-router-dom";
import { useGetVehicleQuery } from "../../../redux/api/vehicle";
import Loading from "../../../components/ui/Loading";
import { Card, Col, Row } from "antd";
import { useState } from "react";
import { FaEdit } from "react-icons/fa";
import { MdOutlineCancel } from "react-icons/md";

export const VehicleDetails = () => {
  const params = useParams();
  const [isEdit, setIsEdit] = useState(true);
  const { data: vehicleData, isLoading: loading } = useGetVehicleQuery(
    params?.id
  );

  if (loading) return <Loading />;

  const vehicle: any = vehicleData;
  console.log(vehicle);
  const fullDate = new Date().toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  return (
    <div>
      {/* details */}
      <section className="dark:bg-bg_dark bg-white p-4 rounded-md">
        <h1 className="w-full  border-2 border-secondary rounded-md mb-4 text-[8vw] text-center text-primary ao">
          {vehicle?.vNumber}
        </h1>
        <Card
          title={
            <div className="flex gap-2 items-center">
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
          <div className="income_statement mt-4">
            <div className="border-t border-secondary text-center">
              <h1 className="mb-1 text-lg text-primary ">Income Statement</h1>
              <span className="">{fullDate} (Total) </span>
            </div>
            <div className="overflow-x-auto">
              <table className="md:min-w-full w-[500px] table-auto border-separate">
                <thead>
                  <tr className="bg-secondary">
                    <th className="text-left p-3 w-[60%]">Particulers</th>
                    <th className="text-right p-3 w-[20%]">Amount (BDT) </th>
                    <th className="text-right p-3 w-[20%]">Amount (BDT) </th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="hover:bg-secondary duration-300">
                    <td className="p-3 underline">Income</td>
                    <td className="p-3"></td>
                    <td className="p-3"></td>
                  </tr>
                  <tr className="hover:bg-secondary duration-300">
                    <td className="p-3 pl-6">Revenue</td>
                    <td className="p-3 text-right">{vehicle?.income}</td>
                    <td className="p-3 text-right"></td>
                  </tr>
                  <tr className="hover:bg-secondary duration-300">
                    <td className="p-3 pl-6">Welfare</td>
                    <td className="p-3 text-right">{vehicle?.welfare}</td>
                    <td className="p-3"></td>
                  </tr>
                  <tr className="hover:bg-secondary duration-300 text-primary">
                    <td className="p-3 text-right">Total Income = </td>
                    <td className="p-3 text-right">-------------</td>
                    <td className="p-3 text-right ">
                      {vehicle?.income + vehicle?.welfare}
                    </td>
                  </tr>
                  <tr className="hover:bg-secondary duration-300">
                    <td className="p-3 underline">Expense</td>
                    <td className="p-3"></td>
                    <td className="p-3"></td>
                  </tr>
                  <tr className="hover:bg-secondary duration-300">
                    <td className="p-3 pl-6">Oil and Staff Cost</td>
                    <td className="p-3 text-right">{vehicle?.expense}</td>
                    <td className="p-3 text-right"></td>
                  </tr>
                  <tr className="hover:bg-secondary duration-300">
                    <td className="p-3 pl-6">Servicing</td>
                    <td className="p-3 text-right">{vehicle?.servicing}</td>
                    <td className="p-3"></td>
                  </tr>
                  <tr className="hover:bg-secondary duration-300 text-primary">
                    <td className="p-3 text-right">Total Expense = </td>
                    <td className="p-3 text-right">-------------</td>
                    <td className="p-3 text-right ">
                      {vehicle?.expense + vehicle?.servicing}
                    </td>
                  </tr>
                  <tr className="hover:bg-secondary duration-300 text-primary">
                    <td className="p-3 text-right"></td>
                    <td className="p-3 text-right"></td>
                    <td className="p-3 text-right">-------------</td>
                  </tr>
                  <tr className="hover:bg-secondary duration-300 text-primary">
                    <td className="p-3 text-right">Total Profit/Loss = </td>
                    <td className="p-3 text-right">-------------</td>
                    <td className="p-3 text-right">
                      {vehicle?.income +
                        vehicle?.welfare -
                        (vehicle?.expense + vehicle?.servicing)}
                    </td>
                  </tr>
                  <tr className="hover:bg-secondary duration-300 text-primary">
                    <td className="p-3 text-right"></td>
                    <td className="p-3 text-right"></td>
                    <td className="p-3 text-right">=============</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </Card>
      </section>
    </div>
  );
};
