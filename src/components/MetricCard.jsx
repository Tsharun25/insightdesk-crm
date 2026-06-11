import { ArrowDownRight, ArrowUpRight } from "lucide-react";

export default function MetricCard({ metric }) {
  const isUp = metric.trend === "up";

  return (
    <article className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm shadow-slate-200/70">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-slate-500">{metric.label}</p>
          <h3 className="mt-3 text-2xl font-bold tracking-tight text-slate-950">
            {metric.value}
          </h3>
        </div>

        <div
          className={`flex items-center gap-1 rounded-full px-3 py-1 text-xs font-bold ${
            isUp
              ? "bg-emerald-50 text-emerald-700"
              : "bg-rose-50 text-rose-700"
          }`}
        >
          {isUp ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
          {metric.change}
        </div>
      </div>

      <p className="mt-4 text-sm text-slate-500">{metric.helper}</p>
    </article>
  );
}