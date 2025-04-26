import React, { useState } from "react";
import {
  Form,
  Input,
  Select,
  Radio,
  Button,
  Tag,
  message,
  Card,
  Row,
  Col,
  Typography,
} from "antd";
import axios from "axios";
import "../style/demande.css";

const RequestForm = () => {
  const [form] = Form.useForm();
  const [selectedArchives, setSelectedArchives] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState(null);

  const sectors = [
    "Technologie",
    "Santé",
    "Éducation",
    "Finance",
    "Agriculture",
    "Autre",
  ];
  const archiveTypes = [
    "Factures",
    "Contrats",
    "Photos",
    "Documents légaux",
    "Correspondance",
  ];
  const packages = ["Standard", "Premium", "Entreprise"];

  const handleArchiveTypeChange = (value) => {
    if (value && !selectedArchives.includes(value)) {
      setSelectedArchives([...selectedArchives, value]);
      form.setFieldsValue({ archiveTypes: [...selectedArchives, value] });
    }
  };

  const removeArchiveType = (typeToRemove) => {
    const newArchives = selectedArchives.filter(
      (type) => type !== typeToRemove
    );
    setSelectedArchives(newArchives);
    form.setFieldsValue({ archiveTypes: newArchives });
  };

  const handlePackageSelect = (pkg) => {
    setSelectedPackage(pkg);
    form.setFieldsValue({ package: pkg });
  };

  const onFinish = async (values) => {
    setSubmitting(true);
    try {
      // Prepare data to match your API structure
      const requestData = {
        nomEntreprise: values.companyName,
        secteurActivite: values.sector,
        adresse: values.address,
        telephone: values.phone,
        email: values.email,
        typeArchives: selectedArchives,
        forfait: values.package,
      };

      const response = await axios.post(
        "http://localhost:4000/api/requests/",
        requestData
      );

      if (response.data.success) {
        message.success(response.data.msg);
        form.resetFields();
        setSelectedArchives([]);
      } else {
        message.error("Erreur lors de la soumission de la demande");
      }
    } catch (error) {
      console.error("API Error:", error);
      message.error(
        error.response?.data?.msg ||
          "Une erreur est survenue lors de l'envoi de la demande"
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="request-container">
      <div className="left-panel">
        <div className="image-overlay">
          <h1>Vous avez des archives à numériser ?</h1>
          <p>Simplifiez votre gestion documentaire dès aujourd'hui!</p>
          <p>
            Nous offrons des solutions adaptées à vos besoins pour transformer
            vos documents physiques en fichiers numériques organisés.
          </p>
        </div>
      </div>

      <div className="right-panel">
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          initialValues={{ remember: false }}
          className="request-form"
        >
          <Typography.Title level={2}>
            Remplissez le formulaire pour commencer votre demande de
            numérisation :
          </Typography.Title>

          <div className="form-row">
            <Form.Item
              name="companyName"
              label="Nom de l'entreprise / organisation"
              rules={[{ required: true, message: "Ce champ est requis" }]}
            >
              <Input size="large" />
            </Form.Item>

            <Form.Item
              name="sector"
              label="Secteur d'activité"
              rules={[{ required: true, message: "Ce champ est requis" }]}
            >
              <Select placeholder="Sélectionnez un secteur" size="large">
                {sectors.map((sector) => (
                  <Select.Option key={sector} value={sector}>
                    {sector}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </div>

          <div className="form-row">
            <Form.Item
              name="address"
              label="Adresse complète"
              rules={[{ required: true, message: "Ce champ est requis" }]}
            >
              <Input size="large" />
            </Form.Item>

            <Form.Item
              name="phone"
              label="Numéro de téléphone"
              rules={[{ required: true, message: "Ce champ est requis" }]}
            >
              <Input size="large" />
            </Form.Item>
          </div>

          <div className="form-row">
            <Form.Item
              name="email"
              label="Email"
              rules={[
                { required: true, message: "Ce champ est requis" },
                { type: "email", message: "Email invalide" },
              ]}
            >
              <Input size="large" />
            </Form.Item>

            <Form.Item
              name="archiveTypes"
              label="Type(s) d'archives à numériser"
              rules={[
                { required: true, message: "Sélectionnez au moins un type" },
              ]}
            >
              <div>
                <Select
                  style={{ width: "100%" }}
                  placeholder="Sélectionnez un type"
                  onChange={handleArchiveTypeChange}
                  value={null}
                  size="large"
                >
                  {archiveTypes.map((type) => (
                    <Select.Option
                      key={type}
                      value={type}
                      disabled={selectedArchives.includes(type)}
                    >
                      {type}
                    </Select.Option>
                  ))}
                </Select>
                <div className="selected-archives">
                  {selectedArchives.map((type) => (
                    <Tag
                      key={type}
                      closable
                      onClose={() => removeArchiveType(type)}
                      style={{ margin: "7px" }}
                      color="blue"
                    >
                      {type}
                    </Tag>
                  ))}
                </div>
              </div>
            </Form.Item>
          </div>

          <Form.Item
            name="package"
            label="Choisir un forfait"
            rules={[
              { required: true, message: "Veuillez sélectionner un forfait" },
            ]}
            className="packages-row"
          >
            <Row gutter={[16, 16]} >
              {packages.map((pkg) => (
                <Col key={pkg} xs={24} sm={12} md={8}>
                  <Card
                    className={`package-card ${
                      selectedPackage === pkg ? "selected" : ""
                    }`}
                    onClick={() => handlePackageSelect(pkg)}
                    hoverable
                  >
                    <div className="package-card-content">
                      <Radio
                        checked={selectedPackage === pkg}
                        style={{ display: "none" }}
                      />
                      <h3>{pkg}</h3>
                      <div className="package-details">
                        
                      </div>
                    </div>
                  </Card>
                </Col>
              ))}
            </Row>
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              className="submit-btn"
              size="large"
              style={{
                width: "50%",
                alignContent: "center",
                marginLeft: "25%",
              }}
              block
              loading={submitting}
            >
              {submitting ? "Envoi en cours..." : "Envoyer"}
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default RequestForm;
