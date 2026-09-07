import React from "react";
import {
  LayoutDashboard,
  Bot,
  BookOpen,
  FileText,
  Layers,
  HelpCircle,
  Trophy,
  Calendar,
  Timer,
  BarChart3,
  Target,
  CalendarDays,
  Bell,
  Settings,
  Calculator,
  Camera,
  FolderOpen,
  FileSearch,
  Sparkles,
  BookMarked,
  ShieldCheck,
  ChevronRight,
  Flame,
  Zap,
  GraduationCap,
  User,
  Youtube,
  AlarmClock,
  X,
  LogIn,
  Network,
} from "lucide-react";
import { useStudy } from "../../context/StudyContext";
import { useAuth } from "../../context/AuthContext";
import { AppView } from "../../types";

interface SidebarProps {
  isMobileOpen?: boolean;
  onCloseMobile?: () => void;
  onOpenAdminModal?: () => void;
  onOpenAuthModal?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  isMobileOpen = false,
  onCloseMobile,
  onOpenAdminModal,
  onOpenAuthModal,
}) => {
  const { currentView, setCurrentView, unreadCount, mistakes, subjects, syllabusData, studyAlarms } = useStudy();
  const { user, isAdmin } = useAuth();

  const mainNavItems: {
    id: AppView;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    badge?: string | number;
    color?: string;
  }[] = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "profile", label: "Student Profile", icon: User, badge: user?.grade?.split(" ")[0] || "Profile" },
    { id: "syllabus", label: "Class Syllabus", icon: GraduationCap, badge: "New" },
    { id: "smart-notes", label: "AI Smart Notes", icon: Sparkles, badge: "NCERT" },
    { id: "study-alarms", label: "Study Alarms", icon: AlarmClock, badge: studyAlarms.filter((a) => a.isEnabled).length || undefined },
    { id: "tests", label: "Tests & Mock Exams", icon: Trophy, badge: "Subjective" },
    { id: "scholar-videos", label: "Scholar Videos", icon: Youtube, badge: "Lectures" },
    { id: "scholar-shorts", label: "Scholar Shorts", icon: Flame, badge: "Reels" },
    { id: "ai-tutor", label: "AI Tutor", icon: Bot, badge: "AI" },
    { id: "subjects", label: "My Subjects", icon: BookOpen, badge: subjects.length },
    { id: "notes", label: "My Notes", icon: FileText },
    { id: "flashcards", label: "Flashcards", icon: Layers },
    { id: "practice", label: "Practice & Mistakes", icon: HelpCircle, badge: mistakes.filter((m) => !m.resolved).length || undefined },
    { id: "quizzes", label: "Quizzes", icon: Trophy },
    { id: "planner", label: "Study Planner", icon: Calendar },
    { id: "focus-timer", label: "Focus Mode", icon: Timer },
    { id: "progress", label: "Progress & Analytics", icon: BarChart3 },
    { id: "goals", label: "Goals", icon: Target },
    { id: "exams", label: "Exams", icon: CalendarDays },
    { id: "library", label: "Digital Library", icon: FolderOpen },
  ];

  const aiToolItems: {
    id: AppView;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    badge?: string;
  }[] = [
    { id: "notes-analyzer", label: "AI Notes Analyzer", icon: FileSearch, badge: "Deep" },
    { id: "summary-generator", label: "Summary Generator", icon: Sparkles },
    { id: "explanation-engine", label: "Explanation Engine", icon: BookMarked },
    { id: "question-generator", label: "Question Generator", icon: Zap },
    { id: "math-solver", label: "AI Problem Solver", icon: Calculator, badge: "STEM" },
    { id: "question-scanner", label: "Question Scanner", icon: Camera },
    { id: "mind-map", label: "Neural Mind Map", icon: Network, badge: "Futuristic" },
  ];

  const bottomNavItems: {
    id: AppView;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    badge?: number;
  }[] = [
    { id: "notifications", label: "Notifications", icon: Bell, badge: unreadCount || undefined },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  const handleNavClick = (view: AppView) => {
    setCurrentView(view);
    if (onCloseMobile) onCloseMobile();
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs z-40 lg:hidden"
          onClick={onCloseMobile}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-40 w-64 bg-white dark:bg-slate-900 border-r border-slate-200/80 dark:border-slate-800/80 flex flex-col transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isMobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Brand Logo & Header */}
        <div className="flex items-center justify-between h-16 px-4 border-b border-slate-200/80 dark:border-slate-800/80 shrink-0">
          <div
            onClick={() => handleNavClick("dashboard")}
            className="flex items-center gap-2.5 cursor-pointer group"
          >
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-blue-500 flex items-center justify-center text-white shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-transform">
              <BookOpen className="w-4 h-4" />
            </div>
            <div>
              <h1 className="text-sm font-extrabold tracking-tight text-slate-900 dark:text-white flex items-center gap-1 leading-tight">
                AI Study<span className="text-indigo-600 dark:text-indigo-400">Assistant</span>
              </h1>
              <p className="text-[10px] font-medium text-slate-400 leading-none">
                Learn Smarter. Achieve More.
              </p>
            </div>
          </div>

          {/* Close button for mobile phones */}
          <button
            onClick={onCloseMobile}
            className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
            aria-label="Close sidebar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Content (Scrollable with mobile bottom padding) */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6 pb-28">
          {/* Main Study Navigation */}
          <div>
            <p className="px-3 text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2">
              Main Study Hub
            </p>
            <nav className="space-y-0.5">
              {mainNavItems.map((item) => {
                const Icon = item.icon;
                const isActive = currentView === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleNavClick(item.id)}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all ${
                      isActive
                        ? "bg-indigo-600 text-white shadow-sm shadow-indigo-500/25 font-semibold"
                        : "text-slate-600 dark:text-slate-350 hover:bg-slate-100 dark:hover:bg-slate-800/70 hover:text-slate-900 dark:hover:text-white"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className={`w-4 h-4 shrink-0 ${isActive ? "text-white" : "text-slate-500 dark:text-slate-400"}`} />
                      <span>{item.label}</span>
                    </div>
                    {item.badge !== undefined && (
                      <span
                        className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                          isActive
                            ? "bg-white/20 text-white"
                            : "bg-slate-150 dark:bg-slate-800 text-slate-600 dark:text-slate-300"
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* AI Engines & Specialist Tools */}
          <div>
            <p className="px-3 text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2">
              AI Engines & Tools
            </p>
            <nav className="space-y-0.5">
              {aiToolItems.map((item) => {
                const Icon = item.icon;
                const isActive = currentView === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleNavClick(item.id)}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all ${
                      isActive
                        ? "bg-indigo-600 text-white shadow-sm shadow-indigo-500/25 font-semibold"
                        : "text-slate-600 dark:text-slate-350 hover:bg-slate-100 dark:hover:bg-slate-800/70 hover:text-slate-900 dark:hover:text-white"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className={`w-4 h-4 shrink-0 ${isActive ? "text-white" : "text-indigo-500 dark:text-indigo-400"}`} />
                      <span>{item.label}</span>
                    </div>
                    {item.badge && (
                      <span className="text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300">
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Settings, Notifications & Admin */}
          <div>
            <p className="px-3 text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2">
              System & Controls
            </p>
            <nav className="space-y-0.5">
              {bottomNavItems.map((item) => {
                const Icon = item.icon;
                const isActive = currentView === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleNavClick(item.id)}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all ${
                      isActive
                        ? "bg-indigo-600 text-white shadow-sm shadow-indigo-500/25 font-semibold"
                        : "text-slate-600 dark:text-slate-350 hover:bg-slate-100 dark:hover:bg-slate-800/70 hover:text-slate-900 dark:hover:text-white"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className={`w-4 h-4 shrink-0 ${isActive ? "text-white" : "text-slate-500 dark:text-slate-400"}`} />
                      <span>{item.label}</span>
                    </div>
                    {item.badge && (
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-rose-500 text-white">
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}

              {/* Admin Panel Entry */}
              <button
                onClick={() => {
                  if (isAdmin) {
                    handleNavClick("admin");
                  } else if (onOpenAdminModal) {
                    onOpenAdminModal();
                  }
                }}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all ${
                  currentView === "admin"
                    ? "bg-indigo-600 text-white shadow-sm font-semibold"
                    : "text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/50"
                }`}
              >
                <div className="flex items-center gap-3">
                  <ShieldCheck className="w-4 h-4 text-indigo-500 shrink-0" />
                  <span>Admin Panel</span>
                </div>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300">
                  847230
                </span>
              </button>
            </nav>
          </div>
        </div>

        {/* User Mini Card Footer */}
        {user ? (
          <div className="p-3 border-t border-slate-200/80 dark:border-slate-800/80 shrink-0 bg-slate-50/50 dark:bg-slate-900/50">
            <div
              onClick={() => handleNavClick("profile")}
              className="flex items-center gap-3 p-2 rounded-xl hover:bg-slate-200/60 dark:hover:bg-slate-800 cursor-pointer transition-colors"
            >
              <img
                src={user.avatar}
                alt={user.name}
                className="w-9 h-9 rounded-xl object-cover ring-1 ring-slate-300 dark:ring-slate-700 shrink-0"
              />
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
                  {user.name}
                </p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                  {user.grade}
                </p>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" />
            </div>
          </div>
        ) : (
          <div className="p-3 border-t border-slate-200/80 dark:border-slate-800/80 shrink-0 bg-slate-50/50 dark:bg-slate-900/50">
            <button
              onClick={() => onOpenAuthModal && onOpenAuthModal()}
              className="w-full py-2 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-xs"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Sign In / Create Account</span>
            </button>
          </div>
        )}
      </aside>
    </>
  );
};
