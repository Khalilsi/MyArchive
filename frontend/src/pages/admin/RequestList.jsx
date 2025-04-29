import React, { useState, useEffect } from "react";
import {
  Table,
  Tag,
  Space,
  Card,
  Typography,
  Divider,
  Badge,
  Select,
  message,
  Button,
  Modal,
  Form,
  Input,
} from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import RequestCard from "../../components/adminPage/ReqeustCard";

const { Title } = Typography;
const { Option } = Select;

const RequestList = () => {
  const navigate = useNavigate();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState("all");
  const [token, setToken] = useState(null);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [updateModalVisible, setUpdateModalVisible] = useState(false);
  const [updateForm] = Form.useForm();
  const [updating, setUpdating] = useState(false);

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
  const fetchRequests = async () => {
    try {
      setLoading(true);
      const response = await axios.get("http://localhost:4000/api/requests", {
        headers: {
          "x-auth-token": token,
        },
      });

      if (response.data.success) {
        setRequests(response.data.data);
      } else {
        message.error("Failed to fetch requests");
      }
    } catch (error) {
      if (error.response?.status === 401) {
        message.error("Session expired. Please login again");
        navigate("/login");
      } else {
        message.error("Failed to fetch requests: " + error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchRequests();
    }
  }, [token]);

  const handleViewRequest = async (id) => {
    try {
      const response = await axios.get(
        `http://localhost:4000/api/requests/${id}`,
        {
          headers: {
            "x-auth-token": token,
          },
        }
      );

      if (response.data.success) {
        setSelectedRequest(response.data.data);
        setIsModalVisible(true);
      }
    } catch (error) {
      message.error("Failed to fetch request details");
    }
  };

  const handleStatusUpdate = async (values) => {
    try {
      setUpdating(true);
      const response = await axios.patch(
        `http://localhost:4000/api/requests/${selectedRequest._id}/status`,
        values,
        {
          headers: {
            "x-auth-token": token,
          },
        }
      );

      if (response.data.success) {
        message.success("Status updated successfully");
        setUpdateModalVisible(false);
        fetchRequests(); // Refresh the list
      }
    } catch (error) {
      message.error(
        "Failed to update status: " + error.response?.data?.message ||
          error.message
      );
    } finally {
      setUpdating(false);
    }
  };

  const getStatusTag = (status) => {
    let color;
    switch (status) {
      case "accepted":
        color = "green";
        break;
      case "rejected":
        color = "red";
        break;
      case "waiting":
        color = "orange";
        break;
      default:
        color = "gray";
    }
    return <Tag color={color}>{status.toUpperCase()}</Tag>;
  };

  const filteredRequests =
    filterStatus === "all"
      ? requests
      : requests.filter((req) => req.status === filterStatus);

  const columns = [
    {
      title: "Company",
      dataIndex: "nomEntreprise",
      key: "nomEntreprise",
      render: (text, record) => (
        <Space direction="vertical">
          <strong>{text}</strong>
          <small>{record.email}</small>
        </Space>
      ),
      sorter: (a, b) => a.nomEntreprise.localeCompare(b.nomEntreprise),
    },
    {
      title: "Details",
      dataIndex: "details",
      key: "details",
      render: (_, record) => (
        <Space direction="vertical" size="small">
          <div>
            <strong>Sector:</strong> {record.secteurActivite}
          </div>
          <div>
            <strong>Address:</strong> {record.adresse}
          </div>
          <div>
            <strong>Phone:</strong> {record.telephone}
          </div>
        </Space>
      ),
    },
    {
      title: "Package",
      dataIndex: "forfait",
      key: "forfait",
      render: (text) => <Tag color="blue">{text}</Tag>,
    },
    {
      title: "Archive Types",
      dataIndex: "typeArchives",
      key: "typeArchives",
      render: (types) => (
        <>
          {types.map((type) => (
            <Tag key={type}>{type}</Tag>
          ))}
        </>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status, record) => (
        <Space>
          {getStatusTag(status)}
          {status === "accepted" && record.adminNotes && (
            <Tag color="cyan">Note: {record.adminNotes}</Tag>
          )}
        </Space>
      ),
      filters: [
        { text: "Waiting", value: "waiting" },
        { text: "Accepted", value: "accepted" },
        { text: "Rejected", value: "rejected" },
      ],
      onFilter: (value, record) => record.status === value,
    },
    {
      title: "Date",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date) => new Date(date).toLocaleDateString(),
      sorter: (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space size="middle">
          <Button type="link" onClick={() => handleViewRequest(record._id)}>
            View
          </Button>
          <Button
            type="link"
            onClick={() => {
              setSelectedRequest(record);
              updateForm.setFieldsValue({
                status: record.status,
                adminNotes: record.adminNotes || "",
              });
              setUpdateModalVisible(true);
            }}
          >
            Update Status
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: "80px" }}>
      <Card>
        <Title level={3}>Requests Management</Title>
        <Divider />

        <div style={{ marginBottom: 16 }}>
          <Space>
            <span>Filter by status:</span>
            <Select
              defaultValue="all"
              style={{ width: 120 }}
              onChange={setFilterStatus}
            >
              <Option value="all">All</Option>
              <Option value="waiting">Waiting</Option>
              <Option value="accepted">Accepted</Option>
              <Option value="rejected">Rejected</Option>
            </Select>
            <Badge
              count={requests.filter((r) => r.status === "waiting").length}
              style={{ backgroundColor: "#faad14" }}
            />
            <span>Pending requests</span>
          </Space>
        </div>

        <Table
          columns={columns}
          dataSource={filteredRequests}
          rowKey="_id"
          loading={{
            spinning: loading,
            indicator: <LoadingOutlined style={{ fontSize: 24 }} spin />,
          }}
          style={{ background: '#fff' }}
          rowClassName={(record, index) => (index % 2 === 0 ? 'light-row' : '')}
          components={{
            header: {
              cell: ({ children, ...restProps }) => (
                <th
                  {...restProps}
                  style={{
                    background: 'gray',
                    color: 'white',
                    fontWeight: 'bold'
                  }}
                >
                  {children}
                </th>
              )
            },
            body: {
              row: ({ children, ...restProps }) => (
                <tr
                  {...restProps}
                  style={{
                    '&:hover': {
                      backgroundColor: '#e6f7ff'
                    }
                  }}
                >
                  {children}
                </tr>
              ),
              cell: ({ children, ...restProps }) => (
                <td
                  {...restProps}
                  style={{
                    backgroundColor: restProps.index % 2 === 0 ? '#fafafa' : '#fff'
                  }}
                >
                  {children}
                </td>
              )
            }
          }}
          onRow={(record) => ({
            style: {
              cursor: 'pointer'
            }
          })}
          // expandable={{
          //   expandedRowRender: (record) => (
          //     <div style={{ margin: 0 }}>
          //       <p>
          //         <strong>Created:</strong>{" "}
          //         {new Date(record.createdAt).toLocaleString()}
          //       </p>
          //       <p>
          //         <strong>Last Updated:</strong>{" "}
          //         {new Date(record.updatedAt).toLocaleString()}
          //       </p>
          //       {record.adminNotes && (
          //         <p>
          //           <strong>Admin Notes:</strong> {record.adminNotes}
          //         </p>
          //       )}
          //     </div>
          //   ),
          //   rowExpandable: (record) => true,
          // }}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            pageSizeOptions: ["10", "20", "50"],
            showTotal: (total, range) =>
              `${range[0]}-${range[1]} of ${total} items`,
          }}
        />
      </Card>
      <Modal
        centered
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
        width={600}
      >
        {selectedRequest && <RequestCard request={selectedRequest} />}
      </Modal>
      <Modal
        title="Update Request Status"
        visible={updateModalVisible}
        onCancel={() => setUpdateModalVisible(false)}
        footer={[
          <Button key="cancel" onClick={() => setUpdateModalVisible(false)}>
            Cancel
          </Button>,
          <Button
            key="submit"
            type="primary"
            loading={updating}
            onClick={() => updateForm.submit()}
          >
            Update
          </Button>
        ]}
      >
        <Form
          form={updateForm}
          layout="vertical"
          onFinish={handleStatusUpdate}
        >
          <Form.Item
            name="status"
            label="Status"
            rules={[{ required: true, message: 'Please select a status' }]}
          >
            <Select>
              <Select.Option value="waiting">Waiting</Select.Option>
              <Select.Option value="accepted">Accepted</Select.Option>
              <Select.Option value="rejected">Rejected</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="adminNotes"
            label="Admin Notes"
          >
            <Input.TextArea rows={4} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default RequestList;
