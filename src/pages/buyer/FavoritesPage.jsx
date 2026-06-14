import { useState, useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../../services/api";
import toast from "react-hot-toast";
import { Heart, ShoppingCart } from "lucide-react";
import { CartContext } from "../../contexts/CartContext";

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { addToCart } = useContext(CartContext);

  useEffect(() => {
    fetchFavorites();
  }, []);

  const fetchFavorites = async () => {
    try {
      const res = await api.get("/favorites");
      setFavorites(res.data.data || res.data || []);
    } catch {
      toast.error("Erreur lors du chargement des favoris");
    } finally {
      setLoading(false);
    }
  };

  const removeFavorite = async (productId) => {
    try {
      await api.delete(`/favorites/remove/${productId}`);
      toast.success("Retiré des favoris");
      setFavorites(favorites.filter((f) => f.product?.id !== productId));
    } catch {
      toast.error("Erreur");
    }
  };

  const handleAddToCart = async (productId) => {
    try {
      await addToCart(productId, 1);
      toast.success("Ajouté au panier !");
      navigate("/cart");
    } catch (err) {
      toast.error(err.response?.data?.message || "Erreur lors de l'ajout au panier");
    }
  };

  if (loading) return (
    <div className="flex justify-center items-center h-screen">
      <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-500"></div>
    </div>
  );

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Mes Favoris</h1>

      {favorites.length === 0 ? (
        <div className="text-center py-20">
          <Heart size={60} className="mx-auto text-gray-300 mb-4" />
          <p className="text-gray-500 text-lg">Aucun favori pour l'instant</p>
          <Link
            to="/products"
            className="mt-4 inline-block bg-indigo-700 text-white px-6 py-3 rounded-xl hover:bg-indigo-800 transition-colors"
          >
            Découvrir les produits
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {favorites.map((fav) => {
            const product = fav.product || fav;
            const price = product.effective_price || product.price;
            return (
              <div key={fav.id} className="bg-white rounded-2xl shadow-sm overflow-hidden group">

                {/* Image */}
                <div className="relative h-48 bg-gray-100">
                  <Link to={`/products/${product.id}`}>
                    {product.images?.[0] ? (
                      <img
                        src={product.images[0]}
                        alt={product.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-5xl">📦</div>
                    )}
                  </Link>

                  {/* Bouton retirer favori */}
                  <button
                    onClick={() => removeFavorite(product.id)}
                    className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-md hover:bg-red-50 transition-colors"
                  >
                    <Heart size={18} className="text-red-500 fill-red-500" />
                  </button>
                </div>

                {/* Infos */}
                <div className="p-4">
                  <p className="text-xs text-indigo-800 font-medium">{product.category?.name}</p>
                  <Link to={`/products/${product.id}`}>
                    <h3 className="font-semibold text-gray-900 truncate hover:text-indigo-800 mt-1">
                      {product.title}
                    </h3>
                  </Link>
                  <p className="text-xs text-gray-400 mt-1">{product.seller?.name}</p>

                  <div className="flex items-center justify-between mt-3">
                    <span className="text-lg font-bold text-indigo-800">
                      {Number(price).toLocaleString()} FCFA
                    </span>
                    <button
                      onClick={() => handleAddToCart(product.id)}
                      className="p-2 bg-indigo-700 text-white rounded-lg hover:bg-indigo-800 transition-colors"
                    >
                      <ShoppingCart size={16} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}