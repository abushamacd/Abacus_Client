/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useParams } from "react-router-dom";
import Loading from "../../../components/ui/Loading";
import { useGetInvoiceQuery } from "../../../redux/api/invoice";
import { useEffect, useState } from "react";
import { FaEdit } from "react-icons/fa";
import { MdOutlineCancel } from "react-icons/md";
import { Button, Card, Col, Row, Select } from "antd";
import Form from "../../../components/Forms/Forms";
import { useGetUsersQuery } from "../../../redux/api/userApi";
import { useDebounced } from "../../../redux/hooks";
import FormDatePicker from "../../../components/Forms/FormDatePicker";
import dayjs from "dayjs";

const formatedDate = (date: string) => {
  const newDate = new Date(date);

  // Extract the date components
  const day = String(newDate.getDate()).padStart(2, "0");
  const month = String(newDate.getMonth() + 1).padStart(2, "0"); // getMonth() returns 0-based month, so we add 1
  const year = newDate.getFullYear();

  // Manually format the date as DD/MM/YYYY
  const result = `${day}/${month}/${year}`;
  return result;
};

export const InvoiceDetails = () => {
  const [isEdit, setIsEdit] = useState(true);
  const params = useParams();
  const [errMessage, setErrMessage] = useState("");
  const [selectdUser, setSelectdUser] = useState<any>(null);

  const { data: invoiceData, isLoading: invoiceLoading } = useGetInvoiceQuery(
    params?.id
  );

  const invoice: any = invoiceData;

  const [customerSearchTerm, setCustomerSearchTerm] = useState<string>(
    invoice?.customerName
  );

  // Customer query
  const customerDebouncedTerm = useDebounced({
    searchQuery: customerSearchTerm,
    delay: 600,
  });

  const customerQuery: Record<string, any> = customerDebouncedTerm
    ? { searchTerm: customerDebouncedTerm }
    : {};

  const { data: usersData, isLoading: userLoading } = useGetUsersQuery({
    ...customerQuery,
  });
  // @ts-ignore
  const allUser: any = usersData?.users;

  const users = allUser?.map((user: any) => ({
    label: `${user?.name} - ${user?.address}`,
    value: user?.id,
  }));

  const onCustomerSearch = (value: string) => {
    setCustomerSearchTerm(value);
    setErrMessage("");
  };

  const onCustomerChange = (value: string) => {
    const filteredUser = allUser.filter((user: any) => user.id === value);
    setSelectdUser(filteredUser[0]);
    setErrMessage("");
  };

  const defaultValues = {
    date: dayjs(invoice?.date).format("DD/MM/YYYY") || "",
    note: invoice?.note || "",
    updateBy: invoice?.updateBy || "",
    total: invoice?.total || 0,
    due: invoice?.due || 0,
    profit: invoice?.profit || 0,
    discount: invoice?.discount || 0,
  };

  useEffect(() => {
    if (customerSearchTerm === "") {
      setCustomerSearchTerm("Unknown");
    } else if (customerSearchTerm?.length > 0) {
      setCustomerSearchTerm(customerSearchTerm);
    } else {
      setCustomerSearchTerm(invoice?.customerName);
    }
  }, [customerSearchTerm, invoice]);

  if (invoiceLoading || userLoading) {
    return <Loading />;
  }
  const products = JSON.parse(invoice?.products);
  // @ts-ignore
  console.log(defaultValues, products);

  const updateHandler = async (data: any) => {
    data.date = formatedDate(data.date);
    console.log(data);
    // try {
    //   await updateProduct({
    //     id: params?.id,
    //     body: data,
    //   }).unwrap();
    //   toast("Product updated successfully");
    // } catch (err: any) {
    //   toast.error(`${err.data?.message}`);
    // }
  };

  return (
    <div>
      <section className="dark:bg-bg_dark bg-white p-4 rounded-md">
        <Card
          title={
            <div className="flex gap-1 items-center">
              <span className="">Invoice Details</span>
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
          <Form
            submitHandler={updateHandler}
            // resolver={yupResolver(addProductSchema)}
            defaultValues={defaultValues}
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
                <div className="mb-1">
                  <span className="text-mirage dark:text-white">
                    Select Customer
                  </span>
                  <span
                    style={{
                      color: "red",
                      marginLeft: "2px",
                    }}
                  >
                    *
                  </span>
                </div>
                <Select
                  allowClear
                  className="w-full"
                  showSearch
                  placeholder="Search customer"
                  optionFilterProp="label"
                  onChange={onCustomerChange}
                  onSearch={onCustomerSearch}
                  options={users}
                />
                {errMessage?.includes("customer") && (
                  <small style={{ color: "red" }}>{errMessage}</small>
                )}
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
                md={24}
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
        </Card>
      </section>
    </div>
  );
};
