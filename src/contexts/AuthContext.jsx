import { createContext, useContext, useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import authService from '../services/authService'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser]       = useState(null)
  const [loading, setLoading] = useState(true) 
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
    toast.success(`Bienvenue, ${data.user.name} !`)
    if (data.user.role === 'seller') navigate('/seller/dashboard')
    else navigate('/')
  }

  // --- Connexion ---
  const login = async (formData) => {
    const data = await authService.login(formData)
    localStorage.setItem('token', data.token)
    setUser(data.user)
    toast.success(`Content de te revoir, ${data.user.name} !`)

    if (data.user.role === 'admin')  navigate('/admin')
    else if (data.user.role === 'seller') navigate('/seller/dashboard')
    else navigate('/')
  }

  // --- Déconnexion ---
  const logout =  () => {
    authService.logout()  
    localStorage.removeItem('token')
    setUser(null)
    toast('À bientôt !')
    navigate('/login')
  }

  // --- Mise à jour du profil ---
  const updateUser = (newData) => {
    setUser(prev => ({ ...prev, ...newData }))
  }

  const value = { user, loading, register, login, logout, updateUser }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth doit être utilisé dans AuthProvider')
  return context
}