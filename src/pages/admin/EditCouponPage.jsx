import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { getAdminCoupons, updateCoupon } from '../../services/adminService'

export default function EditCouponPage() {
  const { id } = useParams()
  const navigate    = useNavigate()
  const [loading, setLoading] = useState(true)

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitting }
  } = useForm()

  const typeValue = watch('type')

  useEffect(() => {
    getAdminCoupons()
      .then(res => {
        const coupons = res.data.data || []
        const coupon  = coupons.find(c => c.id === Number(id))

        if (!coupon) {
          toast.error('Coupon introuvable')
          navigate('/admin/coupons')
          return
        }

        reset({
          code: coupon.code,
          type: coupon.type,
          value: coupon.value,
          usage_limit: coupon.usage_limit || '',
          min_order_total: coupon.min_order_total || '',
          starts_at: coupon.starts_at? coupon.starts_at.slice(0, 10) : '',
          ends_at: coupon.ends_at? coupon.ends_at.slice(0, 10) : '',
          is_active: coupon.is_active,
        })
      })
      .catch(() => {
        toast.error('Impossible de charger le coupon')
        navigate('/admin/coupons')
      })
      .finally(() => setLoading(false))
  }, [id])

  const onSubmit = async (data) => {
    try {
      const payload = {
        code: data.code,
        type: data.type,
        value: data.value,
        usage_limit:  data.usage_limit || null,
        min_order_total: data.min_order_total || null,
        starts_at: data.starts_at || null,
        ends_at: data.ends_at || null,
        is_active: data.is_active,
      }

      const res = await updateCoupon(id, payload)
      toast.success(res.data.message)
      navigate('/admin/coupons')

    } catch (err) {
      const validationErrors = err.response?.data?.errors
      if (validationErrors) {
        const first = Object.values(validationErrors)[0][0]
        toast.error(first)
      } else {
        toast.error(err.response?.data?.message || 'Une erreur est survenue')
      }
    }
  }

  if (loading) {
    return (
       <div className="flex justify-center items-center h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
            </div>
    )
  }

  return (
    <div className="p-6 max-w-xl mx-auto">

      <div className="mb-6">
        <h1 className="text-xl font-semibold text-slate-900">
          Modifier le coupon
        </h1>
        <p className="text-sm text-slate-500 mt-0.5">
          Les champs laissés vides conservent leur valeur actuelle
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">

        <div className="bg-white border border-slate-200 rounded-xl p-5
                        space-y-4">
          <p className="text-xs font-semibold text-slate-400 uppercase
                        tracking-widest">
            Informations
          </p>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Code *
            </label>
            <input
              type="text"
              {...register('code', {
                required: 'Le code est obligatoire',
                maxLength: { value: 40, message: 'Maximum 40 caractères' }
              })}
              className="w-full border border-slate-200 rounded-lg px-3
                         py-2.5 text-sm uppercase font-mono
                         focus:border-indigo-400 focus:ring-2
                         focus:ring-indigo-100 outline-none transition"
            />
            {errors.code && (
              <p className="text-red-500 text-xs mt-1">{errors.code.message}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Type *
              </label>
              <select
                {...register('type', { required: true })}
                className="w-full border border-slate-200 rounded-lg px-3
                           py-2.5 text-sm focus:border-indigo-400 outline-none
                           bg-white"
              >
                <option value="percent">Pourcentage (%)</option>
                <option value="fixed">Montant fixe (FCFA)</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Valeur *
              </label>
              <input
                type="number"
                min="0"
                max={typeValue === 'percent' ? 100 : undefined}
                {...register('value', {
                  required: 'La valeur est obligatoire',
                  min: { value: 0, message: 'Valeur invalide' },
                  validate: val => {
                    if (typeValue === 'percent' && Number(val) > 100) {
                      return 'Maximum 100% pour un pourcentage'
                    }
                    return true
                  }
                })}
                className="w-full border border-slate-200 rounded-lg px-3
                           py-2.5 text-sm focus:border-indigo-400 outline-none"
              />
              {errors.value && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.value.message}
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Limite d'utilisation
              </label>
              <input
                type="number"
                min="1"
                {...register('usage_limit')}
                className="w-full border border-slate-200 rounded-lg px-3
                           py-2.5 text-sm focus:border-indigo-400 outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Commande min (FCFA)
              </label>
              <input
                type="number"
                min="0"
                {...register('min_order_total')}
                className="w-full border border-slate-200 rounded-lg px-3
                           py-2.5 text-sm focus:border-indigo-400 outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Date de début
              </label>
              <input
                type="date"
                {...register('starts_at')}
                className="w-full border border-slate-200 rounded-lg px-3
                           py-2.5 text-sm focus:border-indigo-400 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Date de fin
              </label>
              <input
                type="date"
                {...register('ends_at')}
                className="w-full border border-slate-200 rounded-lg px-3
                           py-2.5 text-sm focus:border-indigo-400 outline-none"
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="is_active"
              {...register('is_active')}
              className="w-4 h-4 accent-indigo-500"
            />
            <label
              htmlFor="is_active"
              className="text-sm font-medium text-slate-700 cursor-pointer"
            >
              Coupon actif
            </label>
          </div>
        </div>

        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => navigate('/admin/coupons')}
            className="flex-1 border border-slate-200 text-slate-600
                       hover:bg-slate-50 font-medium py-3 rounded-xl
                       transition text-sm"
          >
            Annuler
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex-1 bg-indigo-500 hover:bg-indigo-600
                       disabled:opacity-60 text-white font-semibold
                       py-3 rounded-xl transition text-sm"
          >
            {isSubmitting ? 'Enregistrement...' : 'Enregistrer'}
          </button>
        </div>

      </form>
    </div>
  )
}