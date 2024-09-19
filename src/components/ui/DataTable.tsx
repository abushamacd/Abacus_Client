/* eslint-disable @typescript-eslint/no-explicit-any */

import { Table } from "antd";

type DataTableProps = {
  loading?: boolean;
  columns: any;
  dataSource: any;
  pageSize?: number;
  totalPages?: number;
  showSizeChanger?: boolean;
  onPaginationChange?: (page: number, pageSize: number) => void;
  onTableChange?: (pagination: any, filter: any, sorter: any) => void;
  showPagination?: boolean;
};

const DataTable = ({
  loading = false,
  columns,
  dataSource,
  pageSize,
  totalPages,
  showSizeChanger = true,
  onPaginationChange,
  onTableChange,
  showPagination = true,
}: DataTableProps) => {
  const paginationConfig = showPagination
    ? {
        pageSize: pageSize,
        total: totalPages,
        pageSizeOptions: [2, 5, 10, 25, 50, 100, 200, 300, 400, 500],
        showSizeChanger: showSizeChanger,
        onChange: onPaginationChange,
        hideOnSinglePage: false,
      }
    : false;

  const newArray: any = [];
  dataSource?.forEach((data: any) => {
    const newData = {
      ...data,
      key: data.id,
    };

    newArray.push(newData);
  });

  return (
    <Table
      className="overflow-auto "
      loading={loading}
      columns={columns}
      dataSource={newArray}
      pagination={paginationConfig}
      onChange={onTableChange}
    />
  );
};

export default DataTable;
