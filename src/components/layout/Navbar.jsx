import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { ShoppingCart, User, LogOut } from "lucide-react";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-16">

        <Link to="/" className="text-xl font-bold text-indigo-600">
          EPF Market
        </Link>

        <div className="hidden md:flex items-center gap-6">
          <Link to="/products" className="text-gray-600 hover:text-indigo-600 transition-colors">
            Produits
          </Link>
          {user?.role === "seller" && (
            <Link to="/seller/dashboard" className="text-gray-600 hover:text-indigo-600">
              Dashboard Vendeur
            </Link>
          )}
          {user?.role === "admin" && (
            <Link to="/admin" className="text-gray-600 hover:text-indigo-600">
              Admin
            </Link>
          )}
        </div>

        <div className="flex items-center gap-3">
          {user ? (
            <>
              {user.role === "buyer" && (
                <Link to="/cart" className="p-2 text-gray-600 hover:text-indigo-600">
                  <ShoppingCart size={22} />
                </Link>
              )}
              <Link to="/profile" className="flex items-center gap-2 text-gray-700 hover:text-indigo-600">
                <User size={20} />
                <span className="hidden md:block text-sm font-medium">{user.name}</span>
              </Link>
              <button onClick={handleLogout} className="flex items-center gap-1 text-sm text-red-500 hover:text-red-700">
                <LogOut size={18} />
                <span className="hidden md:block">Déconnexion</span>
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-sm text-gray-600 hover:text-indigo-600">
                Connexion
              </Link>
              <Link to="/register" className="text-sm bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700">
                S'inscrire
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}