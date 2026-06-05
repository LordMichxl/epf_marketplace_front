import { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getProduct, getProductReviews } from "../services/productService";
import { useAuth } from "../hooks/useAuth";
import { CartContext } from "../contexts/CartContext";
import { ShoppingCart, Heart, ArrowLeft } from "lucide-react";
import toast from "react-hot-toast";
import api from "../services/api";

export default function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addToCart } = useContext(CartContext);
  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [addingToCart, setAddingToCart] = useState(false);

  useEffect(() => {
    fetchProduct();
    fetchReviews();
  }, [id]);

  const fetchProduct = async () => {
    try {
      const res = await getProduct(id);
      setProduct(res.data.data || res.data);
    } catch {
      toast.error("Produit introuvable");
      navigate("/products");
    } finally {
      setLoading(false);
    }
  };

  const fetchReviews = async () => {
    try {
      const res = await getProductReviews(id);
      setReviews(res.data.data || []);
    } catch {}
  };

  const handleAddToCart = async () => {
    if (!user) {
      toast.error("Connectez-vous pour ajouter au panier");
      navigate("/login");
      return;
    }
    setAddingToCart(true);
    try {
      await addToCart(product.id, quantity);
      toast.success("Ajouté au panier !");
      // On reste sur la page produit — pas de navigate
    } catch (err) {
      toast.error(err.response?.data?.message || "Erreur lors de l'ajout au panier");
    } finally {
      setAddingToCart(false);
    }
  };

  const handleAddToFavorites = async () => {
    if (!user) {
      navigate("/login");
      return;
    }
    try {
      await api.post("/favorites/add", { product_id: product.id });
      toast.success("Ajouté aux favoris !");
    } catch {
      toast.error("Erreur");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (!product) return null;

  const price = product.effective_price || product.price;
  const stock = product.quantity || product.stock || 0;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-gray-500 hover:text-indigo-600 mb-6 transition-colors"
      >
        <ArrowLeft size={18} />
        Retour au catalogue
      </button>

      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-2">

          {/* Image */}
          <div className="bg-gray-100 h-96 flex items-center justify-center">
            {product.images && product.images[0] ? (
              <img
                src={product.images[0]}
                alt={product.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-8xl">📦</span>
            )}
          </div>

          {/* Infos */}
          <div className="p-8">
            <p className="text-sm text-indigo-600 font-medium">
              {product.category && product.category.name}
            </p>
            <h1 className="text-2xl font-bold text-gray-900 mt-1">
              {product.title}
            </h1>
            <p className="text-sm text-gray-400 mt-1">
              Vendu par {product.seller && product.seller.name}
            </p>

            {/* Prix */}
            <div className="mt-6">
              <span className="text-3xl font-bold text-indigo-600">
                {Number(price).toLocaleString()} FCFA
              </span>
              {product.is_on_sale && (
                <span className="text-gray-400 line-through ml-3 text-lg">
                  {Number(product.price).toLocaleString()} FCFA
                </span>
              )}
            </div>

            {/* Stock */}
            <p className="text-sm mt-2 text-gray-500">
              Stock :{" "}
              {stock > 0 ? (
                <span className="text-green-600 font-medium">{stock} disponibles</span>
              ) : (
                <span className="text-red-500 font-medium">Rupture de stock</span>
              )}
            </p>

            {/* Description */}
            <p className="text-gray-600 mt-4 text-sm leading-relaxed">
              {product.description}
            </p>

            {/* Quantité + Actions */}
            {stock > 0 && user && user.role !== "seller" && user.role !== "admin" && (
              <div className="mt-6 space-y-3">
                <div className="flex items-center gap-3">
                  <label className="text-sm font-medium text-gray-700">Quantité :</label>
                  <div className="flex items-center border border-gray-200 rounded-lg">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="px-3 py-1 text-gray-600 hover:text-indigo-600 text-lg"
                    >
                      -
                    </button>
                    <span className="px-4 py-1 font-medium">{quantity}</span>
                    <button
                      onClick={() => setQuantity(Math.min(stock, quantity + 1))}
                      className="px-3 py-1 text-gray-600 hover:text-indigo-600 text-lg"
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={handleAddToCart}
                    disabled={addingToCart}
                    className="flex-1 bg-indigo-600 text-white py-3 rounded-xl font-medium hover:bg-indigo-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    <ShoppingCart size={18} />
                    {addingToCart ? "Ajout..." : "Ajouter au panier"}
                  </button>
                  <button
                    onClick={handleAddToFavorites}
                    className="p-3 border border-gray-200 rounded-xl hover:bg-red-50 hover:border-red-300 transition-colors"
                  >
                    <Heart size={20} className="text-gray-400" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Avis */}
        {reviews.length > 0 && (
          <div className="border-t border-gray-100 p-8">
            <h2 className="text-xl font-bold text-gray-900 mb-6">
              Avis clients ({reviews.length})
            </h2>
            <div className="space-y-4">
              {reviews.map((review) => (
                <div key={review.id} className="bg-gray-50 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-2">
                    <p className="font-medium text-gray-900">
                      {review.user && review.user.name}
                    </p>
                    <span className="text-yellow-500 text-sm">{"⭐".repeat(review.rating)}</span>
                  </div>
                  <p className="text-sm text-gray-600">{review.comment}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}