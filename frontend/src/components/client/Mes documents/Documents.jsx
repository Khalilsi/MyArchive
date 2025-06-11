import React, { useState, useEffect, useRef } from "react";
import { Document as PDFViewer, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import "react-pdf/dist/esm/Page/TextLayer.css";
import { renderAsync } from "docx-preview";
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
  Spin,
  Form,
  Upload,
  Select,
} from "antd";
import {
  DeleteOutlined,
  DownloadOutlined,
  FolderOutlined,
  EyeOutlined,
  CloseOutlined,
  LeftOutlined,
  RightOutlined,
  ZoomInOutlined,
  ZoomOutOutlined,
  PlusOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import axios from "axios";
import apiClient from "../../../Api/client"; // Adjust the import path as necessary

const { Content } = Layout;
const { Title } = Typography;
const { Search } = Input;
const { Dragger } = Upload;

// Move this outside of the component
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

const Documents = () => {
  const [documents, setDocuments] = useState([]);
  const [filteredDocuments, setFilteredDocuments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [scale, setScale] = useState(1);
  const [isUploadModalVisible, setIsUploadModalVisible] = useState(false);
  const [archives, setArchives] = useState([]);
  const [form] = Form.useForm();
  const wordContainerRef = useRef(null);
  const MIN_SCALE = 0.5;
  const MAX_SCALE = 2;

  useEffect(() => {
    fetchDocuments();
    fetchArchives();
  }, []);

  useEffect(() => {
    setFilteredDocuments(documents);
  }, [documents]);

  const fetchDocuments = async () => {
    try {
      setLoading(true);
      const token =
        localStorage.getItem("token") || sessionStorage.getItem("token");
      const response = await apiClient.get("/api/documents", {
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

  const fetchArchives = async () => {
    try {
      const token =
        localStorage.getItem("token") || sessionStorage.getItem("token");
      const response = await apiClient.get("/api/archives", {
        headers: {
          "x-auth-token": token,
        },
      });

      if (response.data.success) {
        setArchives(response.data.data);
      }
    } catch (error) {
      message.error("Échec du chargement des archives");
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
      const response = await apiClient.delete(
        `/api/documents/${documentId}`,
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

  const handleUpload = async (values) => {
    try {
      console.log("Form values:", values); // Debug log

      // Check if file exists and is properly structured
      if (!values.file || !values.file[0]) {
        message.error("Veuillez sélectionner un fichier");
        return;
      }

      const formData = new FormData();
      formData.append("name", values.name);
      formData.append("category", values.category || "");
      formData.append("archiveId", values.archive);

      // Check if we have the file object
      const file = values.file[0].originFileObj || values.file[0];
      formData.append("file", file);

      // Debug log to see what's being sent
      console.log("Archive ID:", values.archive);
      console.log("File:", file);

      const token =
        localStorage.getItem("token") || sessionStorage.getItem("token");

      // Add error handling for missing token
      if (!token) {
        message.error("Session expirée, veuillez vous reconnecter");
        return;
      }

      const response = await apiClient.post(
        "/api/documents",
        formData,
        {
          headers: {
            "x-auth-token": token,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.data.success) {
        message.success("Document ajouté avec succès");
        setIsUploadModalVisible(false);
        form.resetFields();
        fetchDocuments();
      }
    } catch (error) {
      console.error("Upload error:", error.response || error);
      message.error(
        error.response?.data?.message || "Échec de l'ajout du document"
      );
    }
  };

  const onDocumentLoadSuccess = ({ numPages: nextNumPages }) => {
    setNumPages(nextNumPages);
  };

  const handlePreview = (document) => {
    setSelectedDocument(document);
    setIsPreviewOpen(true);
  };

  const handleZoomIn = () => {
    setScale((prevScale) => Math.min(prevScale + 0.2, MAX_SCALE));
  };

  const handleZoomOut = () => {
    setScale((prevScale) => Math.max(prevScale - 0.2, MIN_SCALE));
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
          {/* <Tooltip title="Télécharger">
            <Button
              type="primary"
              icon={<DownloadOutlined />}
              onClick={() => window.open(record.filePath)}
            />
          </Tooltip> */}
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

  const handleWordPreview = async (url) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      if (wordContainerRef.current) {
        await renderAsync(blob, wordContainerRef.current);
      }
    } catch (error) {
      message.error("Erreur lors du chargement du document Word");
    }
  };

  useEffect(() => {
    if (
      isPreviewOpen &&
      selectedDocument?.type ===
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ) {
      handleWordPreview(selectedDocument.filePath);
    }
  }, [isPreviewOpen, selectedDocument]);

  return (
    <Content style={{ margin: "24px 16px" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 16,
        }}
      >
        <Title level={2}>Mes Documents</Title>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => setIsUploadModalVisible(true)}
        >
          Ajouter un document
        </Button>
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

      {isPreviewOpen && selectedDocument && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0, 0, 0, 0.85)",
            zIndex: 1000,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            padding: "40px  ",
          }}
          onClick={() => {
            setIsPreviewOpen(false);
            setSelectedDocument(null);
            setNumPages(null);
            setPageNumber(1);
          }}
        >
          <div
            style={{
              backgroundColor: "#f5f5f5",

              maxWidth: "95%",
              maxHeight: "95vh",
              overflow: "hidden",
              display: "flex",
              flexDirection: "column",
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            {/* <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "12px 20px",
                backgroundColor: "white",
                borderBottom: "1px solid #e8e8e8",
              }}
            >
              <Space>
                <h3 style={{ margin: 0 }}>{selectedDocument.name}</h3>
                <Tag
                  color={getTypeColor(getDisplayType(selectedDocument.type))}
                >
                  {getDisplayType(selectedDocument.type)}
                </Tag>
              </Space>
              <Button
                type="text"
                icon={<CloseOutlined />}
                onClick={() => {
                  setIsPreviewOpen(false);
                  setSelectedDocument(null);
                  setNumPages(null);
                  setPageNumber(1);
                }}
              />
            </div> */}

            {/* Content */}
            <div
              style={{
                flex: 1,
                overflow: "auto",
                padding: "2px",
                display: "flex",
                justifyContent: "center",
                backgroundColor: "#f5f5f5",
              }}
            >
              {selectedDocument.type === "application/pdf" ? (
                <div
                  style={{
                    backgroundColor: "white",
                    padding: "20px",
                    borderRadius: "4px",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                  }}
                >
                  <PDFViewer
                    file={selectedDocument.filePath}
                    onLoadSuccess={onDocumentLoadSuccess}
                    loading={
                      <div style={{ textAlign: "center", padding: "40px" }}>
                        <Spin size="large" tip="Chargement du PDF..." />
                      </div>
                    }
                  >
                    <Page
                      pageNumber={pageNumber}
                      width={Math.min(850, window.innerWidth * 0.7) * scale}
                      renderTextLayer={true}
                      renderAnnotationLayer={true}
                      className="pdf-page"
                    />
                  </PDFViewer>
                  {numPages > 0 && (
                    <div
                      style={{
                        position: "absolute",
                        bottom: "40px",
                        left: "50%",
                        transform: "translateX(-50%)",
                        backgroundColor: "rgba(0, 0, 0, 0.4)", // semi-transparent black
                        padding: "8px 16px",
                        borderRadius: "24px",
                        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.2)",
                        display: "flex",
                        alignItems: "center",
                        gap: "16px",
                        transition: "opacity 0.3s ease",
                        opacity: 0.7, // start with 20% opacity
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.opacity = 1)}
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.opacity = 0.2)
                      }
                    >
                      <Button
                        type="text"
                        icon={<ZoomOutOutlined />}
                        onClick={handleZoomOut}
                        disabled={scale <= MIN_SCALE}
                        style={{
                          color: "white",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      />
                      <span
                        style={{
                          fontSize: "14px",
                          color: "white",
                          minWidth: "60px",
                          textAlign: "center",
                        }}
                      >
                        {Math.round(scale * 100)}%
                      </span>
                      <Button
                        type="text"
                        icon={<ZoomInOutlined />}
                        onClick={handleZoomIn}
                        disabled={scale >= MAX_SCALE}
                        style={{
                          color: "white",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      />
                      <div
                        style={{
                          width: 1,
                          height: 20,
                          backgroundColor: "rgba(255, 255, 255, 0.2)",
                        }}
                      />
                      <Button
                        type="text"
                        icon={<LeftOutlined />}
                        disabled={pageNumber <= 1}
                        onClick={() => setPageNumber((prev) => prev - 1)}
                        style={{
                          color: "white",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      />
                      <span
                        style={{
                          fontSize: "14px",
                          color: "white",
                          minWidth: "60px",
                          textAlign: "center",
                        }}
                      >
                        {pageNumber}/{numPages}
                      </span>
                      <Button
                        type="text"
                        icon={<RightOutlined />}
                        disabled={pageNumber >= numPages}
                        onClick={() => setPageNumber((prev) => prev + 1)}
                        style={{
                          color: "white",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      />
                    </div>
                  )}
                </div>
              ) : ["image/jpeg", "image/png"].includes(
                  selectedDocument.type
                ) ? (
                <div
                  style={{
                    backgroundColor: "white",
                    padding: "20px",
                    borderRadius: "4px",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                  }}
                >
                  <img
                    src={selectedDocument.filePath}
                    alt={selectedDocument.name}
                    style={{
                      maxWidth: "100%",
                      maxHeight: "calc(90vh - 150px)",
                      objectFit: "contain",
                    }}
                  />
                </div>
              ) : selectedDocument.type ===
                "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ? (
                <div
                  style={{
                    backgroundColor: "white",
                    padding: "20px",
                    borderRadius: "4px",
                    width: "100%",
                    height: "calc(90vh - 150px)",
                    overflow: "auto",
                  }}
                >
                  <div ref={wordContainerRef} style={{ minHeight: "100%" }} />
                </div>
              ) : (
                <div
                  style={{
                    textAlign: "center",
                    padding: "40px",
                    backgroundColor: "white",
                    borderRadius: "4px",
                  }}
                >
                  Ce type de document ne peut pas être prévisualisé. Veuillez le
                  télécharger pour le visualiser.
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <Modal
        centered
        title="Ajouter un document"
        open={isUploadModalVisible}
        onCancel={() => {
          setIsUploadModalVisible(false);
          form.resetFields();
        }}
        footer={null}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleUpload}
          encType="multipart/form-data"
        >
          <Form.Item
            name="name"
            label="Nom du document"
            rules={[{ required: true, message: "Le nom est requis" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item name="category" label="Catégorie">
            <Input />
          </Form.Item>

          <Form.Item
            name="archive"
            label="Archive"
            rules={[{ required: true, message: "L'archive est requise" }]}
          >
            <Select
              placeholder="Sélectionnez une archive"
              allowClear
              showSearch
              optionFilterProp="children"
              onChange={(value) => {
                form.setFieldsValue({ archive: value });
              }}
            >
              {archives.map((archive) => (
                <Select.Option key={archive._id} value={archive._id}>
                  {archive.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="file"
            label="Fichier"
            rules={[{ required: true, message: "Le fichier est requis" }]}
            valuePropName="fileList"
            getValueFromEvent={(e) => {
              if (Array.isArray(e)) {
                return e;
              }
              return e?.fileList;
            }}
          >
            <Dragger
              name="file"
              maxCount={1}
              beforeUpload={() => false}
              accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
              style={{ padding: "20px 0" }}
              onRemove={() => {
                form.setFieldsValue({ file: [] });
              }}
            >
              <p className="ant-upload-drag-icon">
                <UploadOutlined />
              </p>
              <p className="ant-upload-text">
                Cliquez ou déposez un fichier dans cette zone
              </p>
              <p className="ant-upload-hint">
                Formats acceptés: PDF, JPG, PNG, DOC, DOCX
              </p>
            </Dragger>
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              Enregistrer
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </Content>
  );
};

export default Documents;
