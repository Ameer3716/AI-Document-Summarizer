// src/components/ErrorBoundary.jsx
import React, { Component } from 'react';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  
  static getDerivedStateFromError(error) {
    // Update state so the next render shows the fallback UI.
    return { hasError: true, error };
  }
  
  componentDidCatch(error, errorInfo) {
    // You can log the error to an error reporting service here.
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }
  
  render() {
    if (this.state.hasError) {
      return <h2>Something went wrong in this section.</h2>;
    }
    return this.props.children; 
  }
}

export default ErrorBoundary;
