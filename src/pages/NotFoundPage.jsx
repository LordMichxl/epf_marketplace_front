export default function NotFoundPage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-gray-900 mb-4">403</h1>
        <p className="text-xl text-gray-600 mb-8">Accès non autorisé</p>
        <p className="text-gray-500 mb-6">Vous n'avez pas les permissions pour accéder à cette page.</p>
        <a href="/" className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg">
          Retour à l'accueil
        </a>
      </div>
    </div>
  )
}
