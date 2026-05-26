import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export default function ProtectedRoute({ children, role }) {
  const { user, loading } = useAuth();

  if (loading) return (
    <div className="flex items-center justify-center h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
    </div>
  );

  if (!user) return <Navigate to="/login" />;

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