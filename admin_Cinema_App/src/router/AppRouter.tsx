import { Routes, Route } from 'react-router-dom';
import AdminDashboard from '../pages/Admin/Dashboard';
import ProtectedRoute from './ProtectedRoute'; 
import EmployeeDashboard from '../pages/Admin/DashboardEmployee';

<Routes>
  <Route path="/admin/*" element={
    <ProtectedRoute role="admin">
      <AdminDashboard />
      <EmployeeDashboard />
    </ProtectedRoute>

  } />
</Routes>
