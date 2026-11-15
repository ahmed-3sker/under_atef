import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { errorMessage } from "../api/base";
import { getClassReport, getClasses, getStudents, submitReport } from "../api/endpoints";
import type { Status } from "../api/types";
import Layout from "../components/Layout";
import { LABEL, SESSIONS, STATUSES, buttonStyle, todayISO } from "../lib/attendance";
import { useFetch } from "../lib/use_fetch";

type Marks = Record<string, Status>;

export default function Attendance() {
  const { classId = "" } = useParams();

  const [date, setDate] = useState(todayISO);
  const [session, setSession] = useState(1);
  const key = `${classId}|${date}|${session}`;

  const classes = useFetch("classes", getClasses);
  const students = useFetch(classId, () => getStudents(classId));
  const saved = useFetch(key, () => getClassReport(classId, date, session));

  // Edits are keyed by class/date/session, so switching any of them drops unsaved edits
  // and shows what's already saved for the new selection.
  const [edits, setEdits] = useState<{ key: string; marks: Marks } | null>(null);
  const [notice, setNotice] = useState<{ key: string; text: string; ok: boolean } | null>(null);
  const [saving, setSaving] = useState(false);

  const className = classes.data?.find((c) => c._id === classId)?.name;
  const roster = students.data ?? [];

  const savedMarks: Marks = {};
  saved.data?.records.forEach((r) => {
    savedMarks[r.student] = r.status;
  });
  const marks = edits?.key === key ? edits.marks : savedMarks;

  function mark(id: string, status: Status) {
    setEdits({ key, marks: { ...marks, [id]: status } });
  }

  function markAll(status: Status) {
    setEdits({ key, marks: Object.fromEntries(roster.map((s) => [s._id, status])) });
  }

  const counts = { present: 0, absent: 0, excused: 0 };
  roster.forEach((s) => {
    const m = marks[s._id];
    if (m) counts[m] += 1;
  });
  const unmarked = roster.length - counts.present - counts.absent - counts.excused;

  async function save() {
    if (unmarked > 0) {
      setNotice({ key, ok: false, text: `Mark every student first (${unmarked} left).` });
      return;
    }
    setSaving(true);
    try {
      await submitReport({
        classId, date, session,
        records: roster.map((s) => ({ studentId: s._id, status: marks[s._id] })),
      });
      setNotice({ key, ok: true, text: "Attendance saved." });
      saved.reload();
    } catch (err) {
      setNotice({ key, ok: false, text: errorMessage(err) });
    } finally {
      setSaving(false);
    }
  }

  const message = notice?.key === key ? notice : null;
  const inputClass =
    "w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100";

  return (
    <Layout>
      <Link to="/attendance" className="mb-6 inline-block font-semibold text-blue-600 hover:text-blue-800">
        ← Back to Classes
      </Link>

      <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <p className="text-sm font-semibold uppercase tracking-widest text-blue-600">Attendance Management</p>
          <h1 className="mt-2 text-3xl font-bold text-slate-900">Class {className ?? "..."}</h1>
        </div>
        <div className="rounded-xl bg-white px-5 py-3 shadow-sm">
          <p className="text-sm text-slate-500">Total Students</p>
          <p className="text-2xl font-bold text-slate-900">{roster.length}</p>
        </div>
      </div>

      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="rounded-xl border border-slate-200 bg-white p-5">
          <label htmlFor="attendance-date" className="mb-2 block font-semibold text-slate-700">Attendance Date</label>
          <input
            id="attendance-date" type="date" value={date} max={todayISO()}
            onChange={(e) => setDate(e.target.value || todayISO())} className={inputClass}
          />
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-5">
          <label htmlFor="attendance-session" className="mb-2 block font-semibold text-slate-700">Session</label>
          <select
            id="attendance-session" value={session}
            onChange={(e) => setSession(Number(e.target.value))} className={inputClass}
          >
            {SESSIONS.map((n) => <option key={n} value={n}>Session {n}</option>)}
          </select>
        </div>
      </div>

      <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          { label: "Present", count: counts.present, color: "text-green-700 bg-green-50" },
          { label: "Absent", count: counts.absent, color: "text-red-700 bg-red-50" },
          { label: "Excused", count: counts.excused, color: "text-blue-700 bg-blue-50" },
          { label: "Unmarked", count: unmarked, color: "text-slate-700 bg-slate-200" },
        ].map((item) => (
          <div key={item.label} className={`rounded-xl p-4 ${item.color}`}>
            <p className="text-sm font-medium">{item.label}</p>
            <p className="mt-1 text-2xl font-bold">{item.count}</p>
          </div>
        ))}
      </div>

      {(students.error || saved.error || classes.error) && (
        <p role="alert" className="mb-4 rounded-lg bg-red-50 p-3 text-red-600">
          {students.error ?? saved.error ?? classes.error}
        </p>
      )}

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-col justify-between gap-3 border-b border-slate-200 p-5 sm:flex-row sm:items-center">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Student Attendance</h2>
            <p className="mt-1 text-sm text-slate-500">
              {date} · Session {session}
              {saved.data && " · already saved, saving again overwrites it"}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button onClick={() => markAll("present")} className="rounded-lg bg-green-100 px-3 py-2 text-sm font-semibold text-green-800 hover:bg-green-200">
              All Present
            </button>
            <button onClick={() => markAll("absent")} className="rounded-lg bg-red-100 px-3 py-2 text-sm font-semibold text-red-800 hover:bg-red-200">
              All Absent
            </button>
          </div>
        </div>

        {(students.loading || saved.loading) && <p className="p-5 text-slate-500">Loading...</p>}
        {!students.loading && roster.length === 0 && !students.error && (
          <p className="p-5 text-slate-500">This class has no students yet. An admin can add them from the Students page.</p>
        )}

        <div className="divide-y divide-slate-100">
          {roster.map((s) => (
            <div key={s._id} className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="font-medium text-slate-900">{s.name}</p>
                <p className="text-sm text-slate-500">{s.studentId}</p>
              </div>
              <div className="grid grid-cols-3 gap-2 sm:flex sm:gap-3">
                {STATUSES.map((status) => (
                  <button
                    key={status} onClick={() => mark(s._id, status)} aria-pressed={marks[s._id] === status}
                    className={`rounded-lg px-3 py-2.5 text-sm font-semibold transition ${buttonStyle(status, marks[s._id] === status)}`}
                  >
                    {LABEL[status]}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="flex flex-col gap-3 border-t border-slate-200 p-5 sm:flex-row sm:items-center sm:justify-between">
          <p aria-live="polite" className={`text-sm ${message ? (message.ok ? "text-green-700" : "text-red-600") : "text-slate-600"}`}>
            {message?.text ?? `${roster.length - unmarked} of ${roster.length} students marked.`}
          </p>
          <button
            onClick={save} disabled={saving || roster.length === 0}
            className="rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white shadow-sm hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {saving ? "Saving..." : "Save Attendance"}
          </button>
        </div>
      </div>
    </Layout>
  );
}
