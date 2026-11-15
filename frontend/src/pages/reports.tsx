import { useMemo, useState } from "react";
import stemIcon from "../assets/stem_icon.png";


const SCHOOL_NAME = "STEM 6th of October";
const SCHOOL_TAGLINE = "STEM High School for Boys 6th of October";


type Status = "Present" | "Absent" | "Excused";

type StudentRecord = {
  studentId: string;
  name: string;
  status: Status;
};

type AttendanceData = Record<
  string, 
  Record<
    string,
    { sessions: Record<string, { students: StudentRecord[] }> }
  >
>;
 
const sampleStudents10A: StudentRecord[] = [
  { studentId: "S01", name: "Student 01", status: "Present" },
  { studentId: "S02", name: "Student 02", status: "Absent" },
  { studentId: "S03", name: "Student 03", status: "Excused" },
];

const sampleStudents10B: StudentRecord[] = [
  { studentId: "S01", name: "Student 01", status: "Present" },
  { studentId: "S02", name: "Student 02", status: "Present" },
  { studentId: "S03", name: "Student 03", status: "Excused" },
];

const emptySessions = () =>
  Object.fromEntries(
    ["1", "2", "3", "4", "5"].map((s) => [s, { students: [] as StudentRecord[] }])
  );


const attendanceData: AttendanceData = {
  "2026-10-27": {
    "10A": {
      sessions: Object.fromEntries(
        ["1", "2", "3", "4", "5"].map((s) => [s, { students: sampleStudents10A }])
      ),
    },
    "10B": {
      sessions: Object.fromEntries(
        ["1", "2", "3", "4", "5"].map((s) => [s, { students: sampleStudents10B }])
      ), },
  },
  "2026-10-28": {
    "10A": { sessions: emptySessions() },
  },
};


const STATUSES: Status[] = ["Present", "Absent", "Excused"];
const SESSION_NUMBERS = ["1", "2", "3", "4", "5"];
const LAST_SESSION = SESSION_NUMBERS.length;

const statusBadge: Record<Status, string> = {
  Present: "bg-green-100 text-green-800",
  Absent: "bg-red-100 text-red-800",
  Excused: "bg-blue-100 text-blue-800",
};

const summaryStyle: Record<Status, string> = {
  Present: "bg-green-50 text-green-700",
  Absent: "bg-red-50 text-red-700",
  Excused: "bg-blue-50 text-blue-700",
};

type StudentLine = {
  className: string;
  studentId: string;
  name: string;
  sessions: Record<string, Status>;
};

function dayStatus(
  sessions: Record<string, Status>,
  upTo: number
): Status | null {
  const seen = SESSION_NUMBERS.filter((n) => Number(n) <= upTo)
    .map((n) => sessions[n])
    .filter(Boolean) as Status[];

  if (seen.length === 0) return null;
  if (seen.includes("Absent")) return "Absent";
  if (seen.includes("Excused")) return "Excused";
  return "Present";
}

function countStudents(lines: StudentLine[], upTo: number) {
  const counts: Record<Status, number> = {
    Present: 0,
    Absent: 0,
    Excused: 0,
  };
  let total = 0;

  lines.forEach((line) => {
    const status = dayStatus(line.sessions, upTo);
    if (status) {
      counts[status] += 1;
      total += 1;
    }
  });
const totalAbsent = counts.Absent + counts.Excused;

return { counts, total, totalAbsent };
}

function percent(part: number, total: number) {
  return total === 0 ? "—" : `${Math.round((part / total) * 100)}%`;
}

export default function Reports() {
  const data = attendanceData;

  const dates = useMemo(() => Object.keys(data).sort().reverse(), [data]);
  const defaultDate = useMemo(() => {
    const withRecords = dates.find((d) =>
      Object.values(data[d]).some((c) =>
        Object.values(c.sessions).some((s) => s.students.length > 0)
      )
    );
    return withRecords ?? dates[0] ?? "";
  }, [dates, data]);

  const [date, setDate] = useState(defaultDate);
  const [classFilter, setClassFilter] = useState("all");
  const [sessionFilter, setSessionFilter] = useState("all");
  const upTo = sessionFilter === "all" ? LAST_SESSION : Number(sessionFilter);

  const classesForDate = useMemo(
    () => Object.keys(data[date] ?? {}).sort(),
    [data, date]
  );

  function changeDate(newDate: string) {
    setDate(newDate);
    setClassFilter("all");
  }
  const studentLines: StudentLine[] = useMemo(() => {
    const map = new Map<string, StudentLine>();
    const day = data[date] ?? {};

    Object.entries(day).forEach(([className, classData]) => {
      if (classFilter !== "all" && classFilter !== className) return;

      Object.entries(classData.sessions).forEach(([session, sessionData]) => {
        sessionData.students.forEach((student) => {
          const key = `${className}-${student.studentId}`;
          if (!map.has(key)) {
            map.set(key, {
              className,
              studentId: student.studentId,
              name: student.name,
              sessions: {},
            });
          }
          map.get(key)!.sessions[session] = student.status;
        });
      });
    });

    return Array.from(map.values()).sort(
      (a, b) =>
        a.className.localeCompare(b.className) ||
        a.studentId.localeCompare(b.studentId)
    );
  }, [data, date, classFilter]);
  const { counts: totals, total: totalStudents, totalAbsent } = useMemo(
    () => countStudents(studentLines, upTo),
    [studentLines, upTo]
  );
  const absentBySession = useMemo(
    () =>
      SESSION_NUMBERS.filter((n) => Number(n) <= upTo).map((n) => ({
        session: n,
        absent: countStudents(studentLines, Number(n)).totalAbsent,
      })),
    [studentLines, upTo]
  );

  const classSummary = useMemo(() => {
    const names = Array.from(new Set(studentLines.map((s) => s.className))).sort();
    return names.map((name) => {
      const lines = studentLines.filter((s) => s.className === name);
      const { counts, total, totalAbsent } = countStudents(lines, upTo);
      return { name, total, counts, totalAbsent };
    });
  }, [studentLines, upTo]);

  const visibleSessions = SESSION_NUMBERS.filter((n) => Number(n) <= upTo);

  const inputClass =
    "w-full rounded-lg border border-slate-300 bg-white px-4 py-3 outline-none focus:border-[#1a1a4e] focus:ring-2 focus:ring-[#1a1a4e]/20";
  return (
    <div className="flex min-h-screen flex-col bg-slate-100">
      <header className="bg-[#1a1a4e] shadow-lg">
        <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
         
          <div className="flex items-center gap-3">
            <div className="flex h-14 w-14 items-center justify-center rounded-lg font-bold uppercase tracking-wider text-white/60">
              <img  src={stemIcon} className="mx-auto" alt="logo" />
            </div>

            <div className="leading-tight">
              <p className="text-xl font-extrabold tracking-wide text-white sm:text-2xl">
                {SCHOOL_NAME}
              </p>
              <p className="text-xs text-white/80">{SCHOOL_TAGLINE}</p>
            </div>
          </div>

          <p className="hidden text-sm font-bold uppercase tracking-wider text-white sm:block">
            Attendance Management System
          </p>
        </nav>
      </header>

      <main className="flex-1 p-4 sm:p-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8">
            <p className="text-sm font-semibold uppercase tracking-widest text-[#1a1a4e]">
              Attendance Reports
            </p>
            <h1 className="mt-2 text-3xl font-bold text-slate-900">
              Daily Attendance Report
            </h1>
            <p className="mt-2 text-slate-600">
              Absences build up session by session. The last session shows the
              day's total.
            </p>
          </div>
          <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="rounded-xl border border-slate-200 bg-white p-5">
              <label htmlFor="report-date" className="mb-2 block font-semibold text-slate-700">
                Date
              </label>
              <select
                id="report-date"
                value={date}
                onChange={(e) => changeDate(e.target.value)}
                className={inputClass}
              >
                {dates.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white p-5">
              <label htmlFor="report-class" className="mb-2 block font-semibold text-slate-700">
                Class
              </label>
              <select
                id="report-class"
                value={classFilter}
                onChange={(e) => setClassFilter(e.target.value)}
                className={inputClass}
              >
                <option value="all">All classes</option>
                {classesForDate.map((c) => (
                  <option key={c} value={c}>
                    Class {c}
                  </option>
                ))}
              </select>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white p-5">
              <label htmlFor="report-session" className="mb-2 block font-semibold text-slate-700">
                Up to session
              </label>
              <select
                id="report-session"
                value={sessionFilter}
                onChange={(e) => setSessionFilter(e.target.value)}
                className={inputClass}
              >
                <option value="all">Full day (all sessions)</option>
                {SESSION_NUMBERS.map((s) => (
                  <option key={s} value={s}>
                    Through session {s}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {totalStudents === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center">
              <p className="text-lg font-semibold text-slate-800">
                No attendance recorded
              </p>
              <p className="mt-1 text-slate-500">
                Nothing has been saved for this date, class and session yet.
              </p>
            </div>
          ) : (
            <>
              <div className="mb-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
                {STATUSES.map((status) => (
                  <div key={status} className={`rounded-xl p-4 ${summaryStyle[status]}`}>
                    <p className="text-sm font-medium">
                      {status === "Absent" ? "Total Absent" : status}
                    </p>
                    <p className="mt-1 text-2xl font-bold">{totals[status]}</p>
                    <p className="text-xs opacity-80">
                      {percent(totals[status], totalStudents)} of students
                    </p>
                  </div>
                ))}

                <div className="rounded-xl bg-[#1a1a4e] p-4 text-white">
                  <p className="text-sm font-medium text-white/80">Total Students</p>
                  <p className="mt-1 text-2xl font-bold">{totalStudents}</p>
                  <p className="text-xs text-white/70">
                    {percent(totals.Present, totalStudents)} present all day
                  </p>
                </div>
              </div>
              <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <h2 className="text-xl font-bold text-slate-900">
                  Absences by Session
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Students absent so far. Each session adds to the previous one.
                </p>
                <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-5">
                  {absentBySession.map((item, index) => {
                    const isLast = index === absentBySession.length - 1;
                    return (
                      <div
                        key={item.session}
                        className={`rounded-xl p-4 ${
                          isLast
                            ? "bg-red-600 text-white"
                            : "bg-red-50 text-red-700"
                        }`}
                      >
                        <p className="text-sm font-medium">
                          {isLast
                            ? `Session ${item.session} · Total`
                            : `Session ${item.session}`}
                        </p>
                        <p className="mt-1 text-2xl font-bold">{item.absent}</p>
                      </div>
                    );
                  })}
                </div>
              </div>
              <div className="mb-6 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                <div className="border-b border-slate-200 p-5">
                  <h2 className="text-xl font-bold text-slate-900">By Class</h2>
                  <p className="mt-1 text-sm text-slate-500">
                    {date} ·{" "}
                    {sessionFilter === "all"
                      ? "Full day"
                      : `Through session ${sessionFilter}`}
                  </p>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead className="bg-slate-50 text-sm text-slate-600">
                      <tr>
                        <th className="px-5 py-4">Class</th>
                        <th className="px-5 py-4">Students</th>
                        {STATUSES.map((s) => (
                          <th key={s} className="px-5 py-4">
                            {s}
                          </th>
                        ))}
                        <th className="px-5 py-4">Present Rate</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {classSummary.map((c) => (
                        <tr key={c.name} className="hover:bg-slate-50">
                          <td className="px-5 py-4 font-semibold text-slate-900">
                            {c.name}
                          </td>
                          <td className="px-5 py-4 text-slate-600">{c.total}</td>
                          {STATUSES.map((s) => (
                            <td key={s} className="px-5 py-4 text-slate-700">
                              {c.counts[s]}
                            </td>
                          ))}
                          <td className="px-5 py-4 font-semibold text-[#1a1a4e]">
                            {percent(c.counts.Present, c.total)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
              <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                <div className="border-b border-slate-200 p-5">
                  <h2 className="text-xl font-bold text-slate-900">Students</h2>
                  <p className="mt-1 text-sm text-slate-500">
                    {studentLines.length} students
                  </p>
                </div>
                <div className="divide-y divide-slate-100 md:hidden">
                  {studentLines.map((s) => {
                    const overall = dayStatus(s.sessions, upTo);
                    return (
                      <div key={`${s.className}-${s.studentId}`} className="p-4">
                        <div className="mb-3 flex items-center justify-between gap-3">
                          <div>
                            <p className="font-medium text-slate-900">{s.name}</p>
                            <span className="text-sm text-slate-500">
                              {s.className} · {s.studentId}
                            </span>
                          </div>
                          {overall && (
                            <span
                              className={`rounded-full px-3 py-1 text-xs font-semibold ${statusBadge[overall]}`}
                            >
                              {overall}
                            </span>
                          )}
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {visibleSessions.map((n) => {
                            const status = s.sessions[n];
                            return (
                              <span
                                key={n}
                                className={`rounded-full px-3 py-1 text-xs font-semibold ${
                                  status
                                    ? statusBadge[status]
                                    : "bg-slate-100 text-slate-400"
                                }`}
                              >
                                S{n}: {status ?? "—"}
                              </span>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>
                <div className="hidden overflow-x-auto md:block">
                  <table className="w-full text-left">
                    <thead className="bg-slate-50 text-sm text-slate-600">
                      <tr>
                        <th className="px-5 py-4">ID</th>
                        <th className="px-5 py-4">Student</th>
                        <th className="px-5 py-4">Class</th>
                        {visibleSessions.map((n) => (
                          <th key={n} className="px-5 py-4 text-center">
                            Session {n}
                          </th>
                        ))}
                        <th className="px-5 py-4 text-center">Overall</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {studentLines.map((s) => {
                        const overall = dayStatus(s.sessions, upTo);
                        return (
                          <tr
                            key={`${s.className}-${s.studentId}`}
                            className="hover:bg-slate-50"
                          >
                            <td className="px-5 py-4 text-slate-500">{s.studentId}</td>
                            <td className="px-5 py-4 font-medium text-slate-900">
                              {s.name}
                            </td>
                            <td className="px-5 py-4 text-slate-600">{s.className}</td>
                            {visibleSessions.map((n) => {
                              const status = s.sessions[n];
                              return (
                                <td key={n} className="px-5 py-4 text-center">
                                  {status ? (
                                    <span
                                      className={`rounded-full px-3 py-1 text-xs font-semibold ${statusBadge[status]}`}
                                    >
                                      {status}
                                    </span>
                                  ) : (
                                    <span className="text-slate-300">—</span>
                                  )}
                                </td>
                              );
                            })}
                            <td className="px-5 py-4 text-center">
                              {overall ? (
                                <span
                                  className={`rounded-full px-3 py-1 text-xs font-bold ${statusBadge[overall]}`}
                                >
                                  {overall}
                                </span>
                              ) : (
                                <span className="text-slate-300">—</span>
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
        </div>
      </main>
      <footer className="bg-[#0b0b1e] text-white">
          <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-[1.2fr_1.8fr]">
            <div>
              <h3 className="mb-6 text-2xl font-bold">Site Map</h3>
              <div className="grid grid-cols-2 gap-y-3 text-slate-400">
                <a href="https://www.stemegypt.net/" target="_blank" rel="noopener noreferrer">
                  School Website
                </a>
                <a href="https://web.facebook.com/STEM6october/?_rdc=1&_rdr#" target="_blank" rel="noopener noreferrer">
                  Facebook
                </a>
                <p>Contact Us</p>
                <p></p>
                <a href="mailto:counselor@stemegypt.edu.eg" target="_blank" rel="noopener noreferrer">
                  Email
                </a>
                <a href="https://wa.me/+201159114973" target="_blank" rel="noopener noreferrer">
                  Phone
                </a>
                <a href="../classes">
                  classes
                </a>
              </div>
            </div>
            <div>
              <h3 className="mb-6 text-2xl font-bold">About Us</h3>
              <div className="flex gap-4">
                <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-lg  text-[10px] uppercase text-white/50">
                  <img
                    src={stemIcon}
                    className="mx-auto"
                    alt="logo"
                  />
                </div>
                <div>
                  <h4 className="text-lg font-bold">{SCHOOL_NAME}</h4>
                  <p className="mt-2 text-slate-400">
                    A public high school that provides top-notch education for
                    academically-motivated students.
                  </p>
                  <p className="mt-4 text-slate-400">Cosmic Village, 6th October, Egypt</p>
                </div>
              </div>
            </div>
          </div>
          <div className="mx-auto max-w-6xl border-t border-white/10 px-4 py-5 sm:px-6">
            <div className="flex flex-col items-center justify-between gap-2 text-sm font-semibold sm:flex-row">
              <p>Copyright © {new Date().getFullYear()} All Rights Reserved</p>
              <p>
                Managed by{<a href="https://github.com/ahmed-3sker" target="_blank"> 3sker</a>} &nbsp; {<a href="https://github.com/hazorox" target="_blank">hazoro</a>}
              </p>
            </div>
          </div>
        </footer>
    </div>
  );
}