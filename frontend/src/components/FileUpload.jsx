// src/components/FileUpload.jsx
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import './FileUpload.css';

const FileUpload = () => {
  const [file, setFile] = useState(null);
  const [url, setUrl] = useState('');
  const [content, setContent] = useState('');
  const [keywords, setKeywords] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Load saved content and keywords on mount.
  useEffect(() => {
    const savedContent = localStorage.getItem('uploadedContent');
    const savedKeywords = localStorage.getItem('uploadedKeywords');
    if (savedContent) setContent(savedContent);
    if (savedKeywords) setKeywords(JSON.parse(savedKeywords));
  }, []);

  const handleFileChange = (e) => setFile(e.target.files[0]);
  const handleUrlChange = (e) => setUrl(e.target.value);

  const handleUpload = async () => {
    setIsLoading(true);
    setError(null);
    const formData = new FormData();
    if (file) formData.append('file', file);
    if (url) formData.append('url', url);
    const token = localStorage.getItem('authToken');

    try {
      const response = await fetch(`${import.meta.env.PROD ? '' : 'http://localhost:8000'}/api/process/`, {
        method: 'POST',
        headers: {
          'Authorization': `Token ${token}`  // Add Authorization header
        },
        body: formData,
      });
      const data = await response.json();

      if (data.error) {
        setError(data.error);
      } else {
        setContent(data.content);
        setKeywords(data.keywords);
        localStorage.setItem('uploadedContent', data.content);
        localStorage.setItem('uploadedKeywords', JSON.stringify(data.keywords));
      }
    } catch (err) {
      setError('Error processing document. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      className="upload-container"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: 'spring', stiffness: 100, damping: 15, delay: 0.2 }}
    >
      <h2 className="upload-title">Upload Document</h2>
      
      <motion.div className="input-container" whileHover={{ scale: 1.02 }}>
        <input
          type="file"
          className="file-input"
          onChange={handleFileChange}
          accept=".pdf,.docx,.txt"
        />
      </motion.div>
      
      <motion.div className="input-container" whileHover={{ scale: 1.02 }}>
        <input
          type="text"
          className="url-input"
          placeholder="Or enter a web URL"
          value={url}
          onChange={handleUrlChange}
        />
      </motion.div>
      
      <motion.button
        className="upload-btn"
        whileHover={{ scale: 1.05 }}
        onClick={handleUpload}
      >
        Submit ⬆️
      </motion.button>

      {isLoading && (
        <motion.div className="loading-indicator" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          Loading...
        </motion.div>
      )}

      {error && (
        <motion.div className="error-message" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          {error}
        </motion.div>
      )}

      {content && (
        <motion.div
          className="nav-container"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <motion.button
            className="upload-btn"
            whileHover={{ scale: 1.05 }}
            onClick={() => navigate('/view-text')}
          >
            View Content
          </motion.button>
          <motion.button
            className="upload-btn"
            whileHover={{ scale: 1.05 }}
            onClick={() => navigate('/view-keywords')}
          >
            View Keywords
          </motion.button>
        </motion.div>
      )}
    </motion.div>
  );
};

export default FileUpload;
