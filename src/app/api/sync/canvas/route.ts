import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseServerClient } from '@/lib/supabase/server';
import { gccCanvasClient } from '@/lib/canvas/client';
import { evaluateAssignmentRisk } from '@/lib/risk-engine/engine';
import { SubmissionStatus } from '@/types';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  const supabase = getSupabaseServerClient();
  const authHeader = req.headers.get('authorization');
  const cronSecret = process.env.CRON_SECRET;

  // Verify bearer secret if CRON_SECRET is configured
  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    // Check if it's an internal dashboard trigger request
    const triggerSource = req.headers.get('x-dashboard-trigger');
    if (triggerSource !== 'student-sky-dashboard') {
      return NextResponse.json({ error: 'Unauthorized: Invalid credentials' }, { status: 401 });
    }
  }

  // Check if Canvas client has API token
  if (!gccCanvasClient.isConfigured()) {
    return NextResponse.json({
      success: false,
      message: 'GCC Canvas API Token is not configured. Please set CANVAS_API_TOKEN in environment variables.',
    }, { status: 400 });
  }

  let coursesCount = 0;
  let assignmentsCount = 0;
  let announcementsCount = 0;

  try {
    // 1. Fetch active courses from GCC Canvas
    const canvasCourses = await gccCanvasClient.getActiveCourses();
    const courseCanvasIds: number[] = [];

    for (const c of canvasCourses) {
      if (!c.id || !c.name) continue;
      courseCanvasIds.push(c.id);

      // Extract current grade/score if present
      const studentEnrollment = c.enrollments?.find(e => e.type === 'student');
      const currentScore = studentEnrollment?.computed_current_score ?? null;
      const currentGrade = studentEnrollment?.computed_current_grade ?? null;
      const instructor = c.teachers?.[0]?.display_name ?? null;

      // Upsert course
      const { error: courseError } = await supabase
        .from('courses')
        .upsert({
          canvas_id: c.id,
          name: c.name,
          course_code: c.course_code || c.name.split(':')[0] || 'GCC-AVN',
          term: c.term?.name || 'Spring 2026',
          status: 'enrolled',
          instructor: instructor,
          current_grade: currentGrade,
          current_score: currentScore,
          updated_at: new Date().toISOString(),
        }, { onConflict: 'canvas_id' });

      if (!courseError) {
        coursesCount++;
      }

      // 2. Fetch assignments for this course
      try {
        // Look up the internal UUID of this course
        const { data: dbCourse } = await supabase
          .from('courses')
          .select('id')
          .eq('canvas_id', c.id)
          .single();

        if (dbCourse) {
          const assignments = await gccCanvasClient.getCourseAssignments(c.id);

          for (const a of assignments) {
            let submissionStatus: SubmissionStatus = 'unsubmitted';
            let score = a.submission?.score ?? null;

            if (a.submission?.workflow_state === 'graded') {
              submissionStatus = 'graded';
            } else if (a.submission?.workflow_state === 'submitted' || a.has_submitted_submissions) {
              submissionStatus = 'submitted';
            }

            const pointsPossible = a.points_possible ?? 0;
            const { riskLevel, riskReason } = evaluateAssignmentRisk(
              a.due_at || null,
              submissionStatus,
              pointsPossible,
              score
            );

            const { error: assignError } = await supabase
              .from('assignments')
              .upsert({
                canvas_id: a.id,
                course_id: dbCourse.id,
                name: a.name,
                description: a.description || null,
                due_at: a.due_at || null,
                points_possible: pointsPossible,
                submission_status: submissionStatus,
                score: score,
                risk_level: riskLevel,
                risk_reason: riskReason,
                updated_at: new Date().toISOString(),
              }, { onConflict: 'canvas_id' });

            if (!assignError) {
              assignmentsCount++;
            }
          }
        }
      } catch (assignErr) {
        console.error(`Failed to sync assignments for course ${c.id}:`, assignErr);
      }
    }

    // 3. Fetch announcements
    if (courseCanvasIds.length > 0) {
      try {
        const announcements = await gccCanvasClient.getAnnouncements(courseCanvasIds);
        for (const ann of announcements) {
          const { error: annError } = await supabase
            .from('announcements')
            .upsert({
              canvas_id: ann.id,
              title: ann.title,
              content: ann.message,
              category: 'CANVAS_WATCH',
              badge: 'GCC Canvas',
              posted_at: ann.posted_at,
              source_url: ann.url || null,
            }, { onConflict: 'canvas_id' });

          if (!annError) {
            announcementsCount++;
          }
        }
      } catch (annErr) {
        console.error('Failed to sync announcements:', annErr);
      }
    }

    // 4. Log successful sync run
    await supabase.from('sync_logs').insert({
      provider: 'GCC_CANVAS',
      synced_at: new Date().toISOString(),
      status: 'SUCCESS',
      courses_synced: coursesCount,
      assignments_synced: assignmentsCount,
      announcements_synced: announcementsCount,
      error_message: null,
    });

    return NextResponse.json({
      success: true,
      message: 'GCC Canvas synchronization completed successfully',
      stats: {
        courses: coursesCount,
        assignments: assignmentsCount,
        announcements: announcementsCount,
      },
    });
  } catch (error: any) {
    console.error('Canvas sync failed:', error);

    // Record error in sync_logs
    await supabase.from('sync_logs').insert({
      provider: 'GCC_CANVAS',
      synced_at: new Date().toISOString(),
      status: 'FAILED',
      courses_synced: coursesCount,
      assignments_synced: assignmentsCount,
      announcements_synced: announcementsCount,
      error_message: error.message || 'Unknown error during Canvas sync',
    });

    return NextResponse.json({
      success: false,
      error: error.message || 'Failed to sync with GCC Canvas',
    }, { status: 500 });
  }
}
