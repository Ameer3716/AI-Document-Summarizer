// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import PrivateRoute from './components/PrivateRoute';
import MainLayout from './components/MainLayout';
import FileUpload from './components/FileUpload';
import ViewText from './components/ViewText';
import EditableViewText from './components/EditableViewText';
import ViewKeywords from './components/ViewKeywords';
import Dashboard from './components/Dashboard';
import Login from './components/Login';
import Register from './components/Register';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route
          path="/"
          element={
            <PrivateRoute>
              <MainLayout>
                <FileUpload />
              </MainLayout>
            </PrivateRoute>
          }
        />
        <Route
          path="/view-text"
          element={
            <PrivateRoute>
              <MainLayout>
                <ViewText />
              </MainLayout>
            </PrivateRoute>
          }
        />
        <Route
          path="/edit-text"
          element={
            <PrivateRoute>
              <MainLayout>
                <EditableViewText />
              </MainLayout>
            </PrivateRoute>
          }
        />
        <Route
          path="/view-keywords"
          element={
            <PrivateRoute>
              <MainLayout>
                <ViewKeywords />
              </MainLayout>
            </PrivateRoute>
          }
        />
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <MainLayout>
                <Dashboard />
              </MainLayout>
            </PrivateRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
