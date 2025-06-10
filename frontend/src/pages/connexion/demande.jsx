import React, { useState, useEffect } from "react";
import {
  Form,
  Input,
  Select,
  Radio,
  Button,
  Tag,
  message,
  Card,
  Col,
  Row,
  Result,
  Modal,
  Typography,
  Spin,
  Tooltip,
  Popover,
} from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";
import axios from "axios";
import "../style/demande.css";
import apiClient from "../../Api/client";

const { Title, Paragraph } = Typography;

const RequestForm = () => {
  const [form] = Form.useForm();
  const [selectedArchives, setSelectedArchives] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [forfaits, setForfaits] = useState([]);
  const [loadingForfaits, setLoadingForfaits] = useState(true);

  useEffect(() => {
    const fetchForfaits = async () => {
      try {
        const res = await apiClient.get("/api/forfaits");
        setForfaits(res.data.data);
      } catch (err) {
        message.error("Échec de chargement des forfaits");
      } finally {
        setLoadingForfaits(false);
      }
    };
    fetchForfaits();
  }, []);

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

  const handlePackageSelect = (pkgId) => {
    setSelectedPackage(pkgId);
    form.setFieldsValue({ package: pkgId });
  };

  const onFinish = async (values) => {
    setSubmitting(true);
    try {
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
        setIsSuccess(true);
        form.resetFields();
        setSelectedArchives([]);
        setSelectedPackage(null);
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
  const formatFeatureKey = (key) => {
    const labels = {
      gedDashboard: "Tableau de bord GED",
      classementAuto: "Classement automatique",
      ocrSearch: "Recherche OCR",
      cloudStorage: "Stockage Cloud",
      activityLog: "Journal d’activité",
      batchDownload: "Téléchargement groupé",
      autoBackup: "Sauvegarde automatique",
      apiIntegration: "Intégration API",
      dataSecurity: "Sécurité des données",
    };
    return labels[key] || key;
  };

  const formatFeatureValue = (value) => {
    if (typeof value === "boolean") {
      return value ? "Oui" : "Non";
    }
    return value;
  };

  if (isSuccess) {
    return (
      <div className="request-container">
        <Modal
          open={isSuccess}
          footer={null}
          closable={false}
          centered
          width={600}
          maskStyle={{ backgroundColor: "rgba(0, 0, 0, 0.6)" }}
          bodyStyle={{ padding: "4px" }}
        >
          <Result
            status="success"
            title="Demande envoyée avec succès!"
            subTitle="Nous avons bien reçu votre demande de numérisation. Notre équipe la traitera dans les plus brefs délais."
            extra={[
              <Button
                type="primary"
                key="new"
                onClick={() => {
                  setIsSuccess(false);
                  form.resetFields();
                }}
              >
                Nouvelle Demande
              </Button>,
              <Button key="home" onClick={() => (window.location.href = "/")}>
                Retour à l'accueil
              </Button>,
            ]}
          />
        </Modal>
      </div>
    );
  }

  return (
    <div className="request-container">
      <div className="left-panel">
        <Tooltip title="Allez à la page de connexion">
          <Button
            type="text"
            icon={
              <ArrowLeftOutlined style={{ fontSize: "20px", color: "white" }} />
            }
            onClick={() =>
              (window.location.href = "http://localhost:3000/login")
            }
            style={{
              position: "absolute",
              top: 20,
              left: 20,
              zIndex: 10,
              backgroundColor: "rgba(0, 0, 0, 0.4)",
              border: "none",
              boxShadow: "0 0 4px rgba(0,0,0,0.5)",
            }}
          />
        </Tooltip>
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
        >
          <h2>
            Remplissez le formulaire pour commencer votre demande de
            numérisation :
          </h2>

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
                      color="blue"
                      key={type}
                      closable
                      onClose={() => removeArchiveType(type)}
                      style={{ margin: "8px", padding: "6px" }}
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
            {loadingForfaits ? (
              <Spin />
            ) : (
              <Row gutter={[16, 16]} justify="space-around">
                {forfaits.map((forfait) => (
                  <Col key={forfait._id} xs={24} sm={12} md={8}>
                    <Popover
                      placement="top"
                      title="Détails du forfait"
                      content={
                        <div style={{ maxWidth: "250px" }}>
                          {Object.entries(forfait.features || {}).map(
                            ([key, value]) => (
                              <p key={key} style={{ marginBottom: 4 }}>
                                <strong>{formatFeatureKey(key)}:</strong>{" "}
                                {formatFeatureValue(value)}
                              </p>
                            )
                          )}
                        </div>
                      }
                    >
                      <Card
                        className={`package-card ${
                          selectedPackage === forfait._id ? "selected" : ""
                        }`}
                        onClick={() => handlePackageSelect(forfait._id)}
                        hoverable
                      >
                        <div className="package-card-content">
                          <h3>{forfait.name}</h3>
                          <Paragraph>
                            <strong>Prix:</strong> {forfait.annualPrice} TND /
                            an
                          </Paragraph>
                          <Paragraph>
                            <strong>Documents max/an:</strong>{" "}
                            {forfait.maxDocumentsPerYear}
                          </Paragraph>
                        </div>
                      </Card>
                    </Popover>
                  </Col>
                ))}
              </Row>
            )}
          </Form.Item>

          <Form.Item>
            <Button
              size="large"
              type="primary"
              htmlType="submit"
              className="submit-btn"
              block
              loading={submitting}
            >
              {submitting ? "Envoi en cours..." : "Envoyer ma demande"}
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default RequestForm;
