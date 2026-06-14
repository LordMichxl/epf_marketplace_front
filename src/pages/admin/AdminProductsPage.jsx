import { useState, useEffect } from 'react'
import toast from 'react-hot-toast'
import {updateProductStatus,forceDeleteProduct} from '../../services/adminService'
import { getProducts } from '../../services/productService'

const STATUTS_ADMIN = [
  { value: 'published', label: 'Publié',    style: 'bg-emerald-100 text-emerald-700' },
  { value: 'draft',     label: 'Brouillon', style: 'bg-amber-100 text-amber-700' },
  { value: 'sold',      label: 'Vendu',     style: 'bg-slate-100 text-slate-500' },
  { value: 'inactive',  label: 'Inactif',   style: 'bg-red-100 text-red-500' },
]

export default function AdminProductsPage() {
  const [products, setProducts]     = useState([])
  const [loading, setLoading]       = useState(true)
  const [pagination, setPagination] = useState(null)
  const [page, setPage]             = useState(1)
  const [actionId, setActionId]     = useState(null)

  useEffect(() => {
    loadProducts()
  }, [page])

  const loadProducts = async () => {
    setLoading(true)
    try {
      const res = await getProducts({ page, per_page: 15 })
      setProducts(res.data.data || [])
      setPagination(res.data.pagination)
    } catch {
      toast.error('Impossible de charger les produits')
    } finally {
      setLoading(false)
    }
  }

  const handleUpdateStatus = async (productId, newStatus) => {
    setActionId(productId)
    try {
      const res = await updateProductStatus(productId, newStatus)
      toast.success(res.data.message)

      setProducts(prev => prev.map(p =>
        p.id === productId
          ? { ...p, status: res.data.product.status }
          : p
      ))
    } catch (err) {
      toast.error(err.response?.data?.message || 'Erreur')
    } finally {
      setActionId(null)
    }
  }

  const handleForceDelete = async (productId, productTitle) => {
    if (!confirm(
      `Supprimer définitivement "${productTitle}" ?\n\nCette action est irréversible.`
    )) return

    setActionId(productId)
    try {
      await forceDeleteProduct(productId)
      toast.success('Produit supprimé définitivement')
      setProducts(prev => prev.filter(p => p.id !== productId))
    } catch (err) {
      toast.error(err.response?.data?.message || 'Erreur lors de la suppression')
    } finally {
      setActionId(null)
    }
  }

  return (
    <div className="p-6">

      <div className="mb-6">
        <h1 className="text-xl font-semibold text-slate-900">
          Modération des produits
        </h1>
        {pagination && (
          <p className="text-sm text-slate-500 mt-0.5">
            {pagination.total} produit{pagination.total > 1 ? 's' : ''}
          </p>
        )}
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-screen">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
        </div>
      ) : (
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
          {products.map((product, index) => (
            <div
              key={product.id}
              className={`flex items-center gap-4 px-5 py-4
                ${index !== products.length - 1
                  ? 'border-b border-slate-100' : ''}`}
            >
              <img
                src={product.image || '/placeholder.jpg'}
                alt={product.title}
                className="w-12 h-12 object-cover rounded-lg
                           border border-slate-200 shrink-0"
              />

              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-slate-900 truncate">
                  {product.title}
                </p>
                <p className="text-xs text-slate-400">
                  {Number(product.price).toLocaleString('fr-FR')} FCFA
                  {product.seller && ` · par ${product.seller.name}`}
                </p>
              </div>

              <select
                value={product.status || 'published'}
                onChange={(e) => handleUpdateStatus(product.id, e.target.value)}
                disabled={actionId === product.id}
                className="border border-slate-200 rounded-lg px-2 py-1.5
                           text-xs bg-white focus:border-indigo-400
                           outline-none disabled:opacity-60 cursor-pointer"
              >
                {STATUTS_ADMIN.map(s => (
                  <option key={s.value} value={s.value}>
                    {s.label}
                  </option>
                ))}
              </select>

              <button
                onClick={() => handleForceDelete(product.id, product.title)}
                disabled={actionId === product.id}
                className="border border-red-200 text-red-500 hover:bg-red-50
                           disabled:opacity-60 text-xs font-medium px-3
                           py-1.5 rounded-lg transition whitespace-nowrap"
              >
                {actionId === product.id ? '...' : 'Suppr. définitif'}
              </button>
            </div>
          ))}
        </div>
      )}

      {pagination && pagination.last_page > 1 && (
        <div className="flex items-center justify-center gap-2 mt-6">
          <button
            onClick={() => setPage(p => p - 1)}
            disabled={page === 1}
            className="px-4 py-2 border border-slate-200 rounded-lg text-sm
                       text-slate-600 hover:bg-slate-50 disabled:opacity-40
                       disabled:cursor-not-allowed transition"
          >
            ← Précédent
          </button>
          <span className="text-sm text-slate-500">
            {pagination.current_page} / {pagination.last_page}
          </span>
          <button
            onClick={() => setPage(p => p + 1)}
            disabled={page === pagination.last_page}
            className="px-4 py-2 border border-slate-200 rounded-lg text-sm
                       text-slate-600 hover:bg-slate-50 disabled:opacity-40
                       disabled:cursor-not-allowed transition"
          >
            Suivant →
          </button>
        </div>
      )}
    </div>
  )
}