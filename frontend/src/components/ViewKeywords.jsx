// src/components/ViewKeywords.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import './ViewKeywords.css';

const ViewKeywords = () => {
  const savedKeywords = JSON.parse(localStorage.getItem('uploadedKeywords')) || [];
  const navigate = useNavigate();

  const handleCopy = () => {
    const keywordsText = savedKeywords.join(', ');
    navigator.clipboard.writeText(keywordsText);
    alert('Keywords copied to clipboard!');
  };

  return (
    <motion.div
      className="view-container"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: 'spring', stiffness: 100, damping: 15 }}
    >
      <h2 className="view-title">Extracted Keywords</h2>
      <div className="keywords-display">
        {savedKeywords.length > 0 ? (
          <ul>
            {savedKeywords.map((keyword, index) => (
              <motion.li key={index} whileHover={{ scale: 1.1 }}>
                {keyword}
              </motion.li>
            ))}
          </ul>
        ) : (
          <p>No keywords available.</p>
        )}
      </div>
      <div className="btn-group">
        <motion.button className="action-btn" whileHover={{ scale: 1.05 }} onClick={handleCopy}>
          Copy Keywords
        </motion.button>
      </div>
      <motion.button className="back-btn" whileHover={{ scale: 1.05 }} onClick={() => navigate('/')}>
        Back
      </motion.button>
    </motion.div>
  );
};

export default ViewKeywords;
