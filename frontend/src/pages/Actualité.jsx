import React from "react";
import { Button, Typography } from "antd";
import "./style/Actualité.css";
import Navbar from '../components/homepage/navbar/Navbar';
import Footer from "../components/homepage/Footer/Footer";

const { Title, Text } = Typography;

const ActualitePage = () => {
  return (
    
    <div className="actualite-page">
      <Navbar />
      {/* Hero Section */}
      <div className="actualite-section">
        <Title className="main-title">Actualité</Title>
        <Text className="breadcrumb">Accueille - Actualité</Text>

      </div>

      {/* Description Section */}
      <div className="description-container">
        <Title level={3}>
          Consultez les dernières actualités et informations sur la plate-forme et le domaine dés archives.
        </Title>
      </div>

      {/* Category Buttons */}
      <div className="category-buttons">
        <Button type="primary" className="category-btn">
          Mise à jour de la plateforme
        </Button>
        <Button type="primary" className="category-btn">
          Legislation des archives
        </Button>
        <Button type="primary" className="category-btn">
          Tendances
        </Button>
      </div>

      {/* News Section */}
      <div className="news-container">
        <div className="news-item">
          <div className="news-image">
            <img src="./assets/actualitéImage.jpg" alt="Platform Launch" />
          </div>
          <div className="news-content">
            <div className="news-text">
              <Title level={4}>Lancement officiel de la plateforme MY archive :</Title>
              <Text>une nouvelle ère pour la gestion documentaire en Tunisie</Text>
            </div>
            <div className="news-footer">
              <Button type="primary" className="read-more-btn">
                voir l'article complet
              </Button>
              <Text className="news-date">18 Avril 2025</Text>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
    
  );
};

export default ActualitePage;
