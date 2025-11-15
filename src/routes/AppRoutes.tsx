import { Routes, Route, Navigate } from 'react-router-dom';
import { ProtectedRoute } from './ProtectedRoute';
import { MainLayout } from '@/components/layout/MainLayout';

// Pages - will be created
import LoginPage from '@/pages/LoginPage';
import DashboardPage from '@/pages/DashboardPage';
import RoomTypesPage from '@/pages/RoomTypesPage';
import RoomsPage from '@/pages/RoomsPage';
import ReservationsPage from '@/pages/ReservationsPage';
import CheckInPage from '@/pages/CheckInPage';
import CheckOutPage from '@/pages/CheckOutPage';
import ServicesPage from '@/pages/ServicesPage';
import EmployeesPage from '@/pages/EmployeesPage';
import InvoicesPage from '@/pages/InvoicesPage';

export const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={<LoginPage />} />
      
      {/* Protected Routes */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <MainLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<DashboardPage />} />
        <Route path="room-types" element={<RoomTypesPage />} />
        <Route path="rooms" element={<RoomsPage />} />
        <Route path="reservations" element={<ReservationsPage />} />
        <Route path="check-in" element={<CheckInPage />} />
        <Route path="check-out" element={<CheckOutPage />} />
        <Route path="services" element={<ServicesPage />} />
        <Route path="employees" element={<EmployeesPage />} />
        <Route path="invoices" element={<InvoicesPage />} />
      </Route>
      
      {/* Catch all - redirect to dashboard */}
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
};

