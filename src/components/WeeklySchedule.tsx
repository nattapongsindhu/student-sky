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
  {
    courseCode: "AT 121L",
    day: "mon",
    location: "KPOC Whiteman (C172)",
    meetingLabel: "08:00-11:00",
    time: "08:00-11:00",
  },
  {
    courseCode: "AT 121L",
    day: "wed",
    location: "KPOC Whiteman (C172)",
    meetingLabel: "08:00-11:00",
    time: "08:00-11:00",
  },
  {
    courseCode: "AT 122",
    day: "tue",
    location: "Zoom",
    meetingLabel: "17:00-18:30",
    time: "17:00-18:30",
  },
  {
    courseCode: "AT 122",
    day: "thu",
    location: "Zoom",
    meetingLabel: "17:00-18:30",
    time: "17:00-18:30",
  },
  {
    courseCode: "IND T 100",
    day: "thu",
    location: "Zoom",
    meetingLabel: "19:00-21:30",
    time: "19:00-21:30",
  },
  {
    courseCode: "AT 120",
    day: "mon",
    location: "AT Building 101",
    meetingLabel: "18:00-20:30",
    time: "18:00-20:30",
  },
  {
    courseCode: "AT 120",
    day: "wed",
    location: "AT Building 101",
    meetingLabel: "18:00-20:30",
    time: "18:00-20:30",
  },
  {
    courseCode: "AT 121",
    day: "mon",
    location: "AT Hangar Lab",
    meetingLabel: "15:00-16:30",
    time: "15:00-16:30",
  },
  {
    courseCode: "AT 121",
    day: "wed",
    location: "AT Hangar Lab",
    meetingLabel: "15:00-16:30",
    time: "15:00-16:30",
  },
  {
    courseCode: "AT 123",
    day: "tue",
    location: "AT Building 101",
    meetingLabel: "18:00-19:30",
    time: "18:00-19:30",
  },
  {
    courseCode: "AT 123",
    day: "thu",
    location: "AT Building 101",
    meetingLabel: "18:00-19:30",
    time: "18:00-19:30",
  },
  {
    courseCode: "ESL 123",
    day: "mon",
    location: "San Rafael 201",
    meetingLabel: "09:00-11:00",
    time: "09:00-11:00",
  },
  {
    courseCode: "ESL 123",
    day: "wed",
    location: "San Rafael 201",
    meetingLabel: "09:00-11:00",
    time: "09:00-11:00",
  },
  {
    courseCode: "ESL 125",
    day: "tue",
    location: "San Rafael 205",
    meetingLabel: "09:00-10:30",
    time: "09:00-10:30",
  },
  {
    courseCode: "ESL 125",
    day: "thu",
    location: "San Rafael 205",
    meetingLabel: "09:00-10:30",
    time: "09:00-10:30",
  },
  {
    courseCode: "ESL 126",
    day: "tue",
    location: "San Rafael 208",
    meetingLabel: "11:00-12:30",
    time: "11:00-12:30",
  },
  {
    courseCode: "ESL 126",
    day: "thu",
    location: "San Rafael 208",
    meetingLabel: "11:00-12:30",
    time: "11:00-12:30",
  },
  {
    courseCode: "MUSIC 121",
    day: "fri",
    location: "Auditorium 101",
    meetingLabel: "10:00-13:00",
    time: "10:00-13:00",
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
