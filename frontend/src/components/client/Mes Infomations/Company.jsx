import React, { useState, useEffect } from "react";
import {
  Layout,
  Card,
  Form,
  Input,
  Button,
  message,
  Descriptions,
  Space,
  Select,
} from "antd";
import axios from "axios";

const { Content } = Layout;

const CompanyInfo = () => {
  const [company, setCompany] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(true);

  const fetchCompanyInfo = async () => {
    try {
      const token =
        localStorage.getItem("token") || sessionStorage.getItem("token");
      const response = await axios.get(
        "http://localhost:4000/api/requests/company/info",
        {
          headers: {
            "x-auth-token": token,
          },
        }
      );

      if (response.data.success) {
        setCompany(response.data.data);
        form.setFieldsValue(response.data.data);
      }
    } catch (error) {
      message.error(
        "Erreur lors de la récupération des informations de l'entreprise"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCompanyInfo();
  }, []);

  const handleUpdate = async (values) => {
    try {
      const token =
        localStorage.getItem("token") || sessionStorage.getItem("token");
      const response = await axios.patch(
        "http://localhost:4000/api/requests/company/update",
        values,
        {
          headers: {
            "x-auth-token": token,
          },
        }
      );

      if (response.data.success) {
        message.success("Informations mises à jour avec succès");
        setCompany(response.data.data);
        setIsEditing(false);
      }
    } catch (error) {
      message.error("Erreur lors de la mise à jour des informations");
    }
  };

  if (loading) {
    return <div>Chargement...</div>;
  }

  return (
    <Content style={{ margin: "24px 16px", padding: 24, minHeight: 280 }}>
      <Card
        title="Informations de l'entreprise"
        extra={
          !isEditing && (
            <Button type="primary" onClick={() => setIsEditing(true)}>
              Modifier
            </Button>
          )
        }
      >
        {!isEditing ? (
          <Descriptions bordered column={1}>
            <Descriptions.Item label="Nom de l'entreprise">
              {company?.nomEntreprise}
            </Descriptions.Item>
            <Descriptions.Item label="Secteur d'activité">
              {company?.secteurActivite}
            </Descriptions.Item>
            <Descriptions.Item label="Adresse">
              {company?.adresse}
            </Descriptions.Item>
            <Descriptions.Item label="Téléphone">
              {company?.telephone}
            </Descriptions.Item>
            <Descriptions.Item label="Type d'entreprise">
              {company?.typeEntreprise || "Non spécifié"}
            </Descriptions.Item>
            <Descriptions.Item label="Numéro d'identification fiscale">
              {company?.numeroIdentificationFiscale || "Non spécifié"}
            </Descriptions.Item>
            <Descriptions.Item label="Site web">
              {company?.siteWeb || "Non spécifié"}
            </Descriptions.Item>
          </Descriptions>
        ) : (
          <Form
            form={form}
            layout="vertical"
            onFinish={handleUpdate}
            initialValues={company}
          >
            <Form.Item
              name="typeEntreprise"
              label="Type d'entreprise"
              rules={[
                { required: true, message: "Le type d'entreprise est requis" },
              ]}
            >
              <Select placeholder="Sélectionnez le type d'entreprise">
                <Select.Option value="SARL">
                  SARL - Société à Responsabilité Limitée
                </Select.Option>
                <Select.Option value="SA">SA - Société Anonyme</Select.Option>
                <Select.Option value="SAS">
                  SAS - Société par Actions Simplifiée
                </Select.Option>
                <Select.Option value="SUARL">
                  SUARL - Société Unipersonnelle à Responsabilité Limitée
                </Select.Option>
                <Select.Option value="SNC">
                  SNC - Société en Nom Collectif
                </Select.Option>
                <Select.Option value="SCS">
                  SCS - Société en Commandite Simple
                </Select.Option>
                <Select.Option value="GIE">
                  GIE - Groupement d'Intérêt Économique
                </Select.Option>
              </Select>
            </Form.Item>

            <Form.Item
              name="numeroIdentificationFiscale"
              label="Numéro d'identification fiscale"
            >
              <Input />
            </Form.Item>

            <Form.Item name="telephone" label="Téléphone">
              <Input />
            </Form.Item>

            <Form.Item name="adresse" label="Adresse">
              <Input />
            </Form.Item>

            <Form.Item name="siteWeb" label="Site web">
              <Input />
            </Form.Item>

            <Form.Item>
              <Space>
                <Button type="primary" htmlType="submit">
                  Enregistrer
                </Button>
                <Button
                  onClick={() => {
                    setIsEditing(false);
                    form.setFieldsValue(company);
                  }}
                >
                  Annuler
                </Button>
              </Space>
            </Form.Item>
          </Form>
        )}
      </Card>
    </Content>
  );
};

export default CompanyInfo;
