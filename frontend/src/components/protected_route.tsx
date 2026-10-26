import { Navigate, Outlet } from "react-router-dom";
import { useAuth, type Role } from "../components/auth_provider";

const ProtectedRoute = ({ roles }: { roles?: Role[] }) => {
  const { user, loading } = useAuth();
  if (loading) return <div>LOADINGGGGGG</div>;
  if (!user) return <Navigate to="/login" replace />;
  if (roles && !roles.includes(user.role)) return <Navigate to="/" replace />;
  return <Outlet />
};

export default ProtectedRoute;
