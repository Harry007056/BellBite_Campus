import { Navigate, Route, Routes } from 'react-router-dom';
import { LoginPage } from '../pages/Auth/LoginPage';
import { RegisterPage } from '../pages/Auth/RegisterPage';
import { ForgotPasswordPage } from '../pages/Auth/ForgotPasswordPage';
import { ResetPasswordPage } from '../pages/Auth/ResetPasswordPage';
import { HomePage } from '../pages/Home/HomePage';
import { CategoryPage } from '../pages/Menu/CategoryPage';
import { ViewMenuPage } from '../pages/Menu/ViewMenuPage';
import { OrderPage } from '../pages/Orders/OrderPage';
import { ProtectedRoute } from '../components/auth/ProtectedRoute';
import { ProfilePage } from '../pages/Profile/ProfilePage';
import { AdminPage } from '../pages/Admin/AdminPage';

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/reset-password" element={<ResetPasswordPage />} />
      <Route path="/menu" element={<ViewMenuPage />} />
      <Route path="/menu/:categorySlug" element={<CategoryPage />} />
      <Route
        path="/orders"
        element={
          <ProtectedRoute allowedRoles={['student', 'college_staff', 'faculty']}>
            <OrderPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <ProfilePage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin"
        element={
          <ProtectedRoute allowedRoles={['canteen_admin']}>
            <AdminPage />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
