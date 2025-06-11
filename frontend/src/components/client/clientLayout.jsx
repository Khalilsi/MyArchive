import React, { useState, useEffect } from 'react';
import { Layout, Avatar, Typography, Space, Row, message, Input, Button, Modal } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import Sidebar from '../client/sidebar/sidebar';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';
import 'react-toastify/dist/ReactToastify.css';
import { toast, ToastContainer } from 'react-toastify';
import apiClient from '../../Api/client'; // Adjust the import path as necessary

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
      await apiClient.put('/api/profile', {
        username: newUsername,
        email: newEmail,
      }, {
        headers: {
          'x-auth-token': token
        }
      });
      setUsername(newUsername);
      setEmail(newEmail);
      toast.success('Profil mis à jour avec succès');
      setEditingProfile(false);
    } catch (error) {
      toast.error('Échec de la mise à jour du profil');
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
          title="Mettre à jour le profil"
          open={editingProfile}
          onCancel={() => setEditingProfile(false)}
          onOk={handleProfileUpdate}
          okText="Mettre à jour"
          cancelText="Annuler"
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

        

        <Content style={{ margin: '10px' }}>{children}</Content>
        <ToastContainer position="top-right" autoClose={3000} />
      </Layout>
    </Layout>
  );
};

export default ClientLayout;
