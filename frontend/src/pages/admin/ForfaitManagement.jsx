import React, { useEffect, useState } from 'react';
import { Card, Typography, InputNumber, Input, Button, Form, message, Row, Col, Spin } from 'antd';
import axios from 'axios';

const { Title } = Typography;

const ForfaitManagement = () => {
  const [forfaits, setForfaits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchForfaits();
  }, []);

  const fetchForfaits = async () => {
    try {
      setLoading(true);
      const res = await axios.get('http://localhost:4000/api/forfaits');
      setForfaits(res.data.data);
    } catch (err) {
      message.error("Échec de chargement des forfaits");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (id, values) => {
    try {
      await axios.put(`http://localhost:4000/api/forfaits/${id}`, values, {
        headers: {
          'x-auth-token': localStorage.getItem('token') || sessionStorage.getItem('token'),
        },
      });
      message.success('Forfait mis à jour avec succès');
      fetchForfaits();
    } catch (error) {
      message.error("Erreur lors de la mise à jour du forfait");
    }
  };

  return (
    <div style={{ padding: 24 }}>
      <Title level={2}>Gestion des Forfaits</Title>
      {loading ? (
        <Spin size="large" />
      ) : (
        <Row gutter={[16, 16]}>
          {forfaits.map((forfait) => (
            <Col key={forfait._id} xs={24} sm={12} md={8}>
              <Card title={forfait.name} bordered>
                <Form
                  initialValues={forfait}
                  onFinish={(values) => handleUpdate(forfait._id, values)}
                  layout="vertical"
                >
                  <Form.Item name="name" label="Nom">
                    <Input />
                  </Form.Item>

                  <Form.Item name="maxStorage" label="Espace Max (en Mo)">
                    <InputNumber min={1} style={{ width: '100%' }} />
                  </Form.Item>

                  <Form.Item name="price" label="Prix (TND)">
                    <InputNumber min={0} style={{ width: '100%' }} />
                  </Form.Item>

                  <Form.Item>
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
    </div>
  );
};

export default ForfaitManagement;
