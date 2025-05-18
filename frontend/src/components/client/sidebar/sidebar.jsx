import React from 'react';
import { Layout, Menu } from 'antd';
import {
  FileOutlined,
  UploadOutlined,
  FolderOutlined,
  SettingOutlined,
  LogoutOutlined,
  HomeFilled
} from '@ant-design/icons';
import { useLocation } from 'react-router-dom';

const { Sider } = Layout;

const Sidebar = ({ collapsed, onCollapse , onMenuClick }) => {
  const location = useLocation();
  const currentPath = location.pathname.split('/').pop(); // Gets the last part of the path




  const menuItems = [
    {
      key: 'dashboard',
      icon: <HomeFilled />,
      label: 'Accueille'
    },
    {
      key: 'archives',
      icon: <FolderOutlined />,
      label: 'Archives'
    },
    {
      key: 'documents',
      icon: <FileOutlined />,
      label: 'Mes documents'
    },
    {
      key: 'upload',
      icon: <UploadOutlined />,
      label: 'Ajouter un document'
    },
    {
      key: 'settings',
      icon: <SettingOutlined />,
      label: 'Paramètres'
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: 'Déconnexion'
    }
  ];

  return (
    <Sider collapsible collapsed={collapsed} onCollapse={onCollapse}>
      <Menu
        theme="dark"
        defaultSelectedKeys={[currentPath]}
        mode="inline"
        items={menuItems}
        onClick={onMenuClick}
      />
    </Sider>
  );
};

export default Sidebar;