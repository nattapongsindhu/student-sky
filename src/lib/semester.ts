import { realCanvasAssignments } from "./real-assignments";
import { gccCourseworkAssignments } from "./gcc-coursework";
import { AssignmentDifficulty, SourceKind, TaskStatus, TaskType } from "@/types/academic";

export type Course = {
  id: string;
  canvas_course_id: number | null;
  code: string;
  title: string;
  term_label: string;
  course_status: "upcoming" | "active" | "completed" | "case_study";
  campus: string;
  modality: string;
  units: number;
  final_grade: string | null;
  current_canvas_grade?: string | null;
  expected_grade?: string | null;
  official_grade?: string | null;
  starts_on: string;
  ends_on: string;
  weekly_hours: number;
  color: string;
  source: SourceKind;
};

export type Assignment = {
  id: string;
  course_id: string;
  canvas_assignment_id: number | null;
  title: string;
  due_at: string | null;
  status: TaskStatus;
  points_possible: number | null;
  estimated_minutes: number;
  difficulty: AssignmentDifficulty;
  task_type: TaskType;
  priority_score: number;
  risk_level: "LOW" | "WATCH" | "HIGH" | "CRITICAL";
  progress_percent: number;
  canvas_submission_confirmed: boolean;
  notes: string | null;
  url: string | null;
  source: SourceKind;
};

export const semesterStart = "2026-02-16";
export const semesterEnd = "2026-06-10";
export const schoolTimeZone = "America/Los_Angeles";

export type TermStatus = "active" | "archived" | "upcoming";
export type TermSeason = "winter" | "spring" | "summer" | "fall";

export interface TermConfig {
  id: string;
  label: string;
  year: number;
  season: TermSeason;
  status: TermStatus;
}

export const termConfigs: TermConfig[] = [
  { id: "2019-fall", label: "Fall 2019", year: 2019, season: "fall", status: "archived" },
  { id: "2020-winter", label: "Winter 2020", year: 2020, season: "winter", status: "archived" },
  { id: "2020-spring", label: "Spring 2020", year: 2020, season: "spring", status: "archived" },
  { id: "2020-fall", label: "Fall 2020", year: 2020, season: "fall", status: "archived" },
  { id: "2021-winter", label: "Winter 2021", year: 2021, season: "winter", status: "archived" },
  { id: "2021-spring", label: "Spring 2021", year: 2021, season: "spring", status: "archived" },
  { id: "2021-fall", label: "Fall 2021", year: 2021, season: "fall", status: "archived" },
  { id: "2026-spring", label: "Spring 2026", year: 2026, season: "spring", status: "active" },
];

export const termDateRanges: Record<string, { startsOn: string; endsOn: string }> = {
  "Fall 2019": { startsOn: "2019-09-03", endsOn: "2019-12-18" },
  "Winter 2020": { startsOn: "2020-01-06", endsOn: "2020-02-13" },
  "Spring 2020": { startsOn: "2020-02-18", endsOn: "2020-06-10" },
  "Fall 2020": { startsOn: "2020-08-31", endsOn: "2020-12-16" },
  "Winter 2021": { startsOn: "2021-01-04", endsOn: "2021-02-04" },
  "Spring 2021": { startsOn: "2021-02-16", endsOn: "2021-06-09" },
  "Fall 2021": { startsOn: "2021-08-30", endsOn: "2021-12-15" },
  "Spring 2026": { startsOn: "2026-02-16", endsOn: "2026-06-10" },
};

export function getActiveTermConfig() {
  return termConfigs.find((term) => term.status === "active") ?? termConfigs[termConfigs.length - 1];
}

export const seedCourses: Course[] = [
  // --- Fall 2019 ---
  {
    id: "f19-stdv103",
    canvas_course_id: null,
    code: "ST DV 103",
    title: "International Students",
    term_label: "Fall 2019",
    course_status: "completed",
    campus: "GCC Verdugo",
    modality: "Campus Lecture",
    units: 1.0,
    final_grade: "P",
    official_grade: "P",
    starts_on: "2019-09-03",
    ends_on: "2019-12-18",
    weekly_hours: 1.0,
    color: "#64748b",
    source: "canvas",
  },
  {
    id: "f19-esl123",
    canvas_course_id: null,
    code: "ESL 123",
    title: "Grammar & Writing II",
    term_label: "Fall 2019",
    course_status: "completed",
    campus: "Camino Real 223",
    modality: "Campus Lecture",
    units: 5.0,
    final_grade: "D",
    official_grade: "D",
    starts_on: "2019-09-03",
    ends_on: "2019-12-18",
    weekly_hours: 5.0,
    color: "#94a3b8",
    source: "canvas",
  },
  {
    id: "f19-esl125",
    canvas_course_id: 18126,
    code: "ESL 125",
    title: "Listening & Speaking II",
    term_label: "Fall 2019",
    course_status: "completed",
    campus: "Camino Real 223",
    modality: "Campus Lecture",
    units: 4.0,
    final_grade: "B",
    official_grade: "B",
    starts_on: "2019-09-03",
    ends_on: "2019-12-18",
    weekly_hours: 4.0,
    color: "#3b82f6",
    source: "canvas",
  },
  {
    id: "f19-esl126",
    canvas_course_id: null,
    code: "ESL 126",
    title: "Reading & Vocab II",
    term_label: "Fall 2019",
    course_status: "completed",
    campus: "San Rafael 208",
    modality: "Campus Lecture",
    units: 3.0,
    final_grade: "C",
    official_grade: "C",
    starts_on: "2019-09-03",
    ends_on: "2019-12-18",
    weekly_hours: 3.0,
    color: "#0284c7",
    source: "canvas",
  },

  // --- Winter 2020 ---
  {
    id: "w20-esl133",
    canvas_course_id: 19105,
    code: "ESL 133",
    title: "Grammar & Writing III",
    term_label: "Winter 2020",
    course_status: "completed",
    campus: "Camino Real 223",
    modality: "Campus Lecture",
    units: 5.0,
    final_grade: "C",
    official_grade: "C",
    starts_on: "2020-01-06",
    ends_on: "2020-02-13",
    weekly_hours: 5.0,
    color: "#0d9488",
    source: "canvas",
  },
  {
    id: "w20-esl136",
    canvas_course_id: null,
    code: "ESL 136",
    title: "Reading & Vocab III",
    term_label: "Winter 2020",
    course_status: "completed",
    campus: "Auditorium 114",
    modality: "Campus Lecture",
    units: 3.0,
    final_grade: "A",
    official_grade: "A",
    starts_on: "2020-01-06",
    ends_on: "2020-02-13",
    weekly_hours: 3.0,
    color: "#10b981",
    source: "canvas",
  },

  // --- Spring 2020 ---
  {
    id: "s20-at120",
    canvas_course_id: null,
    code: "AT 120",
    title: "Private Pilot Ground School",
    term_label: "Spring 2020",
    course_status: "completed",
    campus: "Aviation Arts 103",
    modality: "Campus Lecture",
    units: 5.0,
    final_grade: "A",
    official_grade: "A",
    starts_on: "2020-02-18",
    ends_on: "2020-06-10",
    weekly_hours: 5.0,
    color: "#0284c7",
    source: "canvas",
  },
  {
    id: "s20-esl141",
    canvas_course_id: null,
    code: "ESL 141",
    title: "Grammar & Writing IV",
    term_label: "Spring 2020",
    course_status: "completed",
    campus: "GCC Verdugo",
    modality: "Campus / Online",
    units: 5.0,
    final_grade: "D",
    official_grade: "D",
    starts_on: "2020-02-18",
    ends_on: "2020-06-10",
    weekly_hours: 5.0,
    color: "#94a3b8",
    source: "canvas",
  },
  {
    id: "s20-math90p",
    canvas_course_id: null,
    code: "MATH 90+",
    title: "Inter Alg for BSTEM w/ Support",
    term_label: "Spring 2020",
    course_status: "completed",
    campus: "San Fernando 103",
    modality: "Campus Lecture + Lab",
    units: 6.5,
    final_grade: "F",
    official_grade: "F",
    starts_on: "2020-02-18",
    ends_on: "2020-06-10",
    weekly_hours: 6.5,
    color: "#f43f5e",
    source: "canvas",
  },

  // --- Fall 2020 ---
  {
    id: "f20-at121",
    canvas_course_id: 23740,
    code: "AT 121",
    title: "Navigation",
    term_label: "Fall 2020",
    course_status: "completed",
    campus: "Aviation Arts",
    modality: "Online Lecture",
    units: 3.0,
    final_grade: "B",
    official_grade: "B",
    starts_on: "2020-08-31",
    ends_on: "2020-12-16",
    weekly_hours: 3.0,
    color: "#0369a1",
    source: "canvas",
  },
  {
    id: "f20-at123",
    canvas_course_id: 24776,
    code: "AT 123",
    title: "Aerodynamics",
    term_label: "Fall 2020",
    course_status: "completed",
    campus: "Aviation Arts",
    modality: "Online Lecture",
    units: 3.0,
    final_grade: "C",
    official_grade: "C",
    starts_on: "2020-08-31",
    ends_on: "2020-12-16",
    weekly_hours: 3.0,
    color: "#0891b2",
    source: "canvas",
  },
  {
    id: "f20-engl101",
    canvas_course_id: 24196,
    code: "ENGL 101",
    title: "Intro College Reading & Comp",
    term_label: "Fall 2020",
    course_status: "completed",
    campus: "Campus / Online",
    modality: "Online Lecture",
    units: 4.0,
    final_grade: "F",
    official_grade: "F",
    starts_on: "2020-08-31",
    ends_on: "2020-12-16",
    weekly_hours: 4.0,
    color: "#ef4444",
    source: "canvas",
  },
  {
    id: "f20-music121",
    canvas_course_id: null,
    code: "MUSIC 121",
    title: "History Of Rock Music",
    term_label: "Fall 2020",
    course_status: "completed",
    campus: "Campus Lecture",
    modality: "Online Lecture",
    units: 3.0,
    final_grade: "A",
    official_grade: "A",
    starts_on: "2020-08-31",
    ends_on: "2020-12-16",
    weekly_hours: 3.0,
    color: "#8b5cf6",
    source: "canvas",
  },

  // --- Winter 2021 ---
  {
    id: "w21-spch101",
    canvas_course_id: null,
    code: "SPCH 101",
    title: "Public Speaking",
    term_label: "Winter 2021",
    course_status: "completed",
    campus: "Campus Lecture",
    modality: "Online Lecture",
    units: 3.0,
    final_grade: "C",
    official_grade: "C",
    starts_on: "2021-01-04",
    ends_on: "2021-02-04",
    weekly_hours: 3.0,
    color: "#059669",
    source: "canvas",
  },

  // --- Spring 2021 ---
  {
    id: "s21-at122",
    canvas_course_id: 29164,
    code: "AT 122",
    title: "Meteorology",
    term_label: "Spring 2021",
    course_status: "completed",
    campus: "Aviation Arts",
    modality: "Online Lecture",
    units: 3.0,
    final_grade: "D",
    official_grade: "D",
    starts_on: "2021-02-16",
    ends_on: "2021-06-09",
    weekly_hours: 3.0,
    color: "#64748b",
    source: "canvas",
  },
  {
    id: "s21-chem110",
    canvas_course_id: 29894,
    code: "CHEM 110",
    title: "Elements Gen Chem",
    term_label: "Spring 2021",
    course_status: "completed",
    campus: "Online",
    modality: "Online Lecture + Lab",
    units: 5.0,
    final_grade: "F",
    official_grade: "F",
    starts_on: "2021-02-16",
    ends_on: "2021-06-09",
    weekly_hours: 5.0,
    color: "#dc2626",
    source: "canvas",
  },
  {
    id: "s21-engl102",
    canvas_course_id: 30822,
    code: "ENGL 102",
    title: "Critical Thinking/Lit",
    term_label: "Spring 2021",
    course_status: "completed",
    campus: "Online",
    modality: "Online Lecture",
    units: 3.0,
    final_grade: "F",
    official_grade: "F",
    starts_on: "2021-02-16",
    ends_on: "2021-06-09",
    weekly_hours: 3.0,
    color: "#b91c1c",
    source: "canvas",
  },
  {
    id: "s21-math90p",
    canvas_course_id: null,
    code: "MATH 90+",
    title: "Inter Alg for BSTEM w/ Support",
    term_label: "Spring 2021",
    course_status: "completed",
    campus: "Online",
    modality: "Online Lecture",
    units: 6.5,
    final_grade: "F",
    official_grade: "F",
    starts_on: "2021-02-16",
    ends_on: "2021-06-09",
    weekly_hours: 6.5,
    color: "#991b1b",
    source: "canvas",
  },

  // --- Fall 2021 ---
  {
    id: "f21-at124",
    canvas_course_id: null,
    code: "AT 124",
    title: "Radio/Flight Regulations",
    term_label: "Fall 2021",
    course_status: "completed",
    campus: "Aviation Arts",
    modality: "Online Lecture",
    units: 3.0,
    final_grade: "C",
    official_grade: "C",
    starts_on: "2021-08-30",
    ends_on: "2021-12-15",
    weekly_hours: 3.0,
    color: "#0284c7",
    source: "canvas",
  },
  {
    id: "f21-esl141",
    canvas_course_id: 31335,
    code: "ESL 141",
    title: "Grammar & Writing IV",
    term_label: "Fall 2021",
    course_status: "completed",
    campus: "Online",
    modality: "Online Lecture",
    units: 5.0,
    final_grade: "F",
    official_grade: "F",
    starts_on: "2021-08-30",
    ends_on: "2021-12-15",
    weekly_hours: 5.0,
    color: "#ef4444",
    source: "canvas",
  },
  {
    id: "f21-math90p",
    canvas_course_id: null,
    code: "MATH 90+",
    title: "Inter Alg for BSTEM w/ Support",
    term_label: "Fall 2021",
    course_status: "completed",
    campus: "Online",
    modality: "Online Lecture + Lab",
    units: 6.5,
    final_grade: "D",
    official_grade: "D",
    starts_on: "2021-08-30",
    ends_on: "2021-12-15",
    weekly_hours: 6.5,
    color: "#f97316",
    source: "canvas",
  },

  // --- Spring 2026 (Active) ---
  {
    id: "s26-at122",
    canvas_course_id: 63686,
    code: "AT 122",
    title: "Meteorology",
    term_label: "Spring 2026",
    course_status: "active",
    campus: "Aviation Arts",
    modality: "Online / Hybrid",
    units: 3.0,
    final_grade: "A",
    current_canvas_grade: "95.0%",
    expected_grade: "A",
    official_grade: "A",
    starts_on: "2026-02-16",
    ends_on: "2026-06-10",
    weekly_hours: 3.0,
    color: "#0284c7",
    source: "canvas",
  },
];

export const seedAssignments: Assignment[] = [...realCanvasAssignments, ...gccCourseworkAssignments];

export function daysUntil(dateString: string | null) {
  if (!dateString) return null;
  const target = new Date(dateString).getTime();
  const now = new Date().getTime();
  return Math.ceil((target - now) / 86_400_000);
}

export function formatShortDate(dateString: string | null) {
  if (!dateString) return "No live due date";
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone: schoolTimeZone,
  }).format(date);
}

export function getPhase() {
  return {
    name: "Phase 4",
    label: "Flight Training & FAA IFR Milestone",
    risk: "High flight simulator workload and FAA written exam prep. Protect weekly flight lab blocks.",
  };
}
