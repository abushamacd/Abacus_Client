/* eslint-disable @typescript-eslint/ban-ts-comment */
import { useEffect, useState } from "react";
import { Avatar, Button, Layout, Menu, Popover, Switch } from "antd";
import { sidebarItems } from "../constants/sidebarItems";
import { getUserInfo, removeUserInfo } from "../services/auth.service";
import { getFromLocalStorage, setToLocalStorage } from "../utils/local-storage";
import { FiSun } from "react-icons/fi";
import { FaMoon, FaRegUserCircle } from "react-icons/fa";
import { authKey } from "../constants/storageKey";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { DBBreadCrumb } from "../components/ui/DBBreadCrumb";
import icon_logo from "../assets/icon_logo.png";
import text_logo from "../assets/text_logo.png";

const { Header, Content, Sider } = Layout;

export const AdminLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();

  const initialTheme = getFromLocalStorage("theme") !== "dark";
  const [globalTheme, setGlobalTheme] = useState(initialTheme);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", !globalTheme);
    document.documentElement.style.backgroundColor = `${
      globalTheme ? "#ffffff" : "#051114"
    }`;
    setToLocalStorage("theme", globalTheme ? "light" : "dark");
  }, [globalTheme]);

  useEffect(() => {
    const handleResize = () => {
      setCollapsed(window.innerWidth < 1000);
    };

    // Set initial collapse state based on window size
    handleResize();

    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const db_url = import.meta.env.VITE_REDIRECT_URL;

  const signout = () => {
    removeUserInfo(authKey);
    navigate(`/${db_url}/signin`, { replace: true });
  };

  // @ts-ignore
  const { name, phone, role } = getUserInfo();

  const { pathname } = useLocation();

  const result = pathname.split("/");

  return (
    <Layout hasSider style={{ minHeight: "100vh" }}>
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={(value) => setCollapsed(value)}
        collapsedWidth={60}
      >
        <div className="demo-logo-vertical">
          <Link to="/">
            {collapsed ? (
              <img
                src={icon_logo}
                width={100}
                height={100}
                className="w-auto p-2"
                alt="logo"
              />
            ) : (
              <img
                src={text_logo}
                width={100}
                height={100}
                className="w-auto p-4"
                alt="logo"
              />
            )}
          </Link>
        </div>
        <Menu
          className="!text-mirage"
          theme="dark"
          defaultSelectedKeys={["/profile"]}
          mode="inline"
          items={sidebarItems(role)}
        />
      </Sider>
      <Layout>
        <Header
          className="flex justify-between items-center"
          style={{ padding: 0 }}
        >
          <DBBreadCrumb
            items={[
              {
                label: `Dashboard`,
                link: `/${result[1]}`,
              },
              {
                label: `${result[2] !== undefined ? result[2] : ""}`,
                link: `${result[2] !== undefined ? result[2] : ""}`,
              },
            ]}
          />
          <span className="flex justify-end items-center gap-4">
            <Switch
              className="dark:!bg-primary !bg-bg_dark"
              onChange={(checked) => setGlobalTheme(checked)}
              checkedChildren={<FiSun className="mt-[5px]" />}
              unCheckedChildren={<FaMoon className="mt-[0px]" />}
              checked={globalTheme}
            />
            <Popover
              className="mr-2 border-[3px] dark:border-primary border-bg_dark"
              placement="bottomRight"
              title={""}
              content={
                <>
                  <h3 className="italic text-lg ao text-primary">{name}</h3>
                  <p className="">{phone}</p>
                  <p className="">{role}</p>
                  <Button
                    onClick={signout}
                    className="bg-primary hover:!bg-primary text-mirage !bg-opacity-[.8] duration-300 transition-all mt-4"
                    size="middle"
                    htmlType="submit"
                    type="primary"
                    block
                  >
                    Sign Out
                  </Button>
                </>
              }
            >
              <Avatar size={40} icon={<FaRegUserCircle />} />
            </Popover>
          </span>
        </Header>
        <Content style={{ padding: "0px", margin: "0 20px 0 0" }}>
          <div
            style={{
              padding: 24,
              maxHeight: "calc(100vh - 96px)",
              overflowY: "auto",
            }}
          >
            <Outlet />
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};
