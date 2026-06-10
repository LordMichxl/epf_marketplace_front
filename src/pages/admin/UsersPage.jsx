import {useState, useEffect} from 'react';
import toast from 'react-hot-toast';
import { getUsers, activateUser, suspendUser} from '../../services/adminService';

const ROLES =[
{value: '',  label: 'Tous'},
{value: 'buyer', label: 'Acheteurs'},
{value: 'seller', label: 'Vendeurs'},
{value: 'admins', label: 'Admin'}
]

const ROLE_STYLE =[
{buyer: 'bg-blue-100 text-blue-700'},
{seller: 'bg-purple-100 text-purple-700'},
{admin: 'bg-red-100 text-red-700'},
]

export default function UsersPage(){
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [ roleFilter, setRoleFilter] = useState('');
  const [pagination, setPagination ] = useState(null);
  const [page,setPage] = useState(1);
  const [actionUserId, setActionUserId] = useState(null);


  useEffect(() =>{
    loadUsers()
  }, [roleFilter, page])

  const loadUsers = async () =>{
    setLoading(true)
    try{
      const res = await getUsers(roleFilter,page)
      setUsers(res.data.data || [])
      setPagination(res.data.pagination)
    }catch{
      toast.error('Impossible de charger les utilisateurs')
    }finally{
      setLoading(false)
    }
  }
  const changerRoleFiltre = (role) => {
    setRoleFilter(role)
    setPage(1)
  }

  const handleSuspend = async (userId) =>{
    if(!confirm('Suspendre cet utilisateur ?'))return 
    setActionUserId(userId)
    try{
      const res = await suspendUser(userId)
      toast.success(res.data.message)
       setUsers(prev => prev.map(u =>
        u.id === userId
          ? { ...u, suspended_at: res.data.user.suspended_at }
          : u
      ))
    }catch (err) {
      toast.error(err.response?.data?.message || 'Erreur lors de la suspension')
    } finally {
      setActionUserId(null)
    }
  }
  const handleActivate = async (userId) =>{
    setActionUserId(userId)
    try{
      const res = await activateUser(userId)
      toast.success(res.data.message)
       setUsers(prev => prev.map(u =>
        u.id === userId
          ? { ...u, suspended_at: null }
          : u
      ))
    }catch (err) {
      toast.error(err.response?.data?.message || 'Erreur lors de la réactivation')
    } finally {
      setActionUserId(null)
    }
  }
  return (
    <div className="p-6">

      <div className="mb-6">
        <h1 className="text-xl font-semibold text-slate-900">
          Utilisateurs
        </h1>
        {pagination && (
          <p className="text-sm text-slate-500 mt-0.5">
            {pagination.total} utilisateur{pagination.total > 1 ? 's' : ''}
          </p>
        )}
      </div>

      <div className="flex gap-2 mb-6 bg-slate-100 p-1 rounded-xl w-fit">
        {ROLES.map(r => (
          <button
            key={r.value}
            onClick={() => changerRoleFiltre(r.value)}
            className={`px-4 py-1.5 rounded-lg text-sm font-medium transition
              ${roleFilter === r.value
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-500 hover:text-slate-700'
              }`}
          >
            {r.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
            </div>
      ) : users.length === 0 ? (
        <div className="text-center py-20 text-slate-400">
          Aucun utilisateur trouvé
        </div>
      ) : (
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
          {users.map((user, index) => (
            <div
              key={user.id}
              className={`flex items-center justify-between px-5 py-4
                ${index !== users.length - 1
                  ? 'border-b border-slate-100'
                  : ''
                }
                ${user.suspended_at ? 'bg-red-50' : ''}`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-9 h-9 rounded-full flex items-center
                                 justify-center text-sm font-bold
                                 ${user.suspended_at
                                   ? 'bg-red-200 text-red-600'
                                   : 'bg-indigo-100 text-indigo-600'}`}>
                  {user.name.charAt(0).toUpperCase()}
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium text-slate-900">
                      {user.name}
                    </p>
                    <span className={`text-xs font-semibold px-2 py-0.5
                                      rounded-full
                                      ${ROLE_STYLE[user.role]}`}>
                      {user.role}
                    </span>
                    {user.suspended_at && (
                      <span className="text-xs font-semibold px-2 py-0.5
                                        rounded-full bg-red-100 text-red-600">
                        Suspendu
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5">{user.email}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <p className="text-xs text-slate-400 mr-2 hidden sm:block">
                  Inscrit le {new Date(user.created_at)
                    .toLocaleDateString('fr-FR')}
                </p>

                {user.suspended_at ? (
                  <button
                    onClick={() => handleActivate(user.id)}
                    disabled={actionUserId === user.id}
                    className="bg-emerald-500 hover:bg-emerald-600
                               disabled:opacity-60 text-white text-xs
                               font-semibold px-3 py-1.5 rounded-lg
                               transition"
                  >
                    {actionUserId === user.id ? '...' : 'Réactiver'}
                  </button>
                ) : (
                  <button
                    onClick={() => handleSuspend(user.id)}
                    disabled={actionUserId === user.id}
                    className="border border-red-200 text-red-500
                               hover:bg-red-50 disabled:opacity-60
                               text-xs font-semibold px-3 py-1.5
                               rounded-lg transition"
                  >
                    {actionUserId === user.id ? '...' : 'Suspendre'}
                  </button>
                )}
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