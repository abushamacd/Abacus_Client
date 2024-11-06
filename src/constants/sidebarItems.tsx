import type { MenuProps } from "antd";
import { MdHomeRepairService } from "react-icons/md";
import { ImProfile } from "react-icons/im";
// import { AiOutlineControl } from "react-icons/ai";
import { USER_ROLE } from "./role";
import { Link } from "react-router-dom";
import { FaBus, FaStore } from "react-icons/fa";

const db_url = import.meta.env.VITE_REDIRECT_URL;

export const sidebarItems = (role: string) => {
  const defaultSidebarItems: MenuProps["items"] = [
    {
      label: "Profile",
      key: "profile",
      icon: <ImProfile />,
      children: [
        {
          label: <Link to={`/${db_url}`}>My Profile</Link>,
          key: `/profile`,
        },
        {
          label: <Link to={`/${db_url}_signin`}>Sign In</Link>,
          key: `/change-password`,
        },
      ],
    },
  ];

  const managerSidebarItems: MenuProps["items"] = [
    ...defaultSidebarItems,
    {
      label: "Users",
      key: "users",
      icon: <MdHomeRepairService />,
      children: [
        {
          label: <Link to={`/${db_url}/users`}>All Users</Link>,
          key: `/${db_url}/users`,
        },
      ],
    },
    {
      label: "Store",
      key: "store",
      icon: <FaStore />,
      children: [
        {
          label: <Link to={`/${db_url}/store`}>Overview</Link>,
          key: `/${db_url}/store`,
        },
        {
          label: <Link to={`/${db_url}/invoices`}>Invoices</Link>,
          key: `/${db_url}/invoice`,
        },
        {
          label: <Link to={`/${db_url}/products`}>Products</Link>,
          key: `/${db_url}/products`,
        },
        {
          label: <Link to={`/${db_url}/suppliers`}>Suppliers</Link>,
          key: `/${db_url}/suppliers`,
        },
        {
          label: <Link to={`/${db_url}/units`}>Units</Link>,
          key: `/${db_url}/units`,
        },
      ],
    },
  ];

  const adminSidebarItems: MenuProps["items"] = [
    ...managerSidebarItems,
    {
      label: "Vehicles",
      key: "vehicles",
      icon: <FaBus />,
      children: [
        {
          label: <Link to={`/${db_url}/vehicle`}>Overview</Link>,
          key: `/${db_url}/vehicle`,
        },
        {
          label: <Link to={`/${db_url}/vehicles`}>Vehicles</Link>,
          key: `/${db_url}/vehicles`,
        },
        {
          label: <Link to={`/${db_url}/vehicle-routes`}>Vehicle Routes</Link>,
          key: `/${db_url}/vehicle-routes`,
        },
        {
          label: <Link to={`/${db_url}/vehicle-statement`}>Add Statement</Link>,
          key: `/${db_url}/vehicle-statement`,
        },
      ],
    },
  ];

  if (role === USER_ROLE.MANAGER) return managerSidebarItems;
  if (role === USER_ROLE.OWNER) return adminSidebarItems;
  else {
    return defaultSidebarItems;
  }
};
