import { pipelineStages } from "../data/dashboardData";

export default function Pipeline() {
  return (
    <section className="min-w-0 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm shadow-slate-200/70">
      <div className="mb-6">
        <p className="text-sm font-bold uppercase tracking-[0.18em] text-emerald-600">
          Deal Pipeline
        </p>
        <h2 className="mt-2 text-2xl font-black tracking-tight text-slate-950">
          Lead stages
        </h2>
      </div>

      <div className="space-y-5">
        {pipelineStages.map((stage) => (
          <div key={stage.title}>
            <div className="mb-2 flex items-center justify-between gap-3">
              <div>
                <p className="text-sm font-black text-slate-900">
                  {stage.title}
                </p>
                <p className="text-xs font-medium text-slate-500">
                  {stage.count} accounts
                </p>
              </div>
              <p className="text-sm font-black text-slate-950">
                {stage.value}
              </p>
            </div>

            <div className="h-3 overflow-hidden rounded-full bg-slate-100">
              <div
                className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-500"
                style={{ width: `${stage.percent}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
