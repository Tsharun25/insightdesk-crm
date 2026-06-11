import { Sparkles } from "lucide-react";
import { insights } from "../data/dashboardData";

export default function InsightCard() {
  return (
    <section className="rounded-3xl bg-slate-950 p-5 text-white shadow-xl shadow-slate-900/20">
      <div className="mb-5 flex items-center gap-3">
        <div className="grid h-11 w-11 place-items-center rounded-2xl bg-emerald-500">
          <Sparkles size={21} />
        </div>

        <div>
          <p className="text-sm font-bold text-emerald-300">AI Insights</p>
          <h2 className="text-xl font-black tracking-tight">
            Smart sales signals
          </h2>
        </div>
      </div>

      <div className="space-y-3">
        {insights.map((insight) => (
          <div
            key={insight}
            className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm leading-6 text-slate-200"
          >
            {insight}
          </div>
        ))}
      </div>
    </section>
  );
}