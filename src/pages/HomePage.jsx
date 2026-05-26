import { useAuth } from '../contexts/AuthContext'
import toast from 'react-hot-toast'
import { NavLink } from 'react-router-dom'

export default function HomePage() {
  const { user, logout } = useAuth()

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-white">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-semibold text-slate-900">
                EPF <span className="text-indigo-500">Market</span>
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <NavLink 
                to="/profile" 
                className="text-sm font-medium text-gray-700 hover:text-indigo-600 transition-colors"
              >
                Profil
              </NavLink>
              <button
                onClick={logout}
                className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-500 transition-colors"
              >
                Déconnexion
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-lg shadow-md p-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Bienvenue sur EPF Market!
          </h2>
        </div>
      </main>
    </div>
  )
}
