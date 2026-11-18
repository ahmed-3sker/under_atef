import { Link } from "react-router-dom";
import { getReportsForDate } from "../api/endpoints";
import Layout from "../components/Layout";
import { LABEL, SESSIONS, STATUSES, buildLines, countLines, percent, tile, todayISO } from "../lib/attendance";
import { useFetch } from "../lib/use_fetch";

export default function Dashboard() {
  const date = todayISO();
  const { data, loading, error } = useFetch(date, () => getReportsForDate(date));
  const reports = data ?? [];

  const lines = buildLines(reports);
  const { counts, total, totalAbsent } = countLines(lines, SESSIONS.length);
  const classes = Array.from(new Set(reports.map((r) => r.className))).sort();
  const latestSession = reports.reduce((max, r) => Math.max(max, r.session), 0);

  return (
    <Layout>
      <p className="text-sm font-semibold uppercase tracking-widest text-[#1a1a4e]">Dashboard</p>
      <h1 className="mt-2 text-3xl font-bold text-slate-900">Today · {date}</h1>

      {loading && <p className="mt-6 text-slate-500">Loading...</p>}
      {error && <p role="alert" className="mt-6 rounded-lg bg-red-50 p-3 text-red-600">{error}</p>}

      {!loading && !error && reports.length === 0 && (
        <div className="mt-6 rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center">
          <p className="text-lg font-semibold text-slate-800">No attendance recorded today yet</p>
        </div>
      )}

      {reports.length > 0 && (
        <>
          <div className="my-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
            {STATUSES.map((s) => (
              <div key={s} className={`rounded-xl p-4 ${tile[s]}`}>
                <p className="text-sm font-medium">{LABEL[s]}</p>
                <p className="mt-1 text-2xl font-bold">{counts[s]}</p>
                <p className="text-xs opacity-80">{percent(counts[s], total)} of students</p>
              </div>
            ))}
            <div className="rounded-xl bg-[#1a1a4e] p-4 text-white">
              <p className="text-sm font-medium text-white/80">Classes reported</p>
              <p className="mt-1 text-2xl font-bold">{classes.length}</p>
              <p className="text-xs text-white/70">through session {latestSession}</p>
            </div>
          </div>
          <p className="mb-6 text-slate-600">
            {totalAbsent} students absent or excused so far today.{" "}
            <Link to="/reports" className="font-semibold text-blue-600 hover:text-blue-800">Open full report →</Link>
          </p>
        </>
      )}
    </Layout>
  );
}
