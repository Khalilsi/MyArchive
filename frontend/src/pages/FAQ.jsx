import React from "react";
import { Typography, Collapse, Card, Form, Input, Button } from "antd";
import "./style/FAQ.css"; // Assuming you have a CSS file for styling
import Navbar from "../components/homepage/navbar/Navbar";
import Footer from "../components/homepage/Footer/Footer";

const { Title, Text } = Typography;
const { Panel } = Collapse;
const { TextArea } = Input;

const FAQPage = () => {
  return (
    <div className="faq-page">
      <Navbar />
      {/* Hero Section */}
      <div className="faq-section">
        <Title className="main-title">FAQ</Title>
        <Text className="breadcrumb">Accueil - FAQ</Text>
      </div>

      {/* Description Section */}
      <div className="description-container">
        <Text className="single-line-text">
          Retrouver les réponses aux questions fréquemment posées concernant
          notre plateforme
        </Text>
      </div>

      {/* FAQ Content */}
      <div className="faq-content-container">
        {/* Services Section */}
        <Card className="faq-section-card" title="NOS SERVICES">
          <Collapse bordered={false} defaultActiveKey={["1"]}>
            <Panel header="Quels services proposez-vous ?" key="1">
              <p>
                Nous proposons des services de numérisation, gestion et
                sécurisation des archives professionnelles.
              </p>
            </Panel>
            <Panel header="Comment créer un compte ?" key="2">
              <p>
                Vous pouvez créer un compte en cliquant sur "S'inscrire" et en
                suivant les étapes indiquées.
              </p>
            </Panel>
          </Collapse>
        </Card>

        {/* Account Section */}
        <Card className="faq-section-card" title="COMPTE UTILISATEUR">
          <Collapse bordered={false} defaultActiveKey={["1"]}>
            <Panel header="Comment vos données sont-elles protégées ?" key="1">
              <p>
                Nous utilisons des technologies de chiffrement avancées et des
                protocoles de sécurité stricts.
              </p>
            </Panel>
          </Collapse>
        </Card>

        {/* Payment Section */}
        <Card className="faq-section-card" title="PAIEMENT">
          <Collapse bordered={false} defaultActiveKey={["1"]}>
            <Panel header="Quels sont les modes de paiement acceptés ?" key="1">
              <p>
                Nous acceptons les cartes bancaires, virements et paiements
                mobiles.
              </p>
            </Panel>
          </Collapse>
        </Card>

        {/* Platform Usage Section */}
        <Card className="faq-section-card" title="UTILISATION DE LA PLATEFORME">
          <Collapse bordered={false} defaultActiveKey={["1"]}>
            <Panel header="Comment importer mes documents ?" key="1">
              <p>
                Vous pouvez importer des documents via l'interface de drag &
                drop ou le bouton d'importation.
              </p>
            </Panel>
          </Collapse>
        </Card>

        {/* Contact Form */}
        <div className="contact-form-container">
          <Title level={3}>
            Vous n'avez pas trouvé de réponse à votre question ?
          </Title>
          <Form layout="vertical">
            <div className="form-row">
              <Form.Item label="Nom (facultatif)" className="form-half">
                <Input placeholder="Votre nom" />
              </Form.Item>
              <Form.Item label="Email" className="form-half">
                <Input placeholder="Votre email" />
              </Form.Item>
            </div>
            <Form.Item label="Sujet de question">
              <Input placeholder="Sujet de votre question" />
            </Form.Item>
            <Form.Item label="Message">
              <TextArea rows={4} placeholder="Votre message" />
            </Form.Item>
            <Form.Item wrapperCol={{ span: 24 }} style={{ textAlign: "center" }}>   
              <Button type="primary" size="large" >
                Envoyez
              </Button>
            </Form.Item>
          </Form>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default FAQPage;
