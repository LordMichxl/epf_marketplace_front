import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getProducts, getCategories } from "../services/productService";
import { Search, SlidersHorizontal, ChevronLeft, ChevronRight } from "lucide-react";

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [pagination, setPagination] = useState({});
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: "",
    category_id: "",
    min_price: "",
    max_price: "",
    sort: "newest",
    page: 1,
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [filters]);

  const fetchCategories = async () => {
    try {
      const res = await getCategories();
      setCategories(res.data.data || res.data);
    } catch {}
  };

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const params = {};
      if (filters.search) params.q = filters.search;
      if (filters.category_id) params.category_id = filters.category_id;
      if (filters.min_price) params.min_price = filters.min_price;
      if (filters.max_price) params.max_price = filters.max_price;
      params.sort = filters.sort;
      params.page = filters.page;
      params.per_page = 12;

      const res = await getProducts(params);
      setProducts(res.data.data || []);
      setPagination(res.data.pagination || {});
    } catch {
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value, page: 1 }));
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Catalogue</h1>
        <p className="text-gray-500 mt-1">Découvrez tous nos produits</p>
      </div>

      <div className="flex gap-8">
        {/* Sidebar filtres */}
        <aside className="w-64 flex-shrink-0">
          <div className="bg-white rounded-2xl shadow-sm p-6 sticky top-24">
            <h2 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <SlidersHorizontal size={18} /> Filtres
            </h2>

            <div className="mb-6">
              <p className="text-sm font-medium text-gray-700 mb-2">Catégorie</p>
              <select
                value={filters.category_id}
                onChange={(e) => handleFilterChange("category_id", e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="">Toutes les catégories</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>

            <div className="mb-6">
              <p className="text-sm font-medium text-gray-700 mb-2">Prix (FCFA)</p>
              <div className="flex gap-2">
                <input
                  type="number"
                  placeholder="Min"
                  value={filters.min_price}
                  onChange={(e) => handleFilterChange("min_price", e.target.value)}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <input
                  type="number"
                  placeholder="Max"
                  value={filters.max_price}
                  onChange={(e) => handleFilterChange("max_price", e.target.value)}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div className="mb-6">
              <p className="text-sm font-medium text-gray-700 mb-2">Trier par</p>
              <select
                value={filters.sort}
                onChange={(e) => handleFilterChange("sort", e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="newest">Plus récents</option>
                <option value="cheapest">Moins chers</option>
                <option value="popular">Populaires</option>
                <option value="most_rated">Mieux notés</option>
              </select>
            </div>

            <button
              onClick={() => setFilters({ search: "", category_id: "", min_price: "", max_price: "", sort: "newest", page: 1 })}
              className="w-full text-sm text-red-500 hover:text-red-700 transition-colors"
            >
              Réinitialiser les filtres
            </button>
          </div>
        </aside>

        {/* Contenu principal */}
        <div className="flex-1">
          {/* Barre de recherche */}
          <div className="mb-6 flex gap-2">
            <div className="flex-1 relative">
              <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Rechercher un produit..."
                value={filters.search}
                onChange={(e) => handleFilterChange("search", e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          {/* Grille produits */}
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-500"></div>
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-16 text-gray-400">
              <p className="text-lg">Aucun produit trouvé</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}

          {/* Pagination */}
          {pagination.last_page > 1 && (
            <div className="flex justify-center items-center gap-4 mt-10">
              <button
                onClick={() => handleFilterChange("page", filters.page - 1)}
                disabled={filters.page === 1}
                className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-40"
              >
                <ChevronLeft size={20} />
              </button>
              <span className="text-sm text-gray-600">
                Page {pagination.current_page} sur {pagination.last_page}
              </span>
              <button
                onClick={() => handleFilterChange("page", filters.page + 1)}
                disabled={filters.page === pagination.last_page}
                className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-40"
              >
                <ChevronRight size={20} />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function ProductCard({ product }) {
  const price = product.effective_price || product.price;

  return (
    <Link
      to={`/products/${product.id}`}
      className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow overflow-hidden group"
    >
      <div className="relative h-48 bg-gray-100">
        {product.images?.[0] ? (
          <img
            src={product.images[0]}
            alt={product.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-6xl">📦</div>
        )}
        {product.is_on_sale && (
          <span className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
            PROMO
          </span>
        )}
      </div>

      <div className="p-4">
        <p className="text-xs text-indigo-600 font-medium mb-1">{product.category?.name}</p>
        <h3 className="font-semibold text-gray-900 truncate">{product.title}</h3>
        <p className="text-xs text-gray-400 mt-1">{product.seller?.name}</p>
        <div className="flex items-center justify-between mt-3">
          <span className="text-lg font-bold text-indigo-600">
            {Number(price).toLocaleString()} FCFA
          </span>
          {product.average_rating > 0 && (
            <span className="text-xs text-yellow-500">⭐ {product.average_rating}</span>
          )}
        </div>
      </div>
    </Link>
  );
}