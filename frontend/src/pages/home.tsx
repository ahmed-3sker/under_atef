import { Navigate } from "react-router-dom";
import { useAuth, type Role } from "../components/auth_provider";

function getRoleHome(role: Role): string {
  switch (role) {
    case "admin":
    case "principal":
      return "/dashboard";
    case "teacher":
      return "/classes";
    default:
      return "/login";
  }
}

export default function Home() {
  const { user, loading } = useAuth();

  if (loading) return <p>Loading...</p>;
  if (!user) return <Navigate to="/login" replace />;

  return <Navigate to={getRoleHome(user.role)} replace />;
}