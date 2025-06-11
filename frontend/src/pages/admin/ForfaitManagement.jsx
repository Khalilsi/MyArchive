import React, { useEffect, useState } from "react";
import {
  Card,
  Typography,
  InputNumber,
  Input,
  Button,
  Form,
  message,
  Row,
  Col,
  Spin,
  Divider,
  Select,
  Modal,
} from "antd";
import axios from "axios";
import apiClient from '../../Api/client'; 

const { Title } = Typography;

const ForfaitManagement = () => {
  const [forfaits, setForfaits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [newFeatureKey, setNewFeatureKey] = useState("");
  const [newFeatureValues, setNewFeatureValues] = useState("");
  const [selectedFeatureToDelete, setSelectedFeatureToDelete] = useState({});

  useEffect(() => {
    fetchForfaits();
  }, []);

  const fetchForfaits = async () => {
    try {
      setLoading(true);
      const res = await apiClient.get("/api/forfaits");
      setForfaits(res.data.data);
    } catch (err) {
      message.error("Échec de chargement des forfaits");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (id, values) => {
    const payload = {
      name: values.name,
      maxDocumentsPerYear: values.maxDocumentsPerYear,
      maxDocumentsPerMonth: values.maxDocumentsPerMonth,
      unitPrice: values.unitPrice,
      annualPrice: values.annualPrice,
      features: {},
    };

    // Extract feature fields dynamically
    Object.keys(values).forEach((key) => {
      if (key.startsWith("features.")) {
        const featureKey = key.split(".")[1];
        payload.features[featureKey] = values[key];
      }
    });

    try {
      await axios.put(`/api/forfaits/${id}`, payload, {
        headers: {
          "x-auth-token":
            localStorage.getItem("token") || sessionStorage.getItem("token"),
        },
      });
      message.success("Forfait mis à jour avec succès");
      fetchForfaits();
    } catch (error) {
      message.error("Erreur lors de la mise à jour du forfait");
    }
  };

  const featureLabels = {
    gedDashboard: "Tableau de bord GED",
    classementAuto: "Classement Automatique",
    ocrSearch: "Recherche OCR",
    cloudStorage: "Stockage Cloud",
    activityLog: "Journal d’Activité",
    batchDownload: "Téléchargement Groupé",
    autoBackup: "Sauvegarde Automatique",
    apiIntegration: "Intégration API",
    dataSecurity: "Sécurité des Données",
    // Add more if needed
  };

  const featureOptions = {
    gedDashboard: ["none", "basic", "advanced", "custom"],
    classementAuto: ["none", "basic", "advanced", "custom"],
    ocrSearch: ["none", "basic", "advanced", "multilingual+AI"],
    cloudStorage: ["shared", "encrypted", "dedicated"],
    activityLog: ["none", "basic", "detailed", "detailed+alerts"],
    apiIntegration: ["none", "standard", "full+support"],
    dataSecurity: ["basic", "legal", "full+SLA+GDPR"],
  };

  return (
    <div style={{ padding: 24 }}>
      <Title level={2}>Gestion des Forfaits</Title>
      <div style={{ marginBottom: 16 }}>
        <Button type="dashed" onClick={() => setIsModalVisible(true)}>
          + Ajouter une nouvelle fonctionnalité
        </Button>
      </div>
      {loading ? (
        <Spin size="large" />
      ) : (
        <Row gutter={[16, 16]}>
          {forfaits.map((forfait) => (
            <Col key={forfait._id} xs={24} sm={12} md={8}>
              <Card title={forfait.name} bordered>
                <Form
                  initialValues={{
                    ...forfait,
                    ...Object.fromEntries(
                      Object.entries(forfait.features || {}).map(
                        ([key, value]) => [`features.${key}`, value]
                      )
                    ),
                  }}
                  onFinish={(values) => handleUpdate(forfait._id, values)}
                  layout="vertical"
                >
                  <Form.Item name="name" label="Nom">
                    <Input />
                  </Form.Item>

                  <Form.Item
                    name="maxDocumentsPerYear"
                    label="Nombre de Documents / An"
                  >
                    <InputNumber min={0} style={{ width: "100%" }} />
                  </Form.Item>

                  <Form.Item
                    name="maxDocumentsPerMonth"
                    label="Nombre de Documents / Mois"
                  >
                    <InputNumber min={0} style={{ width: "100%" }} />
                  </Form.Item>

                  <Form.Item name="unitPrice" label="Prix Unitaire (TND)">
                    <InputNumber
                      min={0}
                      step={0.01}
                      style={{ width: "100%" }}
                    />
                  </Form.Item>

                  <Form.Item name="annualPrice" label="Prix Annuel (TND)">
                    <InputNumber
                      min={0}
                      step={0.01}
                      style={{ width: "100%" }}
                    />
                  </Form.Item>

                  <Divider>Fonctionnalités</Divider>

                  {forfait.features &&
                    Object.entries(forfait.features).map(([key, value]) => (
                      <Form.Item
                        key={key}
                        name={`features.${key}`}
                        label={
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                            }}
                          >
                            <span>{featureLabels[key] || key}</span>
                            <input
                              style={{ marginLeft: 8 }}
                              type="radio"
                              name={`selectedFeature-${forfait._id}`}
                              onChange={() =>
                                setSelectedFeatureToDelete((prev) => ({
                                  ...prev,
                                  [forfait._id]: key,
                                }))
                              }
                              checked={
                                selectedFeatureToDelete[forfait._id] === key
                              }
                            />
                          </div>
                        }
                      >
                        {typeof value === "boolean" ? (
                          <Select>
                            <Select.Option value={true}>Oui</Select.Option>
                            <Select.Option value={false}>Non</Select.Option>
                          </Select>
                        ) : featureOptions[key] ? (
                          <Select>
                            {featureOptions[key].map((option) => (
                              <Select.Option key={option} value={option}>
                                {option}
                              </Select.Option>
                            ))}
                          </Select>
                        ) : (
                          <Input />
                        )}
                      </Form.Item>
                    ))}

                  <Form.Item>
                    {selectedFeatureToDelete[forfait._id] && (
                      <Form.Item>
                        <Button
                          danger
                          block
                          onClick={() => {
                            const updated = forfaits.map((f) =>
                              f._id === forfait._id
                                ? {
                                    ...f,
                                    features: Object.fromEntries(
                                      Object.entries(f.features).filter(
                                        ([k]) =>
                                          k !==
                                          selectedFeatureToDelete[forfait._id]
                                      )
                                    ),
                                  }
                                : f
                            );
                            setForfaits(updated);
                            setSelectedFeatureToDelete((prev) => ({
                              ...prev,
                              [forfait._id]: null,
                            }));
                            message.success(
                              `Fonctionnalité supprimée avec succès`
                            );
                          }}
                        >
                          Supprimer la fonctionnalité sélectionnée
                        </Button>
                      </Form.Item>
                    )}

                    <Button type="primary" htmlType="submit" block>
                      Mettre à jour
                    </Button>
                  </Form.Item>
                </Form>
              </Card>
            </Col>
          ))}
        </Row>
      )}
      <Modal
        title="Ajouter une nouvelle fonctionnalité"
        visible={isModalVisible}
        onCancel={() => {
          setIsModalVisible(false);
          setNewFeatureKey("");
          setNewFeatureValues("");
        }}
        onOk={() => {
          if (!newFeatureKey || !newFeatureValues) {
            message.warning("Nom ou valeurs manquants.");
            return;
          }

          const key = newFeatureKey.trim();
          const values = newFeatureValues.split(",").map((v) => v.trim());

          // Update frontend mappings
          featureLabels[key] = key;
          featureOptions[key] = values;

          // Add to all forfaits
          const updated = forfaits.map((f) => ({
            ...f,
            features: {
              ...f.features,
              [key]: values[0], // default to first value
            },
          }));

          setForfaits(updated);
          message.success(`Fonctionnalité "${key}" ajoutée`);
          setIsModalVisible(false);
          setNewFeatureKey("");
          setNewFeatureValues("");
        }}
      >
        <Form layout="vertical">
          <Form.Item label="Nom de la fonctionnalité">
            <Input
              placeholder="ex: advancedAI"
              value={newFeatureKey}
              onChange={(e) => setNewFeatureKey(e.target.value)}
            />
          </Form.Item>
          <Form.Item label="Valeurs possibles (séparées par des virgules)">
            <Input
              placeholder="ex: alpha,beta,gamma"
              value={newFeatureValues}
              onChange={(e) => setNewFeatureValues(e.target.value)}
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ForfaitManagement;
