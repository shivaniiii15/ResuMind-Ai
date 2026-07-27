-- Create tables for ResuMind Resume & Career Intelligence tools

-- 1. Resumes (Builder data & master resumes)
CREATE TABLE IF NOT EXISTS public.resumes (
  id UUID NOT NULL PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL DEFAULT 'Master Resume',
  data JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.resumes TO authenticated;
GRANT ALL ON public.resumes TO service_role;
ALTER TABLE public.resumes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage own resumes"
  ON public.resumes
  FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE TRIGGER trg_resumes_updated
  BEFORE UPDATE ON public.resumes
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();


-- 2. Analysis Reports (ATS Resume Analyzer outputs)
CREATE TABLE IF NOT EXISTS public.analysis_reports (
  id UUID NOT NULL PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  file_name TEXT NOT NULL,
  ats_score INT NOT NULL,
  resume_score INT NOT NULL,
  targeted_role TEXT,
  word_count INT NOT NULL DEFAULT 0,
  page_count INT NOT NULL DEFAULT 1,
  skills_detected JSONB NOT NULL DEFAULT '{}'::jsonb,
  missing_keywords JSONB NOT NULL DEFAULT '[]'::jsonb,
  grammar_suggestions JSONB NOT NULL DEFAULT '[]'::jsonb,
  formatting_suggestions JSONB NOT NULL DEFAULT '[]'::jsonb,
  strengths JSONB NOT NULL DEFAULT '[]'::jsonb,
  weaknesses JSONB NOT NULL DEFAULT '[]'::jsonb,
  summary TEXT,
  parsed_text TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.analysis_reports TO authenticated;
GRANT ALL ON public.analysis_reports TO service_role;
ALTER TABLE public.analysis_reports ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage own analysis reports"
  ON public.analysis_reports
  FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE INDEX idx_analysis_reports_user_date ON public.analysis_reports(user_id, created_at DESC);


-- 3. Job Matches (Job Match Comparator outputs)
CREATE TABLE IF NOT EXISTS public.job_matches (
  id UUID NOT NULL PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  job_title TEXT NOT NULL,
  company_name TEXT NOT NULL,
  job_description TEXT NOT NULL,
  match_percentage INT NOT NULL,
  matching_skills JSONB NOT NULL DEFAULT '[]'::jsonb,
  missing_skills JSONB NOT NULL DEFAULT '[]'::jsonb,
  matched_keywords JSONB NOT NULL DEFAULT '[]'::jsonb,
  missing_keywords JSONB NOT NULL DEFAULT '[]'::jsonb,
  improvement_suggestions JSONB NOT NULL DEFAULT '[]'::jsonb,
  tailored_summary TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.job_matches TO authenticated;
GRANT ALL ON public.job_matches TO service_role;
ALTER TABLE public.job_matches ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage own job matches"
  ON public.job_matches
  FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE INDEX idx_job_matches_user_date ON public.job_matches(user_id, created_at DESC);


-- 4. Cover Letters (AI Cover Letter Generator outputs)
CREATE TABLE IF NOT EXISTS public.cover_letters (
  id UUID NOT NULL PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  company_name TEXT NOT NULL,
  job_title TEXT NOT NULL,
  job_description TEXT,
  tone TEXT NOT NULL DEFAULT 'Professional',
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.cover_letters TO authenticated;
GRANT ALL ON public.cover_letters TO service_role;
ALTER TABLE public.cover_letters ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage own cover letters"
  ON public.cover_letters
  FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE INDEX idx_cover_letters_user_date ON public.cover_letters(user_id, created_at DESC);
