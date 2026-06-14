import { useState, useEffect } from "react"
import { useParams, Link } from "react-router-dom"
import api from "../services/api"
import { getProducts } from "../services/productService"
import { useAuth } from "../hooks/useAuth"
import toast from "react-hot-toast"
import { MessageCircle, Package, X } from "lucide-react"

export default function SellerProfilePage() {
  const { id } = useParams()
  const { user } = useAuth()
  const [seller, setSeller]   = useState(null)
  const [products, setProducts] = useState([])
  const [loading, setLoading]   = useState(true)
  const [message, setMessage]   = useState("")
  const [sending, setSending]   = useState(false)
  const [activeForm, setActiveForm] = useState(null)

  useEffect(() => {
    fetchSellerProfile()
    fetchSellerProducts()
  }, [id])

  const fetchSellerProfile = async () => {
    try {
      const res = await api.get(`/sellers/${id}`)
      setSeller(res.data.data || res.data)
    } catch {
      toast.error("Vendeur introuvable")
    }
  }

  const fetchSellerProducts = async () => {
    try {
      const res = await getProducts({ seller_id: id })
      setProducts(res.data.data || [])
    } catch {}
    finally {
      setLoading(false)
    }
  }

  const openSellerForm = () => {
    setMessage("")
    setActiveForm({
      recipientId:   Number(id), 
      productId:     null,
      productTitle:  null,
      label: `Envoyer un message à ${seller?.name}`,
    })
  }

  const openSellerProductForm = (e, product) => {
    e.preventDefault()
    e.stopPropagation()

    setMessage("")
    setActiveForm({
      recipientId:  product.seller?.id,
      productId:    product.id,
      productTitle: product.title,
      label:`Message à propos de "${product.title}"`,
    })
  }

  const closeForm = () => {
    setActiveForm(null)
    setMessage("")
  }

  const sendMessage = async (e) => {
    e.preventDefault()
    if (!message.trim() || !activeForm) return

    setSending(true)
    try {
      await api.post("/messages", {
        recipient_id: activeForm.recipientId,
        content:      message,
        ...(activeForm.productId && {
          product_id: activeForm.productId
        }),
      })
      toast.success("Message envoyé !")
      closeForm()
    } catch (err) {
      toast.error(err.response?.data?.message || "Erreur lors de l'envoi")
    } finally {
      setSending(false)
    }
  }

  if (loading) return (
    <div className="flex justify-center items-center h-screen">
      <div className="animate-spin rounded-full h-10 w-10
                      border-b-2 border-indigo-500"/>
    </div>
  )

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">

      <div className="bg-white rounded-2xl shadow-sm p-6 mb-8">
        <div className="flex items-center gap-6">
          {seller.profile_image? (
            <img
                src={seller.profile_image}
                 alt="Avatar vendeur"
                  className="w-24 h-24 rounded-full border-3 border-white
                                   object-cover shadow"
                />
          ):(
            <div className="w-20 h-20 bg-indigo-100 rounded-full flex
                          items-center justify-center text-3xl font-bold
                          text-indigo-600 shrink-0">
            {seller?.name?.charAt(0).toUpperCase()}
          </div>
            )}

          <div className="flex-1">
            <h1 className="text-2xl font-bold text-gray-900">
              {seller?.name}
            </h1>
            <p className="text-gray-500 mt-1">
              {seller?.city || "Vendeur EPF Market"}
            </p>
            {seller?.bio && (
              <p className="text-gray-600 mt-2 text-sm">{seller.bio}</p>
            )}
          </div>

          {user && user.role === "buyer" && (
            <button
              onClick={openSellerForm}
              className="flex items-center gap-2 bg-indigo-600 text-white
                         px-4 py-2 rounded-xl hover:bg-indigo-700 transition"
            >
              <MessageCircle size={18}/>
              Contacter
            </button>
          )}
        </div>

        {activeForm && (
          <div className="mt-6 border-t border-gray-100 pt-6">
            <div className="flex items-center justify-between mb-3">
              <label className="text-sm font-medium text-gray-700">
                {activeForm.label}
              </label>
              <button
                onClick={closeForm}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={16}/>
              </button>
            </div>

            {activeForm.productTitle && (
              <div className="flex items-center gap-2 bg-indigo-50
                              text-indigo-700 text-xs font-medium px-3
                              py-1.5 rounded-lg mb-3 w-fit">
                <Package size={12}/>
                {activeForm.productTitle}
              </div>
            )}

            <form onSubmit={sendMessage}>
              <textarea
                value={message}
                onChange={e => setMessage(e.target.value)}
                placeholder="Écrivez votre message..."
                rows={3}
                className="w-full border border-gray-200 rounded-xl px-4
                           py-3 text-sm focus:outline-none focus:ring-2
                           focus:ring-indigo-500 resize-none"
              />
              <div className="flex gap-3 mt-3">
                <button
                  type="submit"
                  disabled={sending || !message.trim()}
                  className="bg-indigo-700 text-white px-6 py-2 rounded-xl
                             hover:bg-indigo-800 disabled:opacity-50 text-sm"
                >
                  {sending ? "Envoi..." : "Envoyer"}
                </button>
                <button
                  type="button"
                  onClick={closeForm}
                  className="text-gray-500 hover:text-gray-700 text-sm
                             px-4 py-2"
                >
                  Annuler
                </button>
              </div>
            </form>
          </div>
        )}
      </div>

      {/* ── Produits du vendeur ── */}
      <div>
        <h2 className="text-xl font-bold text-gray-900 mb-6
                       flex items-center gap-2">
          <Package size={20} className="text-indigo-800"/>
          Produits de {seller?.name} ({products.length})
        </h2>

        {products.length === 0 ? (
          <div className="text-center py-10 text-gray-400">
            Aucun produit disponible
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {products.map(product => (
              <Link
                key={product.id}
                to={`/products/${product.id}`}
                className="bg-white rounded-2xl shadow-sm hover:shadow-md
                           transition-shadow overflow-hidden group"
              >
                <div className="h-48 bg-gray-100 flex items-center
                                justify-center overflow-hidden">
                  {product.image ? (
                    <img
                      src={product.image}
                      alt={product.title}
                      className="w-full h-full object-cover
                                 group-hover:scale-105 transition-transform
                                 duration-300"
                    />
                  ) : (
                    <span className="text-5xl">📦</span>
                  )}
                </div>

                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 truncate">
                    {product.title}
                  </h3>
                  <p className="text-lg font-bold text-indigo-800 mt-1">
                    {Number(product.effective_price || product.price)
                      .toLocaleString('fr-FR')} FCFA
                  </p>

                  {user && user.role === "buyer" && (
                    <button
                      onClick={(e) => openSellerProductForm(e, product)}
                      className="mt-3 w-full flex items-center justify-center
                                 gap-2 border border-indigo-200 text-indigo-800
                                 hover:bg-indigo-50 text-xs font-medium py-2
                                 rounded-lg transition"
                    >
                      <MessageCircle size={14}/>
                      Contacter le vendeur
                    </button>
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}