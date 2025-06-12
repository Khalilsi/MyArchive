import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Layout,
  Typography,
  message,
} from "antd";
import { useNavigate } from "react-router-dom";
import StatisticsCards from "../../components/client/accueille/accueille";
import { useAuth } from "../../context/AuthContext";
import apiClient from "../../Api/client";

const { Content } = Layout;
const { Title } = Typography;

const Dashboard = () => {
  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState(null);
  const [statistics, setStatistics] = useState({
    totalDocuments: 0,
    recentDocuments: 0,
    usedSpace: 0,
    archivedDocuments: 0,
  });
  const [archives, setArchives] = useState([]);
  const [documents, setDocuments] = useState([]);
  const navigate = useNavigate();
  const { logout } = useAuth();

  useEffect(() => {
    const storedToken =
      localStorage.getItem("token") || sessionStorage.getItem("token");
    if (!storedToken) {
      message.error("Please login first");
      navigate("/login");
      return;
    }
    setToken(storedToken);
  }, [navigate]);

  useEffect(() => {
    if (token) {
      fetchAllData();
    }
  }, [token]);

  const fetchAllData = async () => {
    setLoading(true);
    try {
      await Promise.all([
        fetchArchives(),
        fetchDocuments(),
        calculateStatistics(),
      ]);
    } catch (error) {
      message.error("Error fetching data");
    } finally {
      setLoading(false);
    }
  };

  const fetchArchives = async () => {
    try {
      const response = await apiClient.get("/api/archives", {
        headers: {
          "x-auth-token": token,
        },
      });

      if (response.data.success) {
        setArchives(response.data.data);
      }
    } catch (error) {
      if (error.response?.status === 401) {
        message.error("Session expired. Please login again");
        navigate("/login");
      } else {
        message.error("Failed to fetch archives: " + error.message);
      }
    }
  };

  const fetchDocuments = async () => {
    try {
      const response = await apiClient.get("/api/documents", {
        headers: {
          "x-auth-token": token,
        },
      });

      if (response.data.success) {
        setDocuments(response.data.data);
        calculateStatistics(response.data.data);
      }
    } catch (error) {
      if (error.response?.status === 401) {
        message.error("Session expired. Please login again");
        navigate("/login");
      } else {
        message.error("Failed to fetch documents: " + error.message);
      }
    }
  };

  const calculateStatistics = (docs) => {
    const stats = {
      totalDocuments: docs.length,
      recentDocuments: docs.filter((doc) => {
        const docDate = new Date(doc.createdAt);
        const lastWeek = new Date();
        lastWeek.setDate(lastWeek.getDate() - 7);
        return docDate > lastWeek;
      }).length,
      usedSpace: docs
        .reduce((total, doc) => total + parseFloat(doc.size), 0)
        .toFixed(2),
      archivedDocuments: archives.length,
    };
    setStatistics(stats);
  };

  const handleMenuClick = ({ key }) => {
    // Define implemented routes
    const implementedRoutes = ['dashboard', 'logout','archives'];
  
    if (key === 'logout') {
      try {
        logout();
        message.success('Logged out successfully');
        navigate('/login');
      } catch (error) {
        message.error('Error logging out');
      }
      return;
    }
  
    if (!implementedRoutes.includes(key)) {
      message.info('Cette fonctionnalité sera bientôt disponible');
      return;
    }
    
    // Navigate only for implemented routes
    const path = `/client/${key}`;
    navigate(path);
  };

  return (
    <Layout style={{ minHeight: "100vh" }}>
      {/* <Sidebar collapsed={collapsed} onCollapse={setCollapsed} onMenuClick={handleMenuClick} /> */}

      <Layout>
        {/* <Header style={{ padding: 0, background: "#fff" }}>
          <Row
            justify="end"
            align="middle"
            style={{ height: "100%", padding: "0 24px" }}
          >
            <Space>
              <Avatar icon={<UserOutlined />} />
              <Text strong>Username</Text>
            </Space>
          </Row>
        </Header> */}

        <Content style={{ margin: "24px 16px" }}>
          <Title level={2}>Bienvenue sur votre espace utilisateur</Title>
          <StatisticsCards statistics={statistics} />
        </Content>
      </Layout>
    </Layout>
  );
};

export default Dashboard;
