// src/components/Navbar.js
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api";
import "./Navbar.css"; 

function Navbar() {
  const navigate = useNavigate();
  const user = localStorage.getItem("user");

  const handleLogout = async () => {
    try {
      await api.post("/auth/logout"); 
    } catch (err) {
      // ignore errors
    }
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <span className="brand-link">
          <span className="logo-text">Lead Management</span>
        </span>
      </div>
      <div className="navbar-links">
        {user ? (
          <>
            <Link to="/leads" className="nav-link">Leads</Link>
            <Link to="/leads/new" className="nav-link">Create Lead</Link>
            <button
              onClick={handleLogout}
              className="nav-button"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="nav-link">Login</Link>
            <Link to="/register" className="nav-link">
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;