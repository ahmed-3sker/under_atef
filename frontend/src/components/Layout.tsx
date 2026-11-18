import type { ReactNode } from "react";
import { Link, NavLink } from "react-router-dom";
import stemIcon from "../assets/stem_icon.png";
import { LINKS } from "../lib/nav";
import { useAuth } from "./auth_provider";
import RoleBadge from "./RoleBadge";

const SCHOOL_NAME = "STEM 6th of October";
const SCHOOL_TAGLINE = "STEM High School for Boys 6th of October";

export default function Layout({ children }: { children: ReactNode }) {
  const { user, logout } = useAuth();
  const links = user ? LINKS.filter((l) => l.roles.includes(user.role)) : [];

  return (
    <div className="flex min-h-screen flex-col bg-slate-100">
      <header className="bg-[#1a1a4e] shadow-lg">
        <nav className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-4 py-4 sm:px-6">
          <Link to="/" className="flex items-center gap-3">
            <img src={stemIcon} className="h-14 w-14 object-contain" alt="logo" />
            <div className="leading-tight">
              <p className="text-xl font-extrabold tracking-wide text-white sm:text-2xl">{SCHOOL_NAME}</p>
              <p className="text-xs text-white/80">{SCHOOL_TAGLINE}</p>
            </div>
          </Link>

          {user ? (
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm">
              {links.map((l) => (
                <NavLink
                  key={l.to}
                  to={l.to}
                  className={({ isActive }) =>
                    `font-semibold ${isActive ? "text-white underline" : "text-white/70 hover:text-white"}`
                  }
                >
                  {l.label}
                </NavLink>
              ))}
              <RoleBadge />
              <button onClick={logout} className="font-semibold text-white/70 hover:text-white">
                Log out
              </button>
            </div>
          ) : (
            <p className="hidden text-sm font-bold uppercase tracking-wider text-white sm:block">
              Attendance Management System
            </p>
          )}
        </nav>
      </header>

      <main className="flex-1 p-4 sm:p-8">
        <div className="mx-auto max-w-7xl">{children}</div>
      </main>

      <footer className="bg-[#0b0b1e] text-white">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-[1.2fr_1.8fr]">
          <div>
            <h3 className="mb-6 text-2xl font-bold">Site Map</h3>
            <div className="grid grid-cols-2 gap-y-3 text-slate-400">
              <a href="https://www.stemegypt.net/" target="_blank" rel="noopener noreferrer">School Website</a>
              <a href="https://www.facebook.com/STEM6october/" target="_blank" rel="noopener noreferrer">Facebook</a>
              <a href="mailto:counselor@stemegypt.edu.eg">Email</a>
              <a href="https://wa.me/201159114973" target="_blank" rel="noopener noreferrer">WhatsApp</a>
            </div>
          </div>
          <div>
            <h3 className="mb-6 text-2xl font-bold">About Us</h3>
            <div className="flex gap-4">
              <img src={stemIcon} className="h-16 w-16 shrink-0 object-contain" alt="logo" />
              <div>
                <h4 className="text-lg font-bold">{SCHOOL_NAME}</h4>
                <p className="mt-2 text-slate-400">
                  A public high school that provides top-notch education for academically-motivated students.
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
              Managed by{" "}
              <a href="https://github.com/ahmed-3sker" target="_blank" rel="noopener noreferrer">3sker</a>{" "}
              &nbsp;
              <a href="https://github.com/hazorox" target="_blank" rel="noopener noreferrer">hazoro</a>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
