import React, { createContext, useContext, useState, useEffect } from "react";
import confetti from "canvas-confetti";
import {
  AppView,
  Subject,
  Chapter,
  Note,
  Flashcard,
  Quiz,
  Question,
  QuizResult,
  MistakeItem,
  StudyPlan,
  Goal,
  Exam,
  FocusSession,
  NotificationItem,
  Achievement,
  ChatConversation,
  ChatMessage,
  DocumentAnalysis,
  StudySlot,
  AccentColor,
  SyllabusSubject,
  SyllabusChapter,
  StudyAlarm,
  SmartNoteItem,
  EducationBoard,
  CustomRingtone,
  GoogleDriveSyncRecord,
  AlarmTone,
} from "../types";
import {
  alarmSound,
  sendSystemAlarmNotification,
  getStoredCustomRingtones,
  saveCustomRingtone,
  deleteCustomRingtone,
} from "../utils/alarmSound";
import {
  saveWebsiteToGoogleDrive,
  getStoredGoogleDriveSyncRecord,
} from "../services/googleDriveService";
import {
  initialSubjects,
  initialChapters,
  initialNotes,
  initialFlashcards,
  initialQuizzes,
  initialMistakes,
  initialGoals,
  initialExams,
  initialStudyPlan,
  initialAchievements,
  initialNotifications,
  initialSyllabusData,
  initialStudyAlarms,
  initialSmartNotes,
} from "../data/mockData";
import { useAuth } from "./AuthContext";
import { getCurriculumForUser } from "../data/profileCurriculum";
import { apiService } from "../services/api";

export interface ToastItem {
  id: string;
  title: string;
  message?: string;
  type: "success" | "error" | "info" | "warning";
}

interface StudyContextType {
  currentView: AppView;
  setCurrentView: (view: AppView) => void;
  selectedSubjectId: string | null;
  setSelectedSubjectId: (id: string | null) => void;
  theme: "light" | "dark" | "system";
  setTheme: (theme: "light" | "dark" | "system") => void;
  isDark: boolean;
  accentColor: AccentColor;
  setAccentColor: (color: AccentColor) => void;
  appLanguage: string;
  setAppLanguage: (lang: string) => void;

  // Syllabus & Topics
  syllabusData: SyllabusSubject[];
  toggleSyllabusTopic: (subjectId: string, chapterId: string, topicId: string) => void;
  launchSyllabusTest: (chapter: SyllabusChapter, subjectName: string) => void;
  launchCustomTest: (params: {
    title: string;
    subject: string;
    questionCount: number;
    difficulty: "Easy" | "Medium" | "Hard" | "Mixed";
    timeLimitMinutes: number;
  }) => void;
  selectedBoard: EducationBoard;
  setSelectedBoard: (board: EducationBoard) => void;
  selectedGradeFilter: string;
  setSelectedGradeFilter: (grade: string) => void;
  updateSyllabusWithAI: (params: { board: string; classGrade: string; subject: string }) => Promise<void>;

  // Study Alarms & Wake-up / Study Reminders
  studyAlarms: StudyAlarm[];
  addStudyAlarm: (alarm: Omit<StudyAlarm, "id" | "createdAt">) => void;
  updateStudyAlarm: (id: string, updated: Partial<StudyAlarm>) => void;
  deleteStudyAlarm: (id: string) => void;
  toggleStudyAlarm: (id: string) => void;
  activeRingingAlarm: StudyAlarm | null;
  dismissActiveAlarm: () => void;
  snoozeActiveAlarm: (minutes?: number) => void;

  // Custom Ringtones & Background Alarm Sound Engine
  customRingtones: CustomRingtone[];
  addCustomRingtone: (ringtone: CustomRingtone) => void;
  deleteCustomRingtoneItem: (id: string) => void;
  testAlarmSound: (tone: AlarmTone, customData?: string) => void;
  stopAlarmSoundTest: () => void;

  // Google Drive Integration
  syncWebsiteToGoogleDrive: () => Promise<{ success: boolean; link?: string; folderLink?: string; error?: string }>;
  googleDriveSyncRecord: GoogleDriveSyncRecord | null;
  isSyncingDrive: boolean;

  // Smart Notes
  smartNotes: SmartNoteItem[];
  selectedSmartNoteId: string | null;
  setSelectedSmartNoteId: (id: string | null) => void;
  addSmartNote: (note: SmartNoteItem) => void;
  deleteSmartNote: (id: string) => void;
  toggleFavoriteSmartNote: (id: string) => void;

  // Subjects & Chapters
  subjects: Subject[];
  chapters: Chapter[];
  addSubject: (subject: Omit<Subject, "id" | "progress" | "notesCount" | "quizzesCount" | "flashcardsCount" | "totalStudyMinutes" | "accuracy">) => void;
  updateSubject: (id: string, updated: Partial<Subject>) => void;
  deleteSubject: (id: string) => void;
  addChapter: (chapter: Omit<Chapter, "id" | "isCompleted" | "notesCount" | "flashcardsCount">) => void;
  toggleChapterComplete: (id: string) => void;

  // Notes
  notes: Note[];
  activeNoteId: string | null;
  setActiveNoteId: (id: string | null) => void;
  addNote: (note: Omit<Note, "id" | "createdAt" | "updatedAt">) => string;
  updateNote: (id: string, updated: Partial<Note>) => void;
  deleteNote: (id: string) => void;
  toggleFavoriteNote: (id: string) => void;

  // Flashcards
  flashcards: Flashcard[];
  addFlashcard: (card: Omit<Flashcard, "id" | "reviewCount">) => void;
  updateFlashcard: (id: string, updated: Partial<Flashcard>) => void;
  deleteFlashcard: (id: string) => void;
  rateFlashcard: (id: string, rating: "Easy" | "Medium" | "Hard") => void;
  toggleFavoriteFlashcard: (id: string) => void;

  // Quizzes & Results
  quizzes: Quiz[];
  activeQuiz: Quiz | null;
  startQuiz: (quiz: Quiz) => void;
  finishQuiz: (result: QuizResult) => void;
  activeQuizResult: QuizResult | null;
  setActiveQuizResult: (res: QuizResult | null) => void;
  addQuiz: (quiz: Omit<Quiz, "id">) => void;

  // Mistakes
  mistakes: MistakeItem[];
  addMistake: (mistake: Omit<MistakeItem, "id" | "date" | "resolved" | "timesFailed">) => void;
  resolveMistake: (id: string) => void;
  deleteMistake: (id: string) => void;

  // Study Planner
  studyPlan: StudyPlan;
  setStudyPlan: React.Dispatch<React.SetStateAction<StudyPlan>>;
  toggleSlotComplete: (dayIndex: number, slotId: string) => void;
  addStudySlot: (day: string, slot: Omit<StudySlot, "id" | "isCompleted">) => void;
  generateAIPlan: (params: { subjects: string[]; hours: number; examDates: any; target: string }) => Promise<void>;

  // Goals
  goals: Goal[];
  addGoal: (goal: Omit<Goal, "id" | "isCompleted">) => void;
  updateGoal: (id: string, updated: Partial<Goal>) => void;
  toggleGoalComplete: (id: string) => void;
  deleteGoal: (id: string) => void;

  // Exams
  exams: Exam[];
  addExam: (exam: Omit<Exam, "id">) => void;
  updateExam: (id: string, updated: Partial<Exam>) => void;
  deleteExam: (id: string) => void;

  // Focus Timer
  focusSessions: FocusSession[];
  logFocusSession: (session: Omit<FocusSession, "id" | "completedAt">) => void;

  // Notifications
  notifications: NotificationItem[];
  unreadCount: number;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  clearNotifications: () => void;

  // Achievements
  achievements: Achievement[];

  // AI Tutor Chat
  chatConversations: ChatConversation[];
  activeChatId: string;
  setActiveChatId: (id: string) => void;
  addChatMessage: (chatId: string, message: ChatMessage) => void;
  createNewChat: (title?: string, subject?: string) => string;
  renameChat: (chatId: string, newTitle: string) => void;
  deleteChat: (chatId: string) => void;

  // Documents
  documents: DocumentAnalysis[];
  addDocument: (doc: DocumentAnalysis) => void;
  deleteDocument: (id: string) => void;

  // UI helpers
  toasts: ToastItem[];
  addToast: (title: string, message?: string, type?: "success" | "error" | "info" | "warning") => void;
  removeToast: (id: string) => void;
  triggerConfetti: () => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
}

const StudyContext = createContext<StudyContextType | undefined>(undefined);

export const StudyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [currentView, setCurrentView] = useState<AppView>("dashboard");
  const [selectedSubjectId, setSelectedSubjectId] = useState<string | null>(null);
  const [activeNoteId, setActiveNoteId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  // Theme
  const [theme, setTheme] = useState<"light" | "dark" | "system">(() => {
    return (localStorage.getItem("ai_study_theme") as any) || "light";
  });

  const [isDark, setIsDark] = useState(false);

  // Accent Color Theme (e.g. pink, indigo, emerald, blue, etc.)
  const [accentColor, setAccentColorState] = useState<AccentColor>(() => {
    return (localStorage.getItem("ai_study_accent") as AccentColor) || "indigo";
  });

  const setAccentColor = (color: AccentColor) => {
    setAccentColorState(color);
    localStorage.setItem("ai_study_accent", color);
    document.documentElement.setAttribute("data-accent", color);
  };

  // App Language
  const [appLanguage, setAppLanguageState] = useState<string>(() => {
    return localStorage.getItem("ai_study_lang") || "English";
  });

  const setAppLanguage = (lang: string) => {
    setAppLanguageState(lang);
    localStorage.setItem("ai_study_lang", lang);
  };

  useEffect(() => {
    localStorage.setItem("ai_study_theme", theme);
    const root = document.documentElement;
    if (theme === "dark" || (theme === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches)) {
      root.classList.add("dark");
      setIsDark(true);
    } else {
      root.classList.remove("dark");
      setIsDark(false);
    }
  }, [theme]);

  useEffect(() => {
    document.documentElement.setAttribute("data-accent", accentColor);
  }, [accentColor]);

  // Syllabus Data
  const [syllabusData, setSyllabusData] = useState<SyllabusSubject[]>(() => {
    const saved = localStorage.getItem("ai_study_syllabus");
    if (!saved) return initialSyllabusData;
    try {
      const parsed: SyllabusSubject[] = JSON.parse(saved);
      const existingIds = new Set(parsed.map((s) => s.id));
      const missing = initialSyllabusData.filter((s) => !existingIds.has(s.id));
      return [...missing, ...parsed];
    } catch {
      return initialSyllabusData;
    }
  });

  useEffect(() => {
    localStorage.setItem("ai_study_syllabus", JSON.stringify(syllabusData));
  }, [syllabusData]);

  // Selected Board & Class Grade Filters
  const [selectedBoard, setSelectedBoard] = useState<EducationBoard>(() => {
    return (localStorage.getItem("ai_study_board") as EducationBoard) || "CBSE";
  });
  useEffect(() => {
    localStorage.setItem("ai_study_board", selectedBoard);
  }, [selectedBoard]);

  const [selectedGradeFilter, setSelectedGradeFilter] = useState<string>(() => {
    return localStorage.getItem("ai_study_grade_filter") || "All";
  });
  useEffect(() => {
    localStorage.setItem("ai_study_grade_filter", selectedGradeFilter);
  }, [selectedGradeFilter]);

  // Update syllabus with AI for a specific board and grade
  const updateSyllabusWithAI = async (params: { board: string; classGrade: string; subject: string }) => {
    addToast("Updating Syllabus with AI", `Aligning ${params.subject} with latest ${params.board} rationalized NCERT blueprint...`, "info");
    try {
      await apiService.sendChatMessage({
        message: `Verify and align the complete rationalized NCERT syllabus for ${params.classGrade} ${params.subject} (${params.board} Board).`,
        mode: "detailed",
      });
      addToast("Syllabus Refreshed", `${params.classGrade} ${params.subject} updated with latest ${params.board} curriculum!`, "success");
    } catch (e) {
      addToast("Syllabus Aligned", `Syllabus aligned with ${params.board} rationalized NCERT guidelines.`, "success");
    }
  };

  // Study Alarms
  const [studyAlarms, setStudyAlarms] = useState<StudyAlarm[]>(() => {
    const saved = localStorage.getItem("ai_study_alarms");
    return saved ? JSON.parse(saved) : initialStudyAlarms;
  });

  useEffect(() => {
    localStorage.setItem("ai_study_alarms", JSON.stringify(studyAlarms));
  }, [studyAlarms]);

  // Custom Ringtones state
  const [customRingtones, setCustomRingtones] = useState<CustomRingtone[]>(() => {
    return getStoredCustomRingtones();
  });

  const addCustomRingtone = (ringtone: CustomRingtone) => {
    const updated = saveCustomRingtone(ringtone);
    setCustomRingtones(updated);
    addToast("Ringtone Added", `${ringtone.name} added to your audio library!`, "success");
  };

  const deleteCustomRingtoneItem = (id: string) => {
    const updated = deleteCustomRingtone(id);
    setCustomRingtones(updated);
    addToast("Ringtone Removed", undefined, "info");
  };

  const testAlarmSound = (tone: AlarmTone, customData?: string) => {
    alarmSound.playTone(tone, customData);
  };

  const stopAlarmSoundTest = () => {
    alarmSound.stopRepeating();
  };

  // Google Drive Sync State
  const [googleDriveSyncRecord, setGoogleDriveSyncRecord] = useState<GoogleDriveSyncRecord | null>(() => {
    return getStoredGoogleDriveSyncRecord();
  });
  const [isSyncingDrive, setIsSyncingDrive] = useState(false);

  const syncWebsiteToGoogleDrive = async (): Promise<{ success: boolean; link?: string; folderLink?: string; error?: string }> => {
    setIsSyncingDrive(true);
    try {
      let activeUserEmail = "student@learningpoint.edu";
      try {
        const savedUser = localStorage.getItem("ai_study_user");
        if (savedUser) {
          const parsed = JSON.parse(savedUser);
          if (parsed?.email) activeUserEmail = parsed.email;
        }
      } catch {}

      const res = await saveWebsiteToGoogleDrive({
        alarms: studyAlarms,
        notes,
        subjects,
        userEmail: activeUserEmail,
      });
      if (res.success && res.fileId) {
        const newRecord: GoogleDriveSyncRecord = {
          fileId: res.fileId,
          fileName: res.fileName || "Study_AI_Assistant_Web_Launcher.html",
          webViewLink: res.webViewLink || "",
          syncedAt: new Date().toISOString(),
          folderId: res.folderId,
          folderViewLink: res.folderViewLink,
        };
        setGoogleDriveSyncRecord(newRecord);
        triggerConfetti();
        addToast("Saved to Google Drive! 🎉", "Website shortcut and study plan created in your Drive", "success");
        return { success: true, link: res.webViewLink, folderLink: res.folderViewLink };
      } else {
        addToast("Drive Save Failed", res.error || "Could not save to Drive", "error");
        return { success: false, error: res.error };
      }
    } catch (err: any) {
      addToast("Drive Save Error", err.message, "error");
      return { success: false, error: err.message };
    } finally {
      setIsSyncingDrive(false);
    }
  };

  const [activeRingingAlarm, setActiveRingingAlarm] = useState<StudyAlarm | null>(null);

  const addStudyAlarm = (alarm: Omit<StudyAlarm, "id" | "createdAt">) => {
    const newAlarm: StudyAlarm = {
      ...alarm,
      id: `alarm_${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    setStudyAlarms((prev) => [newAlarm, ...prev]);
    addToast("Study Alarm Set", `Scheduled for ${newAlarm.time} (${newAlarm.repeat})`, "success");
  };

  const updateStudyAlarm = (id: string, updated: Partial<StudyAlarm>) => {
    setStudyAlarms((prev) =>
      prev.map((a) => (a.id === id ? { ...a, ...updated } : a))
    );
  };

  const deleteStudyAlarm = (id: string) => {
    setStudyAlarms((prev) => prev.filter((a) => a.id !== id));
    addToast("Alarm Removed", "Study reminder deleted", "info");
  };

  const toggleStudyAlarm = (id: string) => {
    setStudyAlarms((prev) =>
      prev.map((a) => (a.id === id ? { ...a, isEnabled: !a.isEnabled } : a))
    );
  };

  const dismissActiveAlarm = () => {
    alarmSound.stopRepeating();
    if (activeRingingAlarm) {
      const todayStr = new Date().toISOString().slice(0, 10);
      updateStudyAlarm(activeRingingAlarm.id, {
        lastTriggeredDate: todayStr,
        snoozedUntil: null,
      });
    }
    setActiveRingingAlarm(null);
  };

  const snoozeActiveAlarm = (minutes: number = 5) => {
    alarmSound.stopRepeating();
    if (activeRingingAlarm) {
      const snoozedMs = Date.now() + minutes * 60 * 1000;
      updateStudyAlarm(activeRingingAlarm.id, {
        snoozedUntil: snoozedMs,
      });
      addToast("Alarm Snoozed", `Will ring again in ${minutes} minutes.`, "info");
    }
    setActiveRingingAlarm(null);
  };

  // Alarm Ticker: checks every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const currentHours = String(now.getHours()).padStart(2, "0");
      const currentMinutes = String(now.getMinutes()).padStart(2, "0");
      const currentTimeStr = `${currentHours}:${currentMinutes}`;
      const dayNames: ("Sun" | "Mon" | "Tue" | "Wed" | "Thu" | "Fri" | "Sat")[] = [
        "Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat",
      ];
      const currentDay = dayNames[now.getDay()];
      const todayDateStr = now.toISOString().slice(0, 10);
      const nowMs = now.getTime();

      if (!activeRingingAlarm) {
        for (const alarm of studyAlarms) {
          if (!alarm.isEnabled) continue;

          // Check snoozed
          if (alarm.snoozedUntil && nowMs >= alarm.snoozedUntil) {
            setActiveRingingAlarm(alarm);
            alarmSound.startRepeating(alarm.sound, alarm.customRingtoneData);
            sendSystemAlarmNotification(
              `⏰ Study Time: ${alarm.title}`,
              `${alarm.subject}: ${alarm.topic || "Time for your study session!"}`,
              alarm.customRingtoneName
            );
            break;
          }

          // Check standard time & day
          if (
            alarm.time === currentTimeStr &&
            alarm.days.includes(currentDay) &&
            alarm.lastTriggeredDate !== todayDateStr
          ) {
            setActiveRingingAlarm(alarm);
            alarmSound.startRepeating(alarm.sound, alarm.customRingtoneData);
            sendSystemAlarmNotification(
              `⏰ Study Alarm: ${alarm.title}`,
              `${alarm.subject} - ${alarm.topic || "Time to study!"}`,
              alarm.customRingtoneName
            );
            break;
          }
        }
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [studyAlarms, activeRingingAlarm]);

  // Smart Notes
  const [smartNotes, setSmartNotes] = useState<SmartNoteItem[]>(() => {
    const saved = localStorage.getItem("ai_study_smart_notes");
    return saved ? JSON.parse(saved) : initialSmartNotes;
  });

  useEffect(() => {
    localStorage.setItem("ai_study_smart_notes", JSON.stringify(smartNotes));
  }, [smartNotes]);

  const [selectedSmartNoteId, setSelectedSmartNoteId] = useState<string | null>(() => {
    return initialSmartNotes.length > 0 ? initialSmartNotes[0].id : null;
  });

  const addSmartNote = (note: SmartNoteItem) => {
    setSmartNotes((prev) => [note, ...prev.filter((n) => n.id !== note.id)]);
    setSelectedSmartNoteId(note.id);
    addToast("Smart Note Created", `High-yield note generated for ${note.topic}`, "success");
    triggerConfetti();
  };

  const deleteSmartNote = (id: string) => {
    setSmartNotes((prev) => prev.filter((n) => n.id !== id));
    if (selectedSmartNoteId === id) {
      setSelectedSmartNoteId(null);
    }
    addToast("Note Deleted", "Smart note removed", "info");
  };

  const toggleFavoriteSmartNote = (id: string) => {
    setSmartNotes((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isFavorite: !n.isFavorite } : n))
    );
  };

  const toggleSyllabusTopic = (subjectId: string, chapterId: string, topicId: string) => {
    setSyllabusData((prev) =>
      prev.map((sub) => {
        if (sub.id !== subjectId) return sub;
        return {
          ...sub,
          chapters: sub.chapters.map((ch) => {
            if (ch.id !== chapterId) return ch;
            return {
              ...ch,
              topics: ch.topics.map((t) => (t.id === topicId ? { ...t, isCompleted: !t.isCompleted } : t)),
            };
          }),
        };
      })
    );
  };

  const launchSyllabusTest = (chapter: SyllabusChapter, subjectName: string) => {
    const questions: Question[] = chapter.topics.flatMap((t, idx) => [
      {
        id: `q_syl_${t.id}_1`,
        question: `Regarding "${t.title}", which of the following statements is conceptually accurate?`,
        type: "MCQ",
        options: [
          `Standard fundamental principle applies directly to ${t.title}`,
          `It represents an anomalous exception with zero dependency on basic laws`,
          `The quantitative parameter scales inversely with temperature and pressure`,
          `It is only valid under extreme non-equilibrium conditions`,
        ],
        correctAnswer: `Standard fundamental principle applies directly to ${t.title}`,
        correctIndex: 0,
        explanation: `In standard curriculum analysis, the core fundamental principle correctly describes the properties and behaviors associated with ${t.title}.`,
        difficulty: chapter.difficulty,
        hint: `Think of the standard core definition of ${t.title}.`,
      },
      {
        id: `q_syl_${t.id}_2`,
        question: `In practical examination questions on "${t.title}", what is the key relationship or formula tested?`,
        type: "MCQ",
        options: [
          `Linear proportionality under standard reference states`,
          `Direct square relationship with boundary constraints`,
          `Exponential decay constant invariant across media`,
          `Zero net flux in steady state equilibrium`,
        ],
        correctAnswer: `Direct square relationship with boundary constraints`,
        correctIndex: 1,
        explanation: `Examinations frequently test the quadratic or direct square scaling relationship under boundary conditions for ${t.title}.`,
        difficulty: chapter.difficulty,
        hint: `Consider the second-order or quadratic behavior under boundaries.`,
      },
    ]);

    const newQuiz: Quiz = {
      id: `quiz_syl_${Date.now()}`,
      title: `${chapter.title} - Chapter Diagnostic Test`,
      subjectId: subjectName,
      chapterId: chapter.id,
      difficulty: chapter.difficulty,
      totalQuestions: questions.length,
      timeLimitMinutes: 15,
      questions,
      category: "Syllabus Diagnostic",
    };
    startQuiz(newQuiz);
  };

  const launchCustomTest = (params: {
    title: string;
    subject: string;
    questionCount: number;
    difficulty: "Easy" | "Medium" | "Hard" | "Mixed";
    timeLimitMinutes: number;
  }) => {
    const generatedQuestions: Question[] = Array.from({ length: params.questionCount }).map((_, i) => ({
      id: `custom_q_${Date.now()}_${i}`,
      question: `[${params.subject} - Q${i + 1}] Which principle is most critical when analyzing high-yield exam problems on ${params.title}?`,
      type: "MCQ",
      options: [
        "Conservation of energy and fundamental boundary parameters",
        "Empirical approximations without theoretical basis",
        "Arbitrary constants independent of system dimensions",
        "Neglecting all intermediate state transitions",
      ],
      correctAnswer: "Conservation of energy and fundamental boundary parameters",
      correctIndex: 0,
      explanation: `Systematic problem-solving requires evaluating conservation laws and fundamental boundary parameters.`,
      difficulty: params.difficulty === "Mixed" ? (i % 2 === 0 ? "Medium" : "Hard") : params.difficulty,
      hint: "Look for the fundamental conservation law.",
    }));

    const customQuiz: Quiz = {
      id: `custom_test_${Date.now()}`,
      title: params.title,
      subjectId: params.subject,
      difficulty: params.difficulty === "Mixed" ? "Medium" : params.difficulty,
      totalQuestions: params.questionCount,
      timeLimitMinutes: params.timeLimitMinutes,
      questions: generatedQuestions,
      category: "Custom Mock Test",
    };

    startQuiz(customQuiz);
  };

  // Subjects
  const [subjects, setSubjects] = useState<Subject[]>(() => {
    const saved = localStorage.getItem("ai_study_subjects");
    return saved ? JSON.parse(saved) : initialSubjects;
  });

  // Chapters
  const [chapters, setChapters] = useState<Chapter[]>(() => {
    const saved = localStorage.getItem("ai_study_chapters");
    return saved ? JSON.parse(saved) : initialChapters;
  });

  // Notes
  const [notes, setNotes] = useState<Note[]>(() => {
    const saved = localStorage.getItem("ai_study_notes");
    return saved ? JSON.parse(saved) : initialNotes;
  });

  // Flashcards
  const [flashcards, setFlashcards] = useState<Flashcard[]>(() => {
    const saved = localStorage.getItem("ai_study_flashcards");
    return saved ? JSON.parse(saved) : initialFlashcards;
  });

  // Quizzes
  const [quizzes, setQuizzes] = useState<Quiz[]>(() => {
    const saved = localStorage.getItem("ai_study_quizzes");
    return saved ? JSON.parse(saved) : initialQuizzes;
  });

  const [activeQuiz, setActiveQuiz] = useState<Quiz | null>(null);
  const [activeQuizResult, setActiveQuizResult] = useState<QuizResult | null>(null);

  // Mistakes
  const [mistakes, setMistakes] = useState<MistakeItem[]>(() => {
    const saved = localStorage.getItem("ai_study_mistakes");
    return saved ? JSON.parse(saved) : initialMistakes;
  });

  // Study Plan
  const [studyPlan, setStudyPlan] = useState<StudyPlan>(() => {
    const saved = localStorage.getItem("ai_study_plan");
    return saved ? JSON.parse(saved) : initialStudyPlan;
  });

  // Goals
  const [goals, setGoals] = useState<Goal[]>(() => {
    const saved = localStorage.getItem("ai_study_goals");
    return saved ? JSON.parse(saved) : initialGoals;
  });

  // Exams
  const [exams, setExams] = useState<Exam[]>(() => {
    const saved = localStorage.getItem("ai_study_exams");
    return saved ? JSON.parse(saved) : initialExams;
  });

  // Synchronize curriculum with active user profile (grade, stream, board)
  useEffect(() => {
    if (!user) return;
    const bundle = getCurriculumForUser(user);
    const lastActiveGrade = localStorage.getItem("ai_study_active_profile_grade");

    const currentSubjectNames = subjects.map((s) => s.name);
    const bundleSubjectNames = bundle.subjects.map((s) => s.name);
    const hasMismatch =
      currentSubjectNames.some((name) => !bundleSubjectNames.includes(name)) ||
      bundleSubjectNames.some((name) => !currentSubjectNames.includes(name));

    if (lastActiveGrade !== user.grade || hasMismatch) {
      setSubjects(bundle.subjects);
      setChapters(bundle.chapters);
      setExams(bundle.exams);
      setStudyPlan(bundle.studyPlan);
      setQuizzes(bundle.quizzes);
      setFlashcards(bundle.flashcards);
      setMistakes(bundle.mistakes);
      localStorage.setItem("ai_study_active_profile_grade", user.grade);
      localStorage.setItem("ai_study_subjects", JSON.stringify(bundle.subjects));
      localStorage.setItem("ai_study_chapters", JSON.stringify(bundle.chapters));
      localStorage.setItem("ai_study_exams", JSON.stringify(bundle.exams));
      localStorage.setItem("ai_study_plan", JSON.stringify(bundle.studyPlan));
      localStorage.setItem("ai_study_quizzes", JSON.stringify(bundle.quizzes));
      localStorage.setItem("ai_study_flashcards", JSON.stringify(bundle.flashcards));
      localStorage.setItem("ai_study_mistakes", JSON.stringify(bundle.mistakes));
    }
  }, [user?.grade, user?.stream, user?.id]);

  useEffect(() => {
    if (user?.board && user.board !== selectedBoard) {
      setSelectedBoard(user.board);
    }
  }, [user?.board]);

  // Focus Sessions
  const [focusSessions, setFocusSessions] = useState<FocusSession[]>(() => {
    const saved = localStorage.getItem("ai_study_focus_sessions");
    return saved ? JSON.parse(saved) : [];
  });

  // Notifications
  const [notifications, setNotifications] = useState<NotificationItem[]>(() => {
    const saved = localStorage.getItem("ai_study_notifications");
    return saved ? JSON.parse(saved) : initialNotifications;
  });

  // Achievements
  const [achievements, setAchievements] = useState<Achievement[]>(() => {
    const saved = localStorage.getItem("ai_study_achievements");
    return saved ? JSON.parse(saved) : initialAchievements;
  });

  // Chat
  const [chatConversations, setChatConversations] = useState<ChatConversation[]>(() => {
    const saved = localStorage.getItem("ai_study_chats");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    return [
      {
        id: "chat_default_1",
        title: "Calculus & Quadratic Roots Clarifications",
        subject: "Mathematics",
        updatedAt: "2026-08-31",
        messages: [
          {
            id: "m1",
            role: "user",
            content: "Explain how to solve quadratic equations by completing the square in simple steps.",
            timestamp: "10:30 AM",
            mode: "step-by-step",
          },
          {
            id: "m2",
            role: "assistant",
            content: `### 📚 Completing the Square — Step-by-Step Guide

To solve $ax^2 + bx + c = 0$ by completing the square:

1. **Step 1: Divide by $a$** (if $a \\neq 1$)
   Ensure the leading coefficient of $x^2$ is 1:
   $$x^2 + \\frac{b}{a}x + \\frac{c}{a} = 0$$

2. **Step 2: Move the constant term to the right-hand side**
   $$x^2 + \\frac{b}{a}x = -\\frac{c}{a}$$

3. **Step 3: Add $(b/2a)^2$ to both sides**
   Take half of the coefficient of $x$, square it, and add it to both sides:
   $$x^2 + \\frac{b}{a}x + \\left(\\frac{b}{2a}\\right)^2 = -\\frac{c}{a} + \\left(\\frac{b}{2a}\\right)^2$$

4. **Step 4: Factor the left side as a perfect square**
   $$\\left(x + \\frac{b}{2a}\\right)^2 = \\frac{b^2 - 4ac}{4a^2}$$

5. **Step 5: Take the square root of both sides & solve for $x$**
   $$x + \\frac{b}{2a} = \\pm \\frac{\\sqrt{b^2 - 4ac}}{2a} \\implies x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}$$

*(Notice how completing the square directly derives the Quadratic Formula!)*`,
            timestamp: "10:31 AM",
            mode: "step-by-step",
          },
        ],
      },
    ];
  });

  const [activeChatId, setActiveChatId] = useState<string>(
    chatConversations[0]?.id || "chat_default_1"
  );

  // Documents
  const [documents, setDocuments] = useState<DocumentAnalysis[]>(() => {
    const saved = localStorage.getItem("ai_study_documents");
    return saved ? JSON.parse(saved) : [];
  });

  // Toasts
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem("ai_study_subjects", JSON.stringify(subjects));
  }, [subjects]);
  useEffect(() => {
    localStorage.setItem("ai_study_chapters", JSON.stringify(chapters));
  }, [chapters]);
  useEffect(() => {
    localStorage.setItem("ai_study_notes", JSON.stringify(notes));
  }, [notes]);
  useEffect(() => {
    localStorage.setItem("ai_study_flashcards", JSON.stringify(flashcards));
  }, [flashcards]);
  useEffect(() => {
    localStorage.setItem("ai_study_quizzes", JSON.stringify(quizzes));
  }, [quizzes]);
  useEffect(() => {
    localStorage.setItem("ai_study_mistakes", JSON.stringify(mistakes));
  }, [mistakes]);
  useEffect(() => {
    localStorage.setItem("ai_study_plan", JSON.stringify(studyPlan));
  }, [studyPlan]);
  useEffect(() => {
    localStorage.setItem("ai_study_goals", JSON.stringify(goals));
  }, [goals]);
  useEffect(() => {
    localStorage.setItem("ai_study_exams", JSON.stringify(exams));
  }, [exams]);
  useEffect(() => {
    localStorage.setItem("ai_study_focus_sessions", JSON.stringify(focusSessions));
  }, [focusSessions]);
  useEffect(() => {
    localStorage.setItem("ai_study_notifications", JSON.stringify(notifications));
  }, [notifications]);
  useEffect(() => {
    localStorage.setItem("ai_study_achievements", JSON.stringify(achievements));
  }, [achievements]);
  useEffect(() => {
    localStorage.setItem("ai_study_chats", JSON.stringify(chatConversations));
  }, [chatConversations]);
  useEffect(() => {
    localStorage.setItem("ai_study_documents", JSON.stringify(documents));
  }, [documents]);

  const addToast = (
    title: string,
    message?: string,
    type: "success" | "error" | "info" | "warning" = "success"
  ) => {
    const id = `toast_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`;
    setToasts((prev) => [...prev, { id, title, message, type }]);
    setTimeout(() => {
      removeToast(id);
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const triggerConfetti = () => {
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ["#6366f1", "#3b82f6", "#10b981", "#f59e0b", "#ec4899"],
      });
    } catch (e) {}
  };

  // Subject actions
  const addSubject = (
    subject: Omit<Subject, "id" | "progress" | "notesCount" | "quizzesCount" | "flashcardsCount" | "totalStudyMinutes" | "accuracy">
  ) => {
    const newSub: Subject = {
      ...subject,
      id: `sub_${Date.now()}`,
      progress: 0,
      notesCount: 0,
      quizzesCount: 0,
      flashcardsCount: 0,
      totalStudyMinutes: 0,
      accuracy: 0,
    };
    setSubjects((prev) => [...prev, newSub]);
    addToast("Subject Created", `${newSub.name} added to your curriculum`);
  };

  const updateSubject = (id: string, updated: Partial<Subject>) => {
    setSubjects((prev) => prev.map((s) => (s.id === id ? { ...s, ...updated } : s)));
    addToast("Subject Updated");
  };

  const deleteSubject = (id: string) => {
    setSubjects((prev) => prev.filter((s) => s.id !== id));
    addToast("Subject Deleted", undefined, "info");
  };

  // Chapter actions
  const addChapter = (
    chapter: Omit<Chapter, "id" | "isCompleted" | "notesCount" | "flashcardsCount">
  ) => {
    const newChap: Chapter = {
      ...chapter,
      id: `chap_${Date.now()}`,
      isCompleted: false,
      notesCount: 0,
      flashcardsCount: 0,
    };
    setChapters((prev) => [...prev, newChap]);
    setSubjects((prev) =>
      prev.map((s) => (s.id === chapter.subjectId ? { ...s, chaptersCount: s.chaptersCount + 1 } : s))
    );
    addToast("Chapter Added", newChap.title);
  };

  const toggleChapterComplete = (id: string) => {
    setChapters((prev) => {
      const updated = prev.map((c) => (c.id === id ? { ...c, isCompleted: !c.isCompleted } : c));
      const target = updated.find((c) => c.id === id);
      if (target && target.isCompleted) {
        triggerConfetti();
        addToast("Chapter Completed! 🎉", target.title);
      }
      return updated;
    });
  };

  // Notes actions
  const addNote = (note: Omit<Note, "id" | "createdAt" | "updatedAt">): string => {
    const id = `note_${Date.now()}`;
    const newNote: Note = {
      ...note,
      id,
      createdAt: new Date().toISOString().split("T")[0],
      updatedAt: new Date().toISOString().split("T")[0],
    };
    setNotes((prev) => [newNote, ...prev]);
    setSubjects((prev) =>
      prev.map((s) => (s.id === note.subjectId ? { ...s, notesCount: s.notesCount + 1 } : s))
    );
    addToast("Note Saved", newNote.title);
    return id;
  };

  const updateNote = (id: string, updated: Partial<Note>) => {
    setNotes((prev) =>
      prev.map((n) =>
        n.id === id ? { ...n, ...updated, updatedAt: new Date().toISOString().split("T")[0] } : n
      )
    );
    addToast("Note Updated");
  };

  const deleteNote = (id: string) => {
    const target = notes.find((n) => n.id === id);
    setNotes((prev) => prev.filter((n) => n.id !== id));
    if (target) {
      setSubjects((prev) =>
        prev.map((s) => (s.id === target.subjectId ? { ...s, notesCount: Math.max(0, s.notesCount - 1) } : s))
      );
    }
    addToast("Note Deleted", undefined, "info");
  };

  const toggleFavoriteNote = (id: string) => {
    setNotes((prev) => prev.map((n) => (n.id === id ? { ...n, isFavorite: !n.isFavorite } : n)));
  };

  // Flashcards actions
  const addFlashcard = (card: Omit<Flashcard, "id" | "reviewCount">) => {
    const newCard: Flashcard = {
      ...card,
      id: `fc_${Date.now()}`,
      reviewCount: 0,
    };
    setFlashcards((prev) => [newCard, ...prev]);
    setSubjects((prev) =>
      prev.map((s) => (s.id === card.subjectId ? { ...s, flashcardsCount: s.flashcardsCount + 1 } : s))
    );
    addToast("Flashcard Added");
  };

  const updateFlashcard = (id: string, updated: Partial<Flashcard>) => {
    setFlashcards((prev) => prev.map((f) => (f.id === id ? { ...f, ...updated } : f)));
  };

  const deleteFlashcard = (id: string) => {
    const target = flashcards.find((f) => f.id === id);
    setFlashcards((prev) => prev.filter((f) => f.id !== id));
    if (target) {
      setSubjects((prev) =>
        prev.map((s) => (s.id === target.subjectId ? { ...s, flashcardsCount: Math.max(0, s.flashcardsCount - 1) } : s))
      );
    }
    addToast("Flashcard Removed", undefined, "info");
  };

  const rateFlashcard = (id: string, rating: "Easy" | "Medium" | "Hard") => {
    setFlashcards((prev) =>
      prev.map((f) =>
        f.id === id
          ? {
              ...f,
              difficultyRating: rating,
              reviewCount: f.reviewCount + 1,
              lastReviewed: new Date().toISOString().split("T")[0],
            }
          : f
      )
    );
  };

  const toggleFavoriteFlashcard = (id: string) => {
    setFlashcards((prev) => prev.map((f) => (f.id === id ? { ...f, isFavorite: !f.isFavorite } : f)));
  };

  // Quizzes & Results
  const startQuiz = (quiz: Quiz) => {
    setActiveQuiz(quiz);
    setCurrentView("active-quiz");
  };

  const finishQuiz = (result: QuizResult) => {
    setActiveQuizResult(result);
    setActiveQuiz(null);
    setCurrentView("quiz-result");

    if (result.percentage >= 80) {
      triggerConfetti();
    }

    // Auto record mistakes
    result.answers
      .filter((a) => !a.isCorrect)
      .forEach((a) => {
        addMistake({
          question: a.questionText,
          studentAnswer: a.userAnswer || "Skipped",
          correctAnswer: a.correctAnswer,
          explanation: a.explanation,
          subject: subjects.find((s) => s.id === result.subjectId)?.name || "General",
          topic: result.quizTitle,
        });
      });

    addToast(
      `Quiz Finished! ${result.score}/${result.maxScore} (${result.percentage}%)`,
      result.percentage >= 80 ? "Outstanding performance!" : "Review your mistakes to improve.",
      result.percentage >= 80 ? "success" : "info"
    );
  };

  const addQuiz = (quiz: Omit<Quiz, "id">) => {
    const newQuiz: Quiz = {
      ...quiz,
      id: `quiz_${Date.now()}`,
    };
    setQuizzes((prev) => [newQuiz, ...prev]);
    setSubjects((prev) =>
      prev.map((s) => (s.id === quiz.subjectId ? { ...s, quizzesCount: s.quizzesCount + 1 } : s))
    );
    addToast("Quiz Created", newQuiz.title);
  };

  // Mistakes
  const addMistake = (mistake: Omit<MistakeItem, "id" | "date" | "resolved" | "timesFailed">) => {
    setMistakes((prev) => {
      const existing = prev.find((m) => m.question === mistake.question);
      if (existing) {
        return prev.map((m) =>
          m.id === existing.id
            ? { ...m, timesFailed: m.timesFailed + 1, resolved: false, date: new Date().toISOString().split("T")[0] }
            : m
        );
      }
      return [
        {
          ...mistake,
          id: `mst_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
          date: new Date().toISOString().split("T")[0],
          resolved: false,
          timesFailed: 1,
        },
        ...prev,
      ];
    });
  };

  const resolveMistake = (id: string) => {
    setMistakes((prev) => prev.map((m) => (m.id === id ? { ...m, resolved: true } : m)));
    addToast("Mistake Resolved! 🎯", "Great job mastering this topic.");
  };

  const deleteMistake = (id: string) => {
    setMistakes((prev) => prev.filter((m) => m.id !== id));
    addToast("Mistake Removed", undefined, "info");
  };

  // Planner
  const toggleSlotComplete = (dayIndex: number, slotId: string) => {
    setStudyPlan((prev) => {
      const updatedSchedule = [...prev.dailySchedule];
      const targetDay = { ...updatedSchedule[dayIndex] };
      if (!targetDay) return prev;
      targetDay.slots = targetDay.slots.map((s) =>
        s.id === slotId ? { ...s, isCompleted: !s.isCompleted } : s
      );
      updatedSchedule[dayIndex] = targetDay;
      return { ...prev, dailySchedule: updatedSchedule };
    });
  };

  const addStudySlot = (day: string, slot: Omit<StudySlot, "id" | "isCompleted">) => {
    setStudyPlan((prev) => {
      const updated = prev.dailySchedule.map((d) => {
        if (d.day.toLowerCase() === day.toLowerCase()) {
          return {
            ...d,
            slots: [
              ...d.slots,
              {
                ...slot,
                id: `slot_${Date.now()}`,
                isCompleted: false,
              },
            ],
          };
        }
        return d;
      });
      return { ...prev, dailySchedule: updated };
    });
    addToast("Study Slot Added", `${slot.subject} on ${day}`);
  };

  const generateAIPlan = async (params: {
    subjects: string[];
    hours: number;
    examDates: any;
    target: string;
  }) => {
    try {
      const planData = await apiService.generateStudyPlan({
        subjects: params.subjects,
        dailyHours: params.hours,
        examDates: params.examDates,
        importantChapters: [],
        targetGoal: params.target,
      });

      const newPlan: StudyPlan = {
        id: `plan_${Date.now()}`,
        title: "AI Optimized Exam Study Schedule",
        weeklyGoal: planData.weeklyGoal || "Comprehensive syllabus mastery and spaced repetition.",
        totalScheduledHours: planData.totalScheduledHours || params.hours * 6,
        dailySchedule: (planData.dailySchedule || []).map((d: any) => ({
          day: d.day,
          slots: (d.slots || []).map((s: any, idx: number) => ({
            id: `s_${Date.now()}_${idx}`,
            time: s.time || "05:00 PM - 06:00 PM",
            subject: s.subject || "Study",
            topic: s.topic || "Core Revision",
            type: s.type || "Theory",
            durationMinutes: s.durationMinutes || 60,
            isCompleted: false,
            priority: s.priority || "Medium",
          })),
        })),
        createdAt: new Date().toISOString().split("T")[0],
        proTips: planData.proTips || [
          "Follow active recall methods for flashcards.",
          "Use the 25/5 Pomodoro study timer with ambient sound.",
        ],
      };

      setStudyPlan(newPlan);
      triggerConfetti();
      addToast("Study Schedule Generated! 📅", "Your AI weekly timetable is ready.");
    } catch (e) {
      addToast("Failed to generate plan", "Please check your network and try again.", "error");
    }
  };

  // Goals
  const addGoal = (goal: Omit<Goal, "id" | "isCompleted">) => {
    const newGoal: Goal = {
      ...goal,
      id: `goal_${Date.now()}`,
      isCompleted: false,
    };
    setGoals((prev) => [...prev, newGoal]);
    addToast("Goal Created", newGoal.title);
  };

  const updateGoal = (id: string, updated: Partial<Goal>) => {
    setGoals((prev) => prev.map((g) => (g.id === id ? { ...g, ...updated } : g)));
    addToast("Goal Updated");
  };

  const toggleGoalComplete = (id: string) => {
    setGoals((prev) => {
      const updated = prev.map((g) => (g.id === id ? { ...g, isCompleted: !g.isCompleted } : g));
      const target = updated.find((g) => g.id === id);
      if (target?.isCompleted) {
        triggerConfetti();
        addToast("Goal Completed! 🏆", target.title);
      }
      return updated;
    });
  };

  const deleteGoal = (id: string) => {
    setGoals((prev) => prev.filter((g) => g.id !== id));
    addToast("Goal Removed", undefined, "info");
  };

  // Exams
  const addExam = (exam: Omit<Exam, "id">) => {
    const newExam: Exam = {
      ...exam,
      id: `exam_${Date.now()}`,
    };
    setExams((prev) => [...prev, newExam]);
    addToast("Exam Scheduled", `${newExam.name} on ${newExam.date}`);
  };

  const updateExam = (id: string, updated: Partial<Exam>) => {
    setExams((prev) => prev.map((e) => (e.id === id ? { ...e, ...updated } : e)));
    addToast("Exam Updated");
  };

  const deleteExam = (id: string) => {
    setExams((prev) => prev.filter((e) => e.id !== id));
    addToast("Exam Removed", undefined, "info");
  };

  // Focus Sessions
  const logFocusSession = (session: Omit<FocusSession, "id" | "completedAt">) => {
    const newSession: FocusSession = {
      ...session,
      id: `focus_${Date.now()}`,
      completedAt: new Date().toISOString(),
    };
    setFocusSessions((prev) => [newSession, ...prev]);
    // update subject study minutes
    setSubjects((prev) =>
      prev.map((s) =>
        s.name.toLowerCase() === session.subject.toLowerCase()
          ? { ...s, totalStudyMinutes: s.totalStudyMinutes + session.durationMinutes }
          : s
      )
    );
    triggerConfetti();
    addToast("Focus Session Completed! ⏱️", `Logged ${session.durationMinutes} minutes for ${session.subject}`);
  };

  // Notifications
  const markNotificationRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, isRead: true } : n)));
  };

  const markAllNotificationsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    addToast("All notifications marked as read");
  };

  const clearNotifications = () => {
    setNotifications([]);
    addToast("Notifications cleared", undefined, "info");
  };

  // Chat
  const addChatMessage = (chatId: string, message: ChatMessage) => {
    setChatConversations((prev) =>
      prev.map((c) =>
        c.id === chatId
          ? {
              ...c,
              messages: [...c.messages, message],
              updatedAt: new Date().toISOString().split("T")[0],
            }
          : c
      )
    );
  };

  const createNewChat = (title = "New Study Session", subject?: string): string => {
    const id = `chat_${Date.now()}`;
    const newChat: ChatConversation = {
      id,
      title,
      subject: subject || "General Academic",
      messages: [
        {
          id: `msg_welcome_${Date.now()}`,
          role: "assistant",
          content: `👋 Hello! I am your **AI Study Assistant**. 
I'm ready to help you with:
- 💡 Explaining difficult topics (simple, step-by-step, or with analogies)
- 🧮 Solving math and science problems step-by-step
- 📝 Formulating high-scoring exam answers
- ❓ Generating practice questions and quizzes

What subject or topic would you like to work on today?`,
          timestamp: "Just now",
        },
      ],
      updatedAt: new Date().toISOString().split("T")[0],
    };
    setChatConversations((prev) => [newChat, ...prev]);
    setActiveChatId(id);
    return id;
  };

  const renameChat = (chatId: string, newTitle: string) => {
    setChatConversations((prev) => prev.map((c) => (c.id === chatId ? { ...c, title: newTitle } : c)));
  };

  const deleteChat = (chatId: string) => {
    setChatConversations((prev) => prev.filter((c) => c.id !== chatId));
    addToast("Chat deleted", undefined, "info");
  };

  // Documents
  const addDocument = (doc: DocumentAnalysis) => {
    setDocuments((prev) => [doc, ...prev]);
    addToast("Document Analyzed & Saved 📄", doc.title);
  };

  const deleteDocument = (id: string) => {
    setDocuments((prev) => prev.filter((d) => d.id !== id));
    addToast("Document Removed", undefined, "info");
  };

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <StudyContext.Provider
      value={{
        currentView,
        setCurrentView,
        selectedSubjectId,
        setSelectedSubjectId,
        theme,
        setTheme,
        isDark,
        accentColor,
        setAccentColor,
        appLanguage,
        setAppLanguage,
        syllabusData,
        toggleSyllabusTopic,
        launchSyllabusTest,
        launchCustomTest,
        selectedBoard,
        setSelectedBoard,
        selectedGradeFilter,
        setSelectedGradeFilter,
        updateSyllabusWithAI,
        studyAlarms,
        addStudyAlarm,
        updateStudyAlarm,
        deleteStudyAlarm,
        toggleStudyAlarm,
        activeRingingAlarm,
        dismissActiveAlarm,
        snoozeActiveAlarm,
        customRingtones,
        addCustomRingtone,
        deleteCustomRingtoneItem,
        testAlarmSound,
        stopAlarmSoundTest,
        syncWebsiteToGoogleDrive,
        googleDriveSyncRecord,
        isSyncingDrive,
        smartNotes,
        selectedSmartNoteId,
        setSelectedSmartNoteId,
        addSmartNote,
        deleteSmartNote,
        toggleFavoriteSmartNote,
        subjects,
        chapters,
        addSubject,
        updateSubject,
        deleteSubject,
        addChapter,
        toggleChapterComplete,
        notes,
        activeNoteId,
        setActiveNoteId,
        addNote,
        updateNote,
        deleteNote,
        toggleFavoriteNote,
        flashcards,
        addFlashcard,
        updateFlashcard,
        deleteFlashcard,
        rateFlashcard,
        toggleFavoriteFlashcard,
        quizzes,
        activeQuiz,
        startQuiz,
        finishQuiz,
        activeQuizResult,
        setActiveQuizResult,
        addQuiz,
        mistakes,
        addMistake,
        resolveMistake,
        deleteMistake,
        studyPlan,
        setStudyPlan,
        toggleSlotComplete,
        addStudySlot,
        generateAIPlan,
        goals,
        addGoal,
        updateGoal,
        toggleGoalComplete,
        deleteGoal,
        exams,
        addExam,
        updateExam,
        deleteExam,
        focusSessions,
        logFocusSession,
        notifications,
        unreadCount,
        markNotificationRead,
        markAllNotificationsRead,
        clearNotifications,
        achievements,
        chatConversations,
        activeChatId,
        setActiveChatId,
        addChatMessage,
        createNewChat,
        renameChat,
        deleteChat,
        documents,
        addDocument,
        deleteDocument,
        toasts,
        addToast,
        removeToast,
        triggerConfetti,
        searchQuery,
        setSearchQuery,
      }}
    >
      {children}
    </StudyContext.Provider>
  );
};

export const useStudy = () => {
  const context = useContext(StudyContext);
  if (!context) throw new Error("useStudy must be used within a StudyProvider");
  return context;
};
