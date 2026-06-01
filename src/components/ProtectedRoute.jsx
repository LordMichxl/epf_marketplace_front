import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export default function ProtectedRoute({ children, role }) {
  const { user, loading } = useAuth();

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  if (!user) return <Navigate to="/login" replace />;

  if (role && user.role !== role) return (
    <div className="flex items-center justify-center h-screen text-center">
      <div>
        <h1 className="text-6xl font-bold text-red-500">403</h1>
        <p className="text-gray-600 mt-4">Vous n'avez pas les droits pour accéder à cette page.</p>
      </div>
    </div>
  );

  return children;
}