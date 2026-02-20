import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import HomePage from './pages/HomePage';
import ReviewsLandingPage from './pages/ReviewsLandingPage';
import ToolsPage from './pages/ToolsPage';
import ServicesLandingPage from './pages/ServicesLandingPage';
import EbooksLandingPage from './pages/EbooksLandingPage';
import AdminLayout from './pages/admin/AdminLayout';
import DashboardPage from './pages/admin/DashboardPage';
import OrdersPage from './pages/admin/OrdersPage';
import ReviewsPage from './pages/admin/ReviewsPage';
import FeedbackPage from './pages/admin/FeedbackPage';
import EbooksPage from './pages/admin/EbooksPage';
import ServicesPage from './pages/admin/ServicesPage';
import AdminLoginPage from './pages/admin/AdminLoginPage';
import UserLoginPage from './pages/UserLoginPage';
import ProfilePage from './pages/admin/ProfilePage';
import UserDashboardPage from './pages/UserDashboardPage';
import ServiceIntakePage from './pages/ServiceIntakePage';
import { AuthProvider } from './contexts/AuthContext';
import { useAuth } from './contexts/AuthContext';

const UserOrdersRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login?next=/orders" replace />;
  }

  return <>{children}</>;
};

const AdminProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { adminAuthenticated } = useAuth();
  if (!adminAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }
  return <>{children}</>;
};

const AdminIndexRoute: React.FC = () => {
  return <Navigate to="/admin/dashboard" replace />;
};

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/tools" element={<ToolsPage />} />
          <Route path="/services" element={<ServicesLandingPage />} />
          <Route path="/ebooks" element={<EbooksLandingPage />} />
          <Route path="/reviews" element={<ReviewsLandingPage />} />
          <Route path="/login" element={<UserLoginPage />} />
          <Route
            path="/orders"
            element={
              <UserOrdersRoute>
                <UserDashboardPage />
              </UserOrdersRoute>
            }
          />
          <Route
            path="/orders/intake/:orderId"
            element={
              <UserOrdersRoute>
                <ServiceIntakePage />
              </UserOrdersRoute>
            }
          />
          <Route path="/admin/login" element={<AdminLoginPage />} />
          <Route
            path="/admin"
            element={
              <AdminProtectedRoute>
                <AdminLayout />
              </AdminProtectedRoute>
            }
          >
            <Route index element={<AdminIndexRoute />} />
            <Route path="dashboard" element={<DashboardPage />} />
            <Route path="orders" element={<OrdersPage />} />
            <Route path="profile" element={<ProfilePage />} />
            <Route path="reviews" element={<ReviewsPage />} />
            <Route path="feedback" element={<FeedbackPage />} />
            <Route path="ebooks" element={<EbooksPage />} />
            <Route path="services" element={<ServicesPage />} />
          </Route>
          <Route path="*" element={<HomePage />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
