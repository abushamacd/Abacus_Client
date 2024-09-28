/* eslint-disable no-extra-boolean-cast */
/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import text_logo from "../../../assets/text_logo.png";
import Loading from "../../../components/ui/Loading";
import { useGetUsersQuery } from "../../../redux/api/userApi";
import {
  useAppDispatch,
  useAppSelector,
  useDebounced,
} from "../../../redux/hooks";
import { Button, Col, Row, Select } from "antd";
import { setView } from "../../../redux/features/siteSlice";
import Form from "../../../components/Forms/Forms";
import FormInput from "../../../components/Forms/FormInput";
import FormDatePicker from "../../../components/Forms/FormDatePicker";
import FormSelectField from "../../../components/Forms/FormSelectField";
import { SelectOptions } from "../../../types";

export const Invoice = () => {
  const dispatch = useAppDispatch();
  const { view } = useAppSelector((state) => state.site);

  // Format the date to Bangladesh Standard Time (BST)
  const formattedDate = new Date().toLocaleString("en-GB", {
    timeZone: "Asia/Dhaka",
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  const query: Record<string, any> = {};
  const [searchTerm, setSearchTerm] = useState<string>("Unknown");

  useEffect(() => {
    if (searchTerm === "") {
      setSearchTerm("Unknown");
    }
  }, [searchTerm]);

  const debouncedTerm = useDebounced({
    searchQuery: searchTerm,
    delay: 600,
  });

  if (!!debouncedTerm) {
    query["searchTerm"] = debouncedTerm;
  }

  const { data: usersData, isLoading: staffsLoading } = useGetUsersQuery({
    ...query,
  });
  // @ts-ignore
  const allUser: any = usersData?.users;

  const users: any[] = [];
  allUser?.forEach((user: any) => {
    users?.push({ label: `${user?.name}- ${user?.address} `, value: user?.id });
  });

  const onChange = (value: string) => {
    const filteredUser = allUser.filter((user: any) => user.id === value);
    dispatch(
      setView({
        data: filteredUser.length > 0 ? filteredUser?.[0] : null,
        state: filteredUser.length > 0 && true,
      })
    );
  };

  const role = [
    {
      label: "Owner",
      value: "Owner",
    },
    {
      label: "Manager",
      value: "Manager",
    },
    {
      label: "Staff",
      value: "Staff",
    },
    {
      label: "Retailer",
      value: "Retailer",
    },
    {
      label: "Consumer",
      value: "Consumer",
    },
  ];

  const createHandler = (data: any) => {
    console.log(data);
  };

  const onSearch = (value: string) => {
    setSearchTerm(value);
    dispatch(setView({ data: null, state: false }));
  };

  const selectdUser: any = view?.data;
  console.log(selectdUser);

  const defaultValues = {
    name: selectdUser?.name || "",
    role: selectdUser?.role || "",
  };
  console.log(selectdUser?.name);

  if (staffsLoading) {
    return <Loading />;
  }
  return (
    <div>
      <section className="dark:bg-bg_dark bg-white p-4 rounded-md">
        <div className="dark:bg-bg_dark bg-white text-mirage dark:text-white !border-secondary border-2 rounded-md">
          {/* store info */}
          <div className="store_info p-2">
            <img
              src={text_logo}
              alt="User Cover"
              className="w-auto h-[2rem] md:h-[4rem] mx-auto"
            />
            <h4 className="text-center text-[.6rem] md:text-[1rem]">
              Notun Dorbespur, Meherpur.
            </h4>
            <p className="text-center text-[.6rem] md:text-[1rem]">
              {formattedDate}
            </p>
          </div>
          <div className="md:w-64 flex items-center justify-center mx-auto px-4">
            <Select
              allowClear
              className="w-full"
              showSearch
              placeholder="Search customer"
              optionFilterProp="label"
              onChange={onChange}
              onSearch={onSearch}
              options={users}
            />
          </div>
          {/* user info */}
          <div className="py-4 border-t-2 border-secondary mt-4 mx-4">
            <Row className="!mx-0" gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
              <Col
                className="gutter-row"
                sm={24}
                md={6}
                style={{
                  marginBottom: "15px",
                  paddingLeft: "0px",
                }}
              >
                <span className="tracking-wide block">
                  <span className="!font-bold">Customer Name: </span>
                  <span className="italic">{selectdUser?.name}</span>
                </span>
              </Col>
              <Col
                className="gutter-row"
                sm={24}
                md={6}
                style={{
                  marginBottom: "15px",
                  paddingLeft: "0px",
                }}
              >
                <span className="tracking-wide block">
                  <span className="!font-bold">Address: </span>
                  <span className="italic">{selectdUser?.address}</span>
                </span>
              </Col>
              <Col
                className="gutter-row"
                sm={24}
                md={6}
                style={{
                  marginBottom: "15px",
                  paddingLeft: "0px",
                }}
              >
                <div className="tracking-wide flex items-center gap-1">
                  <div className="!font-bold">Status: </div>
                  <div
                    style={{ backgroundColor: `${selectdUser?.status}` }}
                    className="italic h-4 w-4 rounded-full"
                  ></div>
                </div>
              </Col>
              <Col
                className="gutter-row"
                sm={24}
                md={6}
                style={{
                  marginBottom: "15px",
                  paddingLeft: "0px",
                }}
              >
                <span className="tracking-wide block">
                  <span className="!font-bold">Previous:</span>
                  <span
                    className={`italic ${
                      selectdUser?.previous > 0 && "text-[#D31818] !font-bold"
                    }`}
                  >
                    {selectdUser?.previous}
                  </span>
                </span>
              </Col>
            </Row>
          </div>

          {/* products info */}
          <div className="p-4">
            <Form
              submitHandler={createHandler}
              // resolver={yupResolver(addProductSchema)}
              defaultValues={defaultValues}
            >
              <Row
                className="!mx-0 border-b-2 border-secondary mb-4"
                gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}
              >
                <Col
                  className="gutter-row"
                  sm={24}
                  md={6}
                  style={{
                    marginBottom: "15px",
                    paddingLeft: "0px",
                  }}
                >
                  <FormInput
                    disabled
                    name="name"
                    type="number"
                    size="middle"
                    label="Invoice number"
                    placeholder="Invoice number"
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
                  <FormDatePicker
                    name="date"
                    label="Invoice Date"
                    size="middle"
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
                  <FormSelectField
                    name="role"
                    label="Customer type"
                    options={role as SelectOptions[]}
                    size="middle"
                    placeholder="Select unit"
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
                  Create
                </Button>
              </Row>
            </Form>
          </div>
        </div>
      </section>
    </div>
  );
};
