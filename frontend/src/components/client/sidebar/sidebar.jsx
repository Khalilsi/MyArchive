import React from 'react';
import { Layout, Menu } from 'antd';
import {
  FileFilled,
  BankFilled,
  FolderFilled,
  SettingFilled,
  LogoutOutlined,
  HomeFilled,
  QuestionCircleFilled
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
      key: 'Support',
      icon: <QuestionCircleFilled />,
      label: 'Support / Assistance'
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
        style={{ width: '100%', borderRight: 0 }}
        mode="inline"
        items={menuItems}
        onClick={onMenuClick}
      />
    </Sider>
  );
};

export default Sidebar;