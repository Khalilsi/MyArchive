import React from 'react';
import './ContactSection.css';
import { FaMapMarkerAlt } from "react-icons/fa";
import { FaEnvelope } from "react-icons/fa";
import { FaPhoneAlt } from "react-icons/fa";

const ContactSection = () => {
  return (
    <section className="contact-section">
      <div className="contact-container">
        <h2 className="contact-title">Nous serions ravis de vous entendre</h2>
        
        <div className="contact-content">
          {/* Left side: Contact Info */}
          
          <div className="contact-info">
            <h3>Notre Bureau</h3>
            <FaMapMarkerAlt className="contact-icon" /> 
            <a>Boulevard, Tunisie</a>
            
            <h3>Email de Contact</h3>
            <FaEnvelope className="contact-icon" />
            <a>info@myarchive.in</a>
            
            <h3>Numéro de Téléphone</h3>
            <FaPhoneAlt className="contact-icon" />
            <a>(+216) 55 555 555</a>
          </div>
          
          {/* Right side: Contact Form */}
          <form className="contact-form">
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="firstName">Prénom</label>
                <input type="text" id="firstName" name="firstName" />
              </div>
              <div className="form-group">
                <label htmlFor="lastName">Nom de Famille</label>
                <input type="text" id="lastName" name="lastName" />
              </div>
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="email">Votre Email</label>
                <input type="email" id="email" name="email" />
              </div>
              <div className="form-group">
                <label htmlFor="phone">Votre Téléphone</label>
                <input type="tel" id="phone" name="phone" />
              </div>
            </div>
            
            <div className="form-group">
              <label htmlFor="message">Votre Message</label>
              <textarea id="message" name="message" rows="4"></textarea>
            </div>
            
            <button type="submit" className="submit-button">
              ENVOYER VOTRE DEMANDE
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;