import { Question, StudyPDF, UserProfile, ChapterInfo, SupportTicket } from '../types';

export const ADMIN_USER: UserProfile = {
  id: 'usr-admin-master',
  email: 'imtiazahmed12408@gmail.com',
  name: 'Imtiaz Ahmed (Owner)',
  avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
  standard: 'Dropper',
  institution: 'JEEVault HQ',
  targetYear: 'Admin Master',
  plan: 'Standard Pro',
  role: 'admin',
  createdAt: '2025-01-01T00:00:00Z',
};

export const CHAPTERS_DATA: Record<'Physics' | 'Mathematics' | 'Chemistry', ChapterInfo[]> = {
  Physics: [
    { id: 'phy-1', name: 'Kinematics & Motion in 1D/2D', subject: 'Physics', totalQuestions: 0, pyqCount: 0, special50Count: 0 },
    { id: 'phy-2', name: "Newton's Laws of Motion and Friction", subject: 'Physics', totalQuestions: 37, pyqCount: 0, special50Count: 0 },
    { id: 'phy-3', name: 'Work, Energy and Power', subject: 'Physics', totalQuestions: 0, pyqCount: 0, special50Count: 0 },
    { id: 'phy-4', name: 'Rotational Dynamics & COM', subject: 'Physics', totalQuestions: 0, pyqCount: 0, special50Count: 0 },
    { id: 'phy-5', name: 'Electrostatics & Electric Field', subject: 'Physics', totalQuestions: 0, pyqCount: 0, special50Count: 0 },
    { id: 'phy-6', name: 'Current Electricity & Circuits', subject: 'Physics', totalQuestions: 0, pyqCount: 0, special50Count: 0 },
    { id: 'phy-7', name: 'Thermodynamics & Kinetic Theory', subject: 'Physics', totalQuestions: 0, pyqCount: 0, special50Count: 0 },
    { id: 'phy-8', name: 'Ray & Wave Optics', subject: 'Physics', totalQuestions: 0, pyqCount: 0, special50Count: 0 },
  ],
  Mathematics: [
    { id: 'math-1', name: 'Definite & Indefinite Integration', subject: 'Mathematics', totalQuestions: 0, pyqCount: 0, special50Count: 0 },
    { id: 'math-2', name: 'Coordinate Geometry & Conic Sections', subject: 'Mathematics', totalQuestions: 0, pyqCount: 0, special50Count: 0 },
    { id: 'math-3', name: 'Vectors and 3D Geometry', subject: 'Mathematics', totalQuestions: 0, pyqCount: 0, special50Count: 0 },
    { id: 'math-4', name: 'Matrices and Determinants', subject: 'Mathematics', totalQuestions: 0, pyqCount: 0, special50Count: 0 },
    { id: 'math-5', name: 'Functions, Limits & Continuity', subject: 'Mathematics', totalQuestions: 0, pyqCount: 0, special50Count: 0 },
    { id: 'math-6', name: 'Complex Numbers & Quadratic Eq', subject: 'Mathematics', totalQuestions: 0, pyqCount: 0, special50Count: 0 },
    { id: 'math-7', name: 'Permutations, Combinations & Probability', subject: 'Mathematics', totalQuestions: 0, pyqCount: 0, special50Count: 0 },
  ],
  Chemistry: [
    { id: 'chem-1', name: 'Chemical Bonding & Molecular Structure', subject: 'Chemistry', totalQuestions: 0, pyqCount: 0, special50Count: 0 },
    { id: 'chem-2', name: 'Thermodynamics & Chemical Energetics', subject: 'Chemistry', totalQuestions: 0, pyqCount: 0, special50Count: 0 },
    { id: 'chem-3', name: 'Chemical & Ionic Equilibrium', subject: 'Chemistry', totalQuestions: 0, pyqCount: 0, special50Count: 0 },
    { id: 'chem-4', name: 'General Organic Chemistry (GOC)', subject: 'Chemistry', totalQuestions: 0, pyqCount: 0, special50Count: 0 },
    { id: 'chem-5', name: 'Coordination Compounds & d-Block', subject: 'Chemistry', totalQuestions: 0, pyqCount: 0, special50Count: 0 },
    { id: 'chem-6', name: 'Aldehydes, Ketones & Carboxylic Acids', subject: 'Chemistry', totalQuestions: 0, pyqCount: 0, special50Count: 0 },
    { id: 'chem-7', name: 'Electrochemistry & Solutions', subject: 'Chemistry', totalQuestions: 0, pyqCount: 0, special50Count: 0 },
  ],
};

// No hardcoded mock questions - questions are loaded dynamically from production Supabase database
export const INITIAL_QUESTIONS: Question[] = [];

// All pre-seeded mock study PDFs removed. PDFs are populated exclusively by Admin upload/Supabase.
export const INITIAL_PDFS: StudyPDF[] = [];

// Support tickets initialized cleanly
export const INITIAL_SUPPORT_TICKETS: SupportTicket[] = [];
