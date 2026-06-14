import { useState, useEffect } from 'react'
import { useParams, useNavigate} from 'react-router-dom'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import {
  getProduct,
  updateProduct,
  getCategories
} from '../../services/productService'

export default function EditProductPage() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [categories, setCategories]           = useState([])
  const [pageLoading, setPageLoading]         = useState(true)
  // Image principale
  const [mainFile, setMainFile]               = useState(null)
  const [mainPreview, setMainPreview]         = useState(null)
  const [existingImage, setExistingImage]     = useState(null)
  // Galerie
  const [galleryFiles, setGalleryFiles]       = useState([])
  const [galleryPreviews, setGalleryPreviews] = useState([])
  const [existingGallery, setExistingGallery] = useState([])

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm()

  const priceValue = watch('price')

  useEffect(() => {
    // Lancer les deux appels en parallèle
    Promise.all([
      getCategories(),
      getProduct(id)
    ])
      .then(([catRes, productRes]) => {
        // Catégories
        setCategories(catRes.data.data || catRes.data)

        // Données du produit
        const p = productRes.data

        // Pré-remplir tous les champs avec reset()
        reset({
          title:          p.title,
          description:    p.description,
          price:          p.price,
          quantity:       p.quantity,
          category_id:    p.category?.id ?? '',
          status:         p.status,
          sale_price:     p.sale_price     || '',
          sale_starts_at: p.sale_starts_at
            ? p.sale_starts_at.slice(0, 16) : '',
          sale_ends_at:   p.sale_ends_at
            ? p.sale_ends_at.slice(0, 16)   : '',
        })

        // Images déjà sur le serveur
        setExistingImage(p.image)
        setExistingGallery(p.images || [])
      })
      .catch(() => {
        toast.error('Impossible de charger le produit')
        navigate('/seller/products')
      })
      .finally(() => setPageLoading(false))
  }, [id])

  const handleMainImage = (e) => {
    const file = e.target.files[0]
    if (!file) return
    setMainFile(file)
    setMainPreview(URL.createObjectURL(file))
  }

  const handleGallery = (e) => {
    const files = Array.from(e.target.files)
    setGalleryFiles(files)
    setGalleryPreviews(files.map(f => URL.createObjectURL(f)))
  }

  const onSubmit = async (data) => {
    try {
      const formData = new FormData()

      formData.append('title', data.title)
      formData.append('description', data.description)
      formData.append('price', data.price)
      formData.append('quantity', data.quantity || 1)
      formData.append('category_id', data.category_id)
      formData.append('status', data.status)

      if (data.sale_price) {
        formData.append('sale_price', data.sale_price)
        formData.append('sale_starts_at', data.sale_starts_at || '')
        formData.append('sale_ends_at', data.sale_ends_at   || '')
      }

      if (mainFile) {
        formData.append('image', mainFile)
      }

      galleryFiles.forEach(file => {
        formData.append('images[]', file)
      })

      await updateProduct(id, formData)
      toast.success('Produit modifié avec succès !')
      navigate('/seller/products')

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

  if (pageLoading) {
    return (
      <div className="flex justify-center items-center h-40">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-500"></div>
        </div>
    )
  }

  return (
    <div className="p-6 max-w-2xl mx-auto">

      <div className="mb-6">
        <h1 className="text-xl font-semibold text-slate-900">
          Modifier le produit
        </h1>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">

        {/* ── Informations de base ── */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-4">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest">
            Informations
          </p>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Titre du produit *
            </label>
            <input
              type="text"
              {...register('title', {
                required: 'Le titre est obligatoire',
                maxLength: { value: 255, message: 'Maximum 255 caractères' }
              })}
              className="w-full border border-slate-200 rounded-lg px-3 py-2.5
                         text-sm focus:border-indigo-400 focus:ring-2
                         focus:ring-indigo-100 outline-none transition"
            />
            {errors.title && (
              <p className="text-red-500 text-xs mt-1">{errors.title.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Description *
            </label>
            <textarea
              rows={4}
              {...register('description', {
                required: 'La description est obligatoire'
              })}
              className="w-full border border-slate-200 rounded-lg px-3 py-2.5
                         text-sm focus:border-indigo-400 outline-none
                         transition resize-none"
            />
            {errors.description && (
              <p className="text-red-500 text-xs mt-1">
                {errors.description.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Catégorie *
            </label>
            <select
              {...register('category_id', {
                required: 'Choisis une catégorie'
              })}
              className="w-full border border-slate-200 rounded-lg px-3 py-2.5
                         text-sm focus:border-indigo-400 outline-none bg-white"
            >
              <option value="">-- Sélectionner --</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
            {errors.category_id && (
              <p className="text-red-500 text-xs mt-1">
                {errors.category_id.message}
              </p>
            )}
          </div>
        </div>

        {/* ── Prix, quantité, statut ── */}
        <div className="bg-white border border-slate-200 rounded-xl p-5">
          <p className="text-xs font-semibold text-slate-400 uppercase
                        tracking-widest mb-4">
            Prix & Stock
          </p>
          <div className="grid grid-cols-3 gap-3">

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Prix (F CFA) *
              </label>
              <input
                type="number"
                min="0"
                {...register('price', {
                  required: 'Le prix est obligatoire',
                  min: { value: 0, message: 'Prix invalide' }
                })}
                className="w-full border border-slate-200 rounded-lg px-3
                           py-2.5 text-sm focus:border-indigo-400 outline-none"
              />
              {errors.price && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.price.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Quantité
              </label>
              <input
                type="number"
                min="0"
                {...register('quantity')}
                className="w-full border border-slate-200 rounded-lg px-3
                           py-2.5 text-sm focus:border-indigo-400 outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Statut
              </label>
              {/* En édition, on ajoute 'sold' et 'inactive'
                  car le controller les accepte pour update */}
              <select
                {...register('status')}
                className="w-full border border-slate-200 rounded-lg px-3
                           py-2.5 text-sm focus:border-indigo-400 outline-none
                           bg-white"
              >
                <option value="draft">Brouillon</option>
                <option value="published">Publié</option>
                <option value="sold">Vendu</option>
                <option value="inactive">Inactif</option>
              </select>
            </div>
          </div>
        </div>

        {/* ── Promotion ── */}
        <div className="bg-white border border-slate-200 rounded-xl p-5">
          <p className="text-xs font-semibold text-slate-400 uppercase
                        tracking-widest mb-4">
            Promotion (optionnel)
          </p>
          <div className="grid grid-cols-3 gap-3">

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Prix promo (F CFA)
              </label>
              <input
                type="number"
                min="0"
                {...register('sale_price', {
                  validate: val => {
                    if (!val) return true
                    return Number(val) < Number(priceValue)
                      || 'Doit être inférieur au prix normal'
                  }
                })}
                className="w-full border border-slate-200 rounded-lg px-3
                           py-2.5 text-sm focus:border-indigo-400 outline-none"
              />
              {errors.sale_price && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.sale_price.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Début promo
              </label>
              <input
                type="datetime-local"
                {...register('sale_starts_at')}
                className="w-full border border-slate-200 rounded-lg px-3
                           py-2.5 text-sm focus:border-indigo-400 outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Fin promo
              </label>
              <input
                type="datetime-local"
                {...register('sale_ends_at')}
                className="w-full border border-slate-200 rounded-lg px-3
                           py-2.5 text-sm focus:border-indigo-400 outline-none"
              />
            </div>
          </div>
        </div>

        {/* ── Images ── */}
        <div className="bg-white border border-slate-200 rounded-xl p-5">
          <p className="text-xs font-semibold text-slate-400 uppercase
                        tracking-widest mb-4">
            Images
          </p>

          {/* Image principale */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Image principale
              <span className="text-slate-400 font-normal ml-1">
                (laisser vide pour garder l'actuelle)
              </span>
            </label>
            <div className="flex items-center gap-4">
              {/* Priorité : aperçu local > image serveur */}
              {(mainPreview || existingImage) && (
                <img
                  src={mainPreview || existingImage}
                  alt="Image actuelle"
                  className="w-24 h-24 object-cover rounded-lg border
                             border-slate-200"
                />
              )}
              <label
                htmlFor="main-image"
                className="cursor-pointer border border-slate-200 rounded-lg
                           px-4 py-2 text-sm text-slate-600 hover:bg-slate-50
                           transition"
              >
                Changer l'image
              </label>
              <input
                id="main-image"
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif"
                onChange={handleMainImage}
                className="hidden"
              />
            </div>
          </div>

          {/* Galerie */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Images supplémentaires
              <span className="text-slate-400 font-normal ml-1">
                (s'ajoutent aux images existantes)
              </span>
            </label>

            {/* Images existantes sur le serveur */}
            {existingGallery.length > 0 && (
              <div className="flex gap-2 flex-wrap mb-3">
                {existingGallery.map((url, i) => (
                  <img
                    key={i}
                    src={url}
                    alt=""
                    className="w-16 h-16 object-cover rounded-lg border
                               border-slate-200"
                  />
                ))}
                <p className="w-full text-xs text-slate-400">
                  {existingGallery.length} image(s) actuellement en ligne
                </p>
              </div>
            )}

            <label
              htmlFor="gallery-images"
              className="flex flex-col items-center justify-center border-2
                         border-dashed border-slate-200 rounded-xl h-24
                         cursor-pointer hover:border-indigo-300 transition"
            >
              <span className="text-xl mb-1">📎</span>
              <span className="text-xs text-slate-500">
                Ajouter de nouvelles images
              </span>
            </label>
            <input
              id="gallery-images"
              type="file"
              accept="image/*"
              multiple
              onChange={handleGallery}
              className="hidden"
            />

            {galleryPreviews.length > 0 && (
              <div className="flex gap-2 mt-3 flex-wrap">
                {galleryPreviews.map((url, i) => (
                  <img
                    key={i}
                    src={url}
                    alt=""
                    className="w-16 h-16 object-cover rounded-lg
                               border border-indigo-200"
                  />
                ))}
                <p className="w-full text-xs text-slate-400 mt-1">
                  {galleryPreviews.length} nouvelle(s) image(s) à ajouter
                </p>
              </div>
            )}
          </div>
        </div>

        {/* ── Boutons ── */}
        <div className="flex gap-3 pb-6">
          <button
            type="button"
            onClick={() => navigate('/seller/products')}
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
            {isSubmitting ? 'Enregistrement...' : 'Enregistrer les modifications'}
          </button>
        </div>

      </form>
    </div>
  )
}