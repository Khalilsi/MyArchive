import React, { useEffect, useState, useRef } from "react";
import { Card, Input, Button, List, Spin, message as antdMessage } from "antd";
import { SendOutlined } from "@ant-design/icons";
import axios from "axios";

const { TextArea } = Input;

const Support = () => {
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef(null);

  const token =
    localStorage.getItem("token") || sessionStorage.getItem("token");

  const fetchMessages = async () => {
    setLoading(true);
    try {
      const res = await axios.get("http://localhost:4000/api/support/messages", {
        headers: {
          "x-auth-token": token,
        },
      });
      setMessages(res.data.messages || []);
    } catch (error) {
      antdMessage.error("Failed to load messages");
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim()) return;
    setSending(true);
    try {
      const res = await axios.post(
        "http://localhost:4000/api/support/message",
        { message: newMessage },
        {
          headers: {
            "x-auth-token": token,
          },
        }
      );
      setMessages((prev) => [...prev, res.data.supportMessage]);
      setNewMessage("");
    } catch (error) {
      antdMessage.error("Failed to send message");
    } finally {
      setSending(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  return (
    <div
      style={{
        width: "93%",
        maxWidth: "800%",
        margin: "auto",
        marginTop: 20,
        display: "flex",
        flexDirection: "column",
        height: "85%",
        border: "1px solid #f0f0f0",
        borderRadius: 4,
        boxShadow: "none",
      }}
    >
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
                  item.senderRole === "admin" ? "flex-start" : "flex-end",
                backgroundColor:
                  item.senderRole === "admin" ? "#f6ffed" : "#e6f7ff",
                padding: "10px 15px",
                borderRadius: 16,
                marginBottom: 10,
                width: "40%",
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
            placeholder="Type your message here..."
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
  );
};

export default Support;
