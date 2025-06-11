// layouts/AdminLayout.jsx
import React, { useState, useEffect } from 'react';
import { Layout, Avatar, Typography, Space, Row, message, Modal, Input } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import axios from 'axios';
import AdminSidebar from './sidebarAdmin';
import 'react-toastify/dist/ReactToastify.css';
import { toast, ToastContainer } from 'react-toastify';
import apiClient from "../../Api/client";


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
      const response = await apiClient.get('/api/profile', {
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
      toast.error('Échec du chargement du profil');
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleProfileUpdate = async () => {
    try {
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      await apiClient.put('/api/profile', {
        username: newUsername,
        email: newEmail,
      }, {
        headers: { 'x-auth-token': token }
      });
      setUsername(newUsername);
      setEmail(newEmail);
      setEditingProfile(false);
      toast.success('Profil mis à jour avec succès');
    } catch (error) {
      toast.error('Échec de la mise à jour du profil');
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
          title="Mettre à jour le profil"
          open={editingProfile}
          onCancel={() => setEditingProfile(false)}
          onOk={handleProfileUpdate}
          okText="Mettre à jour"
          cancelText="Annuler"
        >
          <Input
            placeholder="Nouvel Nom d'utilisateur"
            value={newUsername}
            onChange={(e) => setNewUsername(e.target.value)}
            style={{ marginBottom: 15 }}
          />
          <Input
            placeholder="Nouvel Email"
            value={newEmail}
            onChange={(e) => setNewEmail(e.target.value)}
          />
        </Modal>

        <Content style={{ margin: '10px' }}>{children}</Content>
        <ToastContainer position="top-right" autoClose={3000} />
      </Layout>
    </Layout>
  );
};

export default AdminLayout;
