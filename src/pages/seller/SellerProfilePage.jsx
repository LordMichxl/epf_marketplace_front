import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../services/api";
import { getProducts } from "../services/productService";
import { useAuth } from "../hooks/useAuth";
import toast from "react-hot-toast";
import { MessageCircle, Package } from "lucide-react";

export default function SellerProfilePage() {
  const { id } = useParams();
  const { user } = useAuth();
  const [seller, setSeller] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [showMessageForm, setShowMessageForm] = useState(false);

  useEffect(() => {
    fetchSellerProfile();
    fetchSellerProducts();
  }, [id]);

  const fetchSellerProfile = async () => {
    try {
      const res = await api.get(`/sellers/${id}`);
      setSeller(res.data.data || res.data);
    } catch {
      toast.error("Vendeur introuvable");
    }
  };

  const fetchSellerProducts = async () => {
    try {
      const res = await getProducts({ seller_id: id });
      setProducts(res.data.data || []);
    } catch {} 
    finally {
      setLoading(false);
    }
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;
    setSending(true);
    try {
      await api.post("/messages", {
        receiver_id: id,
        content: message,
      });
      toast.success("Message envoyé !");
      setMessage("");
      setShowMessageForm(false);
    } catch {
      toast.error("Erreur lors de l'envoi");
    } finally {
      setSending(false);
    }
  };

  if (loading) return (
    <div className="flex justify-center items-center h-screen">
      <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-500"></div>
    </div>
  );

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">

      {/* Profil vendeur */}
      <div className="bg-white rounded-2xl shadow-sm p-6 mb-8">
        <div className="flex items-center gap-6">
          <div className="w-20 h-20 bg-indigo-100 rounded-full flex items-center justify-center text-3xl font-bold text-indigo-600 flex-shrink-0">
            {seller?.name?.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-gray-900">{seller?.name}</h1>
            <p className="text-gray-500 mt-1">{seller?.city || "Vendeur EPF Market"}</p>
            {seller?.bio && (
              <p className="text-gray-600 mt-2 text-sm">{seller.bio}</p>
            )}
          </div>

          {/* Bouton contacter */}
          {user && user.role === "buyer" && (
            <button
              onClick={() => setShowMessageForm(!showMessageForm)}
              className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-xl hover:bg-indigo-700 transition-colors"
            >
              <MessageCircle size={18} />
              Contacter
            </button>
          )}
        </div>

        {/* Formulaire message */}
        {showMessageForm && (
          <form onSubmit={sendMessage} className="mt-6 border-t border-gray-100 pt-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Envoyer un message à {seller?.name}
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Écrivez votre message..."
              rows={3}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
            />
            <div className="flex gap-3 mt-3">
              <button
                type="submit"
                disabled={sending || !message.trim()}
                className="bg-indigo-600 text-white px-6 py-2 rounded-xl hover:bg-indigo-700 disabled:opacity-50 text-sm"
              >
                {sending ? "Envoi..." : "Envoyer"}
              </button>
              <button
                type="button"
                onClick={() => setShowMessageForm(false)}
                className="text-gray-500 hover:text-gray-700 text-sm px-4 py-2"
              >
                Annuler
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Produits du vendeur */}
      <div>
        <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
          <Package size={20} className="text-indigo-600" />
          Produits de {seller?.name} ({products.length})
        </h2>

        {products.length === 0 ? (
          <div className="text-center py-10 text-gray-400">
            <p>Aucun produit disponible</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {products.map((product) => (
              <Link
                key={product.id}
                to={`/products/${product.id}`}
                className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow overflow-hidden group"
              >
                <div className="h-48 bg-gray-100 flex items-center justify-center overflow-hidden">
                  {product.image ? (
                    <img
                      src={product.image}
                      alt={product.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <span className="text-5xl">📦</span>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 truncate">{product.title}</h3>
                  <p className="text-lg font-bold text-indigo-600 mt-2">
                    {Number(product.effective_price || product.price).toLocaleString()} FCFA
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}