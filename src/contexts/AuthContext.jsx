import { createContext, useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import authService from '../services/authService'
import api from "../services/api";

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
    const navigate = useNavigate()


  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      authService.me()
        .then(data => setUser(data))
        .catch(() => {
          localStorage.removeItem('token')
        })
        .finally(() => setLoading(false))
    } else {
      setLoading(false)
    }
  }, [])

 // --- Inscription ---
  const register = async (formData) => {
    const data = await authService.register(formData)
    localStorage.setItem('token', data.token)
    setUser(data.user)
    toast.success(data.message)
    if (data.user.role === 'seller') navigate('/seller/dashboard')
    else navigate('/')
  }


    // --- Connexion ---
  const login = async (formData) => {
    const data = await authService.login(formData)
    localStorage.setItem('token', data.token)
    setUser(data.user)
    toast.success(data.message)

    if (data.user.role === 'admin')  navigate('/admin')
    else if (data.user.role === 'seller') navigate('/seller/dashboard')
    else navigate('/')
  }

    // --- Déconnexion ---
  const logout = async () => {
    try {
      await authService.logout()
    } catch (err) {
      console.error('Erreur lors de la déconnexion', err)
    }
    localStorage.removeItem('token')
    setUser(null)
    toast.success('Déconnexion réussie.')
    navigate('/login')
  }

   // --- Mise à jour du profil ---
  const updateProfile = async (formData) => {
    const data = await authService.updateProfile(formData)
    setUser(data.user)
    toast.success(data.message)
    return data
  }



  const value = { user, loading, register, login, logout, updateProfile }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}