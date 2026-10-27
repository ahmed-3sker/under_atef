import { Link } from "react-router-dom";
import { useAuth, type Role } from "../components/auth_provider";
import RoleBadge from "../components/RoleBadge";

const links: { to: string; label: string; roles: Role[] }[] = [
  { to: "/dashboard",  label: "Dashboard",  roles: ["admin", "principal"] },
  { to: "/attendance", label: "Attendance", roles: ["teacher"] },
  { to: "/students",   label: "Students",   roles: ["admin", "teacher", "principal"] },
  { to: "/excuses",    label: "Excuses",    roles: ["admin", "teacher"] },
  { to: "/reports",    label: "Reports",    roles: ["admin", "principal"] },
  { to: "/classes",    label: "Classes",    roles: ["admin"] },
  { to: "/users",      label: "Users",      roles: ["admin"] },
   { to: "/attendance",      label: "Attendance",      roles: ["admin"] }
  
];

export default function Home() {
  const { user, logout } = useAuth();
  if (!user) return null; // ProtectedRoute already guarantees a user

  return (
    <div style={{ padding: 24 }}>
      <h1>
        Welcome, {user.name} <RoleBadge />
      </h1>

      {user.role === "admin" && <p>You have full admin access.</p>}

      <nav style={{ display: "grid", gap: 8, maxWidth: 240, margin: "16px 0" }}>
        {links
          .filter((l) => l.roles.includes(user.role))
          .map((l) => (
            <Link key={l.to} to={l.to}>
              {l.label}
            </Link>
          ))}
      </nav>

      <button onClick={logout}>Log out</button>
    </div>
  );
}