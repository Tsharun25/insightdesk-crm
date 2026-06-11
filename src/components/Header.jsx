import { Bell, LogIn, Menu, Search, UserPlus } from "lucide-react";
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { navItems, notifications } from "../data/crmData";

export default function Header({ onOpenSidebar, currentUser }) {
  const [showNotifications, setShowNotifications] = useState(false);
  const location = useLocation();
  const currentPage =
    navItems.find((item) => item.path === location.pathname)?.label ||
    (location.pathname === "/login" ? "Login" : null) ||
    (location.pathname === "/register" ? "Register" : null) ||
    "Dashboard";

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200/80 bg-white/85 backdrop-blur-xl">
      <div className="flex h-20 items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onOpenSidebar}
            className="rounded-2xl border border-slate-200 bg-white p-2 text-slate-700 shadow-sm lg:hidden"
            aria-label="Open menu"
          >
            <Menu size={22} />
          </button>

          <div>
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-emerald-600">
              Analytics CRM
            </p>
            <h1 className="text-xl font-black tracking-tight text-slate-950 sm:text-2xl">
              {currentPage}
            </h1>
          </div>
        </div>

        <div className="hidden w-full max-w-md items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 md:flex">
          <Search size={18} className="text-slate-400" />
          <input
            type="text"
            placeholder="Search leads, deals, reports..."
            className="w-full bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400"
          />
        </div>

        <div className="relative flex items-center gap-3">
          <button
            type="button"
            onClick={() => setShowNotifications((value) => !value)}
            className="relative rounded-2xl border border-slate-200 bg-white p-3 text-slate-700 shadow-sm"
            aria-label="Notifications"
          >
            <Bell size={19} />
            <span className="absolute right-2 top-2 h-2.5 w-2.5 rounded-full bg-emerald-500 ring-2 ring-white" />
          </button>
          {showNotifications && (
            <div className="absolute right-0 top-16 w-80 rounded-3xl border border-slate-200 bg-white p-3 shadow-2xl shadow-slate-900/15">
              <div className="px-2 pb-2">
                <p className="text-sm font-black text-slate-950">
                  Notification Center
                </p>
                <p className="text-xs font-medium text-slate-500">
                  Live revenue and lead alerts
                </p>
              </div>
              <div className="space-y-2">
                {notifications.map((notification) => (
                  <div
                    key={notification}
                    className="rounded-2xl bg-slate-50 px-4 py-3 text-sm font-bold leading-6 text-slate-700"
                  >
                    {notification}
                  </div>
                ))}
              </div>
            </div>
          )}

          {currentUser ? (
            <div className="hidden items-center gap-3 rounded-2xl border border-slate-200 bg-white px-3 py-2 shadow-sm sm:flex">
              <div className="grid h-10 w-10 place-items-center rounded-xl bg-slate-950 text-sm font-black text-white">
                {currentUser.name
                  .split(" ")
                  .map((part) => part[0])
                  .join("")
                  .slice(0, 2)
                  .toUpperCase()}
              </div>
              <div>
                <p className="text-sm font-bold text-slate-900">
                  {currentUser.name}
                </p>
                <p className="text-xs text-slate-500">{currentUser.role}</p>
              </div>
            </div>
          ) : (
            <div className="hidden items-center gap-2 sm:flex">
              <Link
                to="/login"
                className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-black text-slate-700 shadow-sm"
              >
                <LogIn size={17} />
                Login
              </Link>
              <Link
                to="/register"
                className="inline-flex items-center gap-2 rounded-2xl bg-slate-950 px-4 py-3 text-sm font-black text-white shadow-lg shadow-slate-900/20"
              >
                <UserPlus size={17} />
                Register
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
