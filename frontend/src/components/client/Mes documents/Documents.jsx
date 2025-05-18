import React, { useState, useEffect } from "react";
import { Document as PDFViewer, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import "react-pdf/dist/esm/Page/TextLayer.css";
import {
  Layout,
  Typography,
  Table,
  Space,
  Button,
  Tag,
  Input,
  Tooltip,
  message,
  Modal,
} from "antd";
import {
  DeleteOutlined,
  DownloadOutlined,
  FolderOutlined,
  EyeOutlined,
} from "@ant-design/icons";
import axios from "axios";

const { Content } = Layout;
const { Title } = Typography;
const { Search } = Input;

// Move this outside of the component
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

const Documents = () => {
  const [documents, setDocuments] = useState([]);
  const [filteredDocuments, setFilteredDocuments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [isPreviewVisible, setIsPreviewVisible] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);

  useEffect(() => {
    fetchDocuments();
  }, []);

  useEffect(() => {
    setFilteredDocuments(documents);
  }, [documents]);

  const fetchDocuments = async () => {
    try {
      setLoading(true);
      const token =
        localStorage.getItem("token") || sessionStorage.getItem("token");
      const response = await axios.get("http://localhost:4000/api/documents", {
        headers: {
          "x-auth-token": token,
        },
      });

      if (response.data.success) {
        setDocuments(response.data.data);
      }
    } catch (error) {
      message.error("Échec du chargement des documents");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (value) => {
    setSearchText(value);
    const filtered = documents.filter(
      (doc) =>
        doc.name.toLowerCase().includes(value.toLowerCase()) ||
        doc.archive.name.toLowerCase().includes(value.toLowerCase()) ||
        (doc.category &&
          doc.category.toLowerCase().includes(value.toLowerCase()))
    );
    setFilteredDocuments(filtered);
  };

  const handleDeleteDocument = async (documentId) => {
    try {
      const token =
        localStorage.getItem("token") || sessionStorage.getItem("token");
      const response = await axios.delete(
        `http://localhost:4000/api/documents/${documentId}`,
        {
          headers: {
            "x-auth-token": token,
          },
        }
      );

      if (response.data.success) {
        message.success("Document supprimé avec succès");
        fetchDocuments();
      }
    } catch (error) {
      message.error("Échec de la suppression du document");
    }
  };

  const onDocumentLoadSuccess = ({ numPages: nextNumPages }) => {
    setNumPages(nextNumPages);
  };

  const handlePreview = (document) => {
    setSelectedDocument(document);
    setIsPreviewVisible(true);
  };

  const getTypeColor = (type) => {
    const colors = {
      PDF: "red",
      JPG: "green",
      PNG: "blue",
      DOCX: "purple",
    };
    return colors[type] || "default";
  };

  const getDisplayType = (mimeType) => {
    const typeMap = {
      "application/pdf": "PDF",
      "image/jpeg": "JPG",
      "image/png": "PNG",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
        "DOCX",
    };
    return typeMap[mimeType] || mimeType;
  };

  const columns = [
    {
      title: "Nom",
      dataIndex: "name",
      key: "name",
      render: (text, record) => (
        <Space>
          {text}
          <Tag color={getTypeColor(getDisplayType(record.type))}>
            {getDisplayType(record.type)}
          </Tag>
        </Space>
      ),
    },
    {
      title: "Catégorie",
      dataIndex: "category",
      key: "category",
      render: (category) => category || "Non catégorisé",
    },
    {
      title: "Archive",
      dataIndex: ["archive", "name"],
      key: "archive",
      render: (text) => (
        <Space>
          <FolderOutlined />
          {text}
        </Space>
      ),
    },
    {
      title: "Taille",
      dataIndex: "size",
      key: "size",
      render: (size) => `${size} MB`,
    },
    {
      title: "Date d'ajout",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (text) => new Date(text).toLocaleDateString(),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space>
          <Tooltip title="Aperçu">
            <Button
              type="primary"
              icon={<EyeOutlined />}
              onClick={() => handlePreview(record)}
            />
          </Tooltip>
          <Tooltip title="Télécharger">
            <Button
              type="primary"
              icon={<DownloadOutlined />}
              onClick={() => window.open(record.filePath)}
            />
          </Tooltip>
          <Tooltip title="Supprimer">
            <Button
              type="primary"
              danger
              icon={<DeleteOutlined />}
              onClick={() => handleDeleteDocument(record.id)}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <Content style={{ margin: "24px 16px" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: 16,
        }}
      >
        <Title level={2}>Mes Documents</Title>
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          marginBottom: 16,
        }}
      >
        <Search
          placeholder="Rechercher un document..."
          allowClear
          size="middle"
          onSearch={handleSearch}
          onChange={(e) => handleSearch(e.target.value)}
          style={{
            width: "50%",
            maxWidth: "500px",
          }}
        />
      </div>

      <Table
        columns={columns}
        dataSource={filteredDocuments}
        rowKey="_id"
        loading={loading}
      />

      <Modal
        title={selectedDocument?.name}
        open={isPreviewVisible}
        onCancel={() => {
          setIsPreviewVisible(false);
          setSelectedDocument(null);
          setNumPages(null);
          setPageNumber(1);
        }}
        width={1000}
        footer={null}
      >
        {selectedDocument && (
          <div style={{ maxHeight: "80vh", overflow: "auto" }}>
            {selectedDocument.type === "application/pdf" ? (
              <div>
                <PDFViewer
                  file={selectedDocument.filePath}
                  onLoadSuccess={onDocumentLoadSuccess}
                  options={{
                    cMapUrl: "cmaps/",
                    cMapPacked: true,
                  }}
                  loading={
                    <div style={{ textAlign: "center", padding: "20px" }}>
                      Chargement du PDF...
                    </div>
                  }
                  error={
                    <div
                      style={{
                        textAlign: "center",
                        padding: "20px",
                        color: "red",
                      }}
                    >
                      Erreur lors du chargement du PDF.
                    </div>
                  }
                >
                  <Page
                    pageNumber={pageNumber}
                    width={900}
                    renderTextLayer={true}
                    renderAnnotationLayer={true}
                  />
                </PDFViewer>
                {numPages > 0 && (
                  <div style={{ textAlign: "center", marginTop: 10 }}>
                    <Space>
                      <Button
                        disabled={pageNumber <= 1}
                        onClick={() => setPageNumber((prev) => prev - 1)}
                      >
                        Précédent
                      </Button>
                      <span>
                        Page {pageNumber} sur {numPages}
                      </span>
                      <Button
                        disabled={pageNumber >= numPages}
                        onClick={() => setPageNumber((prev) => prev + 1)}
                      >
                        Suivant
                      </Button>
                    </Space>
                  </div>
                )}
              </div>
            ) : ["image/jpeg", "image/png"].includes(selectedDocument.type) ? (
              <img
                src={selectedDocument.filePath}
                alt={selectedDocument.name}
                style={{ maxWidth: "100%" }}
              />
            ) : (
              <div>
                Ce type de document ne peut pas être prévisualisé. Veuillez le
                télécharger pour le visualiser.
              </div>
            )}
          </div>
        )}
      </Modal>
    </Content>
  );
};

export default Documents;
