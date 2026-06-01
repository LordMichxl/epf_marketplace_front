import { useState, useEffect } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import productService from '../../services/productService'

const STATUTS = [
  { value: '',          label: 'Tous' },
  { value: 'published', label: 'Publiés' },
  { value: 'draft',     label: 'Brouillons' },
  { value: 'sold',      label: 'Vendus' },
]

export default function MyProductsPage() {
  const navigate = useNavigate()
  const [products, setProducts]   = useState([])
  const [status, setStatus]       = useState('')
  const [loading, setLoading]     = useState(true)

  useEffect(() => {
    loadProducts()
  }, [status]) 

  const loadProducts = async () => {
    setLoading(true)
    try {
      const data = await productService.getMyProducts(status)
      setProducts(data)
    } catch {
      toast.error('Impossible de charger les produits')
    } finally {
      setLoading(false)
    }
  }

  const supprimerProduit = async (id) => {
    if (!confirm('Supprimer ce produit définitivement ?')) return

    try {
      await productService.delete(id)
      toast.success('Produit supprimé')
      setProducts(prev => prev.filter(p => p.id !== id))
    } catch {
      toast.error('Erreur lors de la suppression')
    }
  }

  return (
    <div className="p-6">

      {/* ── En-tête ── */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-semibold text-slate-900">Mes produits</h1>
          <p className="text-sm text-slate-500 mt-0.5">
            {products.length} produit{products.length > 1 ? 's' : ''}
          </p>
        </div>
        {/* Bouton vers le formulaire d'ajout */}
        <NavLink
          to="/seller/products/new"
          className="bg-indigo-500 hover:bg-indigo-600 text-white text-sm
                     font-medium px-4 py-2.5 rounded-lg transition flex
                     items-center gap-2"
        >
          + Nouveau produit
        </NavLink>
      </div>

      {/* ── Onglets de filtre ── */}
      <div className="flex gap-2 mb-6 bg-slate-100 p-1 rounded-xl w-fit">
        {STATUTS.map(s => (
          <button
            key={s.value}
            onClick={() => setStatus(s.value)}
            className={`px-4 py-1.5 rounded-lg text-sm font-medium transition
              ${status === s.value
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-500 hover:text-slate-700'
              }`}
          >
            {s.label}
          </button>
        ))}
      </div>

      {/* ── Contenu ── */}
      {loading ? (
        <div className="flex justify-center items-center h-40">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-500"></div>
        </div>

      ) : products.length === 0 ? (
        <div className="text-center py-20 text-slate-400">
          <p className="text-lg font-medium">Aucun produit</p>
          <p className="text-sm mt-1">Commence par en ajouter un !</p>
        </div>

      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {products.map(product => (
            <CarteProduitsVendeur
              key={product.id}
              product={product}
              onEdit={() => navigate(`/seller/products/${product.id}/edit`)}
              onDelete={() => supprimerProduit(product.id)}
            />
          ))}
        </div>
      )}
    </div>
  )
}


// ── Composant carte produit (vendeur) ──
function CarteProduitsVendeur({ product, onEdit, onDelete }) {

  // Couleurs selon le statut
  const badgeStyle = {
    published: 'bg-emerald-100 text-emerald-700',
    draft:     'bg-amber-100 text-amber-700',
    sold:      'bg-slate-100 text-slate-500',
  }

  return (
    <div className="bg-white border border-slate-200 rounded-xl overflow-hidden
                    hover:shadow-md transition-shadow">

      {/* Image du produit */}
      <div className="relative h-44 bg-slate-100">
        {product.images?.[0] ? (
          <img
            src={product.images[0].url}
            alt={product.name}
            className="w-full h-full object-cover"
          />
        ) : (
          // Placeholder si pas d'image
          <div className="w-full h-full flex items-center justify-center
                          text-slate-300 text-4xl">
            📦
          </div>
        )}

        {/* Badge statut en haut à droite */}
        <span className={`absolute top-2 right-2 text-xs font-semibold
                          px-2 py-0.5 rounded-full ${badgeStyle[product.status]}`}>
          {product.status === 'published' ? 'Publié'
           : product.status === 'draft'   ? 'Brouillon'
           : 'Vendu'}
        </span>
      </div>

      <div className="p-3">
        {/* Nom */}
        <h3 className="font-medium text-slate-900 text-sm truncate mb-1">
          {product.name}
        </h3>

        {/* Prix et stock */}
        <div className="flex items-center justify-between mb-3">
          <span className="font-semibold text-slate-900">
            {Number(product.price).toLocaleString('fr-FR')} XOF
          </span>
          <span className="text-xs text-slate-400">
            Stock : {product.stock}
          </span>
        </div>

        {/* Boutons modifier / supprimer */}
        <div className="flex gap-2">
          <button
            onClick={onEdit}
            className="flex-1 border border-slate-200 text-slate-600
                       hover:bg-slate-50 text-xs font-medium py-1.5
                       rounded-lg transition"
          >
            Modifier
          </button>
          <button
            onClick={onDelete}
            className="flex-1 border border-red-100 text-red-500
                       hover:bg-red-50 text-xs font-medium py-1.5
                       rounded-lg transition"
          >
            Supprimer
          </button>
        </div>
      </div>
    </div>
  )
}