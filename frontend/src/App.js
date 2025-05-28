import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/connexion/ProtectedRoute";
import Login from "./pages/connexion/login.jsx";
import Signup from "./pages/signup.jsx";
import Homepage from "./pages/homepage.jsx";
import RequestForm from "./pages/connexion/demande.jsx";
import ActualitePage from "./pages/Actualité.jsx";
import RequestList from "./pages/admin/RequestList.jsx";
import UserManagement from "./pages/admin/UserManagement.jsx";
import SupportAdmin from "./pages/admin/SupportAdmin.jsx";
import UserDashboard from "./pages/client/UserDashbored.jsx";
import Archives from "./components/client/Mes archives/Archives.jsx";
import ClientLayout from "./components/client/clientLayout.jsx";
import Documents from "./components/client/Mes documents/Documents.jsx";
import CompanyInfo from "./components/client/Mes Infomations/Company.jsx";
import Support from "./components/client/support/support.jsx";
import SecuritySettings from "./components/client/Settings/SecuritySettings.jsx";
import AboutPage from "./pages/AboutUs.jsx";
import FAQPage from "./pages/FAQ.jsx";
import ScrollToTop from "./components/ScrollToTop";
import AdminLayout from "./components/adminPage/adminLayout.jsx";
import ForfaitManagement from "./pages/admin/ForfaitManagement.jsx";

function App() {
  return (
    <AuthProvider>
      <Router>
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="/login" element={<Login />} />
          {/* <Route path="/signup" element={<Signup />} /> */}
          <Route path="/demande" element={<RequestForm />} />
          <Route path="/actualite" element={<ActualitePage />} />
          <Route path="/à propos nous" element={<AboutPage />} />
          <Route path="/FAQ" element={<FAQPage />} />

          {/* Protected Admin Routes */}
          <Route
            path="/admin/requests"
            element={
              <ProtectedRoute roles={["admin"]}>
                <AdminLayout>
                  <RequestList />
                </AdminLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/users"
            element={
              <ProtectedRoute roles={["admin"]}>
                <AdminLayout>
                  <UserManagement />
                </AdminLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/support"
            element={
              <ProtectedRoute roles={["admin"]}>
                <AdminLayout>
                  <SupportAdmin />
                </AdminLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/forfaits"
            element={
              <ProtectedRoute roles={["admin"]}>
                <AdminLayout>
                  <ForfaitManagement />
                </AdminLayout>
              </ProtectedRoute>
            }
          />

          {/* Protected User Routes */}
          <Route
            path="/client/archives"
            element={
              <ProtectedRoute>
                <ClientLayout>
                  <Archives />
                </ClientLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/client/dashboard"
            element={
              <ProtectedRoute>
                <ClientLayout>
                  <UserDashboard />
                </ClientLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/client/documents"
            element={
              <ProtectedRoute>
                <ClientLayout>
                  <Documents />
                </ClientLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/client/CompanyInfo"
            element={
              <ProtectedRoute>
                <ClientLayout>
                  <CompanyInfo />
                </ClientLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/client/settings"
            element={
              <ProtectedRoute>
                <ClientLayout>
                  <SecuritySettings />
                </ClientLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/client/support"
            element={
              <ProtectedRoute>
                <ClientLayout>
                  <Support />
                </ClientLayout>
              </ProtectedRoute>
            }
          />

          {/* Redirect based on role */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute roles={["admin", "user"]}>
                {({ user }) => (
                  <Navigate
                    to={
                      user.role === "admin"
                        ? "/admin/users"
                        : "/client/dashboard"
                    }
                    replace
                  />
                )}
              </ProtectedRoute>
            }
          />

          {/* Catch all route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
