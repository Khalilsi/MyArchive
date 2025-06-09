import React from "react";
import { useTranslation } from "react-i18next";
import "./HeroSection.css"; // Custom CSS for the Hero Section

const HeroSection = () => {
  const { t } = useTranslation();

  return (
    <section className="hero-section">
      <div className="hero-content">
        <h1 className="hero-title">MY archive</h1>
        <p className="hero-subtitle">{t('hero.subtitle')}</p>
        <div className="hero-buttons">
          <button className="hero-button white" onClick={() => window.location.href='/demande'}>
            {t('hero.start')}
          </button>
          <button className="hero-button dark" onClick={() => window.location.href='/login'}>
            {t('hero.login')}
          </button>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
