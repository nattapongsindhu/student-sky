import { NextRequest, NextResponse } from "next/server";
import { verifyCronSecret } from "@/lib/auth";
import { recordCanvasSyncFailure, syncCanvasToSupabase } from "@/lib/canvas-sync";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const unauthorized = verifyCronSecret(request);
  if (unauthorized) return unauthorized;

  try {
    const result = await syncCanvasToSupabase();
    return NextResponse.json({
      ok: true,
      job: "GCC_CANVAS_0600AM_SYNC",
      executed_at: new Date().toISOString(),
      ...result,
    });
  } catch (error) {
    const failure = await recordCanvasSyncFailure(error);
    return NextResponse.json(
      {
        ok: false,
        job: "GCC_CANVAS_0600AM_SYNC",
        error: failure.message,
        syncStatus: failure.syncStatus,
        lastAttempt: failure.lastAttempt,
      },
      { status: failure.syncStatus === "token_expired" ? 401 : 500 },
    );
  }
}
