import { useState } from 'react'
import { useForm } from 'react-hook-form'

export default function ProductForm({ 
  initialData = null, 
  onSubmit, 
  onCancel, 
  isSubmitting = false 
}) {
  const [previewImage, setPreviewImage] = useState(
    initialData?.imageUrl || null
  )

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: initialData?.name || '',
      description: initialData?.description || '',
      price: initialData?.price || '',
      quantity: initialData?.quantity || '',
      category: initialData?.category || '',
      status: initialData?.status || 'draft',
      image: null,
      flashPromoPrice: initialData?.flashPromoPrice || null,
      flashPromoEndDate: initialData?.flashPromoEndDate || null,
    },
  })

  const imageFile = watch('image')

  const handleImageChange = (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onloadend = () => {
      setPreviewImage(reader.result)
    }
    reader.readAsDataURL(file)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Nom */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Nom du produit *
          </label>
          <input
            type="text"
            {...register('name', { 
              required: 'Le nom est requis',
              minLength: { value: 3, message: 'Au moins 3 caractères' }
            })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            placeholder="Ex: iPhone 13 Pro"
          />
          {errors.name && <span className="text-red-500 text-sm">{errors.name.message}</span>}
        </div>

        {/* Prix */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Prix (€) *
          </label>
          <input
            type="number"
            step="0.01"
            {...register('price', { 
              required: 'Le prix est requis',
              min: { value: 0.01, message: 'Le prix doit être positif' }
            })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            placeholder="0.00"
          />
          {errors.price && <span className="text-red-500 text-sm">{errors.price.message}</span>}
        </div>

        {/* Quantité */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Quantité en stock *
          </label>
          <input
            type="number"
            {...register('quantity', { 
              required: 'La quantité est requise',
              min: { value: 0, message: 'La quantité doit être positive' }
            })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            placeholder="0"
          />
          {errors.quantity && <span className="text-red-500 text-sm">{errors.quantity.message}</span>}
        </div>

        {/* Catégorie */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Catégorie *
          </label>
          <select
            {...register('category', { required: 'La catégorie est requise' })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
          >
            <option value="">Sélectionner une catégorie</option>
            <option value="electronics">Électronique</option>
            <option value="clothing">Vêtements</option>
            <option value="books">Livres</option>
            <option value="home">Maison & Jardin</option>
            <option value="sports">Sports & Loisirs</option>
            <option value="other">Autre</option>
          </select>
          {errors.category && <span className="text-red-500 text-sm">{errors.category.message}</span>}
        </div>

        {/* Statut */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Statut *
          </label>
          <select
            {...register('status')}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
          >
            <option value="draft">Brouillon</option>
            <option value="published">Publié</option>
            <option value="sold">Vendu</option>
          </select>
        </div>
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Description *
        </label>
        <textarea
          {...register('description', { 
            required: 'La description est requise',
            minLength: { value: 10, message: 'Au moins 10 caractères' }
          })}
          rows="4"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
          placeholder="Décrivez votre produit..."
        />
        {errors.description && <span className="text-red-500 text-sm">{errors.description.message}</span>}
      </div>

      {/* Image */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Image du produit {!initialData && '*'}
        </label>
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            {...register('image', { required: !initialData && 'Une image est requise' })}
            className="w-full"
          />
          {previewImage && (
            <div className="mt-4">
              <img 
                src={previewImage} 
                alt="Preview" 
                className="w-full h-40 object-cover rounded-lg"
              />
              <p className="text-sm text-gray-500 mt-2">Aperçu de l'image</p>
            </div>
          )}
        </div>
        {errors.image && <span className="text-red-500 text-sm">{errors.image.message}</span>}
      </div>

      {/* Promo Flash */}
      <div className="bg-gradient-to-r from-yellow-50 to-orange-50 p-6 rounded-lg border border-yellow-200">
        <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <span className="text-2xl">⚡</span> Promo Flash (optionnelle)
        </h3>
        <p className="text-sm text-gray-600 mb-4">
          Réduisez temporairement le prix pour attirer plus d'acheteurs
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Prix réduit (€)
            </label>
            <input
              type="number"
              step="0.01"
              {...register('flashPromoPrice')}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
              placeholder="Laissez vide si pas de promo"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Fin de la promo
            </label>
            <input
              type="datetime-local"
              {...register('flashPromoEndDate')}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
            />
          </div>
        </div>
      </div>

      {/* Boutons */}
      <div className="flex gap-3 pt-4 border-t">
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex-1 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 disabled:from-gray-400 disabled:to-gray-400 text-white font-semibold px-6 py-3 rounded-lg transition"
        >
          {isSubmitting ? '⏳ Traitement en cours...' : initialData ? '💾 Mettre à jour' : '➕ Créer le produit'}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold px-6 py-3 rounded-lg transition"
        >
          Annuler
        </button>
      </div>
    </form>
  )
}
