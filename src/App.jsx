import { useState } from 'react'
import './App.css'
import { Routes, Route,Navigate } from 'react-router-dom'
import ProtectedRoute from './components/ProtectedRoute'
import HomePage from './pages/HomePage'
import LoginPage from './pages/auth/LoginPage'
import RegisterPage from './pages/auth/RegisterPage'
import ProfilePage from './pages/auth/ProfilePage'
import ProductsPage from './pages/ProductsPage'
import ProductPageDetail from './pages/ProductDetailPage'
import SearchPage from './pages/SearchPage'
import SellerOrdersPage from './pages/seller/SellerOrdersPage'
import DashboardPage from './pages/seller/DashboardPage'
import MyProductsPage from './pages/seller/MyProductsPage'
import AddProductPage from './pages/seller/AddProductPage'
import EditProductPage from './pages/seller/EditProductPage'
import CartPage from "./pages/buyer/CartPage";
import OrdersPage from "./pages/buyer/OrdersPage";
import FavoritesPage from "./pages/buyer/FavoritesPage";
import MessagesPage from "./pages/buyer/MessagesPage";
import AdminDashboard from './pages/admin/AdminDashboard';

import DashboardPage from "./pages/seller/DashboardPage";
import MyProductsPage from "./pages/seller/MyProductsPage";
import SellerProfilePage from "./pages/SellerProfilePage";
import SellerOrdersPage from "./pages/seller/SellerOrdersPage";

import AdminDashboard from "./pages/admin/AdminDashboard";
import UsersPage from "./pages/admin/UsersPage";
import AdminProductsPage from './pages/admin/AdminProductsPage';
import CouponsPage from './pages/admin/CouponsPage';
import AddCouponPage from './pages/admin/AddCouponPage';
import EditCouponPage from './pages/admin/EditCouponPage';


export default function App() {
  return (
    <Routes>
      {/* Routes publiques */}
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/products" element={<ProductsPage />} />
      <Route path="/products/:id" element={<ProductPageDetail />} />
      <Route path= "/search" element={<SearchPage />} />
  

      {/* Routes protégées - Profil commun */}
      <Route element={<ProtectedRoute />}>
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/messages" element={<MessagesPage />} />
      </Route>

      {/* Routes protégées - Vendeur */}
      <Route element={<ProtectedRoute role="seller" />}>
        <Route path="/seller/dashboard" element={<DashboardPage />} />
        <Route path="/seller/orders" element={<SellerOrdersPage />} />
        <Route path="/seller/products" element={<MyProductsPage />} />
        <Route path="/seller/products/new" element={<AddProductPage />} />
        <Route path="/seller/products/:id/edit" element={<EditProductPage />} />
      </Route>
              {/* Routes seller */}
              <Route path="/seller/dashboard" element={<ProtectedRoute role="seller"><DashboardPage /></ProtectedRoute>} />
              <Route path="/seller/products" element={<ProtectedRoute role="seller"><MyProductsPage /></ProtectedRoute>} />
              <Route path="/seller/orders" element={<ProtectedRoute role="seller"><SellerOrdersPage /></ProtectedRoute>} />
              <Route path="/sellers/:id" element={<SellerProfilePage />} />

      {/* Routes protégées - Acheteur */}
      <Route element={<ProtectedRoute role="buyer" />}>
        <Route path="/cart" element={<CartPage />} />
        <Route path="/orders" element={<OrdersPage />} />
        <Route path="/favorites" element={<FavoritesPage />} />
      </Route>
      {/* Routes protégées - Admin */}
      <Route element= {<ProtectedRoute role = "admin"/>}>
      <Route path='/admin/dashboard' element= {<AdminDashboard />} />
      <Route path='/admin/users' element= {<UsersPage />} />
      <Route path='/admin/products' element= {<AdminProductsPage />} />
      <Route path='/admin/coupons' element= {<CouponsPage />} />
      <Route path='/admin/coupons/new' element= {<AddCouponPage />} />
      <Route path='/admin/coupons/:id/edit' element= {<EditCouponPage />} />

      </Route>
      {/* Route par défaut */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  )
}
