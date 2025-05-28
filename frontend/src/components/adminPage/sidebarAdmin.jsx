// components/AdminSidebar.jsx
import { Layout, Menu } from "antd";
import {
  UserOutlined,
  FileSearchOutlined,
  MessageOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import { useNavigate, useLocation } from "react-router-dom";

const { Sider } = Layout;

const AdminSidebar = ({ collapsed, onCollapse }) => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <Sider collapsible collapsed={collapsed} onCollapse={onCollapse}>
      <Menu
        theme="dark"
        mode="inline"
        selectedKeys={[location.pathname]}
        onClick={({ key }) => navigate(key)}
        items={[
          {
            key: "/admin/users",
            icon: <UserOutlined />,
            label: "Gérer les utilisateurs",
          },

          {
            key: "/admin/forfaits",
            icon: <MessageOutlined />,
            label: "Gérer les forfaits",
          },
          {
            key: "/admin/requests",
            icon: <FileSearchOutlined />,
            label: "Gérer les demandes",
          },

          {
            key: "/admin/support",
            icon: <MessageOutlined />,
            label: "Support Admin",
          },
          {
            key: "logout",
            icon: <LogoutOutlined />,
            label: "Déconnexion",
          },
        ]}
      />
    </Sider>
  );
};

export default AdminSidebar;
