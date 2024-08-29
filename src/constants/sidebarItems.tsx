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
          label: <Link to={`/${db_url}/profile`}>My Profile</Link>,
          key: `/profile`,
        },
        {
          label: <Link to={`/${db_url}/change-password`}>Change Password</Link>,
          key: `/change-password`,
        },
      ],
    },
  ];

  const adminSidebarItems: MenuProps["items"] = [
    ...defaultSidebarItems,
    {
      label: "For Owner",
      key: "owner",
      icon: <MdHomeRepairService />,
      children: [
        {
          label: <Link to={`/${db_url}/expriences`}>Expriences</Link>,
          key: `/${db_url}/expriences`,
        },
      ],
    },
  ];

  if (role === USER_ROLE.OWNER) return adminSidebarItems;
  else {
    return defaultSidebarItems;
  }
};
