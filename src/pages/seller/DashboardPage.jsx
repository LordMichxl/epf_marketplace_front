import {useState, useEffect} from 'react'
import toast from 'react-hot-toast'
import {getDashboard, getDashboardStats} from '../../services/dashboardService'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'


export default function DashboardPage() {
  const [dashboard, setDashboard] = useState(null)
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [period, setPeriod] = useState('month')

  useEffect(()=> {
    loadData()
  },[period])

  const loadData = async ()=> {
    setLoading(true)
    try{
      setDashboard(await getDashboard())
      setStats(await getDashboardStats(period))
    }catch(err){
      toast.error('Impossible de charger le tableau de bord')
    }finally{
      setLoading(false)
    }
  }
  
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
      </div>
    )
  }

  if (!dashboard || !stats) {
    return (
      <div className="p-6 bg-red-50 rounded-lg border border-red-200">
        <p className="text-red-700">Une erreur est survenue</p>
      </div>
    )
  }
  return(
    <div className="p-6 bg-slate-50 min-h-screen">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Dashboard Vendeur</h1>
        
        <select 
          value={period} 
          onChange={(e) => setPeriod(e.target.value)}
          className="px-4 py-2 border border-slate-200 rounded-lg text-sm 
                     bg-white text-slate-700 cursor-pointer hover:border-slate-300"
        >
          <option value="week">Cette semaine</option>
          <option value="month">Ce mois</option>
          <option value="year">Cette année</option>
        </select>
      </div>
      
      <CarteStatistiques dashboard={dashboard} />
      
      <CartesAnalytiques stats={stats} />
      
      <CommandesRecentes orders={dashboard.recent_orders} />
      
      <MeilleursProduits products={dashboard.top_products} />
      
      <VentesParPeriode sales={dashboard.monthly_sales} period={period} />
    </div>
  )
}

function CarteStatistiques({ dashboard }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      
      <div className="bg-white rounded-lg shadow p-6 border-l-4 border-indigo-500">
        <p className="text-slate-500 text-sm font-medium">Ventes totales</p>
        <p className="text-3xl font-bold text-slate-900 mt-2">
          {Number(dashboard.total_sales).toLocaleString('fr-FR')} F CFA
        </p>
      </div>

      <div className="bg-white rounded-lg shadow p-6 border-l-4 border-blue-500">
        <p className="text-slate-500 text-sm font-medium">Commandes</p>
        <p className="text-3xl font-bold text-slate-900 mt-2">
          {dashboard.total_orders ?? 0}
        </p>
        <p className="text-xs text-amber-600 mt-2">
          {dashboard.pending_orders ?? 0} en attente
        </p>
      </div>

      <div className="bg-white rounded-lg shadow p-6 border-l-4 border-emerald-500">
        <p className="text-slate-500 text-sm font-medium">Produits publiés</p>
        <p className="text-3xl font-bold text-slate-900 mt-2">
          {dashboard.active_products ?? 0}/{dashboard.total_products ?? 0}
        </p>
      </div>

      <div className="bg-white rounded-lg shadow p-6 border-l-4 border-yellow-500">
        <p className="text-slate-500 text-sm font-medium">Note moyenne</p>
        <p className="text-3xl font-bold text-slate-900 mt-2">
          ⭐ {Number(dashboard.average_rating ?? 0).toFixed(1)}/5
        </p>
      </div>

    </div>
  )
}

function CartesAnalytiques({ stats }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      
      <div className="bg-white rounded-lg shadow p-6 border-l-4 border-cyan-500">
        <p className="text-slate-500 text-sm font-medium">Vues</p>
        <p className="text-3xl font-bold text-slate-900 mt-2">
          {Number(stats.total_views).toLocaleString('fr-FR')}
        </p>
        <p className="text-xs text-slate-400 mt-2">
          {Number(stats.total_clicks).toLocaleString('fr-FR')} clics
        </p>
      </div>

      <div className="bg-white rounded-lg shadow p-6 border-l-4 border-rose-500">
        <p className="text-slate-500 text-sm font-medium">Taux conversion</p>
        <p className="text-3xl font-bold text-slate-900 mt-2">
          {Number(stats.conversion_rate ?? 0).toFixed(1)}%
        </p>
      </div>

      <div className="bg-white rounded-lg shadow p-6 border-l-4 border-orange-500">
        <p className="text-slate-500 text-sm font-medium">Panier moyen</p>
        <p className="text-3xl font-bold text-slate-900 mt-2">
          {Number(stats.average_order_value).toLocaleString('fr-FR')} F CFA
        </p>
      </div>

      <div className="bg-white rounded-lg shadow p-6 border-l-4 border-teal-500">
        <p className="text-slate-500 text-sm font-medium">Satisfaction</p>
        <p className="text-3xl font-bold text-slate-900 mt-2">
          {Number(stats.customer_satisfaction ?? 0).toFixed(1)}/5
        </p>
        <p className="text-xs text-slate-400 mt-2">
          {Number(stats.growth_rate ?? 0) > 0 ? '📈' : '📉'} {Math.abs(Number(stats.growth_rate ?? 0)).toFixed(1)}%
        </p>
      </div>

    </div>
  )
}

function CommandesRecentes({ orders }) {
  return (
    <div className="bg-white rounded-lg shadow mb-8">
      <div className="p-6 border-b border-slate-200">
        <h2 className="text-lg font-semibold text-slate-900">Commandes récentes</h2>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200">
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">
                Numéro
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">
                Montant
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">
                Statut
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">
                Date
              </th>
            </tr>
          </thead>
          <tbody>
            {orders.map(order => (
              <tr key={order.order_number} className="border-b border-slate-100 hover:bg-slate-50">
                <td className="px-6 py-4 text-sm font-medium text-indigo-800">
                  {order.order_number}
                </td>
                <td className="px-6 py-4 text-sm text-slate-700">
                  {Number(order.total).toLocaleString('fr-FR')} F CFA
                </td>
                <td className="px-6 py-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium
                    ${order.status === 'delivered' ? 'bg-emerald-100 text-emerald-700' :
                      order.status === 'shipped' ? 'bg-purple-100 text-purple-700' :
                      order.status === 'confirmed' ? 'bg-blue-100 text-blue-700' :
                      'bg-amber-100 text-amber-700'}`}>
                    {order.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-slate-500">
                  {new Date(order.created_at).toLocaleDateString('fr-FR')}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
function MeilleursProduits({ products }) {
  return (
    <div className="bg-white rounded-lg shadow mb-8">
      <div className="p-6 border-b border-slate-200">
        <h2 className="text-lg font-semibold text-slate-900">🏆 Meilleurs produits</h2>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200">
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">
                Produit
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">
                Ventes
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">
                Chiffre d'affaires
              </th>
            </tr>
          </thead>
          <tbody>
            {products.map((product, i) => (
              <tr key={i} className="border-b border-slate-100 hover:bg-slate-50">
                <td className="px-6 py-4 text-sm font-medium text-slate-900">
                  {product.title}
                </td>
                <td className="px-6 py-4 text-sm text-slate-700">
                  {product.sales_count}
                </td>
                <td className="px-6 py-4 text-sm font-semibold text-emerald-600">
                  {Number(product.revenue).toLocaleString('fr-FR')} F CFA
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}


function getFilteredSalesData(sales, period) {
  if (!sales || sales.length === 0) return []
  
  switch(period) {
    case 'week':
      return sales.slice(-1)
    case 'month':
      return sales.slice(-3)
    case 'year':
      return sales.slice(-12)
    default:
      return sales
  }
}

function getPeriodLabel(period) {
  switch(period) {
    case 'week':
      return 'Ventes cette semaine'
    case 'month':
      return 'Ventes ce mois (derniers 3 mois)'
    case 'year':
      return 'Ventes cette année (12 derniers mois)'
    default:
      return 'Ventes'
  }
}

function VentesParPeriode({ sales, period }) {
  const filteredData = getFilteredSalesData(sales, period)
  
  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-6 border-b border-slate-200">
        <h2 className="text-lg font-semibold text-slate-900">
           {getPeriodLabel(period)}
        </h2>
      </div>
      
      <div className="p-6">
        {filteredData.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={filteredData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip 
                formatter={(value) => `${Number(value).toLocaleString('fr-FR')} F CFA`}
              />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="amount" 
                stroke="#6366f1" 
                strokeWidth={2}
                dot={{ fill: '#6366f1', r: 5 }}
                activeDot={{ r: 7 }}
              />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <div className="text-center py-12 text-slate-400">
            <p className="text-lg">Pas de données disponibles</p>
          </div>
        )}
      </div>
    </div>
  )
}

