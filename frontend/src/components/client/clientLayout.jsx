import React, { useState, useEffect } from 'react';
import { Layout, Avatar, Typography, Space, Row, message, Input, Button, Modal } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import Sidebar from '../client/sidebar/sidebar';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';

const { Header, Content } = Layout;
const { Text } = Typography;

const ClientLayout = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);
  const [editingProfile, setEditingProfile] = useState(false);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [newUsername, setNewUsername] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const navigate = useNavigate();
  const { logout } = useAuth();

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      const response = await axios.get('http://localhost:4000/api/profile', {
        headers: {
          'x-auth-token': token
        }
      });
      const { username, email } = response.data;
      setUsername(username);
      setEmail(email);
      setNewUsername(username);
      setNewEmail(email);
    } catch (error) {
      message.error('Failed to fetch user profile');
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleMenuClick = ({ key }) => {
    const implementedRoutes = ['dashboard', 'logout', 'archives', "documents", 'CompanyInfo', 'Support', 'settings'];

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

  const handleProfileUpdate = async () => {
    try {
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      await axios.put('http://localhost:4000/api/profile', {
        username: newUsername,
        email: newEmail,
      }, {
        headers: {
          'x-auth-token': token
        }
      });
      setUsername(newUsername);
      setEmail(newEmail);
      message.success('Profile updated successfully');
      setEditingProfile(false);
    } catch (error) {
      message.error('Failed to update profile');
    }
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
              <Text
                strong
                style={{ cursor: 'pointer', textDecoration: 'underline' }}
                onClick={() => setEditingProfile(true)}
              >
                {username || 'Loading...'}
              </Text>
            </Space>
          </Row>
        </Header>

        <Modal
          title="Update Profile"
          open={editingProfile}
          onCancel={() => setEditingProfile(false)}
          onOk={handleProfileUpdate}
          okText="Update"
        >
          <Input 
            placeholder="New Username" 
            value={newUsername} 
            onChange={(e) => setNewUsername(e.target.value)} 
            style={{ marginBottom: 10 }}
          />
          <Input 
            placeholder="New Email" 
            value={newEmail} 
            onChange={(e) => setNewEmail(e.target.value)} 
          />
        </Modal>

        {children}
      </Layout>
    </Layout>
  );
};

export default ClientLayout;
