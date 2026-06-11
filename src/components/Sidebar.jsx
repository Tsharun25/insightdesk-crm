import { ChevronRight, LifeBuoy, LogOut, X } from "lucide-react";
import { Link, NavLink } from "react-router-dom";
import { navItems } from "../data/crmData";

export default function Sidebar({ isOpen, onClose, onLogout }) {
    return (
      <>
        <div
          className={`fixed inset-0 z-40 bg-slate-950/40 backdrop-blur-sm transition-opacity lg:hidden ${
            isOpen ? "opacity-100" : "pointer-events-none opacity-0"
          }`}
          onClick={onClose}
        />
  
        <aside
          className={`fixed left-0 top-0 z-50 flex h-screen w-72 flex-col border-r border-slate-200 bg-white px-4 py-5 transition-transform duration-300 lg:sticky lg:translate-x-0 ${
            isOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="mb-8 flex items-center justify-between px-2">
            <div className="flex items-center gap-3">
              <div className="grid h-11 w-11 place-items-center rounded-2xl bg-slate-950 text-lg font-black text-white">
                I
              </div>
              <div>
                <h2 className="text-lg font-black tracking-tight text-slate-950">
                  InsightDesk
                </h2>
                <p className="text-xs font-medium text-slate-500">
                  Sales Intelligence
                </p>
              </div>
            </div>
  
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl p-2 text-slate-500 hover:bg-slate-100 lg:hidden"
              aria-label="Close menu"
            >
              <X size={21} />
            </button>
          </div>
  
          <nav className="space-y-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
  
              return (
                <NavLink
                  key={item.label}
                  to={item.path}
                  onClick={onClose}
                  className={({ isActive }) =>
                    `flex w-full items-center justify-between rounded-2xl px-4 py-3 text-sm font-bold transition ${
                      isActive
                        ? "bg-slate-950 text-white shadow-lg shadow-slate-900/20"
                        : "text-slate-600 hover:bg-slate-100 hover:text-slate-950"
                    }`
                  }
                >
                  <span className="flex items-center gap-3">
                    <Icon size={19} />
                    {item.label}
                  </span>
                  <ChevronRight size={17} className="opacity-60" />
                </NavLink>
              );
            })}
          </nav>
  
          <div className="mt-8 rounded-3xl bg-gradient-to-br from-emerald-500 to-teal-600 p-5 text-white shadow-xl shadow-emerald-500/20">
            <p className="text-sm font-bold opacity-90">AI Sales Insight</p>
            <h3 className="mt-2 text-xl font-black leading-tight">
              14 deals need follow-up today
            </h3>
            <p className="mt-3 text-sm leading-6 text-emerald-50">
              Prioritize enterprise leads to increase close rate this week.
            </p>
            <Link
              to="/analytics"
              onClick={onClose}
              className="mt-5 rounded-2xl bg-white px-4 py-3 text-sm font-black text-emerald-700"
            >
              View Recommendations
            </Link>
          </div>
  
          <div className="mt-auto space-y-2 border-t border-slate-200 pt-4">
            <Link
              to="/reports"
              onClick={onClose}
              className="flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-sm font-bold text-slate-600 hover:bg-slate-100 hover:text-slate-950"
            >
              <LifeBuoy size={19} />
              Help Center
            </Link>
  
            <button
              type="button"
              onClick={onLogout}
              className="flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-sm font-bold text-rose-600 hover:bg-rose-50"
            >
              <LogOut size={19} />
              Logout
            </button>
          </div>
        </aside>
      </>
    );
  }
