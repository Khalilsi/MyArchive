import React, { useState, useEffect } from "react";
import {
  Card,
  Switch,
  List,
  Table,
  Typography,
  Button,
  Modal,
  Form,
  Input,
  message,
  notification,
} from "antd";
import {
  LockOutlined,
  SafetyCertificateOutlined,
  EyeInvisibleOutlined,
  EyeTwoTone,
  CheckCircleFilled,
  CloseCircleFilled,
} from "@ant-design/icons";
import axios from "axios";
import apiClient from "../../../Api/client"; // Adjust the import path as necessary

const { Title } = Typography;

const SecuritySettings = () => {
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [form] = Form.useForm();
  const [connectionHistory, setConnectionHistory] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(true);

  useEffect(() => {
    fetchConnectionHistory();
  }, []);

  const fetchConnectionHistory = async () => {
    try {
      const token =
        localStorage.getItem("token") || sessionStorage.getItem("token");
      const response = await apiClient.get(
        "/api/profile/connection-history",
        {
          headers: {
            "x-auth-token": token,
          },
        }
      );

      if (response.data.success) {
        setConnectionHistory(response.data.data);
      }
    } catch (error) {
      notification.error({
        message: "Erreur",
        description: "Impossible de charger l'historique des connexions",
        duration: 4,
        placement: "topRight",
      });
    } finally {
      setLoadingHistory(false);
    }
  };

  const columns = [
    {
      title: "IP",
      dataIndex: "ip",
      key: "ip",
    },
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
    },
    {
      title: "Appareil utilisé",
      dataIndex: "device",
      key: "device",
    },
  ];

  const showPasswordModal = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    form.resetFields();
    setIsModalVisible(false);
  };

  const handlePasswordChange = async (values) => {
    setIsLoading(true);
    try {
      const token =
        localStorage.getItem("token") || sessionStorage.getItem("token");
      const response = await apiClient.post(
        "/api/profile/change-password",
        values,
        {
          headers: {
            "x-auth-token": token,
          },
        }
      );

      if (response.data.success) {
        // Close modal and reset form
        form.resetFields();
        setIsModalVisible(false);

        // Show success notification
        notification.success({
          message: "Mot de passe modifié",
          description:
            "Votre mot de passe a été modifié avec succès. Vous devrez utiliser ce nouveau mot de passe lors de votre prochaine connexion.",
          duration: 6,
          placement: "topRight",
          icon: <CheckCircleFilled style={{ color: "#52c41a" }} />,
        });
      }
    } catch (error) {
      // Show error notification
      notification.error({
        message: "Erreur",
        description:
          error.response?.data?.msg ||
          "Erreur lors du changement de mot de passe",
        duration: 4,
        placement: "topRight",
        icon: <CloseCircleFilled style={{ color: "#ff4d4f" }} />,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const validatePassword = (_, value) => {
    if (!value) {
      return Promise.reject("Veuillez entrer un mot de passe");
    }
    if (value.length < 8) {
      return Promise.reject(
        "Le mot de passe doit contenir au moins 8 caractères"
      );
    }
    if (!/\d/.test(value)) {
      return Promise.reject(
        "Le mot de passe doit contenir au moins un chiffre"
      );
    }
    if (!/[a-z]/.test(value)) {
      return Promise.reject(
        "Le mot de passe doit contenir au moins une lettre minuscule"
      );
    }
    if (!/[A-Z]/.test(value)) {
      return Promise.reject(
        "Le mot de passe doit contenir au moins une lettre majuscule"
      );
    }
    return Promise.resolve();
  };

  return (
    <div style={{ padding: "24px" }}>
      <Title level={2}>Paramètres de sécurité</Title>

      <Card style={{ marginBottom: "24px" }}>
        <List>
          <List.Item
            actions={[
              <Button
                type="primary"
                icon={<LockOutlined />}
                onClick={showPasswordModal}
              >
                Modifier
              </Button>,
            ]}
          >
            <List.Item.Meta
              avatar={<LockOutlined />}
              title="Modification du mot de passe"
              description="Changez votre mot de passe pour sécuriser votre compte"
            />
          </List.Item>

          <List.Item
            actions={[
              <Switch
                checked={twoFactorEnabled}
                onChange={(checked) => setTwoFactorEnabled(checked)}
                key="switch"
              />,
            ]}
          >
            <List.Item.Meta
              avatar={<SafetyCertificateOutlined />}
              title="Activation de l'authentification à deux facteurs"
              description="Ajoutez une couche de sécurité supplémentaire à votre compte"
            />
          </List.Item>
        </List>
      </Card>

      <Modal
        title="Modification du mot de passe"
        open={isModalVisible}
        onCancel={handleCancel}
        footer={null}
        maskClosable={false}
      >
        <Form form={form} layout="vertical" onFinish={handlePasswordChange}>
          <Form.Item
            name="currentPassword"
            label="Mot de passe actuel"
            rules={[
              {
                required: true,
                message: "Veuillez entrer votre mot de passe actuel",
              },
            ]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              iconRender={(visible) =>
                visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
              }
              placeholder="Entrez votre mot de passe actuel"
            />
          </Form.Item>

          <Form.Item
            name="newPassword"
            label="Nouveau mot de passe"
            rules={[{ validator: validatePassword }]}
            hasFeedback
          >
            <Input.Password
              prefix={<LockOutlined />}
              iconRender={(visible) =>
                visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
              }
              placeholder="Entrez votre nouveau mot de passe"
            />
          </Form.Item>

          <Form.Item
            name="confirmPassword"
            label="Confirmez le nouveau mot de passe"
            dependencies={["newPassword"]}
            hasFeedback
            rules={[
              {
                required: true,
                message: "Veuillez confirmer votre mot de passe",
              },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("newPassword") === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(
                    "Les mots de passe ne correspondent pas"
                  );
                },
              }),
            ]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              iconRender={(visible) =>
                visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
              }
              placeholder="Confirmez votre nouveau mot de passe"
            />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              size="large"
              loading={isLoading}
              block
            >
              Modifier le mot de passe
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      <Card>
        <Title level={3}>Historique des connexions</Title>
        <Table
          columns={columns}
          dataSource={connectionHistory}
          pagination={false}
          loading={loadingHistory}
          locale={{
            emptyText: "Aucun historique de connexion disponible",
          }}
        />
      </Card>
    </div>
  );
};

export default SecuritySettings;
