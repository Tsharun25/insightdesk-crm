import { useEffect, useMemo, useState } from "react";
import { Link, Navigate, Route, Routes, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowDownUp,
  CalendarDays,
  CheckCircle2,
  Clock3,
  Download,
  FileText,
  Filter,
  Globe2,
  LockKeyhole,
  Plus,
  Search,
  ShieldCheck,
  Sparkles,
  Star,
  Target,
  TrendingUp,
  UserPlus,
} from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import ActivityFeed from "./components/ActivityFeed";
import CustomerTable from "./components/CustomerTable";
import Header from "./components/Header";
import InsightCard from "./components/InsightCard";
import MetricCard from "./components/MetricCard";
import Pipeline from "./components/Pipeline";
import RevenueChart from "./components/RevenueChart";
import Sidebar from "./components/Sidebar";
import { metrics, revenueData } from "./data/dashboardData";
import {
  acquisitionData,
  conversionData,
  customerProfiles,
  dealColumns,
  leads,
  quickActions,
  reports,
} from "./data/crmData";
import { authRequest } from "./services/api";

const statusClasses = {
  Hot: "bg-rose-50 text-rose-700",
  Qualified: "bg-emerald-50 text-emerald-700",
  Nurture: "bg-sky-50 text-sky-700",
  New: "bg-slate-100 text-slate-700",
  Ready: "bg-emerald-50 text-emerald-700",
  Draft: "bg-amber-50 text-amber-700",
  Scheduled: "bg-indigo-50 text-indigo-700",
};

const chartColors = ["#10b981", "#0f172a", "#38bdf8", "#f59e0b", "#8b5cf6"];

const landingStats = [
  { label: "Pipeline tracked", value: "$1.8M" },
  { label: "Qualified leads", value: "14.2K" },
  { label: "Revenue lift", value: "28%" },
  { label: "Reports exported", value: "9.6K" },
];

const testimonials = [
  {
    quote:
      "InsightDesk gives our sales team the exact picture we need before weekly revenue review.",
    name: "Nora Smith",
    role: "Revenue Lead, Apex Studio",
  },
  {
    quote:
      "The dashboard feels calm, sharp, and executive-ready. It makes pipeline conversations much clearer.",
    name: "Leo Martin",
    role: "Sales Director, CloudNest",
  },
  {
    quote:
      "The lead scoring and report views make this feel like a product, not just a template.",
    name: "Emma Wilson",
    role: "Founder, BrightFlow",
  },
];

function AppShell() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(() => {
    const savedUser = window.localStorage.getItem("insightdesk_user");
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const navigate = useNavigate();

  function handleAuthSuccess(data) {
    window.localStorage.setItem("insightdesk_token", data.token);
    const user = { ...data.user, authMode: data.mode || "mongodb" };
    window.localStorage.setItem("insightdesk_user", JSON.stringify(user));
    setCurrentUser(user);
    navigate("/dashboard");
  }

  function handleLogout() {
    window.localStorage.removeItem("insightdesk_token");
    window.localStorage.removeItem("insightdesk_user");
    setCurrentUser(null);
    setSidebarOpen(false);
    navigate("/login");
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="flex min-h-screen">
        <Sidebar
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          onLogout={handleLogout}
        />
        <div className="min-w-0 flex-1">
          <Header
            currentUser={currentUser}
            onOpenSidebar={() => setSidebarOpen(true)}
          />
          <main className="px-4 py-6 sm:px-6 lg:px-8">
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route
                path="/login"
                element={<AuthPage mode="login" onSuccess={handleAuthSuccess} />}
              />
              <Route
                path="/register"
                element={
                  <AuthPage mode="register" onSuccess={handleAuthSuccess} />
                }
              />
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/leads" element={<LeadsPage />} />
              <Route path="/deals" element={<DealsPage />} />
              <Route path="/customers" element={<CustomersPage />} />
              <Route path="/analytics" element={<AnalyticsPage />} />
              <Route path="/reports" element={<ReportsPage />} />
              <Route path="/settings" element={<SettingsPage />} />
              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Routes>
          </main>
        </div>
      </div>
    </div>
  );
}

function Page({ children }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="min-w-0 space-y-6"
    >
      {children}
    </motion.div>
  );
}

function PageHeader({ eyebrow, title, copy, action }) {
  return (
    <section className="flex flex-col justify-between gap-4 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm shadow-slate-200/70 lg:flex-row lg:items-center">
      <div>
        <p className="text-sm font-black uppercase tracking-[0.18em] text-emerald-600">
          {eyebrow}
        </p>
        <h2 className="mt-2 text-2xl font-black tracking-tight text-slate-950 sm:text-3xl">
          {title}
        </h2>
        <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-500">
          {copy}
        </p>
      </div>
      {action}
    </section>
  );
}

function AuthPage({ mode, onSuccess }) {
  const isRegister = mode === "register";
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const payload = isRegister
        ? form
        : { email: form.email, password: form.password };
      const data = await authRequest(isRegister ? "register" : "login", payload);
      onSuccess(data);
    } catch (requestError) {
      setError(
        `${requestError.message} If this is a connection error, run npm run dev:full and set server/.env first.`,
      );
    } finally {
      setLoading(false);
    }
  }

  function updateField(field, value) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  return (
    <Page>
      <section className="mx-auto grid w-full max-w-5xl overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-xl shadow-slate-200/70 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="bg-slate-950 p-8 text-white sm:p-10">
          <p className="text-sm font-black uppercase tracking-[0.22em] text-emerald-300">
            Secure Workspace
          </p>
          <h2 className="mt-4 text-3xl font-black tracking-tight sm:text-4xl">
            {isRegister ? "Create your InsightDesk account." : "Welcome back to InsightDesk."}
          </h2>
          <p className="mt-4 text-sm leading-7 text-slate-300">
            This form connects to the Express API in the server folder. User
            accounts are saved in MongoDB when the backend is running.
          </p>
          <div className="mt-8 space-y-4">
            <TrustRow
              icon={LockKeyhole}
              title="JWT auth ready"
              copy="Login and register endpoints return a token and user profile."
              dark
            />
            <TrustRow
              icon={Globe2}
              title="MongoDB storage"
              copy="Set MONGODB_URI in server/.env to connect your database."
              dark
            />
          </div>
        </div>
        <form onSubmit={handleSubmit} className="p-6 sm:p-10">
          <div className="mb-7">
            <p className="text-sm font-black uppercase tracking-[0.18em] text-emerald-600">
              {isRegister ? "Register" : "Login"}
            </p>
            <h3 className="mt-2 text-2xl font-black tracking-tight text-slate-950">
              {isRegister ? "Start a new workspace" : "Access your dashboard"}
            </h3>
          </div>
          <div className="space-y-4">
            {isRegister && (
              <label className="block">
                <span className="text-sm font-black text-slate-700">Name</span>
                <input
                  value={form.name}
                  onChange={(event) => updateField("name", event.target.value)}
                  className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-bold text-slate-800 outline-none focus:border-emerald-400"
                  placeholder="Demo Admin"
                  required
                />
              </label>
            )}
            <label className="block">
              <span className="text-sm font-black text-slate-700">Email</span>
              <input
                type="email"
                value={form.email}
                onChange={(event) => updateField("email", event.target.value)}
                className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-bold text-slate-800 outline-none focus:border-emerald-400"
                placeholder="admin@insightdesk.com"
                required
              />
            </label>
            <label className="block">
              <span className="text-sm font-black text-slate-700">Password</span>
              <input
                type="password"
                value={form.password}
                onChange={(event) => updateField("password", event.target.value)}
                className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-bold text-slate-800 outline-none focus:border-emerald-400"
                placeholder="Minimum 6 characters"
                minLength={6}
                required
              />
            </label>
          </div>
          {error && (
            <div className="mt-5 rounded-2xl border border-rose-100 bg-rose-50 px-4 py-3 text-sm font-bold leading-6 text-rose-700">
              {error}
            </div>
          )}
          <button
            type="submit"
            disabled={loading}
            className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-slate-950 px-5 py-4 text-sm font-black text-white shadow-lg shadow-slate-900/20 disabled:opacity-60"
          >
            {loading ? "Please wait..." : isRegister ? "Create Account" : "Login"}
          </button>
          <p className="mt-5 text-center text-sm font-bold text-slate-500">
            {isRegister ? "Already have an account?" : "No account yet?"}{" "}
            <Link
              to={isRegister ? "/login" : "/register"}
              className="text-emerald-700 hover:text-emerald-800"
            >
              {isRegister ? "Login" : "Register"}
            </Link>
          </p>
        </form>
      </section>
    </Page>
  );
}

function DashboardPage() {
  return (
    <Page>
      <HeroPanel />
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {metrics.map((metric) => (
          <MetricCard key={metric.label} metric={metric} />
        ))}
      </section>
      <QuickActions />
      <section className="grid gap-6 xl:grid-cols-3">
        <RevenueChart />
        <Pipeline />
        <CustomerTable />
        <div className="grid gap-6">
          <InsightCard />
          <ActivityFeed />
        </div>
      </section>
    </Page>
  );
}

function HeroPanel() {
  return (
    <section className="overflow-hidden rounded-[2rem] bg-slate-950 shadow-2xl shadow-slate-900/20">
      <div className="relative p-6 sm:p-8 lg:p-10">
        <div className="absolute right-0 top-0 h-64 w-64 rounded-full bg-emerald-500/20 blur-3xl" />
        <div className="absolute bottom-0 right-32 h-44 w-44 rounded-full bg-cyan-500/10 blur-3xl" />
        <div className="relative z-10 grid gap-8 lg:grid-cols-[1.4fr_0.8fr] lg:items-center">
          <div>
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-4 py-2 text-sm font-bold text-emerald-200">
              <ShieldCheck size={17} />
              Client-ready CRM analytics dashboard
            </div>
            <h2 className="max-w-3xl text-3xl font-black tracking-tight text-white sm:text-4xl lg:text-5xl">
              Turn sales data into clear decisions, faster.
            </h2>
            <p className="mt-5 max-w-2xl text-base leading-8 text-slate-300">
              InsightDesk helps agencies, SaaS teams, and consultants monitor
              leads, revenue, pipeline health, and customer activity from one
              modern workspace.
            </p>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <Link
                to="/leads"
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-emerald-500 px-5 py-4 text-sm font-black text-white shadow-xl shadow-emerald-500/20 transition hover:bg-emerald-400"
              >
                <Plus size={18} />
                Add New Lead
              </Link>
              <Link
                to="/reports"
                className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/15 bg-white/10 px-5 py-4 text-sm font-black text-white transition hover:bg-white/15"
              >
                <Download size={18} />
                Download Report
              </Link>
            </div>
          </div>
          <div className="rounded-3xl border border-white/10 bg-white/10 p-5 backdrop-blur">
            <div className="mb-5 flex items-center justify-between">
              <p className="text-sm font-bold text-slate-300">This Month</p>
              <span className="rounded-full bg-emerald-400/20 px-3 py-1 text-xs font-black text-emerald-200">
                +18.4%
              </span>
            </div>
            <div className="space-y-4">
              <div className="rounded-2xl bg-white p-4">
                <div className="mb-3 flex items-center gap-3">
                  <div className="grid h-10 w-10 place-items-center rounded-xl bg-emerald-100 text-emerald-700">
                    <TrendingUp size={19} />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-500">
                      Revenue Forecast
                    </p>
                    <h3 className="text-2xl font-black text-slate-950">
                      $112.5K
                    </h3>
                  </div>
                </div>
                <div className="h-3 overflow-hidden rounded-full bg-slate-100">
                  <div className="h-full w-[78%] rounded-full bg-emerald-500" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <MiniStat icon={Target} label="Close Target" value="82%" />
                <MiniStat icon={Filter} label="Hot Leads" value="146" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function MiniStat({ icon: Icon, label, value }) {
  return (
    <div className="rounded-2xl bg-white/90 p-4">
      <Icon className="text-emerald-600" size={21} />
      <p className="mt-3 text-xs font-bold text-slate-500">{label}</p>
      <p className="text-xl font-black text-slate-950">{value}</p>
    </div>
  );
}

function QuickActions() {
  const icons = [Plus, Target, FileText, UserPlus];
  const paths = ["/leads", "/deals", "/reports", "/register"];
  return (
    <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
      {quickActions.map((action, index) => {
        const Icon = icons[index];
        return (
          <Link
            key={action}
            to={paths[index]}
            className="flex items-center gap-3 rounded-3xl border border-slate-200 bg-white p-4 text-left text-sm font-black text-slate-800 shadow-sm shadow-slate-200/70 transition hover:-translate-y-0.5 hover:border-emerald-200 hover:shadow-lg hover:shadow-emerald-100"
          >
            <span className="grid h-11 w-11 place-items-center rounded-2xl bg-emerald-50 text-emerald-700">
              <Icon size={19} />
            </span>
            {action}
          </Link>
        );
      })}
    </section>
  );
}

function LeadsPage() {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("All");
  const [sort, setSort] = useState("score");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const perPage = 5;

  useEffect(() => {
    const timer = window.setTimeout(() => setLoading(false), 450);
    return () => window.clearTimeout(timer);
  }, []);

  const filteredLeads = useMemo(() => {
    return leads
      .filter((lead) => {
        const matchesQuery = `${lead.name} ${lead.company} ${lead.email}`
          .toLowerCase()
          .includes(query.toLowerCase());
        const matchesStatus = status === "All" || lead.status === status;
        return matchesQuery && matchesStatus;
      })
      .sort((a, b) =>
        sort === "score"
          ? b.score - a.score
          : a.company.localeCompare(b.company),
      );
  }, [query, status, sort]);

  const pageCount = Math.ceil(filteredLeads.length / perPage) || 1;
  const visibleLeads = filteredLeads.slice((page - 1) * perPage, page * perPage);

  return (
    <Page>
      <PageHeader
        eyebrow="Lead Management"
        title="Prioritize every opportunity by fit, source, and intent."
        copy="Search, filter, sort, and page through realistic SaaS lead data using local React state."
        action={
          <button
            type="button"
            onClick={() => {
              setQuery("");
              setStatus("New");
              setSort("score");
              setPage(1);
            }}
            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-slate-950 px-5 py-3 text-sm font-black text-white shadow-lg shadow-slate-900/20"
          >
            <Plus size={18} />
            Add Lead
          </button>
        }
      />
      <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm shadow-slate-200/70">
        <div className="mb-5 grid gap-3 lg:grid-cols-[1fr_180px_180px]">
          <label className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
            <Search size={18} className="text-slate-400" />
            <input
              value={query}
              onChange={(event) => {
                setQuery(event.target.value);
                setPage(1);
              }}
              className="w-full bg-transparent text-sm font-medium outline-none placeholder:text-slate-400"
              placeholder="Search leads..."
            />
          </label>
          <select
            value={status}
            onChange={(event) => {
              setStatus(event.target.value);
              setPage(1);
            }}
            className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-slate-700 outline-none"
          >
            {["All", "Hot", "Qualified", "Nurture", "New"].map((item) => (
              <option key={item}>{item}</option>
            ))}
          </select>
          <select
            value={sort}
            onChange={(event) => setSort(event.target.value)}
            className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-slate-700 outline-none"
          >
            <option value="score">Sort by score</option>
            <option value="company">Sort by company</option>
          </select>
        </div>
        {loading ? (
          <TableSkeleton />
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[800px] text-left">
                <thead>
                  <tr className="border-b border-slate-200 text-xs uppercase tracking-[0.14em] text-slate-400">
                    {["Name", "Company", "Email", "Score", "Source", "Status"].map(
                      (heading) => (
                        <th key={heading} className="pb-4 font-black">
                          {heading}
                        </th>
                      ),
                    )}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {visibleLeads.map((lead) => (
                    <tr key={lead.id} className="transition hover:bg-slate-50">
                      <td className="py-4 font-black text-slate-950">
                        {lead.name}
                      </td>
                      <td className="py-4 text-sm font-bold text-slate-700">
                        {lead.company}
                      </td>
                      <td className="py-4 text-sm font-medium text-slate-500">
                        {lead.email}
                      </td>
                      <td className="py-4">
                        <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-black text-emerald-700">
                          {lead.score}
                        </span>
                      </td>
                      <td className="py-4 text-sm font-bold text-slate-700">
                        {lead.source}
                      </td>
                      <td className="py-4">
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-black ${statusClasses[lead.status]}`}
                        >
                          {lead.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {visibleLeads.length === 0 && <EmptyState title="No leads found" />}
            </div>
            <div className="mt-5 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
              <p className="text-sm font-bold text-slate-500">
                Page {page} of {pageCount} | {filteredLeads.length} leads
              </p>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setPage((value) => Math.max(1, value - 1))}
                  className="rounded-2xl border border-slate-200 px-4 py-2 text-sm font-black text-slate-700 disabled:opacity-40"
                  disabled={page === 1}
                >
                  Previous
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setPage((value) => Math.min(pageCount, value + 1))
                  }
                  className="rounded-2xl border border-slate-200 px-4 py-2 text-sm font-black text-slate-700 disabled:opacity-40"
                  disabled={page === pageCount}
                >
                  Next
                </button>
              </div>
            </div>
          </>
        )}
      </section>
    </Page>
  );
}

function DealsPage() {
  return (
    <Page>
      <PageHeader
        eyebrow="Deal Pipeline"
        title="Move revenue from first signal to closed won."
        copy="A polished Kanban-style board for sales pipeline storytelling, stage health, and ownership."
        action={
          <Link
            to="/leads"
            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-emerald-500 px-5 py-3 text-sm font-black text-white shadow-lg shadow-emerald-500/20"
          >
            <Plus size={18} />
            Create Deal
          </Link>
        }
      />
      <section className="grid gap-4 xl:grid-cols-5">
        {dealColumns.map((column) => (
          <div
            key={column.stage}
            className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm shadow-slate-200/70"
          >
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h3 className="font-black text-slate-950">{column.stage}</h3>
                <p className="text-xs font-bold text-slate-500">
                  {column.deals.length} deals
                </p>
              </div>
              <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-black text-slate-700">
                {column.value}
              </span>
            </div>
            <div className="space-y-3">
              {column.deals.map((deal) => (
                <article
                  key={deal.title}
                  className="rounded-2xl border border-slate-100 bg-slate-50 p-4 transition hover:-translate-y-0.5 hover:border-emerald-200 hover:bg-white hover:shadow-lg hover:shadow-emerald-100"
                >
                  <p className="text-sm font-black leading-6 text-slate-950">
                    {deal.title}
                  </p>
                  <p className="mt-1 text-xs font-bold text-slate-500">
                    {deal.company}
                  </p>
                  <div className="mt-4 flex items-center justify-between">
                    <span className="text-xs font-black text-slate-600">
                      {deal.owner}
                    </span>
                    <span className="text-sm font-black text-emerald-700">
                      {deal.amount}
                    </span>
                  </div>
                </article>
              ))}
            </div>
          </div>
        ))}
      </section>
    </Page>
  );
}

function CustomersPage() {
  return (
    <Page>
      <PageHeader
        eyebrow="Customer Intelligence"
        title="Track account value, health, plan, and recent activity."
        copy="Customer profile cards make the CRM feel operational while staying portfolio-friendly and clean."
      />
      <section className="grid min-w-0 gap-4 lg:grid-cols-3">
        {customerProfiles.map((customer) => (
          <article
            key={customer.company}
            className="min-w-0 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm shadow-slate-200/70"
          >
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="min-w-0">
                <h3 className="break-words text-xl font-black text-slate-950">
                  {customer.company}
                </h3>
                <p className="break-words text-sm font-bold text-slate-500">
                  {customer.contact}
                </p>
              </div>
              <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-black text-emerald-700">
                {customer.plan}
              </span>
            </div>
            <div className="mt-5 grid grid-cols-2 gap-3">
              <MiniPanel label="Revenue" value={customer.revenue} />
              <MiniPanel label="Health" value={`${customer.health}%`} />
            </div>
            <div className="mt-5 space-y-3">
              {customer.timeline.map((item) => (
                <div key={item} className="flex items-center gap-3 text-sm">
                  <CheckCircle2 size={17} className="text-emerald-600" />
                  <span className="font-bold text-slate-600">{item}</span>
                </div>
              ))}
            </div>
          </article>
        ))}
      </section>
      <CustomerTable />
    </Page>
  );
}

function AnalyticsPage() {
  return (
    <Page>
      <PageHeader
        eyebrow="Analytics"
        title="Revenue, conversion, source mix, and acquisition trends."
        copy="A dashboard-grade analytics view using Recharts, designed for executive scan speed."
      />
      <section className="grid gap-6 xl:grid-cols-2">
        <ChartCard title="Revenue Growth">
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
              <XAxis dataKey="month" axisLine={false} tickLine={false} />
              <YAxis axisLine={false} tickLine={false} />
              <Tooltip />
              <Line type="monotone" dataKey="revenue" stroke="#10b981" strokeWidth={3} />
              <Line type="monotone" dataKey="pipeline" stroke="#0f172a" strokeWidth={3} />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>
        <ChartCard title="Conversion Rate">
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={conversionData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
              <XAxis dataKey="month" axisLine={false} tickLine={false} />
              <YAxis axisLine={false} tickLine={false} />
              <Tooltip />
              <Bar dataKey="conversion" fill="#10b981" radius={[10, 10, 0, 0]} />
              <Bar dataKey="acquisition" fill="#0f172a" radius={[10, 10, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
        <ChartCard title="Lead Sources">
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie data={acquisitionData} dataKey="leads" nameKey="source" outerRadius={105} label>
                {acquisitionData.map((entry, index) => (
                  <Cell key={entry.source} fill={chartColors[index]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>
        <ChartCard title="Customer Acquisition">
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={acquisitionData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e2e8f0" />
              <XAxis type="number" axisLine={false} tickLine={false} />
              <YAxis dataKey="source" type="category" axisLine={false} tickLine={false} width={80} />
              <Tooltip />
              <Bar dataKey="leads" fill="#10b981" radius={[0, 10, 10, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </section>
    </Page>
  );
}

function ReportsPage() {
  return (
    <Page>
      <PageHeader
        eyebrow="Reports"
        title="Export polished summaries for monthly and quarterly reviews."
        copy="Report cards, KPI summary, and export actions make this feel like a shippable SaaS workflow."
        action={
          <button
            type="button"
            onClick={downloadReportSummary}
            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-slate-950 px-5 py-3 text-sm font-black text-white shadow-lg shadow-slate-900/20"
          >
            <Download size={18} />
            Export Report
          </button>
        }
      />
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {metrics.map((metric) => (
          <MetricCard key={metric.label} metric={metric} />
        ))}
      </section>
      <section className="grid gap-4 lg:grid-cols-2">
        {reports.map((report) => (
          <article
            key={report.title}
            className="flex min-w-0 flex-col justify-between gap-4 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm shadow-slate-200/70 xl:flex-row xl:items-center"
          >
            <div className="flex min-w-0 items-start gap-4">
              <div className="grid h-12 w-12 place-items-center rounded-2xl bg-emerald-50 text-emerald-700">
                <FileText size={20} />
              </div>
              <div className="min-w-0">
                <h3 className="break-words font-black text-slate-950">{report.title}</h3>
                <p className="mt-1 flex items-center gap-2 text-sm font-bold text-slate-500">
                  <CalendarDays size={15} />
                  {report.type} | {report.date}
                </p>
              </div>
            </div>
            <span
              className={`w-fit rounded-full px-3 py-1 text-xs font-black ${statusClasses[report.status]}`}
            >
              {report.status}
            </span>
          </article>
        ))}
      </section>
    </Page>
  );
}

function LandingPage() {
  return (
    <Page>
      <section className="overflow-hidden rounded-[2rem] bg-slate-950 p-6 text-white shadow-2xl shadow-slate-900/20 sm:p-10">
        <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.22em] text-emerald-300">
              Sales Intelligence Platform
            </p>
            <h2 className="mt-4 text-4xl font-black tracking-tight sm:text-5xl">
              InsightDesk CRM
            </h2>
            <p className="mt-5 max-w-2xl text-base leading-8 text-slate-300">
              A premium SaaS dashboard concept for revenue analytics, lead
              scoring, pipeline reporting, and customer intelligence.
            </p>
            <Link
              to="/dashboard"
              className="mt-7 inline-flex items-center justify-center gap-2 rounded-2xl bg-emerald-500 px-5 py-4 text-sm font-black text-white shadow-xl shadow-emerald-500/20"
            >
              Open Dashboard
              <TrendingUp size={18} />
            </Link>
          </div>
          <div className="rounded-3xl border border-white/10 bg-white/10 p-5 backdrop-blur">
            <RevenueMiniChart />
          </div>
        </div>
      </section>
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {landingStats.map((stat) => (
          <div
            key={stat.label}
            className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm shadow-slate-200/70"
          >
            <p className="text-sm font-bold text-slate-500">{stat.label}</p>
            <p className="mt-2 text-3xl font-black tracking-tight text-slate-950">
              {stat.value}
            </p>
          </div>
        ))}
      </section>
      <section className="grid gap-4 md:grid-cols-3">
        {["Lead scoring", "Revenue tracking", "Executive reports"].map((item) => (
          <div
            key={item}
            className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm shadow-slate-200/70 transition hover:-translate-y-0.5 hover:border-emerald-200 hover:shadow-lg hover:shadow-emerald-100"
          >
            <Sparkles size={22} className="text-emerald-600" />
            <h3 className="mt-4 text-lg font-black text-slate-950">{item}</h3>
            <p className="mt-2 text-sm leading-6 text-slate-500">
              Built with modern dashboard patterns, responsive layouts, and
              realistic SaaS data.
            </p>
          </div>
        ))}
      </section>
      <section className="grid gap-4 xl:grid-cols-[0.85fr_1.15fr]">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm shadow-slate-200/70">
          <p className="text-sm font-black uppercase tracking-[0.18em] text-emerald-600">
            Enterprise Ready
          </p>
          <h3 className="mt-3 text-2xl font-black tracking-tight text-slate-950">
            Built for confident revenue reviews.
          </h3>
          <div className="mt-6 space-y-4">
            <TrustRow
              icon={LockKeyhole}
              title="Role-aware workspace"
              copy="Separate executive, manager, and sales views can be layered on top."
            />
            <TrustRow
              icon={Globe2}
              title="Global SaaS style"
              copy="The layout feels familiar to buyers of polished marketplace dashboards."
            />
            <TrustRow
              icon={Clock3}
              title="Fast decision cycles"
              copy="Pipeline, leads, reports, and activity stay close to the daily workflow."
            />
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {testimonials.map((testimonial) => (
            <article
              key={testimonial.name}
              className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm shadow-slate-200/70"
            >
              <div className="flex gap-1 text-amber-400">
                {Array.from({ length: 5 }).map((_, index) => (
                  <Star key={index} size={16} fill="currentColor" />
                ))}
              </div>
              <p className="mt-4 text-sm font-bold leading-7 text-slate-700">
                "{testimonial.quote}"
              </p>
              <div className="mt-5 border-t border-slate-100 pt-4">
                <p className="font-black text-slate-950">{testimonial.name}</p>
                <p className="text-xs font-bold text-slate-500">
                  {testimonial.role}
                </p>
              </div>
            </article>
          ))}
        </div>
      </section>
      <footer className="flex flex-col justify-between gap-4 rounded-3xl border border-slate-200 bg-white px-5 py-6 shadow-sm shadow-slate-200/70 sm:flex-row sm:items-center">
        <div>
          <p className="text-lg font-black tracking-tight text-slate-950">
            InsightDesk CRM
          </p>
          <p className="text-sm font-medium text-slate-500">
            Premium CRM analytics dashboard concept for portfolio and client work.
          </p>
        </div>
        <Link
          to="/dashboard"
          className="inline-flex items-center justify-center gap-2 rounded-2xl bg-slate-950 px-5 py-3 text-sm font-black text-white shadow-lg shadow-slate-900/20"
        >
          View Product
          <TrendingUp size={17} />
        </Link>
      </footer>
    </Page>
  );
}

function SettingsPage() {
  const [settings, setSettings] = useState({
    "Lead score automation": true,
    "Weekly executive digest": true,
    "Pipeline risk alerts": true,
    "Team activity emails": false,
  });

  return (
    <Page>
      <PageHeader
        eyebrow="Settings"
        title="Workspace preferences for a sales operations team."
        copy="Mock configuration controls round out the product feel without adding backend complexity."
      />
      <section className="grid gap-4 lg:grid-cols-2">
        {Object.keys(settings).map((setting) => (
            <label
              key={setting}
              className="flex items-center justify-between gap-4 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm shadow-slate-200/70 transition hover:border-emerald-200 hover:shadow-lg hover:shadow-emerald-100"
            >
              <span>
                <span className="block font-black text-slate-900">
                  {setting}
                </span>
                <span className="mt-1 block text-sm font-medium text-slate-500">
                  {settings[setting] ? "Enabled for this workspace" : "Currently disabled"}
                </span>
              </span>
              <input
                type="checkbox"
                checked={settings[setting]}
                onChange={() =>
                  setSettings((current) => ({
                    ...current,
                    [setting]: !current[setting],
                  }))
                }
                className="h-5 w-5 shrink-0 accent-emerald-500"
              />
            </label>
        ))}
      </section>
    </Page>
  );
}

function downloadReportSummary() {
  const report = {
    product: "InsightDesk CRM",
    generatedAt: new Date().toISOString(),
    metrics,
    reports,
  };
  const blob = new Blob([JSON.stringify(report, null, 2)], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = "insightdesk-report-summary.json";
  anchor.click();
  URL.revokeObjectURL(url);
}

function ChartCard({ title, children }) {
  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm shadow-slate-200/70">
      <div className="mb-5 flex items-center justify-between">
        <h3 className="text-xl font-black text-slate-950">{title}</h3>
        <ArrowDownUp size={18} className="text-slate-400" />
      </div>
      {children}
    </section>
  );
}

function MiniPanel({ label, value }) {
  return (
    <div className="rounded-2xl bg-slate-50 p-4">
      <p className="text-xs font-bold uppercase tracking-[0.14em] text-slate-400">
        {label}
      </p>
      <p className="mt-1 text-xl font-black text-slate-950">{value}</p>
    </div>
  );
}

function TrustRow({ icon: Icon, title, copy, dark = false }) {
  return (
    <div className="flex gap-4">
      <div
        className={`grid h-11 w-11 shrink-0 place-items-center rounded-2xl ${
          dark ? "bg-white/10 text-emerald-300" : "bg-emerald-50 text-emerald-700"
        }`}
      >
        <Icon size={19} />
      </div>
      <div>
        <p className={`font-black ${dark ? "text-white" : "text-slate-950"}`}>
          {title}
        </p>
        <p
          className={`mt-1 text-sm leading-6 ${
            dark ? "text-slate-300" : "text-slate-500"
          }`}
        >
          {copy}
        </p>
      </div>
    </div>
  );
}

function TableSkeleton() {
  return (
    <div className="space-y-3" aria-label="Loading leads">
      {Array.from({ length: 6 }).map((_, index) => (
        <div
          key={index}
          className="grid gap-3 rounded-2xl border border-slate-100 bg-slate-50 p-4 sm:grid-cols-[1.1fr_0.8fr_1.3fr_0.45fr_0.6fr_0.6fr]"
        >
          {Array.from({ length: 6 }).map((__, childIndex) => (
            <div
              key={childIndex}
              className="h-4 animate-pulse rounded-full bg-slate-200"
            />
          ))}
        </div>
      ))}
    </div>
  );
}

function EmptyState({ title }) {
  return (
    <div className="grid min-h-56 place-items-center rounded-3xl border border-dashed border-emerald-200 bg-emerald-50/50 p-8 text-center">
      <div>
        <div className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-white text-emerald-700 shadow-sm">
          <Search size={24} />
        </div>
        <p className="mt-3 font-black text-slate-900">{title}</p>
        <p className="mt-1 text-sm font-medium text-slate-500">
          Try changing the search term or status filter.
        </p>
      </div>
    </div>
  );
}

function RevenueMiniChart() {
  return (
    <div className="h-72">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={revenueData}>
          <XAxis dataKey="month" stroke="#cbd5e1" />
          <YAxis stroke="#cbd5e1" />
          <Tooltip />
          <Line type="monotone" dataKey="revenue" stroke="#10b981" strokeWidth={3} />
          <Line type="monotone" dataKey="pipeline" stroke="#38bdf8" strokeWidth={3} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export default AppShell;
