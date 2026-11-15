import { useState } from "react";
import { Link } from "react-router-dom";
import { getReportDates, getReportsForDate } from "../api/endpoints";
import Layout from "../components/Layout";
import {
  LABEL, SESSIONS, STATUSES, badge, buildLines, countLines, lineStatus, percent, tile,
} from "../lib/attendance";
import { useFetch } from "../lib/use_fetch";

const inputClass =
  "w-full rounded-lg border border-slate-300 bg-white px-4 py-3 outline-none focus:border-[#1a1a4e] focus:ring-2 focus:ring-[#1a1a4e]/20";

export default function Reports() {
  const dates = useFetch("dates", getReportDates);
  const [pickedDate, setPickedDate] = useState("");
  const date = pickedDate || dates.data?.[0] || "";
  const [classFilter, setClassFilter] = useState("all");
  const [sessionFilter, setSessionFilter] = useState("all");
  const upTo = sessionFilter === "all" ? SESSIONS.length : Number(sessionFilter);

  const reports = useFetch(date || null, () => getReportsForDate(date));
  const all = reports.data ?? [];

  const classNames = Array.from(new Set(all.map((r) => r.className))).sort();
  const lines = buildLines(all, classFilter);
  const { counts, total, totalAbsent } = countLines(lines, upTo);
  const visibleSessions = SESSIONS.filter((n) => n <= upTo);
  const absentBySession = visibleSessions.map((n) => ({ session: n, absent: countLines(lines, n).totalAbsent }));

  const byClass = Array.from(new Set(lines.map((l) => l.className))).sort().map((name) => {
    const classLines = lines.filter((l) => l.className === name);
    return { name, ...countLines(classLines, upTo) };
  });

  return (
    <Layout>
      <p className="text-sm font-semibold uppercase tracking-widest text-[#1a1a4e]">Attendance Reports</p>
      <h1 className="mt-2 text-3xl font-bold text-slate-900">Daily Attendance Report</h1>
      <p className="mb-8 mt-2 text-slate-600">
        Absences build up session by session. The last session shows the day's total.
      </p>

      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-slate-200 bg-white p-5">
          <label htmlFor="report-date" className="mb-2 block font-semibold text-slate-700">Date</label>
          <select
            id="report-date" value={date} className={inputClass}
            onChange={(e) => { setPickedDate(e.target.value); setClassFilter("all"); }}
          >
            {dates.data?.map((d) => <option key={d} value={d}>{d}</option>)}
          </select>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-5">
          <label htmlFor="report-class" className="mb-2 block font-semibold text-slate-700">Class</label>
          <select id="report-class" value={classFilter} onChange={(e) => setClassFilter(e.target.value)} className={inputClass}>
            <option value="all">All classes</option>
            {classNames.map((c) => <option key={c} value={c}>Class {c}</option>)}
          </select>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-5">
          <label htmlFor="report-session" className="mb-2 block font-semibold text-slate-700">Up to session</label>
          <select id="report-session" value={sessionFilter} onChange={(e) => setSessionFilter(e.target.value)} className={inputClass}>
            <option value="all">Full day (all sessions)</option>
            {SESSIONS.map((s) => <option key={s} value={s}>Through session {s}</option>)}
          </select>
        </div>
      </div>

      {(dates.error || reports.error) && (
        <p role="alert" className="mb-4 rounded-lg bg-red-50 p-3 text-red-600">{dates.error ?? reports.error}</p>
      )}
      {(dates.loading || reports.loading) && <p className="text-slate-500">Loading...</p>}

      {!dates.loading && !reports.loading && total === 0 && (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center">
          <p className="text-lg font-semibold text-slate-800">No attendance recorded</p>
          <p className="mt-1 text-slate-500">Nothing has been saved for this date, class and session yet.</p>
        </div>
      )}

      {total > 0 && (
        <>
          <div className="mb-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
            {STATUSES.map((s) => (
              <div key={s} className={`rounded-xl p-4 ${tile[s]}`}>
                <p className="text-sm font-medium">{s === "absent" ? "Absent" : LABEL[s]}</p>
                <p className="mt-1 text-2xl font-bold">{counts[s]}</p>
                <p className="text-xs opacity-80">{percent(counts[s], total)} of students</p>
              </div>
            ))}
            <div className="rounded-xl bg-[#1a1a4e] p-4 text-white">
              <p className="text-sm font-medium text-white/80">Total Students</p>
              <p className="mt-1 text-2xl font-bold">{total}</p>
              <p className="text-xs text-white/70">{percent(counts.present, total)} present all day</p>
            </div>
          </div>

          <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="text-xl font-bold text-slate-900">Absences by Session</h2>
            <p className="mt-1 text-sm text-slate-500">
              Students absent or excused so far ({totalAbsent} in total). Each session adds to the previous one.
            </p>
            <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-5">
              {absentBySession.map((item, i) => {
                const isLast = i === absentBySession.length - 1;
                return (
                  <div key={item.session} className={`rounded-xl p-4 ${isLast ? "bg-red-600 text-white" : "bg-red-50 text-red-700"}`}>
                    <p className="text-sm font-medium">{isLast ? `Session ${item.session} · Total` : `Session ${item.session}`}</p>
                    <p className="mt-1 text-2xl font-bold">{item.absent}</p>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mb-6 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-200 p-5">
              <h2 className="text-xl font-bold text-slate-900">By Class</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-slate-50 text-sm text-slate-600">
                  <tr>
                    <th className="px-5 py-4">Class</th>
                    <th className="px-5 py-4">Students</th>
                    {STATUSES.map((s) => <th key={s} className="px-5 py-4">{LABEL[s]}</th>)}
                    <th className="px-5 py-4">Present Rate</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {byClass.map((c) => (
                    <tr key={c.name} className="hover:bg-slate-50">
                      <td className="px-5 py-4 font-semibold text-slate-900">{c.name}</td>
                      <td className="px-5 py-4 text-slate-600">{c.total}</td>
                      {STATUSES.map((s) => <td key={s} className="px-5 py-4 text-slate-700">{c.counts[s]}</td>)}
                      <td className="px-5 py-4 font-semibold text-[#1a1a4e]">{percent(c.counts.present, c.total)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-200 p-5">
              <h2 className="text-xl font-bold text-slate-900">Students</h2>
              <p className="mt-1 text-sm text-slate-500">{lines.length} students</p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-slate-50 text-sm text-slate-600">
                  <tr>
                    <th className="px-5 py-4">ID</th>
                    <th className="px-5 py-4">Student</th>
                    <th className="px-5 py-4">Class</th>
                    {visibleSessions.map((n) => <th key={n} className="px-5 py-4 text-center">S{n}</th>)}
                    <th className="px-5 py-4 text-center">Overall</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {lines.map((l) => {
                    const overall = lineStatus(l, upTo);
                    return (
                      <tr key={`${l.className}-${l.code}`} className="hover:bg-slate-50">
                        <td className="px-5 py-4 text-slate-500">{l.code}</td>
                        <td className="px-5 py-4 font-medium text-slate-900">
                          <Link to={`/students/${l.studentId}`} className="hover:underline">{l.name}</Link>
                        </td>
                        <td className="px-5 py-4 text-slate-600">{l.className}</td>
                        {visibleSessions.map((n) => {
                          const s = l.sessions[n];
                          return (
                            <td key={n} className="px-5 py-4 text-center">
                              {s ? (
                                <span className={`rounded-full px-3 py-1 text-xs font-semibold ${badge[s]}`}>{LABEL[s]}</span>
                              ) : (
                                <span className="text-slate-300">-</span>
                              )}
                            </td>
                          );
                        })}
                        <td className="px-5 py-4 text-center">
                          {overall ? (
                            <span className={`rounded-full px-3 py-1 text-xs font-bold ${badge[overall]}`}>{LABEL[overall]}</span>
                          ) : (
                            <span className="text-slate-300">-</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </Layout>
  );
}
