// layouts/AdminLayout.jsx
import React, { useState, useEffect } from 'react';
import { Layout, Avatar, Typography, Space, Row, message, Modal, Input } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import axios from 'axios';
import AdminSidebar from './sidebarAdmin';

const { Header, Content } = Layout;
const { Text } = Typography;

const AdminLayout = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);
  const [editingProfile, setEditingProfile] = useState(false);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [newUsername, setNewUsername] = useState('');
  const [newEmail, setNewEmail] = useState('');

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
      message.error('Failed to fetch profile');
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleProfileUpdate = async () => {
    try {
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      await axios.put('http://localhost:4000/api/profile', {
        username: newUsername,
        email: newEmail,
      }, {
        headers: { 'x-auth-token': token }
      });
      setUsername(newUsername);
      setEmail(newEmail);
      setEditingProfile(false);
      message.success('Profile updated successfully');
    } catch (error) {
      message.error('Failed to update profile');
    }
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <AdminSidebar collapsed={collapsed} onCollapse={setCollapsed} />
      <Layout>
        <Header style={{ padding: 0, background: '#fff' }}>
          <Row
            justify="end"
            align="middle"
            style={{ height: '100%', padding: '0 24px' }}
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

        <Content style={{ margin: '16px' }}>{children}</Content>
      </Layout>
    </Layout>
  );
};

export default AdminLayout;
