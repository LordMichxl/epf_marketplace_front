import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getProducts, getCategories } from "../services/productService";
import { ShoppingBag, Tag, Star, ArrowRight } from "lucide-react";

export default function HomePage() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [prodRes, catRes] = await Promise.all([
        getProducts({ per_page: 8, sort: "newest" }),
        getCategories(),
      ]);
      setProducts(prodRes.data.data || []);
      setCategories(catRes.data.data || catRes.data || []);
    } catch {}
    finally { setLoading(false); }
  };

  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-br from-indigo-600 to-purple-700 text-white py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl font-bold mb-4">Bienvenue sur EPF Market</h1>
          <p className="text-xl text-indigo-100 mb-8">
            Achetez et vendez en toute confiance sur notre marketplace
          </p>
          <Link
            to="/products"
            className="inline-flex items-center gap-2 bg-white text-indigo-600 px-8 py-4 rounded-xl font-bold hover:bg-indigo-50 transition-colors text-lg"
          >
            <ShoppingBag size={22} />
            Découvrir les produits
          </Link>
        </div>
      </section>

      {/* Catégories */}
      {categories.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 py-16">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <Tag size={22} className="text-indigo-600" />
              Catégories
            </h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {categories.slice(0, 6).map((cat) => (
              <Link
                key={cat.id}
                to={`/products?category_id=${cat.id}`}
                className="bg-white rounded-2xl p-4 text-center shadow-sm hover:shadow-md hover:border-indigo-300 border border-transparent transition-all"
              >
                <div className="text-3xl mb-2">🏷️</div>
                <p className="text-sm font-medium text-gray-700">{cat.name}</p>
                <p className="text-xs text-gray-400 mt-1">{cat.products_count || ""}</p>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Produits récents */}
      <section className="max-w-7xl mx-auto px-4 py-8 pb-16">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Star size={22} className="text-indigo-600" />
            Nouveaux produits
          </h2>
          <Link
            to="/products"
            className="flex items-center gap-1 text-indigo-600 hover:text-indigo-700 font-medium text-sm"
          >
            Voir tout <ArrowRight size={16} />
          </Link>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-40">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-500"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <Link
                key={product.id}
                to={`/products/${product.id}`}
                className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow overflow-hidden group"
              >
                <div className="h-48 bg-gray-100 flex items-center justify-center overflow-hidden">
                  {product.images?.[0] ? (
                    <img
                      src={product.images[0]}
                      alt={product.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <span className="text-5xl">📦</span>
                  )}
                </div>
                <div className="p-4">
                  <p className="text-xs text-indigo-600 font-medium">{product.category?.name}</p>
                  <h3 className="font-semibold text-gray-900 truncate mt-1">{product.title}</h3>
                  <p className="text-lg font-bold text-indigo-600 mt-2">
                    {Number(product.effective_price || product.price).toLocaleString()} FCFA
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}