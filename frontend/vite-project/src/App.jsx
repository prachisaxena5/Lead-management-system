import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import LeadsList from "./pages/LeadsList";
import LeadForm from "./pages/LeadForm";
import Navbar from "./components/Navbar";

// a simple way to protect routes:
const PrivateRoute = ({ children }) => {
  // check if user logged in (we'll fetch /auth/me in navbar)
  const user = localStorage.getItem("user"); // we store only UI user info here
  return user ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <Router>
      <Navbar />
      <div className="container">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/leads"
            element={
              <PrivateRoute>
                <LeadsList />
              </PrivateRoute>
            }
          />
          <Route
            path="/leads/new"
            element={
              <PrivateRoute>
                <LeadForm />
              </PrivateRoute>
            }
          />
          <Route
            path="/leads/:id/edit"
            element={
              <PrivateRoute>
                <LeadForm />
              </PrivateRoute>
            }
          />
          <Route path="/" element={<Navigate to="/leads" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
