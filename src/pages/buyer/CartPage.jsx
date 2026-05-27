import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../../services/api";
import toast from "react-hot-toast";
import { Trash2, Plus, Minus, ShoppingBag } from "lucide-react";

export default function CartPage() {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [ordering, setOrdering] = useState(false);
  const [coupon, setCoupon] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      const res = await api.get("/cart");
      setCart(res.data);
    } catch {
      toast.error("Erreur lors du chargement du panier");
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (cartItemId, quantity) => {
    if (quantity < 1) return;
    try {
      await api.put(`/cart/items/${cartItemId}`, { quantity });
      fetchCart();
    } catch (err) {
      toast.error(err.response?.data?.message || "Erreur");
    }
  };

  const removeItem = async (cartItemId) => {
    try {
      await api.delete(`/cart/items/${cartItemId}`);
      toast.success("Article retiré");
      fetchCart();
    } catch {
      toast.error("Erreur");
    }
  };

  const clearCart = async () => {
    try {
      await api.delete("/cart/clear");
      toast.success("Panier vidé");
      fetchCart();
    } catch {
      toast.error("Erreur");
    }
  };

  const placeOrder = async () => {
    setOrdering(true);
    try {
      const body = {};
      if (coupon) body.coupon_code = coupon;
      await api.post("/orders", body);
      toast.success("Commande passée avec succès !");
      navigate("/orders");
    } catch (err) {
      toast.error(err.response?.data?.message || "Erreur lors de la commande");
    } finally {
      setOrdering(false);
    }
  };

  if (loading) return (
    <div className="flex justify-center items-center h-screen">
      <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-500"></div>
    </div>
  );

  const items = cart?.items || [];
  const total = cart?.total || 0;

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Mon Panier</h1>

      {items.length === 0 ? (
        <div className="text-center py-20">
          <ShoppingBag size={60} className="mx-auto text-gray-300 mb-4" />
          <p className="text-gray-500 text-lg">Votre panier est vide</p>
          <Link
            to="/products"
            className="mt-4 inline-block bg-indigo-600 text-white px-6 py-3 rounded-xl hover:bg-indigo-700 transition-colors"
          >
            Découvrir les produits
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Liste des articles */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <div key={item.id} className="bg-white rounded-2xl shadow-sm p-4 flex items-center gap-4">

                {/* Images */}
                <div className="w-20 h-20 bg-gray-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  {item.product?.images?.[0] ? (
                    <img
                      src={item.product.images[0]}
                      alt={item.product.title}
                      className="w-full h-full object-cover rounded-xl"
                    />
                  ) : (
                    <span className="text-3xl">📦</span>
                  )}
                </div>

                {/* Infos */}
                <div className="flex-1">
                  <Link
                    to={`/products/${item.product?.id}`}
                    className="font-semibold text-gray-900 hover:text-indigo-600"
                  >
                    {item.product?.title}
                  </Link>
                  <p className="text-sm text-gray-400">{item.product?.seller?.name}</p>
                  <p className="text-indigo-600 font-bold mt-1">
                    {Number(item.product?.effective_price || item.product?.price).toLocaleString()} FCFA
                  </p>
                </div>

                {/* Quantités */}
                <div className="flex items-center border border-gray-200 rounded-lg">
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    className="px-2 py-1 text-gray-600 hover:text-indigo-600"
                  >
                    <Minus size={16} />
                  </button>
                  <span className="px-3 py-1 font-medium">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    className="px-2 py-1 text-gray-600 hover:text-indigo-600"
                  >
                    <Plus size={16} />
                  </button>
                </div>

                {/* Supprimé */}
                <button
                  onClick={() => removeItem(item.id)}
                  className="p-2 text-red-400 hover:text-red-600 transition-colors"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            ))}

            {/* Vider le panier */}
            <button
              onClick={clearCart}
              className="text-sm text-red-500 hover:text-red-700 transition-colors"
            >
              Vider le panier
            </button>
          </div>

          {/* Résumé commande */}
          <div className="bg-white rounded-2xl shadow-sm p-6 h-fit sticky top-24">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Résumé</h2>

            <div className="space-y-2 mb-4">
              {items.map((item) => (
                <div key={item.id} className="flex justify-between text-sm text-gray-600">
                  <span className="truncate flex-1">{item.product?.title} x{item.quantity}</span>
                  <span className="ml-2 font-medium">
                    {Number((item.product?.effective_price || item.product?.price) * item.quantity).toLocaleString()} FCFA
                  </span>
                </div>
              ))}
            </div>

            <div className="border-t border-gray-100 pt-4 mb-4">
              <div className="flex justify-between font-bold text-gray-900">
                <span>Total</span>
                <span className="text-indigo-600">{Number(total).toLocaleString()} FCFA</span>
              </div>
            </div>

            {/* Coupon */}
            <div className="mb-4">
              <label className="text-sm font-medium text-gray-700 mb-1 block">
                Code coupon (optionnel)
              </label>
              <input
                type="text"
                value={coupon}
                onChange={(e) => setCoupon(e.target.value)}
                placeholder="Ex: PROMO10"
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <button
              onClick={placeOrder}
              disabled={ordering}
              className="w-full bg-indigo-600 text-white py-3 rounded-xl font-medium hover:bg-indigo-700 transition-colors disabled:opacity-50"
            >
              {ordering ? "Commande en cours..." : "Passer la commande"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}