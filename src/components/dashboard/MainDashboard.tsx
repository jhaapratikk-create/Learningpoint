import React, { useState } from "react";
import {
  Sparkles,
  Flame,
  Clock,
  CheckCircle2,
  Layers,
  BookOpen,
  ArrowRight,
  Bot,
  FileSearch,
  Trophy,
  Calendar,
  Timer,
  Calculator,
  Camera,
  AlertTriangle,
  Zap,
  TrendingUp,
  FileText,
  ChevronRight,
  GraduationCap,
  Target,
  User,
  Palette,
  Heart,
  Youtube,
  Instagram,
  ExternalLink,
  Play,
  Search,
} from "lucide-react";
import { useStudy } from "../../context/StudyContext";
import { useAuth } from "../../context/AuthContext";
import { AppView } from "../../types";
import { GeminiPersonalDashboard } from "./GeminiPersonalDashboard";
import {
  SCHOLAR_ALL_VIDEOS,
  getConceptYouTubeUrl,
  getConceptShortsUrl,
  getConceptReelsUrl,
  getYouTubeLongSearchUrl,
} from "../../data/scholarVideosData";

export const MainDashboard: React.FC = () => {
  const {
    setCurrentView,
    setSelectedSubjectId,
    setActiveNoteId,
    subjects,
    notes,
    flashcards,
    quizzes,
    mistakes,
    exams,
    studyPlan,
    startQuiz,
    focusSessions,
    addToast,
  } = useStudy();
  const { user, setIsCreateProfileModalOpen } = useAuth();
  const [conceptSearch, setConceptSearch] = useState("");

  const handleOpenYouTubeVideo = (url: string, title: string) => {
    window.open(url, "_blank", "noopener,noreferrer");
    addToast(`Opening "${title}" on YouTube...`, "success");
  };

  const handleSearchYouTube = (query: string) => {
    if (!query.trim()) return;
    const url = getYouTubeLongSearchUrl(query, user?.grade || "");
    window.open(url, "_blank", "noopener,noreferrer");
    addToast(`Searching YouTube for "${query}" lectures...`, "success");
  };

  // Compute today's dynamic stats
  const totalStudyMinutesToday = focusSessions.reduce((acc, curr) => acc + curr.durationMinutes, 45);
  const flashcardsReviewedToday = flashcards.filter((f) => f.reviewCount > 0).length || 18;
  const quizzesCompletedToday = 3;
  const targetDailyMinutes = user?.targetDailyMinutes || 120;
  const progressPercent = Math.min(100, Math.round((totalStudyMinutesToday / targetDailyMinutes) * 100));

  // High-yield quick action tools
  const quickActions: {
    id: AppView;
    title: string;
    description: string;
    icon: React.ComponentType<{ className?: string }>;
    color: string;
    bgClass: string;
    borderClass: string;
    badge?: string;
  }[] = [
    {
      id: "syllabus",
      title: "Class Syllabus",
      description: "Full chapter-wise blueprints, weightage & topic checklists",
      icon: GraduationCap,
      color: "text-blue-600 dark:text-blue-400",
      bgClass: "bg-blue-50 dark:bg-blue-950/40",
      borderClass: "border-blue-100 dark:border-blue-900/40",
      badge: "Syllabus",
    },
    {
      id: "tests",
      title: "Tests & Mock Exams",
      description: "Full-length board papers, speed drills & mistake revision",
      icon: Trophy,
      color: "text-pink-600 dark:text-pink-400",
      bgClass: "bg-pink-50 dark:bg-pink-950/40",
      borderClass: "border-pink-100 dark:border-pink-900/40",
      badge: "Mocks",
    },
    {
      id: "ai-tutor",
      title: "Ask AI Tutor",
      description: "Ask any concept, get step-by-step or simple breakdowns",
      icon: Bot,
      color: "text-indigo-600 dark:text-indigo-400",
      bgClass: "bg-indigo-50 dark:bg-indigo-950/40",
      borderClass: "border-indigo-100 dark:border-indigo-900/40",
      badge: "24/7 AI",
    },
    {
      id: "notes-analyzer",
      title: "Analyze Notes & PDF",
      description: "Extract formulas, summaries, MCQs & flashcards instantly",
      icon: FileSearch,
      color: "text-emerald-600 dark:text-emerald-400",
      bgClass: "bg-emerald-50 dark:bg-emerald-950/40",
      borderClass: "border-emerald-100 dark:border-emerald-900/40",
      badge: "OCR & Deep AI",
    },
    {
      id: "flashcards",
      title: "Review Flashcards",
      description: "Spaced repetition active recall with 3D flip study",
      icon: Layers,
      color: "text-violet-600 dark:text-violet-400",
      bgClass: "bg-violet-50 dark:bg-violet-950/40",
      borderClass: "border-violet-100 dark:border-violet-900/40",
      badge: `${flashcards.length} Cards`,
    },
    {
      id: "quizzes",
      title: "Take Practice Quiz",
      description: "Timed mock exams, chapter tests & instant AI diagnosis",
      icon: Trophy,
      color: "text-amber-600 dark:text-amber-400",
      bgClass: "bg-amber-50 dark:bg-amber-950/40",
      borderClass: "border-amber-100 dark:border-amber-900/40",
      badge: `${quizzes.length} Quizzes`,
    },
    {
      id: "planner",
      title: "Today's Study Plan",
      description: "AI-generated timetable customized for upcoming exams",
      icon: Calendar,
      color: "text-sky-600 dark:text-sky-400",
      bgClass: "bg-sky-50 dark:bg-sky-950/40",
      borderClass: "border-sky-100 dark:border-sky-900/40",
      badge: "AI Schedule",
    },
    {
      id: "focus-timer",
      title: "Focus Pomodoro",
      description: "25/5 interval study timer with ambient lo-fi sound waves",
      icon: Timer,
      color: "text-rose-600 dark:text-rose-400",
      bgClass: "bg-rose-50 dark:bg-rose-950/40",
      borderClass: "border-rose-100 dark:border-rose-900/40",
      badge: "Soundwaves",
    },
    {
      id: "math-solver",
      title: "Math & Science Solver",
      description: "Algebra, calculus, mechanics & chemistry equations",
      icon: Calculator,
      color: "text-blue-600 dark:text-blue-400",
      bgClass: "bg-blue-50 dark:bg-blue-950/40",
      borderClass: "border-blue-100 dark:border-blue-900/40",
      badge: "Formulas",
    },
    {
      id: "question-scanner",
      title: "Scan Question / Photo",
      description: "Take photo of any textbook question for immediate step solution",
      icon: Camera,
      color: "text-pink-600 dark:text-pink-400",
      bgClass: "bg-pink-50 dark:bg-pink-950/40",
      borderClass: "border-pink-100 dark:border-pink-900/40",
      badge: "Vision AI",
    },
  ];

  // Next upcoming exam
  const nextExam = exams[0];
  const unresolvedMistakes = mistakes.filter((m) => !m.resolved);

  return (
    <div className="space-y-6 pb-12">
      {/* Top Welcome Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-indigo-900 via-indigo-800 to-slate-900 text-white p-6 sm:p-8 shadow-xl">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-indigo-200 text-xs font-semibold border border-white/10 flex-wrap">
              <GraduationCap className="w-3.5 h-3.5 text-indigo-300" />
              <span>{user?.grade || "Class 12 Science"}</span>
              <span>•</span>
              <Target className="w-3.5 h-3.5 text-amber-300" />
              <span className="text-amber-200 font-bold">Aim: {user?.aim?.split("(")[0] || "IIT JEE / Doctor"}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              Welcome back, {user?.name || "Scholar"} 👋
            </h2>
            <p className="text-sm text-indigo-150 leading-relaxed">
              "Continuous effort—not strength or intelligence—is the key to unlocking your potential."
              You have <span className="font-semibold text-white">{studyPlan.dailySchedule[0]?.slots.length || 3} study slots</span> scheduled today.
            </p>

            <div className="pt-2 flex items-center gap-3 flex-wrap">
              <button
                onClick={() => setCurrentView("tests")}
                className="px-4 py-2 rounded-xl bg-pink-600 hover:bg-pink-700 text-white font-bold text-xs sm:text-sm shadow-md shadow-pink-600/30 transition-all active:scale-95 flex items-center gap-2"
              >
                <Trophy className="w-4 h-4 text-pink-200" />
                <span>Subjective & Mock Tests</span>
              </button>
              <button
                onClick={() => setIsCreateProfileModalOpen(true)}
                className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs sm:text-sm backdrop-blur-md transition-all flex items-center gap-2"
              >
                <Sparkles className="w-4 h-4 text-pink-200" />
                <span>Switch Profile</span>
              </button>
              <button
                onClick={() => setCurrentView("syllabus")}
                className="px-4 py-2 rounded-xl bg-white text-indigo-900 hover:bg-indigo-50 font-bold text-xs sm:text-sm shadow-md transition-all active:scale-95 flex items-center gap-2"
              >
                <BookOpen className="w-4 h-4 text-indigo-600" />
                <span>Class Syllabus</span>
              </button>
              <button
                onClick={() => setCurrentView("profile")}
                className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs sm:text-sm backdrop-blur-md transition-all flex items-center gap-2"
              >
                <User className="w-4 h-4 text-indigo-200" />
                <span>My Profile</span>
              </button>
            </div>
          </div>

          {/* Quick Streak & XP Badge Widget */}
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 sm:p-5 border border-white/10 flex flex-col gap-3 min-w-[220px]">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-amber-500/20 text-amber-300">
                  <Flame className="w-5 h-5 fill-amber-400 text-amber-400" />
                </div>
                <div>
                  <p className="text-[11px] text-indigo-200 uppercase font-semibold">Streak</p>
                  <p className="text-lg font-black text-white">{user?.streak || 5} Days</p>
                </div>
              </div>

              <div className="text-right">
                <p className="text-[11px] text-indigo-200 uppercase font-semibold">Level {user?.level || 3}</p>
                <p className="text-xs font-bold text-amber-300">{user?.xp || 420} XP</p>
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-[11px] text-indigo-200">
                <span>Daily Study Goal</span>
                <span className="font-semibold">{totalStudyMinutesToday}/{targetDailyMinutes}m ({progressPercent}%)</span>
              </div>
              <div className="w-full h-2 rounded-full bg-white/15 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-emerald-400 to-teal-300 rounded-full transition-all duration-500"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Ambient subtle backdrop glows */}
        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-64 h-64 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 -mb-8 w-48 h-48 bg-blue-500/20 rounded-full blur-2xl pointer-events-none" />
      </div>

      {/* Google Gemini AI Personal Student Intelligence Dashboard */}
      <GeminiPersonalDashboard />

      {/* 4 Metric Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex items-center gap-3 sm:gap-4">
          <div className="p-3 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 shrink-0">
            <Clock className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Study Time Today</p>
            <h4 className="text-lg sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
              {totalStudyMinutesToday} <span className="text-xs sm:text-sm font-normal text-slate-500">mins</span>
            </h4>
          </div>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex items-center gap-3 sm:gap-4">
          <div className="p-3 rounded-xl bg-violet-50 dark:bg-violet-950/60 text-violet-600 dark:text-violet-400 shrink-0">
            <Layers className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Cards Mastered</p>
            <h4 className="text-lg sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
              {flashcardsReviewedToday} <span className="text-xs sm:text-sm font-normal text-slate-500">reviewed</span>
            </h4>
          </div>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex items-center gap-3 sm:gap-4">
          <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 shrink-0">
            <Trophy className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Quizzes Solved</p>
            <h4 className="text-lg sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
              {quizzesCompletedToday} <span className="text-xs sm:text-sm font-normal text-slate-500">tests</span>
            </h4>
          </div>
        </div>

        <div
          onClick={() => setCurrentView("progress")}
          className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex items-center justify-between gap-3 sm:gap-4 cursor-pointer hover:border-indigo-400 transition-all group"
        >
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 shrink-0">
              <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Overall Accuracy</p>
              <h4 className="text-lg sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
                86% <span className="text-xs sm:text-sm font-semibold text-emerald-500">+4%</span>
              </h4>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-indigo-600 group-hover:translate-x-0.5 transition-all" />
        </div>
      </div>

      {/* RECOMMENDED SCHOLAR VIDEOS & SHORTS SECTION */}
      <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 sm:p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <Youtube className="w-5 h-5 text-red-600" />
              <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white tracking-tight">
                Scholar Videos & Concept Shorts
              </h3>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Full-length concept lectures and 30–60s revision shorts. Connected with key points and practice quizzes.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentView("scholar-shorts")}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300 hover:bg-amber-100 dark:hover:bg-amber-900/50 text-xs font-bold transition-all border border-amber-200 dark:border-amber-900/40"
            >
              <Flame className="w-3.5 h-3.5 text-amber-500 animate-pulse" />
              <span>Scholar Shorts</span>
            </button>
            <button
              onClick={() => setCurrentView("scholar-videos")}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-all shadow-xs"
            >
              <Youtube className="w-3.5 h-3.5" />
              <span>Full Video Hub ↗</span>
            </button>
          </div>
        </div>

        {/* Quick Concept Search Bar */}
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={conceptSearch}
              onChange={(e) => setConceptSearch(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSearchYouTube(conceptSearch);
              }}
              placeholder="Search any concept (e.g. Quadratic equations, Photosynthesis, Fleming's rule, Integration)..."
              className="w-full pl-10 pr-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <button
            onClick={() => {
              if (conceptSearch.trim()) {
                setCurrentView("scholar-videos");
              } else {
                handleSearchYouTube(conceptSearch);
              }
            }}
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-xs transition-all active:scale-95 flex items-center gap-1.5 whitespace-nowrap"
          >
            <Search className="w-3.5 h-3.5" />
            <span>Search Hub</span>
          </button>
        </div>

        {/* Top 3 Curated Video Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-1">
          {SCHOLAR_ALL_VIDEOS.slice(0, 3).map((vid) => (
            <div
              key={vid.id}
              className="group flex flex-col justify-between p-3.5 rounded-2xl bg-slate-50/70 dark:bg-slate-850/60 border border-slate-200/90 dark:border-slate-800 hover:border-indigo-400 dark:hover:border-indigo-600 shadow-xs transition-all space-y-3"
            >
              <div
                className="space-y-2 cursor-pointer"
                onClick={() => setCurrentView("scholar-videos")}
              >
                <div className="relative aspect-video rounded-xl overflow-hidden bg-slate-900">
                  <img
                    src={vid.thumbnailUrl}
                    alt={vid.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                    <div className="w-9 h-9 rounded-full bg-indigo-600 text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                      <Play className="w-4 h-4 fill-white translate-x-0.5" />
                    </div>
                  </div>
                  <div className="absolute bottom-2 right-2 px-1.5 py-0.5 rounded bg-black/80 text-white text-[10px] font-mono font-bold">
                    {vid.duration}
                  </div>
                  <div className="absolute top-2 left-2 px-1.5 py-0.5 rounded bg-slate-900/90 text-white text-[9px] font-bold">
                    {vid.subject}
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between text-[10px] text-slate-400">
                    <span className="font-semibold text-indigo-600 dark:text-indigo-400">{vid.channel}</span>
                    <span>{vid.views} views</span>
                  </div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors line-clamp-2 mt-0.5">
                    {vid.title}
                  </h4>
                </div>
              </div>

              {/* Direct Shorts, Reels, and Lecture Action Links */}
              <div className="pt-2 border-t border-slate-200/60 dark:border-slate-800 space-y-2">
                <div className="grid grid-cols-2 gap-1.5">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      window.open(getConceptShortsUrl(vid), "_blank", "noopener,noreferrer");
                      addToast(`Opening Shorts for "${vid.concept}" ⚡`, "success");
                    }}
                    className="flex items-center justify-center gap-1 py-1 px-2 rounded-lg bg-red-50 dark:bg-red-950/50 hover:bg-red-100 text-red-700 dark:text-red-300 font-bold text-[11px] border border-red-200/60 transition-colors"
                  >
                    <Flame className="w-3 h-3 text-red-600" />
                    <span>Shorts ⚡</span>
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      window.open(getConceptReelsUrl(vid), "_blank", "noopener,noreferrer");
                      addToast(`Opening Reel for "${vid.concept}" 📸`, "success");
                    }}
                    className="flex items-center justify-center gap-1 py-1 px-2 rounded-lg bg-pink-50 dark:bg-pink-950/50 hover:bg-pink-100 text-pink-700 dark:text-pink-300 font-bold text-[11px] border border-pink-200/60 transition-colors"
                  >
                    <Instagram className="w-3 h-3 text-pink-600" />
                    <span>Reel 📸</span>
                  </button>
                </div>

                <div className="flex items-center justify-between text-[11px] font-bold text-indigo-600 dark:text-indigo-400">
                  <button
                    onClick={() => setCurrentView("scholar-videos")}
                    className="flex items-center gap-1 hover:underline"
                  >
                    <Sparkles className="w-3.5 h-3.5" /> Learn & Quiz
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      window.open(getConceptYouTubeUrl(vid), "_blank", "noopener,noreferrer");
                      addToast(`Opening lecture for "${vid.title}" 📺`, "success");
                    }}
                    className="text-slate-500 hover:text-red-600 flex items-center gap-0.5"
                  >
                    <span>Lecture</span>
                    <ExternalLink className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 8-Card Quick AI Study Hub Grid */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white tracking-tight">
            AI Study Engines & Tools
          </h3>
          <span className="text-xs text-slate-500 dark:text-slate-400">Instant AI Powered</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {quickActions.map((action) => {
            const Icon = action.icon;
            return (
              <div
                key={action.id}
                onClick={() => setCurrentView(action.id)}
                className={`group p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-indigo-400/80 dark:hover:border-indigo-600/80 shadow-xs hover:shadow-md cursor-pointer transition-all duration-200 flex flex-col justify-between`}
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className={`p-2.5 rounded-xl ${action.bgClass} ${action.color}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    {action.badge && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-350">
                        {action.badge}
                      </span>
                    )}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                      {action.title}
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                      {action.description}
                    </p>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs font-semibold text-indigo-600 dark:text-indigo-400">
                  <span>Open Tool</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Two-Column Bento Row: Weakness & Smart Revision + Upcoming Exams */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Smart Revision & Weakness Detection */}
        <div className="lg:col-span-2 space-y-4">
          <div className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400">
                  <AlertTriangle className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-base font-bold text-slate-900 dark:text-white tracking-tight">
                    Smart Revision & Weakness Alerts
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    AI diagnosed {unresolvedMistakes.length} mistakes needing active spaced repetition
                  </p>
                </div>
              </div>

              <button
                onClick={() => setCurrentView("practice")}
                className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
              >
                Re-practice All <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-2.5">
              {unresolvedMistakes.slice(0, 3).map((item) => (
                <div
                  key={item.id}
                  className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-700/60 flex items-start justify-between gap-3"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300">
                        {item.subject}
                      </span>
                      <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                        {item.topic}
                      </span>
                    </div>
                    <p className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                      {item.question}
                    </p>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      Correct: <span className="font-semibold text-emerald-600 dark:text-emerald-400">{item.correctAnswer}</span>
                    </p>
                  </div>

                  <button
                    onClick={() => setCurrentView("practice")}
                    className="shrink-0 px-2.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-[11px] font-semibold transition-all"
                  >
                    Solve
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Subjects Progress Bar Preview */}
          <div className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-base font-bold text-slate-900 dark:text-white tracking-tight">
                Curriculum Mastery Progress
              </h4>
              <button
                onClick={() => setCurrentView("subjects")}
                className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
              >
                View all subjects ({subjects.length}) →
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {subjects.slice(0, 4).map((sub) => (
                <div
                  key={sub.id}
                  onClick={() => {
                    setSelectedSubjectId(sub.id);
                    setCurrentView("subject-detail");
                  }}
                  className="p-3.5 rounded-xl border border-slate-200/80 dark:border-slate-800 hover:border-indigo-400 dark:hover:border-indigo-600 cursor-pointer transition-all bg-slate-50/50 dark:bg-slate-850/50 space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-3 h-3 rounded-full shrink-0"
                        style={{ backgroundColor: sub.color }}
                      />
                      <span className="text-xs font-bold text-slate-900 dark:text-white">
                        {sub.name}
                      </span>
                    </div>
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                      {sub.progress}%
                    </span>
                  </div>

                  <div className="w-full h-1.5 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all"
                      style={{ width: `${sub.progress}%`, backgroundColor: sub.color }}
                    />
                  </div>

                  <div className="flex justify-between text-[10px] text-slate-400">
                    <span>{sub.chaptersCount} Chapters</span>
                    <span>{sub.accuracy}% Accuracy</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right 1 Col: Upcoming Exams & Today's Schedule */}
        <div className="space-y-4">
          {/* Upcoming Exam Card */}
          {nextExam && (
            <div className="p-5 rounded-2xl bg-gradient-to-br from-purple-900 via-indigo-900 to-slate-900 text-white shadow-md space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-purple-500/30 text-purple-200 border border-purple-400/30">
                  Target Exam
                </span>
                <span className="text-xs text-purple-200 font-semibold">{nextExam.date}</span>
              </div>

              <div>
                <h4 className="text-base font-extrabold text-white">{nextExam.name}</h4>
                <p className="text-xs text-purple-200 mt-0.5">{nextExam.subject}</p>
              </div>

              <div className="space-y-1 pt-1">
                <div className="flex justify-between text-[11px] text-purple-200">
                  <span>Preparedness</span>
                  <span className="font-bold">{nextExam.preparationStatus}%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-white/20 overflow-hidden">
                  <div
                    className="h-full bg-emerald-400 rounded-full"
                    style={{ width: `${nextExam.preparationStatus}%` }}
                  />
                </div>
              </div>

              <button
                onClick={() => setCurrentView("exams")}
                className="w-full mt-2 py-2 rounded-xl bg-white text-indigo-900 hover:bg-purple-50 font-bold text-xs shadow-sm transition-all"
              >
                Open Exam Hub & Mock Tests
              </button>
            </div>
          )}

          {/* Today's Timetable Widget */}
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-bold text-slate-900 dark:text-white">Today's Schedule</h4>
              <button
                onClick={() => setCurrentView("planner")}
                className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
              >
                Timetable →
              </button>
            </div>

            <div className="space-y-2">
              {studyPlan.dailySchedule[0]?.slots.slice(0, 3).map((slot) => (
                <div
                  key={slot.id}
                  className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 flex items-start gap-2.5 text-xs"
                >
                  <div className="p-1 rounded-lg bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 mt-0.5">
                    <Clock className="w-3.5 h-3.5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-baseline">
                      <span className="font-bold text-slate-900 dark:text-white truncate">
                        {slot.subject}
                      </span>
                      <span className="text-[10px] text-slate-400">{slot.durationMinutes}m</span>
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                      {slot.topic}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
