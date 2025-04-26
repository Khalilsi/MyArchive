import React from "react";
import "./ThirdSection.css"; // Custom CSS for the section

const ThirdSection = () => {
  return (
    <section className="third-section">
      <div className="third-section-container">
        <div className="cards-container">
          {/* Card 1 */}
          <div className="card">
            <img
              src="./assets/card1.jpg" // Replace with your image
              alt="Service 1"
              className="card-image"
            />
            <h3 className="card-title">Numérisation des documents</h3>
            <p className="card-text">
              Nous convertissons vos documents papier en fichiers numériques
              sécurisés, accessibles et bien organisés.
            </p>
          </div>

          {/* Card 2 */}
          <div className="card">
            <img
              src="./assets/card2.jpg" // Replace with your image
              alt="Service 2"
              className="card-image"
            />
            <h3 className="card-title">Organisation & Indexation</h3>
            <p className="card-text">
              Nous classons et structurons vos documents numériques pour un
              accès rapide et efficace.
            </p>
          </div>

          {/* Card 3 */}
          <div className="card">
            <img
              src="./assets/card3.jpg"
              alt="Service 3"
              className="card-image"
            />
            <h3 className="card-title">Stockage cloud sécurisé</h3>
            <p className="card-text">
              Vos documents sont sauvegardés en ligne, en toute sécurité, avec
              un accès à tout moment.
            </p>
          </div>

          {/* Card 4 */}
          <div className="card">
            <img
              src="./assets/card4.jpg" // Replace with your image
              alt="Service 4"
              className="card-image"
            />
            <h3 className="card-title">Accès facile aux archives</h3>
            <p className="card-text">
              Consultez vos documents numérisés à tout moment, où que vous
              soyez.
            </p>
          </div>

          <div className="card">
            <img
              src="./assets/card5.webp" // Replace with your image
              alt="Service 4"
              className="card-image"
            />
            <h3 className="card-title">Reconnaissance de texte</h3>
            <p className="card-text">
              Grâce à la technologie OCR, vos documents numérisés deviennent
              entièrement consultables, modifiables et exploitables.
            </p>
          </div>

          <div className="card">
            <img
              src="./assets/card6.jpeg" // Replace with your image
              alt="Service 4"
              className="card-image"
            />
            <h3 className="card-title">Assistance & suivi</h3>
            <p className="card-text">
              Nous vous accompagnons à chaque étape avec un support personnalisé
              et un suivi régulier de vos besoins.
            </p>
          </div>

          {/* <div className="card">
            <img
              src="./assets/solution.avif" // Replace with your image
              alt="Service 4"
              className="card-image"
            />
            <h3 className="card-title">La solution moderne</h3>
            <p className="card-text">
              My Archive n'est pas seulement une solution de digitalisation,
              mais un partenaire stratégique pour optimiser la gestion des
              archives en Tunisie.
            </p>
          </div> */}
        </div>
      </div>
    </section>
  );
};

export default ThirdSection;
