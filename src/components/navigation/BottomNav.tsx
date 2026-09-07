import React, { useState } from "react";
import {
  LayoutDashboard,
  Bot,
  Flame,
  Grid,
  Plus,
  X,
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
  FolderOpen,
  FileSearch,
  Sparkles,
  BookMarked,
  Zap,
  Calculator,
  Camera,
  User,
  Settings,
  GraduationCap,
  Youtube,
  AlarmClock,
  Search,
} from "lucide-react";
import { useStudy } from "../../context/StudyContext";
import { AppView } from "../../types";

export const BottomNav: React.FC = () => {
  const { currentView, setCurrentView } = useStudy();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isQuickActionOpen, setIsQuickActionOpen] = useState(false);
  const [searchFilter, setSearchFilter] = useState("");

  const allTools: {
    category: string;
    items: { id: AppView; label: string; icon: React.ComponentType<{ className?: string }>; color: string; desc: string }[];
  }[] = [
    {
      category: "Academic & Courses",
      items: [
        { id: "dashboard", label: "Dashboard", icon: LayoutDashboard, color: "bg-indigo-500", desc: "Overview & summary" },
        { id: "syllabus", label: "Class Syllabus", icon: GraduationCap, color: "bg-blue-600", desc: "Chapters & subtopics" },
        { id: "subjects", label: "My Subjects", icon: BookOpen, color: "bg-emerald-600", desc: "All enrolled courses" },
        { id: "scholar-videos", label: "Scholar Lectures", icon: Youtube, color: "bg-rose-600", desc: "Video chapter lessons" },
        { id: "scholar-shorts", label: "Scholar Shorts", icon: Flame, color: "bg-amber-600", desc: "Bite-sized revision reels" },
        { id: "notes", label: "Study Notes", icon: FileText, color: "bg-teal-600", desc: "Markdown & audio notes" },
        { id: "library", label: "Digital Library", icon: FolderOpen, color: "bg-cyan-600", desc: "Formulas & documents" },
      ],
    },
    {
      category: "AI Engines & Solvers",
      items: [
        { id: "smart-notes", label: "AI Smart Notes", icon: Sparkles, color: "bg-purple-600", desc: "NCERT & Board smart summaries" },
        { id: "ai-tutor", label: "AI Academic Tutor", icon: Bot, color: "bg-indigo-600", desc: "Chat & concept coach" },
        { id: "math-solver", label: "AI Problem Solver", icon: Calculator, color: "bg-blue-500", desc: "Math, Physics & STEM" },
        { id: "question-scanner", label: "Question Scanner", icon: Camera, color: "bg-pink-600", desc: "OCR image problem solver" },
        { id: "notes-analyzer", label: "AI Notes Analyzer", icon: FileSearch, color: "bg-emerald-500", desc: "Extract MCQs & summaries" },
        { id: "summary-generator", label: "Summary Generator", icon: Sparkles, color: "bg-violet-600", desc: "Rapid bullet recaps" },
        { id: "explanation-engine", label: "Explanation Engine", icon: BookMarked, color: "bg-sky-600", desc: "Deep multi-style explanations" },
        { id: "question-generator", label: "Question Generator", icon: Zap, color: "bg-orange-500", desc: "Custom exam questions" },
      ],
    },
    {
      category: "Practice, Tests & Productivity",
      items: [
        { id: "study-alarms", label: "Study Alarms", icon: AlarmClock, color: "bg-rose-600", desc: "Daily study alarms & alerts" },
        { id: "tests", label: "Tests & Mock Exams", icon: Trophy, color: "bg-amber-500", desc: "MCQ & subjective tests" },
        { id: "quizzes", label: "Practice Quizzes", icon: Trophy, color: "bg-yellow-500", desc: "Gamified practice sets" },
        { id: "flashcards", label: "Spaced Flashcards", icon: Layers, color: "bg-purple-600", desc: "Active recall flipcards" },
        { id: "practice", label: "Mistake Notebook", icon: HelpCircle, color: "bg-red-500", desc: "Retry missed questions" },
        { id: "planner", label: "AI Study Planner", icon: Calendar, color: "bg-indigo-500", desc: "Weekly focus timetable" },
        { id: "focus-timer", label: "Pomodoro Timer", icon: Timer, color: "bg-rose-500", desc: "Ambient binaural focus" },
      ],
    },
    {
      category: "Analytics & Account",
      items: [
        { id: "progress", label: "Progress Analytics", icon: BarChart3, color: "bg-blue-600", desc: "Study time & accuracy charts" },
        { id: "goals", label: "Weekly Goals", icon: Target, color: "bg-emerald-600", desc: "Targets & milestones" },
        { id: "exams", label: "Exam Timetable", icon: CalendarDays, color: "bg-orange-600", desc: "Countdowns & schedules" },
        { id: "profile", label: "Student Profile", icon: User, color: "bg-indigo-600", desc: "Class, board & avatar" },
        { id: "settings", label: "Settings", icon: Settings, color: "bg-slate-600", desc: "Preferences & theme" },
      ],
    },
  ];

  const handleSelectView = (view: AppView) => {
    setCurrentView(view);
    setIsDrawerOpen(false);
    setIsQuickActionOpen(false);
  };

  const filteredCategories = allTools.map((cat) => ({
    ...cat,
    items: cat.items.filter(
      (item) =>
        item.label.toLowerCase().includes(searchFilter.toLowerCase()) ||
        item.desc.toLowerCase().includes(searchFilter.toLowerCase())
    ),
  })).filter((cat) => cat.items.length > 0);

  return (
    <>
      {/* Quick Action Bottom Modal (Center Plus button) */}
      {isQuickActionOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex flex-col justify-end bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white dark:bg-slate-900 rounded-t-3xl border-t border-slate-200 dark:border-slate-800 p-5 space-y-4 max-h-[80vh] overflow-y-auto animate-in slide-in-from-bottom-6 duration-200 shadow-2xl">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold">
                  <Plus className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">Quick Actions</h3>
                  <p className="text-[11px] text-slate-400">Launch study tools instantly</p>
                </div>
              </div>
              <button
                onClick={() => setIsQuickActionOpen(false)}
                className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              <button
                onClick={() => handleSelectView("ai-tutor")}
                className="p-3 rounded-2xl bg-indigo-50 dark:bg-indigo-950/50 border border-indigo-200/60 dark:border-indigo-800/40 flex items-center gap-3 text-left hover:scale-[1.02] transition-transform"
              >
                <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                  <Bot className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-bold text-indigo-950 dark:text-indigo-100 truncate">Ask AI Tutor</div>
                  <div className="text-[10px] text-indigo-600 dark:text-indigo-400 truncate">Concept coach</div>
                </div>
              </button>

              <button
                onClick={() => handleSelectView("math-solver")}
                className="p-3 rounded-2xl bg-blue-50 dark:bg-blue-950/50 border border-blue-200/60 dark:border-blue-800/40 flex items-center gap-3 text-left hover:scale-[1.02] transition-transform"
              >
                <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                  <Calculator className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-bold text-blue-950 dark:text-blue-100 truncate">Math / STEM</div>
                  <div className="text-[10px] text-blue-600 dark:text-blue-400 truncate">Step solver</div>
                </div>
              </button>

              <button
                onClick={() => handleSelectView("question-scanner")}
                className="p-3 rounded-2xl bg-pink-50 dark:bg-pink-950/50 border border-pink-200/60 dark:border-pink-800/40 flex items-center gap-3 text-left hover:scale-[1.02] transition-transform"
              >
                <div className="w-10 h-10 rounded-xl bg-pink-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                  <Camera className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-bold text-pink-950 dark:text-pink-100 truncate">Scan Photo</div>
                  <div className="text-[10px] text-pink-600 dark:text-pink-400 truncate">OCR problem solver</div>
                </div>
              </button>

              <button
                onClick={() => handleSelectView("notes-analyzer")}
                className="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200/60 dark:border-emerald-800/40 flex items-center gap-3 text-left hover:scale-[1.02] transition-transform"
              >
                <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                  <FileSearch className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-bold text-emerald-950 dark:text-emerald-100 truncate">Analyze Notes</div>
                  <div className="text-[10px] text-emerald-600 dark:text-emerald-400 truncate">Generate MCQs</div>
                </div>
              </button>

              <button
                onClick={() => handleSelectView("flashcards")}
                className="p-3 rounded-2xl bg-purple-50 dark:bg-purple-950/50 border border-purple-200/60 dark:border-purple-800/40 flex items-center gap-3 text-left hover:scale-[1.02] transition-transform"
              >
                <div className="w-10 h-10 rounded-xl bg-purple-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                  <Layers className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-bold text-purple-950 dark:text-purple-100 truncate">Flashcards</div>
                  <div className="text-[10px] text-purple-600 dark:text-purple-400 truncate">Active recall</div>
                </div>
              </button>

              <button
                onClick={() => handleSelectView("focus-timer")}
                className="p-3 rounded-2xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200/60 dark:border-rose-800/40 flex items-center gap-3 text-left hover:scale-[1.02] transition-transform"
              >
                <div className="w-10 h-10 rounded-xl bg-rose-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                  <Timer className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-bold text-rose-950 dark:text-rose-100 truncate">Focus Timer</div>
                  <div className="text-[10px] text-rose-600 dark:text-rose-400 truncate">Pomodoro 25/5</div>
                </div>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Full "All Options" Mobile Drawer Sheet */}
      {isDrawerOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex flex-col justify-end bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white dark:bg-slate-900 rounded-t-3xl border-t border-slate-200 dark:border-slate-800 p-5 space-y-4 max-h-[85vh] overflow-y-auto animate-in slide-in-from-bottom-6 duration-200 shadow-2xl">
            {/* Drawer Header */}
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold">
                  <Grid className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-extrabold text-slate-900 dark:text-white">All Study Tools & Options</h3>
                  <p className="text-[11px] text-slate-400">Every feature available on your phone</p>
                </div>
              </div>
              <button
                onClick={() => setIsDrawerOpen(false)}
                className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* In-drawer Search Filter */}
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
                placeholder="Search any tool, solver, or view..."
                className="w-full pl-9 pr-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            {/* Categorized Options List */}
            <div className="space-y-4 pb-6">
              {filteredCategories.map((cat, idx) => (
                <div key={idx} className="space-y-1.5">
                  <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 px-1">
                    {cat.category}
                  </h4>
                  <div className="grid grid-cols-2 gap-2">
                    {cat.items.map((item) => {
                      const Icon = item.icon;
                      const isActive = currentView === item.id;
                      return (
                        <button
                          key={item.id}
                          onClick={() => handleSelectView(item.id)}
                          className={`flex items-center gap-2.5 p-2.5 rounded-xl border text-left transition-all ${
                            isActive
                              ? "bg-indigo-600 text-white border-indigo-600 shadow-sm"
                              : "bg-slate-50 dark:bg-slate-800/80 border-slate-200/80 dark:border-slate-750 text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700/80"
                          }`}
                        >
                          <div
                            className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                              isActive ? "bg-white/20 text-white" : `${item.color} text-white`
                            }`}
                          >
                            <Icon className="w-3.5 h-3.5" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="text-xs font-bold truncate">{item.label}</div>
                            <div
                              className={`text-[9px] truncate ${
                                isActive ? "text-indigo-100" : "text-slate-400 dark:text-slate-500"
                              }`}
                            >
                              {item.desc}
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Main Persistent Mobile Bottom Navigation Bar */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 px-2 py-1.5 flex items-center justify-around shadow-xl">
        {/* 1. Home */}
        <button
          onClick={() => handleSelectView("dashboard")}
          className={`flex flex-col items-center justify-center py-1 px-2 rounded-xl transition-all min-w-[50px] ${
            currentView === "dashboard"
              ? "text-indigo-600 dark:text-indigo-400 font-bold"
              : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
          }`}
        >
          <LayoutDashboard className={`w-5 h-5 ${currentView === "dashboard" ? "scale-110" : ""}`} />
          <span className="text-[10px] mt-0.5 font-medium">Home</span>
        </button>

        {/* 2. AI Tutor */}
        <button
          onClick={() => handleSelectView("ai-tutor")}
          className={`flex flex-col items-center justify-center py-1 px-2 rounded-xl transition-all min-w-[50px] ${
            currentView === "ai-tutor"
              ? "text-indigo-600 dark:text-indigo-400 font-bold"
              : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
          }`}
        >
          <Bot className={`w-5 h-5 ${currentView === "ai-tutor" ? "scale-110" : ""}`} />
          <span className="text-[10px] mt-0.5 font-medium">AI Tutor</span>
        </button>

        {/* 3. Elevated Center Quick Action (+) Button */}
        <button
          onClick={() => setIsQuickActionOpen(true)}
          className="flex flex-col items-center justify-center -mt-5 group"
          aria-label="Quick Action"
        >
          <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-indigo-600 via-indigo-500 to-blue-500 text-white flex items-center justify-center shadow-lg shadow-indigo-600/30 group-active:scale-95 transition-transform border-4 border-white dark:border-slate-900">
            <Plus className="w-6 h-6 stroke-[2.5]" />
          </div>
          <span className="text-[10px] mt-0.5 font-bold text-indigo-600 dark:text-indigo-400">Action</span>
        </button>

        {/* 4. Scholar Shorts / Videos */}
        <button
          onClick={() => handleSelectView("scholar-shorts")}
          className={`flex flex-col items-center justify-center py-1 px-2 rounded-xl transition-all min-w-[50px] ${
            currentView === "scholar-shorts" || currentView === "scholar-videos"
              ? "text-indigo-600 dark:text-indigo-400 font-bold"
              : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
          }`}
        >
          <Flame className={`w-5 h-5 ${currentView === "scholar-shorts" || currentView === "scholar-videos" ? "scale-110" : ""}`} />
          <span className="text-[10px] mt-0.5 font-medium">Shorts</span>
        </button>

        {/* 5. All Tools / Options Drawer Button */}
        <button
          onClick={() => setIsDrawerOpen(true)}
          className={`flex flex-col items-center justify-center py-1 px-2 rounded-xl transition-all min-w-[50px] ${
            isDrawerOpen
              ? "text-indigo-600 dark:text-indigo-400 font-bold"
              : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
          }`}
        >
          <Grid className={`w-5 h-5 ${isDrawerOpen ? "scale-110" : ""}`} />
          <span className="text-[10px] mt-0.5 font-medium">All (20+)</span>
        </button>
      </nav>
    </>
  );
};
