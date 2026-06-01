import { useContext, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { CartContext } from "../../contexts/CartContext";
import { ShoppingCart, Search } from "lucide-react";

export default function Navbar() {
  const { user, logout } = useAuth();
  const { cartCount, fetchCart } = useContext(CartContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (user?.role === "buyer") {
      fetchCart();
    }
  }, [user]);

  const handleSearch = (e) => {
    e.preventDefault();
    const q = e.target.q.value.trim();
    if (q) navigate(`/search?q=${q}`);
  };

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-16">

        {/* Logo */}
        <NavLink to="/" className="text-xl font-bold text-indigo-600">
          <h1 className="text-2xl font-semibold text-black">
            EPF <span className="text-indigo-500">Market</span>
          </h1>
        </NavLink>

        {/* Liens du milieu */}
        <div className="hidden md:flex items-center gap-6">
          <NavLink to="/products" className="text-gray-600 hover:text-indigo-600 transition-colors">
            Produits
          </NavLink>
          {user?.role === "seller" && (
            <NavLink to="/seller/dashboard" className="text-gray-600 hover:text-indigo-600">
              Dashboard Vendeur
            </NavLink>
          )}
          {user?.role === "admin" && (
            <NavLink to="/admin" className="text-gray-600 hover:text-indigo-600">
              Admin
            </NavLink>
          )}
        </div>

        {/* Barre de recherche */}
        <form
          onSubmit={handleSearch}
          className="hidden md:flex items-center border border-gray-200 rounded-lg overflow-hidden"
        >
          <input
            name="q"
            type="text"
            placeholder="Rechercher..."
            className="px-3 py-1.5 text-sm outline-none w-48"
          />
          <button
            type="submit"
            className="px-3 py-1.5 bg-indigo-600 text-white hover:bg-indigo-700 transition-colors"
          >
            <Search size={16} />
          </button>
        </form>

        {/* Partie droite */}
        <div className="flex items-center gap-3">
          {user ? (
            <>
              {/* Icône panier avec compteur */}
              {user.role === "buyer" && (
                <NavLink to="/cart" className="relative p-2 text-gray-600 hover:text-indigo-600">
                  <ShoppingCart size={22} />
                  {cartCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
                      {cartCount}
                    </span>
                  )}
                </NavLink>
              )}

              <div className="flex items-center space-x-4">
                <NavLink
                  to="/profile"
                  className="text-sm font-medium text-gray-700 hover:text-indigo-600 transition-colors"
                >
                  Profil
                </NavLink>
                <button
                  onClick={logout}
                  className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-500 transition-colors"
                >
                  Déconnexion
                </button>
              </div>
            </>
          ) : (
            <>
              <NavLink to="/login" className="text-sm text-gray-600 hover:text-indigo-600">
                Connexion
              </NavLink>
              <NavLink
                to="/register"
                className="text-sm bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
              >
                S'inscrire
              </NavLink>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}