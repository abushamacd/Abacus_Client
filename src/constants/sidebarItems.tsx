import type { MenuProps } from "antd";
import { MdHomeRepairService } from "react-icons/md";
import { ImProfile } from "react-icons/im";
// import { AiOutlineControl } from "react-icons/ai";
import { USER_ROLE } from "./role";
import { Link } from "react-router-dom";

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
  ];

  const adminSidebarItems: MenuProps["items"] = [
    ...managerSidebarItems,
    {
      label: "Vehicles",
      key: "vehicles",
      icon: <MdHomeRepairService />,
      children: [
        {
          label: <Link to={`/${db_url}/vehicle`}>Overview</Link>,
          key: `/${db_url}/vehicle`,
        },
        {
          label: <Link to={`/${db_url}/vehicles`}>All Vehicles</Link>,
          key: `/${db_url}/vehicles`,
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
