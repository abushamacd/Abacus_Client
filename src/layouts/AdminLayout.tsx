/* eslint-disable @typescript-eslint/ban-ts-comment */
import { useEffect, useState } from "react";
import {
  Avatar,
  Breadcrumb,
  Button,
  Layout,
  Menu,
  Popover,
  Switch,
  theme,
} from "antd";
import { sidebarItems } from "../constants/sidebarItems";
import { getUserInfo, removeUserInfo } from "../services/auth.service";
import { getFromLocalStorage, setToLocalStorage } from "../utils/local-storage";
import { FiSun } from "react-icons/fi";
import { FaMoon, FaRegUserCircle } from "react-icons/fa";
import { authKey } from "../constants/storageKey";
import { useNavigate } from "react-router-dom";

const { Header, Content, Sider } = Layout;

export const AdminLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();

  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const initialTheme = getFromLocalStorage("theme") !== "dark";
  const [globalTheme, setGlobalTheme] = useState(initialTheme);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", !globalTheme);
    document.documentElement.style.backgroundColor = `${
      globalTheme ? "#ffffff" : "#051114"
    }`;
    setToLocalStorage("theme", globalTheme ? "light" : "dark");
  }, [globalTheme]);

  const db_url = import.meta.env.VITE_REDIRECT_URL;

  const signout = () => {
    removeUserInfo(authKey);
    navigate(`/${db_url}_signin`, { replace: true });
  };

  // @ts-ignore
  const { role } = getUserInfo();

  return (
    <Layout hasSider style={{ minHeight: "100vh" }}>
      <Sider
        // className="!bg-white dark:!bg-bg_dark"
        collapsible
        collapsed={collapsed}
        onCollapse={(value) => setCollapsed(value)}
      >
        <div className="demo-logo-vertical" />
        <Menu
          // className="!bg-white dark:!bg-bg_dark"
          theme="dark"
          defaultSelectedKeys={["1"]}
          mode="inline"
          items={sidebarItems(role)}
        />
      </Sider>
      <Layout>
        <Header
          className="flex justify-end items-center gap-4"
          style={{ padding: 0, background: colorBgContainer }}
        >
          <Switch
            className="!bg-primary dark:!bg-bg_dark"
            onChange={(checked) => setGlobalTheme(checked)}
            checkedChildren={<FiSun className="mt-[5px]" />}
            unCheckedChildren={<FaMoon className="mt-[0px]" />}
            checked={globalTheme}
          />
          <Popover
            className="mr-2"
            placement="bottomRight"
            title={"User Profile"}
            content={
              <Button
                onClick={signout}
                className="bg-primary hover:!bg-primary text-mirage !bg-opacity-[.8] duration-300 transition-all"
                size="large"
                htmlType="submit"
                type="primary"
                block
              >
                Sign Out
              </Button>
            }
            // arrow={mergedArrow}
          >
            <Avatar size={40} icon={<FaRegUserCircle />} />
          </Popover>
        </Header>
        <Content style={{ margin: "0 16px" }}>
          <Breadcrumb
            className="text-primary dark:text-mirage"
            style={{ margin: "16px 0" }}
          >
            <Breadcrumb.Item>User</Breadcrumb.Item>
            <Breadcrumb.Item>Bill</Breadcrumb.Item>
          </Breadcrumb>
          <div
            style={{
              padding: 24,
              minHeight: "calc(100vh - 136px)",
              background: colorBgContainer,
              borderRadius: borderRadiusLG,
            }}
          >
            Bill is a cat.
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};
