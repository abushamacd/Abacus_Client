/* eslint-disable @typescript-eslint/ban-ts-comment */
import { useEffect, useState } from "react";
import { Breadcrumb, Layout, Menu, Switch, theme } from "antd";
import { sidebarItems } from "../constants/sidebarItems";
import { getUserInfo } from "../services/auth.service";
import { CheckOutlined, CloseOutlined } from "@ant-design/icons";
import { getFromLocalStorage, setToLocalStorage } from "../utils/local-storage";

const { Header, Content, Sider } = Layout;

export const AdminLayout = () => {
  const [collapsed, setCollapsed] = useState(false);

  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const themeMood = getFromLocalStorage("theme");

  const [globalTheme, setGlobalTheme] = useState(
    (themeMood === "light" ? true : false) || true
  );

  useEffect(() => {
    document.documentElement.classList.toggle("dark");
    setToLocalStorage("theme", globalTheme ? "dark" : "light");
  }, [globalTheme]);

  console.log(themeMood);

  // @ts-ignore
  const { role } = getUserInfo();

  return (
    <Layout hasSider style={{ minHeight: "100vh" }}>
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={(value) => setCollapsed(value)}
      >
        <div className="demo-logo-vertical" />
        <Menu
          theme="dark"
          defaultSelectedKeys={["1"]}
          mode="inline"
          items={sidebarItems(role)}
        />
      </Sider>
      <Layout>
        <Header style={{ padding: 0, background: colorBgContainer }}>
          <Switch
            onChange={(checked) => setGlobalTheme(checked)}
            checkedChildren={<CheckOutlined />}
            unCheckedChildren={<CloseOutlined />}
            checked={globalTheme}
          />
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
