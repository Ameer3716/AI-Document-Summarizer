import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css';

const Dashboard = () => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDocuments = async () => {
      const token = localStorage.getItem('authToken');
      
      if (!token) {
        navigate('/login');  // Redirect if no token
        return;
      }

      try {
        const res = await fetch(`${import.meta.env.PROD ? '' : 'http://localhost:8000'}/api/documents/`, {
          headers: { 'Authorization': `Token ${token}` }
        });

        if (res.ok) {
          const data = await res.json();
          setDocuments(data);
        } else {
          setError("Failed to fetch documents");
        }
      } catch (err) {
        setError("Error fetching documents");
      } finally {
        setLoading(false);
      }
    };

    fetchDocuments();
  }, [navigate]);
  const handleDelete = async (documentId) => {
    const token = localStorage.getItem('authToken');
    try {
      const res = await fetch(`${import.meta.env.PROD ? '' : 'http://localhost:8000'}/api/documents/${documentId}/delete/`, {
        method: 'DELETE',
        headers: { 'Authorization': `Token ${token}` }
      });
      
      if (res.ok) {
        setDocuments(documents.filter(doc => doc.id !== documentId));
      } else {
        setError("Failed to delete document");
      }
    } catch (err) {
      setError("Error deleting document");
    }
  };
  return (
    <motion.div
      className="dashboard-container"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: 'spring', stiffness: 100, damping: 15 }}
    >
      <h2>My Documents</h2>

      {loading ? (
        <p>Loading documents...</p>
      ) : error ? (
        <p className="error">{error}</p>
      ) : documents.length === 0 ? (
        <p>No documents found.</p>
      ) : (
        <div className="document-list">
          {documents.map(doc => (
            <div key={doc.id} className="document-card">
              <h3>{doc.file_name} (v{doc.version})</h3>
              <p>Uploaded: {new Date(doc.upload_time).toLocaleString()}</p>
              
              <div className="document-actions">
                <button onClick={() => navigate('/view-text', { state: { content: doc.content } })}>
                  View Content
                </button>
                <button onClick={() => navigate('/edit-text', {
                  state: {
                    content: doc.content,
                    documentId: doc.id,
                    currentVersion: doc.version
                  }
                })}>
                  Create New Version
                </button>
                <button 
        className="delete-btn"
        onClick={() => handleDelete(doc.id)}
      >
        Delete
      </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <button onClick={() => navigate('/')}>Back</button>
    </motion.div>
  );
};

export default Dashboard;