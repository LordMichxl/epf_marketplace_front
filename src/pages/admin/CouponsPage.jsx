import { useState, useEffect} from 'react'
import { Link, useNavigate} from 'react-router-dom'
import toast from 'react-hot-toast'
import  { getAdminCoupons, deleteCoupon} from '../../services/adminService'

export default function CouponPage(){
  const navigate = useNavigate()
  const [ coupons, setCoupons] = useState([])
  const [loading, setLoading] = useState(true)
  const [pagination, setPagination] = useState(null)
  const [ page, setPage] = useState(1)
  const [ deletingId, setDeletingId] = useState(null)

  useEffect(() =>{
    loadCoupons()
  },[page])

  const loadCoupons = async () =>{
    setLoading(true)
    try {
      const res = await getAdminCoupons(page)
      setCoupons(res.data.data || [])
      setPagination(res.data.pagination)
    } catch (error) {
      toast.error('Impossible de charger les coupons')
    }finally{
      setLoading(false)
    }
  }
  const handleDelete = async(couponId, couponCode) => {
    if(!confirm(`Supprimer le coupon "${couponCode}"`)) return

    setDeletingId(couponId)
    try{
      await deleteCoupon(couponId)
      toast.success('Coupon supprimé')
      setCoupons(prev => prev.filter(c => c.id !== couponId))
    }catch(err){
      toast.error(err.response?.data?.message || 'Erreur')

    }finally {
      setDeletingId(null)
    }
  }

  return (
   <div className="p-6">

      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-semibold text-slate-900">Coupons</h1>
          {pagination && (
            <p className="text-sm text-slate-500 mt-0.5">
              {pagination.total} coupon{pagination.total > 1 ? 's' : ''}
            </p>
          )}
        </div>

        <Link
          to="/admin/coupons/new"
          className="bg-indigo-700 hover:bg-indigo-800 text-white text-sm
                     font-medium px-4 py-2.5 rounded-lg transition"
        >
          + Nouveau coupon
        </Link>
    </div>
     {loading ? (
        <div className="flex justify-center items-center h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
            </div>

      ) : coupons.length === 0 ? (
        <div className="text-center py-20 text-slate-400">
          <p className="text-4xl mb-3">🎟️</p>
          <p className="text-lg font-medium">Aucun coupon créé</p>
          <Link
            to="/admin/coupons/add"
            className="text-indigo-800 text-sm mt-2 inline-block
                       hover:underline"
          >
            Créer un coupon
          </Link>
        </div>
      ):(
        <div className="bg-white border border-slate-200 rounded-xl
                        overflow-hidden">
          {coupons.map((coupon, index) => (
            <div
              key={coupon.id}
              className={`flex items-center justify-between px-5 py-4
                ${index !== coupons.length - 1
                  ? 'border-b border-slate-100' : ''}`}
            >
              <div className="flex items-center gap-4">
                <span className="font-mono font-bold text-sm bg-slate-100
                                 text-slate-700 px-3 py-1 rounded-lg">
                  {coupon.code}
                </span>

                <div>
                  <p className="text-sm text-slate-800">
                    {coupon.type === 'percent'
                      ? `${coupon.value}% de réduction`
                      : `${Number(coupon.value).toLocaleString('fr-FR')} FCFA`
                    }
                    {coupon.min_order_total && (
                      <span className="text-slate-600">
                        {' '}· min {Number(coupon.min_order_total)
                          .toLocaleString('fr-FR')} FCFA
                      </span>
                    )}
                  </p>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {coupon.times_used || 0} utilisation(s)
                    {coupon.usage_limit && ` / ${coupon.usage_limit} max`}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className={`text-xs font-semibold px-2 py-0.5
                                  rounded-full
                  ${coupon.is_active
                    ? 'bg-emerald-100 text-emerald-700'
                    : 'bg-slate-100 text-slate-500'}`}>
                  {coupon.is_active ? 'Actif' : 'Inactif'}
                </span>

                <button
                  onClick={() => navigate(`/admin/coupons/${coupon.id}/edit`)}
                  className="border border-slate-200 text-slate-600
                             hover:bg-slate-50 text-xs font-medium px-3
                             py-1.5 rounded-lg transition"
                >
                  Modifier
                </button>

                <button
                  onClick={() => handleDelete(coupon.id, coupon.code)}
                  disabled={deletingId === coupon.id}
                  className="border border-red-200 text-red-500 hover:bg-red-50
                             disabled:opacity-60 text-xs font-medium px-3
                             py-1.5 rounded-lg transition"
                >
                  {deletingId === coupon.id ? '...' : 'Supprimer'}
                </button>
              </div>
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