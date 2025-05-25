import React from 'react';
import { Layout, Menu } from 'antd';
import {
  FileFilled,
  BankFilled,
  FolderFilled,
  SettingFilled,
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
      icon: <FolderFilled />,
      label: 'Archives'
    },
    {
      key: 'documents',
      icon: <FileFilled />,
      label: 'Mes documents'
    },
    {
      key: 'CompanyInfo',
      icon: <BankFilled />,
      label: 'Mes informations'
    },
    {
      key: 'settings',
      icon: <SettingFilled />,
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