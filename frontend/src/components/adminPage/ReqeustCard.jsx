import React from 'react';
import { Card, Descriptions, Tag, Space, Typography, Divider } from 'antd';
import { 
  UserOutlined, 
  PhoneOutlined, 
  EnvironmentOutlined, 
  BankOutlined,
  CalendarOutlined,
  MailOutlined,
  FolderOutlined,
  CheckCircleOutlined
} from '@ant-design/icons';

const { Text, Title } = Typography;

const RequestCard = ({ request }) => {
  return (
    <Card 
      className="request-card"
    >
      <Title level={3} style={{ textAlign: 'center' }}>{request.nomEntreprise}</Title>
      <Divider />
      
      <Descriptions
        bordered
        column={1}
        layout="horizontal"
        labelStyle={{ width: '230px' }}
      >
        <Descriptions.Item label={<Space><MailOutlined /><strong>Email</strong></Space>}>
          <Text copyable>{request.email}</Text>
        </Descriptions.Item>

        <Descriptions.Item label={<Space><PhoneOutlined /><strong>Phone</strong></Space>}>
          <Text copyable>{request.telephone}</Text>
        </Descriptions.Item>

        <Descriptions.Item label={<Space><EnvironmentOutlined /><strong>Adresse</strong></Space>}>
          {request.adresse}
        </Descriptions.Item>

        <Descriptions.Item label={<Space><BankOutlined /><strong>Sector</strong></Space>}>
          {request.secteurActivite}
        </Descriptions.Item>

        <Descriptions.Item label={<Space><BankOutlined /><strong>Package</strong></Space>}>
          <Tag color="blue" style={{ padding: '4px 12px', fontSize: '14px' }}>
            {request.forfait}
          </Tag>
        </Descriptions.Item>

        <Descriptions.Item label={<Space><FolderOutlined /><strong>Archive Types</strong></Space>}>
          <Space wrap>
            {request.typeArchives.map(type => (
              <Tag 
                key={type} 
                color="processing"
                style={{ padding: '4px 12px' }}
              >
                {type}
              </Tag>
            ))}
          </Space>
        </Descriptions.Item>

        <Descriptions.Item label={<Space><CheckCircleOutlined /><strong>Status</strong></Space>}>
          <Space direction="vertical">
            <Tag 
              color={
                request.status === 'accepted' ? 'success' :
                request.status === 'rejected' ? 'error' : 'warning'
              }
              style={{ padding: '4px 12px', fontSize: '14px' }}
            >
              {request.status.toUpperCase()}
            </Tag>
            {request.adminNotes && (
              <Text type="secondary" italic>Note: {request.adminNotes}</Text>
            )}
          </Space>
        </Descriptions.Item>

        <Descriptions.Item label={<Space><CalendarOutlined /><strong>Created At</strong></Space>}>
          <Text type="secondary">
            {new Date(request.createdAt).toLocaleString('fr-FR', {
              dateStyle: 'full',
              timeStyle: 'short'
            })}
          </Text>
        </Descriptions.Item>
      </Descriptions>
    </Card>
  );
};

export default RequestCard;