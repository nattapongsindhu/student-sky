import { CalendarDays, Clock, MapPin, Plane } from "lucide-react";
import { compactCourseTitleFor, instructorFor } from "@/lib/course-meta";
import { schoolTimeZone } from "@/lib/semester";
import type { Course } from "@/lib/semester";

type WeekdayKey = "mon" | "tue" | "wed" | "thu" | "fri" | "sat" | "sun";

type ScheduleBlock = {
  courseCode: string;
  day: WeekdayKey;
  location: string;
  meetingLabel?: string;
  time: string;
};

const weekdayColumns: { key: WeekdayKey; label: string }[] = [
  { key: "sun", label: "Sun" },
  { key: "mon", label: "Mon" },
  { key: "tue", label: "Tue" },
  { key: "wed", label: "Wed" },
  { key: "thu", label: "Thu" },
  { key: "fri", label: "Fri" },
  { key: "sat", label: "Sat" },
];

const fixedBlocks: ScheduleBlock[] = [
  // AT 122 (Spring 2026 / Spring 2021)
  {
    courseCode: "AT 122",
    day: "mon",
    location: "Aviation Arts",
    meetingLabel: "18:40-21:50",
    time: "18:40-21:50",
  },
  // AT 120 (Spring 2020)
  {
    courseCode: "AT 120",
    day: "sat",
    location: "Aviation Arts 103",
    meetingLabel: "08:00-13:20",
    time: "08:00-13:20",
  },
  // AT 121 (Fall 2020)
  {
    courseCode: "AT 121",
    day: "tue",
    location: "Aviation Arts",
    meetingLabel: "18:40-21:50",
    time: "18:40-21:50",
  },
  // AT 123 (Fall 2020)
  {
    courseCode: "AT 123",
    day: "mon",
    location: "Aviation Arts",
    meetingLabel: "18:40-21:50",
    time: "18:40-21:50",
  },
  // AT 124 (Fall 2021)
  {
    courseCode: "AT 124",
    day: "thu",
    location: "Aviation Arts",
    meetingLabel: "18:40-21:50",
    time: "18:40-21:50",
  },
  // MATH 90+ (Spring 2020, Spring 2021, Fall 2021)
  {
    courseCode: "MATH 90+",
    day: "mon",
    location: "San Fernando 103 / Online",
    meetingLabel: "07:35-09:00",
    time: "07:35-09:00",
  },
  {
    courseCode: "MATH 90+",
    day: "tue",
    location: "San Fernando 103 / Online",
    meetingLabel: "07:35-09:00",
    time: "07:35-09:00",
  },
  {
    courseCode: "MATH 90+",
    day: "wed",
    location: "San Fernando 103 / Online",
    meetingLabel: "07:35-09:00",
    time: "07:35-09:00",
  },
  {
    courseCode: "MATH 90+",
    day: "thu",
    location: "San Fernando 103 / Online",
    meetingLabel: "07:35-09:00",
    time: "07:35-09:00",
  },
  // CHEM 110 (Spring 2021)
  {
    courseCode: "CHEM 110",
    day: "mon",
    location: "Online",
    meetingLabel: "12:20-14:25",
    time: "12:20-14:25",
  },
  {
    courseCode: "CHEM 110",
    day: "tue",
    location: "Online",
    meetingLabel: "12:20-14:25",
    time: "12:20-14:25",
  },
  {
    courseCode: "CHEM 110",
    day: "wed",
    location: "Online",
    meetingLabel: "12:20-14:25",
    time: "12:20-14:25",
  },
  // ENGL 101 (Fall 2020)
  {
    courseCode: "ENGL 101",
    day: "tue",
    location: "Campus Lecture",
    meetingLabel: "07:35-08:50",
    time: "07:35-08:50",
  },
  {
    courseCode: "ENGL 101",
    day: "thu",
    location: "Campus Lecture",
    meetingLabel: "07:35-08:50",
    time: "07:35-08:50",
  },
  {
    courseCode: "ENGL 101",
    day: "fri",
    location: "Campus Lecture",
    meetingLabel: "07:35-08:50",
    time: "07:35-08:50",
  },
  // ENGL 102 (Spring 2021)
  {
    courseCode: "ENGL 102",
    day: "mon",
    location: "Campus Lecture",
    meetingLabel: "10:45-12:10",
    time: "10:45-12:10",
  },
  {
    courseCode: "ENGL 102",
    day: "wed",
    location: "Campus Lecture",
    meetingLabel: "10:45-12:10",
    time: "10:45-12:10",
  },
  // MUSIC 121 (Fall 2020)
  {
    courseCode: "MUSIC 121",
    day: "mon",
    location: "Campus Lecture",
    meetingLabel: "12:20-13:45",
    time: "12:20-13:45",
  },
  {
    courseCode: "MUSIC 121",
    day: "wed",
    location: "Campus Lecture",
    meetingLabel: "12:20-13:45",
    time: "12:20-13:45",
  },
  // SPCH 101 (Winter 2021)
  {
    courseCode: "SPCH 101",
    day: "mon",
    location: "Campus Lecture",
    meetingLabel: "10:40-13:05",
    time: "10:40-13:05",
  },
  {
    courseCode: "SPCH 101",
    day: "tue",
    location: "Campus Lecture",
    meetingLabel: "10:40-13:05",
    time: "10:40-13:05",
  },
  {
    courseCode: "SPCH 101",
    day: "wed",
    location: "Campus Lecture",
    meetingLabel: "10:40-13:05",
    time: "10:40-13:05",
  },
  {
    courseCode: "SPCH 101",
    day: "thu",
    location: "Campus Lecture",
    meetingLabel: "10:40-13:05",
    time: "10:40-13:05",
  },
  // ESL 126 (Fall 2019)
  {
    courseCode: "ESL 126",
    day: "tue",
    location: "San Rafael 208",
    meetingLabel: "09:10-10:35",
    time: "09:10-10:35",
  },
  {
    courseCode: "ESL 126",
    day: "thu",
    location: "San Rafael 208",
    meetingLabel: "09:10-10:35",
    time: "09:10-10:35",
  },
  // ESL 125 (Fall 2019)
  {
    courseCode: "ESL 125",
    day: "tue",
    location: "Camino Real 223",
    meetingLabel: "10:45-12:50",
    time: "10:45-12:50",
  },
  {
    courseCode: "ESL 125",
    day: "thu",
    location: "Camino Real 223",
    meetingLabel: "10:45-12:50",
    time: "10:45-12:50",
  },
  // ST DV 103 (Fall 2019)
  {
    courseCode: "ST DV 103",
    day: "wed",
    location: "GCC Verdugo",
    meetingLabel: "12:20-13:30",
    time: "12:20-13:30",
  },
  // ESL 123 (Fall 2019)
  {
    courseCode: "ESL 123",
    day: "tue",
    location: "Camino Real 223",
    meetingLabel: "13:55-16:25",
    time: "13:55-16:25",
  },
  {
    courseCode: "ESL 123",
    day: "thu",
    location: "Camino Real 223",
    meetingLabel: "13:55-16:25",
    time: "13:55-16:25",
  },
  // ESL 133 (Winter 2020)
  {
    courseCode: "ESL 133",
    day: "mon",
    location: "Camino Real 223",
    meetingLabel: "09:00-12:30",
    time: "09:00-12:30",
  },
  {
    courseCode: "ESL 133",
    day: "tue",
    location: "Camino Real 223",
    meetingLabel: "09:00-12:30",
    time: "09:00-12:30",
  },
  {
    courseCode: "ESL 133",
    day: "wed",
    location: "Camino Real 223",
    meetingLabel: "09:00-12:30",
    time: "09:00-12:30",
  },
  {
    courseCode: "ESL 133",
    day: "thu",
    location: "Camino Real 223",
    meetingLabel: "09:00-12:30",
    time: "09:00-12:30",
  },
  // ESL 136 (Winter 2020)
  {
    courseCode: "ESL 136",
    day: "mon",
    location: "Auditorium 114",
    meetingLabel: "13:20-16:10",
    time: "13:20-16:10",
  },
  {
    courseCode: "ESL 136",
    day: "tue",
    location: "Auditorium 114",
    meetingLabel: "13:20-16:10",
    time: "13:20-16:10",
  },
  {
    courseCode: "ESL 136",
    day: "wed",
    location: "Auditorium 114",
    meetingLabel: "13:20-16:10",
    time: "13:20-16:10",
  },
  // ESL 141 (Spring 2020, Fall 2021)
  {
    courseCode: "ESL 141",
    day: "tue",
    location: "Online / Campus",
    meetingLabel: "09:10-11:40",
    time: "09:10-11:40",
  },
  {
    courseCode: "ESL 141",
    day: "thu",
    location: "Online / Campus",
    meetingLabel: "09:10-11:40",
    time: "09:10-11:40",
  },
];

const fixedCourseCodes = new Set(fixedBlocks.map((block) => block.courseCode));

function getTodayKey() {
  const weekday = new Intl.DateTimeFormat("en-US", {
    timeZone: schoolTimeZone,
    weekday: "short",
  })
    .format(new Date())
    .toLowerCase();

  return weekday.slice(0, 3) as WeekdayKey;
}

function isPureOnlineCourse(course: Course) {
  const text = `${course.campus} ${course.modality}`.toLowerCase();
  const hasPhysicalRoom = text.includes("kpoc") || text.includes("at-") || text.includes("hangar") || text.includes("verdugo");
  return (text.includes("online") || text.includes("asynchronous")) && !hasPhysicalRoom && !fixedCourseCodes.has(course.code);
}

function isZoomBlock(block: ScheduleBlock) {
  return block.location.toLowerCase().includes("zoom");
}

function isFlightBlock(block: ScheduleBlock) {
  return block.location.toLowerCase().includes("kpoc") || block.location.toLowerCase().includes("c172");
}

export function WeeklySchedule({ courses }: { courses: Course[] }) {
  const todayKey = getTodayKey();
  const courseCodes = new Set(courses.map((course) => course.code));
  const coursesByCode = new Map(courses.map((course) => [course.code, course]));
  const asynchronousCourses = courses.filter(isPureOnlineCourse);

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-5">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-semibold">Weekly Class Schedule</h2>
          <p className="mt-2 text-sm text-slate-600">Los Angeles time, with fixed meetings separated from self-paced work.</p>
        </div>
        <span className="flex h-9 w-9 items-center justify-center rounded-md bg-teal-50 text-teal-700">
          <CalendarDays className="h-4 w-4" />
        </span>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-7">
        {weekdayColumns.map((day) => {
          const blocks = fixedBlocks.filter((block) => block.day === day.key && courseCodes.has(block.courseCode));
          const isToday = day.key === todayKey;
          const isSunday = day.key === "sun";

          return (
            <section
              className={`min-h-24 rounded-lg border p-2.5 ${
                isToday ? "border-teal-300 bg-teal-50" : "border-slate-200 bg-slate-50"
              }`}
              key={day.key}
            >
              <div className="flex items-center justify-between gap-2">
                <h3 className={`text-sm font-semibold ${isSunday ? "text-red-600" : "text-slate-900"}`}>{day.label}</h3>
                {isToday ? (
                  <span className={`rounded bg-white px-1.5 py-0.5 text-xs font-semibold ${isSunday ? "text-red-800" : "text-teal-800"}`}>
                    Today
                  </span>
                ) : null}
              </div>

              <div className="mt-2 space-y-2">
                {blocks.length ? (
                  blocks.map((block) => {
                    const course = coursesByCode.get(block.courseCode);

                    return (
                      <article className="rounded-md bg-white p-2.5 shadow-sm" key={`${block.courseCode}-${block.day}`}>
                        <div className="flex items-center justify-between gap-1">
                          <p className="text-xs font-semibold text-slate-950">{block.courseCode}</p>
                          {isFlightBlock(block) ? <Plane className="h-3 w-3 text-sky-600" /> : null}
                        </div>
                        <p className="mt-1 text-[11px] leading-snug text-slate-600">
                          {course ? compactCourseTitleFor(course) : block.courseCode}
                        </p>
                        <p className="mt-0.5 text-[11px] leading-snug text-slate-500">
                          ({course ? instructorFor(course) : "Pending"})
                        </p>
                        <div className="mt-2 space-y-1 text-[11px] font-medium leading-snug text-slate-700">
                          <p className="flex items-center gap-1">
                            <Clock className="h-3 w-3 shrink-0" />
                            {block.meetingLabel ?? block.time}
                          </p>
                          {isZoomBlock(block) ? (
                            <p className="flex items-start gap-1">
                              <MapPin className="mt-0.5 h-3 w-3 shrink-0" />
                              <span className="inline-flex w-fit rounded bg-sky-50 px-1.5 py-0.5 text-[10px] font-semibold text-sky-800">
                                Zoom
                              </span>
                            </p>
                          ) : (
                            <p className="flex items-start gap-1">
                              <MapPin className="mt-0.5 h-3 w-3 shrink-0" />
                              <span>{block.location}</span>
                            </p>
                          )}
                        </div>
                      </article>
                    );
                  })
                ) : (
                  <p className="text-xs text-slate-500">No fixed class block</p>
                )}
              </div>
            </section>
          );
        })}
      </div>

      <div className="mt-4 rounded-lg bg-slate-50 p-3">
        <h3 className="text-sm font-semibold text-slate-950">Asynchronous / Self-Paced</h3>
        <div className="mt-2 flex flex-wrap gap-2">
          {asynchronousCourses.length ? (
            asynchronousCourses.map((course) => (
              <span
                className="rounded-md border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-semibold text-slate-700"
                key={course.id}
              >
                {course.code}
              </span>
            ))
          ) : (
            <p className="text-sm text-slate-600">No self-paced online courses found for this term.</p>
          )}
        </div>
      </div>
    </div>
  );
}
