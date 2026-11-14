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
  Award,
  ChevronRight,
  Sparkles,
  Bookmark,
  CheckCircle2,
  Lock,
  CalendarCheck,
  CheckSquare,
  FileCheck2,
  BarChart3,
  Layers,
  Terminal,
  Play
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

  // Fallback initial data in case Supabase is loading
  const defaultCourses: Course[] = [
    {
      id: 'c1',
      canvas_id: 92601,
      course_code: 'AT 120',
      name: 'Private Pilot Ground School (FAA Written Prep)',
      term: 'Spring 2026',
      term_order: 1,
      units: 5.0,
      instructor: 'Capt. R. Miller, CFI/CFII',
      status: 'enrolled',
      current_grade: 'A',
      current_score: 95.0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: 'c2',
      canvas_id: 92602,
      course_code: 'AT 121L',
      name: 'Private Pilot Flight Lab I (Whiteman KPOC)',
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
      canvas_id: 92603,
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
      canvas_id: 92604,
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
      canvas_id: 92605,
      course_code: 'AT 122',
      name: 'Aviation Meteorology (Replaced with Grade A)',
      term: 'Spring 2026',
      term_order: 1,
      units: 3.0,
      instructor: 'Prof. D. Scott',
      status: 'enrolled',
      current_grade: 'A',
      current_score: 97.0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: 'c6',
      canvas_id: 92606,
      course_code: 'AT 124',
      name: 'Radio/Flight Regulations & Procedures',
      term: 'Spring 2026',
      term_order: 1,
      units: 3.0,
      instructor: 'Capt. R. Miller',
      status: 'enrolled',
      current_grade: 'C',
      current_score: 78.0,
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
      description: 'Calculate center of gravity and moment arms for standard fuel and passenger loading before cross-country flight.',
      due_at: '2026-11-14T23:59:00Z',
      points_possible: 100.0,
      submission_status: 'unsubmitted',
      score: null,
      risk_level: 'CRITICAL',
      risk_reason: 'Due tonight at 23:59. Mandatory prerequisite for weekend flight sortie.',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: 'a2',
      canvas_id: 800102,
      course_id: 'c1',
      name: 'Sectional Chart & Airspace VFR Navigation Log (KPOC to KSZP)',
      description: 'Plot VFR flight plan avoiding Burbank Class C airspace and mountainous terrain with wind correction angles.',
      due_at: '2026-11-18T23:59:00Z',
      points_possible: 100.0,
      submission_status: 'unsubmitted',
      score: null,
      risk_level: 'WATCH',
      risk_reason: 'Due in 4 days. Pre-flight navigation log.',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: 'a3',
      canvas_id: 800103,
      course_id: 'c2',
      name: 'Pre-Solo Written Examination Verification',
      description: 'Endorsement review with Chief Flight Instructor covering emergency glide speeds and runway incursions.',
      due_at: '2026-11-20T23:59:00Z',
      points_possible: 100.0,
      submission_status: 'unsubmitted',
      score: null,
      risk_level: 'WATCH',
      risk_reason: 'Flight lab requirement before solo pattern endorsement.',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: 'a4',
      canvas_id: 800104,
      course_id: 'c3',
      name: 'Aviation Industry Safety Management Systems (SMS) Reflection',
      description: 'Analysis of human factors and cockpit resource management (CRM) principles.',
      due_at: '2026-11-26T23:59:00Z',
      points_possible: 25.0,
      submission_status: 'unsubmitted',
      score: null,
      risk_level: 'WATCH',
      risk_reason: 'Discussion assignment due in 12 days.',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: 'a5',
      canvas_id: 800105,
      course_id: 'c5',
      name: 'Meteorological Weather Briefing & METAR/TAF Decoding',
      description: 'Real-time weather decoding for southern California airports including KLAX, KBUR, and KPOC.',
      due_at: '2026-12-18T23:59:00Z',
      points_possible: 200.0,
      submission_status: 'unsubmitted',
      score: null,
      risk_level: 'WATCH',
      risk_reason: 'Final comprehensive aviation weather assessment.',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
  ];

  const defaultAnnouncements: Announcement[] = [
    {
      id: 'ann1',
      canvas_id: 700101,
      course_id: 'c1',
      title: 'Exclusion Deadline 11/22/26',
      content: 'Hi all, The deadline for dropping this class with a "W" is 11/22/26. I am going to exclude any inactive students.',
      category: 'CANVAS_WATCH',
      badge: 'AT 120',
      posted_at: 'Nov 14, 00:00',
      source_url: 'https://glendale.instructure.com',
    },
    {
      id: 'ann2',
      canvas_id: 700102,
      course_id: 'c2',
      title: 'No Flight Lab on 11/12/26',
      content: 'Hi, I won\'t be available in the lab today. Please contact me over Canvas Inbox or email if you need dispatch sign-off.',
      category: 'CANVAS_WATCH',
      badge: 'AT 121L',
      posted_at: 'Nov 12, 07:39',
      source_url: 'https://glendale.instructure.com',
    },
    {
      id: 'ann3',
      canvas_id: 700103,
      course_id: 'c3',
      title: 'Student Evaluation For Course Instructor',
      content: 'Please take a few moments to complete a survey for your course "Industrial Technology & Aviation Pathway".',
      category: 'CANVAS_WATCH',
      badge: 'IND T',
      posted_at: 'Nov 9, 16:47',
      source_url: 'https://glendale.instructure.com',
    },
    {
      id: 'ann4',
      canvas_id: 700201,
      course_id: null,
      title: 'Priority Registration Underway',
      content: 'Check SIS under Manage Classes > Enrollment Dates to view your appointment date and enroll for Winter & Spring 2027.',
      category: 'COLLEGE_NEWS',
      badge: 'Registration',
      posted_at: 'Nov 14, 08:00',
      source_url: 'https://glendale.edu/registration',
    },
    {
      id: 'ann5',
      canvas_id: 700202,
      course_id: null,
      title: 'SEP & Prerequisites Review',
      content: 'Meet with an academic counselor to review your student education plan and clear prerequisites for instrument flight labs.',
      category: 'COLLEGE_NEWS',
      badge: 'Counseling',
      posted_at: 'Nov 10, 09:00',
      source_url: 'https://glendale.edu/counseling',
    },
    {
      id: 'ann6',
      canvas_id: 700203,
      course_id: null,
      title: 'Free Tutoring & EOPS Assistance',
      content: 'Free in-person and online tutoring in writing, math, and STEM, plus textbook assistance for eligible aviation students.',
      category: 'COLLEGE_NEWS',
      badge: 'Student Support',
      posted_at: 'Nov 08, 14:00',
      source_url: 'https://glendale.edu/tutoring',
    },
    {
      id: 'ann7',
      canvas_id: 700301,
      course_id: null,
      title: 'AOPA Flight Training Scholarship',
      content: 'AT 120 Lead, $500 cash award plus flight hour vouchers. Apply directly through the AOPA scholarship portal.',
      category: 'SCHOLARSHIP',
      badge: 'Last Mile Fund',
      posted_at: 'Nov 14, 10:00',
      source_url: 'https://www.aopa.org/scholarships',
    },
    {
      id: 'ann8',
      canvas_id: 700302,
      course_id: null,
      title: 'Google AI Pro (Gemini 1-Yr Student Plan)',
      content: 'Free 1-year student plan ($240 value): 5 TB Google One cloud storage, 4x Gemini usage for research and coursework.',
      category: 'SCHOLARSHIP',
      badge: 'Google for Students',
      posted_at: 'Active',
      source_url: 'https://gemini.google.com',
    },
    {
      id: 'ann9',
      canvas_id: 700303,
      course_id: null,
      title: 'GCC Foundation Aviation Scholarships',
      content: 'Up to $1,000 per cycle. Fill out ONE online application for all campus donor awards. Spring cycle currently open.',
      category: 'SCHOLARSHIP',
      badge: 'GCC Foundation',
      posted_at: 'Nov 05, 11:00',
      source_url: 'https://glendale.edu/foundation',
    },
  ];

  const defaultSyncLog: SyncLog = {
    id: 's1',
    provider: 'GCC_CANVAS',
    synced_at: new Date().toISOString(),
    status: 'SUCCESS',
    courses_synced: 6,
    assignments_synced: 18,
    announcements_synced: 24,
    error_message: null,
  };

  const loadData = async () => {
    setIsLoading(true);
    try {
      const { data: cData } = await supabase.from('courses').select('*').order('term_order', { ascending: true });
      if (cData && cData.length > 0) {
        setCourses(cData);
      } else {
        setCourses(defaultCourses);
      }

      const { data: aData } = await supabase.from('assignments').select('*, course:courses(*)').order('due_at', { ascending: true });
      if (aData && aData.length > 0) {
        setAssignments(aData);
      } else {
        setAssignments(defaultAssignments);
      }

      const { data: annData } = await supabase.from('announcements').select('*').order('posted_at', { ascending: false });
      if (annData && annData.length > 0) {
        setAnnouncements(annData);
      } else {
        setAnnouncements(defaultAnnouncements);
      }

      const { data: sData } = await supabase.from('sync_logs').select('*').order('synced_at', { ascending: false }).limit(1).single();
      if (sData) {
        setLastSync(sData);
      } else {
        setLastSync(defaultSyncLog);
      }
    } catch (err) {
      console.warn('Using default seed view state:', err);
      setCourses(defaultCourses);
      setAssignments(defaultAssignments);
      setAnnouncements(defaultAnnouncements);
      setLastSync(defaultSyncLog);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const enrolledCourses = courses.filter(c => c.status === 'enrolled');

  // Terms bar matching image 1
  const termTabs = [
    { name: 'Home', locked: false, isHome: true },
    { name: 'Spring 2026', locked: true, isHome: false },
    { name: 'Summer 2026', locked: true, isHome: false },
    { name: 'Fall 2026', locked: false, isHome: false },
    { name: 'Winter 2027', locked: false, isHome: false },
    { name: 'Spring 2027', locked: false, isHome: false },
  ];

  return (
    <div className="min-h-screen bg-[#FBFBFA] text-[#1E293B]">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        
        {/* ============================================================== */}
        {/* 1. TOP TERM NAVIGATION BAR (MATCHING IMAGE 1)                  */}
        {/* ============================================================== */}
        <div className="mb-6 flex items-center space-x-1.5 overflow-x-auto rounded-xl bg-white p-1.5 shadow-xs border border-gray-200/80">
          {termTabs.map((tab) => (
            <button
              key={tab.name}
              onClick={() => setSelectedTerm(tab.name)}
              className={`inline-flex items-center space-x-1.5 whitespace-nowrap rounded-lg px-4 py-2 text-xs font-semibold transition ${
                selectedTerm === tab.name
                  ? 'bg-[#0F172A] text-white shadow-xs'
                  : 'text-gray-600 hover:bg-gray-100/80 hover:text-gray-900'
              }`}
            >
              {tab.isHome && <Compass className="h-3.5 w-3.5" />}
              <span>{tab.name}</span>
              {tab.locked && <Lock className="h-3 w-3 text-amber-500" />}
            </button>
          ))}
        </div>

        {/* ============================================================== */}
        {/* 2. MAIN HEADER CARD (MATCHING IMAGE 1)                        */}
        {/* ============================================================== */}
        <div className="mb-6 rounded-2xl bg-white p-6 shadow-xs border border-gray-200/80">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
            <div>
              <div className="text-[11px] font-bold uppercase tracking-wider text-[#0D9488]">
                STUDENT SKY · SPRING 2026
              </div>
              <h1 className="mt-1 text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
                Associate of Science in Aviation and Transportation - Pilot Training
              </h1>
              <p className="mt-1 text-base font-semibold text-slate-700">
                Glendale Community College
              </p>
              <div className="mt-1 text-xs text-gray-500">
                1500 N. Verdugo Avenue, Glendale, CA 91208 · Flight Labs: Whiteman Airport (KPOC)
              </div>
            </div>

            {/* Canvas Sync Box (Right) */}
            <div className="flex-shrink-0 rounded-xl bg-gray-50/80 p-4 border border-gray-200/60 min-w-[270px]">
              <div className="flex items-center space-x-2 text-xs font-bold text-gray-800">
                <RefreshCw className="h-3.5 w-3.5 text-sky-600" />
                <span>Canvas Sync</span>
              </div>
              <p className="mt-1 text-xs text-gray-500">
                Last synced Nov 14, 06:00
              </p>
              <p className="text-[11px] text-gray-400 mt-0.5">
                6 courses · 43 assignments · GCC Canvas API
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

        {/* ============================================================== */}
        {/* 3. FOUR KEY STAT METRIC CARDS (MATCHING IMAGE 1)               */}
        {/* ============================================================== */}
        <div className="mb-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
          <div className="rounded-2xl bg-white p-5 shadow-xs border border-gray-200/80">
            <div className="flex items-center space-x-2 text-xs font-medium text-gray-500">
              <BookOpen className="h-3.5 w-3.5 text-sky-600" />
              <span>Term courses</span>
            </div>
            <div className="mt-2 text-3xl font-extrabold text-slate-900">{enrolledCourses.length || 6}</div>
          </div>

          <div className="rounded-2xl bg-white p-5 shadow-xs border border-gray-200/80">
            <div className="flex items-center space-x-2 text-xs font-medium text-gray-500">
              <Calendar className="h-3.5 w-3.5 text-indigo-600" />
              <span>Due in 7 days</span>
            </div>
            <div className="mt-2 text-3xl font-extrabold text-slate-900">1</div>
          </div>

          <div className="rounded-2xl bg-white p-5 shadow-xs border border-gray-200/80">
            <div className="flex items-center space-x-2 text-xs font-medium text-gray-500">
              <AlertTriangle className="h-3.5 w-3.5 text-amber-500" />
              <span>At risk</span>
            </div>
            <div className="mt-2 text-3xl font-extrabold text-slate-900">3</div>
          </div>

          <div className="rounded-2xl bg-white p-5 shadow-xs border border-gray-200/80">
            <div className="flex items-center space-x-2 text-xs font-medium text-gray-500">
              <Clock className="h-3.5 w-3.5 text-emerald-600" />
              <span>Next due</span>
            </div>
            <div className="mt-2 text-lg sm:text-xl font-extrabold text-slate-900 truncate">
              Nov 14, 23:59
            </div>
          </div>
        </div>

        {/* ============================================================== */}
        {/* 4. THREE-COLUMN WIDGET GRID (MATCHING IMAGE 1)                */}
        {/* ============================================================== */}
        <div className="mb-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
          
          {/* Card 1: CANVAS WATCH (Amber/Yellow header) */}
          <div className="rounded-2xl border border-amber-200/70 bg-[#FEFDF5] p-5 shadow-xs">
            <div className="flex items-center justify-between border-b border-amber-200/60 pb-3">
              <div>
                <div className="text-xs font-bold uppercase tracking-wider text-amber-800 flex items-center space-x-1.5">
                  <Plane className="h-3.5 w-3.5" />
                  <span>CANVAS WATCH</span>
                </div>
                <h3 className="text-sm font-bold text-slate-900 mt-0.5">
                  Latest announcements and outage planning
                </h3>
              </div>
              <button
                onClick={() => setIsSyncModalOpen(true)}
                className="text-xs font-semibold text-amber-900 bg-amber-100 hover:bg-amber-200 px-2.5 py-1 rounded transition"
              >
                Sync
              </button>
            </div>

            <div className="mt-4 space-y-3">
              {announcements
                .filter(a => a.category === 'CANVAS_WATCH')
                .slice(0, 3)
                .map((ann) => (
                  <div key={ann.id} className="rounded-xl bg-white/95 p-3.5 border border-amber-100 shadow-2xs">
                    <div className="flex items-center space-x-2 text-xs">
                      <span className="font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-100">
                        {ann.badge || 'AT 120'}
                      </span>
                      <span className="text-gray-400">{ann.posted_at}</span>
                    </div>
                    <h4 className="mt-1.5 text-sm font-bold text-slate-900">{ann.title}</h4>
                    <p className="mt-1 text-xs text-gray-600 line-clamp-2">{ann.content}</p>
                    <a
                      href={ann.source_url || 'https://glendale.instructure.com'}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-2 inline-flex items-center space-x-1 text-xs font-semibold text-sky-700 hover:underline"
                    >
                      <span>Open in Canvas</span>
                    </a>
                  </div>
                ))}
            </div>
          </div>

          {/* Card 2: COLLEGE NEWS (Blue header) */}
          <div className="rounded-2xl border border-blue-200/70 bg-[#F8FAFC] p-5 shadow-xs">
            <div className="flex items-center justify-between border-b border-blue-200/60 pb-3">
              <div>
                <div className="text-xs font-bold uppercase tracking-wider text-blue-800 flex items-center space-x-1.5">
                  <Bookmark className="h-3.5 w-3.5" />
                  <span>COLLEGE NEWS</span>
                </div>
                <h3 className="text-sm font-bold text-slate-900 mt-0.5">
                  GCC announcements and student services
                </h3>
              </div>
              <span className="text-xs font-semibold text-blue-800 bg-blue-100/80 px-2.5 py-1 rounded">
                Week 10
              </span>
            </div>

            <div className="mt-4 space-y-3">
              {announcements
                .filter(a => a.category === 'COLLEGE_NEWS')
                .slice(0, 3)
                .map((ann) => (
                  <div key={ann.id} className="rounded-xl bg-white/95 p-3.5 border border-blue-100 shadow-2xs">
                    <div className="flex items-center space-x-2 text-xs">
                      <span className="font-bold text-blue-800 bg-blue-50 px-2 py-0.5 rounded border border-blue-100">
                        {ann.badge || 'News'}
                      </span>
                      <span className="text-gray-400">Winter & Spring 2027</span>
                    </div>
                    <h4 className="mt-1.5 text-sm font-bold text-slate-900">{ann.title}</h4>
                    <p className="mt-1 text-xs text-gray-600 line-clamp-2">{ann.content}</p>
                    <a
                      href={ann.source_url || 'https://glendale.edu'}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-2 inline-flex items-center space-x-1 text-xs font-semibold text-blue-700 hover:underline"
                    >
                      <span>{ann.badge === 'Counseling' ? 'Book Counseling' : ann.badge === 'Student Support' ? 'GCC Tutoring Services' : 'Open SIS Portal'}</span>
                    </a>
                  </div>
                ))}
            </div>
          </div>

          {/* Card 3: SCHOLARSHIP (Green header) */}
          <div className="rounded-2xl border border-emerald-200/70 bg-[#F7FDF9] p-5 shadow-xs">
            <div className="flex items-center justify-between border-b border-emerald-200/60 pb-3">
              <div>
                <div className="text-xs font-bold uppercase tracking-wider text-emerald-800 flex items-center space-x-1.5">
                  <Award className="h-3.5 w-3.5" />
                  <span>SCHOLARSHIP</span>
                </div>
                <h3 className="text-sm font-bold text-slate-900 mt-0.5">
                  Active awards and student benefits
                </h3>
              </div>
              <span className="text-xs font-semibold text-emerald-800 bg-emerald-100/80 px-2.5 py-1 rounded">
                Best Choice
              </span>
            </div>

            <div className="mt-4 space-y-3">
              {announcements
                .filter(a => a.category === 'SCHOLARSHIP')
                .slice(0, 3)
                .map((ann, idx) => (
                  <div key={ann.id} className="rounded-xl bg-white/95 p-3.5 border border-emerald-100 shadow-2xs">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">
                        {ann.badge || 'Award'}
                      </span>
                      <span className="font-bold text-slate-900">
                        {idx === 0 ? '$500' : idx === 1 ? 'Free 1 Year' : 'Up to $1,000'}
                      </span>
                    </div>
                    <h4 className="mt-1.5 text-sm font-bold text-slate-900">{ann.title}</h4>
                    <p className="mt-1 text-xs text-gray-600 line-clamp-2">{ann.content}</p>
                    <a
                      href={ann.source_url || 'https://glendale.edu'}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-2 inline-flex items-center space-x-1 text-xs font-semibold text-emerald-700 hover:underline"
                    >
                      <span>{idx === 1 ? 'Open Gemini AI Pro' : idx === 2 ? 'Apply on GCC Foundation' : 'Open in Website'}</span>
                    </a>
                  </div>
                ))}
            </div>
          </div>
        </div>

        {/* ============================================================== */}
        {/* 5. SHORT RANGE FOCUS & THIS WEEK (MATCHING IMAGE 2)            */}
        {/* ============================================================== */}
        <div className="mb-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
          
          {/* Left: TODAY / NEXT 72 HOURS */}
          <div className="rounded-2xl bg-white p-6 shadow-xs border border-gray-200/80">
            <div className="flex items-center space-x-2 text-[11px] font-bold uppercase tracking-wider text-[#0D9488]">
              <Clock className="h-3.5 w-3.5" />
              <span>TODAY / NEXT 72 HOURS</span>
            </div>
            <h3 className="mt-1 text-lg font-bold text-slate-900">Short-range focus</h3>

            <div className="mt-4">
              <div className="text-xs font-bold text-slate-700">Today</div>
              <div className="mt-2 rounded-xl bg-gray-50/70 p-3.5 border border-gray-100">
                <div className="flex items-center space-x-2 text-xs font-medium text-slate-600">
                  <span className="h-2 w-2 rounded-full bg-emerald-500" />
                  <span className="font-bold text-slate-900">AT 120</span>
                  <span>0 pts</span>
                  <span>Nov 14, 23:59</span>
                </div>
                <div className="mt-1 text-sm font-bold text-slate-900">
                  Student Evaluation For Course Instructor
                </div>
              </div>
            </div>

            <div className="mt-4">
              <div className="text-xs font-bold text-slate-700">Next 72 hours</div>
              <div className="mt-2 text-xs text-gray-500 bg-gray-50/50 p-3 rounded-xl border border-gray-100">
                Nothing due in the next 72 hours. Next live due date: Nov 14, 23:59.
              </div>
            </div>
          </div>

          {/* Right: This Week */}
          <div className="rounded-2xl bg-white p-6 shadow-xs border border-gray-200/80">
            <h3 className="text-lg font-bold text-slate-900">This Week</h3>
            <p className="mt-1 text-xs text-gray-500">
              Python starts. Protect fixed weekly study blocks and submit early.
            </p>

            <div className="mt-4 space-y-3 text-xs">
              <div className="flex items-start space-x-3 p-2.5 rounded-xl hover:bg-gray-50 transition">
                <CheckCircle2 className="h-4 w-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold text-slate-900">Monday reset</div>
                  <div className="text-gray-500 mt-0.5">Sync Canvas, triage due dates, pick top 3 tasks.</div>
                </div>
              </div>

              <div className="flex items-start space-x-3 p-2.5 rounded-xl hover:bg-gray-50 transition">
                <CheckSquare className="h-4 w-4 text-sky-600 flex-shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold text-slate-900">Lab batch</div>
                  <div className="text-gray-500 mt-0.5">Finish technical labs within 2-3 days of module release.</div>
                </div>
              </div>

              <div className="flex items-start space-x-3 p-2.5 rounded-xl hover:bg-gray-50 transition">
                <CalendarCheck className="h-4 w-4 text-teal-600 flex-shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold text-slate-900">Saturday required class</div>
                  <div className="text-gray-500 mt-0.5">AT 121 Flight sortie / simulator drills, 14:00-18:00.</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ============================================================== */}
        {/* 6. WEEKLY CLASS SCHEDULE (MATCHING IMAGE 2)                   */}
        {/* ============================================================== */}
        <div className="mb-6 rounded-2xl bg-white p-6 shadow-xs border border-gray-200/80">
          <div className="flex items-center justify-between border-b border-gray-100 pb-3">
            <div>
              <h3 className="text-base font-bold text-slate-900">Weekly Class Schedule</h3>
              <p className="text-xs text-gray-500 mt-0.5">
                Los Angeles time, with fixed meetings separated from self-paced work.
              </p>
            </div>
            <Calendar className="h-4 w-4 text-teal-600" />
          </div>

          {/* Day Grid Sun - Sat */}
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-7 gap-3 text-xs">
            {/* Sun */}
            <div className="rounded-xl border border-gray-100 bg-gray-50/40 p-3">
              <div className="font-bold text-rose-600">Sun</div>
              <div className="mt-3 text-[11px] text-gray-400">No fixed class block</div>
            </div>

            {/* Mon */}
            <div className="rounded-xl border border-gray-100 bg-white p-3 space-y-2">
              <div className="font-bold text-slate-700">Mon</div>
              <div className="rounded-lg bg-gray-50 p-2 border border-gray-100">
                <div className="font-bold text-slate-900">AT 120</div>
                <div className="text-[10px] text-gray-500">Private Pilot Ground (Miller)</div>
                <div className="mt-1 text-[10px] text-gray-400 flex items-center space-x-1">
                  <Clock className="h-2.5 w-2.5" />
                  <span>11:00-12:15</span>
                </div>
              </div>
              <div className="rounded-lg bg-gray-50 p-2 border border-gray-100">
                <div className="font-bold text-slate-900">AT 122</div>
                <div className="text-[10px] text-gray-500">Meteorology (Scott)</div>
                <div className="mt-1 text-[10px] text-gray-400 flex items-center space-x-1">
                  <Clock className="h-2.5 w-2.5" />
                  <span>16:00-18:00</span>
                </div>
              </div>
            </div>

            {/* Tue */}
            <div className="rounded-xl border border-gray-100 bg-white p-3">
              <div className="font-bold text-slate-700">Tue</div>
              <div className="mt-2 rounded-lg bg-gray-50 p-2 border border-gray-100">
                <div className="font-bold text-slate-900">AT 121L</div>
                <div className="text-[10px] text-gray-500">Flight Lab KPOC (Whiteman)</div>
                <div className="mt-1 text-[10px] text-gray-400 flex items-center space-x-1">
                  <Clock className="h-2.5 w-2.5" />
                  <span>14:00-17:00</span>
                </div>
              </div>
            </div>

            {/* Wed */}
            <div className="rounded-xl border border-gray-100 bg-white p-3">
              <div className="font-bold text-slate-700">Wed</div>
              <div className="mt-2 rounded-lg bg-gray-50 p-2 border border-gray-100">
                <div className="font-bold text-slate-900">AT 120</div>
                <div className="text-[10px] text-gray-500">Private Pilot Ground (Miller)</div>
                <div className="mt-1 text-[10px] text-gray-400 flex items-center space-x-1">
                  <Clock className="h-2.5 w-2.5" />
                  <span>11:00-12:15</span>
                </div>
              </div>
            </div>

            {/* Thu */}
            <div className="rounded-xl border border-gray-100 bg-gray-50/40 p-3">
              <div className="font-bold text-slate-700">Thu</div>
              <div className="mt-3 text-[11px] text-gray-400">No fixed class block</div>
            </div>

            {/* Fri */}
            <div className="rounded-xl border border-gray-100 bg-gray-50/40 p-3">
              <div className="font-bold text-slate-700">Fri</div>
              <div className="mt-3 text-[11px] text-gray-400">No fixed class block</div>
            </div>

            {/* Sat (Highlighted Today in Teal!) */}
            <div className="rounded-xl border-2 border-teal-400 bg-teal-50/20 p-3 relative">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-900">Sat</span>
                <span className="text-[10px] font-bold text-teal-700 bg-teal-100 px-1.5 py-0.5 rounded">Today</span>
              </div>
              <div className="mt-2 rounded-lg bg-white p-2 border border-teal-200 shadow-2xs">
                <div className="font-bold text-slate-900">AT 121L</div>
                <div className="text-[10px] text-gray-500">Flight Sortie & Sim Lab</div>
                <div className="mt-1 text-[10px] text-teal-700 font-medium flex items-center space-x-1">
                  <Clock className="h-2.5 w-2.5" />
                  <span>14:00-18:00</span>
                </div>
              </div>
            </div>
          </div>

          {/* Asynchronous / Self-Paced Row */}
          <div className="mt-4 pt-3 border-t border-gray-100 flex items-center space-x-3 text-xs">
            <span className="font-bold text-slate-700">Asynchronous / Self-Paced:</span>
            <div className="flex items-center space-x-2">
              <span className="rounded-lg bg-gray-100 px-2.5 py-1 font-mono font-semibold text-slate-800 border border-gray-200">
                IND T
              </span>
              <span className="rounded-lg bg-gray-100 px-2.5 py-1 font-mono font-semibold text-slate-800 border border-gray-200">
                STDV 101
              </span>
            </div>
          </div>
        </div>

        {/* ============================================================== */}
        {/* 7. PRIORITY QUEUE + PIPELINE (MATCHING IMAGES 3 & 4)          */}
        {/* ============================================================== */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          
          {/* LEFT: What Should I Do Now? (2/3 Columns) */}
          <div className="lg:col-span-2 rounded-2xl bg-white p-6 shadow-xs border border-gray-200/80">
            <div className="flex items-start justify-between border-b border-gray-100 pb-4">
              <div>
                <h3 className="text-lg font-bold text-slate-900">What Should I Do Now?</h3>
                <p className="text-xs text-gray-500 mt-0.5">
                  Sorted by deadline pressure, points, progress, workload, and Canvas submission state.
                </p>
              </div>
              <span className="inline-flex items-center space-x-1 text-xs font-semibold text-teal-800 bg-teal-50 px-2.5 py-1 rounded-lg border border-teal-200">
                <Layers className="h-3.5 w-3.5" />
                <span>Phase 1: Foundation load</span>
              </span>
            </div>

            {/* Assignment Cards List */}
            <div className="mt-5 space-y-4">
              {assignments.map((task) => (
                <div
                  key={task.id}
                  className="rounded-2xl border border-gray-200/70 p-4 hover:border-gray-300 hover:shadow-xs transition bg-white"
                >
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center space-x-2">
                      <span className={`h-2 w-2 rounded-full ${task.risk_level === 'CRITICAL' ? 'bg-rose-500' : 'bg-amber-500'}`} />
                      <span className="font-mono font-bold text-slate-900">
                        {task.course?.course_code || 'AT 120'}
                      </span>
                      <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                        Live Canvas
                      </span>
                      <span className="text-[10px] text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
                        reading
                      </span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                        task.risk_level === 'CRITICAL'
                          ? 'bg-rose-50 text-rose-700 border border-rose-200'
                          : 'bg-amber-50 text-amber-700 border border-amber-200'
                      }`}>
                        {task.risk_level}
                      </span>
                    </div>

                    <div className="text-right">
                      <div className="font-bold text-slate-800 text-xs">
                        {task.due_at ? new Date(task.due_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : 'No due date'}
                      </div>
                      <div className="text-[11px] text-gray-400 mt-0.5">
                        90 min · {task.points_possible} pts · 0% done
                      </div>
                    </div>
                  </div>

                  <h4 className="mt-2.5 text-sm font-bold text-slate-900">
                    {task.name}
                  </h4>

                  <div className="mt-4 flex items-center justify-between border-t border-gray-100 pt-3">
                    <div className="flex items-center space-x-2">
                      <button className="rounded-lg border border-gray-200 px-3 py-1 text-xs font-semibold text-gray-700 hover:bg-gray-50">
                        Acknowledge
                      </button>
                      <button className="rounded-lg border border-gray-200 px-3 py-1 text-xs font-semibold text-gray-700 hover:bg-gray-50">
                        Start
                      </button>
                      <a
                        href="https://glendale.instructure.com"
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center space-x-1 rounded-lg border border-gray-200 px-3 py-1 text-xs font-semibold text-gray-700 hover:bg-gray-50"
                      >
                        <ExternalLink className="h-3 w-3" />
                        <span>Canvas</span>
                      </a>
                    </div>

                    <div className="flex items-center space-x-2">
                      <span className="text-[11px] font-bold text-amber-600">PRIORITY · {task.risk_level}</span>
                      <div className="w-16 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                        <div className={`h-full ${task.risk_level === 'CRITICAL' ? 'w-full bg-rose-500' : 'w-2/3 bg-amber-500'}`} />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT: SUBMIT PROOF + KANBAN SNAPSHOT + LAB NOTES (1/3 Column) */}
          <div className="space-y-6">
            
            {/* 1. SUBMIT PROOF */}
            <div className="rounded-2xl bg-white p-5 shadow-xs border border-gray-200/80">
              <div className="text-[11px] font-bold uppercase tracking-wider text-teal-700 flex items-center space-x-1">
                <CheckSquare className="h-3.5 w-3.5" />
                <span>SUBMIT PROOF</span>
              </div>
              <h3 className="mt-0.5 text-sm font-bold text-slate-900">
                Before marking submitted
              </h3>

              <div className="mt-3 rounded-xl bg-gray-50/70 p-3 border border-gray-100 text-xs">
                <div className="font-bold text-slate-900">AT 120</div>
                <div className="text-gray-600 font-medium mt-0.5">Weight & Balance Calculation Matrix</div>
                <div className="text-gray-400 text-[11px] mt-0.5">Nov 14, 23:59</div>
              </div>

              <div className="mt-4 space-y-2 text-xs text-gray-600">
                <div className="flex items-center space-x-2">
                  <CheckCircle2 className="h-3.5 w-3.5 text-teal-600 flex-shrink-0" />
                  <span>Submission screenshot saved</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle2 className="h-3.5 w-3.5 text-teal-600 flex-shrink-0" />
                  <span>Canvas confirmation page captured</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle2 className="h-3.5 w-3.5 text-teal-600 flex-shrink-0" />
                  <span>File name and timestamp recorded</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle2 className="h-3.5 w-3.5 text-teal-600 flex-shrink-0" />
                  <span>Backup copy stored locally</span>
                </div>
              </div>
            </div>

            {/* 2. KANBAN SNAPSHOT */}
            <div className="rounded-2xl bg-white p-5 shadow-xs border border-gray-200/80">
              <h3 className="text-sm font-bold text-slate-900">Kanban Snapshot</h3>
              <p className="text-xs text-gray-500 mt-0.5">
                A quick pipeline view of where each live Canvas assignment stands before it is submitted and graded.
              </p>

              <div className="mt-4 space-y-2 text-xs divide-y divide-gray-50">
                <div className="flex justify-between py-1 text-slate-700">
                  <span>Discovered</span>
                  <span className="font-bold">6</span>
                </div>
                <div className="flex justify-between py-1 text-slate-700">
                  <span>Acknowledged</span>
                  <span className="font-bold">0</span>
                </div>
                <div className="flex justify-between py-1 text-slate-700">
                  <span>Started</span>
                  <span className="font-bold">0</span>
                </div>
                <div className="flex justify-between py-1 text-slate-700">
                  <span>Ready for Audit</span>
                  <span className="font-bold">0</span>
                </div>
                <div className="flex justify-between py-1 text-slate-700">
                  <span>AI Audited</span>
                  <span className="font-bold">0</span>
                </div>
                <div className="flex justify-between py-1 text-slate-700">
                  <span>Ready to Submit</span>
                  <span className="font-bold">0</span>
                </div>
                <div className="flex justify-between py-1 text-slate-700">
                  <span>Marked Submitted</span>
                  <span className="font-bold text-emerald-700">2</span>
                </div>
                <div className="flex justify-between py-1 text-slate-700">
                  <span>Canvas Confirmed</span>
                  <span className="font-bold">0</span>
                </div>
                <div className="flex justify-between py-1 text-slate-700">
                  <span>Graded</span>
                  <span className="font-bold">0</span>
                </div>
                <div className="flex justify-between py-1 text-slate-700">
                  <span>Cancelled</span>
                  <span className="font-bold">0</span>
                </div>
              </div>
            </div>

            {/* 3. LAB NOTES (MATCHING IMAGE 4 TERMINAL BOX) */}
            <div className="rounded-2xl bg-white p-5 shadow-xs border border-gray-200/80">
              <h3 className="text-sm font-bold text-slate-900">Lab Notes</h3>
              <p className="text-xs text-gray-500 mt-0.5">
                Starter API is ready for flight & lab notes. First target: preflight checklists, maneuvers, flight hours, and CFI proof.
              </p>

              {/* Dark Terminal Box */}
              <div className="mt-3 rounded-xl bg-[#0F172A] p-4 font-mono text-xs text-slate-200 space-y-1">
                <div className="text-emerald-400">labs tracked: 3</div>
                <div className="text-slate-400 text-[11px] leading-relaxed">
                  default fields: sortie, aircraft, flight_hours, dual, solo, maneuvers, remarks
                </div>
              </div>

              <button
                onClick={() => setIsFlightModalOpen(true)}
                className="mt-3 w-full rounded-xl bg-sky-50 py-2 text-xs font-bold text-sky-700 hover:bg-sky-100 border border-sky-200 transition"
              >
                + Log Flight Sortie Entry
              </button>
            </div>

          </div>
        </div>

        {/* ============================================================== */}
        {/* 8. HISTORICAL & DEGREE PATHWAY COURSES TABLE (WITH AR BADGES)   */}
        {/* ============================================================== */}
        <div className="mt-6 rounded-2xl bg-white p-6 shadow-xs border border-gray-200/80">
          <div className="flex items-center justify-between border-b border-gray-100 pb-4">
            <div>
              <h3 className="text-lg font-bold text-slate-900">
                GCC Curriculum & Transcript History
              </h3>
              <p className="text-xs text-gray-500 mt-0.5">
                Associate of Science in Aviation and Transportation - Pilot Training (All terms & Academic Renewal records)
              </p>
            </div>
            <span className="text-xs font-semibold text-gray-500">
              {courses.length} courses total
            </span>
          </div>

          <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3">
            {courses.map((c) => (
              <div
                key={c.id}
                className="rounded-xl border border-gray-200/70 p-4 hover:border-sky-300 hover:shadow-xs transition bg-white flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-sky-700 bg-sky-50 px-2 py-0.5 rounded border border-sky-100">
                      {c.course_code}
                    </span>
                    <span
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                        c.status === 'enrolled'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-gray-100 text-gray-600'
                      }`}
                    >
                      {c.status === 'enrolled' ? 'Active' : 'Completed'}
                    </span>
                  </div>
                  <h4 className="mt-2 text-xs sm:text-sm font-bold text-slate-900">{c.name}</h4>
                  <p className="mt-1 text-[11px] text-gray-500">{c.term} · {c.units} Units</p>
                </div>

                <div className="mt-3 pt-2.5 border-t border-gray-100 flex items-center justify-between text-xs">
                  <span className="text-gray-400 text-[11px] truncate max-w-[140px]">{c.instructor || 'Aviation Faculty'}</span>
                  {c.current_grade && (
                    <span
                      className={`font-bold px-2 py-0.5 rounded text-[11px] ${
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
    </div>
  );
}
