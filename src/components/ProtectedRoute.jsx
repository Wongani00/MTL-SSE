import { useAuth } from "../hooks/UseAuth";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children, requiredRole, anyOfRoles }) => {
  const { user, loading, hasRole, hasAnyRole } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-20 h-20 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-600 -mt-12">Loding...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Handle single role requirement
  if (
    requiredRole &&
    typeof requiredRole === "string" &&
    !hasRole(requiredRole)
  ) {
    return (
      <div className="page">
        <div className="container">
          <div className="card">
            <h2>Access Denied</h2>
            <p>You don't have permission to access this page.</p>
          </div>
        </div>
      </div>
    );
  }

  // Handle array of roles requirement
  if (
    requiredRole &&
    Array.isArray(requiredRole) &&
    !hasAnyRole(requiredRole)
  ) {
    return (
      <div className="page">
        <div className="container">
          <div className="card">
            <h2>Access Denied</h2>
            <p>You don't have permission to access this page.</p>
          </div>
        </div>
      </div>
    );
  }

  // Handle anyOfRoles (backward compatibility)
  if (anyOfRoles && !hasAnyRole(anyOfRoles)) {
    return (
      <div className="page">
        <div className="container">
          <div className="card">
            <h2>Access Denied</h2>
            <p>You don't have permission to access this page.</p>
          </div>
        </div>
      </div>
    );
  }

  return children;
};

export default ProtectedRoute;
