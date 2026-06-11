import { customers } from "../data/dashboardData";

const statusClasses = {
  Proposal: "bg-amber-50 text-amber-700",
  Discovery: "bg-sky-50 text-sky-700",
  Active: "bg-emerald-50 text-emerald-700",
  Negotiation: "bg-violet-50 text-violet-700",
};

export default function CustomerTable() {
  function exportCustomers() {
    const header = "Company,Contact,Plan,Deal Value,Status";
    const rows = customers.map((customer) =>
      [
        customer.company,
        customer.contact,
        customer.plan,
        customer.value,
        customer.status,
      ].join(","),
    );
    const blob = new Blob([[header, ...rows].join("\n")], {
      type: "text/csv",
    });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "insightdesk-customers.csv";
    anchor.click();
    URL.revokeObjectURL(url);
  }

  return (
    <section className="min-w-0 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm shadow-slate-200/70 lg:col-span-2">
      <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-emerald-600">
            Customer Intelligence
          </p>
          <h2 className="mt-2 text-2xl font-black tracking-tight text-slate-950">
            High-value accounts
          </h2>
        </div>

        <button
          type="button"
          onClick={exportCustomers}
          className="rounded-2xl bg-slate-950 px-5 py-3 text-sm font-black text-white shadow-lg shadow-slate-900/20"
        >
          Export Report
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[640px] text-left">
          <thead>
            <tr className="border-b border-slate-200 text-xs uppercase tracking-[0.14em] text-slate-400">
              <th className="pb-4 font-black">Company</th>
              <th className="pb-4 font-black">Contact</th>
              <th className="pb-4 font-black">Plan</th>
              <th className="pb-4 font-black">Deal Value</th>
              <th className="pb-4 font-black">Status</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100">
            {customers.map((customer) => (
              <tr key={customer.company}>
                <td className="py-4">
                  <p className="font-black text-slate-950">
                    {customer.company}
                  </p>
                </td>
                <td className="py-4 text-sm font-medium text-slate-600">
                  {customer.contact}
                </td>
                <td className="py-4 text-sm font-bold text-slate-700">
                  {customer.plan}
                </td>
                <td className="py-4 text-sm font-black text-slate-950">
                  {customer.value}
                </td>
                <td className="py-4">
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-black ${
                      statusClasses[customer.status] ||
                      "bg-slate-100 text-slate-700"
                    }`}
                  >
                    {customer.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
