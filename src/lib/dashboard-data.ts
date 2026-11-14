import { getSupabaseAdmin } from "./supabase";
import { isCanvasTokenExpiredError } from "./canvas-sync";
import { seedAssignments, seedCourses } from "./semester";
import type { CanvasSyncStatus } from "./canvas-sync";
import type { Assignment, Course } from "./semester";

export type DashboardData = {
  courses: Course[];
  assignments: Assignment[];
  courseAssignments: Assignment[];
  lastSyncAt: string | null;
  lastAttemptAt: string | null;
  syncStatus: CanvasSyncStatus;
  lastSyncCourses: number;
  lastSyncAssignments: number;
  lastSyncChanges: number;
  lastSyncError: string | null;
  source: "supabase" | "seed";
};

type SyncRunRow = {
  status: string;
  courses_seen: number;
  assignments_seen: number;
  changes_seen: number;
  error_message: string | null;
  finished_at: string;
};

function statusFromSyncRun(run: SyncRunRow | null | undefined): CanvasSyncStatus {
  if (!run) {
    return "ok";
  }

  if (run.status === "token_expired" || isCanvasTokenExpiredError(new Error(run.error_message ?? run.status))) {
    return "token_expired";
  }

  if (run.status === "failed") {
    return "sync_failed";
  }

  return "ok";
}

export async function getDashboardData(): Promise<DashboardData> {
  const supabase = getSupabaseAdmin();

  if (!supabase) {
    return {
      courses: seedCourses,
      assignments: seedAssignments,
      courseAssignments: seedAssignments,
      lastSyncAt: null,
      lastAttemptAt: null,
      syncStatus: "ok",
      lastSyncCourses: 0,
      lastSyncAssignments: 0,
      lastSyncChanges: 0,
      lastSyncError: null,
      source: "seed",
    };
  }

  try {
    const [coursesResult, assignmentsResult, courseAssignmentsResult, latestSyncResult, successfulSyncResult] = await Promise.all([
      supabase.from("courses").select("*").order("starts_on", { ascending: true }),
      supabase
        .from("assignments")
        .select("*")
        .neq("status", "GRADED")
        .neq("status", "CANVAS_CONFIRMED")
        .neq("status", "CANCELLED")
        .order("due_at", { ascending: true, nullsFirst: false }),
      supabase
        .from("assignments")
        .select("*")
        .neq("status", "CANCELLED")
        .order("due_at", { ascending: true, nullsFirst: false }),
      supabase
        .from("sync_runs")
        .select("status, courses_seen, assignments_seen, changes_seen, error_message, finished_at")
        .order("finished_at", { ascending: false })
        .limit(1)
        .maybeSingle(),
      supabase
        .from("sync_runs")
        .select("finished_at")
        .eq("status", "success")
        .order("finished_at", { ascending: false })
        .limit(1)
        .maybeSingle(),
    ]);

    if (coursesResult.error || assignmentsResult.error || !coursesResult.data?.length) {
      return {
        courses: seedCourses,
        assignments: seedAssignments,
        courseAssignments: seedAssignments,
        lastSyncAt: successfulSyncResult.data?.finished_at ?? null,
        lastAttemptAt: latestSyncResult.data?.finished_at ?? null,
        syncStatus: statusFromSyncRun(latestSyncResult.data),
        lastSyncCourses: latestSyncResult.data?.courses_seen ?? 0,
        lastSyncAssignments: latestSyncResult.data?.assignments_seen ?? 0,
        lastSyncChanges: latestSyncResult.data?.changes_seen ?? 0,
        lastSyncError: latestSyncResult.data?.error_message ?? null,
        source: "seed",
      };
    }

    return {
      courses: coursesResult.data as Course[],
      assignments: assignmentsResult.data as Assignment[],
      courseAssignments: (courseAssignmentsResult.data as Assignment[]) || [],
      lastSyncAt: successfulSyncResult.data?.finished_at ?? null,
      lastAttemptAt: latestSyncResult.data?.finished_at ?? null,
      syncStatus: statusFromSyncRun(latestSyncResult.data),
      lastSyncCourses: latestSyncResult.data?.courses_seen ?? 0,
      lastSyncAssignments: latestSyncResult.data?.assignments_seen ?? 0,
      lastSyncChanges: latestSyncResult.data?.changes_seen ?? 0,
      lastSyncError: latestSyncResult.data?.error_message ?? null,
      source: "supabase",
    };
  } catch {
    return {
      courses: seedCourses,
      assignments: seedAssignments,
      courseAssignments: seedAssignments,
      lastSyncAt: null,
      lastAttemptAt: null,
      syncStatus: "ok",
      lastSyncCourses: 0,
      lastSyncAssignments: 0,
      lastSyncChanges: 0,
      lastSyncError: null,
      source: "seed",
    };
  }
}
