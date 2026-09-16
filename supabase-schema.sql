-- ==============================================================================
-- JEEVault Production Supabase Database Schema & RLS Policies
-- Compatible with Vercel Deployment & Supabase Backend
-- ==============================================================================

-- 1. Enable Required Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. User Profiles Table (Synchronized with auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL DEFAULT 'JEE Aspirant',
  avatar_url TEXT,
  standard TEXT NOT NULL DEFAULT '12' CHECK (standard IN ('11', '12', 'Dropper')),
  institution TEXT NOT NULL DEFAULT 'Self Study',
  target_year TEXT NOT NULL DEFAULT 'JEE 2026',
  plan TEXT NOT NULL DEFAULT 'Free' CHECK (plan IN ('Free', 'Standard', 'Standard Pro')),
  role TEXT NOT NULL DEFAULT 'student' CHECK (role IN ('student', 'admin')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. Questions Table
CREATE TABLE IF NOT EXISTS public.questions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  subject TEXT NOT NULL CHECK (subject IN ('Physics', 'Mathematics', 'Chemistry')),
  exam_category TEXT NOT NULL CHECK (exam_category IN ('JEE Mains', 'JEE Advanced', 'PYQ')),
  chapter TEXT NOT NULL,
  level TEXT NOT NULL CHECK (level IN ('Level 1', 'Level 2', 'Level 3', 'JEEVault 50 Special')),
  pyq_year INT,
  pyq_session TEXT,
  question_number INT NOT NULL DEFAULT 1,
  difficulty TEXT NOT NULL DEFAULT 'Standard' CHECK (difficulty IN ('Basic', 'Standard', 'Advanced')),
  question_type TEXT DEFAULT 'Single Correct',
  paragraph_text TEXT,
  question_text TEXT NOT NULL,
  question_images JSONB DEFAULT '[]'::jsonb, -- Array of image URLs / paths
  options JSONB NOT NULL DEFAULT '[]'::jsonb, -- Array of options
  correct_option_index INT DEFAULT 0,
  correct_option_indices JSONB DEFAULT '[]'::jsonb, -- For multiple correct questions
  correct_integer_answer NUMERIC, -- For integer type questions
  solution_text TEXT NOT NULL,
  solution_images JSONB DEFAULT '[]'::jsonb, -- Array of solution image URLs / paths
  key_formula TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL
);

-- Migration for existing instances:
ALTER TABLE public.questions
  ADD COLUMN IF NOT EXISTS question_type TEXT DEFAULT 'Single Correct',
  ADD COLUMN IF NOT EXISTS paragraph_text TEXT,
  ADD COLUMN IF NOT EXISTS question_images JSONB DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS solution_images JSONB DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS correct_option_indices JSONB DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS correct_integer_answer NUMERIC;

-- 4. Question Attempts Table (User Performance Analytics)
CREATE TABLE IF NOT EXISTS public.question_attempts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  question_id UUID NOT NULL REFERENCES public.questions(id) ON DELETE CASCADE,
  selected_option INT NOT NULL CHECK (selected_option BETWEEN 0 AND 3),
  is_correct BOOLEAN NOT NULL,
  time_spent_seconds INT NOT NULL DEFAULT 0,
  attempted_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 5. Bookmarks Table
CREATE TABLE IF NOT EXISTS public.bookmarks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  question_id UUID NOT NULL REFERENCES public.questions(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, question_id)
);

-- 6. Study PDFs Table
CREATE TABLE IF NOT EXISTS public.study_pdfs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  subject TEXT NOT NULL CHECK (subject IN ('Physics', 'Mathematics', 'Chemistry')),
  exam_category TEXT NOT NULL CHECK (exam_category IN ('JEE Mains', 'JEE Advanced', 'PYQ')),
  chapter TEXT NOT NULL,
  level_or_year TEXT NOT NULL,
  file_url TEXT NOT NULL,
  preview_url TEXT,
  page_count INT NOT NULL DEFAULT 1,
  file_size_bytes BIGINT,
  is_pro_only BOOLEAN NOT NULL DEFAULT false,
  description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  uploaded_by UUID REFERENCES auth.users(id) ON DELETE SET NULL
);

-- 7. Customer Support Tickets Table
CREATE TABLE IF NOT EXISTS public.support_tickets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  user_email TEXT NOT NULL,
  user_name TEXT NOT NULL,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'Pending' CHECK (status IN ('Pending', 'In Review', 'Resolved')),
  admin_reply TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ==============================================================================
-- Row Level Security (RLS) & Helper Functions
-- ==============================================================================

-- Helper function: Check if authenticated user is admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.question_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookmarks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.study_pdfs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.support_tickets ENABLE ROW LEVEL SECURITY;

-- ------------------------------------------------------------------------------
-- Profiles Policies:
-- Any logged-in user can view profiles; users can update their own profile;
-- Admins can update any profile (e.g. changing user plan or role).
-- ------------------------------------------------------------------------------
CREATE POLICY "Public profiles are viewable by everyone" 
ON public.profiles FOR SELECT USING (true);

CREATE POLICY "Users can update own profile" 
ON public.profiles FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Admins can update any profile" 
ON public.profiles FOR ALL USING (public.is_admin());

-- ------------------------------------------------------------------------------
-- Questions Policies:
-- Anyone (students) can read questions.
-- Only Admins can insert, update, or delete questions.
-- ------------------------------------------------------------------------------
CREATE POLICY "Anyone can read questions" 
ON public.questions FOR SELECT USING (true);

CREATE POLICY "Admins can insert questions" 
ON public.questions FOR INSERT WITH CHECK (public.is_admin());

CREATE POLICY "Admins can update questions" 
ON public.questions FOR UPDATE USING (public.is_admin());

CREATE POLICY "Admins can delete questions" 
ON public.questions FOR DELETE USING (public.is_admin());

-- ------------------------------------------------------------------------------
-- Question Attempts Policies:
-- Users can view & record their own attempts. Admins can view all attempts for analytics.
-- ------------------------------------------------------------------------------
CREATE POLICY "Users can view own attempts" 
ON public.question_attempts FOR SELECT USING (auth.uid() = user_id OR public.is_admin());

CREATE POLICY "Users can record own attempts" 
ON public.question_attempts FOR INSERT WITH CHECK (auth.uid() = user_id);

-- ------------------------------------------------------------------------------
-- Bookmarks Policies:
-- Users manage their own bookmarks.
-- ------------------------------------------------------------------------------
CREATE POLICY "Users can view own bookmarks" 
ON public.bookmarks FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own bookmarks" 
ON public.bookmarks FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own bookmarks" 
ON public.bookmarks FOR DELETE USING (auth.uid() = user_id);

-- ------------------------------------------------------------------------------
-- Study PDFs Policies:
-- Anyone can view PDF listings. Only Admins can upload, edit, or delete PDFs.
-- ------------------------------------------------------------------------------
CREATE POLICY "Anyone can view study PDFs" 
ON public.study_pdfs FOR SELECT USING (true);

CREATE POLICY "Admins can upload study PDFs" 
ON public.study_pdfs FOR INSERT WITH CHECK (public.is_admin());

CREATE POLICY "Admins can update study PDFs" 
ON public.study_pdfs FOR UPDATE USING (public.is_admin());

CREATE POLICY "Admins can delete study PDFs" 
ON public.study_pdfs FOR DELETE USING (public.is_admin());

-- ------------------------------------------------------------------------------
-- Support Tickets Policies:
-- Users can insert their tickets and read their own. Admins have full access.
-- ------------------------------------------------------------------------------
CREATE POLICY "Users can insert support ticket" 
ON public.support_tickets FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can view own support tickets" 
ON public.support_tickets FOR SELECT USING (auth.uid() = user_id OR public.is_admin());

CREATE POLICY "Admins can manage support tickets" 
ON public.support_tickets FOR ALL USING (public.is_admin());

-- ==============================================================================
-- Storage Bucket & Security (for PDF and Solution uploads)
-- ==============================================================================
INSERT INTO storage.buckets (id, name, public) 
VALUES ('jeevault-pdfs', 'jeevault-pdfs', true)
ON CONFLICT (id) DO NOTHING;

-- Storage Policy: Anyone can download/view PDFs
CREATE POLICY "Public read for JEEVault PDFs" 
ON storage.objects FOR SELECT USING (bucket_id = 'jeevault-pdfs');

-- Storage Policy: Only Admins can upload PDFs
CREATE POLICY "Admins can upload PDFs" 
ON storage.objects FOR INSERT 
WITH CHECK (bucket_id = 'jeevault-pdfs' AND public.is_admin());

-- Storage Policy: Only Admins can delete PDFs
CREATE POLICY "Admins can delete PDFs" 
ON storage.objects FOR DELETE 
USING (bucket_id = 'jeevault-pdfs' AND public.is_admin());

-- ==============================================================================
-- Auto-Create Profile on Signup Trigger
-- ==============================================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, name, standard, institution, target_year, plan, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', 'JEE Aspirant'),
    '12',
    'Self Study',
    'JEE 2026',
    'Free',
    CASE WHEN NEW.email = 'imtiazahmed12408@gmail.com' THEN 'admin' ELSE 'student' END
  )
  ON CONFLICT (id) DO UPDATE
  SET email = EXCLUDED.email;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Owner Grant Notice:
-- To make any specific user admin immediately, run:
-- UPDATE public.profiles SET role = 'admin' WHERE email = 'your_email@domain.com';
