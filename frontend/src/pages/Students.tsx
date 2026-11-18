import { useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import { errorMessage } from "../api/base";
import {
  addStudent, addStudentsBulk, deactivateStudent, getClasses, getStudents,
} from "../api/endpoints";
import { useAuth } from "../components/auth_provider";
import Layout from "../components/Layout";
import { useFetch } from "../lib/use_fetch";

const inputClass =
  "w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100";

export default function Students() {
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";

  const classes = useFetch("classes", getClasses);
  const [picked, setPicked] = useState("");
  const classId = picked || classes.data?.[0]?._id || "";
  const students = useFetch(classId || null, () => getStudents(classId));

  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [bulk, setBulk] = useState("");
  const [notice, setNotice] = useState<{ text: string; ok: boolean } | null>(null);

  async function run(action: () => Promise<string>) {
    try {
      setNotice({ ok: true, text: await action() });
      students.reload();
    } catch (err) {
      setNotice({ ok: false, text: errorMessage(err) });
    }
  }

  function onAdd(e: FormEvent) {
    e.preventDefault();
    run(async () => {
      await addStudent({ name: name.trim(), studentId: code.trim(), classId });
      setName("");
      setCode("");
      return "Student added.";
    });
  }

  // one student per line: "studentId, name"
  function onBulk(e: FormEvent) {
    e.preventDefault();
    const rows = bulk
      .split("\n")
      .map((line) => line.split(",").map((p) => p.trim()))
      .filter((p) => p.length >= 2 && p[0] && p[1])
      .map(([studentId, ...rest]) => ({ studentId, name: rest.join(", ") }));
    if (rows.length === 0) {
      setNotice({ ok: false, text: 'Use one student per line: "studentId, name"' });
      return;
    }
    run(async () => {
      const res = await addStudentsBulk(classId, rows);
      setBulk("");
      return `Added ${res.created} of ${rows.length} students.`;
    });
  }

  function onRemove(id: string, studentName: string) {
    if (!window.confirm(`Remove ${studentName}? Their past attendance is kept.`)) return;
    run(async () => {
      await deactivateStudent(id);
      return "Student removed.";
    });
  }

  return (
    <Layout>
      <h1 className="text-3xl font-bold text-slate-900">Students</h1>
      <p className="mb-6 mt-2 text-slate-600">Pick a class, then open a student to see their attendance history.</p>

      <div className="mb-6 max-w-xs rounded-xl border border-slate-200 bg-white p-5">
        <label htmlFor="class" className="mb-2 block font-semibold text-slate-700">Class</label>
        <select id="class" value={classId} onChange={(e) => setPicked(e.target.value)} className={inputClass}>
          {classes.data?.map((c) => <option key={c._id} value={c._id}>{c.name}</option>)}
        </select>
      </div>

      {(classes.error || students.error) && (
        <p role="alert" className="mb-4 rounded-lg bg-red-50 p-3 text-red-600">{classes.error ?? students.error}</p>
      )}
      {notice && (
        <p role="status" className={`mb-4 rounded-lg p-3 ${notice.ok ? "bg-green-50 text-green-700" : "bg-red-50 text-red-600"}`}>
          {notice.text}
        </p>
      )}

      <div className="mb-6 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 p-5">
          <h2 className="text-xl font-bold text-slate-900">Roster</h2>
          <p className="mt-1 text-sm text-slate-500">{students.data?.length ?? 0} students</p>
        </div>
        {students.loading && <p className="p-5 text-slate-500">Loading...</p>}
        <div className="divide-y divide-slate-100">
          {students.data?.map((s) => (
            <div key={s._id} className="flex items-center justify-between gap-3 p-4 hover:bg-slate-50">
              <Link to={`/students/${s._id}`} className="flex-1">
                <p className="font-medium text-slate-900">{s.name}</p>
                <p className="text-sm text-slate-500">{s.studentId}</p>
              </Link>
              {isAdmin && (
                <button onClick={() => onRemove(s._id, s.name)} className="text-sm font-semibold text-red-600 hover:text-red-800">
                  Remove
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {isAdmin && classId && (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <form onSubmit={onAdd} className="space-y-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="text-xl font-bold text-slate-900">Add one student</h2>
            <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Full name" required className={inputClass} />
            <input value={code} onChange={(e) => setCode(e.target.value)} placeholder="Student ID" required className={inputClass} />
            <button className="rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700">Add student</button>
          </form>

          <form onSubmit={onBulk} className="space-y-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="text-xl font-bold text-slate-900">Paste a list</h2>
            <textarea
              value={bulk} onChange={(e) => setBulk(e.target.value)} rows={5}
              placeholder={"10A-01, First Student\n10A-02, Second Student"} className={inputClass}
            />
            <button className="rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700">Add all</button>
          </form>
        </div>
      )}
    </Layout>
  );
}
