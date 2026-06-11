import { activities } from "../data/dashboardData";

export default function ActivityFeed() {
  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm shadow-slate-200/70">
      <div className="mb-6">
        <p className="text-sm font-bold uppercase tracking-[0.18em] text-emerald-600">
          Live Activity
        </p>
        <h2 className="mt-2 text-2xl font-black tracking-tight text-slate-950">
          Team updates
        </h2>
      </div>

      <div className="space-y-4">
        {activities.map((activity) => (
          <article
            key={`${activity.person}-${activity.time}`}
            className="rounded-2xl border border-slate-100 bg-slate-50 p-4"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm font-black text-slate-950">
                  {activity.person}
                </p>
                <p className="mt-1 text-sm leading-6 text-slate-600">
                  {activity.action}
                </p>
              </div>

              <span className="rounded-full bg-white px-3 py-1 text-xs font-black text-emerald-700 shadow-sm">
                {activity.status}
              </span>
            </div>

            <p className="mt-3 text-xs font-bold text-slate-400">
              {activity.time}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}