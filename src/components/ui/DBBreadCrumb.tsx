import { Breadcrumb } from "antd";
import { HomeOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";

export const DBBreadCrumb = ({
  items,
}: {
  items: {
    label: string;
    link: string;
  }[];
}) => {
  const breadCrumbItems = [
    {
      title: (
        <Link to="/">
          <HomeOutlined className="dark:!text-primary !text-mirage" />
        </Link>
      ),
    },
    ...items.map((item) => {
      return {
        title: item.link ? (
          <Link className="dark:!text-primary !text-mirage" to={item.link}>
            {item.label}
          </Link>
        ) : (
          <span className="dark:!text-primary !text-mirage">{item.label}</span>
        ),
      };
    }),
  ];

  return (
    <Breadcrumb
      className="!text-primary ml-3"
      items={breadCrumbItems}
    ></Breadcrumb>
  );
};
