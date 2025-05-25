import React, { useState } from 'react';
import { Layout, Avatar, Typography, Space, Row, message } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import Sidebar from '../client/sidebar/sidebar';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const { Header, Content } = Layout;
const { Text } = Typography;

const ClientLayout = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleMenuClick = ({ key }) => {
    const implementedRoutes = ['dashboard', 'logout', 'archives',"documents", 'CompanyInfo' , 'settings'];
    
    if (key === 'logout') {
      try {
        logout();
        message.success('Logged out successfully');
        navigate('/login');
      } catch (error) {
        message.error('Error logging out');
      }
      return;
    }
    
    if (!implementedRoutes.includes(key)) {
      message.info('Cette fonctionnalité sera bientôt disponible');
      return;
    }
    
    const path = `/client/${key}`;
    navigate(path);
  };

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sidebar 
        collapsed={collapsed} 
        onCollapse={setCollapsed} 
        onMenuClick={handleMenuClick}
      />

      <Layout>
        <Header style={{ padding: 0, background: "#fff" }}>
          <Row
            justify="end"
            align="middle"
            style={{ height: "100%", padding: "0 24px" }}
          >
            <Space>
              <Avatar icon={<UserOutlined />} />
              <Text strong>Username</Text>
            </Space>
          </Row>
        </Header>

        {children}
      </Layout>
    </Layout>
  );
};

export default ClientLayout;