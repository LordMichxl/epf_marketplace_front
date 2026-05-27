import { useState } from 'react'
import './App.css'
import { Routes, Route } from 'react-router-dom'
import ProtectedRoute from './components/ProtectedRoute'
import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import ProfilePage from './pages/ProfilePage'

function App() {
  return (
    <Routes>
      {/* Routes publiques */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      {/* Routes protégées */}
      <Route element={<ProtectedRoute />}>
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/" element={<HomePage />} />
      </Route>
    </Routes>
  )
}

              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </div>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}