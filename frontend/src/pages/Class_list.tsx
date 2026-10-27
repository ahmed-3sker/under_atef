
import { useNavigate } from "react-router-dom";
import stemIcon from "../assets/stem_icon.png";

const SCHOOL_NAME = "STEM 6th of October";
const SCHOOL_TAGLINE = "STEM High School for Boys 6th of October";
const classes = [
  "10A", "10B", "10C", "10D", "10E", "10F",
  "11A", "11B", "11C", "11D", "11E", "11F",
  "12A", "12B", "12C", "12D", "12E", "12F",
];

export default function ClassList() {
  const navigate = useNavigate();

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

      <div className="min-h-screen bg-slate-100 p-6 sm:p-10">
        
        <main className="flex-1 p-6 sm:p-10">
          <div className="mx-auto max-w-7xl">
            <h1 className="mb-2 text-3xl font-bold text-slate-900">
              School Classes
            </h1>

            <p className="mb-8 text-slate-600">
              Select a class to view its attendance.
            </p>

            <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
              {classes.map((className) => (
                <button
                  key={className}
                  onClick={() =>
                    window.location.href = `/attendance`
                  }
                  className="rounded-xl border border-slate-200 bg-white p-6 text-center shadow-sm transition hover:-translate-y-1 hover:border-[#1a1a4e] hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-[#1a1a4e]"
                >
                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-xl bg-[#1a1a4e]/10 text-xl font-bold text-[#1a1a4e]">
                    {className}
                  </div>

                  <h2 className="mt-4 font-semibold text-slate-800">
                    Class {className}
                  </h2>

                  <p className="mt-1 text-sm text-[#1a1a4e]">
                    View Attendance →
                  </p>
                </button>
              ))}
            </div>

            <p className="mt-8 text-sm text-slate-500">
              Total: {classes.length} classes
            </p>
          </div>
        </main>

        
      </div>
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

                <a href="../reports" >
                  reports
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
