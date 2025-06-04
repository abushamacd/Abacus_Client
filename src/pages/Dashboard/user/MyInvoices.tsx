/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable no-extra-boolean-cast */
import { useEffect, useState } from "react";
import { useDebounced } from "../../../redux/hooks";
import {
  useDeleteInvoiceMutation,
  useDeleteInvoicesMutation,
  useGetInvoicesQuery,
} from "../../../redux/api/invoice";
import { useGetUserProfileQuery } from "../../../redux/api/userApi";
import Loading from "../../../components/ui/Loading";
import DataTable from "../../../components/ui/DataTable";
import Title from "antd/es/typography/Title";
import { MdDeleteForever } from "react-icons/md";
import { Button, Input } from "antd";
import { ReloadOutlined } from "@ant-design/icons";
import { FaRegEye } from "react-icons/fa";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

/* eslint-disable @typescript-eslint/no-explicit-any */
export const MyInvoices = () => {
  const navigate = useNavigate();
  const { data, isLoading: userLoading } = useGetUserProfileQuery({});
  const res: any = data;

  // invoice query
  const query: Record<string, any> = {};
  const [page, setPage] = useState<number>(1);
  const [size, setSize] = useState<number>();
  const [sortBy, setSortBy] = useState<string>("");
  const [sortOrder, setSortOrder] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [uId, setUId] = useState<string>();
  const [selectedIds, setSelectedIds] = useState<React.Key[]>([]);

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

  const [deleteInvoice] = useDeleteInvoiceMutation();
  const [deleteInvoices] = useDeleteInvoicesMutation();

  useEffect(() => {
    setUId(res?.response?.id);
  }, [res]);

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
            <MdDeleteForever
              onClick={() => deleteHandler(invoice?.id)}
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

  const onSelection = (ids: React.Key[]) => {
    setSelectedIds(ids);
  };

  const deletesHandler = async (data: React.Key[]) => {
    try {
      await deleteInvoices(data).unwrap();
      toast.success("Delete selected invoices");
    } catch (err: any) {
      toast.error(`${err.data?.message}`);
    }
  };

  const deleteHandler = async (id: string) => {
    try {
      await deleteInvoice(id).unwrap();
      toast("Invoice deleted successfully");
    } catch (err: any) {
      toast.error(`${err.data?.message}`);
    }
  };

  const openView = (id: string) => {
    navigate(`/abacusdb/invoices/${id}`, { replace: true });
  };

  const resetFilters = () => {
    setSortBy("");
    setSortOrder("");
    setSearchTerm("");
  };

  if (userLoading || invoicesLoading) {
    return <Loading />;
  }
  return (
    <div>
      {/* all Invoice */}
      <div className="dark:bg-bg_dark bg-white p-4 rounded-md">
        <div className="">
          <div className="w-full dark:bg-bg_dark bg-white py-5 rounded-md md:mb-0 mb-5 flex md:flex-row flex-col justify-between md:items-center items-start">
            <Title
              className="text-mirage dark:text-white !font-medium"
              level={4}
            >
              My Invoices ({meta?.total || 0})
            </Title>
            <div className="flex items-center">
              {selectedIds?.length > 0 && (
                <>
                  <MdDeleteForever
                    className=""
                    onClick={() => deletesHandler(selectedIds)}
                    size={36}
                    style={{ color: "#D92728" }}
                  />
                  <span className="mr-2 text-mirage dark:text-white text-lg">
                    ({selectedIds?.length})
                  </span>
                </>
              )}
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
            loading={invoicesLoading}
            columns={columns}
            dataSource={allInvoices}
            pageSize={size}
            totalPages={meta?.total}
            showSizeChanger={true}
            onPaginationChange={onPaginationChange}
            onTableChange={onTableChange}
            showPagination={true}
            isSelection={true}
            onSelection={onSelection}
          />
        </div>
      </div>
    </div>
  );
};
