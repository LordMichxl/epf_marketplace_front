import { useState } from 'react'
import './App.css'
import { Routes, Route } from 'react-router-dom'
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

function App() {
  return (
    <Routes>
      {/* Routes publiques */}
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/products" element={<ProductsPage />} />
      <Route path="/products/:id" element={<ProductPageDetail />} />
      <Route path= "/search" element={<SearchPage />} />
  

      {/* Routes protégées */}
      <Route element={<ProtectedRoute />}>
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/seller/orders" element={<SellerOrdersPage />} />
        <Route path="/seller/dashboard" element={<DashboardPage />} />
        <Route path="/seller/products" element={<MyProductsPage />} />
        <Route path ="/seller/products/new" element={<AddProductPage />} />
        <Route path ="/seller/products/:id/edit" element={<EditProductPage />} 
         <Route path="/cart" element={<CartPage />} />
         <Route path="/orders" element={<OrdersPage />} />
         <Route path="/favorites" element={<FavoritesPage />} />
         <Route path="/messages" element={<MessagesPage />} />
/>
         <Route path="*" element={<Navigate to="/" />} />
        
      </Route>
    </Routes>
  )
}

export default App
