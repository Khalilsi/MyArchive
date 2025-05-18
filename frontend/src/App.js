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
import UserDashboard from "./pages/client/UserDashbored.jsx";
import Archives from "./components/client/Mes archives/Archives.jsx";
import ClientLayout from "./components/client/clientLayout.jsx";
import Documents from "./components/client/Mes documents/Documents.jsx";
function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/demande" element={<RequestForm />} />
          <Route path="/actualite" element={<ActualitePage />} />

          {/* Protected Admin Routes */}
          <Route
            path="/admin/requests"
            element={
              <ProtectedRoute roles={["admin"]}>
                <RequestList />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/users"
            element={
              <ProtectedRoute roles={["admin"]}>
                <UserManagement />
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
