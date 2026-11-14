import Link from "next/link";
import { AlertTriangle, ArrowLeft, CheckCircle2, RefreshCw } from "lucide-react";
import { ManualSyncPanel } from "@/components/manual-sync-panel";
import { getSyncDashboardData } from "@/lib/sync-dashboard-data";
import { formatShortDate } from "@/lib/semester";

export default async function SyncPage() {
  const data = await getSyncDashboardData();
  const latest = data.syncRuns[0];

  return (
    <main className="min-h-screen bg-[#f7f8f3] text-slate-950">
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-5 py-8 lg:px-8">
          <Link className="inline-flex items-center gap-2 text-sm font-semibold text-teal-800" href="/">
            <ArrowLeft className="h-4 w-4" />
            Home
          </Link>
          <div className="mt-5 flex flex-col justify-between gap-5 lg:flex-row lg:items-end">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-teal-700">GCC Canvas Sync Console</p>
              <h1 className="mt-3 max-w-3xl text-4xl font-semibold tracking-normal md:text-5xl">
                Verify that Glendale Canvas LMS is being audited for flight labs and ground school.
              </h1>
            </div>
            <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
              <div className="flex items-center gap-2 text-sm font-semibold">
                <RefreshCw className="h-4 w-4" />
                Latest Run
              </div>
              <p className="mt-2 text-sm text-slate-600">
                {latest ? `${latest.status} · ${formatShortDate(latest.finished_at)}` : "No Supabase sync run recorded yet."}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-6 px-5 py-6 lg:grid-cols-[0.8fr_1.2fr] lg:px-8">
        <div className="space-y-6">
          <ManualSyncPanel />

          <div className="rounded-lg border border-slate-200 bg-white p-5">
            <h2 className="text-xl font-semibold">Configuration Check</h2>
            <div className="mt-4 space-y-3">
              <ConfigRow ok={data.configured.supabase} label="Supabase URL + Service Role Key" />
              <ConfigRow ok={data.configured.canvasBaseUrl} label="Glendale Canvas Base URL" />
              <ConfigRow ok={data.configured.canvasToken} label="Canvas API Access Token" />
              <ConfigRow ok={data.configured.cronSecret} label="Vercel Daily Cron Secret (06:00 AM PST)" />
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-lg border border-slate-200 bg-white p-5">
            <h2 className="text-xl font-semibold">Recent Sync Runs</h2>
            <div className="mt-4 overflow-hidden rounded-lg border border-slate-200">
              {data.syncRuns.length ? (
                data.syncRuns.map((run) => (
                  <div className="grid gap-2 border-b border-slate-200 p-4 last:border-0 md:grid-cols-[1fr_auto]" key={run.id}>
                    <div>
                      <div className="flex items-center gap-2 text-sm font-semibold">
                        {run.status === "success" ? (
                          <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                        ) : (
                          <AlertTriangle className="h-4 w-4 text-rose-600" />
                        )}
                        <span>{run.status === "success" ? "Sync Completed" : "Sync Failed"}</span>
                      </div>
                      <p className="mt-1 text-sm text-slate-600">
                        {run.courses_seen} courses · {run.assignments_seen} assignments · {run.changes_seen} changes detected
                      </p>
                      {run.error_message ? <p className="mt-1 text-xs text-rose-700">{run.error_message}</p> : null}
                    </div>
                    <div className="text-xs text-slate-500 md:text-right">{formatShortDate(run.finished_at)}</div>
                  </div>
                ))
              ) : (
                <p className="p-4 text-sm text-slate-600">No sync runs recorded yet. Click &apos;Sync Now&apos; above.</p>
              )}
            </div>
          </div>

          <div className="rounded-lg border border-slate-200 bg-white p-5">
            <h2 className="text-xl font-semibold">Detected Changes &amp; Mismatches</h2>
            <div className="mt-4 overflow-hidden rounded-lg border border-slate-200">
              {data.changes.length ? (
                data.changes.map((event) => (
                  <div className="border-b border-slate-200 p-4 last:border-0" key={event.id}>
                    <p className="text-sm font-semibold">{event.title}</p>
                    <p className="mt-1 text-xs text-slate-500">
                      Severity: <span className="font-semibold uppercase">{event.severity}</span> · {formatShortDate(event.detected_at)}
                    </p>
                  </div>
                ))
              ) : (
                <p className="p-4 text-sm text-slate-600">No unacknowledged changes detected.</p>
              )}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

function ConfigRow({ label, ok }: { label: string; ok: boolean }) {
  return (
    <div className="flex items-center justify-between rounded-lg bg-slate-50 p-3 text-sm">
      <span className="font-medium text-slate-700">{label}</span>
      <span
        className={`inline-flex items-center gap-1 rounded px-2 py-0.5 text-xs font-semibold ${
          ok ? "bg-emerald-100 text-emerald-800" : "bg-rose-100 text-rose-800"
        }`}
      >
        {ok ? "Configured" : "Missing"}
      </span>
    </div>
  );
}
