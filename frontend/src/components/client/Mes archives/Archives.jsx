import React, { useState, useEffect } from "react";
import {
  Layout,
  Typography,
  Table,
  Button,
  Modal,
  Form,
  Input,
  message,
  Space,
} from "antd";
import { PlusOutlined, DeleteOutlined } from "@ant-design/icons";
import axios from "axios";
import apiClient from "../../../Api/client";

const { Content } = Layout;
const { Title } = Typography;
const { Search } = Input;

const Archives = () => {
  const [archives, setArchives] = useState([]);
  const [loading, setLoading] = useState(false);
  const [creatingArchive, setCreatingArchive] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [filteredArchives, setFilteredArchives] = useState([]);
  const [form] = Form.useForm();

  // Fetch archives on component mount
  useEffect(() => {
    fetchArchives();
  }, []);

  useEffect(() => {
    setFilteredArchives(archives);
  }, [archives]);

  const fetchArchives = async () => {
    try {
      setLoading(true);
      const token =
        localStorage.getItem("token") || sessionStorage.getItem("token");
      const response = await apiClient.get("/api/archives", {
        headers: {
          "x-auth-token": token,
        },
      });

      if (response.data.success) {
        setArchives(response.data.data);
      }
    } catch (error) {
      message.error("Failed to fetch archives");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateArchive = async (values) => {
    try {
      setCreatingArchive(true);
      const token =
        localStorage.getItem("token") || sessionStorage.getItem("token");
      const response = await apiClient.post(
        "/api/archives",
        { name: values.name },
        {
          headers: {
            "x-auth-token": token,
          },
        }
      );

      if (response.data.success) {
        message.success(`Archive "${values.name}" créée avec succès`);
        form.resetFields();
        setIsModalVisible(false);
        fetchArchives(); // Refresh the list
      }
    } catch (error) {
      message.error("Failed to create archive");
    } finally {
      setCreatingArchive(false);
    }
  };

  const handleDeleteArchive = async (archiveId) => {
    try {
      const token =
        localStorage.getItem("token") || sessionStorage.getItem("token");
      const response = await apiClient.delete(
        `/api/archives/${archiveId}`,
        {
          headers: {
            "x-auth-token": token,
          },
        }
      );

      if (response.data.success) {
        message.success("Archive deleted successfully");
        fetchArchives(); // Refresh the list
      }
    } catch (error) {
      message.error("Failed to delete archive");
    }
  };

  const handleSearch = (value) => {
    setSearchText(value);
    const filtered = archives.filter((archive) =>
      archive.name.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredArchives(filtered);
  };

  const columns = [
    {
      title: "Nom",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Date de création",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (text) => new Date(text).toLocaleDateString(),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space>
          <Button
            type="primary"
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleDeleteArchive(record._id)}
          >
            Supprimer
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <Content style={{ margin: "24px 16px" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: 16,
        }}
      >
        <Title level={2}>Mes Archives</Title>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => setIsModalVisible(true)}
        >
          Nouvelle Archive
        </Button>
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          marginBottom: 16,
        }}
      >
        <Search
          placeholder="Rechercher une archive..."
          allowClear
          size="large" 
          onSearch={handleSearch}
          onChange={(e) => handleSearch(e.target.value)}
          style={{
            width: "80%", 
            maxWidth: "600px", 
          }}
        />
      </div>

      <Table
        columns={columns}
        dataSource={filteredArchives}
        rowKey="_id"
        loading={loading}
      />

      <Modal
        title="Créer une nouvelle archive"
        open={isModalVisible}
        onCancel={() => {
          setIsModalVisible(false);
          form.resetFields();
        }}
        footer={null}
      >
        <Form form={form} onFinish={handleCreateArchive} layout="vertical">
          <Form.Item
            name="name"
            label="Nom de l'archive"
            rules={[
              {
                required: true,
                message: "Veuillez saisir le nom de l'archive",
              },
            ]}
          >
            <Input placeholder="Entrez le nom de l'archive" />
          </Form.Item>
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={creatingArchive}
              disabled={creatingArchive}
            >
              {creatingArchive ? "Création en cours..." : "Créer"}
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </Content>
  );
};

export default Archives;
