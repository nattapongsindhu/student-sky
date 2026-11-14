import type { Course } from "./semester";

export type CanvasAnnouncement = {
  id: number;
  courseCode: string;
  postedAt: string | null;
  title: string;
  url: string | null;
  summary: string;
};

type CanvasAnnouncementResponse = {
  id: number;
  title?: string;
  message?: string | null;
  posted_at?: string | null;
  delayed_post_at?: string | null;
  html_url?: string | null;
  context_code?: string;
};

function stripHtml(value: string | null | undefined) {
  if (!value) return "No flight / course announcement details provided.";
  return value
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 260);
}

export async function getCanvasAnnouncements(courses: Course[]): Promise<CanvasAnnouncement[]> {
  const baseUrl = (process.env.CANVAS_BASE_URL || "https://glendale.instructure.com").replace(/\/$/, "");
  const token = process.env.CANVAS_ACCESS_TOKEN || process.env.CANVAS_API_TOKEN;
  const canvasCourses = courses.filter((course) => course.canvas_course_id !== null);

  if (!baseUrl || !token || canvasCourses.length === 0) {
    return [
      {
        id: 1,
        courseCode: "KPOC Dispatch",
        postedAt: "2026-11-14T08:00:00-08:00",
        title: "Whiteman Airport (KPOC) Flight Dispatch Advisory",
        url: "https://glendale.instructure.com",
        summary: "Cessna 172 N172GC 100-hour inspection completed and cleared for instrument training flights. Verify runway NOTAMs before preflight.",
      },
      {
        id: 2,
        courseCode: "FAA Exam",
        postedAt: "2026-11-12T10:15:00-08:00",
        title: "FAA Instrument Rating Knowledge Exam Voucher Window",
        url: "https://glendale.instructure.com",
        summary: "Ground school endorsement sign-offs available for students with 90%+ average on sample exams. PSI testing center booking open.",
      },
      {
        id: 3,
        courseCode: "AT 121L",
        postedAt: "2026-11-09T14:30:00-08:00",
        title: "Redbird FMX Full-Motion Simulator Software Update",
        url: "https://glendale.instructure.com",
        summary: "Garmin G1000 NXi avionics navigation database updated to current cycle 2611. All student profiles backed up.",
      },
    ];
  }

  const courseByContextCode = new Map(canvasCourses.map((course) => [`course_${course.canvas_course_id}`, course]));
  const params = new URLSearchParams({
    active_only: "true",
    per_page: "10",
  });

  for (const course of canvasCourses) {
    params.append("context_codes[]", `course_${course.canvas_course_id}`);
  }

  try {
    const response = await fetch(`${baseUrl}/api/v1/announcements?${params.toString()}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      next: {
        revalidate: 900,
      },
    });

    if (!response.ok) {
      return [];
    }

    const rows = (await response.json()) as CanvasAnnouncementResponse[];
    if (!rows.length) return [];

    return rows
      .map((announcement) => {
        const course = announcement.context_code ? courseByContextCode.get(announcement.context_code) : undefined;
        return {
          id: announcement.id,
          courseCode: course?.code ?? "Canvas",
          postedAt: announcement.posted_at ?? announcement.delayed_post_at ?? null,
          title: announcement.title ?? "Untitled announcement",
          url: announcement.html_url ?? null,
          summary: stripHtml(announcement.message),
        };
      })
      .sort((a, b) => {
        if (!a.postedAt && !b.postedAt) return 0;
        if (!a.postedAt) return 1;
        if (!b.postedAt) return -1;
        return new Date(b.postedAt).getTime() - new Date(a.postedAt).getTime();
      })
      .slice(0, 3);
  } catch {
    return [];
  }
}
