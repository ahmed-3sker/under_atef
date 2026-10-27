import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import stemIcon from "../assets/stem_icon.png";

const SCHOOL_NAME = "STEM 6th of October";
const SCHOOL_TAGLINE = "STEM High School for Boys 6th of October";
type Status = "Present" | "Absent" | "Late";

type Student = {
  id: number;
  name: string;
};

type AttendanceRecord = Record<number, Status>;

const students: Student[] = Array.from(
  { length: 24 },
  (_, index) => ({
    id: index + 1,
    name: `Student ${String(index + 1).padStart(2, "0")}`,
  })
);

const sessions = [1, 2, 3, 4, 5];

function getToday() {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function getStorageKey(
  className: string,
  date: string,
  session: number
) {
  return `attendance-${className}-${date}-session-${session}`;
}

function loadAttendance(key: string): AttendanceRecord {
  try {
    const saved = localStorage.getItem(key);
    return saved ? (JSON.parse(saved) as AttendanceRecord) : {};
  } catch {
    return {};
  }
}

export default function Attendance() {
  const { classId: className = "10a" } = useParams();
  const navigate = useNavigate();

  const [date, setDate] = useState(getToday);
  const [session, setSession] = useState(1);
  const [attendance, setAttendance] = useState<AttendanceRecord>({});
  const [savedMessage, setSavedMessage] = useState("");

  const storageKey = getStorageKey(className, date, session);

  useEffect(() => {
    setAttendance(loadAttendance(storageKey));
    setSavedMessage("");
  }, [storageKey]);

  function markStudent(id: number, status: Status) {
    setAttendance((previous) => ({
      ...previous,
      [id]: status,
    }));
    setSavedMessage("");
  }

  function markAll(status: Status) {
    const allStudents: AttendanceRecord = {};

    students.forEach((student) => {
      allStudents[student.id] = status;
    });

    setAttendance(allStudents);
    setSavedMessage("");
  }

  function saveAttendance() {
    try {
      localStorage.setItem(storageKey, JSON.stringify(attendance));
      setSavedMessage("Attendance saved successfully.");
    } catch {
      setSavedMessage(
        "Could not save attendance. Check browser storage settings."
      );
    }
  }

  const presentCount = students.filter(
    (student) => attendance[student.id] === "Present"
  ).length;

  const absentCount = students.filter(
    (student) => attendance[student.id] === "Absent"
  ).length;

  const lateCount = students.filter(
    (student) => attendance[student.id] === "Late"
  ).length;

  const unmarkedCount =
    students.length - presentCount - absentCount - lateCount;

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

      <div className="flex-1 p-4 sm:p-8">
        <div className="mx-auto max-w-7xl">
          <button
            onClick={() => navigate("/classes")}
            className="mb-6 font-semibold text-blue-600 hover:text-blue-800"
          >
            ← Back to Classes
          </button>

          <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <p className="text-sm font-semibold uppercase tracking-widest text-blue-600">
                Attendance Management
              </p>

              <h1 className="mt-2 text-3xl font-bold text-slate-900">
                Class {className.toUpperCase()}
              </h1>

              <p className="mt-2 text-slate-600">
                Record attendance for each session and date.
              </p>
            </div>

            <div className="rounded-xl bg-white px-5 py-3 shadow-sm">
              <p className="text-sm text-slate-500">Total Students</p>
              <p className="text-2xl font-bold text-slate-900">
                {students.length}
              </p>
            </div>
          </div>

          <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="rounded-xl border border-slate-200 bg-white p-5">
              <label
                htmlFor="attendance-date"
                className="mb-2 block font-semibold text-slate-700"
              >
                Attendance Date
              </label>

              <input
                id="attendance-date"
                type="date"
                value={date}
                max={getToday()}
                onChange={(event) =>
                  setDate(event.target.value || getToday())
                }
                className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            <div className="rounded-xl border border-slate-200 bg-white p-5">
              <label
                htmlFor="attendance-session"
                className="mb-2 block font-semibold text-slate-700"
              >
                Session
              </label>

              <select
                id="attendance-session"
                value={session}
                onChange={(event) => setSession(Number(event.target.value))}
                className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              >
                {sessions.map((number) => (
                  <option key={number} value={number}>
                    Session {number}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {[
              { label: "Present", count: presentCount, color: "text-green-700 bg-green-50" },
              { label: "Absent", count: absentCount, color: "text-red-700 bg-red-50" },
              { label: "Late", count: lateCount, color: "text-amber-700 bg-amber-50" },
              { label: "Unmarked", count: unmarkedCount, color: "text-slate-700 bg-slate-200" },
            ].map((item) => (
              <div key={item.label} className={`rounded-xl p-4 ${item.color}`}>
                <p className="text-sm font-medium">{item.label}</p>
                <p className="mt-1 text-2xl font-bold">{item.count}</p>
              </div>
            ))}
          </div>

          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="flex flex-col justify-between gap-3 border-b border-slate-200 p-5 sm:flex-row sm:items-center">
              <div>
                <h2 className="text-xl font-bold text-slate-900">
                  Student Attendance
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  {date} · Session {session}
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => markAll("Present")}
                  className="rounded-lg bg-green-100 px-3 py-2 text-sm font-semibold text-green-800 hover:bg-green-200"
                >
                  All Present
                </button>

                <button
                  onClick={() => markAll("Absent")}
                  className="rounded-lg bg-red-100 px-3 py-2 text-sm font-semibold text-red-800 hover:bg-red-200"
                >
                  All Absent
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[650px] text-left">
                <thead className="bg-slate-50 text-sm text-slate-600">
                  <tr>
                    <th className="px-5 py-4">#</th>
                    <th className="px-5 py-4">Student</th>
                    <th className="px-5 py-4">Attendance Status</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">
                  {students.map((student) => (
                    <tr key={student.id} className="hover:bg-slate-50">
                      <td className="px-5 py-4 text-slate-500">
                        {student.id}
                      </td>

                      <td className="px-5 py-4 font-medium text-slate-900">
                        {student.name}
                      </td>

                      <td className="px-5 py-4">
                        <div className="flex flex-wrap gap-2">
                          {(["Present", "Absent", "Late"] as Status[]).map(
                            (status) => {
                              const selected =
                                attendance[student.id] === status;

                              const styles: Record<Status, string> = {
                                Present: selected
                                  ? "bg-green-600 text-white"
                                  : "border border-green-200 text-green-700 hover:bg-green-50",
                                Absent: selected
                                  ? "bg-red-600 text-white"
                                  : "border border-red-200 text-red-700 hover:bg-red-50",
                                Late: selected
                                  ? "bg-amber-500 text-white"
                                  : "border border-amber-200 text-amber-700 hover:bg-amber-50",
                              };

                              return (
                                <button
                                  key={status}
                                  onClick={() =>
                                    markStudent(student.id, status)
                                  }
                                  aria-pressed={selected}
                                  className={`rounded-lg px-3 py-2 text-sm font-semibold transition ${styles[status]}`}
                                >
                                  {status}
                                </button>
                              );
                            }
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex flex-col gap-3 border-t border-slate-200 p-5 sm:flex-row sm:items-center sm:justify-between">
              <p aria-live="polite" className="text-sm text-slate-600">
                {savedMessage ||
                  `${students.length - unmarkedCount} of ${students.length} students marked.`}
              </p>

              <button
                onClick={saveAttendance}
                className="rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Save Attendance
              </button>
            </div>
          </div>
        </div>
      </div>

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
                href="https://web.facebook.com/STEM6october/?_rdc=1&_rdr#"
                target="_blank"
                rel="noopener noreferrer"
              >
                Facebook
              </a>
              <p>Contact Us</p>
              <p></p>
              <a
                href="mailto:counselor@stemegypt.edu.eg"
                target="_blank"
                rel="noopener noreferrer"
              >
                Email
              </a>
              <a
                href="https://wa.me/201159114973"
                target="_blank"
                rel="noopener noreferrer"
              >
                Phone
              </a>

              <a href="/reports">reports</a>

              <a href="/classes">classes</a>
            </div>
          </div>

          <div>
            <h3 className="mb-6 text-2xl font-bold">About Us</h3>
            <div className="flex gap-4">
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-lg text-[10px] uppercase text-white/50">
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