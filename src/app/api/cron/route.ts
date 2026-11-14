import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get('authorization');
  const cronSecret = process.env.CRON_SECRET;

  // Validate Vercel Cron Secret
  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: 'Unauthorized: Invalid Cron Secret' }, { status: 401 });
  }

  try {
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const syncUrl = `${appUrl}/api/sync/canvas`;

    const response = await fetch(syncUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${cronSecret || ''}`,
        'x-dashboard-trigger': 'student-sky-dashboard',
      },
    });

    const result = await response.json();

    return NextResponse.json({
      success: true,
      job: 'GCC_CANVAS_0600AM_SYNC',
      executed_at: new Date().toISOString(),
      result,
    });
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      job: 'GCC_CANVAS_0600AM_SYNC',
      error: error.message || 'Cron job failed',
    }, { status: 500 });
  }
}
