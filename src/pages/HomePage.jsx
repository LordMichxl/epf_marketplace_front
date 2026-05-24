import { useAuth } from '../contexts/AuthContext'

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
              <span className="text-sm text-gray-600">
                Bienvenue, <strong>{user?.name}</strong>
              </span>
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
          <p className="text-gray-600 mb-6">
            Vous êtes connecté en tant que <strong>{user?.role === 'seller' ? 'Vendeur' : 'Acheteur'}</strong>
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-indigo-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-indigo-900 mb-2">Votre profil</h3>
              <ul className="text-sm text-gray-700 space-y-2">
                <li><strong>Email:</strong> {user?.email}</li>
                <li><strong>Téléphone:</strong> {user?.phone || 'Non renseigné'}</li>
                <li><strong>Ville:</strong> {user?.city || 'Non renseignée'}</li>
                {user?.role === 'seller' && (
                  <li><strong>Rating:</strong> {user?.rating || 0}/5 ({user?.total_reviews || 0} avis)</li>
                )}
              </ul>
            </div>

            <div className="bg-green-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-green-900 mb-2">Actions rapides</h3>
              <ul className="text-sm text-gray-700 space-y-2">
                <li>
                  <a href="#" className="text-indigo-600 hover:text-indigo-500 font-medium">
                    Voir les produits
                  </a>
                </li>
                <li>
                  <a href="#" className="text-indigo-600 hover:text-indigo-500 font-medium">
                    Mon panier
                  </a>
                </li>
                <li>
                  <a href="#" className="text-indigo-600 hover:text-indigo-500 font-medium">
                    Mes commandes
                  </a>
                </li>
                {user?.role === 'seller' && (
                  <li>
                    <a href="#" className="text-indigo-600 hover:text-indigo-500 font-medium">
                      Dashboard vendeur
                    </a>
                  </li>
                )}
              </ul>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
