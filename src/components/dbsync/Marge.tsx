/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Button, Card, Col, Row } from "antd";
import { DBConnTest } from "../dbsync/DBConnTest";
import FormSelectField from "../Forms/FormSelectField";
import { SelectOptions } from "../../types";
import Form from "../Forms/Forms";
import { SubmitHandler } from "react-hook-form";
import { searchSchema } from "../../schemas/store";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  useDeleteUnMargeMutation,
  useGetUnMargeDataQuery,
} from "../../redux/api/dbsync";
import { useState } from "react";
import { toast } from "react-toastify";
import { BsDatabaseCheck } from "react-icons/bs";
import { useNavigate } from "react-router-dom";

type searchFormValues = {
  schemaName: string;
};

export const Marge = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useState("");

  // Define all schema name
  const units = [
    { label: "User", value: "user" },
    { label: "Unit", value: "unit" },
    { label: "Supplier", value: "supplier" },
    { label: "Product", value: "product" },
    { label: "Invoice", value: "invoice" },
    { label: "VehicleRoute", value: "vehicleRoute" },
    { label: "Vehicle", value: "vehicle" },
    { label: "VehicleStatement", value: "vehicleStatement" },
  ];

  const [deleteUnMarge] = useDeleteUnMargeMutation();

  const { data } = useGetUnMargeDataQuery(
    { schemaName: searchParams || "" },
    {
      skip: !searchParams,
    }
  );
  // @ts-ignore
  const unMarge: any = data?.unMargeData;

  // Get schema name from input
  const getHandler: SubmitHandler<searchFormValues> = (data) => {
    setSearchParams(data?.schemaName);
  };

  // Send unmarge data ids
  const unMargeHandler = async (data: any[]) => {
    const unMargeIds = data.map((item: any) => item.id);
    try {
      await deleteUnMarge({
        schemaName: searchParams,
        data: unMargeIds,
      }).unwrap();
      toast.success("Data marge successfully");
      navigate(`/adbmsdb/dbsync`, { replace: true });
    } catch (err: any) {
      toast.error(`${err.data?.message}`);
    }
  };

  return (
    <div className="">
      <div className="dark:bg-bg_dark bg-white p-4 rounded-md">
        <Card
          className="dark:bg-bg_dark bg-white text-mirage dark:text-white !border-secondary border-2"
          title=<>
            <div className="flex flex-wrap md:justify-between justify-center items-center gap-2 py-4">
              <p>DB Marge</p>
              <DBConnTest />
            </div>
          </>
        >
          <div className="">
            <Form
              submitHandler={getHandler}
              resolver={yupResolver(searchSchema)}
            >
              <Row
                className="!mx-0 items-center"
                gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}
              >
                <Col
                  className="gutter-row"
                  sm={24}
                  md={6}
                  style={{
                    marginBottom: "15px",
                    paddingLeft: "0px",
                    width: "100%",
                  }}
                >
                  <FormSelectField
                    name="schemaName"
                    label="Schema Name"
                    options={units as SelectOptions[]}
                    size="middle"
                    placeholder="Select Schema"
                    required
                  />
                </Col>
                <Col
                  className="gutter-row"
                  sm={24}
                  md={6}
                  style={{
                    marginBottom: "15px",
                    paddingLeft: "0px",
                    width: "100%",
                  }}
                >
                  <Button
                    className="bg-primary hover:!bg-primary text-mirage !bg-opacity-[.8] duration-300 transition-all md:mt-6 mt-2"
                    size="middle"
                    htmlType="submit"
                    type="primary"
                    // block
                  >
                    Get Data
                  </Button>
                </Col>
                <Col
                  className="gutter-row md:flex justify-end"
                  sm={24}
                  md={12}
                  style={{
                    marginBottom: "15px",
                    paddingLeft: "0px",
                    paddingRight: "0px",
                    width: "100%",
                  }}
                >
                  <Button
                    onClick={() => unMargeHandler(unMarge)}
                    className="bg-primary hover:!bg-primary text-mirage !bg-opacity-[.8] duration-300 transition-all md:mt-6 mt-2"
                    size="middle"
                    type="primary"
                    // block
                  >
                    Marge
                  </Button>
                </Col>
              </Row>
            </Form>
          </div>
          {unMarge?.length > 0 && (
            <div className="!border-secondary border-2 rounded-md h-48 overflow-auto">
              <Row
                className="!mx-0 items-center"
                gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}
              >
                {unMarge?.map((data: any) => (
                  <Col
                    key={data?.id}
                    className="gutter-row"
                    sm={12}
                    md={4}
                    style={{
                      marginBottom: "0px",
                      width: "100%",
                    }}
                  >
                    <div className="flex flex-col justify-center items-center p-4">
                      <BsDatabaseCheck size="40" className="text-primary" />
                      <p className="">
                        {data?.name ||
                          data?.vNumber ||
                          data?.route ||
                          data?.customerName ||
                          data?.date}
                      </p>
                    </div>
                  </Col>
                ))}
              </Row>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};
