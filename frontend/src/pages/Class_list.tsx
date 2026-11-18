import { Link } from "react-router-dom";
import { getClasses } from "../api/endpoints";
import Layout from "../components/Layout";
import { useFetch } from "../lib/use_fetch";

export default function ClassList() {
  const { data: classes, loading, error } = useFetch("classes", getClasses);

  return (
    <Layout>
      <h1 className="mb-2 text-3xl font-bold text-slate-900">School Classes</h1>
      <p className="mb-8 text-slate-600">Select a class to take attendance.</p>

      {loading && <p className="text-slate-500">Loading classes...</p>}
      {error && <p role="alert" className="rounded-lg bg-red-50 p-3 text-red-600">{error}</p>}
      {classes?.length === 0 && (
        <p className="text-slate-500">No classes yet. Run the seed script or add classes from the admin account.</p>
      )}

      <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
        {classes?.map((c) => (
          <Link
            key={c._id}
            to={`/attendance/${c._id}`}
            className="rounded-xl border border-slate-200 bg-white p-6 text-center shadow-sm transition hover:-translate-y-1 hover:border-[#1a1a4e] hover:shadow-lg"
          >
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-xl bg-[#1a1a4e]/10 text-xl font-bold text-[#1a1a4e]">
              {c.name}
            </div>
            <h2 className="mt-4 font-semibold text-slate-800">Class {c.name}</h2>
            <p className="mt-1 text-sm text-[#1a1a4e]">Take Attendance →</p>
          </Link>
        ))}
      </div>
      {classes && <p className="mt-8 text-sm text-slate-500">Total: {classes.length} classes</p>}
    </Layout>
  );
}
