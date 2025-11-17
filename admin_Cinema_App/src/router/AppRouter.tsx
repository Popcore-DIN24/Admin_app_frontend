import { Routes, Route } from 'react-router-dom';
import AdminDashboard from '../pages/Admin/Dashboard';
import ProtectedRoute from './ProtectedRoute'; 

<Routes>
  <Route path="/admin/*" element={
    <ProtectedRoute role="admin">
      <AdminDashboard />
    </ProtectedRoute>
  } />
</Routes>
