import { useState, useEffect } from 'react'
import { getAdminStats } from '../../services/adminService'
import toast from 'react-hot-toast'

const KPI_CONFIG = [
  {
    key: 'users_count',
    label: 'Utilisateurs',
    icon: '👥',
    color: 'bg-blue-50 text-blue-600',
    formatter: (v) => v.toLocaleString('fr-FR'),
  },
  {
    key: 'products_count',
    label: 'Produits',
    icon: '🏷️',
    color: 'bg-indigo-50 text-indigo-600',
    formatter: (v) => v.toLocaleString('fr-FR'),
  },
  {
    key: 'orders_count',
    label: 'Commandes',
    icon: '📦',
    color: 'bg-purple-50 text-purple-600',
    formatter: (v) => v.toLocaleString('fr-FR'),
  },
  {
    key: 'total_revenue',
    label: 'Revenus totaux',
    icon: '💰',
    color: 'bg-emerald-50 text-emerald-600',
    formatter: (v) => `${Number(v).toLocaleString('fr-FR')} F CFA`,
  },
]

export default function AdminDashboardPage() {
  const [stats, setStats]   = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getAdminStats()
      .then(res => setStats(res.data))
      .catch(() => toast.error('Impossible de charger les statistiques'))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-slate-900">
          Tableau de bord
        </h1>
        <p className="text-sm text-slate-500 mt-0.5">
          Vue globale de la plateforme
        </p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {KPI_CONFIG.map(kpi => (
          <div
            key={kpi.key}
            className="bg-white border border-slate-200 rounded-xl p-5"
          >
            <div className={`w-10 h-10 rounded-lg flex items-center
                             justify-center text-xl mb-3 ${kpi.color}`}>
              {kpi.icon}
            </div>

            {loading ? (
              <div className="flex justify-center items-center h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
            </div>
            ) : (
              <p className="text-2xl font-bold text-slate-900">
                {kpi.formatter(stats?.[kpi.key] ?? 0)}
              </p>
            )}

            <p className="text-xs text-slate-500 mt-0.5">{kpi.label}</p>
          </div>
        ))}
      </div>
    </div>
  )
}