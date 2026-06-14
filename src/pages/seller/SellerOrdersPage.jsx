import { useState, useEffect } from 'react'
import toast from 'react-hot-toast'
import { getSellerOrders, updateOrderStatus } from '../../services/orderService'

const STATUTS = {
  pending: {
    label: 'En attente',
    badge: 'bg-amber-100 text-amber-700',
  },
  confirmed: {
    label: 'Confirmée',
    badge: 'bg-blue-100 text-blue-700',
    
  },
  shipped: {
    label: 'Expédiée',
    badge: 'bg-purple-100 text-purple-700',
  },
  delivered: {
    label: 'Livrée',
    badge: 'bg-emerald-100 text-emerald-700',
    
  },
  cancelled: {
    label: 'Annulée',
    badge: 'bg-red-100 text-red-500',
  },
}

const FILTRES = [
  { value: '',          label: 'Toutes' },
  { value: 'pending',   label: 'En attente' },
  { value: 'confirmed', label: 'Confirmées' },
  { value: 'shipped',   label: 'Expédiées' },
  { value: 'delivered', label: 'Livrées' },
]

export default function SellerOrdersPage() {
  const [orders, setOrders]         = useState([])
  const [loading, setLoading]       = useState(true)
  const [statusFilter, setStatusFilter] = useState('')
  const [pagination, setPagination] = useState(null)
  const [page, setPage]             = useState(1)
  const [updatingId, setUpdatingId] = useState(null)

  useEffect(() => {
    loadOrders()
  }, [statusFilter, page])

  const loadOrders = async () => {
    setLoading(true)
    try {
      const res = await getSellerOrders(statusFilter, page)
      setOrders(res.data.data || [])
      setPagination(res.data.pagination)
    } catch {
      toast.error('Impossible de charger les commandes')
    } finally {
      setLoading(false)
    }
  }

  const changerFiltre = (newStatut) => {
    setStatusFilter(newStatut)
    setPage(1)
  }

  const changerStatut = async (orderId, newStatus) => {
    setUpdatingId(orderId)
    try {
      const res = await updateOrderStatus(orderId, newStatus)
      toast.success(res.data.message || 'Statut mis à jour')
      setOrders(prev =>
        prev.map(order =>
          order.id === orderId
            ? { ...order, status: newStatus }
            : order
        )
      )
    } catch (err) {
      const message = err.response?.data?.message
      toast.error(message || 'Impossible de mettre à jour le statut')
    } finally {
      setUpdatingId(null)
    }
  }

  return (
    <div className="p-6">

      <div className="mb-6">
        <h1 className="text-xl font-semibold text-slate-900">
          Commandes reçues
        </h1>
        {pagination && (
          <p className="text-sm text-slate-500 mt-0.5">
            {pagination.total} commande{pagination.total > 1 ? 's' : ''} au total
          </p>
        )}
      </div>

      <div className="flex gap-2 mb-6 bg-slate-100 p-1 rounded-xl w-fit
                      overflow-x-auto">
        {FILTRES.map(f => (
          <button
            key={f.value}
            onClick={() => changerFiltre(f.value)}
            className={`px-4 py-1.5 rounded-lg text-sm font-medium
                        transition whitespace-nowrap
              ${statusFilter === f.value
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-500 hover:text-slate-700'
              }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-40">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-500"></div>
        </div>

      ) : orders.length === 0 ? (
        <div className="text-center py-20 text-slate-400">
          <p className="text-4xl mb-3">📦</p>
          <p className="text-lg font-medium">Aucune commande</p>
          <p className="text-sm mt-1">
            {statusFilter
              ? `Aucune commande avec le statut "${STATUTS[statusFilter]?.label}"`
              : 'Vous n\'avez pas encore reçu de commande'}
          </p>
        </div>

      ) : (
        <div className="space-y-4">
          {orders.map(order => (
            <CarteCommande
              key={order.id}
              order={order}
              isUpdating={updatingId === order.id}
              onChangerStatut={changerStatut}
            />
          ))}
        </div>
      )}

      {pagination && pagination.last_page > 1 && (
        <div className="flex items-center justify-center gap-2 mt-8">
          <button
            onClick={() => setPage(p => p - 1)}
            disabled={page === 1}
            className="px-4 py-2 border border-slate-200 rounded-lg text-sm
                       text-slate-600 hover:bg-slate-50 disabled:opacity-40
                       disabled:cursor-not-allowed transition"
          >
            ← Précédent
          </button>

          <span className="text-sm text-slate-500 px-3">
            Page {pagination.current_page} / {pagination.last_page}
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


function CarteCommande({ order, isUpdating, onChangerStatut }) {
  const config = STATUTS[order.status] || STATUTS.pending

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5">

      <div className="flex items-start justify-between mb-4">
        <div>
          <p className="font-semibold text-slate-900 text-sm">
            {order.order_number}
          </p>
          <p className="text-xs text-slate-400 mt-0.5">
            {new Date(order.created_at).toLocaleDateString('fr-FR', {
              day: '2-digit',
              month: 'long',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            })}
          </p>
        </div>

        <select
          value={order.status}
          onChange={(e) => onChangerStatut(order.id, e.target.value)}
          disabled={isUpdating}
          className={`text-xs font-semibold px-3 py-1 rounded-lg border-none
                       cursor-pointer transition
                       ${isUpdating ? 'opacity-60 cursor-not-allowed' : ''}
                       ${config.badge}`}
        >
          <option value="pending">En attente</option>
          <option value="confirmed">Confirmée</option>
          <option value="shipped">Expédiée</option>
          <option value="delivered">Livrée</option>
          <option value="cancelled">Annulée</option>
        </select>
      </div>

      {order.buyer && (
        <div className="flex items-center gap-2 mb-4 bg-slate-50 rounded-lg
                        px-3 py-2">
          <div className="w-7 h-7 rounded-full bg-indigo-100 flex items-center
                          justify-center text-xs font-bold text-indigo-800">
            {/* Initiale du nom de l'acheteur */}
            {order.buyer.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="text-sm font-medium text-slate-700">
              {order.buyer.name}
            </p>
            {order.buyer.phone && (
              <p className="text-xs text-slate-400">{order.buyer.phone}</p>
            )}
          </div>
        </div>
      )}

      <div className="space-y-2 mb-4">
        {order.items.map((item, i) => (
          <div key={i}
               className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <span className={`w-2 h-2 rounded-full
                ${item.status === 'delivered' ? 'bg-emerald-400'
                  : item.status === 'shipped'  ? 'bg-purple-400'
                  : item.status === 'confirmed'? 'bg-blue-400'
                  : item.status === 'cancelled'? 'bg-red-400'
                  : 'bg-amber-400'}`}
              />
              <span className="text-slate-700">
                {item.product?.title || 'Produit supprimé'}
              </span>
            </div>
            <span className="text-slate-500 text-xs">
              × {item.quantity}
            </span>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between pt-3
                      border-t border-slate-100">
        <div>
          <p className="text-xs text-slate-400">Total vendeur</p>
          <p className="font-semibold text-slate-900">
            {Number(order.total_amount).toLocaleString('fr-FR')} F CFA
          </p>
        </div>
        
      </div>
    </div>
  )
}