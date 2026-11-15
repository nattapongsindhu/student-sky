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
  if (course.code === "AT 121") return "Navigation";
  if (course.code === "AT 122") return "Meteorology";
  if (course.code === "AT 123") return "Aerodynamics";
  if (course.code === "AT 124") return "Radio/Flight Regs";
  if (course.code === "ESL 126") return "Reading & Vocab II";
  if (course.code === "ST DV 103") return "College Orientation";
  if (course.code === "MUSIC 121") return "Rock Music";
  if (course.code === "MATH 90+") return "Inter Alg BSTEM";
  if (course.code === "CHEM 110") return "Gen Chemistry";
  if (course.code === "ENGL 101") return "Freshman English";
  if (course.code === "ENGL 102") return "Critical Thinking";
  if (course.code === "SPCH 101") return "Public Speaking";
  return course.title;
}

export function displayCourseTitleFor(course: Course) {
  return course.title;
}

export function classTypeLinesFor(course: Course) {
  if (course.code === "AT 122") {
    if (course.term_label === "Spring 2026") return ["Aviation Arts", "Wed 18:40-21:50"];
    return ["Aviation Arts", "18:40-21:50"];
  }
  if (course.code === "AT 120") return ["Aviation Arts 103", "Sat 08:00-13:20"];
  if (course.code === "AT 121") return ["Aviation Arts", "Tue 18:40-21:50"];
  if (course.code === "AT 123") return ["Aviation Arts", "Mon 18:40-21:50"];
  if (course.code === "AT 124") return ["Aviation Arts", "Thu 18:40-21:50"];
  if (course.code === "MATH 90+") return ["San Fernando 103 / Online", "MoTuWeTh 07:35-09:00"];
  if (course.code === "CHEM 110") return ["Online", "MoTuWe 12:20-13:35 / 14:25"];
  if (course.code === "ENGL 101") return ["Campus / Online", "TuThFr 07:35-08:50"];
  if (course.code === "ENGL 102") return ["Campus / Online", "MoWe 10:45-12:10"];
  if (course.code === "MUSIC 121") return ["Campus Lecture", "MoWe 12:20-13:45"];
  if (course.code === "SPCH 101") return ["Campus Lecture", "MoTuWeTh 10:40-13:05"];
  if (course.code === "ESL 125") return ["Camino Real 223", "TuTh 10:45-12:50"];
  if (course.code === "ESL 126") return ["San Rafael 208", "TuTh 09:10-10:35"];
  if (course.code === "ESL 123") return ["Camino Real 223", "TuTh 13:55-16:25"];
  if (course.code === "ESL 133") return ["Camino Real 223", "MoTuWeTh 09:00-12:30"];
  if (course.code === "ESL 136") return ["Auditorium 114", "MoTuWe 13:20-16:10"];
  if (course.code === "ESL 141") return ["GCC Verdugo / Online", "TuTh 09:10-11:40"];
  if (course.code === "ST DV 103") return ["Sierra Vista", "Wed 12:20-13:30"];

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
  if (course.code.startsWith("AT")) return "GCC Aviation Center";
  return course.campus;
}

export function instructorFor(course: Course) {
  if (course.code === "AT 120") return "Anthony Byrnes";
  if (course.code === "AT 121") return "Robert Newman";
  if (course.code === "AT 122") return "Bruce Allport";
  if (course.code === "AT 123") return "Robert Newman";
  if (course.code === "AT 124") return "Mel Futrell";
  if (course.code === "MATH 90+") return course.term_label === "Spring 2020" ? "John Fuhrmann" : "Hai T. Ong";
  if (course.code === "CHEM 110") return "Thi Nguyen";
  if (course.code === "ENGL 101") return "Kenneth Cran";
  if (course.code === "ENGL 102") return "Jessica Groper";
  if (course.code === "ESL 123") return "Daniel J. Tirman";
  if (course.code === "ESL 125") return "Patricia Hironymous";
  if (course.code === "ESL 126") return "Nancy Gimbrone";
  if (course.code === "ESL 133") return "Nancy Gimbrone";
  if (course.code === "ESL 136") return "Dante Camargo";
  if (course.code === "ESL 141") return course.term_label === "Fall 2021" ? "Brian J. McDonald" : "Paul Vera";
  if (course.code === "MUSIC 121") return "Michael Wachs";
  if (course.code === "SPCH 101") return "Jeffrey Smith";
  if (course.code === "ST DV 103") return "Intl. Councelor";
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
