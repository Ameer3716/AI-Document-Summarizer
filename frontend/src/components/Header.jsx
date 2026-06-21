import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import './Header.css';

const Header = () => {
  const navigate = useNavigate();

  const handleDashboard = () => {
    navigate('/dashboard');
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    navigate('/login');
  };

  return (
    <header className="header-container">
      <h1 className="header-title">AI Document Summarizer</h1>
      <nav className="header-nav">
        <motion.button 
          className="nav-btn" 
          whileHover={{ scale: 1.05 }} 
          onClick={handleDashboard}
        >
          My Documents
        </motion.button>
        <motion.button 
          className="nav-btn" 
          whileHover={{ scale: 1.05 }} 
          onClick={handleLogout}
        >
          Logout
        </motion.button>
      </nav>
    </header>
  );
};

export default Header;
