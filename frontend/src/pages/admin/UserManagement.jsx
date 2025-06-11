import React, { useState, useEffect } from 'react';
import {
  Table,
  Tag,
  Space,
  Card,
  Typography,
  message,
  Button,
  Modal,
  Select,
} from 'antd';
import { LoadingOutlined, UserOutlined } from '@ant-design/icons';
import axios from 'axios';
import apiClient from '../../Api/client';

const { Title } = Typography;
const { Option } = Select;

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);
  const [roleModalVisible, setRoleModalVisible] = useState(false);
  const [updating, setUpdating] = useState(false);
  const token = localStorage.getItem('token') || sessionStorage.getItem('token');

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get('/api/users', {
        headers: { 'x-auth-token': token }
      });

      if (response.data.success) {
        setUsers(response.data.data);
      }
    } catch (error) {
      message.error('Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleRoleUpdate = async (userId, newRole) => {
    try {
      setUpdating(true);
      const response = await apiClient.patch(
        `/api/users/${userId}/role`,
        { role: newRole },
        { headers: { 'x-auth-token': token } }
      );

      if (response.data.success) {
        message.success('User role updated successfully');
        fetchUsers();
        setRoleModalVisible(false);
      }
    } catch (error) {
      message.error('Failed to update user role');
    } finally {
      setUpdating(false);
    }
  };

  const handleDelete = async (userId) => {
    Modal.confirm({
      title: 'Êtes-vous sûr de vouloir supprimer cet utilisateur ?',
      content: 'Cette action ne peut pas être annulée .',
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',
      onOk: async () => {
        try {
          const response = await apiClient.delete(
            `/api/users/${userId}`,
            { headers: { 'x-auth-token': token } }
          );

          if (response.data.success) {
            message.success('User deleted successfully');
            fetchUsers();
          }
        } catch (error) {
          message.error('Failed to delete user');
        }
      },
    });
  };

  const columns = [
    {
      title: 'Nom d\'utilisateur',
      dataIndex: 'username',
      key: 'username',
      render: (text) => <Space><UserOutlined /> {text}</Space>,
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Role',
      dataIndex: 'role',
      key: 'role',
      render: (role) => (
        <Tag color={role === 'admin' ? 'red' : 'blue'}>
          {role.toUpperCase()}
        </Tag>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      
      render: (_, record) => (
        <Space>
          <Button
            type="link"
            onClick={() => {
              setSelectedUser(record);
              setRoleModalVisible(true);
            }}
          >
            Change Role
          </Button>
          <Button
            type="link"
            danger
            onClick={() => handleDelete(record._id)}
          >
            Supprimer
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: '24px' }}>
      <Card>
        <Title level={3}>Gestion des utilisateurs</Title>
        <Table
          columns={columns}
          dataSource={users}
          rowKey="_id"
          loading={{
            spinning: loading,
            indicator: <LoadingOutlined style={{ fontSize: 24 }} spin />,
          }}
        />
      </Card>

      <Modal
        title="Change User Role"
        visible={roleModalVisible}
        onCancel={() => setRoleModalVisible(false)}
        footer={null}
      >
        {selectedUser && (
          <Space direction="vertical" style={{ width: '100%' }}>
            <p>Current Role: {selectedUser.role}</p>
            <Select
              style={{ width: '100%' }}
              defaultValue={selectedUser.role}
              onChange={(value) => handleRoleUpdate(selectedUser._id, value)}
              loading={updating}
            >
              <Option value="user">User</Option>
              <Option value="admin">Admin</Option>
            </Select>
          </Space>
        )}
      </Modal>
    </div>
  );
};

export default UserManagement;