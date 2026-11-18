import { useState, type FormEvent } from "react";
import { errorMessage } from "../api/base";
import { createUser, getUsers, updateUser } from "../api/endpoints";
import { useAuth, type Role } from "../components/auth_provider";
import Layout from "../components/Layout";
import { useFetch } from "../lib/use_fetch";

const inputClass =
  "w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100";

export default function Users() {
  const { user: me } = useAuth();
  const users = useFetch("users", getUsers);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<Role>("teacher");
  const [notice, setNotice] = useState<{ text: string; ok: boolean } | null>(null);

  async function run(action: () => Promise<string>) {
    try {
      setNotice({ ok: true, text: await action() });
      users.reload();
    } catch (err) {
      setNotice({ ok: false, text: errorMessage(err) });
    }
  }

  function onCreate(e: FormEvent) {
    e.preventDefault();
    run(async () => {
      await createUser({ name: name.trim(), email: email.trim(), password, role });
      setName("");
      setEmail("");
      setPassword("");
      return "User created.";
    });
  }

  return (
    <Layout>
      <h1 className="text-3xl font-bold text-slate-900">Users</h1>
      <p className="mb-6 mt-2 text-slate-600">Create staff accounts and turn them on or off.</p>

      {(users.error) && <p role="alert" className="mb-4 rounded-lg bg-red-50 p-3 text-red-600">{users.error}</p>}
      {notice && (
        <p role="status" className={`mb-4 rounded-lg p-3 ${notice.ok ? "bg-green-50 text-green-700" : "bg-red-50 text-red-600"}`}>
          {notice.text}
        </p>
      )}

      <div className="mb-6 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 text-sm text-slate-600">
              <tr>
                <th className="px-5 py-4">Name</th>
                <th className="px-5 py-4">Email</th>
                <th className="px-5 py-4">Role</th>
                <th className="px-5 py-4">Status</th>
                <th className="px-5 py-4" />
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {users.data?.map((u) => (
                <tr key={u._id} className="hover:bg-slate-50">
                  <td className="px-5 py-4 font-medium text-slate-900">{u.name}</td>
                  <td className="px-5 py-4 text-slate-600">{u.email}</td>
                  <td className="px-5 py-4 capitalize text-slate-600">{u.role}</td>
                  <td className="px-5 py-4">
                    <span className={`rounded-full px-3 py-1 text-xs font-semibold ${u.isActive ? "bg-green-100 text-green-800" : "bg-slate-200 text-slate-600"}`}>
                      {u.isActive ? "Active" : "Disabled"}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-right">
                    {u._id !== me?._id && (
                      <button
                        onClick={() => run(async () => { await updateUser(u._id, { isActive: !u.isActive }); return "User updated."; })}
                        className="text-sm font-semibold text-blue-600 hover:text-blue-800"
                      >
                        {u.isActive ? "Disable" : "Enable"}
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <form onSubmit={onCreate} className="max-w-xl space-y-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="text-xl font-bold text-slate-900">New user</h2>
        <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Full name" required className={inputClass} />
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" required className={inputClass} />
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password (8+ characters)" minLength={8} required className={inputClass} />
        <select value={role} onChange={(e) => setRole(e.target.value as Role)} className={inputClass}>
          <option value="teacher">Teacher</option>
          <option value="principal">Principal</option>
          <option value="admin">Admin</option>
        </select>
        <button className="rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700">Create user</button>
      </form>
    </Layout>
  );
}
