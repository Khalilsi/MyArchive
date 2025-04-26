import React from "react";
import "./Footer.css";
import { FaFacebook, FaTwitter, FaLinkedin, FaInstagram } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        {/* Column 1: Logo and Description */}
        <div className="footer-column">
          <h3 className="footer-logo">MyArchive</h3>
          <p className="footer-description">
            My Archive est une plateforme innovante de digitalisation des
            archives conçue pour répondre aux besoins spécifiques des
            entreprises et institutions tunisiennes, tout en surpassant les
            solutions existantes sur le marché. Notre dévouement et attention
            aux détails font toute la différence dans votre gestion des
            archives.
          </p>
          <div className="social-icons">
            <a href="#">
              <FaFacebook />
            </a>
            <a href="#">
              <FaTwitter />
            </a>
            <a href="#">
              <FaLinkedin />
            </a>
          </div>
        </div>

        {/* Column 2: Quick Links */}
        <div className="footer-column">
          <h4 className="footer-title">Liens Rapides</h4>
          <ul className="footer-links">
            <li>
              <a href="#">Accueil</a>
            </li>
            <li>
              <a href="#">Solutions</a>
            </li>
            <li>
              <a href="#">Technologies</a>
            </li>
            <li>
              <a href="#">Témoignages</a>
            </li>
            <li>
              <a href="#">Contact</a>
            </li>
          </ul>
        </div>

        {/* Column 3: Contact Info */}
        <div className="footer-column">
          <h4 className="footer-title">Nous Contacter</h4>
          <ul className="footer-contact">
            <li>Boulevard, Tunisie</li>
            <li>info@myarchive.in</li>
            <li>(+216) 55 555 555</li>
          </ul>
        </div>

        {/* Column 4: Newsletter */}
        {/* <div className="footer-column">
          <h4 className="footer-title">Newsletter</h4>
          <p>Abonnez-vous pour recevoir nos dernières actualités</p>
          <form className="newsletter-form">
            <input type="email" placeholder="Votre Email" />
            <button type="submit">S'abonner</button>
          </form>
        </div> */}
      </div>

      {/* Copyright */}
      <div className="copyright">
        <p>
          &copy; {new Date().getFullYear()} MyArchive. Tous droits réservés.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
