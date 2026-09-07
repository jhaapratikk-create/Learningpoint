import React, { useState } from "react";
import {
  BookOpen,
  CheckCircle2,
  Circle,
  Trophy,
  Bot,
  FileText,
  Search,
  ChevronDown,
  ChevronUp,
  Layers,
  Award,
  Sparkles,
  Zap,
  Clock,
  ArrowRight,
  Calculator,
  GraduationCap,
  HelpCircle,
  Youtube,
  ExternalLink,
} from "lucide-react";
import { useStudy } from "../../context/StudyContext";
import { useAuth } from "../../context/AuthContext";
import { EducationBoard, SyllabusChapter, SyllabusSubject } from "../../types";
import { getYouTubeSearchUrl } from "../../data/videoLecturesData";

export const SyllabusView: React.FC = () => {
  const {
    syllabusData,
    toggleSyllabusTopic,
    launchSyllabusTest,
    setCurrentView,
    addToast,
    selectedBoard,
    setSelectedBoard,
    updateSyllabusWithAI,
  } = useStudy();
  const { user } = useAuth();

  const defaultClass = user?.grade?.includes("9")
    ? "Class 9"
    : user?.grade?.includes("10")
    ? "Class 10"
    : user?.grade?.includes("11")
    ? "Class 11"
    : user?.grade?.includes("12")
    ? "Class 12"
    : "Class 9";

  const [selectedClass, setSelectedClass] = useState<string>(defaultClass);
  const [selectedBoardFilter, setSelectedBoardFilter] = useState<string>(user?.board || selectedBoard || "CBSE");
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>(() => {
    const defaultSub = syllabusData.find((s) => s.classGrade.includes(defaultClass));
    return defaultSub?.id || syllabusData[0]?.id || "";
  });
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [expandedChapterId, setExpandedChapterId] = useState<string | null>(
    syllabusData[0]?.chapters[0]?.id || null
  );
  const [activeFormulaModal, setActiveFormulaModal] = useState<SyllabusChapter | null>(null);
  const [isUpdatingWithAi, setIsUpdatingWithAi] = useState<boolean>(false);

  // Available classes in syllabus
  const classList = ["All Classes", "Class 9", "Class 10", "Class 11", "Class 12", "Competitive Exams"];
  const boardFilterList = ["All Boards", "CBSE", "ICSE", "State Board", "Cambridge IGCSE", "IB"];

  // Filter subjects based on class filter & board filter
  const filteredSubjects = syllabusData.filter((sub) => {
    const matchesClass = selectedClass === "All Classes" || sub.classGrade.includes(selectedClass);
    const matchesBoard = selectedBoardFilter === "All Boards" || !sub.board || sub.board === selectedBoardFilter;
    return matchesClass && matchesBoard;
  });

  const activeSubject: SyllabusSubject | undefined =
    filteredSubjects.find((s) => s.id === selectedSubjectId) || filteredSubjects[0];

  const handleAiUpdateSyllabus = async () => {
    if (!activeSubject) return;
    setIsUpdatingWithAi(true);
    try {
      const boardToUse = (activeSubject.board as EducationBoard) || selectedBoard || "CBSE";
      await updateSyllabusWithAI({
        board: boardToUse,
        classGrade: activeSubject.classGrade,
        subject: activeSubject.name,
      });
    } catch {
      // Handled in context
    } finally {
      setIsUpdatingWithAi(false);
    }
  };

  // Calculate statistics for active subject
  const totalTopicsCount = activeSubject
    ? activeSubject.chapters.reduce((acc, ch) => acc + ch.topics.length, 0)
    : 0;
  const completedTopicsCount = activeSubject
    ? activeSubject.chapters.reduce(
        (acc, ch) => acc + ch.topics.filter((t) => t.isCompleted).length,
        0
      )
    : 0;
  const completionPercentage = totalTopicsCount
    ? Math.round((completedTopicsCount / totalTopicsCount) * 100)
    : 0;

  // Filter chapters based on search query
  const filteredChapters = activeSubject?.chapters.filter((ch) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      ch.title.toLowerCase().includes(q) ||
      ch.summary.toLowerCase().includes(q) ||
      ch.topics.some((t) => t.title.toLowerCase().includes(q))
    );
  }) || [];

  const handleLaunchTest = (chapter: SyllabusChapter) => {
    if (!activeSubject) return;
    launchSyllabusTest(chapter, activeSubject.name);
    addToast(`Test Started: ${chapter.title} 🏆`, "Answer all questions to analyze your mastery.");
  };

  const handleAskAITutor = (chapterTitle: string) => {
    setCurrentView("ai-tutor");
    addToast("Switched to AI Tutor 🤖", `Ask any question on ${chapterTitle}`);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto space-y-6 animate-in fade-in duration-300">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white p-6 sm:p-8 shadow-xl">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded-full bg-blue-500/30 text-blue-200 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
                <GraduationCap className="w-3.5 h-3.5" />
                Latest 2025-2026 Curriculum Blueprint
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-200 text-xs font-bold">
                CBSE • NCERT • JEE • NEET
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Class & Exam Syllabus Hub 📚
            </h1>
            <p className="text-indigo-200 text-xs sm:text-sm mt-1.5 max-w-xl">
              Track chapter-wise weightage, tick off completed topics, view formula sheets, and take diagnostic chapter tests with 1-click.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setCurrentView("tests")}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-pink-600 hover:bg-pink-700 text-white text-xs font-bold shadow-lg shadow-pink-600/30 transition-all active:scale-95"
            >
              <Trophy className="w-4 h-4" />
              <span>Full Mock Tests</span>
            </button>
            <button
              onClick={() => setCurrentView("profile")}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold backdrop-blur-md transition-all border border-white/10"
            >
              <GraduationCap className="w-4 h-4 text-indigo-300" />
              <span>My Class: {user?.grade?.split(" ")[0] || "Class 12"}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Class & Board Level Selector & Search Filter */}
      <div className="space-y-3">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          {/* Class Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
            {classList.map((cls) => (
              <button
                key={cls}
                onClick={() => {
                  setSelectedClass(cls);
                  const matching = syllabusData.find((s) => cls === "All Classes" || s.classGrade.includes(cls));
                  if (matching) setSelectedSubjectId(matching.id);
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                  selectedClass === cls
                    ? "bg-indigo-600 text-white shadow-md shadow-indigo-500/20"
                    : "bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800"
                }`}
              >
                {cls}
              </button>
            ))}
          </div>

          {/* Search topic or chapter */}
          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search chapter or topic..."
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-medium text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
          </div>
        </div>

        {/* Board Switcher Filter */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none text-xs">
          <span className="text-[11px] font-bold text-slate-400 shrink-0 uppercase tracking-wider">
            Board Filter:
          </span>
          {boardFilterList.map((b) => (
            <button
              key={b}
              onClick={() => setSelectedBoardFilter(b)}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors whitespace-nowrap ${
                selectedBoardFilter === b
                  ? "bg-pink-600 text-white shadow-sm"
                  : "bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              {b}
            </button>
          ))}
        </div>
      </div>

      {/* Subject Tabs */}
      <div className="flex items-center gap-2.5 overflow-x-auto pb-2 scrollbar-none">
        {filteredSubjects.map((sub) => {
          const isSelected = activeSubject?.id === sub.id;
          return (
            <button
              key={sub.id}
              onClick={() => {
                setSelectedSubjectId(sub.id);
                setExpandedChapterId(sub.chapters[0]?.id || null);
              }}
              className={`flex items-center gap-2.5 px-4 py-2.5 rounded-2xl transition-all border shrink-0 ${
                isSelected
                  ? "bg-slate-900 dark:bg-white text-white dark:text-slate-900 border-slate-900 dark:border-white shadow-md"
                  : "bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:border-slate-300"
              }`}
            >
              <div className={`w-2.5 h-2.5 rounded-full bg-gradient-to-r ${sub.color}`} />
              <span className="text-xs font-bold">{sub.name}</span>
              <span className={`text-[10px] px-1.5 py-0.5 rounded-md font-semibold ${
                isSelected ? "bg-white/20 dark:bg-slate-900/20" : "bg-slate-100 dark:bg-slate-800 text-slate-500"
              }`}>
                {sub.chapters.length} Ch
              </span>
            </button>
          );
        })}
      </div>

      {/* Active Subject Overview Card */}
      {activeSubject && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-lg font-extrabold text-slate-900 dark:text-white">
                  {activeSubject.name}
                </h2>
                <span className="text-xs font-mono px-2 py-0.5 rounded bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 font-bold">
                  {activeSubject.code}
                </span>
                <span className="text-xs font-semibold px-2 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400">
                  Total {activeSubject.totalMarks} Marks
                </span>
                {activeSubject.board && (
                  <span className="text-xs font-bold px-2 py-0.5 rounded bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border border-purple-200/50">
                    {activeSubject.board} Board
                  </span>
                )}
                {activeSubject.isNewNcert && (
                  <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-emerald-500" />
                    Rationalized New NCERT 2025-26
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                {activeSubject.description}
              </p>
            </div>

            {/* AI Update button & Overall Syllabus Completion Progress */}
            <div className="flex items-center gap-4 flex-wrap sm:flex-nowrap">
              <button
                type="button"
                onClick={handleAiUpdateSyllabus}
                disabled={isUpdatingWithAi}
                className="flex items-center gap-2 px-3.5 py-2.5 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white text-xs font-bold shadow-md shadow-indigo-500/20 disabled:opacity-50 transition-all shrink-0"
                title="Verify and update syllabus with AI for the latest rationalized syllabus"
              >
                <Sparkles className={`w-4 h-4 ${isUpdatingWithAi ? "animate-spin" : "text-amber-300"}`} />
                <span>{isUpdatingWithAi ? "Updating with AI..." : `Verify with AI (${activeSubject.board || selectedBoard})`}</span>
              </button>

              <div className="flex items-center gap-4 bg-slate-50 dark:bg-slate-800/80 p-3 rounded-2xl border border-slate-100 dark:border-slate-700/60 shrink-0">
                <div className="text-right">
                  <p className="text-[11px] font-bold text-slate-500 dark:text-slate-400">Syllabus Mastered</p>
                  <p className="text-base font-black text-indigo-600 dark:text-indigo-400">
                    {completedTopicsCount} / {totalTopicsCount} Topics ({completionPercentage}%)
                  </p>
                </div>
                <div className="w-12 h-12 relative flex items-center justify-center">
                  <svg className="w-12 h-12 transform -rotate-90">
                    <circle
                      cx="24"
                      cy="24"
                      r="18"
                      stroke="currentColor"
                      strokeWidth="4"
                      className="text-slate-200 dark:text-slate-700 fill-none"
                    />
                    <circle
                      cx="24"
                      cy="24"
                      r="18"
                      stroke="currentColor"
                      strokeWidth="4"
                      strokeDasharray={113}
                      strokeDashoffset={113 - (113 * completionPercentage) / 100}
                      className="text-indigo-600 dark:text-indigo-400 fill-none transition-all duration-500 stroke-round"
                    />
                  </svg>
                  <span className="absolute text-[10px] font-extrabold">{completionPercentage}%</span>
                </div>
              </div>
            </div>
          </div>

          {/* Exam Pattern Summary */}
          <div className="p-3.5 rounded-2xl bg-indigo-50/70 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/40 flex items-start gap-3 text-xs text-indigo-950 dark:text-indigo-200">
            <Zap className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold">Exam Blueprint & Marking Pattern: </span>
              {activeSubject.examPatternSummary}
            </div>
          </div>
        </div>
      )}

      {/* Chapters Accordion List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <span>Chapter-Wise Syllabus Breakdown ({filteredChapters.length})</span>
          </h3>
          <span className="text-xs text-slate-400">Click chapter to view topics & test</span>
        </div>

        {filteredChapters.map((chapter) => {
          const isExpanded = expandedChapterId === chapter.id;
          const chapterCompletedTopics = chapter.topics.filter((t) => t.isCompleted).length;
          const chapterPercent = Math.round((chapterCompletedTopics / chapter.topics.length) * 100);

          return (
            <div
              key={chapter.id}
              className={`bg-white dark:bg-slate-900 rounded-3xl border transition-all overflow-hidden ${
                isExpanded
                  ? "border-indigo-400 dark:border-indigo-600 shadow-md ring-1 ring-indigo-500/10"
                  : "border-slate-200 dark:border-slate-800 hover:border-slate-300"
              }`}
            >
              {/* Chapter Card Header */}
              <div
                onClick={() => setExpandedChapterId(isExpanded ? null : chapter.id)}
                className="p-5 sm:p-6 cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4 select-none"
              >
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-extrabold text-sm shrink-0 border border-indigo-100 dark:border-indigo-900">
                    {chapter.order}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="text-base font-bold text-slate-900 dark:text-white">
                        {chapter.title}
                      </h4>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          chapter.difficulty === "Easy"
                            ? "bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400"
                            : chapter.difficulty === "Medium"
                            ? "bg-amber-50 dark:bg-amber-950 text-amber-600 dark:text-amber-400"
                            : "bg-rose-50 dark:bg-rose-950 text-rose-600 dark:text-rose-400"
                        }`}
                      >
                        {chapter.difficulty}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-1">
                      {chapter.summary}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-4 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100 dark:border-slate-800">
                  {/* Weightage info */}
                  <div className="text-left sm:text-right">
                    <p className="text-xs font-bold text-indigo-600 dark:text-indigo-400">
                      {chapter.weightageMarks} Marks ({chapter.weightagePercent}%)
                    </p>
                    <p className="text-[11px] text-slate-400">
                      {chapterCompletedTopics}/{chapter.topics.length} topics done
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    {/* Progress Bar mini */}
                    <div className="w-16 h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden hidden sm:block">
                      <div
                        className="h-full bg-indigo-600 rounded-full transition-all duration-300"
                        style={{ width: `${chapterPercent}%` }}
                      />
                    </div>
                    {isExpanded ? (
                      <ChevronUp className="w-5 h-5 text-slate-400" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-slate-400" />
                    )}
                  </div>
                </div>
              </div>

              {/* Expanded Topic Checklist & Actions */}
              {isExpanded && (
                <div className="px-5 pb-6 sm:px-6 pt-2 border-t border-slate-100 dark:border-slate-800/80 space-y-5 bg-slate-50/50 dark:bg-slate-900/50 animate-in fade-in duration-200">
                  {/* Summary & Exam Core */}
                  <div className="p-4 rounded-2xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/60 space-y-2">
                    <p className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                      Core Concept Summary
                    </p>
                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                      {chapter.summary}
                    </p>
                  </div>

                  {/* Topic Checklist */}
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-300">
                      <span>Curriculum Topics Checklist</span>
                      <span className="text-[11px] text-indigo-600 dark:text-indigo-400">
                        Check off as you revise
                      </span>
                    </div>

                    <div className="space-y-2">
                      {chapter.topics.map((topic) => (
                        <div
                          key={topic.id}
                          onClick={() => {
                            if (activeSubject) {
                              toggleSyllabusTopic(activeSubject.id, chapter.id, topic.id);
                              addToast(
                                topic.isCompleted ? "Topic marked for review ⏳" : "Topic Completed! 🎉",
                                topic.title,
                                "success"
                              );
                            }
                          }}
                          className={`flex items-center justify-between p-3 rounded-2xl cursor-pointer transition-all border ${
                            topic.isCompleted
                              ? "bg-emerald-50/60 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-900/60 text-slate-900 dark:text-white"
                              : "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700/60 hover:border-indigo-300 dark:hover:border-indigo-700 text-slate-800 dark:text-slate-200"
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            {topic.isCompleted ? (
                              <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                            ) : (
                              <Circle className="w-5 h-5 text-slate-300 dark:text-slate-600 shrink-0" />
                            )}
                            <span
                              className={`text-xs font-semibold ${
                                topic.isCompleted ? "line-through text-slate-400 dark:text-slate-500" : ""
                              }`}
                            >
                              {topic.title}
                            </span>
                          </div>

                          <div className="flex items-center gap-2">
                            {topic.isImportant && (
                              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-50 dark:bg-rose-950 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-900">
                                High Weightage
                              </span>
                            )}
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                const url = getYouTubeSearchUrl(topic.title, `${activeSubject?.name || ""} ${chapter.title}`);
                                window.open(url, "_blank", "noopener,noreferrer");
                                addToast(`Opening YouTube lecture for "${topic.title}"...`, "success");
                              }}
                              className="px-2 py-1 rounded-lg bg-red-50 dark:bg-red-950/50 hover:bg-red-100 dark:hover:bg-red-900/60 text-red-600 dark:text-red-300 text-[10px] font-bold border border-red-200/60 dark:border-red-900/40 flex items-center gap-1 transition-all"
                              title="Watch YouTube Lecture"
                            >
                              <Youtube className="w-3 h-3 text-red-600" />
                              <span className="hidden sm:inline">YouTube Lecture</span>
                              <ExternalLink className="w-2.5 h-2.5" />
                            </button>
                            <span className="text-[11px] text-slate-400 hover:text-indigo-600 font-medium">
                              {topic.isCompleted ? "Completed" : "Mark Done"}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Chapter Quick Actions */}
                  <div className="flex flex-wrap items-center gap-3 pt-2">
                    <button
                      onClick={() => {
                        setCurrentView("smart-notes");
                        addToast(`Switched to Smart Notes 📝`, `Generating notes for ${chapter.title}`);
                      }}
                      className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-purple-50 dark:bg-purple-950/50 hover:bg-purple-100 text-purple-700 dark:text-purple-300 text-xs font-bold border border-purple-200 dark:border-purple-800/40 shadow-sm transition-all active:scale-95"
                    >
                      <Sparkles className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                      <span>Generate Smart Notes</span>
                    </button>

                    <button
                      onClick={() => handleLaunchTest(chapter)}
                      className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md shadow-indigo-500/20 transition-all active:scale-95"
                    >
                      <Trophy className="w-4 h-4" />
                      <span>Take Chapter Diagnostic Test</span>
                    </button>

                    <button
                      onClick={() => {
                        const url = getYouTubeSearchUrl(chapter.title, `${activeSubject?.name || ""} one shot full chapter lecture`);
                        window.open(url, "_blank", "noopener,noreferrer");
                        addToast(`Opening YouTube full chapter lecture for "${chapter.title}"...`, "success");
                      }}
                      className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-red-50 dark:bg-red-950/50 hover:bg-red-100 text-red-700 dark:text-red-300 text-xs font-bold border border-red-200 dark:border-red-900/40 transition-all"
                    >
                      <Youtube className="w-4 h-4 text-red-600" />
                      <span>Watch Chapter on YouTube</span>
                      <ExternalLink className="w-3 h-3 text-red-500" />
                    </button>

                    <button
                      onClick={() => handleAskAITutor(chapter.title)}
                      className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold border border-slate-200 dark:border-slate-700 transition-all"
                    >
                      <Bot className="w-4 h-4 text-indigo-500" />
                      <span>Ask AI Tutor About This</span>
                    </button>

                    {chapter.formulaSheetAvailable && (
                      <button
                        onClick={() => setActiveFormulaModal(chapter)}
                        className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/50 hover:bg-amber-100 text-amber-700 dark:text-amber-300 text-xs font-semibold border border-amber-200/60 dark:border-amber-800/40 transition-all"
                      >
                        <Calculator className="w-4 h-4" />
                        <span>View Key Formulas Sheet</span>
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Key Formula Modal */}
      {activeFormulaModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 max-w-lg w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-amber-50 dark:bg-amber-950 text-amber-600">
                  <Calculator className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                    {activeFormulaModal.title} - Key Formulas
                  </h3>
                  <p className="text-[11px] text-slate-400">High-yield equations & identities</p>
                </div>
              </div>
              <button
                onClick={() => setActiveFormulaModal(null)}
                className="p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 space-y-1">
                <p className="text-xs font-bold text-indigo-600 dark:text-indigo-400">Essential Formula 1</p>
                <p className="font-mono text-xs font-semibold text-slate-900 dark:text-white">
                  f(x) = ∫ u·v dx = u·∫v dx - ∫ [u' · (∫v dx)] dx (ILATE rule)
                </p>
                <p className="text-[11px] text-slate-500">Standard integration by parts relationship.</p>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 space-y-1">
                <p className="text-xs font-bold text-indigo-600 dark:text-indigo-400">Essential Formula 2</p>
                <p className="font-mono text-xs font-semibold text-slate-900 dark:text-white">
                  ∫ [f'(x) / f(x)] dx = ln |f(x)| + C
                </p>
                <p className="text-[11px] text-slate-500">Logarithmic derivative substitution identity.</p>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 space-y-1">
                <p className="text-xs font-bold text-indigo-600 dark:text-indigo-400">Exam Shortcut & Property</p>
                <p className="font-mono text-xs font-semibold text-slate-900 dark:text-white">
                  ∫ [a to b] f(x) dx = ∫ [a to b] f(a + b - x) dx (King Property)
                </p>
                <p className="text-[11px] text-slate-500">Essential for simplifying definite integrals in board exams.</p>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setActiveFormulaModal(null)}
                className="px-4 py-2 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs font-bold transition-all"
              >
                Close Sheet
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
