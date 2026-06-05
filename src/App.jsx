import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "./contexts/AuthContext";
import { CartProvider } from "./contexts/CartContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Navbar from "./components/layout/Navbar";

import HomePage from "./pages/HomePage";
import LoginPage from "./pages/auth/LoginPage";
import RegisterPage from "./pages/auth/RegisterPage";
import ProfilePage from "./pages/auth/ProfilePage";
import ProductsPage from "./pages/ProductsPage";
import ProductDetailPage from "./pages/ProductDetailPage";
import SearchPage from "./pages/SearchPage";
import SellerProfilePage from "./pages/SellerProfilePage";

import CartPage from "./pages/buyer/CartPage";
import OrdersPage from "./pages/buyer/OrdersPage";
import FavoritesPage from "./pages/buyer/FavoritesPage";
import MessagesPage from "./pages/buyer/MessagesPage";

import DashboardPage from "./pages/seller/DashboardPage";
import MyProductsPage from "./pages/seller/MyProductsPage";
import SellerOrdersPage from "./pages/seller/SellerOrdersPage";

import AdminDashboard from "./pages/admin/AdminDashboard";
import UsersPage from "./pages/admin/UsersPage";
import CouponsPage from "./pages/admin/CouponsPage";

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <Toaster position="top-right" />
          <div className="min-h-screen bg-gray-50">
            <Navbar />
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/products" element={<ProductsPage />} />
              <Route path="/products/:id" element={<ProductDetailPage />} />
              <Route path="/search" element={<SearchPage />} />
              <Route path="/sellers/:id" element={<SellerProfilePage />} />

              <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
              <Route path="/cart" element={<ProtectedRoute><CartPage /></ProtectedRoute>} />
              <Route path="/orders" element={<ProtectedRoute><OrdersPage /></ProtectedRoute>} />
              <Route path="/favorites" element={<ProtectedRoute><FavoritesPage /></ProtectedRoute>} />
              <Route path="/messages" element={<ProtectedRoute><MessagesPage /></ProtectedRoute>} />

              <Route path="/seller/dashboard" element={<ProtectedRoute role="seller"><DashboardPage /></ProtectedRoute>} />
              <Route path="/seller/products" element={<ProtectedRoute role="seller"><MyProductsPage /></ProtectedRoute>} />
              <Route path="/seller/orders" element={<ProtectedRoute role="seller"><SellerOrdersPage /></ProtectedRoute>} />

              <Route path="/admin" element={<ProtectedRoute role="admin"><AdminDashboard /></ProtectedRoute>} />
              <Route path="/admin/users" element={<ProtectedRoute role="admin"><UsersPage /></ProtectedRoute>} />
              <Route path="/admin/coupons" element={<ProtectedRoute role="admin"><CouponsPage /></ProtectedRoute>} />

              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </div>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}