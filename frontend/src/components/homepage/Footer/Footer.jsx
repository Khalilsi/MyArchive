import React from "react";
import "./Footer.css";
import { FaFacebook, FaInstagram, FaLinkedin, FaMapMarkerAlt, FaPhoneAlt, FaEnvelope } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        {/* À propos de la plateforme */}
        <div className="footer-column">
          <h3 className="footer-logo">MY archive</h3>
          <p className="footer-description">
            À propos de la plateforme<br />
            Notre plateforme de numérisation d’archives offre aux entreprises tunisiennes une solution simple, rapide et sécurisée pour organiser, stocker et accéder à leurs documents en ligne. Pensée pour répondre aux besoins du marché local, elle allie performance, confidentialité et accompagnement personnalisé.
          </p>
        </div>

        {/* Informations de contact */}
        <div className="footer-column">
          <h4 className="footer-title">Informations de contact</h4>
          <ul className="footer-contact">
            <li><FaMapMarkerAlt style={{ marginRight: "8px" }} /> cité riadh - sousse</li>
            <li><FaPhoneAlt style={{ marginRight: "8px" }} /> +216 20 851 553</li>
            <li><FaEnvelope style={{ marginRight: "8px" }} /> @myarchivedigitale.com</li>
          </ul>
        </div>

        {/* Suivez-nous */}
        <div className="footer-column">
          <h4 className="footer-title">Suivez-nous</h4>
          <ul className="footer-contact">
            <li><FaLinkedin style={{ marginRight: "8px" }} /> MY archive</li>
            <li><FaInstagram style={{ marginRight: "8px" }} /> @myarchivedigitale</li>
            <li><FaFacebook style={{ marginRight: "8px" }} /> MY archive</li>
          </ul>
        </div>
      </div>

      <div className="copyright">
        <p>&copy; {new Date().getFullYear()} MY archive. Tous droits réservés.</p>
      </div>
    </footer>
  );
};

export default Footer;
