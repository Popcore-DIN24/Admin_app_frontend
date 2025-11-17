//import { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import Login from './pages/Auth/Login';                       
import ProtectedRoute from './router/ProtectedRoute';         
import AdminRoutes from './router/AdminRoutes';               
import EmployeeRoutes from './router/EmployeeRoutes';         
import './styles/global.css';   

function App() {

  return (
    <Routes>
    <Route path="/login" element={<Login />} />
        <Route
        path="/admin/*"
        element={
          <ProtectedRoute role="admin">
            <AdminRoutes />
          </ProtectedRoute>
        }
      />
      <Route
        path="/employee/*"
        element={
          <ProtectedRoute role="employee">
            <EmployeeRoutes />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default App;
