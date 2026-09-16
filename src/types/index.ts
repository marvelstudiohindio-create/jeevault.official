export type SubjectId = 'Physics' | 'Mathematics' | 'Chemistry';

export type ExamCategory = 'JEE Mains' | 'JEE Advanced' | 'PYQ';

export type QuestionLevel = 'Level 1' | 'Level 2' | 'Level 3' | 'JEEVault 50 Special';

export type Difficulty = 'Basic' | 'Standard' | 'Advanced';

export type UserPlan = 'Free' | 'Standard' | 'Standard Pro';

export type UserRole = 'student' | 'admin';

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  avatarUrl?: string;
  standard: '11' | '12' | 'Dropper';
  institution: string;
  targetYear: string;
  plan: UserPlan;
  role: UserRole;
  createdAt: string;
}

export interface QuestionOption {
  id: string; // 'A' | 'B' | 'C' | 'D'
  text: string;
}

export type QuestionType =
  | 'Single Correct'
  | 'Multiple Correct'
  | 'Integer Type'
  | 'Comprehension'
  | 'Numerical';

export interface Question {
  id: string;
  subject: SubjectId;
  examCategory: ExamCategory;
  chapter: string;
  level: QuestionLevel;
  pyqYear?: number;
  pyqSession?: string;
  questionNumber: number;
  difficulty: Difficulty;
  questionType?: QuestionType;
  paragraphText?: string;
  questionText: string;
  questionImages?: string[];
  imageUrl?: string;
  options: string[]; // Options list (empty for integer/numerical type)
  correctOptionIndex: number; // 0, 1, 2, 3 (for single correct)
  correctOptionIndices?: number[]; // [0, 2] for multiple correct
  correctIntegerAnswer?: number; // Integer answer (e.g. 5, 8, 3, 1)
  solutionText: string;
  solutionImages?: string[];
  keyFormula?: string;
  createdAt?: string;
}

export interface QuestionAttempt {
  id: string;
  userId: string;
  questionId: string;
  selectedOption: number; // 0..3
  isCorrect: boolean;
  timeSpentSeconds: number;
  attemptedAt: string;
}

export interface StudyPDF {
  id: string;
  title: string;
  subject: SubjectId;
  examCategory: ExamCategory;
  chapter: string;
  levelOrYear?: string;
  fileUrl?: string;
  previewUrl?: string;
  pageCount: number;
  fileSizeBytes?: number;
  isProOnly?: boolean;
  description?: string;
  createdAt?: string;
}

export type PdfItem = StudyPDF;

export interface SupportTicket {
  id: string;
  userId?: string;
  userEmail: string;
  userName: string;
  subject: string;
  message: string;
  status: 'Pending' | 'In Review' | 'Resolved';
  createdAt: string;
  adminReply?: string;
}

export interface ChapterInfo {
  id: string;
  name: string;
  subject: SubjectId;
  totalQuestions: number;
  pyqCount: number;
  special50Count: number;
  order?: number;
  classLevel?: string;
  description?: string;
}
