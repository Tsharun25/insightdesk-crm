import {
    Area,
    AreaChart,
    CartesianGrid,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
  } from "recharts";
  import { revenueData } from "../data/dashboardData";
  
  export default function RevenueChart() {
    return (
      <section className="min-w-0 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm shadow-slate-200/70 lg:col-span-2">
        <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-emerald-600">
              Revenue Analytics
            </p>
            <h2 className="mt-2 text-2xl font-black tracking-tight text-slate-950">
              Sales performance overview
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Track revenue growth and pipeline value month by month.
            </p>
          </div>
  
          <select className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-bold text-slate-700 outline-none">
            <option>Last 7 months</option>
            <option>Last 90 days</option>
            <option>This year</option>
          </select>
        </div>
  
        <div className="h-80 w-full min-w-0 overflow-hidden">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={revenueData}>
              <defs>
                <linearGradient id="revenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.28} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="pipeline" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0f172a" stopOpacity={0.22} />
                  <stop offset="95%" stopColor="#0f172a" stopOpacity={0} />
                </linearGradient>
              </defs>
  
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
              <XAxis dataKey="month" axisLine={false} tickLine={false} />
              <YAxis axisLine={false} tickLine={false} />
              <Tooltip />
              <Area
                type="monotone"
                dataKey="pipeline"
                stroke="#0f172a"
                strokeWidth={3}
                fill="url(#pipeline)"
              />
              <Area
                type="monotone"
                dataKey="revenue"
                stroke="#10b981"
                strokeWidth={3}
                fill="url(#revenue)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </section>
    );
  }
