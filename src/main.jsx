import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { CartProvider } from './contexts/CartContext';
import './index.css'
import App from './App.jsx'
import Navbar from './components/layout/Navbar.jsx';

createRoot(document.getElementById('root')).render(
   <StrictMode>
  <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <Navbar />
          <App />
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>
)