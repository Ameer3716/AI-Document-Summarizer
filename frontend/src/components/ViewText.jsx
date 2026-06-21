// src/components/ViewText.jsx
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import './ViewText.css';

const ViewText = () => {
  const savedContent = localStorage.getItem('uploadedContent') || 'No content available.';
  const [isSpeaking, setIsSpeaking] = useState(false);
  const navigate = useNavigate();

  // Copy the content to clipboard.
  const handleCopy = () => {
    navigator.clipboard.writeText(savedContent);
    alert('Content copied to clipboard!');
  };

  // Download the content as a .txt file while preserving formatting.
  const handleDownload = () => {
    const element = document.createElement('a');
    const file = new Blob([savedContent], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = 'extracted-content.txt';
    document.body.appendChild(element);
    element.click();
  };

  // Toggle text-to-speech reading.
  const handleSpeak = () => {
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    } else {
      const utterance = new SpeechSynthesisUtterance(savedContent);
      utterance.onend = () => setIsSpeaking(false);
      window.speechSynthesis.speak(utterance);
      setIsSpeaking(true);
    }
  };

  return (
    <motion.div
      className="view-container"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: 'spring', stiffness: 100, damping: 15 }}
    >
      <h2 className="view-title">Extracted Content</h2>
      <div className="content-display">
        <pre>{savedContent}</pre>
      </div>
      <div className="btn-group">
        <motion.button className="action-btn" whileHover={{ scale: 1.05 }} onClick={handleCopy}>
          Copy to Clipboard
        </motion.button>
        <motion.button className="action-btn" whileHover={{ scale: 1.05 }} onClick={handleDownload}>
          Download .txt
        </motion.button>
        <motion.button className="action-btn" whileHover={{ scale: 1.05 }} onClick={handleSpeak}>
          {isSpeaking ? 'Stop Text-to-Speech' : 'Text-to-Speech'}
        </motion.button>
      </div>
      <motion.button className="back-btn" whileHover={{ scale: 1.05 }} onClick={() => navigate('/')}>
        Back
      </motion.button>
    </motion.div>
  );
};

export default ViewText;
