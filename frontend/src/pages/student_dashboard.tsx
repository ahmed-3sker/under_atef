import { Link, useParams } from "react-router-dom";
import { getStudent, getStudentHistory } from "../api/endpoints";
import type { Status } from "../api/types";
import Layout from "../components/Layout";
import { LABEL, SESSIONS, STATUSES, badge, dayStatus, dot, percent } from "../lib/attendance";
import { useFetch } from "../lib/use_fetch";

export default function StudentDashboard() {
  const { id = "" } = useParams();
  const student = useFetch(id, () => getStudent(id));
  const history = useFetch(id, () => getStudentHistory(id));

  const days = (history.data ?? []).map((d) => {
    const sessions = SESSIONS.map((n) => d.sessions[n] as Status | undefined);
    return { date: d.date, sessions, overall: dayStatus(sessions.filter(Boolean) as Status[]) ?? "present" };
  });

  const dayCount = (s: Status) => days.filter((d) => d.overall === s).length;
  const presentDays = dayCount("present");
  const excusedDays = dayCount("excused");
  const totalAbsentDays = dayCount("absent") + excusedDays;

  const sessionCounts: Record<Status, number> = { present: 0, absent: 0, excused: 0 };
  days.forEach((d) => d.sessions.forEach((s) => s && (sessionCounts[s] += 1)));
  const totalSessions = sessionCounts.present + sessionCounts.absent + sessionCounts.excused;
  const recent = [...days].reverse();

  const className =
    typeof student.data?.class === "object" ? student.data.class.name : "";

  return (
    <Layout>
      <Link to="/students" className="mb-6 inline-block font-semibold text-[#1a1a4e] hover:underline">← Back</Link>

      {(student.error || history.error) && (
        <p role="alert" className="mb-4 rounded-lg bg-red-50 p-3 text-red-600">{student.error ?? history.error}</p>
      )}
      {(student.loading || history.loading) && <p className="text-slate-500">Loading...</p>}

      {student.data && (
        <>
          <div className="mb-6 flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:flex-row sm:items-center">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-[#1a1a4e] text-2xl font-bold text-white">
              {student.data.name.charAt(0)}
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold uppercase tracking-widest text-[#1a1a4e]">Student Dashboard</p>
              <h1 className="mt-1 text-3xl font-bold text-slate-900">{student.data.name}</h1>
              <p className="mt-1 text-slate-500">{student.data.studentId} · Class {className}</p>
            </div>
            <div className="rounded-xl bg-[#1a1a4e] px-6 py-4 text-white">
              <p className="text-sm text-white/80">Present Rate</p>
              <p className="text-3xl font-bold">{percent(presentDays, days.length)}</p>
            </div>
          </div>

          {days.length === 0 && !history.loading && (
            <p className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center text-slate-500">
              No attendance recorded for this student yet.
            </p>
          )}

          {days.length > 0 && (
            <>
              <div className="mb-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
                <div className="rounded-xl bg-green-50 p-4 text-green-700">
                  <p className="text-sm font-medium">Days Present</p>
                  <p className="mt-1 text-2xl font-bold">{presentDays}</p>
                  <p className="text-xs opacity-80">{percent(presentDays, days.length)} of days</p>
                </div>
                <div className="rounded-xl bg-red-50 p-4 text-red-700">
                  <p className="text-sm font-medium">Total Absent Days</p>
                  <p className="mt-1 text-2xl font-bold">{totalAbsentDays}</p>
                  <p className="text-xs opacity-80">Absent + Excused</p>
                </div>
                <div className="rounded-xl bg-blue-50 p-4 text-blue-700">
                  <p className="text-sm font-medium">Excused Days</p>
                  <p className="mt-1 text-2xl font-bold">{excusedDays}</p>
                  <p className="text-xs opacity-80">{percent(excusedDays, days.length)} of days</p>
                </div>
                <div className="rounded-xl bg-[#1a1a4e] p-4 text-white">
                  <p className="text-sm font-medium text-white/80">Days Recorded</p>
                  <p className="mt-1 text-2xl font-bold">{days.length}</p>
                  <p className="text-xs text-white/70">{totalSessions} sessions</p>
                </div>
              </div>

              <div className="mb-6 grid grid-cols-1 gap-4 lg:grid-cols-2">
                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                  <h2 className="text-xl font-bold text-slate-900">Day by Day</h2>
                  <p className="mt-1 text-sm text-slate-500">Each square is one school day. Hover to see the date.</p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {days.map((d) => (
                      <div key={d.date} title={`${d.date}: ${LABEL[d.overall]}`} className={`h-9 w-9 rounded-lg ${dot[d.overall]}`} />
                    ))}
                  </div>
                  <div className="mt-4 flex flex-wrap gap-4 text-sm text-slate-600">
                    {STATUSES.map((s) => (
                      <span key={s} className="flex items-center gap-2">
                        <span className={`h-3 w-3 rounded ${dot[s]}`} />
                        {LABEL[s]}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                  <h2 className="text-xl font-bold text-slate-900">Session Breakdown</h2>
                  <p className="mt-1 text-sm text-slate-500">{totalSessions} sessions recorded in total.</p>
                  <div className="mt-4 space-y-3">
                    {STATUSES.map((s) => (
                      <div key={s}>
                        <div className="mb-1 flex justify-between text-sm">
                          <span className="font-medium text-slate-700">{LABEL[s]}</span>
                          <span className="text-slate-500">{sessionCounts[s]} · {percent(sessionCounts[s], totalSessions)}</span>
                        </div>
                        <div className="h-3 overflow-hidden rounded-full bg-slate-100">
                          <div
                            className={`h-full rounded-full ${dot[s]}`}
                            style={{ width: `${totalSessions ? Math.round((sessionCounts[s] / totalSessions) * 100) : 0}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                <div className="border-b border-slate-200 p-5">
                  <h2 className="text-xl font-bold text-slate-900">Attendance History</h2>
                  <p className="mt-1 text-sm text-slate-500">Newest first.</p>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead className="bg-slate-50 text-sm text-slate-600">
                      <tr>
                        <th className="px-5 py-4">Date</th>
                        {SESSIONS.map((n) => <th key={n} className="px-5 py-4 text-center">S{n}</th>)}
                        <th className="px-5 py-4 text-center">Overall</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {recent.map((d) => (
                        <tr key={d.date} className="hover:bg-slate-50">
                          <td className="px-5 py-4 font-medium text-slate-900">{d.date}</td>
                          {d.sessions.map((s, i) => (
                            <td key={i} className="px-5 py-4 text-center">
                              {s ? (
                                <span className={`rounded-full px-3 py-1 text-xs font-semibold ${badge[s]}`}>{LABEL[s]}</span>
                              ) : (
                                <span className="text-slate-300">-</span>
                              )}
                            </td>
                          ))}
                          <td className="px-5 py-4 text-center">
                            <span className={`rounded-full px-3 py-1 text-xs font-bold ${badge[d.overall]}`}>{LABEL[d.overall]}</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}
        </>
      )}
    </Layout>
  );
}
