import React from "react";
import "./SecondSection.css"; // Custom CSS for the section

const SecondSection = () => {
  return (
    <section className="next-section">
      <div className="next-section-container">
        {/* Image on the left */}
        <div className="next-section-image">
          <img
            src="./assets/SecondImage.jpg"
            alt="Next Section"
            className="section-img"
          />
        </div>

        {/* Text content on the right */}
        <div className="next-section-content">
          <h2 className="section-title2">
            Pourquoi choisir notre plateforme ?
          </h2>
          <p className="section-text">
            Notre solution vous permet de transformer vos archives physiques en
            documents numériques accessibles en ligne en toute sécurité.
            Rejoignez les nombreuses entreprises qui ont déjà fait le pas vers
            une gestion documentaire moderne, simple
          </p>
        </div>
      </div>
    </section>
  );
};

export default SecondSection;
