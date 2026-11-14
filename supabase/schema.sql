-- ==============================================================================
-- STUDENT-SKY DATABASE SCHEMA (SUPABASE POSTGRESQL)
-- Project: GCC Aviation & Pilot Training Academic Operations
-- Institution: Glendale Community College (GCC)
-- ==============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. COURSES TABLE
CREATE TABLE IF NOT EXISTS public.courses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    canvas_id BIGINT UNIQUE,
    course_code VARCHAR(50) NOT NULL,
    name VARCHAR(255) NOT NULL,
    term VARCHAR(50) NOT NULL,
    term_order INT DEFAULT 1,
    units NUMERIC(3, 1) DEFAULT 3.0,
    instructor VARCHAR(255),
    status VARCHAR(50) DEFAULT 'enrolled', -- 'enrolled', 'completed', 'planned'
    current_grade VARCHAR(10),
    current_score NUMERIC(5, 2),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. ASSIGNMENTS TABLE
CREATE TABLE IF NOT EXISTS public.assignments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    canvas_id BIGINT UNIQUE,
    course_id UUID REFERENCES public.courses(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    due_at TIMESTAMPTZ,
    points_possible NUMERIC(6, 2) DEFAULT 0,
    submission_status VARCHAR(50) DEFAULT 'unsubmitted', -- 'submitted', 'unsubmitted', 'graded', 'missing', 'excused'
    score NUMERIC(6, 2),
    risk_level VARCHAR(20) DEFAULT 'NORMAL', -- 'CRITICAL', 'AT_RISK', 'WATCH', 'NORMAL'
    risk_reason TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. ANNOUNCEMENTS / CAMPUS WATCH TABLE
CREATE TABLE IF NOT EXISTS public.announcements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    canvas_id BIGINT UNIQUE,
    course_id UUID REFERENCES public.courses(id) ON DELETE SET NULL,
    title VARCHAR(255) NOT NULL,
    content TEXT,
    category VARCHAR(50) DEFAULT 'CANVAS_WATCH', -- 'CANVAS_WATCH', 'COLLEGE_NEWS', 'SCHOLARSHIP'
    badge VARCHAR(50),
    posted_at TIMESTAMPTZ DEFAULT NOW(),
    source_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. FLIGHT & LAB LOGS TABLE (SPECIFIC FOR PILOT TRAINING)
CREATE TABLE IF NOT EXISTS public.flight_lab_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    course_id UUID REFERENCES public.courses(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    flight_date DATE NOT NULL DEFAULT CURRENT_DATE,
    aircraft_type VARCHAR(50) DEFAULT 'Cessna 172', -- 'Cessna 172', 'Piper Arrow', 'Simulator (Redbird)'
    tail_number VARCHAR(20),
    airport_code VARCHAR(10) DEFAULT 'KPOC', -- Whiteman Airport
    flight_hours NUMERIC(4, 1) DEFAULT 0.0,
    dual_hours NUMERIC(4, 1) DEFAULT 0.0,
    solo_hours NUMERIC(4, 1) DEFAULT 0.0,
    sim_hours NUMERIC(4, 1) DEFAULT 0.0,
    maneuvers_covered TEXT,
    instructor_remarks TEXT,
    status VARCHAR(50) DEFAULT 'completed', -- 'scheduled', 'completed', 'cancelled'
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. SYNC LOGS TABLE (CANVAS LMS INTEGRATION RUNS)
CREATE TABLE IF NOT EXISTS public.sync_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    provider VARCHAR(50) NOT NULL DEFAULT 'GCC_CANVAS',
    synced_at TIMESTAMPTZ DEFAULT NOW(),
    status VARCHAR(50) NOT NULL, -- 'SUCCESS', 'PARTIAL', 'FAILED'
    courses_synced INT DEFAULT 0,
    assignments_synced INT DEFAULT 0,
    announcements_synced INT DEFAULT 0,
    error_message TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- INDEXES FOR PERFORMANCE
CREATE INDEX IF NOT EXISTS idx_courses_term ON public.courses(term);
CREATE INDEX IF NOT EXISTS idx_assignments_course_id ON public.assignments(course_id);
CREATE INDEX IF NOT EXISTS idx_assignments_due_at ON public.assignments(due_at);
CREATE INDEX IF NOT EXISTS idx_assignments_risk ON public.assignments(risk_level);
CREATE INDEX IF NOT EXISTS idx_announcements_category ON public.announcements(category);
CREATE INDEX IF NOT EXISTS idx_sync_logs_synced_at ON public.sync_logs(synced_at DESC);

-- ENABLE ROW LEVEL SECURITY (RLS)
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.flight_lab_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sync_logs ENABLE ROW LEVEL SECURITY;

-- POLICIES: PUBLIC READ ACCESS FOR DASHBOARD (OR AUTHENTICATED)
CREATE POLICY "Allow public read access to courses" ON public.courses FOR SELECT USING (true);
CREATE POLICY "Allow service_role full access to courses" ON public.courses FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Allow public read access to assignments" ON public.assignments FOR SELECT USING (true);
CREATE POLICY "Allow service_role full access to assignments" ON public.assignments FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Allow public read access to announcements" ON public.announcements FOR SELECT USING (true);
CREATE POLICY "Allow service_role full access to announcements" ON public.announcements FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Allow public read access to flight_lab_logs" ON public.flight_lab_logs FOR SELECT USING (true);
CREATE POLICY "Allow service_role full access to flight_lab_logs" ON public.flight_lab_logs FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Allow public read access to sync_logs" ON public.sync_logs FOR SELECT USING (true);
CREATE POLICY "Allow service_role full access to sync_logs" ON public.sync_logs FOR ALL USING (auth.role() = 'service_role');
