import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  UserProfile,
  SubjectId,
  ExamCategory,
  QuestionLevel,
  Question,
  StudyPDF,
  SupportTicket,
  QuestionAttempt,
  UserPlan,
  ChapterInfo,
} from '../types';
import {
  ADMIN_USER,
  INITIAL_QUESTIONS,
  INITIAL_PDFS,
  INITIAL_SUPPORT_TICKETS,
  CHAPTERS_DATA,
} from '../lib/mockData';
import {
  getSupabase,
  getSupabaseConfig,
  saveSupabaseConfig,
  formatUserProfile,
  mapDbProfileToUser,
  mapDbQuestionToQuestion,
  mapQuestionToDb,
  mapDbPdfToPdf,
  mapPdfToDb,
  fetchUserBookmarks,
  saveUserBookmark,
  deleteUserBookmark,
} from '../lib/supabase';

export type AppView =
  | 'landing'
  | 'home'
  | 'subject'
  | 'pyq-select'
  | 'chapters'
  | 'levels'
  | 'attempt'
  | 'progress'
  | 'profile'
  | 'bookmarks'
  | 'settings'
  | 'admin';

interface ActionPopupState {
  isOpen: boolean;
  subject: SubjectId;
  category: ExamCategory;
  chapter: string;
  level?: QuestionLevel;
  isPyq: boolean;
}

interface AppContextType {
  // Navigation
  currentView: AppView;
  setCurrentView: (view: AppView) => void;
  activeSubject: SubjectId;
  setActiveSubject: (subject: SubjectId) => void;
  activeCategory: ExamCategory;
  setActiveCategory: (cat: ExamCategory) => void;
  activeChapter: string;
  setActiveChapter: (ch: string) => void;
  activeLevel: QuestionLevel;
  setActiveLevel: (lvl: QuestionLevel) => void;
  activePyqExam: 'JEE Mains' | 'JEE Advanced';
  setActivePyqExam: (exam: 'JEE Mains' | 'JEE Advanced') => void;

  // Modals & Action Popups
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (open: boolean) => void;
  authMode: 'login' | 'signup';
  setAuthMode: (mode: 'login' | 'signup') => void;
  actionPopup: ActionPopupState | null;
  openActionPopup: (params: Omit<ActionPopupState, 'isOpen'>) => void;
  closeActionPopup: () => void;
  activePdf: StudyPDF | null;
  setActivePdf: (pdf: StudyPDF | null) => void;

  // User & Auth
  currentUser: UserProfile | null;
  isLoggedIn: boolean;
  loginAsDemoStudent: () => void;
  loginAsDemoAdmin: () => void;
  loginWithEmail: (
    email: string,
    password?: string,
    name?: string,
    isSignUp?: boolean
  ) => Promise<{ success: boolean; error?: string }>;
  loginWithGoogle: () => Promise<{ success: boolean; error?: string }>;
  resetPassword: (email: string) => Promise<{ success: boolean; message?: string; error?: string }>;
  logout: () => void;
  updateProfile: (updates: Partial<UserProfile>) => void;
  changeUserPlan: (newPlan: UserPlan) => void;
  upgradePlan: (plan: 'Standard' | 'Standard Pro') => void;

  // Chapters
  chapters: Record<SubjectId, ChapterInfo[]>;
  addChapter: (
    subject: SubjectId,
    name: string,
    options?: { position?: number; classLevel?: string; description?: string }
  ) => void;
  deleteChapter: (subject: SubjectId, chapterId: string) => void;
  reorderChapter: (subject: SubjectId, chapterId: string, direction: 'up' | 'down') => void;

  // Questions
  questions: Question[];
  addQuestion: (q: Omit<Question, 'id'>) => void;
  updateQuestion: (id: string, updates: Partial<Question>) => void;
  deleteQuestion: (id: string) => void;
  updateQuestionLocation: (id: string, subject: SubjectId, chapter: string, level: QuestionLevel) => void;

  // Study PDFs
  pdfs: StudyPDF[];
  addPdf: (p: Omit<StudyPDF, 'id' | 'createdAt'>) => void;
  updatePdf: (id: string, updates: Partial<StudyPDF>) => void;
  deletePdf: (id: string) => void;

  // Practice & Attempts
  attempts: QuestionAttempt[];
  recordAttempt: (qId: string, selectedOption: number, isCorrect: boolean, timeSpent: number) => void;
  bookmarkedQuestionIds: string[];
  toggleBookmark: (qId: string) => void;

  // Support Tickets
  supportTickets: SupportTicket[];
  addSupportTicket: (subject: string, message: string) => void;
  submitSupportTicket: (subject: string, message: string) => void;
  updateTicketStatus: (id: string, status: SupportTicket['status'], adminReply?: string) => void;

  // Users Management (Admin)
  allUsers: UserProfile[];
  refreshGenuineUsers: () => Promise<void>;
  isSyncingWithSupabase: boolean;
  updateUserRoleAndPlan: (userId: string, role: 'student' | 'admin', plan: UserPlan) => void;
  updateUserPlan: (userId: string, plan: UserPlan) => void;

  // Test Attempt Session
  activeAttemptSession: {
    questions: Question[];
    title: string;
  } | null;
  startPracticeSession: (questions: Question[], title: string) => void;
  endPracticeSession: () => void;

  // Supabase status & controls
  isSupabaseConfigured: boolean;
  supabaseUrl: string;
  saveSupabaseSettings: (url: string, key: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY_USER = 'jeevault_user_profile';
const LOCAL_STORAGE_KEY_CHAPTERS = 'jeevault_chapters_cache_v2';
const LOCAL_STORAGE_KEY_QUESTIONS = 'jeevault_questions_cache';
const LOCAL_STORAGE_KEY_PDFS = 'jeevault_pdfs_cache';
const LOCAL_STORAGE_KEY_ATTEMPTS = 'jeevault_attempts_cache';
const LOCAL_STORAGE_KEY_BOOKMARKS = 'jeevault_bookmarks_cache';
const LOCAL_STORAGE_KEY_USER_BOOKMARKS = 'jeevault_user_bookmarks_by_user_id';
const LOCAL_STORAGE_KEY_TICKETS = 'jeevault_tickets_cache';
const LOCAL_STORAGE_KEY_USERS = 'jeevault_users_cache';

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Navigation State: automatically route logged-in students/admins to dashboard
  const [currentView, setCurrentView] = useState<AppView>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY_USER);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.email) {
          return parsed.role === 'admin' ? 'admin' : 'home';
        }
      } catch (e) {
        console.error('Failed to parse saved user for initial view:', e);
      }
    }
    return 'landing';
  });
  const [activeSubject, setActiveSubject] = useState<SubjectId>('Physics');
  const [activeCategory, setActiveCategory] = useState<ExamCategory>('JEE Mains');
  const [activeChapter, setActiveChapter] = useState<string>('Kinematics & Motion in 1D/2D');
  const [activeLevel, setActiveLevel] = useState<QuestionLevel>('Level 1');
  const [activePyqExam, setActivePyqExam] = useState<'JEE Mains' | 'JEE Advanced'>('JEE Mains');

  // Modals
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const [actionPopup, setActionPopup] = useState<ActionPopupState | null>(null);
  const [activePdf, setActivePdf] = useState<StudyPDF | null>(null);

  // User & Auth State
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY_USER);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return null; // Start at landing page
  });

  // All Users (Strictly genuine users only - all fake mock accounts removed)
  const [allUsers, setAllUsers] = useState<UserProfile[]>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY_USERS);
    if (saved) {
      try {
        const parsed: UserProfile[] = JSON.parse(saved);
        return parsed.filter(
          (u) =>
            u.id !== 'usr-aarav-sharma-2026' &&
            u.id !== 'usr-riya-patel' &&
            u.id !== 'usr-rohit-verma' &&
            !u.email.includes('@allen.ac.in') &&
            !u.email.includes('@physicswallah.com') &&
            !u.email.includes('aarav.sharma')
        );
      } catch (e) {
        console.error(e);
      }
    }
    return [];
  });

  const [isSyncingWithSupabase, setIsSyncingWithSupabase] = useState<boolean>(false);

  // Chapters State - Dynamic syllabus with custom placement and admin additions
  const [chapters, setChapters] = useState<Record<SubjectId, ChapterInfo[]>>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY_CHAPTERS);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (
          parsed &&
          typeof parsed === 'object' &&
          parsed.Physics &&
          parsed.Mathematics &&
          parsed.Chemistry
        ) {
          return parsed;
        }
      } catch (e) {
        console.error('Failed to parse saved chapters:', e);
      }
    }
    return CHAPTERS_DATA;
  });

  // Questions State - Only genuine questions uploaded by Admin / Supabase
  const [questions, setQuestions] = useState<Question[]>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY_QUESTIONS);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          const genuine = parsed.filter(
            (q: Question) =>
              !q.id?.startsWith('q-phy-') &&
              !q.id?.startsWith('q-math-') &&
              !q.id?.startsWith('q-chem-')
          );
          return genuine;
        }
      } catch (e) {
        console.error(e);
      }
    }
    return INITIAL_QUESTIONS;
  });

  // PDFs State - Only genuine study PDFs uploaded by Admin / Supabase
  const [pdfs, setPdfs] = useState<StudyPDF[]>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY_PDFS);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          const genuine = parsed.filter(
            (p: StudyPDF) =>
              !p.id?.startsWith('pdf-phy-') &&
              !p.id?.startsWith('pdf-math-') &&
              !p.id?.startsWith('pdf-chem-')
          );
          return genuine;
        }
      } catch (e) {
        console.error(e);
      }
    }
    return INITIAL_PDFS;
  });

  // Question Attempts - Clean initial state
  const [attempts, setAttempts] = useState<QuestionAttempt[]>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY_ATTEMPTS);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          return parsed;
        }
      } catch (e) {
        console.error(e);
      }
    }
    return [];
  });

  // Bookmarks - Clean initial state isolated per user
  const [bookmarkedQuestionIds, setBookmarkedQuestionIds] = useState<string[]>(() => {
    try {
      const savedUser = localStorage.getItem(LOCAL_STORAGE_KEY_USER);
      const initialUserId = savedUser ? JSON.parse(savedUser)?.id || 'guest' : 'guest';
      const rawUserMap = localStorage.getItem(LOCAL_STORAGE_KEY_USER_BOOKMARKS);
      if (rawUserMap) {
        const userMap = JSON.parse(rawUserMap);
        if (Array.isArray(userMap[initialUserId])) {
          return userMap[initialUserId];
        }
      }
      // Fallback for previous legacy cache
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY_BOOKMARKS);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          return parsed.filter(
            (id: string) =>
              !id?.startsWith('q-phy-') &&
              !id?.startsWith('q-math-') &&
              !id?.startsWith('q-chem-')
          );
        }
      }
    } catch (e) {
      console.error('Failed to initialize bookmarks:', e);
    }
    return [];
  });

  // Support Tickets - Clean initial state
  const [supportTickets, setSupportTickets] = useState<SupportTicket[]>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY_TICKETS);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      } catch (e) {
        console.error(e);
      }
    }
    return INITIAL_SUPPORT_TICKETS;
  });

  // Supabase Configuration State
  const [isSupabaseConfigured, setIsSupabaseConfigured] = useState<boolean>(
    () => getSupabaseConfig().isConfigured
  );
  const [supabaseUrl, setSupabaseUrl] = useState<string>(
    () => getSupabaseConfig().url
  );

  const saveSupabaseSettings = (url: string, key: string) => {
    saveSupabaseConfig(url, key);
    const cfg = getSupabaseConfig();
    setIsSupabaseConfigured(cfg.isConfigured);
    setSupabaseUrl(cfg.url);
  };

  // Active Practice Attempt Session
  const [activeAttemptSession, setActiveAttemptSession] = useState<{
    questions: Question[];
    title: string;
  } | null>(null);

  // Sync Supabase Auth Session, Questions, Study PDFs, and Genuine Profiles + Realtime Live Updates
  useEffect(() => {
    const supabase = getSupabase();
    if (!supabase) return;

    setIsSyncingWithSupabase(true);

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        const profile = formatUserProfile(session.user);
        setCurrentUser(profile);
        setCurrentView((prev) => (prev === 'landing' ? (profile.role === 'admin' ? 'admin' : 'home') : prev));
      }
    });

    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if ((event === 'SIGNED_IN' || event === 'USER_UPDATED') && session?.user) {
          let dbProf = null;
          try {
            const { data } = await supabase
              .from('profiles')
              .select('*')
              .eq('id', session.user.id)
              .maybeSingle();
            if (data) dbProf = data;
          } catch (e) {
            console.warn('Could not fetch public.profiles:', e);
          }
          const profile = formatUserProfile(session.user, dbProf);
          setCurrentUser(profile);
          setAllUsers((prev) => [profile, ...prev.filter((u) => u.id !== profile.id)]);
          setCurrentView((prev) => (prev === 'landing' ? (profile.role === 'admin' ? 'admin' : 'home') : prev));
        } else if (event === 'SIGNED_OUT') {
          setCurrentUser(null);
          localStorage.removeItem(LOCAL_STORAGE_KEY_USER);
          setCurrentView('landing');
        }
      }
    );

    // 1. Fetch Genuine Users from Supabase profiles table
    const fetchGenuineProfiles = async () => {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .order('created_at', { ascending: false });
        if (!error && data && data.length > 0) {
          const genuineList = data.map(mapDbProfileToUser);
          setAllUsers(genuineList);
        }
      } catch (e) {
        console.warn('Error fetching genuine profiles:', e);
      }
    };

    // 2. Fetch Questions from Supabase
    const fetchQuestions = async () => {
      try {
        const { data, error } = await supabase
          .from('questions')
          .select('*')
          .order('created_at', { ascending: false });
        if (!error && data) {
          const dbQs = data.map(mapDbQuestionToQuestion);
          setQuestions(dbQs);
        }
      } catch (e) {
        console.warn('Error fetching questions from Supabase:', e);
      }
    };

    // 3. Fetch PDFs from Supabase
    const fetchPdfs = async () => {
      try {
        const { data, error } = await supabase
          .from('study_pdfs')
          .select('*')
          .order('created_at', { ascending: false });
        if (!error && data) {
          const dbPdfs = data.map(mapDbPdfToPdf);
          setPdfs(dbPdfs);
        }
      } catch (e) {
        console.warn('Error fetching study_pdfs from Supabase:', e);
      } finally {
        setIsSyncingWithSupabase(false);
      }
    };

    fetchGenuineProfiles();
    fetchQuestions();
    fetchPdfs();

    // 4. Supabase Realtime Channels for live web updates
    const liveChannel = supabase
      .channel('jeevault-live-sync')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'questions' },
        (payload) => {
          if (payload.eventType === 'INSERT' && payload.new) {
            const newQ = mapDbQuestionToQuestion(payload.new);
            setQuestions((prev) => {
              if (prev.some((q) => q.id === newQ.id)) return prev;
              return [newQ, ...prev];
            });
          } else if (payload.eventType === 'UPDATE' && payload.new) {
            const updatedQ = mapDbQuestionToQuestion(payload.new);
            setQuestions((prev) => prev.map((q) => (q.id === updatedQ.id ? updatedQ : q)));
          } else if (payload.eventType === 'DELETE' && payload.old) {
            const delId = (payload.old as any).id;
            if (delId) {
              setQuestions((prev) => prev.filter((q) => q.id !== delId));
            }
          }
        }
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'study_pdfs' },
        (payload) => {
          if (payload.eventType === 'INSERT' && payload.new) {
            const newPdf = mapDbPdfToPdf(payload.new);
            setPdfs((prev) => {
              if (prev.some((p) => p.id === newPdf.id)) return prev;
              return [newPdf, ...prev];
            });
          } else if (payload.eventType === 'UPDATE' && payload.new) {
            const updatedPdf = mapDbPdfToPdf(payload.new);
            setPdfs((prev) => prev.map((p) => (p.id === updatedPdf.id ? updatedPdf : p)));
          } else if (payload.eventType === 'DELETE' && payload.old) {
            const delId = (payload.old as any).id;
            if (delId) {
              setPdfs((prev) => prev.filter((p) => p.id !== delId));
            }
          }
        }
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'profiles' },
        (payload) => {
          if (payload.eventType === 'INSERT' && payload.new) {
            const newU = mapDbProfileToUser(payload.new);
            setAllUsers((prev) => [newU, ...prev.filter((u) => u.id !== newU.id)]);
          } else if (payload.eventType === 'UPDATE' && payload.new) {
            const updatedU = mapDbProfileToUser(payload.new);
            setAllUsers((prev) => prev.map((u) => (u.id === updatedU.id ? updatedU : u)));
            if (currentUser && currentUser.id === updatedU.id) {
              setCurrentUser(updatedU);
            }
          } else if (payload.eventType === 'DELETE' && payload.old) {
            const delId = (payload.old as any).id;
            if (delId) {
              setAllUsers((prev) => prev.filter((u) => u.id !== delId));
            }
          }
        }
      )
      .subscribe();

    return () => {
      authListener?.subscription?.unsubscribe();
      supabase.removeChannel(liveChannel);
    };
  }, [isSupabaseConfigured]);

  // Sync to local storage
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem(LOCAL_STORAGE_KEY_USER, JSON.stringify(currentUser));
    } else {
      localStorage.removeItem(LOCAL_STORAGE_KEY_USER);
    }
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY_CHAPTERS, JSON.stringify(chapters));
  }, [chapters]);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY_QUESTIONS, JSON.stringify(questions));
  }, [questions]);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY_PDFS, JSON.stringify(pdfs));
  }, [pdfs]);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY_ATTEMPTS, JSON.stringify(attempts));
  }, [attempts]);

  // Synchronize and load bookmarks per user
  useEffect(() => {
    const userId = currentUser?.id || 'guest';
    let userBookmarks: string[] = [];
    try {
      const rawUserMap = localStorage.getItem(LOCAL_STORAGE_KEY_USER_BOOKMARKS);
      if (rawUserMap) {
        const userMap = JSON.parse(rawUserMap);
        if (Array.isArray(userMap[userId])) {
          userBookmarks = userMap[userId];
        }
      }
    } catch (e) {
      console.error('Failed to parse user bookmarks:', e);
    }
    setBookmarkedQuestionIds(userBookmarks);

    // If Supabase is connected and user is logged in, sync from database
    if (currentUser?.id && isSupabaseConfigured) {
      fetchUserBookmarks(currentUser.id).then((dbList) => {
        if (Array.isArray(dbList) && dbList.length > 0) {
          setBookmarkedQuestionIds((prev) => Array.from(new Set([...prev, ...dbList])));
        }
      }).catch((err) => {
        console.warn('Could not sync user bookmarks from database:', err);
      });
    }
  }, [currentUser?.id, isSupabaseConfigured]);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY_BOOKMARKS, JSON.stringify(bookmarkedQuestionIds));
    const userId = currentUser?.id || 'guest';
    try {
      const rawMap = localStorage.getItem(LOCAL_STORAGE_KEY_USER_BOOKMARKS);
      const map: Record<string, string[]> = rawMap ? JSON.parse(rawMap) : {};
      map[userId] = bookmarkedQuestionIds;
      localStorage.setItem(LOCAL_STORAGE_KEY_USER_BOOKMARKS, JSON.stringify(map));
    } catch (e) {
      console.error('Failed to cache user bookmark map:', e);
    }
  }, [bookmarkedQuestionIds, currentUser?.id]);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY_TICKETS, JSON.stringify(supportTickets));
  }, [supportTickets]);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY_USERS, JSON.stringify(allUsers));
  }, [allUsers]);

  // Auth actions
  const loginAsDemoStudent = () => {
    const studentUser: UserProfile = {
      id: 'usr-student-session',
      email: 'student@jeevault.in',
      name: 'JEE Aspirant',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
      standard: '12',
      institution: 'Self Study',
      targetYear: 'JEE 2026',
      plan: 'Free',
      role: 'student',
      createdAt: new Date().toISOString(),
    };
    setCurrentUser(studentUser);
    setAllUsers((prev) => [studentUser, ...prev.filter((u) => u.id !== studentUser.id)]);
    setIsAuthModalOpen(false);
    setCurrentView('home');
  };

  const loginAsDemoAdmin = () => {
    setCurrentUser(ADMIN_USER);
    setAllUsers((prev) => [ADMIN_USER, ...prev.filter((u) => u.id !== ADMIN_USER.id)]);
    setIsAuthModalOpen(false);
    setCurrentView('admin');
  };

  const refreshGenuineUsers = async () => {
    const supabase = getSupabase();
    if (!supabase) {
      if (currentUser) {
        setAllUsers([currentUser]);
      } else {
        setAllUsers([]);
      }
      return;
    }
    try {
      setIsSyncingWithSupabase(true);
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });
      if (!error && data) {
        setAllUsers(data.map(mapDbProfileToUser));
      }
    } catch (e) {
      console.warn('Error refreshing genuine users:', e);
    } finally {
      setIsSyncingWithSupabase(false);
    }
  };

  const loginWithEmail = async (
    email: string,
    password?: string,
    name?: string,
    isSignUp?: boolean
  ): Promise<{ success: boolean; error?: string }> => {
    const cleanEmail = email.trim();
    const isAdminEmail =
      cleanEmail.toLowerCase().includes('admin') ||
      cleanEmail.toLowerCase() === 'imtiazahmed12408@gmail.com';

    const supabase = getSupabase();

    // 1. If Supabase is connected with credentials, use Supabase Auth
    if (supabase) {
      try {
        if (isSignUp) {
          const { data, error } = await supabase.auth.signUp({
            email: cleanEmail,
            password: password || 'Password123!',
            options: {
              data: {
                full_name: name || (isAdminEmail ? 'Admin' : 'JEE Aspirant'),
                name: name || (isAdminEmail ? 'Admin' : 'JEE Aspirant'),
              },
            },
          });

          if (error) {
            return { success: false, error: error.message };
          }

          if (data.user && !data.session) {
            return {
              success: true,
              error:
                'Confirmation email sent! Please check your inbox, or disable email confirmation in your Supabase Auth dashboard to login directly.',
            };
          }

          if (data.user) {
            const profile = formatUserProfile(data.user);
            setCurrentUser(profile);
            setAllUsers((prev) => [
              profile,
              ...prev.filter((u) => u.email.toLowerCase() !== profile.email.toLowerCase()),
            ]);
            setIsAuthModalOpen(false);
            setCurrentView(profile.role === 'admin' ? 'admin' : 'home');
            return { success: true };
          }
        } else {
          // Normal Sign In
          const { data, error } = await supabase.auth.signInWithPassword({
            email: cleanEmail,
            password: password || 'Password123!',
          });

          if (error) {
            return { success: false, error: error.message };
          }

          if (data.user) {
            let dbProf = null;
            try {
              const { data: profData } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', data.user.id)
                .maybeSingle();
              if (profData) dbProf = profData;
            } catch (e) {}

            const profile = formatUserProfile(data.user, dbProf);
            setCurrentUser(profile);
            setAllUsers((prev) => [
              profile,
              ...prev.filter((u) => u.email.toLowerCase() !== profile.email.toLowerCase()),
            ]);
            setIsAuthModalOpen(false);
            setCurrentView(profile.role === 'admin' ? 'admin' : 'home');
            return { success: true };
          }
        }
      } catch (err: any) {
        return { success: false, error: err.message || 'Supabase authentication failed' };
      }
    }

    // 2. Seamless local authentication (when Supabase URL/key has not yet been connected)
    const newUser: UserProfile = {
      id: `usr-${Date.now()}`,
      email: cleanEmail,
      name: name || (isAdminEmail ? 'Admin' : 'JEE Aspirant'),
      standard: '12',
      institution: 'Self Study',
      targetYear: 'JEE 2026',
      plan: isAdminEmail ? 'Standard Pro' : 'Free',
      role: isAdminEmail ? 'admin' : 'student',
      createdAt: new Date().toISOString(),
    };

    setCurrentUser(newUser);
    setAllUsers((prev) => {
      const exists = prev.find((u) => u.email.toLowerCase() === cleanEmail.toLowerCase());
      if (exists) return prev;
      return [newUser, ...prev];
    });
    setIsAuthModalOpen(false);
    setCurrentView(isAdminEmail ? 'admin' : 'home');
    return { success: true };
  };

  const loginWithGoogle = async (): Promise<{ success: boolean; error?: string }> => {
    const supabase = getSupabase();
    if (supabase) {
      try {
        const { error } = await supabase.auth.signInWithOAuth({
          provider: 'google',
          options: {
            redirectTo: window.location.origin,
          },
        });
        if (error) {
          return { success: false, error: error.message };
        }
        return { success: true };
      } catch (err: any) {
        return { success: false, error: err.message || 'Google Auth encountered an error' };
      }
    }

    // Seamless instant Google simulation when Supabase credentials are pending
    return loginWithEmail('student.google@gmail.com', undefined, 'Google Aspirant', false);
  };

  const resetPassword = async (
    email: string
  ): Promise<{ success: boolean; message?: string; error?: string }> => {
    const cleanEmail = email.trim();
    if (!cleanEmail) {
      return { success: false, error: 'Please enter your email address.' };
    }
    const supabase = getSupabase();
    if (supabase) {
      try {
        const { error } = await supabase.auth.resetPasswordForEmail(cleanEmail, {
          redirectTo: `${window.location.origin}/`,
        });
        if (error) {
          return { success: false, error: error.message };
        }
        return {
          success: true,
          message: 'Password reset link sent! Please check your inbox.',
        };
      } catch (err: any) {
        return { success: false, error: err.message || 'Failed to send reset link.' };
      }
    }
    return {
      success: true,
      message: 'Password reset instructions sent to your email address.',
    };
  };

  const logout = async () => {
    const supabase = getSupabase();
    if (supabase) {
      try {
        await supabase.auth.signOut();
      } catch (e) {
        console.warn('Supabase sign out notice:', e);
      }
    }
    setCurrentUser(null);
    localStorage.removeItem(LOCAL_STORAGE_KEY_USER);
    setCurrentView('landing');
  };

  const updateProfile = (updates: Partial<UserProfile>) => {
    if (!currentUser) return;
    const updated = { ...currentUser, ...updates };
    setCurrentUser(updated);
    setAllUsers((prev) => prev.map((u) => (u.id === updated.id ? updated : u)));
  };

  const changeUserPlan = (newPlan: UserPlan) => {
    if (!currentUser) return;
    updateProfile({ plan: newPlan });
  };

  const upgradePlan = (plan: 'Standard' | 'Standard Pro') => {
    if (!currentUser) return;
    changeUserPlan(plan);
  };

  const updateUserRoleAndPlan = async (userId: string, role: 'student' | 'admin', plan: UserPlan) => {
    setAllUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, role, plan } : u))
    );
    if (currentUser && currentUser.id === userId) {
      setCurrentUser((prev) => (prev ? { ...prev, role, plan } : null));
    }

    const supabase = getSupabase();
    if (supabase) {
      try {
        await supabase.from('profiles').update({ role, plan }).eq('id', userId);
      } catch (err) {
        console.warn('Exception updating role and plan in Supabase:', err);
      }
    }
  };

  const updateUserPlan = async (userId: string, plan: UserPlan) => {
    setAllUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, plan } : u))
    );
    if (currentUser && currentUser.id === userId) {
      setCurrentUser((prev) => (prev ? { ...prev, plan } : null));
    }

    const supabase = getSupabase();
    if (supabase) {
      try {
        await supabase.from('profiles').update({ plan }).eq('id', userId);
      } catch (err) {
        console.warn('Exception updating plan in Supabase:', err);
      }
    }
  };

  // Chapter management actions
  const addChapter = (
    subject: SubjectId,
    name: string,
    options?: { position?: number; classLevel?: string; description?: string }
  ) => {
    const trimmed = name.trim();
    if (!trimmed) return;
    const newCh: ChapterInfo = {
      id: `${subject.toLowerCase().slice(0, 4)}-ch-${Date.now()}`,
      name: trimmed,
      subject,
      totalQuestions: 0,
      pyqCount: 0,
      special50Count: 0,
      classLevel: options?.classLevel || 'Class 12',
      description: options?.description || '',
    };

    setChapters((prev) => {
      const currentList = [...(prev[subject] || [])];
      if (options?.position !== undefined && options.position >= 0) {
        const insertIdx = Math.min(options.position, currentList.length);
        currentList.splice(insertIdx, 0, newCh);
      } else {
        currentList.push(newCh);
      }
      return { ...prev, [subject]: currentList };
    });
  };

  const deleteChapter = (subject: SubjectId, chapterId: string) => {
    setChapters((prev) => ({
      ...prev,
      [subject]: (prev[subject] || []).filter((ch) => ch.id !== chapterId),
    }));
  };

  const reorderChapter = (subject: SubjectId, chapterId: string, direction: 'up' | 'down') => {
    setChapters((prev) => {
      const list = [...(prev[subject] || [])];
      const idx = list.findIndex((c) => c.id === chapterId);
      if (idx === -1) return prev;
      const targetIdx = direction === 'up' ? idx - 1 : idx + 1;
      if (targetIdx < 0 || targetIdx >= list.length) return prev;
      const [moved] = list.splice(idx, 1);
      list.splice(targetIdx, 0, moved);
      return { ...prev, [subject]: list };
    });
  };

  // Question actions with optimistic state and live Supabase queries
  const addQuestion = async (qData: Omit<Question, 'id'>) => {
    const tempId = `q-${Date.now()}`;
    const newQ: Question = {
      ...qData,
      id: tempId,
      createdAt: new Date().toISOString(),
    };
    setQuestions((prev) => [newQ, ...prev]);

    const supabase = getSupabase();
    if (supabase) {
      try {
        const payload = mapQuestionToDb(qData);
        const { data, error } = await supabase
          .from('questions')
          .insert(payload)
          .select()
          .single();
        if (!error && data) {
          const persistedQ = mapDbQuestionToQuestion(data);
          setQuestions((prev) => prev.map((q) => (q.id === tempId ? persistedQ : q)));
        } else if (error) {
          console.warn('Supabase question insert warning:', error.message);
        }
      } catch (err) {
        console.warn('Supabase insert question exception:', err);
      }
    }
  };

  const updateQuestion = async (id: string, updates: Partial<Question>) => {
    setQuestions((prev) => prev.map((q) => (q.id === id ? { ...q, ...updates } : q)));

    const supabase = getSupabase();
    if (supabase) {
      try {
        const payload = mapQuestionToDb(updates);
        delete payload.id;
        await supabase.from('questions').update(payload).eq('id', id);
      } catch (err) {
        console.warn('Supabase question update exception:', err);
      }
    }
  };

  const deleteQuestion = async (id: string) => {
    setQuestions((prev) => prev.filter((q) => q.id !== id));

    const supabase = getSupabase();
    if (supabase) {
      try {
        const { error } = await supabase.from('questions').delete().eq('id', id);
        if (error) console.warn('Supabase question delete warning:', error.message);
      } catch (err) {
        console.warn('Supabase question delete exception:', err);
      }
    }
  };

  const updateQuestionLocation = async (
    id: string,
    subject: SubjectId,
    chapter: string,
    level: QuestionLevel
  ) => {
    setQuestions((prev) =>
      prev.map((q) => (q.id === id ? { ...q, subject, chapter, level } : q))
    );

    const supabase = getSupabase();
    if (supabase) {
      try {
        await supabase
          .from('questions')
          .update({ subject, chapter, level })
          .eq('id', id);
      } catch (err) {
        console.warn('Supabase update location exception:', err);
      }
    }
  };

  // PDF actions with optimistic state and live Supabase queries
  const addPdf = async (pData: Omit<StudyPDF, 'id' | 'createdAt'>) => {
    const tempId = `pdf-${Date.now()}`;
    const newPdf: StudyPDF = {
      ...pData,
      id: tempId,
      createdAt: new Date().toISOString(),
    };
    setPdfs((prev) => [newPdf, ...prev]);

    const supabase = getSupabase();
    if (supabase) {
      try {
        const payload = mapPdfToDb(pData);
        const { data, error } = await supabase
          .from('study_pdfs')
          .insert(payload)
          .select()
          .single();
        if (!error && data) {
          const persistedPdf = mapDbPdfToPdf(data);
          setPdfs((prev) => prev.map((p) => (p.id === tempId ? persistedPdf : p)));
        } else if (error) {
          console.warn('Supabase study_pdf insert warning:', error.message);
        }
      } catch (err) {
        console.warn('Supabase study_pdf insert exception:', err);
      }
    }
  };

  const updatePdf = async (id: string, updates: Partial<StudyPDF>) => {
    setPdfs((prev) => prev.map((p) => (p.id === id ? { ...p, ...updates } : p)));

    const supabase = getSupabase();
    if (supabase) {
      try {
        const payload = mapPdfToDb(updates);
        delete payload.id;
        await supabase.from('study_pdfs').update(payload).eq('id', id);
      } catch (err) {
        console.warn('Supabase study_pdf update exception:', err);
      }
    }
  };

  const deletePdf = async (id: string) => {
    setPdfs((prev) => prev.filter((p) => p.id !== id));

    const supabase = getSupabase();
    if (supabase) {
      try {
        const { error } = await supabase.from('study_pdfs').delete().eq('id', id);
        if (error) console.warn('Supabase study_pdf delete warning:', error.message);
      } catch (err) {
        console.warn('Supabase study_pdf delete exception:', err);
      }
    }
  };

  // Attempts & Bookmarks
  const recordAttempt = (qId: string, selectedOption: number, isCorrect: boolean, timeSpent: number) => {
    const userId = currentUser ? currentUser.id : 'guest-student';
    const newAttempt: QuestionAttempt = {
      id: `att-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      userId,
      questionId: qId,
      selectedOption,
      isCorrect,
      timeSpentSeconds: timeSpent,
      attemptedAt: new Date().toISOString(),
    };
    setAttempts((prev) => [newAttempt, ...prev]);
  };

  const toggleBookmark = (qId: string) => {
    const userId = currentUser?.id || 'guest';
    const isCurrentlyBookmarked = bookmarkedQuestionIds.includes(qId);
    const updatedIds = isCurrentlyBookmarked
      ? bookmarkedQuestionIds.filter((id) => id !== qId)
      : [...bookmarkedQuestionIds, qId];

    setBookmarkedQuestionIds(updatedIds);

    // Save user-isolated bookmarks to localStorage
    try {
      const rawMap = localStorage.getItem(LOCAL_STORAGE_KEY_USER_BOOKMARKS);
      const map: Record<string, string[]> = rawMap ? JSON.parse(rawMap) : {};
      map[userId] = updatedIds;
      localStorage.setItem(LOCAL_STORAGE_KEY_USER_BOOKMARKS, JSON.stringify(map));
    } catch (e) {
      console.error('Failed to update user bookmarks in storage:', e);
    }

    // If user is authenticated and Supabase is configured, sync to public.bookmarks table
    if (currentUser?.id && isSupabaseConfigured) {
      if (isCurrentlyBookmarked) {
        deleteUserBookmark(currentUser.id, qId).catch((err) =>
          console.warn('Failed to delete bookmark from Supabase:', err)
        );
      } else {
        saveUserBookmark(currentUser.id, qId).catch((err) =>
          console.warn('Failed to save bookmark to Supabase:', err)
        );
      }
    }
  };

  // Support tickets
  const addSupportTicket = (subject: string, message: string) => {
    const newTicket: SupportTicket = {
      id: `tkt-${Date.now()}`,
      userId: currentUser?.id,
      userEmail: currentUser?.email || 'guest@jeevault.in',
      userName: currentUser?.name || 'Guest Student',
      subject,
      message,
      status: 'Pending',
      createdAt: new Date().toISOString(),
    };
    setSupportTickets((prev) => [newTicket, ...prev]);
  };

  const updateTicketStatus = (id: string, status: SupportTicket['status'], adminReply?: string) => {
    setSupportTickets((prev) =>
      prev.map((t) => (t.id === id ? { ...t, status, adminReply: adminReply || t.adminReply } : t))
    );
  };

  // Practice session launcher
  const startPracticeSession = (sessionQuestions: Question[], title: string) => {
    setActiveAttemptSession({
      questions: sessionQuestions,
      title,
    });
    setCurrentView('attempt');
  };

  const endPracticeSession = () => {
    setActiveAttemptSession(null);
    setCurrentView('home');
  };

  // Action Popup
  const openActionPopup = (params: Omit<ActionPopupState, 'isOpen'>) => {
    setActionPopup({ ...params, isOpen: true });
  };

  const closeActionPopup = () => {
    setActionPopup(null);
  };

  const supabaseConfig = getSupabaseConfig();

  return (
    <AppContext.Provider
      value={{
        currentView,
        setCurrentView,
        activeSubject,
        setActiveSubject,
        activeCategory,
        setActiveCategory,
        activeChapter,
        setActiveChapter,
        activeLevel,
        setActiveLevel,
        activePyqExam,
        setActivePyqExam,
        isAuthModalOpen,
        setIsAuthModalOpen,
        authMode,
        setAuthMode,
        actionPopup,
        openActionPopup,
        closeActionPopup,
        activePdf,
        setActivePdf,
        currentUser,
        isLoggedIn: Boolean(currentUser),
        loginAsDemoStudent,
        loginAsDemoAdmin,
        loginWithEmail,
        loginWithGoogle,
        resetPassword,
        logout,
        updateProfile,
        changeUserPlan,
        upgradePlan,
        chapters,
        addChapter,
        deleteChapter,
        reorderChapter,
        questions,
        addQuestion,
        updateQuestion,
        deleteQuestion,
        updateQuestionLocation,
        pdfs,
        addPdf,
        updatePdf,
        deletePdf,
        attempts,
        recordAttempt,
        bookmarkedQuestionIds,
        toggleBookmark,
        supportTickets,
        addSupportTicket,
        submitSupportTicket: addSupportTicket,
        updateTicketStatus,
        allUsers,
        refreshGenuineUsers,
        isSyncingWithSupabase,
        updateUserRoleAndPlan,
        updateUserPlan,
        activeAttemptSession,
        startPracticeSession,
        endPracticeSession,
        isSupabaseConfigured,
        supabaseUrl,
        saveSupabaseSettings,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return ctx;
}
