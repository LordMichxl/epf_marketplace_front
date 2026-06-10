import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import api from "../services/api";
import toast from "react-hot-toast";
import { Store, MapPin, Calendar, Star, ShoppingBag, ArrowLeft } from "lucide-react";

export default function SellerProfilePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [seller, setSeller] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [avgRating, setAvgRating] = useState(0);

  useEffect(() => {
    fetchSellerData();
  }, [id]);

  const fetchSellerData = async () => {
    try {
      setLoading(true);
      // Récupérer le profil du vendeur
      const sellerRes = await api.get(`/sellers/${id}`);
      setSeller(sellerRes.data.data || sellerRes.data);

      // Récupérer ses produits
      const productsRes = await api.get(`/sellers/${id}/products`);
      const productsList = productsRes.data.data || productsRes.data || [];
      setProducts(productsList);

      // Calculer la moyenne des notes
      if (productsList.length > 0) {
        const totalRating = productsList.reduce((sum, prod) => sum + (prod.average_rating || 0), 0);
        setAvgRating((totalRating / productsList.length).toFixed(1));
      }
    } catch (err) {
      toast.error("Vendeur non trouvé");
      navigate("/products");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (!seller) return null;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-gray-500 hover:text-indigo-600 mb-6 transition-colors"
      >
        <ArrowLeft size={18} />
        Retour
      </button>

      {/* Profil vendeur */}
      <div className="bg-white rounded-2xl shadow-sm p-8 mb-8">
        <div className="flex items-center gap-6 mb-6">
          {/* Avatar */}
          <div className="w-20 h-20 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 font-bold text-2xl">
            {seller.name?.charAt(0).toUpperCase() || "V"}
          </div>

          {/* Infos */}
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-gray-900">{seller.name}</h1>
            <div className="flex flex-wrap gap-4 mt-3 text-sm text-gray-600">
              {seller.city && (
                <div className="flex items-center gap-1">
                  <MapPin size={16} className="text-indigo-600" />
                  {seller.city}
                </div>
              )}
              {seller.created_at && (
                <div className="flex items-center gap-1">
                  <Calendar size={16} className="text-indigo-600" />
                  Vendeur depuis {new Date(seller.created_at).getFullYear()}
                </div>
              )}
              {avgRating > 0 && (
                <div className="flex items-center gap-1">
                  <Star size={16} className="text-yellow-500 fill-yellow-500" />
                  {avgRating} / 5
                </div>
              )}
            </div>
          </div>

          {/* Stats */}
          <div className="bg-indigo-50 rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-indigo-600">{products.length}</div>
            <div className="text-sm text-gray-600 flex items-center gap-1 mt-1">
              <ShoppingBag size={14} /> Produits
            </div>
          </div>
        </div>

        {/* Description si disponible */}
        {seller.description && (
          <p className="text-gray-600 text-sm leading-relaxed">{seller.description}</p>
        )}
      </div>

      {/* Produits du vendeur */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
          <Store size={24} className="text-indigo-600" />
          Produits du vendeur
        </h2>

        {products.length === 0 ? (
          <div className="bg-gray-50 rounded-2xl p-12 text-center">
            <ShoppingBag size={48} className="mx-auto text-gray-300 mb-4" />
            <p className="text-gray-500 text-lg">Aucun produit disponible</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((product) => {
              const price = product.effective_price || product.price;
              return (
                <Link
                  key={product.id}
                  to={`/products/${product.id}`}
                  className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow overflow-hidden"
                >
                  {/* Image */}
                  <div className="h-48 bg-gray-100 flex items-center justify-center overflow-hidden">
                    {product.images && product.images[0] ? (
                      <img
                        src={product.images[0]}
                        alt={product.title}
                        className="w-full h-full object-cover hover:scale-110 transition-transform"
                      />
                    ) : (
                      <span className="text-5xl">📦</span>
                    )}
                  </div>

                  {/* Infos */}
                  <div className="p-4">
                    <p className="text-xs text-indigo-600 font-medium mb-1">
                      {product.category?.name || "Produit"}
                    </p>
                    <h3 className="font-semibold text-gray-900 truncate mb-2">
                      {product.title}
                    </h3>
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-bold text-indigo-600">
                        {Number(price).toLocaleString()} FCFA
                      </span>
                      {product.average_rating > 0 && (
                        <span className="text-xs text-yellow-500">
                          ⭐ {product.average_rating}
                        </span>
                      )}
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
