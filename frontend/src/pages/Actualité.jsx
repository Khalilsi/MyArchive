import React from "react";
import { Card, Row, Col, Tag, Button, Breadcrumb } from "antd";
import { PageHeader } from '@ant-design/pro-components';

const articles = [
  {
    title: "Lancement officiel de la plateforme MY archive",
    description:
      "Une nouvelle ère pour la gestion documentaire en Tunisie commence avec notre plateforme innovante.",
    date: "18 Avril 2025",
    categories: ["Mise à jour", "Tendances"],
  },
  // You can add more articles here
];

const ActualitePage = () => {
  return (
    <div style={{ padding: "24px" }}>
      <Breadcrumb style={{ marginBottom: "16px" }}>
        <Breadcrumb.Item>Accueil</Breadcrumb.Item>
        <Breadcrumb.Item>Actualité</Breadcrumb.Item>
      </Breadcrumb>

      <PageHeader
        className="site-page-header"
        title="Actualité"
        subTitle="Consultez les dernières informations sur la plateforme"
      />

      <Row gutter={[24, 24]} style={{ marginTop: "24px" }}>
        {articles.map((article, index) => (
          <Col
            key={index}
            xs={24}
            sm={24}
            md={12}
            lg={8}
            xl={8}
          >
            <Card
              title={article.title}
              extra={<span style={{ fontSize: "12px", color: "gray" }}>{article.date}</span>}
              style={{ height: "100%" }}
            >
              <div style={{ marginBottom: "12px" }}>
                {article.categories.map((category, idx) => (
                  <Tag color="blue" key={idx} style={{ marginBottom: "4px" }}>
                    {category}
                  </Tag>
                ))}
              </div>
              <p>{article.description}</p>
              <Button type="primary" size="small">
                Voir l'article complet
              </Button>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default ActualitePage;
