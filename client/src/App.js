import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ChecklistProvider } from './contexts/ChecklistContext';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import KnowledgeTest from './pages/KnowledgeTest';
import Checklist from './pages/Checklist';
import DL180Form from './pages/DL180Form';
import Scheduling from './pages/Scheduling';
import Profile from './pages/Profile';
import LoadingSpinner from './components/LoadingSpinner';

function AppRoutes() {
  const { user, loading } = useAuth();

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <Routes>
      <Route 
        path="/login" 
        element={user ? <Navigate to="/dashboard" /> : <Login />} 
      />
      <Route 
        path="/register" 
        element={user ? <Navigate to="/dashboard" /> : <Register />} 
      />
      <Route 
        path="/dashboard" 
        element={user ? <Dashboard /> : <Navigate to="/login" />} 
      />
      <Route 
        path="/knowledge-test" 
        element={user ? <KnowledgeTest /> : <Navigate to="/login" />} 
      />
      <Route 
        path="/checklist" 
        element={user ? <Checklist /> : <Navigate to="/login" />} 
      />
      <Route 
        path="/dl180-form" 
        element={user ? <DL180Form /> : <Navigate to="/login" />} 
      />
      <Route 
        path="/scheduling" 
        element={user ? <Scheduling /> : <Navigate to="/login" />} 
      />
      <Route 
        path="/profile" 
        element={user ? <Profile /> : <Navigate to="/login" />} 
      />
      <Route 
        path="/" 
        element={<Navigate to={user ? "/dashboard" : "/login"} />} 
      />
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <ChecklistProvider>
        <div className="min-h-screen bg-gray-50">
          <Navbar />
          <main className="container mx-auto px-4 py-8">
            <AppRoutes />
          </main>
        </div>
      </ChecklistProvider>
    </AuthProvider>
  );
}

export default App;
