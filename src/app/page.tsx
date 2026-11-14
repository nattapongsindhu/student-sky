'use client';

import React, { useState, useEffect } from 'react';
import {
  Compass,
  Calendar,
  AlertTriangle,
  Clock,
  BookOpen,
  RefreshCw,
  ExternalLink,
  Plane,
  Shield,
  Award,
  ChevronRight,
  Sparkles,
  FileText,
  MapPin,
  CheckCircle2,
  Bookmark
} from 'lucide-react';
import { supabase } from '@/lib/supabase/client';
import { Course, Assignment, Announcement, FlightLabLog, SyncLog } from '@/types';
import SyncConsoleModal from '@/components/SyncConsoleModal';
import FlightLogModal from '@/components/FlightLogModal';

export default function StudentSkyDashboard() {
  const [selectedTerm, setSelectedTerm] = useState('Home');
  const [courses, setCourses] = useState<Course[]>([]);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [flightLogs, setFlightLogs] = useState<FlightLabLog[]>([]);
  const [lastSync, setLastSync] = useState<SyncLog | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Modals
  const [isSyncModalOpen, setIsSyncModalOpen] = useState(false);
  const [isFlightModalOpen, setIsFlightModalOpen] = useState(false);

  // Fallback initial data in case Supabase is waiting for credentials
  const defaultCourses: Course[] = [
    {
      id: 'c1',
      canvas_id: 90101,
      course_code: 'AT 120',
      name: 'Private Pilot Ground School (FAA Written Prep)',
      term: 'Spring 2026',
      term_order: 1,
      units: 3.0,
      instructor: 'Capt. R. Miller, CFI/CFII',
      status: 'enrolled',
      current_grade: 'A',
      current_score: 94.5,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: 'c2',
      canvas_id: 90102,
      course_code: 'AT 121',
      name: 'Private Pilot Flight Lab I (KPOC - Cessna 172)',
      term: 'Spring 2026',
      term_order: 1,
      units: 2.0,
      instructor: 'Chief Flight Instructor Whiteman',
      status: 'enrolled',
      current_grade: 'A',
      current_score: 98.0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: 'c3',
      canvas_id: 90103,
      course_code: 'IND T',
      name: 'Industrial Technology & Aviation Pathway',
      term: 'Spring 2026',
      term_order: 1,
      units: 1.0,
      instructor: 'Division of Tech & Aviation',
      status: 'enrolled',
      current_grade: 'A',
      current_score: 100.0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: 'c4',
      canvas_id: 90104,
      course_code: 'STDV 101',
      name: 'Path to Academic Strategies and Student Success',
      term: 'Spring 2026',
      term_order: 1,
      units: 1.0,
      instructor: 'GCC Counseling Department',
      status: 'enrolled',
      current_grade: 'A',
      current_score: 96.0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: 'c5',
      canvas_id: 90105,
      course_code: 'ENGL 101',
      name: 'College Reading and Composition',
      term: 'Spring 2026',
      term_order: 1,
      units: 3.0,
      instructor: 'Prof. J. Adams',
      status: 'enrolled',
      current_grade: 'A-',
      current_score: 91.0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: 'c6',
      canvas_id: 90106,
      course_code: 'MATH 103E',
      name: 'Calculus and Analytical Geometry I',
      term: 'Spring 2026',
      term_order: 1,
      units: 5.0,
      instructor: 'Dr. K. Vance',
      status: 'enrolled',
      current_grade: 'B+',
      current_score: 88.5,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
  ];

  const defaultAssignments: Assignment[] = [
    {
      id: 'a1',
      canvas_id: 800101,
      course_id: 'c1',
      name: 'Weight & Balance Calculation Matrix (Cessna 172S)',
      description: 'Calculate center of gravity and moment arms for standard fuel and payload configuration.',
      due_at: new Date(Date.now() + 1000 * 60 * 60 * 36).toISOString(), // 36h
      points_possible: 50.0,
      submission_status: 'unsubmitted',
      score: null,
      risk_level: 'WATCH',
      risk_reason: 'Due in 36 hours; mandatory check before weekend flight sortie',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: 'a2',
      canvas_id: 800102,
      course_id: 'c1',
      name: 'Sectional Chart & Airspace VFR Navigation Log (KPOC to KSZP)',
      description: 'Plot VFR flight plan avoiding Burbank Class C airspace and terrain.',
      due_at: new Date(Date.now() + 1000 * 60 * 60 * 120).toISOString(),
      points_possible: 100.0,
      submission_status: 'unsubmitted',
      score: null,
      risk_level: 'NORMAL',
      risk_reason: 'Due later this week',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
  ];

  const defaultAnnouncements: Announcement[] = [
    {
      id: 'ann1',
      canvas_id: 700101,
      course_id: 'c2',
      title: 'Whiteman Airport (KPOC) Flight Dispatch Protocol',
      content: 'All student pilots must check in with dispatch for weather briefing and verify weight & balance before pre-flight.',
      category: 'CANVAS_WATCH',
      badge: 'AT 121',
      posted_at: 'Nov 14, 08:30',
      source_url: 'https://glendale.instructure.com',
    },
    {
      id: 'ann2',
      canvas_id: 700102,
      course_id: 'c1',
      title: 'FAA Written Exam Prep Session (Aviation Lab)',
      content: 'Saturday mock FAA Private Pilot Knowledge Exam review session scheduled in SV 114 at 10:00 AM.',
      category: 'CANVAS_WATCH',
      badge: 'AT 120',
      posted_at: 'Nov 12, 14:15',
      source_url: 'https://glendale.instructure.com',
    },
    {
      id: 'ann3',
      canvas_id: 700201,
      course_id: null,
      title: 'GCC Pilot Pathway: SEP Education Plan Review',
      content: 'Schedule counseling to verify 7-term aviation sequence and FAA flight hour milestone sign-offs.',
      category: 'COLLEGE_NEWS',
      badge: 'Counseling',
      posted_at: 'Nov 10, 09:00',
      source_url: 'https://glendale.edu/counseling',
    },
    {
      id: 'ann4',
      canvas_id: 700202,
      course_id: null,
      title: 'Redbird FMX Flight Simulator Booking Available',
      content: 'Free motion simulator practice blocks are open for instrument scan and emergency drills.',
      category: 'COLLEGE_NEWS',
      badge: 'Flight Sim',
      posted_at: 'Nov 09, 11:45',
      source_url: 'https://glendale.edu/aviation',
    },
    {
      id: 'ann5',
      canvas_id: 700301,
      course_id: null,
      title: 'AOPA Flight Training Scholarship ($10,000)',
      content: 'National flight training scholarship for student pilots actively working toward Private Pilot or Instrument ratings.',
      category: 'SCHOLARSHIP',
      badge: '$10,000 Award',
      posted_at: 'Nov 13, 16:00',
      source_url: 'https://www.aopa.org/scholarships',
    },
    {
      id: 'ann6',
      canvas_id: 700302,
      course_id: null,
      title: 'EAA Ray Aviation Flight Training Grant',
      content: 'Up to $11,000 grant supporting student pilot flight hours and FAA checkride fees.',
      category: 'SCHOLARSHIP',
      badge: '$11,000 Grant',
      posted_at: 'Nov 08, 10:00',
      source_url: 'https://www.eaa.org/scholarships',
    },
    {
      id: 'ann7',
      canvas_id: 700303,
      course_id: null,
      title: 'Google AI Pro (Gemini 1-Yr Student Plan)',
      content: 'Free 1-year student plan: 5 TB Google One cloud storage, 4x Gemini usage for research and coursework.',
      category: 'SCHOLARSHIP',
      badge: 'Free 1 Year',
      posted_at: 'Active',
      source_url: 'https://gemini.google.com',
    },
  ];

  const defaultFlightLogs: FlightLabLog[] = [
    {
      id: 'f1',
      course_id: 'c2',
      title: 'Sortie 1: Basic Attitude Flying & Steep Turns',
      flight_date: '2026-11-08',
      aircraft_type: 'Cessna 172S',
      tail_number: 'N721GC',
      airport_code: 'KPOC',
      flight_hours: 1.8,
      dual_hours: 1.8,
      solo_hours: 0.0,
      sim_hours: 0.0,
      maneuvers_covered: 'Preflight, taxi, steep turns, slow flight, power-off stalls',
      instructor_remarks: 'Solid rudder coordination during slow flight transitions',
      status: 'completed',
      created_at: new Date().toISOString(),
    },
    {
      id: 'f2',
      course_id: 'c2',
      title: 'Sortie 2: Traffic Pattern & Touch-and-Go',
      flight_date: '2026-11-11',
      aircraft_type: 'Cessna 172S',
      tail_number: 'N721GC',
      airport_code: 'KPOC',
      flight_hours: 1.5,
      dual_hours: 1.5,
      solo_hours: 0.0,
      sim_hours: 0.0,
      maneuvers_covered: 'Standard traffic pattern, crosswind correction, flare & touchdown',
      instructor_remarks: 'Airspeed stable on short final (65 knots)',
      status: 'completed',
      created_at: new Date().toISOString(),
    },
  ];

  const defaultSyncLog: SyncLog = {
    id: 's1',
    provider: 'GCC_CANVAS',
    synced_at: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(), // 3 hours ago
    status: 'SUCCESS',
    courses_synced: 6,
    assignments_synced: 18,
    announcements_synced: 24,
    error_message: null,
  };

  const loadData = async () => {
    setIsLoading(true);
    try {
      // 1. Fetch courses
      const { data: cData } = await supabase.from('courses').select('*').order('term_order', { ascending: true });
      if (cData && cData.length > 0) {
        setCourses(cData);
      } else {
        setCourses(defaultCourses);
      }

      // 2. Fetch assignments
      const { data: aData } = await supabase.from('assignments').select('*, course:courses(*)').order('due_at', { ascending: true });
      if (aData && aData.length > 0) {
        setAssignments(aData);
      } else {
        setAssignments(defaultAssignments);
      }

      // 3. Fetch announcements
      const { data: annData } = await supabase.from('announcements').select('*').order('posted_at', { ascending: false });
      if (annData && annData.length > 0) {
        setAnnouncements(annData);
      } else {
        setAnnouncements(defaultAnnouncements);
      }

      // 4. Fetch flight logs
      const { data: fData } = await supabase.from('flight_lab_logs').select('*').order('flight_date', { ascending: false });
      if (fData && fData.length > 0) {
        setFlightLogs(fData);
      } else {
        setFlightLogs(defaultFlightLogs);
      }

      // 5. Fetch last sync log
      const { data: sData } = await supabase.from('sync_logs').select('*').order('synced_at', { ascending: false }).limit(1).single();
      if (sData) {
        setLastSync(sData);
      } else {
        setLastSync(defaultSyncLog);
      }
    } catch (err) {
      console.warn('Using local fallback state (Supabase tables will populate on setup):', err);
      setCourses(defaultCourses);
      setAssignments(defaultAssignments);
      setAnnouncements(defaultAnnouncements);
      setFlightLogs(defaultFlightLogs);
      setLastSync(defaultSyncLog);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Filter calculations
  const activeTermCourses = courses.filter(c => selectedTerm === 'Home' || c.term === selectedTerm);
  const enrolledCourses = courses.filter(c => c.status === 'enrolled');
  const dueIn7Days = assignments.filter(a => {
    if (!a.due_at) return false;
    const diff = (new Date(a.due_at).getTime() - Date.now()) / (1000 * 60 * 60 * 24);
    return diff >= 0 && diff <= 7 && a.submission_status !== 'submitted' && a.submission_status !== 'graded';
  });
  const atRiskCount = assignments.filter(a => a.risk_level === 'CRITICAL' || a.risk_level === 'AT_RISK' || a.risk_level === 'WATCH').length;
  const nextDue = assignments.find(a => a.due_at && new Date(a.due_at).getTime() > Date.now());

  // Total Flight Hours
  const totalDual = flightLogs.reduce((acc, log) => acc + (Number(log.dual_hours) || 0), 0);
  const totalSolo = flightLogs.reduce((acc, log) => acc + (Number(log.solo_hours) || 0), 0);
  const totalSim = flightLogs.reduce((acc, log) => acc + (Number(log.sim_hours) || 0), 0);
  const totalFlight = totalDual + totalSolo;

  const terms = [
    'Home',
    'Spring 2026',
    'Summer 2026',
    'Fall 2026',
    'Winter 2027',
    'Spring 2027',
    'Summer 2027',
    'Fall 2027',
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      {/* 1. TOP TERM NAVIGATION BAR */}
      <div className="mb-6 flex items-center space-x-1 overflow-x-auto rounded-xl bg-white p-1.5 shadow-sm border border-gray-200/80">
        {terms.map((term) => (
          <button
            key={term}
            onClick={() => setSelectedTerm(term)}
            className={`whitespace-nowrap rounded-lg px-4 py-2 text-sm font-medium transition ${
              selectedTerm === term
                ? 'bg-slate-900 text-white shadow-sm'
                : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
            }`}
          >
            {term === 'Home' ? (
              <span className="flex items-center space-x-1.5">
                <Compass className="h-4 w-4" />
                <span>Home</span>
              </span>
            ) : (
              term
            )}
          </button>
        ))}
      </div>

      {/* 2. MAIN HEADER CARD */}
      <div className="mb-6 rounded-2xl bg-white p-6 shadow-sm border border-gray-200/80">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs font-bold uppercase tracking-wider text-sky-700 bg-sky-50 px-2.5 py-0.5 rounded-full border border-sky-200">
                STUDENT SKY · SPRING 2026
              </span>
              <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                FAA Part 141 Pathway
              </span>
            </div>
            <h1 className="mt-2 text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
              Associate of Science in Aviation and Transportation - Pilot Training
            </h1>
            <p className="mt-1 text-base font-semibold text-slate-700">
              Glendale Community College
            </p>
            <div className="mt-1 flex items-center text-xs text-gray-500 space-x-3">
              <span className="flex items-center space-x-1">
                <MapPin className="h-3.5 w-3.5 text-gray-400" />
                <span>1500 N. Verdugo Road, Glendale, CA 91208</span>
              </span>
              <span>•</span>
              <span className="flex items-center space-x-1 text-sky-700 font-medium">
                <Plane className="h-3.5 w-3.5" />
                <span>Flight Ops: Whiteman Airport (KPOC)</span>
              </span>
            </div>
          </div>

          {/* Canvas Sync Box */}
          <div className="flex-shrink-0 rounded-xl bg-gray-50/80 p-4 border border-gray-200/60 min-w-[260px]">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-gray-700">
                <RefreshCw className="h-3.5 w-3.5 text-sky-600" />
                <span>GCC Canvas Sync</span>
              </div>
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            </div>
            <p className="mt-1 text-xs text-gray-500">
              {lastSync?.synced_at
                ? `Last synced: ${new Date(lastSync.synced_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}, ${new Date(lastSync.synced_at).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}`
                : 'Synced daily at 06:00 AM PST'}
            </p>
            <p className="text-[11px] text-gray-400 mt-0.5">
              {courses.length} courses · {assignments.length} assignments tracked
            </p>
            <button
              onClick={() => setIsSyncModalOpen(true)}
              className="mt-3 text-xs font-semibold text-sky-700 hover:text-sky-800 hover:underline flex items-center space-x-1"
            >
              <span>Open Sync Console</span>
              <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* 3. FOUR KEY STAT CARDS */}
      <div className="mb-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
        {/* Term Courses */}
        <div className="rounded-2xl bg-white p-5 shadow-sm border border-gray-200/80">
          <div className="flex items-center space-x-2 text-xs font-medium text-gray-500">
            <BookOpen className="h-4 w-4 text-sky-600" />
            <span>Term courses</span>
          </div>
          <div className="mt-2 text-3xl font-bold text-slate-900">{enrolledCourses.length}</div>
          <div className="mt-1 text-xs text-gray-400">15.0 Units Active</div>
        </div>

        {/* Due in 7 Days */}
        <div className="rounded-2xl bg-white p-5 shadow-sm border border-gray-200/80">
          <div className="flex items-center space-x-2 text-xs font-medium text-gray-500">
            <Calendar className="h-4 w-4 text-indigo-600" />
            <span>Due in 7 days</span>
          </div>
          <div className="mt-2 text-3xl font-bold text-slate-900">{dueIn7Days.length}</div>
          <div className="mt-1 text-xs text-emerald-600 font-medium">Flight sorties & lab work</div>
        </div>

        {/* At Risk */}
        <div className="rounded-2xl bg-white p-5 shadow-sm border border-gray-200/80">
          <div className="flex items-center space-x-2 text-xs font-medium text-gray-500">
            <AlertTriangle className="h-4 w-4 text-amber-500" />
            <span>At risk / Watch</span>
          </div>
          <div className="mt-2 text-3xl font-bold text-slate-900">{atRiskCount}</div>
          <div className="mt-1 text-xs text-amber-600 font-medium">High priority focus</div>
        </div>

        {/* Next Due */}
        <div className="rounded-2xl bg-white p-5 shadow-sm border border-gray-200/80">
          <div className="flex items-center space-x-2 text-xs font-medium text-gray-500">
            <Clock className="h-4 w-4 text-emerald-600" />
            <span>Next due</span>
          </div>
          <div className="mt-2 text-lg font-bold text-slate-900 truncate">
            {nextDue?.due_at
              ? new Date(nextDue.due_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
              : 'Nov 16, 23:59'}
          </div>
          <div className="mt-1 text-xs text-gray-500 truncate">
            {nextDue?.name || 'Weight & Balance Matrix'}
          </div>
        </div>
      </div>

      {/* 4. THREE-COLUMN WIDGET GRID (MATCHING STUDENT STAR DESIGN) */}
      <div className="mb-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* COLUMN 1: CANVAS WATCH (Amber/Yellow tint) */}
        <div className="rounded-2xl border border-amber-200/70 bg-[#FEFDF5] p-5 shadow-sm">
          <div className="flex items-center justify-between border-b border-amber-200/60 pb-3">
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-amber-800 flex items-center space-x-1.5">
                <Plane className="h-4 w-4" />
                <span>CANVAS WATCH</span>
              </div>
              <h3 className="text-sm font-bold text-slate-900 mt-0.5">
                Latest announcements & flight dispatch
              </h3>
            </div>
            <button
              onClick={() => setIsSyncModalOpen(true)}
              className="text-xs font-semibold text-amber-900 bg-amber-100 hover:bg-amber-200 px-2 py-1 rounded"
            >
              Sync
            </button>
          </div>

          <div className="mt-4 space-y-3">
            {announcements
              .filter(a => a.category === 'CANVAS_WATCH')
              .slice(0, 3)
              .map(ann => (
                <div key={ann.id} className="rounded-xl bg-white/90 p-3.5 border border-amber-100 shadow-xs">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded">
                      {ann.badge || 'Canvas'}
                    </span>
                    <span className="text-gray-400">{ann.posted_at}</span>
                  </div>
                  <h4 className="mt-1.5 text-sm font-semibold text-slate-900">{ann.title}</h4>
                  <p className="mt-1 text-xs text-gray-600 line-clamp-2">{ann.content}</p>
                  <a
                    href={ann.source_url || 'https://glendale.instructure.com'}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-2 inline-flex items-center space-x-1 text-xs font-semibold text-sky-700 hover:underline"
                  >
                    <span>Open in Canvas</span>
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
              ))}
          </div>
        </div>

        {/* COLUMN 2: COLLEGE NEWS (Blue tint) */}
        <div className="rounded-2xl border border-blue-200/70 bg-[#F8FAFC] p-5 shadow-sm">
          <div className="flex items-center justify-between border-b border-blue-200/60 pb-3">
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-blue-800 flex items-center space-x-1.5">
                <Bookmark className="h-4 w-4" />
                <span>COLLEGE NEWS</span>
              </div>
              <h3 className="text-sm font-bold text-slate-900 mt-0.5">
                GCC announcements and student services
              </h3>
            </div>
            <span className="text-xs font-semibold text-blue-800 bg-blue-100 px-2 py-1 rounded">
              Week 10
            </span>
          </div>

          <div className="mt-4 space-y-3">
            {announcements
              .filter(a => a.category === 'COLLEGE_NEWS')
              .slice(0, 3)
              .map(ann => (
                <div key={ann.id} className="rounded-xl bg-white/90 p-3.5 border border-blue-100 shadow-xs">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-blue-800 bg-blue-50 px-2 py-0.5 rounded">
                      {ann.badge || 'News'}
                    </span>
                    <span className="text-gray-400">{ann.posted_at}</span>
                  </div>
                  <h4 className="mt-1.5 text-sm font-semibold text-slate-900">{ann.title}</h4>
                  <p className="mt-1 text-xs text-gray-600 line-clamp-2">{ann.content}</p>
                  <a
                    href={ann.source_url || 'https://glendale.edu'}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-2 inline-flex items-center space-x-1 text-xs font-semibold text-blue-700 hover:underline"
                  >
                    <span>Open in Website</span>
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
              ))}
          </div>
        </div>

        {/* COLUMN 3: SCHOLARSHIPS & AVIATION BENEFITS (Green tint) */}
        <div className="rounded-2xl border border-emerald-200/70 bg-[#F7FDF9] p-5 shadow-sm">
          <div className="flex items-center justify-between border-b border-emerald-200/60 pb-3">
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-emerald-800 flex items-center space-x-1.5">
                <Award className="h-4 w-4" />
                <span>SCHOLARSHIP & FLIGHT BENEFITS</span>
              </div>
              <h3 className="text-sm font-bold text-slate-900 mt-0.5">
                Active aviation grants and student awards
              </h3>
            </div>
            <span className="text-xs font-semibold text-emerald-800 bg-emerald-100 px-2 py-1 rounded">
              Best Choice
            </span>
          </div>

          <div className="mt-4 space-y-3">
            {announcements
              .filter(a => a.category === 'SCHOLARSHIP')
              .slice(0, 3)
              .map(ann => (
                <div key={ann.id} className="rounded-xl bg-white/90 p-3.5 border border-emerald-100 shadow-xs">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded">
                      {ann.badge || 'Grant'}
                    </span>
                    <span className="text-gray-400">{ann.posted_at}</span>
                  </div>
                  <h4 className="mt-1.5 text-sm font-semibold text-slate-900">{ann.title}</h4>
                  <p className="mt-1 text-xs text-gray-600 line-clamp-2">{ann.content}</p>
                  <a
                    href={ann.source_url || 'https://glendale.edu'}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-2 inline-flex items-center space-x-1 text-xs font-semibold text-emerald-700 hover:underline"
                  >
                    <span>View Scholarship Details</span>
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
              ))}
          </div>
        </div>
      </div>

      {/* 5. SHORT RANGE FOCUS & THIS WEEK */}
      <div className="mb-6 grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="rounded-2xl bg-white p-5 shadow-sm border border-gray-200/80">
          <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-gray-500">
            <Clock className="h-4 w-4 text-sky-600" />
            <span>TODAY / NEXT 72 HOURS</span>
          </div>
          <h3 className="mt-1 text-base font-bold text-slate-900">Short-range focus</h3>
          <p className="mt-1 text-xs text-gray-600">
            Focus on Cessna 172 Weight & Balance matrix calculation and pre-solo air law review before weekend flight sorties at Whiteman Airport.
          </p>
          <div className="mt-3 flex items-center space-x-2 text-xs font-medium text-sky-700 bg-sky-50 px-3 py-2 rounded-lg border border-sky-100">
            <CheckCircle2 className="h-4 w-4 flex-shrink-0" />
            <span>Target: Complete pre-flight nav log before Friday 17:00</span>
          </div>
        </div>

        <div className="rounded-2xl bg-white p-5 shadow-sm border border-gray-200/80">
          <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-gray-500">
            <Sparkles className="h-4 w-4 text-amber-500" />
            <span>THIS WEEK MILESTONE</span>
          </div>
          <h3 className="mt-1 text-base font-bold text-slate-900">Aviation Operations & Lab Practice</h3>
          <p className="mt-1 text-xs text-gray-600">
            Ground school FAA written test question bank practice and Redbird simulator session for engine-out glide speed (68 kts) procedures.
          </p>
          <div className="mt-3 flex items-center space-x-2 text-xs font-medium text-amber-800 bg-amber-50 px-3 py-2 rounded-lg border border-amber-100">
            <Plane className="h-4 w-4 flex-shrink-0" />
            <span>Target: 2.0 flight hours + 1.0 sim practice logged this week</span>
          </div>
        </div>
      </div>

      {/* 6. PILOT TRAINING FLIGHT LOGBOOK SUMMARY */}
      <div className="mb-6 rounded-2xl bg-white p-6 shadow-sm border border-gray-200/80">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-gray-100 pb-4">
          <div>
            <div className="flex items-center space-x-2">
              <Plane className="h-5 w-5 text-sky-600" />
              <h2 className="text-lg font-bold text-slate-900">Pilot Training Logbook & Sorties</h2>
            </div>
            <p className="text-xs text-gray-500 mt-0.5">
              Glendale Community College Aviation Flight Labs (KPOC Whiteman Airport)
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-4 bg-gray-50 px-3.5 py-1.5 rounded-lg border border-gray-200/60 text-xs font-medium">
              <div>
                <span className="text-gray-400">Total Flight: </span>
                <span className="font-bold text-slate-900">{totalFlight.toFixed(1)} hrs</span>
              </div>
              <div>
                <span className="text-gray-400">Dual: </span>
                <span className="font-bold text-sky-700">{totalDual.toFixed(1)} hrs</span>
              </div>
              <div>
                <span className="text-gray-400">Solo: </span>
                <span className="font-bold text-emerald-700">{totalSolo.toFixed(1)} hrs</span>
              </div>
              <div>
                <span className="text-gray-400">Sim: </span>
                <span className="font-bold text-purple-700">{totalSim.toFixed(1)} hrs</span>
              </div>
            </div>

            <button
              onClick={() => setIsFlightModalOpen(true)}
              className="inline-flex items-center space-x-1.5 rounded-lg bg-sky-600 px-3.5 py-1.5 text-xs font-semibold text-white shadow-sm hover:bg-sky-700 transition"
            >
              <span>+ Log Sortie</span>
            </button>
          </div>
        </div>

        {/* Flight Sorties Table */}
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-gray-100 text-gray-400 uppercase tracking-wider font-semibold">
                <th className="py-2.5">Date</th>
                <th className="py-2.5">Sortie / Objective</th>
                <th className="py-2.5">Aircraft</th>
                <th className="py-2.5">Tail #</th>
                <th className="py-2.5">Airport</th>
                <th className="py-2.5">Flight Hrs</th>
                <th className="py-2.5">Maneuvers & Remarks</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {flightLogs.map((log) => (
                <tr key={log.id} className="hover:bg-gray-50/60 transition">
                  <td className="py-2.5 font-medium text-slate-900 whitespace-nowrap">{log.flight_date}</td>
                  <td className="py-2.5 font-semibold text-slate-800">{log.title}</td>
                  <td className="py-2.5 text-gray-600">{log.aircraft_type}</td>
                  <td className="py-2.5 font-mono text-gray-500">{log.tail_number || 'N/A'}</td>
                  <td className="py-2.5 font-semibold text-sky-700">{log.airport_code}</td>
                  <td className="py-2.5 font-bold text-slate-900">{log.flight_hours > 0 ? `${log.flight_hours} hrs` : `${log.sim_hours} sim`}</td>
                  <td className="py-2.5 text-gray-500 max-w-xs truncate">
                    {log.maneuvers_covered ? `${log.maneuvers_covered} — ${log.instructor_remarks || ''}` : log.instructor_remarks || 'Normal flight profile'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 7. ACTIVE COURSEWORK & ASSIGNMENTS TABLE */}
      <div className="rounded-2xl bg-white p-6 shadow-sm border border-gray-200/80">
        <div className="flex items-center justify-between border-b border-gray-100 pb-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              {selectedTerm === 'Home' ? 'Curriculum Overview (7 Terms)' : `${selectedTerm} Coursework`}
            </h2>
            <p className="text-xs text-gray-500 mt-0.5">
              Associate of Science in Aviation and Transportation - Pilot Training (GCC Degree Map)
            </p>
          </div>
          <span className="text-xs font-semibold text-gray-500">
            {activeTermCourses.length} courses displayed
          </span>
        </div>

        <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {activeTermCourses.map((c) => (
            <div
              key={c.id}
              className="rounded-xl border border-gray-200/70 p-4 hover:border-sky-300 hover:shadow-sm transition bg-white flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-sky-700 bg-sky-50 px-2 py-0.5 rounded">
                    {c.course_code}
                  </span>
                  <span
                    className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                      c.status === 'enrolled'
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : 'bg-gray-100 text-gray-600'
                    }`}
                  >
                    {c.status === 'enrolled' ? 'Active' : 'Planned'}
                  </span>
                </div>
                <h4 className="mt-2 text-sm font-bold text-slate-900">{c.name}</h4>
                <p className="mt-1 text-xs text-gray-500">Instructor: {c.instructor || 'Aviation Faculty'}</p>
              </div>

              <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-xs">
                <span className="font-medium text-gray-500">{c.units} Units · {c.term}</span>
                {c.current_grade && (
                  <span
                    className={`font-bold px-2 py-0.5 rounded text-xs ${
                      c.current_grade === 'AR'
                        ? 'bg-purple-50 text-purple-700 border border-purple-200'
                        : 'bg-emerald-50 text-emerald-700'
                    }`}
                  >
                    {c.current_grade === 'AR'
                      ? 'Academic Renewal (AR)'
                      : `Grade: ${c.current_grade}${c.current_score ? ` (${c.current_score}%)` : ''}`}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* MODALS */}
      <SyncConsoleModal
        isOpen={isSyncModalOpen}
        onClose={() => setIsSyncModalOpen(false)}
        lastSync={lastSync}
        onSyncComplete={loadData}
      />

      <FlightLogModal
        isOpen={isFlightModalOpen}
        onClose={() => setIsFlightModalOpen(false)}
        onLogAdded={loadData}
        courses={courses}
      />
    </div>
  );
}
