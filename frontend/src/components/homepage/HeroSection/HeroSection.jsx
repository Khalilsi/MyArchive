import React from "react";
import "./HeroSection.css"; // Custom CSS for the Hero Section

const HeroSection = () => {
  return (
    <section class="hero-section">
      <div class="hero-content">
        <h1 class="hero-title">
          MY archive
        </h1>
        <p class="hero-subtitle">
          Digitalisez vos archives en toute simplicité et sécurité
        </p>
        <div class="hero-buttons">
           <button class="hero-button white" onClick={() => window.location.href='/demande'}>Commencer</button>
           <button class="hero-button dark" onClick={() => window.location.href='/login'}>Login</button> {/* go to login page /login */}
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
