import React, { useEffect, useState } from "react";
import {
  AppstoreOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  AntDesignOutlined,
  SettingTwoTone,
} from "@ant-design/icons";
import { Dropdown, Layout, Menu } from "antd";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useUserStore } from "@/store/user";
import { Avatar } from "antd";
import { Spin } from "antd";

const { Header, Sider, Content } = Layout;

const items = [
  { label: "Home", icon: <AppstoreOutlined />, key: "/", path: "/" }, // The key must be filled in for the menu item
  {
    label: "Article Management",
    key: "article",
    icon: <AppstoreOutlined />,
    children: [
      { label: "Article List", key: "/article/list" },
      { label: "Article Tags", key: "/article/tags" },
    ],
  },
  {
    label: "Site Management",
    key: "website",
    icon: <AppstoreOutlined />,
    children: [
      { label: "File Management", key: "/website/file" },
      { label: "Visitor Statistics", key: "/website/visitor" },
    ],
  },
];

const Root = () => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const [menuItems, setMenuItems] = useState([]);
  const [menuOpenKeys, setMenuOpenKeys] = useState([]);
  const initUserInfo = useUserStore((state) => state.initUserInfo);
  const userInfo = useUserStore((state) => state.userInfo);

  const dropDownItems = [
    {
      label: <Link to={'/user/password'}>Change Password</Link>,
      key: '0',
    },
    {
      label: <Link to={'/user/info'}>User Information</Link>,
      key: '1',
    },
    {
      label: <Link to={'/login'}>Logout</Link>,
      key: '2',
    },
  ];

  // Initialize global state data
  useEffect(() => {
    initUserInfo();
  }, [initUserInfo]);

  useEffect(() => {
    setMenuItems(items);
  }, [menuItems]);

  useEffect(() => {
    console.log("location", location);
    const { pathname } = location;
    setMenuOpenKeys([pathname]);
  }, [location]);

  const onClickMenuItem = (e) => {
    const { key } = e;
    navigate(key);
  };

  return (
    <Layout style={{ height: "100%" }}>
      <Sider theme="light" trigger={null} collapsible collapsed={collapsed}>
        <div className="sidebar-header">
          <AntDesignOutlined />
          {!collapsed && <span className="admin-name">Admin Dashboard</span>}
        </div>
        <Menu
          theme="light"
          mode="inline"
          defaultSelectedKeys={["1"]}
          items={menuItems}
          style={{
            height: "100%",
          }}
          onClick={onClickMenuItem}
          selectedKeys={menuOpenKeys}
        />
      </Sider>
      <Layout>
        <Header
          style={{
            padding: 0,
          }}
          className="root-header"
        >
          <div>
            {React.createElement(
              collapsed ? MenuUnfoldOutlined : MenuFoldOutlined,
              {
                className: "trigger",
                onClick: () => setCollapsed(!collapsed),
              }
            )}
          </div>
          <div className="root-header-right">
            <Avatar src={userInfo?.avatar_url} style={{ marginRight: '6px' }} />
            <Dropdown
              menu={{
                items: dropDownItems
              }}
            >
              <span className="user-name" style={{ marginRight: '8px' }}>
                {userInfo?.nick_name}
              </span>
            </Dropdown>

            <div>
              <SettingTwoTone />
            </div>
          </div>

        </Header>
        <Content
          style={{
            padding: 20,
          }}
        >
          <React.Suspense fallback={<Spin />}>
            <Outlet />
          </React.Suspense>
        </Content>
      </Layout>
    </Layout>
  );
};

export default Root;
