export type AppView =
  | "dashboard"
  | "profile"
  | "syllabus"
  | "tests"
  | "video-lectures"
  | "scholar-videos"
  | "scholar-shorts"
  | "saved-videos"
  | "ai-tutor"
  | "subjects"
  | "subject-detail"
  | "notes"
  | "notes-analyzer"
  | "summary-generator"
  | "explanation-engine"
  | "question-generator"
  | "math-solver"
  | "question-scanner"
  | "mind-map"
  | "flashcards"
  | "practice"
  | "mistake-notebook"
  | "quizzes"
  | "active-quiz"
  | "quiz-result"
  | "planner"
  | "study-alarms"
  | "smart-notes"
  | "focus-timer"
  | "progress"
  | "goals"
  | "exams"
  | "library"
  | "notifications"
  | "achievements"
  | "settings"
  | "admin";

export type Role = "student" | "admin";

export type AccentColor =
  | "indigo"
  | "pink"
  | "emerald"
  | "blue"
  | "purple"
  | "amber"
  | "rose"
  | "cyan";

export type EducationBoard = "CBSE" | "ICSE" | "State Board" | "Cambridge IGCSE" | "IB" | string;

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  grade: string; // Class / Grade (e.g. Class 9, Class 10, Class 11, Class 12 PCM, etc.)
  board?: EducationBoard; // CBSE, ICSE, State Board, etc.
  aim: string; // Student Career / Academic Aim (e.g. Doctor NEET, IIT JEE, Board Topper, UPSC)
  stream?: string; // Science PCM, Science PCB, Commerce, Arts/Humanities, Engineering, etc.
  targetExam?: string; // CBSE Board, JEE Main, NEET UG, ICSE, SAT, CUET
  targetYear?: string; // 2026, 2027
  dreamCollege?: string; // AIIMS Delhi, IIT Bombay, Stanford, SRCC, etc.
  targetScore?: string; // 98%, 700/720, Top 100 Rank
  school: string;
  city?: string;
  bio?: string;
  preferredLanguage: string;
  accentColor?: AccentColor;
  subjects: string[];
  weakTopics?: string[];
  strongTopics?: string[];
  targetDailyMinutes: number;
  streak: number;
  xp: number;
  level: number;
  role: Role;
  joinedAt: string;
  lastLoginAt: string;
  studyGoals: string[];
  examDates: { [subject: string]: string };
}

export interface SyllabusTopic {
  id: string;
  title: string;
  isCompleted: boolean;
  isImportant?: boolean;
  notes?: string;
}

export interface SyllabusChapter {
  id: string;
  title: string;
  order: number;
  weightageMarks: number;
  weightagePercent: number;
  difficulty: "Easy" | "Medium" | "Hard";
  topics: SyllabusTopic[];
  summary: string;
  formulaSheetAvailable?: boolean;
  hasPracticeTest?: boolean;
}

export interface SyllabusSubject {
  id: string;
  name: string;
  classGrade: string; // e.g. "Class 9", "Class 10", "Class 12 Science", "Class 11", "NEET UG", "JEE Main"
  board?: EducationBoard; // e.g. "CBSE", "ICSE", "State Board", "Cambridge IGCSE", "IB"
  isNewNcert?: boolean; // Aligned with latest rationalized NCERT curriculum
  code: string;
  icon: string;
  color: string;
  totalMarks: number;
  chapters: SyllabusChapter[];
  description: string;
  examPatternSummary: string;
}

export interface Subject {
  id: string;
  name: string;
  code?: string;
  icon: string;
  color: string;
  chaptersCount: number;
  progress: number;
  notesCount: number;
  quizzesCount: number;
  flashcardsCount: number;
  totalStudyMinutes: number;
  accuracy: number;
  description: string;
}

export interface Chapter {
  id: string;
  subjectId: string;
  title: string;
  order: number;
  summary: string;
  description?: string;
  isCompleted: boolean;
  notesCount: number;
  flashcardsCount: number;
  difficulty: "Easy" | "Medium" | "Hard";
}

export interface Note {
  id: string;
  title: string;
  subjectId: string;
  chapterId?: string;
  content: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
  isFavorite: boolean;
  sourceDocName?: string;
}

export interface Flashcard {
  id: string;
  subjectId: string;
  chapterId?: string;
  front: string;
  back: string;
  difficultyRating: "Easy" | "Medium" | "Hard" | "Unrated" | "Again";
  lastReviewed?: string;
  nextReviewDate?: string;
  isFavorite?: boolean;
  reviewCount: number;
  repetitions?: number;
  intervalDays?: number;
}

export type QuestionType =
  | "MCQ"
  | "True/False"
  | "Fill in the blanks"
  | "Fill in the Blanks"
  | "Short answer"
  | "Short Answer"
  | "Long answer"
  | "Long Answer"
  | "Assertion & Reason"
  | "Case-based"
  | "Case-Based Question"
  | "Numerical"
  | "Numerical Problem";

export interface Question {
  id: string;
  type: QuestionType;
  difficulty: "Easy" | "Medium" | "Hard";
  question: string;
  options: string[];
  correctAnswer: string;
  correctIndex: number | null;
  explanation: string;
  hint?: string;
}

export interface Quiz {
  id: string;
  title: string;
  description?: string;
  subjectId: string;
  chapterId?: string;
  questions: Question[];
  timeLimitMinutes: number;
  totalQuestions: number;
  difficulty: "Easy" | "Medium" | "Hard";
  category?: string;
}

export interface QuizAnswer {
  questionId: string;
  questionText: string;
  userAnswer: string;
  correctAnswer: string;
  isCorrect: boolean;
  explanation: string;
}

export interface QuizResult {
  id: string;
  quizId: string;
  quizTitle: string;
  subjectId: string;
  score: number;
  maxScore: number;
  percentage: number;
  correctAnswers: number;
  incorrectAnswers: number;
  skippedAnswers: number;
  timeTakenSeconds: number;
  timeSpentSeconds?: number;
  date: string;
  weakTopics: string[];
  recommendations: string[];
  aiRecommendations?: string;
  answers: QuizAnswer[];
}

export interface MistakeItem {
  id: string;
  question: string;
  studentAnswer: string;
  correctAnswer: string;
  explanation: string;
  subject: string;
  topic: string;
  date: string;
  resolved: boolean;
  timesFailed: number;
}

export interface StudySlot {
  id: string;
  time: string;
  subject: string;
  topic: string;
  type: string;
  durationMinutes: number;
  isCompleted: boolean;
  priority: "High" | "Medium" | "Low";
}

export interface StudyScheduleItem {
  id: string;
  subjectId: string;
  title: string;
  dayOfWeek: string;
  startTime: string;
  durationMinutes: number;
  priority: "High" | "Medium" | "Low";
  isCompleted?: boolean;
}

export interface DayPlan {
  day: string;
  slots: StudySlot[];
}

export interface StudyPlan {
  id: string;
  title: string;
  weeklyGoal: string;
  totalScheduledHours: number;
  dailySchedule: DayPlan[];
  createdAt: string;
  proTips: string[];
}

export interface Goal {
  id: string;
  title: string;
  targetMetric: number;
  currentMetric: number;
  unit: string;
  deadline: string;
  isCompleted: boolean;
  category: "Study Time" | "Chapters" | "Quizzes" | "Score" | "Custom";
}

export interface Exam {
  id: string;
  name: string;
  subject: string;
  date: string;
  syllabus: string[];
  preparationStatus: number; // 0 - 100%
  totalTopics: number;
  revisedTopics: number;
  priority: "High" | "Medium" | "Low";
}

export interface FocusSession {
  id: string;
  mode: "25/5" | "50/10" | "custom";
  durationMinutes: number;
  subject: string;
  taskName: string;
  completedAt: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: "reminder" | "exam" | "revision" | "goal" | "quiz" | "streak" | "system";
  timestamp: string;
  isRead: boolean;
  actionView?: AppView;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlockedAt?: string;
  progress: number;
  maxProgress: number;
  isUnlocked: boolean;
  category: "Streak" | "Quizzes" | "Study Time" | "Mastery";
}

export type AIChatMode =
  | "partner"
  | "mentor"
  | "simple"
  | "detailed"
  | "step-by-step"
  | "exam"
  | "revision"
  | "examples"
  | "practice"
  | "exam-oriented"
  | "quick-revision"
  | "examples-analogies"
  | "practice-questions";

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
  mode?: AIChatMode;
  saved?: boolean;
  subject?: string;
  modelUsed?: string;
  responseTimeMs?: number;
}

export interface ChatConversation {
  id: string;
  title: string;
  subject?: string;
  messages: ChatMessage[];
  updatedAt: string;
}

export interface DocumentAnalysis {
  id: string;
  title: string;
  subject: string;
  fileName: string;
  fileType: string;
  fileSize?: string;
  summary: string;
  keyConcepts: string[];
  importantPoints: string[];
  definitions: { term: string; meaning: string }[];
  formulas: { name: string; equation: string; explanation: string }[];
  importantQuestions: string[];
  mcqs: {
    question: string;
    options: string[];
    correctIndex: number;
    explanation: string;
  }[];
  flashcards: { front: string; back: string }[];
  revisionNotes: string;
  keywords: string[];
  rawText: string;
  createdAt?: string;
  uploadedAt?: string;
}

export interface AdminStats {
  totalUsers: number;
  activeToday: number;
  totalStudyHours: number;
  quizzesCompleted: number;
  aiQueriesAnswered: number;
  serverHealth: "Optimal" | "Degraded" | "Maintenance";
  storageUsedMB: number;
  activeIssuesCount: number;
}

export interface ConceptVideoLecture {
  id: string;
  title: string;
  concept: string;
  subject: string;
  grade: string;
  chapter: string;
  duration: string;
  channel: string;
  instructor?: string;
  youtubeId: string;
  youtubeUrl: string;
  thumbnailUrl: string;
  description: string;
  tags: string[];
  views: string;
  rating: number;
  difficulty: "Beginner" | "Intermediate" | "Advanced" | "Exam-Oriented";
  keyTimestamps?: { time: string; label: string }[];
  isBookmarked?: boolean;
}

export interface SubjectiveMarkingStep {
  step: string;
  marks: number;
}

export interface SubjectiveQuestion {
  id: string;
  questionNumber: number;
  section: string; // e.g. "Section A (2 Marks - Short)", "Section B (3 Marks - Conceptual)", "Section C (5 Marks - Long & Derivations)"
  marks: number;
  question: string;
  topic: string;
  subject: string;
  markingScheme: SubjectiveMarkingStep[];
  modelAnswer: string;
  keyKeywords: string[];
  suggestedWordCount?: string;
  diagramRequired?: boolean;
  formulaeInvolved?: string[];
  youtubeSearchTopic?: string;
}

export interface SubjectivePaper {
  id: string;
  title: string;
  subject: string;
  classGrade: string;
  totalMarks: number;
  timeLimitMinutes: number;
  instructions: string[];
  difficulty: "Standard Board" | "Moderate" | "Challenging";
  badge: string;
  description: string;
  questions: SubjectiveQuestion[];
  chapterName?: string;
}

export interface SubjectiveQuestionEvaluation {
  score: number;
  maxMarks: number;
  feedback: string;
  matchedKeywords: string[];
  missingPoints: string[];
  stepBreakdown: { step: string; marksAwarded: number; maxMarks: number }[];
}

export interface SubjectiveSubmission {
  id: string;
  paperId: string;
  paperTitle: string;
  subject: string;
  studentAnswers: { [questionId: string]: string };
  marksAwarded: { [questionId: string]: number };
  totalScore: number;
  maxScore: number;
  percentage: number;
  evaluations: { [questionId: string]: SubjectiveQuestionEvaluation };
  submittedAt: string;
  timeSpentSeconds: number;
  overallAiSummary: string;
}

export type VideoContentType = "long" | "short";
export type VideoPlatform = "youtube" | "instagram";

export interface ScholarPracticeQuestion {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface ScholarVideoItem {
  id: string;
  type: VideoContentType; // "long" | "short"
  platform: VideoPlatform; // "youtube" | "instagram"
  title: string;
  concept: string;
  subject: string; // Mathematics, Science, Physics, Chemistry, Biology, English, Hindi, Social Science, Computer Science, Commerce
  classGrade: string; // Class 6, Class 7, Class 8, Class 9, Class 10, Class 11, Class 12, Competitive Exams
  chapter: string;
  duration: string; // e.g. "18:40" or "0:45"
  durationSeconds?: number;
  channel: string;
  creatorAvatar?: string;
  externalUrl: string; // Direct official link
  youtubeUrl?: string; // Full lecture / YouTube link
  shortsUrl?: string;  // YouTube Shorts link
  reelsUrl?: string;   // Instagram Reels link
  youtubeId?: string;
  instagramId?: string;
  thumbnailUrl: string;
  description: string;
  tags: string[];
  views: string;
  likes?: string;
  rating?: number;
  difficulty: "Easy" | "Medium" | "Hard" | "Exam-Oriented";
  
  // Learning Flow Components
  quickExplanation: string;
  keyPoints: string[];
  formulaOrDefinition: string;
  practiceQuestion: ScholarPracticeQuestion;
  keyTimestamps?: { time: string; label: string }[];
}

export interface AIGeminiDashboardInsights {
  partnerGreeting: string;
  dailyQuote: string;
  mindsetTip: string;
  todaysFocusPlan: {
    task: string;
    subject: string;
    durationMinutes: number;
    reason: string;
  }[];
  strengthAnalysis: string;
  weakAreaPrescription: string;
  wellnessAndBalanceAdvice: string;
}

export interface AITestQuestion {
  id: string;
  number: number;
  type: "MCQ" | "Short Answer" | "Long Answer" | "Numerical" | "Assertion & Reason";
  marks: number;
  question: string;
  options?: string[];
  correctOptionIndex?: number;
  modelAnswer: string;
  stepMarking: string;
  explanation: string;
  hint?: string;
}

export interface AITestSection {
  sectionName: string;
  description: string;
  totalMarks: number;
  questions: AITestQuestion[];
}

export interface AITestPaper {
  paperId: string;
  title: string;
  subject: string;
  grade: string;
  targetExam: string;
  difficulty: "Easy" | "Medium" | "Hard" | "Mixed";
  durationMinutes: number;
  totalMarks: number;
  instructions: string[];
  sections: AITestSection[];
  createdAt: string;
}

export interface AITestEvaluationResult {
  totalScoreAwarded: number;
  maxScore: number;
  percentage: number;
  grade: string;
  overallFeedback: string;
  questionEvaluations: {
    questionId: string;
    marksAwarded: number;
    maxMarks: number;
    stepFeedback: string;
    suggestions: string;
  }[];
}

export type AlarmTone = "bell" | "chime" | "zen" | "digital" | "custom";

export interface CustomRingtone {
  id: string;
  name: string;
  dataUrl: string;
  fileSize?: string;
  durationSeconds?: number;
  sourceType: "upload" | "url" | "preset";
  createdAt: string;
}

export interface GoogleDriveSyncRecord {
  fileId: string;
  fileName: string;
  webViewLink: string;
  syncedAt: string;
  folderId?: string;
  folderViewLink?: string;
}

export interface StudyAlarm {
  id: string;
  title: string;
  subject: string;
  topic?: string;
  classGrade?: string;
  board?: string;
  time: string; // "HH:MM" 24hr format, e.g. "17:30"
  days: ("Mon" | "Tue" | "Wed" | "Thu" | "Fri" | "Sat" | "Sun")[];
  isEnabled: boolean;
  sound: AlarmTone;
  customRingtoneId?: string;
  customRingtoneName?: string;
  customRingtoneData?: string;
  repeat: "daily" | "weekdays" | "weekends" | "custom" | "once";
  autoOpenView?: AppView;
  snoozedUntil?: number | null; // timestamp ms
  lastTriggeredDate?: string; // YYYY-MM-DD to avoid duplicate triggering in the same minute
  createdAt: string;
}

export interface SmartNoteConcept {
  heading: string;
  explanation: string;
  diagramDescription?: string;
  examples?: string[];
}

export interface SmartNoteFormula {
  name: string;
  formula: string;
  variables?: string;
  units?: string;
}

export interface SmartNoteQuestion {
  question: string;
  marks?: number;
  answer: string;
  markingKeyPoints?: string[];
}

export interface SmartNoteItem {
  id: string;
  title: string;
  topic: string;
  classGrade: string; // "Class 9", "Class 10", "Class 11", "Class 12"
  board: string; // "CBSE", "ICSE", "State Board", "Cambridge IGCSE", "IB"
  subject: string;
  noteType: "comprehensive" | "high-yield" | "formulas" | "concept-map" | "quick-summary";
  syllabusContext?: string;
  overview: string;
  keyConcepts: SmartNoteConcept[];
  formulasAndLaws: SmartNoteFormula[];
  mustKnowExamQuestions: SmartNoteQuestion[];
  commonPitfalls: string[];
  quickRevisionPoints: string[];
  formattedMarkdown?: string;
  createdAt: string;
  isFavorite?: boolean;
}


