import { Link } from "react-router-dom";
import { useAuth } from "../components/auth_provider";
import Layout from "../components/Layout";
import { LINKS } from "../lib/nav";

export default function Home() {
  const { user } = useAuth();
  if (!user) return null; // ProtectedRoute already guarantees a user
  const links = LINKS.filter((l) => l.roles.includes(user.role));

  return (
    <Layout>
      <h1 className="text-3xl font-bold text-slate-900">Welcome, {user.name}</h1>
      <p className="mb-8 mt-2 text-slate-600">What would you like to do?</p>
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {links.map((l) => (
          <Link
            key={l.to}
            to={l.to}
            className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-[#1a1a4e] hover:shadow-lg"
          >
            <h2 className="text-lg font-semibold text-slate-900">{l.label}</h2>
            <p className="mt-1 text-sm text-slate-500">{l.description}</p>
          </Link>
        ))}
      </div>
    </Layout>
  );
}
