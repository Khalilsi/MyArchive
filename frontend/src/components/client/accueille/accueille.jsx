import React from 'react';
import { Card, Row, Col, Space, Typography } from 'antd';
import {
  FileOutlined,
  FileDoneOutlined,
  CloudUploadOutlined,
  DatabaseOutlined
} from '@ant-design/icons';

const { Title, Text } = Typography;

const StatisticsCards = ({ statistics }) => {
  const cards = [
    {
      icon: <FileOutlined style={{ fontSize: '24px' }} />,
      title: 'Nombre total de documents',
      value: statistics.totalDocuments
    },
    {
      icon: <FileDoneOutlined style={{ fontSize: '24px' }} />,
      title: 'Documents récents',
      value: statistics.recentDocuments
    },
    {
      icon: <CloudUploadOutlined style={{ fontSize: '24px' }} />,
      title: 'Espace utilisé',
      value: `${statistics.usedSpace} MB`
    },
    {
      icon: <DatabaseOutlined style={{ fontSize: '24px' }} />,
      title: 'Documents archivés',
      value: statistics.archivedDocuments
    }
  ];

  return (
    <Row gutter={[16, 16]}>
      {cards.map((card, index) => (
        <Col xs={24} sm={12} lg={6} key={index}>
          <Card>
            <Space direction="vertical" style={{ width: '100%', textAlign: 'center' }}>
              {card.icon}
              <Title level={4}>{card.title}</Title>
              <Text strong>{card.value}</Text>
            </Space>
          </Card>
        </Col>
      ))}
    </Row>
  );
};

export default StatisticsCards;