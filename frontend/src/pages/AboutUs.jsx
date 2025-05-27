import React from "react";
import { Button, Typography } from "antd";
import "./style/AboutUs.css";
import Navbar from "../components/homepage/navbar/Navbar";
import Footer from "../components/homepage/Footer/Footer";

const { Title, Text } = Typography;

const AboutPage = () => {
  return (
    <div className="about-page">
      <Navbar />
      {/* Hero Section */}
      <div className="about-section">
        <Title className="main-title">À propos de nous</Title>
        <Text className="breadcrumb">Accueil - À propos</Text>
      </div>

      {/* Main Content */}
      <div className="about-section-container">
        {/* Qui sommes-nous */}
        <div className="image-text-side">
          <div className="side-text-content">
            <Title level={2} className="side-title">
              Qui sommes-nous ?
            </Title>
            <Text className="side-text">
              MY archive est une plateforme 100% tunisienne spécialisée dans la
              numérisation, la gestion et la sécurité des archives
              professionnelles.
              <br />
              <br />
              Nous aidons les entreprises, institutions et professionnels à
              passer au digital en leur offrant une solution simple, rapide et
              performante pour organiser, stocker et accéder à leurs documents
              en ligne, en toute sécurité.
            </Text>
          </div>
          <img
            src="./assets/about-image1.png"
            alt="MY Archive"
            className="about-side-image"
          />
        </div>

        {/* Notre mission */}
        <div className="image-text-side">
          <img
            src="./assets/about-image22.jpeg"
            alt="MY Archive Mission"
            className="about-side-image"
          />
          <div className="side-text-content">
            <Title level={2} className="side-title">
              Notre mission
            </Title>
            <Text className="side-text">
              Notre mission est de faciliter la transformation digitale des
              entreprises tunisiennes en proposant un service de numérisation
              sur mesure, conforme aux normes, et pensé pour les réalités
              locales.
              <br />
              <br />
              Nous visons à rendre la gestion documentaire plus fluide, plus
              efficace, et accessible à tous, peu importe la taille de
              l'organisation.
            </Text>
          </div>
        </div>

        {/* Nos valeurs */}
        <div className="image-text-side">
          <img
            src="./assets/about-image3.jpeg"
            alt="MY Archive Values"
            className="about-side-image"
          />
          <div className="side-text-content">
            <Title level={2} className="side-title">
              Nos valeurs
            </Title>
            <Text className="side-text values-text">
              Sécurité : Vos données sont précieuses, nous les protégeons avec
              les plus hauts standards.
              {"\n\n"}
              Simplicité : Une plateforme intuitive et accessible, pensée pour
              tous les profils utilisateurs.
              {"\n\n"}
              Proximité : Un accompagnement personnalisé et un service client
              réactif, local et humain.
              {"\n\n"}
              Innovation : Une veille constante pour intégrer les meilleures
              technologies de traitement documentaire.
            </Text>
          </div>
        </div>

        {/* Pourquoi nous choisir */}
        <div className="image-text-side">
          <div className="side-text-content">
            <Title level={2} className="side-title">
              Pourquoi nous choisir ?
            </Title>
            <ul className="benefits-list">
              <li>Expertise locale en archivage numérique</li>
              <li>Infrastructure sécurisée avec hébergement en Tunisie</li>
              <li>
                Interface utilisateur claire, en plusieurs langues (arabe,
                français, anglais)
              </li>
              <li>Support technique 24/7</li>
              <li>Plans adaptés aux TPE, PME et grandes entreprises</li>
            </ul>
          </div>
          <img
            src="./assets/about-image1.png"
            alt="Why Choose Us"
            className="about-side-image"
          />
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default AboutPage;
