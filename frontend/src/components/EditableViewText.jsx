// src/components/EditableViewText.jsx
import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { motion } from "framer-motion";
import ErrorBoundary from "./ErrorBoundary";
import "./EditableViewText.css";

const EditableViewText = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { content: initialContent, documentId } = location.state || { content: "", documentId: null };
  const [editorContent, setEditorContent] = useState(initialContent);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  const handleSave = async () => {
    setSaving(true);
    setError(null);
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`http://localhost:8000/api/documents/${documentId}/`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Token ${token}`,
        },
        body: JSON.stringify({ content: editorContent }),
      });
      
      const data = await response.json();  // Add this
      
      if (!response.ok) {
        setError(data.error || "Failed to save updated content");  // Modified
      } else {
        alert("Document updated successfully");
        navigate('/dashboard');
      }
    } catch (err) {
      setError("Network error - please check your connection");
    } finally {
      setSaving(false);
    }
  };

  return (
    <motion.div
      className="editable-view-container"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: 'spring', stiffness: 100, damping: 15 }}
    >
      <h2>Edit Document Content</h2>
      {error && <p className="error">{error}</p>}
      <ErrorBoundary>
        <ReactQuill
          theme="snow"
          value={editorContent}
          onChange={setEditorContent}
          className="editor"
        />
      </ErrorBoundary>
      <div className="btn-group">
        <button onClick={handleSave} disabled={saving}>
          {saving ? "Saving..." : "Save Changes"}
        </button>
        <button onClick={() => navigate('/dashboard')}>Cancel</button>
      </div>
    </motion.div>
  );
};

export default EditableViewText;
