import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Inventory from './pages/Inventory';
import Clients from './pages/Clients';
import Contracts from './pages/Contracts';
import ContractView from './pages/ContractView';
import Settings from './pages/Settings';
import Login from './pages/Login';

// Mock Auth Guard
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const isAuthenticated = localStorage.getItem('isLoggedIn') === 'true';
  if (!isAuthenticated) return <Navigate to="/login" />;
  return <Layout>{children}</Layout>;
};

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        
        <Route path="/" element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } />
        
        <Route path="/estoque" element={
          <ProtectedRoute>
            <Inventory />
          </ProtectedRoute>
        } />
        
        <Route path="/clientes" element={
          <ProtectedRoute>
            <Clients />
          </ProtectedRoute>
        } />
        
        <Route path="/contratos" element={
          <ProtectedRoute>
            <Contracts />
          </ProtectedRoute>
        } />
        
        <Route path="/contratos/:id" element={
          <ProtectedRoute>
            <ContractView />
          </ProtectedRoute>
        } />

        <Route path="/configuracoes" element={
          <ProtectedRoute>
            <Settings />
          </ProtectedRoute>
        } />

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}
