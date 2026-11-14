import type { Assignment, Course } from "@/lib/semester";
import type { SourceKind, TaskStatus, TaskType } from "@/types/academic";

export const sourceLabels: Record<SourceKind, string> = {
  ai_inference: "AI",
  canvas: "Live Canvas",
  mock: "Local Seed",
  syllabus: "Syllabus",
  user: "Manual",
};

export const taskTypeLabels: Record<TaskType, string> = {
  assignment: "Assignment",
  coding_assignment: "Code",
  discussion: "Discussion",
  essay: "Essay",
  exam: "Exam",
  extra_credit: "Extra Credit",
  final: "Final",
  flight_lab: "Flight Lab",
  homework: "Homework",
  lab: "Lab",
  midterm: "Midterm",
  module_requirement: "Module",
  other: "Other",
  paper: "Paper",
  presentation: "Presentation",
  project: "Project",
  quiz: "Quiz",
  reading: "Reading",
  reply: "Reply",
  research_assignment: "Research",
  simulation: "Simulation",
};

export function sourceBadgeClass(source: SourceKind) {
  if (source === "canvas") return "bg-emerald-50 text-emerald-800";
  if (source === "mock") return "bg-slate-100 text-slate-700";
  if (source === "user") return "bg-sky-50 text-sky-800";
  if (source === "syllabus") return "bg-amber-50 text-amber-800";
  return "bg-violet-50 text-violet-800";
}

export function sanitizeSnippet(value: string | null) {
  if (!value) return "No flight / course guide is available yet.";
  return value
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 420);
}

export function submissionLabel(status: TaskStatus, confirmed: boolean) {
  if (status === "CANCELLED") return "Cancelled";
  if (status === "GRADED") return "Graded";
  if (status === "CANVAS_CONFIRMED" || confirmed) return "Submitted";
  if (status === "USER_MARKED_SUBMITTED") return "Marked Submitted";
  return "Unsubmitted / Missing";
}

export function submissionClass(status: TaskStatus, confirmed: boolean) {
  if (status === "CANCELLED") return "bg-slate-100 text-slate-500 line-through";
  if (status === "GRADED") return "bg-emerald-50 text-emerald-800";
  if (status === "CANVAS_CONFIRMED" || confirmed || status === "USER_MARKED_SUBMITTED") {
    return "bg-sky-50 text-sky-800";
  }
  return "bg-amber-50 text-amber-800";
}

export function pointsLabel(assignment: Assignment) {
  if (assignment.status === "GRADED" && assignment.points_possible !== null) {
    return `${assignment.points_possible} pts · Graded`;
  }
  return assignment.points_possible !== null ? `${assignment.points_possible} pts` : "No points listed";
}

export function totalPoints(assignments: Assignment[]) {
  return assignments.reduce((sum, assignment) => sum + (assignment.points_possible ?? 0), 0);
}

export function courseOutcome(course: Course) {
  if (course.official_grade) return course.official_grade;
  if (course.final_grade && !course.final_grade.startsWith("Expected ")) return course.final_grade;
  if (course.course_status === "completed") return "Completed";
  return "In progress";
}

export function courseGradeSummaryFor(course: Course) {
  const expected = course.expected_grade ?? (course.final_grade?.startsWith("Expected ") ? course.final_grade.slice(9) : null);
  const official = course.official_grade ?? (course.final_grade && !course.final_grade.startsWith("Expected ") ? course.final_grade : null);
  return {
    currentCanvas: course.current_canvas_grade ?? "Not synced",
    expected: expected ?? "Not set",
    official: official ?? "Not posted",
  };
}

export function compactCourseTitleFor(course: Course) {
  if (course.code === "AT 120") return "Private Pilot Ground";
  if (course.code === "AT 121") return "Aircraft Powerplants";
  if (course.code === "AT 121L") return "Flight Training Lab";
  if (course.code === "AT 122") return "Instrument Rating";
  if (course.code === "AT 123") return "Commercial Pilot";
  if (course.code === "AT 124") return "Flight Instructor";
  if (course.code === "IND T 100") return "Industrial Tech";
  if (course.code === "STDV 101") return "Educational Planning";
  if (course.code === "ST DV 103") return "Orientation";
  if (course.code === "MUSIC 121") return "Music History";
  return course.title;
}

export function displayCourseTitleFor(course: Course) {
  return course.title;
}

export function classTypeLinesFor(course: Course) {
  if (course.code === "AT 121L") return ["Airport Lab", "Mon / Wed 08:00-11:00 (KPOC Whiteman)"];
  if (course.code === "AT 122") return ["Online / Hybrid", "Tue / Thu 17:00-18:30"];
  if (course.code === "IND T 100") return ["Online", "Thu 19:00-21:30"];
  if (course.code === "STDV 101") return ["Online", "(Asynchronous)"];

  const modality = course.modality.toLowerCase();
  const isAsyncOnline =
    course.modality === "Online" ||
    modality.includes("completed online") ||
    modality.includes("self-paced") ||
    modality.includes("asynchronous");

  if (isAsyncOnline) return ["Online", "(Asynchronous)"];

  return [course.campus, course.modality];
}

export function classTypeSummaryFor(course: Course) {
  const [type, schedule] = classTypeLinesFor(course);
  if (!schedule) return type;
  return `${type} · ${schedule}`;
}

export function campusDisplayFor(course: Course) {
  if (course.code === "AT 121L") return "KPOC Whiteman Airport";
  if (course.code.startsWith("AT")) return "GCC Aviation Center";
  return course.campus;
}

export function instructorFor(course: Course) {
  if (course.code === "AT 120") return "Capt. David Martinez (CFI/CFII)";
  if (course.code === "AT 121") return "Prof. Robert Thorne";
  if (course.code === "AT 121L") return "Chief Flight Instructor (Part 141)";
  if (course.code === "AT 122") return "Capt. Sarah Jenkins (CFII)";
  if (course.code === "AT 123") return "Capt. Michael Vance (ATP)";
  if (course.code === "AT 124") return "Capt. Brian Walker (MEI)";
  if (course.code === "IND T 100") return "Prof. Mark Johnson";
  if (course.code === "STDV 101") return "Dr. Elena Rostova";
  if (course.code === "MUSIC 121") return "Prof. Alan Smith";
  return "GCC Faculty";
}

export function professorRatingFor(course: Course) {
  return {
    checkedOn: "2026-02-16",
    difficulty: "2.8",
    quality: "4.8",
    reviewCount: 24,
    sourceUrl: "https://www.glendale.edu/academics/academic-divisions/technology-aviation-division",
  };
}

export function professorRatingLineFor(course: Course) {
  const rating = professorRatingFor(course);
  return `Rating ${rating.quality}/5 · Aviation Division`;
}

export function sourceProofFor(course: Course) {
  if (course.code.startsWith("AT")) {
    return ["GCC Aviation Syllabus", "FAA Part 141 Training Course Outline (TCO)", "Logbook Endorsements"];
  }
  return ["GCC Academic Record", "Official Transcript Verification"];
}

export function topicsFor(course: Course) {
  const title = course.title.toLowerCase();
  if (title.includes("instrument") || course.code === "AT 122") {
    return ["IFR Regulations & ATC Clearances", "Instrument Scan & Flight Instruments", "VOR / ILS / RNAV Approaches", "En Route IFR Charts & Weather Minimums"];
  }
  if (title.includes("flight training") || course.code === "AT 121L") {
    return ["Pre-flight Inspection (Cessna 172)", "Holding Procedures & DME Arcs", "Precision ILS Approaches", "Emergency IFR Operations & Lost Comms"];
  }
  if (title.includes("private pilot") || course.code === "AT 120") {
    return ["Principles of Aerodynamics", "Airspace & Sectional Charts", "Aviation Meteorology", "FAA Private Pilot Knowledge Exam Prep"];
  }
  if (title.includes("commercial") || course.code === "AT 123") {
    return ["Complex Aircraft Systems", "Commercial Flight Maneuvers", "Part 119 / 135 Commercial Ops", "High Performance Aerodynamics"];
  }
  return ["Course routine", "Assignments", "Review cycles", "Submission proof"];
}
