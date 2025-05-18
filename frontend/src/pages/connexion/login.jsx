import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { Form, Input, Button, Checkbox, message } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import "../style/login.css";
import { useAuth } from "../../context/AuthContext"; // Import the AuthContext

const Login = () => {
  const { login } = useAuth(); // Get the login function from AuthContext
  const navigate = useNavigate();

  const handleSubmit = async (values) => {
    try {
      const response = await axios.post(
        "http://localhost:4000/api/auth/login",
        {
          email: values.email,
          password: values.password,
        }
      );

      if (response.data.success) {
        const { token, user } = response.data;

        // Store token based on remember me preference
        if (values.remember) {
          localStorage.setItem("token", token);
          sessionStorage.removeItem("token");
        } else {
          sessionStorage.setItem("token", token);
          localStorage.removeItem("token");
        }

        // Use the login function from AuthContext
        login(user, token);

        message.success("Login successful!");

        // Navigate based on user role
        if (user.role === "admin") {
          navigate("/admin/users");
        } else if (user.role === "user") {
          navigate("/client/dashboard");
        }
      } else {
        message.error("Login failed");
      }
    } catch (error) {
      console.error("Login error:", error.response?.data?.msg || error.message);
      message.error(
        error.response?.data?.msg ||
          "Login failed! Please check your credentials."
      );
    }
  };

  return (
    <div className="login-container">
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

          <Form.Item>
            <div className="remember-forgot">
              <Form.Item name="remember" valuePropName="checked" noStyle>
                <Checkbox>Remember me</Checkbox>
              </Form.Item>
              <Link to="/forgot-password" className="forgot-link">
                Forgot password?
              </Link>
            </div>
          </Form.Item>

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
            Don't have an account?{" "}
            <Link to="/signup" className="login-link">
              Sign up
            </Link>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default Login;
