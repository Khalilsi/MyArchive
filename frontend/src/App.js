import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/connexion/login.jsx';
import Signup from './pages/signup.jsx';
import Homepage from './pages/homepage.jsx';
import RequestForm from './pages/connexion/demande.jsx';
import ActualitePage from './pages/Actualité.jsx';
import RequestList from './pages/admin/RequestList.jsx';
import UserManagement from './pages/admin/UserManagement.jsx';
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/demande" element={<RequestForm />} />
        <Route path="/actualite" element={<ActualitePage />} />
        <Route path="/admin/requests" element={<RequestList />} />
        <Route path="/admin/users" element={<UserManagement />} />
        {/* Add more routes as needed */}
      </Routes>
    </Router>
  );
}

export default App;