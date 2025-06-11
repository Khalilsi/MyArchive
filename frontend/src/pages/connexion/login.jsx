import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { Form, Input, Button, Checkbox } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../style/login.css";
import { useAuth } from "../../context/AuthContext";
import apiClient from "../../Api/client";

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (values) => {
    try {
      const response = await apiClient.post(
        "api/auth/login",
        {
          email: values.email,
          password: values.password,
        }
      );

      if (response.data.success) {
        const { token, user } = response.data;

        if (values.remember) {
          localStorage.setItem("token", token);
          sessionStorage.removeItem("token");
        } else {
          sessionStorage.setItem("token", token);
          localStorage.removeItem("token");
        }

        login(user, token);

        toast.success("Connexion réussie !", {
          position: "top-center",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });

        if (user.role === "admin") {
          navigate("/admin/users");
        } else if (user.role === "user") {
          navigate("/client/dashboard");
        }
      }
    } catch (error) {
      toast.error(
        error.response?.status === 401
          ? "Email ou mot de passe incorrect"
          : "Erreur lors de la connexion. Veuillez réessayer.",
        {
          position: "bottom-left",
          autoClose: 4000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        }
      );
    }
  };

  return (
    <div className="login-container">
      <ToastContainer
        position="top-center"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
      <div className="login-background">
        <div className="background-overlay">
          {/* <h1 className="background-title">Welcome to MyArchive</h1>
          <p className="background-subtitle">Your personal digital archive</p> */}
        </div>
      </div>
      <div className="login-form">
        <h2 className="login-title">Connexion à votre espace</h2>

        <Form
          name="login"
          initialValues={{ remember: false }}
          onFinish={handleSubmit}
          layout="vertical"
        >
          <Form.Item
            name="email"
            rules={[
              {
                required: true,
                message: "Please input your email!",
                validateTrigger: "onSubmit",
              },
              {
                type: "email",
                message: "Please enter a valid email!",
                validateTrigger: "onSubmit",
              },
            ]}
          >
            <Input prefix={<UserOutlined />} placeholder="Email" size="large" />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[
              {
                required: true,
                message: "Please input your password!",
              },
            ]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="Password"
              size="large"
            />
          </Form.Item>

          {/* <Form.Item>
            <div className="remember-forgot">
              <Form.Item name="remember" valuePropName="checked" noStyle>
                <Checkbox>Remember me</Checkbox>
              </Form.Item>
              <Link to="/forgot-password" className="forgot-link">
                Forgot password?
              </Link>
            </div>
          </Form.Item> */}

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              className="login-button"
              block
              size="large"
            >
              Login
            </Button>
          </Form.Item>

          <div className="login-footer">
            Si tu n'avais pas de compte ?Tu peux faire une{" "}
            <Link to="/demande" className="login-link">
              Demande
            </Link>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default Login;
