import { useState, type FormEvent } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../components/auth_provider";
import stemIcon from "../assets/stem_icon.png";

const SCHOOL_NAME = "STEM 6th of October";
const SCHOOL_TAGLINE = "STEM High School for Boys 6th of October";

export default function Login() {
  const { user, loading, login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");


  if (!loading && user) {
    return <Navigate to="/" replace />;
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setMessage("");
    setSubmitting(true);

    try {
      await login(email.trim(), password);
      navigate("/", { replace: true });
    } catch (err: any) {
      setMessage(
        err?.response?.data?.message ||
          "Invalid email or password. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  }

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

      <main className="flex flex-1 items-center justify-center px-4 py-12">
        <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-xl sm:p-10">
          <div className="mb-8 text-center">
            <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#1a1a4e] text-2xl font-bold text-white">
              <img src={stemIcon} alt="logo" />
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">
              Welcome back
            </h1>
            <p className="mt-2 text-sm text-slate-500">
              Enter your details to sign in to your account.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label
                htmlFor="email"
                className="mb-2 block text-sm font-medium text-slate-700"
              >
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                autoComplete="email"
                required
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#1a1a4e] focus:ring-2 focus:ring-[#1a1a4e]/20"
              />
            </div>

            <div>
              <div className="mb-2 flex items-center justify-between gap-3">
                <label
                  htmlFor="password"
                  className="text-sm font-medium text-slate-700"
                >
                  Password
                </label>
                <a
                  href="#"
                  onClick={(e) => e.preventDefault()}
                  className="text-sm text-[#1a1a4e] hover:underline"
                >
                
                </a>
              </div>

              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  required
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 pr-20 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#1a1a4e] focus:ring-2 focus:ring-[#1a1a4e]/20"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((s) => !s)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-slate-500 hover:text-slate-900"
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full rounded-full bg-[#1a1a4e] py-3 font-semibold text-white transition hover:bg-[#2a2a70] focus:outline-none focus:ring-2 focus:ring-[#1a1a4e] focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitting ? "Signing in..." : "Sign in"}
            </button>

            {message && (
              <p
                role="alert"
                className="rounded-lg bg-red-50 p-3 text-center text-sm text-red-600"
              >
                {message}
              </p>
            )}
          </form>
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