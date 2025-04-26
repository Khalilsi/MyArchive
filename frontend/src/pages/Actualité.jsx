import React from 'react';
import { Breadcrumb, Card, Row, Col, Tag, Button } from 'antd';
import { HomeOutlined } from '@ant-design/icons';
import { PageHeader } from '@ant-design/pro-components';

// Mock data for news articles
const articles = [
  {
    id: 1,
    title: "Lancement officiel de la plateforme MY archive",
    description: "Nous sommes fiers d'annoncer le lancement officiel de notre nouvelle plateforme MY archive. Cette solution innovante permet une gestion simplifiée des documents historiques.",
    date: "18 Avril 2025",
    categories: ["Mise à jour", "Tendances"]
  },
  {
    id: 2,
    title: "Nouvelle législation sur la conservation des archives",
    description: "Le gouvernement a publié de nouvelles directives concernant la conservation numérique des archives publiques. Découvrez comment cela affecte votre organisation.",
    date: "15 Avril 2025",
    categories: ["Législation"]
  },
  {
    id: 3,
    title: "Tendances 2025 en gestion documentaire",
    description: "Découvrez les principales tendances qui façonneront la gestion documentaire en 2025, avec un accent particulier sur l'IA et la blockchain.",
    date: "10 Avril 2025",
    categories: ["Tendances"]
  },
  {
    id: 4,
    title: "Mise à jour majeure de l'interface utilisateur",
    description: "Notre dernière mise à jour apporte une refonte complète de l'interface utilisateur pour une expérience plus intuitive et accessible.",
    date: "5 Avril 2025",
    categories: ["Mise à jour"]
  },
  {
    id: 5,
    title: "Ateliers de formation disponibles",
    description: "Inscrivez-vous à nos nouveaux ateliers de formation pour maîtriser toutes les fonctionnalités avancées de la plateforme MY archive.",
    date: "1 Avril 2025",
    categories: ["Événement"]
  },
  {
    id: 6,
    title: "Interview avec notre directeur technique",
    description: "Découvrez les coulisses du développement de MY archive à travers une interview exclusive avec notre directeur technique.",
    date: "28 Mars 2025",
    categories: ["Tendances"]
  }
];

const ActualitePage = () => {
  return (
    <div className="actualite-page" style={{ padding: '0 24px' }}>
      {/* Page Header with Breadcrumb */}
      <PageHeader
        title="Actualité"
        style={{ paddingLeft: 0 }}
        breadcrumb={
          <Breadcrumb>
            <Breadcrumb.Item href="/">
              <HomeOutlined /> Accueil
            </Breadcrumb.Item>
            <Breadcrumb.Item>Actualité</Breadcrumb.Item>
          </Breadcrumb>
        }
      />

      {/* Articles Grid */}
      <Row gutter={[24, 24]}>
        {articles.map(article => (
          <Col key={article.id} xs={24} sm={12} lg={8}>
            <Card
              title={article.title}
              extra={article.categories.map(cat => (
                <Tag key={cat} style={{ marginRight: 0 }}>{cat}</Tag>
              ))}
              style={{ height: '100%', display: 'flex', flexDirection: 'column' }}
              bodyStyle={{ flexGrow: 1 }}
            >
              <p>{article.description}</p>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                <Button type="primary" href={`/actualite/${article.id}`}>
                  Voir l'article complet
                </Button>
                <span style={{ color: 'rgba(0, 0, 0, 0.45)' }}>{article.date}</span>
              </div>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default ActualitePage;