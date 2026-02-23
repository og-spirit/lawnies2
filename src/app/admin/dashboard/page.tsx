import { getAllOperators } from "@/lib/queries/operators";

export default async function DashboardPage() {
  const operators = await getAllOperators();

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-slate-900">Operators</h1>
          <p className="text-slate-500 text-sm mt-1">
            {operators.length} operator{operators.length !== 1 ? "s" : ""} signed up
          </p>
        </div>
      </div>

      {operators.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
          <p className="text-slate-400 text-lg">No operators yet.</p>
          <p className="text-slate-400 text-sm mt-1">
            Signups will appear here after Stripe checkout completes.
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50">
                  <th className="text-left px-4 py-3 font-semibold text-slate-600">
                    Business Name
                  </th>
                  <th className="text-left px-4 py-3 font-semibold text-slate-600">
                    Email
                  </th>
                  <th className="text-left px-4 py-3 font-semibold text-slate-600">
                    Phone
                  </th>
                  <th className="text-left px-4 py-3 font-semibold text-slate-600">
                    Status
                  </th>
                  <th className="text-left px-4 py-3 font-semibold text-slate-600">
                    Signed Up
                  </th>
                  <th className="text-left px-4 py-3 font-semibold text-slate-600">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {operators.map((op) => (
                  <tr
                    key={op.id}
                    className="border-b border-slate-100 hover:bg-slate-50 transition-colors"
                  >
                    <td className="px-4 py-3 font-semibold text-slate-900">
                      {op.business_name}
                    </td>
                    <td className="px-4 py-3 text-slate-600">{op.email}</td>
                    <td className="px-4 py-3 text-slate-600">{op.phone}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-block px-2 py-0.5 rounded-full text-xs font-semibold ${
                          op.subscription_status === "active"
                            ? "bg-emerald-100 text-emerald-700"
                            : "bg-slate-100 text-slate-600"
                        }`}
                      >
                        {op.subscription_status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-slate-500">
                      {new Date(op.created_at).toLocaleDateString("en-AU", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </td>
                    <td className="px-4 py-3">
                      {/* Future: Export to lawnies-instant-estimate */}
                      {/* TODO: Implement API call to POST operator data to lawnies-instant-estimate */}
                      <button
                        disabled
                        title="Coming soon: sync this operator to lawnies-instant-estimate"
                        className="text-xs px-3 py-1 rounded-lg border border-slate-200 text-slate-400 cursor-not-allowed"
                      >
                        Export to instant-estimate
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Stripe subscription IDs for reference */}
      {operators.length > 0 && (
        <details className="mt-6 bg-white rounded-2xl border border-slate-200 p-4">
          <summary className="text-sm font-semibold text-slate-600 cursor-pointer">
            Stripe details (expand)
          </summary>
          <div className="mt-4 space-y-2">
            {operators.map((op) => (
              <div key={op.id} className="text-xs text-slate-500 font-mono">
                <span className="font-semibold text-slate-700">
                  {op.business_name}
                </span>{" "}
                — customer: {op.stripe_customer_id || "—"} / sub:{" "}
                {op.stripe_subscription_id || "—"}
              </div>
            ))}
          </div>
        </details>
      )}
    </div>
  );
}
