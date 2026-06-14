import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { createCoupon } from '../../services/adminService'

export default function AddCouponPage() {
  const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting }
  } = useForm({
    defaultValues: {
      type: 'percent',
      is_active: true,
    }
  })

  const typeValue = watch('type') 

  const onSubmit = async (data) => {
    try {
      const payload = {
        code: data.code,
        type: data.type,
        value: data.value,
        usage_limit: data.usage_limit || null,
        min_order_total: data.min_order_total || null,
        starts_at: data.starts_at || null,
        ends_at: data.ends_at || null,
        is_active: data.is_active,
      }

      const res = await createCoupon(payload)
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

  return (
    <div className="p-6 max-w-xl mx-auto">

      <div className="mb-6">
        <h1 className="text-xl font-semibold text-slate-900">
          Nouveau coupon
        </h1>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">

        <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-4">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest">
            Informations
          </p>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Code *
            </label>
            <input
              type="text"
              placeholder="ex: EPF15"
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
                <option value="fixed">Montant fixe (F CFA)</option>
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
                placeholder={typeValue === 'percent' ? '20' : '5000'}
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
                placeholder="100"
                {...register('usage_limit')}
                className="w-full border border-slate-200 rounded-lg px-3
                           py-2.5 text-sm focus:border-indigo-400 outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Commande min (F CFA)
              </label>
              <input
                type="number"
                min="0"
                placeholder="10000"
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
              Coupon actif dès la création
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
            className="flex-1 bg-indigo-700 hover:bg-indigo-800
                       disabled:opacity-60 text-white font-semibold
                       py-3 rounded-xl transition text-sm"
          >
            {isSubmitting ? 'Création...' : 'Créer le coupon'}
          </button>
        </div>

      </form>
    </div>
  )
}