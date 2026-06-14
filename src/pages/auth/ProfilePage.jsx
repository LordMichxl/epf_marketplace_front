import { useState, useEffect } from 'react'
import { useAuth } from '../../hooks/useAuth'
import { useForm } from 'react-hook-form'
import { Link } from 'react-router-dom'
import toast from 'react-hot-toast'

export default function ProfilePage() {
  const { user, updateProfile } = useAuth()
  const [previewImage, setPreviewImage] = useState(null)
  const [selectedFile, setSelectedFile] = useState(null)
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      name:  '',
      bio:   '',
      phone: '',
      city:  '',
    }
  })

  useEffect(() => {
    if (user) {
      reset({
        name:  user.name || '',
        bio:   user.bio || '',
        phone: user.phone || '',
        city:  user.city || '',
      })
    }
  }, [user, reset])


  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (!file) return
    setSelectedFile(file)
    const localUrl = URL.createObjectURL(file)
    setPreviewImage(localUrl)
  }

  const onSubmit = async (data) => {
    try {
      const formData = new FormData()
      formData.append('name',  data.name)
      formData.append('bio',   data.bio   || '')
      formData.append('phone', data.phone || '')
      formData.append('city',  data.city  || '')

      if (selectedFile) {
        formData.append('profile_image', selectedFile)
      }

      await updateProfile(formData)

      setPreviewImage(null)
      setSelectedFile(null)

    } catch (err) {
      const errors = err.response?.data?.errors
      if (errors) {
        const firstError = Object.values(errors)[0][0]
        toast.error(firstError)
      } else {
        toast.error('Une erreur est survenue')

    }
    }
  }



  const avatar = previewImage || user?.profile_image || null


  return (
    <div className="min-h-screen bg-slate-100 py-8 px-4">
      <div className="max-w-lg mx-auto">

        {/* Bouton retour */}
        <div className="mb-6">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-indigo-800 hover:text-indigo-700 font-medium text-sm"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Retour à l'accueil
          </Link>
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">

            <div className="bg-gradient-to-r from-indigo-800 to-red-600 h-24 relative">

              <div className="absolute -bottom-9 left-1/2 -translate-x-1/2">

                <label htmlFor="avatar-input" className="cursor-pointer">
                  <div className="relative w-18 h-18">

                    {avatar ? (
                      <img
                        src={avatar}
                        alt="Avatar"
                        className="w-18 h-18 rounded-full border-3 border-white
                                   object-cover shadow"
                      />
                    ) : (
                      <div className="w-18 h-18 rounded-full border-3 border-white
                                      bg-indigo-100 flex items-center justify-center
                                      text-2xl font-bold text-indigo-500 shadow">
                        {user?.name?.charAt(0).toUpperCase()}
                      </div>
                    )}

                    <div className="absolute bottom-0 right-0 bg-indigo-500
                                    rounded-full p-1.5 border-2 border-white">
                      <svg className="w-3 h-3 text-white" fill="none"
                           stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round"
                              strokeWidth={2.5}
                              d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0
                                 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"/>
                      </svg>
                    </div>
                  </div>
                </label>
                <input
                  id="avatar-input"
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/gif"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </div>
            </div>

            <div className="px-6 pt-14 pb-6">

              <div className="flex justify-center mb-5">
                <span className="bg-indigo-100 text-indigo-700 text-xs
                                 font-semibold px-3 py-1 rounded-full capitalize">
                  {user?.role}
                </span>
              </div>

              <p className="text-xs font-semibold text-slate-400 uppercase
                            tracking-widest mb-4">
                Vos Informations personnelles
              </p>

              <div className="mb-4">
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Nom complet
                </label>
                <input
                  type="text"
                  {...register('name', {
                    required: 'Le nom est obligatoire',
                    maxLength: { value: 255, message: 'Maximum 255 caractères' }
                  })}
                  className="w-full border border-slate-200 rounded-lg px-3
                             py-2.5 text-sm bg-slate-50 focus:bg-white
                             focus:border-indigo-400 focus:ring-2
                             focus:ring-indigo-100 outline-none transition"
                />
                {errors.name && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.name.message}
                  </p>
                )}
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Email
                  <span className="text-slate-400 font-normal ml-1">
                    (Impossible à modifier)
                  </span>
                </label>
                <div className="flex items-center gap-2 border border-slate-200
                                rounded-lg px-3 py-2.5 bg-slate-100">
                  <svg className="w-4 h-4 text-slate-400"/>
                  <span className="text-sm text-slate-500">{user?.email}</span>
                </div>
              </div>

              {/* ── Téléphone et Ville côte à côte ── */}
              <div className="grid grid-cols-2 gap-3 mb-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Téléphone
                  </label>
                  <input
                    type="text"
                    placeholder="Votre numéro"
                    {...register('phone', {
                      maxLength: { value: 32, message: 'Maximum 32 caractères' }
                    })}
                    className="w-full border border-slate-200 rounded-lg px-3
                               py-2.5 text-sm bg-slate-50 focus:bg-white
                               focus:border-indigo-400 outline-none transition"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Ville
                  </label>
                  <input
                    type="text"
                    placeholder="Ville de résidence"
                    {...register('city', {
                      maxLength: { value: 120, message: 'Maximum 120 caractères' }
                    })}
                    className="w-full border border-slate-200 rounded-lg px-3
                               py-2.5 text-sm bg-slate-50 focus:bg-white
                               focus:border-indigo-400 outline-none transition"
                  />
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Bio
                </label>
                <textarea
                  rows={3}
                  placeholder="Parler de vous..."
                  {...register('bio', {
                    maxLength: { value: 2000, message: 'Maximum 2000 caractères' }
                  })}
                  className="w-full border border-slate-200 rounded-lg px-3
                             py-2.5 text-sm bg-slate-50 focus:bg-white
                             focus:border-indigo-400 outline-none transition
                             resize-none"
                />
                {errors.bio && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.bio.message}
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-indigo-700 hover:bg-indigo-800
                           disabled:opacity-60 text-white font-semibold
                           py-3 rounded-xl transition text-sm"
              >
                {isSubmitting ? 'Enregistrement...' : 'Enregistrer les modifications'}
              </button>

            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
