import {useState} from 'react'
import { Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { useAuth } from '../../hooks/useAuth'

export default function RegisterPage() {
    const { register: signup } = useAuth()
    const [serverError, setServerError] = useState('')

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm()

  const password = watch('password')

  const onSubmit = async (data) => {
    setServerError('')
    const { confirmPassword, ...submitData } = data
    try {
      await signup(submitData)
    } catch (err) {
      setServerError(
        err.response?.data?.message || 'Une erreur est survenue'
      )
    }
  }
  return (
    <div className="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <h1 className="text-2xl font-semibold text-slate-900">
            EPF <span className="text-indigo-800">Market</span>
          </h1>
          <p className="text-slate-500 mt-1 text-sm">Créer votre compte</p>
        </div>

        {serverError && (
          <div className="bg-red-50 border border-red-200 text-red-700
                          text-sm rounded-lg px-4 py-3 mb-5">
            {serverError}
          </div>
        )}

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
                <div className="flex items-center justify-between">
              <label htmlFor="name" className="block text-sm/6 font-medium text-gray-900 dark:text-gray-100">
                Name
              </label>
              </div>
              <div className="mt-2">
                <input
                  id="name"
                  name="name"
                  type="text"
                  className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-800 sm:text-sm/6 dark:bg-white/5 dark:text-white dark:outline-white/10 dark:placeholder:text-gray-500 dark:focus:outline-indigo-800"
                  {...register('name', { required: 'Le nom est obligatoire' })}
                />
                {errors.name && (
                <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>
                )}
              </div>
            </div>
            <div>
                <div className="flex items-center justify-between">
              <label htmlFor="email" className="block text-sm/6 font-medium text-gray-900 dark:text-gray-100">
                Email
              </label>
              </div>
              <div className="mt-2">
                <input
                  id="email"
                  name="email"
                  type="email"
                  className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-800 sm:text-sm/6 dark:bg-white/5 dark:text-white dark:outline-white/10 dark:placeholder:text-gray-500 dark:focus:outline-indigo-800"
                  {...register('email', { 
                    required: 'L\'adresse email est obligatoire',
                    pattern: {
                      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                      message: 'Email invalide'
                    }
                  })}
                />
                {errors.email && (
                <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>
                )}
              </div>
            </div>

            <div>
            <div className="flex items-center justify-between">
              <label htmlFor="password" className="block text-sm/6 font-medium text-gray-900 dark:text-gray-100">
                Password
              </label>
                </div>
              <div className="mt-2">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-800 sm:text-sm/6 dark:bg-white/5 dark:text-white dark:outline-white/10 dark:placeholder:text-gray-500 dark:focus:outline-indigo-800"
                  {...register('password', { 
                    required: 'Le mot de passe est obligatoire',
                    minLength: {
                      value: 6,
                      message: 'Le mot de passe doit contenir au moins 6 caractères'
                    }
                  })}
                />
                {errors.password && (
                <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>
                )}
              </div>
            </div>

            <div>
            <div className="flex items-center justify-between">
              <label htmlFor="confirmPassword" className="block text-sm/6 font-medium text-gray-900 dark:text-gray-100">
                Confirmer le mot de passe
              </label>
                </div>
              <div className="mt-2">
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  autoComplete="new-password"
                  className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-800 sm:text-sm/6 dark:bg-white/5 dark:text-white dark:outline-white/10 dark:placeholder:text-gray-500 dark:focus:outline-indigo-800"
                  {...register('confirmPassword', { 
                    required: 'Veuillez confirmer le mot de passe',
                    validate: value => value === password || 'Les mots de passe ne correspondent pas'
                  })}
                />
                {errors.confirmPassword && (
                <p className="text-red-500 text-xs mt-1">{errors.confirmPassword.message}</p>
                )}
              </div>
            </div>

            <div>
                <div className="flex items-center justify-between">
              <label htmlFor="role" className="block text-sm/6 font-medium text-gray-900 dark:text-gray-100">
                Rôle
              </label>
                </div>
              <div className="mt-2">
                <select
                  id="role"
                  name="role"
                  className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-800 sm:text-sm/6 dark:bg-white/5 dark:text-white dark:outline-white/10 dark:focus:outline-indigo-800"
                  {...register('role')}
                >
                  <option value="buyer">Acheteur</option>
                  <option value="seller">Vendeur</option>
                </select>
              </div>
            </div>

            <div>
                <div className="flex items-center justify-between">
              <label htmlFor="phone" className="block text-sm/6 font-medium text-gray-900 dark:text-gray-100">
                Téléphone
              </label>
              </div>
              <div className="mt-2">
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-800 sm:text-sm/6 dark:bg-white/5 dark:text-white dark:outline-white/10 dark:placeholder:text-gray-500 dark:focus:outline-indigo-800"
                  {...register('phone', { 
                    maxLength: {
                      value: 32,
                      message: 'Le numéro de téléphone ne doit pas dépasser 32 caractères'
                    }
                  })}
                />
                {errors.phone && (
                <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>
                )}
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label htmlFor="city" className="block text-sm/6 font-medium text-gray-900 dark:text-gray-100">
                  Ville
                </label>
              </div>
              <div className="mt-2">
                <input
                  id="city"
                  name="city"
                  type="text"
                  className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-800 sm:text-sm/6 dark:bg-white/5 dark:text-white dark:outline-white/10 dark:placeholder:text-gray-500 dark:focus:outline-indigo-800"
                  {...register('city', { 
                    maxLength: {
                      value: 120,
                      message: 'La ville ne doit pas dépasser 120 caractères'
                    }
                  })}
                />
                {errors.city && (
                <p className="text-red-500 text-xs mt-1">{errors.city.message}</p>
                )}
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label htmlFor="bio" className="block text-sm/6 font-medium text-gray-900 dark:text-gray-100">
                  Bio
                </label>
              </div>
              <div className="mt-2">
                <textarea
                  id="bio"
                  name="bio"
                  rows="4"
                  className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-800 sm:text-sm/6 dark:bg-white/5 dark:text-white dark:outline-white/10 dark:placeholder:text-gray-500 dark:focus:outline-indigo-800"
                  {...register('bio', { 
                    maxLength: {
                      value: 2000,
                      message: 'La bio ne doit pas dépasser 2000 caractères'
                    }
                  })}
                />
                {errors.bio && (
                <p className="text-red-500 text-xs mt-1">{errors.bio.message}</p>
                )}
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex w-full justify-center rounded-md bg-indigo-700 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs hover:bg-indigo-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-800 dark:bg-indigo-800 dark:shadow-none dark:hover:bg-indigo-400 dark:focus-visible:outline-indigo-800 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Inscription en cours...' : "S'inscrire"}
              </button>
            </div>
          </form>

          <p className="mt-10 text-center text-sm/6 text-gray-500 dark:text-gray-400">
            Déjà un compte?{' '}
            <Link
              to="/login"
              className="font-semibold text-indigo-700 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-800"
            >
              Se connecter
            </Link>
          </p>
        </div>
    </div>
  )
}