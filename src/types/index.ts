export type CourseStatus = 'enrolled' | 'completed' | 'planned';
export type RiskLevel = 'CRITICAL' | 'AT_RISK' | 'WATCH' | 'NORMAL';
export type SubmissionStatus = 'submitted' | 'unsubmitted' | 'graded' | 'missing' | 'excused';

export interface Course {
  id: string;
  canvas_id: number | null;
  course_code: string;
  name: string;
  term: string;
  term_order: number;
  units: number;
  instructor: string | null;
  status: CourseStatus;
  current_grade: string | null;
  current_score: number | null;
  created_at: string;
  updated_at: string;
}

export interface Assignment {
  id: string;
  canvas_id: number | null;
  course_id: string;
  course?: Course;
  name: string;
  description: string | null;
  due_at: string | null;
  points_possible: number;
  submission_status: SubmissionStatus;
  score: number | null;
  risk_level: RiskLevel;
  risk_reason: string | null;
  created_at: string;
  updated_at: string;
}

export interface Announcement {
  id: string;
  canvas_id: number | null;
  course_id: string | null;
  title: string;
  content: string | null;
  category: 'CANVAS_WATCH' | 'COLLEGE_NEWS' | 'SCHOLARSHIP';
  badge: string | null;
  posted_at: string;
  source_url: string | null;
}

export interface FlightLabLog {
  id: string;
  course_id: string;
  title: string;
  flight_date: string;
  aircraft_type: string;
  tail_number: string | null;
  airport_code: string;
  flight_hours: number;
  dual_hours: number;
  solo_hours: number;
  sim_hours: number;
  maneuvers_covered: string | null;
  instructor_remarks: string | null;
  status: 'scheduled' | 'completed' | 'cancelled';
  created_at: string;
}

export interface SyncLog {
  id: string;
  provider: string;
  synced_at: string;
  status: 'SUCCESS' | 'PARTIAL' | 'FAILED';
  courses_synced: number;
  assignments_synced: number;
  announcements_synced: number;
  error_message: string | null;
}

// Canvas LMS API Types
export interface CanvasApiCourse {
  id: number;
  name: string;
  course_code?: string;
  term?: { name: string };
  enrollments?: Array<{
    type: string;
    computed_current_score?: number;
    computed_current_grade?: string;
  }>;
  teachers?: Array<{ display_name: string }>;
}

export interface CanvasApiAssignment {
  id: number;
  name: string;
  description?: string;
  due_at?: string | null;
  points_possible?: number;
  has_submitted_submissions?: boolean;
  submission?: {
    workflow_state?: string;
    score?: number;
  };
}

export interface CanvasApiAnnouncement {
  id: number;
  title: string;
  message: string;
  posted_at: string;
  url?: string;
}
