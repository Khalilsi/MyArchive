import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FaTimes, FaBars } from "react-icons/fa";
import { useTranslation } from "react-i18next";
import Flag from "react-world-flags";
import "./Navbar.css";

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { i18n } = useTranslation();
  const { t } = useTranslation();

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    document.body.dir = lng === "ar" ? "rtl" : "ltr";
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          MY archive
        </Link>

        <button
          className="navbar-toggle"
          aria-label="Toggle navigation"
          onClick={toggleMobileMenu}
        >
          {isMobileMenuOpen ? <FaTimes /> : <FaBars />}
        </button>

        <ul className={`navbar-menu ${isMobileMenuOpen ? "active" : ""}`}>
          <li className="navbar-item">
            <Link to="/actualite" className="navbar-link">
              {t("navbar.actualité")}
            </Link>
          </li>
          <li className="navbar-item">
            <Link to="/à propos nous" className="navbar-link">
              {t("navbar.about")}
            </Link>
          </li>
          <li className="navbar-item">
            <Link to="/FAQ" className="navbar-link">
              {t("navbar.faq")}
            </Link>
          </li>
        </ul>

        {/* Language Switcher */}
        {/* <div
          className="lang-switcher"
          style={{ display: "flex", gap: "10px", marginLeft: "auto" }}
        >
          <Flag
            code="us"
            style={{ width: 30, height: 30, borderRadius: "0%" , cursor: "pointer" }}
            onClick={() => changeLanguage("en")}
          />
          <Flag
            code="fr"
            style={{ width: 30, height: 30, borderRadius: "0%" , cursor: "pointer" }}
            onClick={() => changeLanguage("fr")}
          />
          <Flag
            code="tn"
            style={{ width: 30, height: 30, borderRadius: "0%" , cursor: "pointer" }}
            onClick={() => changeLanguage("ar")}
          />
        </div> */}
      </div>
    </nav>
  );
};

export default Navbar;
