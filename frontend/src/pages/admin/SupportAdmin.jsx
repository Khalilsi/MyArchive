import React, { useEffect, useState, useRef } from "react";
import { Card, Input, Button, List, Spin, message as antdMessage } from "antd";
import { SendOutlined } from "@ant-design/icons";
import axios from "axios";
import apiClient from '../../Api/client';

const { TextArea } = Input;

const UserSidebar = ({ users, selectedUserId, onSelectUser }) => (
  <div
    style={{ width: 350, borderRight: "0px solid #f0f0f0", overflowY: "auto" }}
  >
    <List
      header={<strong>Liste des Utilisateurs</strong>}
      bordered
      dataSource={users}
      renderItem={(user) => (
        <List.Item
          style={{
            cursor: "pointer",
            background: selectedUserId === user._id ? "#e6f7ff" : "#fff",
          }}
          onClick={() => onSelectUser(user._id)}
        >
          {user.username ? user.username : user.email || user._id}
        </List.Item>
      )}
    />
  </div>
);

const Support = () => {
  const [users, setUsers] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef(null);

  const token =
    localStorage.getItem("token") || sessionStorage.getItem("token");

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get("/api/users", {
        headers: { "x-auth-token": token },
      });

      if (response.data.success) {
        setUsers(response.data.data);
      }
    } catch (error) {
      antdMessage.error("Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async (userId) => {
    if (!userId) return;
    setLoading(true);
    try {
      const res = await apiClient.get(
        `/api/support/admin/messages/${userId}`,
        {
          headers: { "x-auth-token": token },
        }
      );
      const enhancedMessages = (res.data.messages || []).map((msg) => ({
        ...msg,
        senderRole: msg.senderRole === "user" ? "user" : "admin",
      }));
      setMessages(enhancedMessages);
    } catch (error) {
      antdMessage.error("Failed to load messages");
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedUserId) return;
    setSending(true);
    try {
      const response = await apiClient.post(
        "/api/support/message",
        { message: newMessage, userId: selectedUserId },
        { headers: { "x-auth-token": token } }
      );

      setMessages((prevMessages) => [
        ...prevMessages,
        response.data.supportMessage,
      ]);
      setNewMessage("");
    } catch (error) {
      antdMessage.error("Failed to send message");
    } finally {
      setSending(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    if (selectedUserId) {
      fetchMessages(selectedUserId);
    }
  }, [selectedUserId]);

  return (
    <div
      style={{
        display: "flex",
        height: "80vh",
        width: "95%",
        margin: "auto",
        marginTop: 20,
        border: "1px solid #f0f0f0",
        borderRadius: 4,
      }}
    >
      <UserSidebar
        users={users}
        selectedUserId={selectedUserId}
        onSelectUser={setSelectedUserId}
      />

      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        <div
          style={{
            flex: 1,
            padding: 16,
            overflowY: "auto",
            background: "#fff",
            display: "flex",
            flexDirection: "column",
          }}
        >
          {loading ? (
            <Spin />
          ) : (
            messages.map((item) => (
              <div
                key={item._id}
                style={{
                  alignSelf:
                    item.senderRole === "user" ? "flex-start" : "flex-end",
                  backgroundColor:
                    item.senderRole === "user" ? "#f6ffed" : "#e6f7ff",
                  padding: "10px 15px",
                  borderRadius: 16,
                  marginBottom: 10,
                  maxWidth: "60%",
                  boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
                  wordBreak: "break-word",
                }}
              >
                <p style={{ margin: 0 }}>{item.message}</p>
                <small style={{ fontSize: 10, color: "#999" }}>
                  {new Date(item.createdAt).toLocaleString()}
                </small>
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>

        <div
          style={{
            borderTop: "1px solid #f0f0f0",
            padding: 16,
            background: "#fafafa",
          }}
        >
          <div style={{ display: "flex", alignItems: "flex-end", gap: 8 }}>
            <TextArea
              autoSize={{ minRows: 1.4, maxRows: 6 }}
              placeholder="Tapez votre message ici..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              style={{ flex: 1, borderRadius: 8, border: "1px solid #d9d9d9" }}
            />
            <Button
              type="primary"
              onClick={sendMessage}
              loading={sending}
              icon={<SendOutlined />}
              style={{ borderRadius: 8, height: 39, width: 40 }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Support;
