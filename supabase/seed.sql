-- ==============================================================================
-- STUDENT-SKY SEED DATA (GLENDALE COMMUNITY COLLEGE - PILOT TRAINING)
-- Authentic GCC Academic Transcript & Aviation Pathway Records
-- ==============================================================================

-- 1. COURSES TABLE SEED DATA (INCLUDING HISTORICAL TRANSCRIPT & AR NOTATIONS)
INSERT INTO public.courses (id, canvas_id, course_code, name, term, term_order, units, instructor, status, current_grade, current_score)
VALUES
-- Fall 2019
('20190101-0000-0000-0000-000000000001', 91901, 'ST DV 103', 'International Students Orientation', 'Fall 2019', 1, 1.0, 'Student Development Faculty', 'completed', 'P', 100.0),
('20190101-0000-0000-0000-000000000002', 91902, 'ESL 123', 'Grammar & Writing II (Academic Renewal)', 'Fall 2019', 1, 5.0, 'ESL Department', 'completed', 'AR', NULL),
('20190101-0000-0000-0000-000000000003', 91903, 'ESL 125', 'Listening & Speaking II', 'Fall 2019', 1, 4.0, 'ESL Department', 'completed', 'B', 85.0),
('20190101-0000-0000-0000-000000000004', 91904, 'ESL 126', 'Reading & Vocabulary for ESL II', 'Fall 2019', 1, 3.0, 'ESL Department', 'completed', 'C', 75.0),

-- Winter 2020
('20200101-0000-0000-0000-000000000005', 92001, 'ESL 133', 'Grammar & Writing III', 'Winter 2020', 2, 5.0, 'ESL Department', 'completed', 'C', 78.0),
('20200101-0000-0000-0000-000000000006', 92002, 'ESL 136', 'Reading & Vocabulary III', 'Winter 2020', 2, 3.0, 'ESL Department', 'completed', 'A', 94.0),

-- Spring 2020
('20200201-0000-0000-0000-000000000007', 92003, 'MATH 90+', 'Inter Alg for BSTEM w/ Support (Excluded)', 'Spring 2020', 3, 6.5, 'Mathematics Department', 'completed', 'AR', NULL),
('20200201-0000-0000-0000-000000000008', 92004, 'ESL 141', 'Grammar & Writing IV (Academic Renewal)', 'Spring 2020', 3, 5.0, 'ESL Department', 'completed', 'AR', NULL),
('20200201-0000-0000-0000-000000000009', 92005, 'AT 120', 'Private Pilot Ground School (FAA Written Prep)', 'Spring 2020', 3, 5.0, 'Capt. R. Miller, CFI/CFII', 'completed', 'A', 95.0),

-- Fall 2020
('20200301-0000-0000-0000-000000000010', 92006, 'ENGL 101', 'Intro College Reading & Comp (Repeated LACC)', 'Fall 2020', 4, 4.0, 'English Department', 'completed', 'AR', NULL),
('20200301-0000-0000-0000-000000000011', 92007, 'AT 123', 'Aerodynamics', 'Fall 2020', 4, 3.0, 'Aviation Faculty', 'completed', 'C', 76.5),
('20200301-0000-0000-0000-000000000012', 92008, 'MUSIC 121', 'History Of Rock Music', 'Fall 2020', 4, 3.0, 'Music Department', 'completed', 'A', 96.0),
('20200301-0000-0000-0000-000000000013', 92009, 'AT 121', 'Aviation Navigation & Flight Planning', 'Fall 2020', 4, 3.0, 'Aviation Faculty', 'completed', 'B', 86.0),

-- Winter 2021
('20210101-0000-0000-0000-000000000014', 92101, 'SPCH 101', 'Public Speaking (ZTC Zero Textbook Cost)', 'Winter 2021', 5, 3.0, 'Communication Studies', 'completed', 'C', 77.0),

-- Spring 2021
('20210201-0000-0000-0000-000000000015', 92102, 'MATH 90+', 'Inter Alg for BSTEM w/ Support (Excluded)', 'Spring 2021', 6, 6.5, 'Mathematics Department', 'completed', 'AR', NULL),
('20210201-0000-0000-0000-000000000016', 92103, 'AT 122', 'Meteorology (Repeated in Sp 2026)', 'Spring 2021', 6, 3.0, 'Aviation Faculty', 'completed', 'AR', NULL),
('20210201-0000-0000-0000-000000000017', 92104, 'ENGL 102', 'Critical Thinking/Lit (Academic Renewal)', 'Spring 2021', 6, 3.0, 'English Department', 'completed', 'AR', NULL),
('20210201-0000-0000-0000-000000000018', 92105, 'CHEM 110', 'Elements Gen Chem (Academic Renewal)', 'Spring 2021', 6, 5.0, 'Chemistry Department', 'completed', 'AR', NULL),

-- Fall 2021
('20210301-0000-0000-0000-000000000019', 92106, 'MATH 90+', 'Inter Alg for BSTEM (Academic Renewal)', 'Fall 2021', 7, 6.5, 'Mathematics Department', 'completed', 'AR', NULL),
('20210301-0000-0000-0000-000000000020', 92107, 'AT 124', 'Radio/Flight Regulations & Procedures', 'Fall 2021', 7, 3.0, 'Aviation Faculty', 'completed', 'C', 78.0),
('20210301-0000-0000-0000-000000000021', 92108, 'ESL 141', 'Grammar & Writing IV (Academic Renewal)', 'Fall 2021', 7, 5.0, 'ESL Department', 'completed', 'AR', NULL),

-- Spring 2026 (Current Active Semester)
('20260101-0000-0000-0000-000000000022', 92601, 'AT 122', 'Aviation Meteorology (Replaced with Grade A)', 'Spring 2026', 8, 3.0, 'Prof. D. Scott, Aviation', 'completed', 'A', 97.0),
('20260101-0000-0000-0000-000000000023', 92602, 'AT 121L', 'Private Pilot Flight Lab I (Whiteman KPOC)', 'Spring 2026', 8, 2.0, 'Chief Flight Instructor', 'enrolled', 'A', 98.0),
('20260101-0000-0000-0000-000000000024', 92603, 'IND T', 'Industrial Technology & Aviation Pathway', 'Spring 2026', 8, 1.0, 'Tech & Aviation Division', 'enrolled', 'A', 100.0),
('20260101-0000-0000-0000-000000000025', 92604, 'STDV 101', 'Path to Academic Strategies and Student Success', 'Spring 2026', 8, 1.0, 'GCC Counseling Department', 'enrolled', 'A', 96.0),

-- Upcoming Planned Aviation Degree Milestones
('20260201-0000-0000-0000-000000000026', 92605, 'AT 128', 'Federal Aviation Regulations & Airspace Systems', 'Summer 2026', 9, 3.0, 'Aviation Faculty', 'planned', NULL, NULL),
('20260301-0000-0000-0000-000000000027', 92606, 'AT 130', 'Instrument Rating Ground School', 'Fall 2026', 10, 3.0, 'Capt. R. Miller, CFII', 'planned', NULL, NULL),
('20260301-0000-0000-0000-000000000028', 92607, 'AT 131', 'Instrument Rating Flight Lab (KPOC)', 'Fall 2026', 10, 2.0, 'KPOC Flight Staff', 'planned', NULL, NULL),
('20270101-0000-0000-0000-000000000029', 92701, 'AT 140', 'Commercial Pilot Ground School', 'Spring 2027', 11, 3.0, 'Aviation Faculty', 'planned', NULL, NULL),
('20270101-0000-0000-0000-000000000030', 92702, 'AT 141', 'Commercial Flight Lab I (Piper Arrow)', 'Spring 2027', 11, 2.0, 'KPOC Flight Instructor', 'planned', NULL, NULL),
('20270201-0000-0000-0000-000000000031', 92703, 'AT 150', 'Multi-Engine Flight Lab & Commercial Capstone', 'Summer 2027', 12, 2.0, 'Aviation Faculty', 'planned', NULL, NULL)
ON CONFLICT (canvas_id) DO NOTHING;

-- 2. SEED ACTIVE ASSIGNMENTS
INSERT INTO public.assignments (canvas_id, course_id, name, due_at, points_possible, submission_status, score, risk_level, risk_reason)
VALUES
(800101, '20260101-0000-0000-0000-000000000023', 'Weight & Balance Calculation Matrix (Cessna 172S)', NOW() + INTERVAL '2 days', 50.0, 'unsubmitted', NULL, 'WATCH', 'Due in 48 hours; prerequisite for weekend flight sortie'),
(800102, '20260101-0000-0000-0000-000000000023', 'Sectional Chart & Airspace VFR Navigation Log (KPOC to KSZP)', NOW() + INTERVAL '5 days', 100.0, 'unsubmitted', NULL, 'NORMAL', 'Cross-country pre-flight planning sheet'),
(800103, '20260101-0000-0000-0000-000000000023', 'Pre-Solo Written Examination Verification', NOW() + INTERVAL '7 days', 100.0, 'unsubmitted', NULL, 'NORMAL', 'Endorsement prerequisite with Chief Flight Instructor'),
(800104, '20260101-0000-0000-0000-000000000024', 'Aviation Industry Safety Management Systems (SMS) Reflection', NOW() + INTERVAL '10 days', 25.0, 'unsubmitted', NULL, 'NORMAL', 'Pathway orientation milestone')
ON CONFLICT (canvas_id) DO NOTHING;

-- 3. SEED ANNOUNCEMENTS / CAMPUS WATCH / SCHOLARSHIP
INSERT INTO public.announcements (canvas_id, title, content, category, badge, posted_at, source_url)
VALUES
(700101, 'Whiteman Airport (KPOC) Flight Dispatch Protocol Update', 'All aviation students must confirm pre-flight weight and balance with the dispatch desk before engine start. Runway 12/30 operations normal.', 'CANVAS_WATCH', 'KPOC Dispatch', NOW() - INTERVAL '3 hours', 'https://glendale.edu/aviation'),
(700102, 'FAA Written Exam Prep Session in Aviation Lab', 'GCC Aviation Lab will host weekend mock sessions for the FAA Private Pilot Knowledge Exam on Saturday 10:00 AM in SV 114.', 'CANVAS_WATCH', 'Exam Prep', NOW() - INTERVAL '1 day', 'https://glendale.edu/aviation'),
(700201, 'GCC Pilot Pathway: SEP Education Plan Review', 'Spring & Summer aviation milestones counseling appointments are open. Meet counselor to ensure Cal-GETC and FAA flight hour tracking alignment.', 'COLLEGE_NEWS', 'Counseling', NOW() - INTERVAL '2 days', 'https://glendale.edu/counseling'),
(700202, 'GCC Aviation Division Simulator Hours Open', 'Redbird FMX full-motion simulator booking is now active for semester practice. Sign up via the Aviation Department portal.', 'COLLEGE_NEWS', 'Flight Sim', NOW() - INTERVAL '3 days', 'https://glendale.edu/aviation'),
(700301, 'AOPA Flight Training Scholarship ($10,000)', 'Open for student pilots actively pursuing Private Pilot or Instrument ratings. Application window closes soon.', 'SCHOLARSHIP', '$10,000 Award', NOW() - INTERVAL '1 day', 'https://www.aopa.org/scholarships'),
(700302, 'EAA Ray Aviation Flight Training Grant', 'Scholarship supporting youth and collegiate flight students covering flight training expenses up to $11,000.', 'SCHOLARSHIP', '$11,000 Grant', NOW() - INTERVAL '4 days', 'https://www.eaa.org/scholarships'),
(700303, 'GCC Foundation Aviation Student Award', 'Glendale College Foundation annual award dedicated to Aviation & Transportation division majors.', 'SCHOLARSHIP', 'GCC Award', NOW() - INTERVAL '5 days', 'https://glendale.edu/foundation')
ON CONFLICT (canvas_id) DO NOTHING;

-- 4. SEED FLIGHT & LAB LOGS (PILOT LOGBOOK HOURS)
INSERT INTO public.flight_lab_logs (course_id, title, flight_date, aircraft_type, tail_number, airport_code, flight_hours, dual_hours, solo_hours, sim_hours, maneuvers_covered, instructor_remarks, status)
VALUES
('20260101-0000-0000-0000-000000000023', 'Sortie 1: Basic Attitude Flying & Steep Turns', CURRENT_DATE - INTERVAL '6 days', 'Cessna 172S', 'N721GC', 'KPOC', 1.8, 1.8, 0.0, 0.0, 'Preflight inspection, taxi, standard rate turns, slow flight, power-off stalls', 'Excellent rudder control during slow flight recovery', 'completed'),
('20260101-0000-0000-0000-000000000023', 'Sortie 2: Traffic Pattern Operations & Touch-and-Go', CURRENT_DATE - INTERVAL '3 days', 'Cessna 172S', 'N721GC', 'KPOC', 1.5, 1.5, 0.0, 0.0, 'Rectangular course, standard traffic pattern, crosswind correction, normal landing', 'Good airspeed management on final approach (65 kts)', 'completed'),
('20260101-0000-0000-0000-000000000023', 'Sim Session: Emergency Engine Out Procedures', CURRENT_DATE - INTERVAL '1 day', 'Simulator (Redbird)', 'SIM-01', 'KPOC', 1.2, 0.0, 0.0, 1.2, 'Engine failure after takeoff, best glide speed (68 kts), emergency checklist execution', 'Procedure memorization satisfactory. Continue emergency checklists practice', 'completed');

-- 5. SEED INITIAL SYNC LOG ENTRY
INSERT INTO public.sync_logs (provider, synced_at, status, courses_synced, assignments_synced, announcements_synced, error_message)
VALUES
('GCC_CANVAS', NOW() - INTERVAL '5 hours', 'SUCCESS', 25, 4, 7, NULL);
