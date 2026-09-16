import { createClient, SupabaseClient, User as SupabaseAuthUser } from '@supabase/supabase-js';
import { UserProfile, Question, StudyPDF, SubjectId, ExamCategory, QuestionLevel, Difficulty } from '../types';

// Default production Supabase credentials for JEEVault Vercel deployment
const DEFAULT_SUPABASE_URL = 'https://bwdsdxppepngoenpoczz.supabase.co';
const DEFAULT_SUPABASE_ANON_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ3ZHNkeHBwZXBuZ29lbnBvY3p6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODk1MzkzMDcsImV4cCI6MjEwNTExNTMwN30.zufFJKi0hLYuiUCA9ssBhYob9r8SOadJw8GvYKxObqg';

const ENV_URL = (import.meta as any).env?.VITE_SUPABASE_URL || DEFAULT_SUPABASE_URL;
const ENV_KEY = (import.meta as any).env?.VITE_SUPABASE_ANON_KEY || DEFAULT_SUPABASE_ANON_KEY;

// Local storage override keys
const STORAGE_URL_KEY = 'jeevault_supabase_url';
const STORAGE_ANON_KEY = 'jeevault_supabase_key';

export function getSupabaseConfig(): { url: string; anonKey: string; isConfigured: boolean } {
  const url = (localStorage.getItem(STORAGE_URL_KEY) || ENV_URL || '').trim();
  const anonKey = (localStorage.getItem(STORAGE_ANON_KEY) || ENV_KEY || '').trim();
  const isConfigured = Boolean(
    url &&
    anonKey &&
    !url.includes('your-project') &&
    !anonKey.includes('your-anon') &&
    url.startsWith('https://')
  );
  return { url, anonKey, isConfigured };
}

export function saveSupabaseConfig(url: string, anonKey: string) {
  if (url) localStorage.setItem(STORAGE_URL_KEY, url.trim());
  else localStorage.removeItem(STORAGE_URL_KEY);

  if (anonKey) localStorage.setItem(STORAGE_ANON_KEY, anonKey.trim());
  else localStorage.removeItem(STORAGE_ANON_KEY);

  supabaseInstance = null; // Invalidate cached instance
}

let supabaseInstance: SupabaseClient | null = null;

export function getSupabase(): SupabaseClient | null {
  const config = getSupabaseConfig();
  if (!config.isConfigured) return null;

  if (!supabaseInstance) {
    try {
      supabaseInstance = createClient(config.url, config.anonKey, {
        auth: {
          persistSession: true,
          autoRefreshToken: true,
          detectSessionInUrl: true,
        },
      });
    } catch (err) {
      console.warn('Failed to initialize Supabase client:', err);
      return null;
    }
  }
  return supabaseInstance;
}

/**
 * Format a Supabase auth user and DB profile into a consistent UserProfile
 */
export function formatUserProfile(
  authUser: SupabaseAuthUser,
  dbProfile?: Partial<UserProfile> | null
): UserProfile {
  const email = authUser.email || dbProfile?.email || 'student@jeevault.in';
  const isAdmin =
    email.toLowerCase().includes('admin') ||
    email.toLowerCase() === 'imtiazahmed12408@gmail.com' ||
    dbProfile?.role === 'admin';

  return {
    id: authUser.id,
    email,
    name:
      dbProfile?.name ||
      authUser.user_metadata?.full_name ||
      authUser.user_metadata?.name ||
      (isAdmin ? 'JEEVault Admin' : 'JEE Aspirant'),
    avatarUrl:
      dbProfile?.avatarUrl ||
      authUser.user_metadata?.avatar_url ||
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
    standard: dbProfile?.standard || '12',
    institution: dbProfile?.institution || 'Self Study',
    targetYear: dbProfile?.targetYear || 'JEE 2026',
    plan: dbProfile?.plan || (isAdmin ? 'Standard Pro' : 'Free'),
    role: isAdmin ? 'admin' : (dbProfile?.role || 'student'),
    createdAt: dbProfile?.createdAt || authUser.created_at || new Date().toISOString(),
  };
}

/**
 * Map Supabase public.profiles row to UserProfile
 */
export function mapDbProfileToUser(row: any): UserProfile {
  const email = row.email || '';
  const isAdmin =
    email.toLowerCase() === 'imtiazahmed12408@gmail.com' ||
    email.toLowerCase().includes('admin') ||
    row.role === 'admin';

  return {
    id: row.id,
    email,
    name: row.name || (isAdmin ? 'JEEVault Admin' : 'JEE Student'),
    avatarUrl: row.avatar_url || undefined,
    standard: (row.standard as any) || '12',
    institution: row.institution || 'Self Study',
    targetYear: row.target_year || 'JEE 2026',
    plan: (row.plan as any) || (isAdmin ? 'Standard Pro' : 'Free'),
    role: isAdmin ? 'admin' : (row.role || 'student'),
    createdAt: row.created_at || new Date().toISOString(),
  };
}

/**
 * Normalize chapter names to handle variations like "&" vs "and", apostrophes, and spacing
 */
export function normalizeChapterName(name: string): string {
  return (name || '')
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/['’]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Map Supabase public.questions row to frontend Question
 */
export function mapDbQuestionToQuestion(row: any): Question {
  let parsedOptions: string[] = [];
  if (Array.isArray(row.options)) {
    parsedOptions = row.options.map((o: any) => (typeof o === 'string' ? o : o.text || String(o)));
  } else if (typeof row.options === 'string') {
    try {
      const parsed = JSON.parse(row.options);
      parsedOptions = Array.isArray(parsed) ? parsed : [];
    } catch {
      parsedOptions = [];
    }
  }

  // Parse [meta: {...}] from key_formula if present
  let rawFormula = row.key_formula || '';
  let meta: any = null;
  const metaMatch = rawFormula.match(/\[meta:\s*(\{[\s\S]*?\})\]/);
  if (metaMatch) {
    try {
      meta = JSON.parse(metaMatch[1]);
      rawFormula = rawFormula.replace(metaMatch[0], '').trim();
    } catch (e) {
      // Safe fallback
    }
  }

  // Question Images: from column, or meta, or [image: ...] in question_text
  let questionImages: string[] = [];
  if (Array.isArray(row.question_images) && row.question_images.length > 0) {
    questionImages = row.question_images;
  } else if (typeof row.question_images === 'string' && row.question_images) {
    try {
      const parsed = JSON.parse(row.question_images);
      questionImages = Array.isArray(parsed) ? parsed : [row.question_images];
    } catch {
      questionImages = [row.question_images];
    }
  } else if (meta?.qImages && Array.isArray(meta.qImages) && meta.qImages.length > 0) {
    questionImages = meta.qImages;
  }

  // Also parse [image: url] in question_text and clean question_text
  let questionText = row.question_text || '';
  const imgRegex = /\[image:\s*(https?:\/\/[^\s\]]+)\]/gi;
  let match: RegExpExecArray | null;
  while ((match = imgRegex.exec(questionText)) !== null) {
    if (!questionImages.includes(match[1])) {
      questionImages.push(match[1]);
    }
  }
  questionText = questionText.replace(imgRegex, '').trim();

  // Solution Images: from column, or meta, or [solution_image: ...] in solution_text
  let solutionImages: string[] = [];
  if (Array.isArray(row.solution_images) && row.solution_images.length > 0) {
    solutionImages = row.solution_images;
  } else if (typeof row.solution_images === 'string' && row.solution_images) {
    try {
      const parsed = JSON.parse(row.solution_images);
      solutionImages = Array.isArray(parsed) ? parsed : [row.solution_images];
    } catch {
      solutionImages = [row.solution_images];
    }
  } else if (meta?.solImages && Array.isArray(meta.solImages) && meta.solImages.length > 0) {
    solutionImages = meta.solImages;
  }

  // Also parse [solution_image: url] in solution_text and clean solution_text
  let solutionText = row.solution_text || '';
  const solImgRegex = /\[solution_image:\s*(https?:\/\/[^\s\]]+)\]/gi;
  while ((match = solImgRegex.exec(solutionText)) !== null) {
    if (!solutionImages.includes(match[1])) {
      solutionImages.push(match[1]);
    }
  }
  solutionText = solutionText.replace(solImgRegex, '').trim();

  // Question Type
  const questionType = row.question_type || meta?.type || 'Single Correct';

  // Paragraph Text
  const paragraphText = row.paragraph_text || meta?.paragraphText || undefined;

  // Correct Option Indices
  let correctOptionIndices: number[] | undefined;
  if (Array.isArray(row.correct_option_indices) && row.correct_option_indices.length > 0) {
    correctOptionIndices = row.correct_option_indices;
  } else if (meta?.indices && Array.isArray(meta.indices) && meta.indices.length > 0) {
    correctOptionIndices = meta.indices;
  }

  // Correct Integer Answer
  let correctIntegerAnswer: number | undefined;
  if (typeof row.correct_integer_answer === 'number') {
    correctIntegerAnswer = row.correct_integer_answer;
  } else if (row.correct_integer_answer !== null && row.correct_integer_answer !== undefined) {
    correctIntegerAnswer = Number(row.correct_integer_answer);
  } else if (meta?.integerAnswer !== null && meta?.integerAnswer !== undefined) {
    correctIntegerAnswer = Number(meta.integerAnswer);
  }

  return {
    id: row.id,
    subject: row.subject as SubjectId,
    examCategory: row.exam_category as ExamCategory,
    chapter: row.chapter,
    level: row.level as QuestionLevel,
    pyqYear: row.pyq_year || undefined,
    pyqSession: row.pyq_session || undefined,
    questionNumber: row.question_number || 1,
    difficulty: (row.difficulty as Difficulty) || 'Advanced',
    questionType: questionType as any,
    paragraphText,
    questionText,
    questionImages: questionImages.length > 0 ? questionImages : undefined,
    options: parsedOptions.length > 0 ? parsedOptions : (questionType === 'Integer Type' ? [] : [
      'Option A',
      'Option B',
      'Option C',
      'Option D',
    ]),
    correctOptionIndex: typeof row.correct_option_index === 'number' ? row.correct_option_index : 0,
    correctOptionIndices,
    correctIntegerAnswer,
    solutionText,
    solutionImages: solutionImages.length > 0 ? solutionImages : undefined,
    keyFormula: rawFormula || undefined,
    createdAt: row.created_at || undefined,
  };
}

/**
 * Map frontend Question to Supabase public.questions column format
 */
export function mapQuestionToDb(q: Partial<Question>, useExtendedColumns = false): Record<string, any> {
  const qImages = q.questionImages || [];
  const solImages = q.solutionImages || [];

  let questionText = q.questionText || '';
  for (const img of qImages) {
    if (!questionText.includes(img)) {
      questionText += `\n\n[image: ${img}]`;
    }
  }

  let solutionText = q.solutionText || '';
  for (const img of solImages) {
    if (!solutionText.includes(img)) {
      solutionText += `\n\n[solution_image: ${img}]`;
    }
  }

  const metaObj: Record<string, any> = {};
  if (q.questionType) metaObj.type = q.questionType;
  if (q.correctOptionIndices && q.correctOptionIndices.length > 0) metaObj.indices = q.correctOptionIndices;
  if (q.correctIntegerAnswer !== undefined && q.correctIntegerAnswer !== null) metaObj.integerAnswer = q.correctIntegerAnswer;
  if (q.paragraphText) metaObj.paragraphText = q.paragraphText;
  if (qImages.length > 0) metaObj.qImages = qImages;
  if (solImages.length > 0) metaObj.solImages = solImages;

  let keyFormula = q.keyFormula || '';
  if (Object.keys(metaObj).length > 0) {
    keyFormula = `${keyFormula}\n[meta: ${JSON.stringify(metaObj)}]`;
  }

  const payload: Record<string, any> = {
    subject: q.subject,
    exam_category: q.examCategory,
    chapter: q.chapter,
    level: q.level,
    difficulty: q.difficulty || 'Standard',
    question_text: questionText,
    options: q.options || [],
    correct_option_index: q.correctOptionIndex ?? 0,
    solution_text: solutionText,
    key_formula: keyFormula || null,
  };

  if (useExtendedColumns) {
    if (q.questionType) payload.question_type = q.questionType;
    if (q.paragraphText) payload.paragraph_text = q.paragraphText;
    if (qImages.length > 0) payload.question_images = qImages;
    if (solImages.length > 0) payload.solution_images = solImages;
    if (q.correctOptionIndices && q.correctOptionIndices.length > 0) payload.correct_option_indices = q.correctOptionIndices;
    if (q.correctIntegerAnswer !== undefined && q.correctIntegerAnswer !== null) payload.correct_integer_answer = q.correctIntegerAnswer;
  }

  if (q.id && !q.id.startsWith('q-temp-') && !q.id.startsWith('q-phy-') && !q.id.startsWith('q-math-') && !q.id.startsWith('q-chem-')) {
    payload.id = q.id;
  }
  if (q.pyqYear) payload.pyq_year = Number(q.pyqYear);
  if (q.pyqSession) payload.pyq_session = q.pyqSession;
  if (q.questionNumber) payload.question_number = q.questionNumber;

  return payload;
}

/**
 * Map Supabase public.study_pdfs row to frontend StudyPDF
 */
export function mapDbPdfToPdf(row: any): StudyPDF {
  return {
    id: row.id,
    title: row.title || 'Untitled Chapter Document',
    subject: row.subject as SubjectId,
    examCategory: row.exam_category as ExamCategory,
    chapter: row.chapter || '',
    levelOrYear: row.level_or_year || 'Level 1',
    fileUrl: row.file_url || '',
    previewUrl: row.preview_url || undefined,
    pageCount: row.page_count || 1,
    fileSizeBytes: row.file_size_bytes || undefined,
    isProOnly: Boolean(row.is_pro_only),
    description: row.description || undefined,
    createdAt: row.created_at || undefined,
  };
}

/**
 * Map frontend StudyPDF to Supabase public.study_pdfs column format
 */
export function mapPdfToDb(p: Partial<StudyPDF>): Record<string, any> {
  const payload: Record<string, any> = {
    title: p.title,
    subject: p.subject,
    exam_category: p.examCategory,
    chapter: p.chapter,
    level_or_year: p.levelOrYear || 'Level 1',
    file_url: p.fileUrl || '',
    page_count: p.pageCount || 1,
    is_pro_only: Boolean(p.isProOnly),
  };

  if (p.id && !p.id.startsWith('pdf-phy-') && !p.id.startsWith('pdf-math-') && !p.id.startsWith('pdf-chem-') && !p.id.startsWith('pdf-temp-')) {
    payload.id = p.id;
  }
  if (p.fileSizeBytes) payload.file_size_bytes = p.fileSizeBytes;
  if (p.previewUrl) payload.preview_url = p.previewUrl;
  if (p.description) payload.description = p.description;

  return payload;
}

/**
 * Upload PDF to Supabase Storage Bucket ('jeevault-pdfs')
 * Returns public URL if successful, or null if storage is not available.
 */
export async function uploadPdfToSupabase(file: File): Promise<string | null> {
  const supabase = getSupabase();
  if (!supabase) return null;

  try {
    const cleanFileName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
    const storagePath = `pdfs/${Date.now()}_${cleanFileName}`;

    const { data, error } = await supabase.storage
      .from('jeevault-pdfs')
      .upload(storagePath, file, {
        cacheControl: '3600',
        upsert: false,
        contentType: 'application/pdf',
      });

    if (error) {
      console.warn('Supabase storage upload returned error:', error.message);
      return null;
    }

    const { data: publicUrlData } = supabase.storage
      .from('jeevault-pdfs')
      .getPublicUrl(data.path);

    return publicUrlData.publicUrl;
  } catch (err) {
    console.warn('Exception while uploading to Supabase storage:', err);
    return null;
  }
}

/**
 * Fetch bookmarked question IDs for a specific user from Supabase public.bookmarks
 */
export async function fetchUserBookmarks(userId: string): Promise<string[]> {
  const supabase = getSupabase();
  if (!supabase || !userId) return [];

  try {
    const { data, error } = await supabase
      .from('bookmarks')
      .select('question_id')
      .eq('user_id', userId);

    if (error) {
      console.warn('Failed to fetch user bookmarks from Supabase:', error.message);
      return [];
    }

    return (data || []).map((row: any) => row.question_id);
  } catch (err) {
    console.warn('Exception fetching bookmarks from Supabase:', err);
    return [];
  }
}

/**
 * Save a question bookmark for a specific user to Supabase
 */
export async function saveUserBookmark(userId: string, questionId: string): Promise<boolean> {
  const supabase = getSupabase();
  if (!supabase || !userId || !questionId) return false;

  try {
    const { error } = await supabase
      .from('bookmarks')
      .upsert(
        { user_id: userId, question_id: questionId },
        { onConflict: 'user_id,question_id' }
      );

    if (error) {
      console.warn('Failed to insert bookmark into Supabase:', error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.warn('Exception saving bookmark to Supabase:', err);
    return false;
  }
}

/**
 * Remove a question bookmark for a specific user from Supabase
 */
export async function deleteUserBookmark(userId: string, questionId: string): Promise<boolean> {
  const supabase = getSupabase();
  if (!supabase || !userId || !questionId) return false;

  try {
    const { error } = await supabase
      .from('bookmarks')
      .delete()
      .eq('user_id', userId)
      .eq('question_id', questionId);

    if (error) {
      console.warn('Failed to delete bookmark from Supabase:', error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.warn('Exception deleting bookmark from Supabase:', err);
    return false;
  }
}
