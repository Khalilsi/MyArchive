import React from 'react';
import './FourSection.css'; // Custom CSS for the section

const FourthSection = () => {
  return (
    <section className="fourth-section">
      <div className="fourth-section-container">
        <h2 className="section-title">Nos Clients Satisfaits</h2>
        <p className="sous-title">Découvrez comment nous transformons les processus d'archivage</p>
        <div className="cards-container">
          {/* Card 1 */}
          <div className="card">
            <img
              src="./assets/avatars/client1.jpg" // Replace with your image
              alt="Client 1"
              className="client-avatar"
            />
            <p className="client-name">- John Doe</p>
            <p className="client-comment">
              "ArchivaTunisia 2.0 has transformed the way we manage our documents. The platform is intuitive, secure, and incredibly efficient."
            </p>
            
          </div>

          {/* Card 2 */}
          <div className="card">
            <img
              src="./assets/avatars/client2.jpg" // Replace with your image
              alt="Client 2"
              className="client-avatar"
            />
            <p className="client-name">- Jane Smith</p>
            <p className="client-comment">
              "The AI-powered search and blockchain security features are game-changers. We couldn't be happier with the results!"
            </p>
            
          </div>

          {/* Card 3 */}
          <div className="card">
            <img
              src="./assets/avatars/client3.jpg" // Replace with your image
              alt="Client 3"
              className="client-avatar"
            />
            <p className="client-name">- Michael Brown</p>
            <p className="client-comment">
              "The support team is fantastic, and the platform is incredibly user-friendly. Highly recommend ArchivaTunisia 2.0!"
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FourthSection;