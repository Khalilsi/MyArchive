import React from 'react';
import { Card, Row, Col } from 'antd';
import { 
  FileDoneOutlined, 
  TeamOutlined, 
  DatabaseOutlined, 
  LikeOutlined, 
  ClockCircleOutlined 
} from '@ant-design/icons';
import './FourSection.css';

const FourthSection = () => {
  const stats = [
    { 
      number: "+ 1 000", 
      label: "documents archivés",
      icon: <FileDoneOutlined className="stat-icon" />
    },
    { 
      number: "+ 15", 
      label: "clients",
      icon: <TeamOutlined className="stat-icon" />
    },
    { 
      number: "2.5 GO", 
      label: "de données stocké",
      icon: <DatabaseOutlined className="stat-icon" />
    },
    { 
      number: "95%", 
      label: "clients satisfaits",
      icon: <LikeOutlined className="stat-icon" />
    },
    { 
      number: "24/7", 
      label: "Disponible",
      icon: <ClockCircleOutlined className="stat-icon" />
    }
  ];

  return (
    <section className="fourth-section">
      <div className="fourth-section-container">
        {/* <h2 className="section-title">Nos Réalisations</h2>
        <p className="sous-title">Chiffres clés de notre plateforme</p> */}   
        <div className="stats-container">
          {stats.map((stat, index) => (
            <div className="stat-card" key={index}>
              <div className="stat-icon-container">
                {stat.icon}
              </div>
              <div className="stat-number">{stat.number}</div>
              <div className="stat-label">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FourthSection;