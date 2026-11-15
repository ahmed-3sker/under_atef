import { useNavigate } from "react-router-dom";
import stemIcon from "../assets/stem_icon.png";

const SCHOOL_NAME = "STEM 6th of October";
const SCHOOL_TAGLINE = "STEM High School for Boys 6th of October";

type Status = "Present" | "Absent" | "Excused";
const student = {
  studentId: "S02",
  name: "Student 02",
  className: "10A",
};
const fakeDays: { date: string; sessions: string }[] = [
  { date: "2026-10-01", sessions: "PPPPP" },
  { date: "2026-10-04", sessions: "PPPPP" },
  { date: "2026-10-05", sessions: "PPAAA" },
  { date: "2026-10-06", sessions: "PPPPP" },
  { date: "2026-10-07", sessions: "EEEEE" },
  { date: "2026-10-08", sessions: "PPPPP" },
  { date: "2026-10-11", sessions: "PPPPP" },
  { date: "2026-10-12", sessions: "AAAAA" },
  { date: "2026-10-13", sessions: "PPPPP" },
  { date: "2026-10-14", sessions: "PPPEE" },
  { date: "2026-10-15", sessions: "PPPPP" },
  { date: "2026-10-18", sessions: "PPPPP" },
  { date: "2026-10-19", sessions: "PPPPP" },
  { date: "2026-10-20", sessions: "PAAAA" },
  { date: "2026-10-21", sessions: "PPPPP" },
  { date: "2026-10-22", sessions: "PPPPP" },
  { date: "2026-10-25", sessions: "EEEEE" },
  { date: "2026-10-26", sessions: "PPPPP" },
  { date: "2026-10-27", sessions: "AAAAA" },
  { date: "2026-10-28", sessions: "PPPPP" },
  { date: "2026-10-29", sessions: "PPPPP" },
];


const LETTER: Record<string, Status> = {
  P: "Present",
  A: "Absent",
  E: "Excused",
};

const STATUSES: Status[] = ["Present", "Absent", "Excused"];
const SESSION_NUMBERS = [1, 2, 3, 4, 5];

const statusBadge: Record<Status, string> = {
  Present: "bg-green-100 text-green-800",
  Absent: "bg-red-100 text-red-800",
  Excused: "bg-blue-100 text-blue-800",
};

const statusDot: Record<Status, string> = {
  Present: "bg-green-500",
  Absent: "bg-red-500",
  Excused: "bg-blue-500",
};

function dayStatus(sessions: Status[]): Status {
  if (sessions.includes("Absent")) return "Absent";
  if (sessions.includes("Excused")) return "Excused";
  return "Present";
}

function percent(part: number, total: number) {
  return total === 0 ? "—" : `${Math.round((part / total) * 100)}%`;
}

const days = fakeDays.map((d) => {
  const sessions = d.sessions.split("").map((l) => LETTER[l]);
  return { date: d.date, sessions, overall: dayStatus(sessions) };
});

export default function StudentDashboard() {
  const navigate = useNavigate();

  const presentDays = days.filter((d) => d.overall === "Present").length;
  const absentDays = days.filter((d) => d.overall === "Absent").length;
  const excusedDays = days.filter((d) => d.overall === "Excused").length;
  const totalAbsentDays = absentDays + excusedDays; // Absent + Excused

  const sessionCounts: Record<Status, number> = {
    Present: 0,
    Absent: 0,
    Excused: 0,
  };
  days.forEach((d) =>
    d.sessions.forEach((s) => {
      sessionCounts[s] += 1;
    })
  );
  const totalSessions =
    sessionCounts.Present + sessionCounts.Absent + sessionCounts.Excused;

  const recent = [...days].reverse(); 

  return (
    <div className="flex min-h-screen flex-col bg-slate-100">
      <header className="bg-[#1a1a4e] shadow-lg">
        <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-14 w-14 items-center justify-center rounded-lg font-bold uppercase tracking-wider text-white/60">
              <img src={stemIcon} className="mx-auto" alt="logo" />
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
          <button
            onClick={() => navigate(-1)}
            className="mb-6 font-semibold text-[#1a1a4e] hover:underline"
          >
            ← Back
          </button>

       
          <div className="mb-6 flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:flex-row sm:items-center">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-[#1a1a4e] text-2xl font-bold text-white">
              {student.name.charAt(0)}
            </div>

            <div className="flex-1">
              <p className="text-sm font-semibold uppercase tracking-widest text-[#1a1a4e]">
                Student Dashboard
              </p>
              <h1 className="mt-1 text-3xl font-bold text-slate-900">
                {student.name}
              </h1>
              <p className="mt-1 text-slate-500">
                {student.studentId} · Class {student.className}
              </p>
            </div>

            <div className="rounded-xl bg-[#1a1a4e] px-6 py-4 text-white">
              <p className="text-sm text-white/80">Present Rate</p>
              <p className="text-3xl font-bold">
                {percent(presentDays, days.length)}
              </p>
            </div>
          </div>

    
          <div className="mb-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
            <div className="rounded-xl bg-green-50 p-4 text-green-700">
              <p className="text-sm font-medium">Days Present</p>
              <p className="mt-1 text-2xl font-bold">{presentDays}</p>
              <p className="text-xs opacity-80">
                {percent(presentDays, days.length)} of days
              </p>
            </div>

            <div className="rounded-xl bg-red-50 p-4 text-red-700">
              <p className="text-sm font-medium">Total Absent Days</p>
              <p className="mt-1 text-2xl font-bold">{totalAbsentDays}</p>
              <p className="text-xs opacity-80">Absent + Excused</p>
            </div>

            <div className="rounded-xl bg-blue-50 p-4 text-blue-700">
              <p className="text-sm font-medium">Excused Days</p>
              <p className="mt-1 text-2xl font-bold">{excusedDays}</p>
              <p className="text-xs opacity-80">
                {percent(excusedDays, days.length)} of days
              </p>
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
              <p className="mt-1 text-sm text-slate-500">
                Each square is one school day. Hover to see the date.
              </p>

              <div className="mt-4 flex flex-wrap gap-2">
                {days.map((d) => (
                  <div
                    key={d.date}
                    title={`${d.date}: ${d.overall}`}
                    className={`h-9 w-9 rounded-lg ${statusDot[d.overall]}`}
                  />
                ))}
              </div>

              <div className="mt-4 flex flex-wrap gap-4 text-sm text-slate-600">
                {STATUSES.map((s) => (
                  <span key={s} className="flex items-center gap-2">
                    <span className={`h-3 w-3 rounded ${statusDot[s]}`} />
                    {s}
                  </span>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <h2 className="text-xl font-bold text-slate-900">
                Session Breakdown
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                {totalSessions} sessions recorded in total.
              </p>

              <div className="mt-4 space-y-3">
                {STATUSES.map((s) => {
                  const count = sessionCounts[s];
                  const width =
                    totalSessions === 0
                      ? 0
                      : Math.round((count / totalSessions) * 100);
                  return (
                    <div key={s}>
                      <div className="mb-1 flex justify-between text-sm">
                        <span className="font-medium text-slate-700">{s}</span>
                        <span className="text-slate-500">
                          {count} · {percent(count, totalSessions)}
                        </span>
                      </div>
                      <div className="h-3 overflow-hidden rounded-full bg-slate-100">
                        <div
                          className={`h-full rounded-full ${statusDot[s]}`}
                          style={{ width: `${width}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

 
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-200 p-5">
              <h2 className="text-xl font-bold text-slate-900">
                Attendance History
              </h2>
              <p className="mt-1 text-sm text-slate-500">Newest first.</p>
            </div>

            
            <div className="divide-y divide-slate-100 md:hidden">
              {recent.map((d) => (
                <div key={d.date} className="p-4">
                  <div className="mb-3 flex items-center justify-between">
                    <p className="font-medium text-slate-900">{d.date}</p>
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-bold ${statusBadge[d.overall]}`}
                    >
                      {d.overall}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {d.sessions.map((status, i) => (
                      <span
                        key={i}
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${statusBadge[status]}`}
                      >
                        S{i + 1}: {status}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>

           
            <div className="hidden overflow-x-auto md:block">
              <table className="w-full text-left">
                <thead className="bg-slate-50 text-sm text-slate-600">
                  <tr>
                    <th className="px-5 py-4">Date</th>
                    {SESSION_NUMBERS.map((n) => (
                      <th key={n} className="px-5 py-4 text-center">
                        Session {n}
                      </th>
                    ))}
                    <th className="px-5 py-4 text-center">Overall</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {recent.map((d) => (
                    <tr key={d.date} className="hover:bg-slate-50">
                      <td className="px-5 py-4 font-medium text-slate-900">
                        {d.date}
                      </td>
                      {d.sessions.map((status, i) => (
                        <td key={i} className="px-5 py-4 text-center">
                          <span
                            className={`rounded-full px-3 py-1 text-xs font-semibold ${statusBadge[status]}`}
                          >
                            {status}
                          </span>
                        </td>
                      ))}
                      <td className="px-5 py-4 text-center">
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-bold ${statusBadge[d.overall]}`}
                        >
                          {d.overall}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>


      <footer className="bg-[#0b0b1e] text-white">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-[1.2fr_1.8fr]">
          <div>
            <h3 className="mb-6 text-2xl font-bold">Site Map</h3>
            <div className="grid grid-cols-2 gap-y-3 text-slate-400">
              <a
                href="https://www.stemegypt.net/"
                target="_blank"
                rel="noopener noreferrer"
              >
                School Website
              </a>
              <a
                href="https://www.facebook.com/STEM6october/"
                target="_blank"
                rel="noopener noreferrer"
              >
                Facebook
              </a>
              <p className="col-span-2 mt-2 font-semibold text-white">
                Contact Us
              </p>
              <a href="mailto:counselor@stemegypt.edu.eg">Email</a>
              <a
                href="https://wa.me/201159114973"
                target="_blank"
                rel="noopener noreferrer"
              >
                WhatsApp
              </a>
            </div>
          </div>

          <div>
            <h3 className="mb-6 text-2xl font-bold">About Us</h3>
            <div className="flex gap-4">
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-lg">
                <img src={stemIcon} className="mx-auto" alt="logo" />
              </div>
              <div>
                <h4 className="text-lg font-bold">{SCHOOL_NAME}</h4>
                <p className="mt-2 text-slate-400">
                  A public high school that provides top-notch education for
                  academically-motivated students.
                </p>
                <p className="mt-4 text-slate-400">
                  Cosmic Village, 6th October, Egypt
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="mx-auto max-w-6xl border-t border-white/10 px-4 py-5 sm:px-6">
          <div className="flex flex-col items-center justify-between gap-2 text-sm font-semibold sm:flex-row">
            <p>Copyright © {new Date().getFullYear()} All Rights Reserved</p>
            <p>
              Managed by{" "}
              <a
                href="https://github.com/ahmed-3sker"
                target="_blank"
                rel="noopener noreferrer"
              >
                3sker
              </a>{" "}
              &nbsp;
              <a
                href="https://github.com/hazorox"
                target="_blank"
                rel="noopener noreferrer"
              >
                hazoro
              </a>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}