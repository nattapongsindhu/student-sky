-- ==============================================================================
-- STUDENT-SKY DATABASE SCHEMA (SUPABASE POSTGRESQL)
-- Project: GCC Aviation & Pilot Training Academic Operations
-- Institution: Glendale Community College (GCC)
-- ==============================================================================

create table if not exists public.courses (
  id text primary key,
  canvas_course_id bigint unique,
  code text not null,
  title text not null,
  term_label text not null default 'Spring 2026',
  course_status text not null default 'active'
    check (course_status in ('upcoming', 'active', 'completed', 'case_study')),
  campus text not null default 'GCC Aviation',
  modality text not null default 'Online',
  units numeric not null default 3,
  final_grade text,
  current_canvas_grade text,
  expected_grade text,
  official_grade text,
  starts_on date not null default '2026-02-16',
  ends_on date not null default '2026-06-10',
  weekly_hours numeric not null default 0,
  color text not null default '#0284c7',
  source text not null default 'canvas'
    check (source in ('canvas', 'syllabus', 'user', 'ai_inference', 'mock')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.assignments (
  id text primary key,
  course_id text not null references public.courses(id) on delete cascade,
  canvas_assignment_id bigint,
  title text not null,
  due_at timestamptz,
  status text not null default 'DISCOVERED'
    check (status in ('DISCOVERED', 'ACKNOWLEDGED', 'STARTED', 'READY_FOR_AUDIT', 'AI_AUDITED', 'READY_TO_SUBMIT', 'USER_MARKED_SUBMITTED', 'CANVAS_CONFIRMED', 'GRADED', 'CANCELLED')),
  points_possible numeric,
  estimated_minutes integer not null default 90,
  difficulty text not null default 'medium'
    check (difficulty in ('light', 'medium', 'heavy')),
  task_type text not null default 'assignment'
    check (task_type in ('assignment', 'essay', 'discussion', 'reply', 'quiz', 'lab', 'flight_lab', 'simulation', 'project', 'presentation', 'midterm', 'final', 'exam', 'reading', 'homework', 'coding_assignment', 'paper', 'research_assignment', 'extra_credit', 'module_requirement', 'other')),
  priority_score integer not null default 0,
  risk_level text not null default 'LOW'
    check (risk_level in ('LOW', 'WATCH', 'HIGH', 'CRITICAL')),
  progress_percent integer not null default 0
    check (progress_percent between 0 and 100),
  canvas_submission_confirmed boolean not null default false,
  notes text,
  url text,
  source text not null default 'canvas'
    check (source in ('canvas', 'syllabus', 'user', 'ai_inference', 'mock')),
  first_seen_at timestamptz not null default now(),
  last_seen_at timestamptz not null default now(),
  last_changed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (course_id, canvas_assignment_id)
);

create index if not exists assignments_due_at_idx on public.assignments (due_at);
create index if not exists assignments_status_idx on public.assignments (status);
create index if not exists assignments_priority_idx on public.assignments (priority_score desc);

create table if not exists public.lab_notes (
  id uuid primary key default gen_random_uuid(),
  assignment_id text not null references public.assignments(id) on delete cascade,
  note text not null,
  command_snippet text,
  result_summary text,
  next_step text,
  created_at timestamptz not null default now()
);

create table if not exists public.sync_runs (
  id uuid primary key default gen_random_uuid(),
  source text not null default 'canvas',
  status text not null,
  courses_seen integer not null default 0,
  assignments_seen integer not null default 0,
  changes_seen integer not null default 0,
  error_message text,
  started_at timestamptz not null default now(),
  finished_at timestamptz not null default now()
);

create table if not exists public.change_events (
  id uuid primary key default gen_random_uuid(),
  event_key text not null unique,
  course_id text references public.courses(id) on delete cascade,
  assignment_id text references public.assignments(id) on delete cascade,
  event_type text not null,
  severity text not null default 'info'
    check (severity in ('info', 'watch', 'important', 'critical')),
  title text not null,
  previous_value text,
  new_value text,
  source text not null default 'canvas'
    check (source in ('canvas', 'syllabus', 'user', 'ai_inference', 'mock')),
  detected_at timestamptz not null default now(),
  acknowledged_at timestamptz
);

-- RLS Policies (Allow read/write with service role, and public select if enabled)
alter table public.courses enable row level security;
alter table public.assignments enable row level security;
alter table public.lab_notes enable row level security;
alter table public.sync_runs enable row level security;
alter table public.change_events enable row level security;

create policy "Public courses read" on public.courses for select using (true);
create policy "Public assignments read" on public.assignments for select using (true);
create policy "Public lab_notes read" on public.lab_notes for select using (true);
create policy "Public sync_runs read" on public.sync_runs for select using (true);
create policy "Public change_events read" on public.change_events for select using (true);

create policy "Service role write courses" on public.courses for all using (true) with check (true);
create policy "Service role write assignments" on public.assignments for all using (true) with check (true);
create policy "Service role write lab_notes" on public.lab_notes for all using (true) with check (true);
create policy "Service role write sync_runs" on public.sync_runs for all using (true) with check (true);
create policy "Service role write change_events" on public.change_events for all using (true) with check (true);
