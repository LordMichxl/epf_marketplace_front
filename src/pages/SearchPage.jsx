import { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { searchAll } from "../services/productService";
import { Search } from "lucide-react";

export default function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [results, setResults] = useState({ products: [], sellers: [], categories: [] });
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState(searchParams.get("q") || "");
  const [type, setType] = useState(searchParams.get("type") || "all");

  useEffect(() => {
    if (searchParams.get("q")) {
      handleSearch();
    }
  }, [searchParams]);

  const handleSearch = async () => {
    const q = searchParams.get("q") || query;
    if (!q) return;
    setLoading(true);
    try {
      const res = await searchAll(q, type);
      setResults({
        products: res.data.products || [],
        sellers: res.data.sellers || [],
        categories: res.data.categories || [],
      });
    } catch {
      setResults({ products: [], sellers: [], categories: [] });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSearchParams({ q: query, type });
  };

  const total = results.products.length + results.sellers.length + results.categories.length;

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Recherche</h1>

      {/* Barre de recherche */}
      <form onSubmit={handleSubmit} className="flex gap-3 mb-6">
        <div className="flex-1 relative">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Rechercher produits, vendeurs, catégories..."
            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          className="border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <option value="all">Tout</option>
          <option value="products">Produits</option>
          <option value="sellers">Vendeurs</option>
          <option value="categories">Catégories</option>
        </select>
        <button
          type="submit"
          className="bg-indigo-800 text-white px-6 py-3 rounded-xl hover:bg-indigo-700 transition-colors"
        >
          Chercher
        </button>
      </form>

      {/* Loading */}
      {loading && (
        <div className="flex justify-center items-center h-40">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-500"></div>
        </div>
      )}

      {/* Résultats */}
      {!loading && searchParams.get("q") && (
        <p className="text-sm text-gray-500 mb-6">
          {total} résultat(s) pour "<span className="font-medium text-gray-800">{searchParams.get("q")}</span>"
        </p>
      )}

      {/* Produits */}
      {results.products.length > 0 && (
        <div className="mb-10">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            Produits ({results.products.length})
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {results.products.map((product) => (
              <Link
                key={product.id}
                to={`/products/${product.id}`}
                className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow overflow-hidden"
              >
                <div className="h-40 bg-gray-100 flex items-center justify-center">
                  {product.images?.[0] ? (
                    <img src={product.images[0]} alt={product.title} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-5xl">📦</span>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 truncate">{product.title}</h3>
                  <p className="text-indigo-800 font-bold mt-1">
                    {Number(product.effective_price || product.price).toLocaleString()} FCFA
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Vendeurs */}
      {results.sellers.length > 0 && (
        <div className="mb-10">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            Vendeurs ({results.sellers.length})
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {results.sellers.map((seller) => (
              <div key={seller.id} className="bg-white rounded-2xl shadow-sm p-4 flex items-center gap-4">
                <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-800 font-bold text-lg">
                  {seller.name?.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="font-semibold text-gray-900">{seller.name}</p>
                  <p className="text-sm text-gray-400">{seller.city || "Vendeur"}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Catégories */}
      {results.categories.length > 0 && (
        <div className="mb-10">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            Catégories ({results.categories.length})
          </h2>
          <div className="flex flex-wrap gap-3">
            {results.categories.map((cat) => (
              <Link
                key={cat.id}
                to={`/products?category_id=${cat.id}`}
                className="bg-white border border-gray-200 rounded-xl px-4 py-2 hover:border-indigo-400 hover:text-indigo-800 transition-colors text-sm font-medium"
              >
                🏷️ {cat.name}
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Aucun résultat */}
      {!loading && searchParams.get("q") && total === 0 && (
        <div className="text-center py-16 text-gray-400">
          <p className="text-lg">Aucun résultat pour "{searchParams.get("q")}"</p>
          <p className="text-sm mt-2">Essayez avec d'autres mots-clés</p>
        </div>
      )}
    </div>
  );
}