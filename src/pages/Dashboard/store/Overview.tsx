/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable no-extra-boolean-cast */
import { useState } from "react";
import { useDebounced } from "../../../redux/hooks";
import { useGetInvoicesQuery } from "../../../redux/api/invoice";
import Title from "antd/es/typography/Title";
import { Button, Col, Input, Row, Select } from "antd";
import { ReloadOutlined } from "@ant-design/icons";
import DataTable from "../../../components/ui/DataTable";
import { FaRegEye } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { TbSum } from "react-icons/tb";
import { FaSackDollar } from "react-icons/fa6";
import { MdSell } from "react-icons/md";
import { CgCalendarDue } from "react-icons/cg";
import { MdProductionQuantityLimits } from "react-icons/md";
import { useGetProductsQuery } from "../../../redux/api/product";
import Loading from "../../../components/ui/Loading";
import { SelectOptions } from "../../../types";
import { useGetUsersQuery } from "../../../redux/api/userApi";

/* eslint-disable @typescript-eslint/no-explicit-any */
export const StoreOverview = () => {
  const navigate = useNavigate();
  // invoice query
  const query: Record<string, any> = {};
  const [page, setPage] = useState<number>(1);
  const [size, setSize] = useState<number>();
  const [sortBy, setSortBy] = useState<string>("");
  const [sortOrder, setSortOrder] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [uId, setUId] = useState<string>();

  query["customerId"] = uId;
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
  const { data: invoicesData, isLoading: invoicesLoading } =
    useGetInvoicesQuery({ ...query });
  // @ts-ignore
  const allInvoices: any = invoicesData?.invoices;
  // @ts-ignore
  const meta = invoicesData?.meta;

  const { data, isLoading } = useGetProductsQuery({});
  // @ts-ignore
  const products: any = data?.products;

  // Customer query
  const [customerSearchTerm, setCustomerSearchTerm] =
    useState<string>("Unknown");

  const customerDebouncedTerm = useDebounced({
    searchQuery: customerSearchTerm,
    delay: 600,
  });
  const customerQuery: Record<string, any> = customerDebouncedTerm
    ? { searchTerm: customerDebouncedTerm }
    : {};

  const { data: usersData, isLoading: staffsLoading } = useGetUsersQuery({
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
  };

  const totalSum = allInvoices?.reduce(
    (sum: any, record: { total: any }) => sum + record.total,
    0
  );
  const dueSum = allInvoices?.reduce(
    (sum: any, record: { due: any }) => sum + record.due,
    0
  );
  const profitSum = allInvoices?.reduce(
    (sum: any, record: { profit: any }) => sum + record.profit,
    0
  );

  const totalValuation = products?.reduce(
    (sum: number, product: { quantity: number; purchase: number }) =>
      sum + product.quantity * product.purchase,
    0
  );

  const columns = [
    {
      title: "Date",
      dataIndex: "date",
      sorter: true,
    },
    {
      title: "Customer Name",
      dataIndex: "customerName",
      sorter: true,
    },
    {
      title: "Update By",
      dataIndex: "updateBy",
      sorter: true,
    },
    {
      title: "Total",
      dataIndex: "total",
      sorter: true,
    },
    {
      title: "Paid",
      dataIndex: "paid",
      sorter: true,
    },
    {
      title: "Due",
      render: function (invoice: any) {
        return (
          <span
            className={`${invoice?.due > 0 && "text-[#D31818] !font-bold"}`}
          >
            {invoice?.due}
          </span>
        );
      },
    },
    {
      title: "Action",
      render: function (invoice: any) {
        return (
          <div className="flex gap-2 ml-3">
            <FaRegEye
              style={{ color: "#008A3F" }}
              onClick={() => openView(invoice?.id)}
              size={22}
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
    setUId(undefined);
    setSize(undefined);
    setSearchTerm("");
  };

  const openView = (id: string) => {
    navigate(`/adbmsdb/invoices/${id}`, { replace: true });
  };

  if (invoicesLoading || isLoading || staffsLoading) return <Loading />;

  return (
    <div>
      {/* product calculation */}
      <Row className="!mx-0" gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
        <Col className="gutter-row w-full mb-5 !px-0" sm={24} md={12} lg={12}>
          <div className="mr-0 md:mr-5 overflow-hidden rounded-md">
            <div
              className={`card_container before:bg-[#fcac5d] after:bg-[#fcac5d] relative bg-secondary p-4 rounded-md text-mirage dark:text-white`}
            >
              <div className="relative z-10">
                <MdProductionQuantityLimits
                  size={40}
                  className="border border-primary p-2 rounded-md"
                />
                <h1 className="text-3xl ao my-4">{products?.length}</h1>
                <p className="text-lg my-2">No. of Products</p>
              </div>
            </div>
          </div>
        </Col>
        <Col className="gutter-row w-full mb-5 !px-0" sm={24} md={12} lg={12}>
          <div className="overflow-hidden rounded-md">
            <div
              className={`card_container before:bg-[#faa381] after:bg-[#faa381] relative bg-secondary p-4 rounded-md text-mirage dark:text-white`}
            >
              <div className="relative z-10">
                <TbSum
                  size={40}
                  className="border border-primary p-2 rounded-md"
                />
                <h1 className="text-3xl ao my-4">
                  {totalValuation?.toFixed(2)} ৳
                </h1>
                <p className="text-lg my-2">Product Valuation</p>
              </div>
            </div>
          </div>
        </Col>
      </Row>
      {/* invoice calculation */}
      <Row className="!mx-0" gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
        <Col className="gutter-row w-full mb-5 !px-0" sm={24} md={12} lg={8}>
          <div className="mr-0 md:mr-5 overflow-hidden rounded-md">
            <div
              className={`card_container before:bg-[#cdb4db] after:bg-[#cdb4db] relative bg-secondary p-4 rounded-md text-mirage dark:text-white`}
            >
              <div className="relative z-10">
                <MdSell
                  size={40}
                  className="border border-primary p-2 rounded-md"
                />
                <h1 className="text-3xl ao my-4">{totalSum?.toFixed(2)} ৳</h1>
                <p className="text-lg my-2">Total Selling</p>
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
                <CgCalendarDue
                  size={40}
                  className="border border-primary p-2 rounded-md"
                />
                <h1 className="text-3xl ao my-4">{dueSum?.toFixed(2)} ৳</h1>
                <p className="text-lg my-2">Total Due</p>
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
                <h1 className="text-3xl ao my-4">{profitSum?.toFixed(2)} ৳</h1>
                <p className="text-lg my-2">Total Profit</p>
              </div>
            </div>
          </div>
        </Col>
      </Row>
      {/* Query */}
      <Row className="!mx-0" gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
        <Col className="gutter-row w-full mb-5 !px-0" sm={24} md={8}>
          <div className="mr-0 md:mr-5 overflow-hidden rounded-md">
            <Select
              allowClear
              className="w-full"
              showSearch
              placeholder="Search customer"
              optionFilterProp="label"
              value={uId}
              onChange={(value: string) => setUId(value)}
              onSearch={onCustomerSearch}
              options={users as SelectOptions[]}
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
              {(!!sortBy || !!sortOrder || !!uId || !!size || !!searchTerm) && (
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
      {/* all Invoice */}
      <div className="dark:bg-bg_dark bg-white p-4 rounded-md">
        <div className="">
          <div className="w-full dark:bg-bg_dark bg-white py-5 rounded-md md:mb-0 mb-5 flex md:flex-row flex-col justify-between md:items-center items-start">
            <Title
              className="text-mirage dark:text-white !font-medium"
              level={4}
            >
              All Invoices ({meta?.total})
            </Title>
          </div>
          <DataTable
            loading={invoicesLoading}
            columns={columns}
            dataSource={allInvoices}
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
