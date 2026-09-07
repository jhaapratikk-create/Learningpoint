import React, { useState } from "react";
import {
  Trophy,
  Timer,
  BookOpen,
  Zap,
  Sparkles,
  Play,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  Flame,
  ArrowRight,
  Sliders,
  Award,
  Layers,
  GraduationCap,
  Calendar,
  FileText,
  Youtube,
  ExternalLink,
  PenTool,
} from "lucide-react";
import { useStudy } from "../../context/StudyContext";
import { useAuth } from "../../context/AuthContext";
import { Quiz, Question, SubjectivePaper } from "../../types";
import { INITIAL_SUBJECTIVE_PAPERS } from "../../data/subjectiveTestsData";
import { SubjectiveTestRunner } from "./SubjectiveTestRunner";
import { AITestPaperGenerator } from "./AITestPaperGenerator";
import { getYouTubeSearchUrl } from "../../data/videoLecturesData";

const MOCK_EXAM_PRESETS: {
  id: string;
  title: string;
  classGrade: string;
  subject: string;
  questionsCount: number;
  timeLimitMinutes: number;
  difficulty: "Easy" | "Medium" | "Hard" | "Mixed";
  badge: string;
  description: string;
}[] = [
  {
    id: "mock_c12_math_board",
    title: "Class 12 Mathematics Full Board Simulation 2026",
    classGrade: "Class 12",
    subject: "Mathematics",
    questionsCount: 20,
    timeLimitMinutes: 30,
    difficulty: "Hard",
    badge: "Official Pattern",
    description: "Full syllabus calculus, vectors, 3D geometry and matrices with authentic board exam difficulty.",
  },
  {
    id: "mock_c12_phy_board",
    title: "Class 12 Physics Term & Board Mock Exam",
    classGrade: "Class 12",
    subject: "Physics",
    questionsCount: 18,
    timeLimitMinutes: 25,
    difficulty: "Hard",
    badge: "High Yield",
    description: "Electrostatics, current electricity, optics and semiconductor devices with numericals.",
  },
  {
    id: "mock_c10_sci_board",
    title: "Class 10 Science All-Chapter Comprehensive Test",
    classGrade: "Class 10",
    subject: "Science",
    questionsCount: 20,
    timeLimitMinutes: 25,
    difficulty: "Medium",
    badge: "Top Scorer",
    description: "Chemical reactions, life processes, light reflection & electricity complete diagnosis.",
  },
  {
    id: "mock_c10_math_board",
    title: "Class 10 Mathematics Standard Mock Paper",
    classGrade: "Class 10",
    subject: "Mathematics",
    questionsCount: 15,
    timeLimitMinutes: 20,
    difficulty: "Medium",
    badge: "Standard",
    description: "Quadratic equations, trigonometry, similar triangles & statistics high-frequency questions.",
  },
  {
    id: "mock_jee_speed_test",
    title: "JEE Main Speed & Accuracy Challenge",
    classGrade: "Competitive Exams",
    subject: "Competitive Foundation",
    questionsCount: 25,
    timeLimitMinutes: 35,
    difficulty: "Hard",
    badge: "IIT JEE Special",
    description: "Advanced physics rigid bodies and physical chemistry numericals with +4/-1 scoring simulation.",
  },
  {
    id: "mock_neet_bio_sprint",
    title: "NEET UG Biology & Physics Rapid Sprint",
    classGrade: "Competitive Exams",
    subject: "Biology & Physics",
    questionsCount: 30,
    timeLimitMinutes: 30,
    difficulty: "Medium",
    badge: "NEET Sprint",
    description: "High-speed human physiology, genetics, circuits and optics timed drill.",
  },
];

export const TestCenterView: React.FC = () => {
  const {
    quizzes,
    startQuiz,
    launchCustomTest,
    mistakes,
    subjects,
    syllabusData,
    setCurrentView,
    addToast,
  } = useStudy();
  const { user } = useAuth();

  const [activeTab, setActiveTab] = useState<
    "subjective-tests" | "ai-test-paper" | "mock-exams" | "custom-generator" | "chapter-tests" | "mistake-test"
  >("subjective-tests");

  // Subjective Paper Runner Modal State
  const [activeSubjectivePaper, setActiveSubjectivePaper] = useState<SubjectivePaper | null>(null);
  const [subjectivePapers, setSubjectivePapers] = useState<SubjectivePaper[]>(INITIAL_SUBJECTIVE_PAPERS);

  // Custom Test Builder state
  const [customSubject, setCustomSubject] = useState(subjects[0]?.name || "Mathematics");
  const [customTitle, setCustomTitle] = useState("Custom Practice Test");
  const [customQuestionCount, setCustomQuestionCount] = useState(10);
  const [customDifficulty, setCustomDifficulty] = useState<"Easy" | "Medium" | "Hard" | "Mixed">("Medium");
  const [customTimeLimit, setCustomTimeLimit] = useState(15);

  const handleStartPresetMock = (preset: typeof MOCK_EXAM_PRESETS[0]) => {
    launchCustomTest({
      title: preset.title,
      subject: preset.subject,
      questionCount: preset.questionsCount,
      difficulty: preset.difficulty,
      timeLimitMinutes: preset.timeLimitMinutes,
    });
    addToast(`Mock Test Started: ${preset.title} ⏱️`, `${preset.questionsCount} Questions • ${preset.timeLimitMinutes} Mins`);
  };

  const handleGenerateCustomTest = (e: React.FormEvent) => {
    e.preventDefault();
    launchCustomTest({
      title: `${customSubject} - ${customTitle}`,
      subject: customSubject,
      questionCount: customQuestionCount,
      difficulty: customDifficulty,
      timeLimitMinutes: customTimeLimit,
    });
    addToast(`Generated ${customQuestionCount}-Question Test 🚀`, `Good luck with your practice!`);
  };

  const handleStartMistakeTest = () => {
    if (mistakes.length === 0) {
      addToast("No mistakes logged yet! 🎉", "Your mistake notebook is clean. Take other mock tests first.", "info");
      return;
    }

    const questions: Question[] = mistakes.slice(0, 10).map((m) => ({
      id: `mistake_q_${m.id}`,
      question: `[Mistake Review - ${m.subject}] ${m.question}`,
      type: "MCQ",
      options: [
        m.correctAnswer,
        "Distractor alternative that omits boundary criteria",
        "Inverse sign or reciprocal constant error",
        "Non-applicable empirical assumption",
      ],
      correctAnswer: m.correctAnswer,
      correctIndex: 0,
      explanation: m.explanation || `The correct concept is: ${m.correctAnswer}`,
      difficulty: "Hard",
      hint: `Remember your previous mistake: ${m.studentAnswer}`,
    }));

    const mistakeQuiz: Quiz = {
      id: `mistake_test_${Date.now()}`,
      title: "Mistake Notebook Revision Test",
      subjectId: "sub_math",
      difficulty: "Hard",
      totalQuestions: questions.length,
      timeLimitMinutes: Math.min(questions.length * 2, 20),
      questions,
      category: "Mistake Recovery",
    };

    startQuiz(mistakeQuiz);
    addToast("Mistake Revision Test Started 🎯", `Testing ${mistakeQuiz.questions.length} questions you previously struggled with.`);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto space-y-6 animate-in fade-in duration-300 pb-16">
      {/* Top Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-pink-900 via-purple-900 to-indigo-900 text-white p-6 sm:p-8 shadow-xl">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-72 h-72 bg-pink-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded-full bg-pink-500/30 text-pink-200 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
                <Trophy className="w-3.5 h-3.5" />
                Exam & Test Simulation Center
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-white/20 text-white text-xs font-bold">
                Student Class: {user?.grade?.split(" ")[0] || "Class 12"}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Test & Examination Hub 🎯
            </h1>
            <p className="text-pink-100 text-xs sm:text-sm mt-1.5 max-w-xl">
              Take full-length subjective board papers with step marking, timed mock simulations, or customize your own test suite with instant AI evaluation.
            </p>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            <button
              onClick={() => setActiveTab("subjective-tests")}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-pink-600 hover:bg-pink-700 text-white text-xs font-bold shadow-lg shadow-pink-600/30 transition-all active:scale-95 border border-pink-400/30"
            >
              <PenTool className="w-4 h-4 text-pink-200" />
              <span>Subjective Tests</span>
            </button>
            <button
              onClick={handleStartMistakeTest}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white text-pink-900 hover:bg-pink-50 text-xs font-bold shadow-lg transition-all active:scale-95"
            >
              <RotateCcw className="w-4 h-4 text-pink-600" />
              <span>Mistake Test ({mistakes.length})</span>
            </button>
          </div>
        </div>
      </div>

      {/* Test Center Navigation Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        <button
          onClick={() => setActiveTab("subjective-tests")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold transition-all shrink-0 ${
            activeTab === "subjective-tests"
              ? "bg-pink-600 text-white shadow-md shadow-pink-500/20"
              : "bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800"
          }`}
        >
          <PenTool className="w-4 h-4" />
          <span>Subjective Board Tests</span>
          <span className="px-1.5 py-0.2 rounded-full bg-amber-400 text-slate-950 font-black text-[9px]">
            NEW
          </span>
        </button>

        <button
          onClick={() => setActiveTab("ai-test-paper")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold transition-all shrink-0 ${
            activeTab === "ai-test-paper"
              ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-indigo-500/20"
              : "bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800"
          }`}
        >
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span>Gemini AI Test Paper Architect</span>
          <span className="px-1.5 py-0.2 rounded-full bg-indigo-500 text-white font-black text-[9px]">
            AI
          </span>
        </button>

        <button
          onClick={() => setActiveTab("mock-exams")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold transition-all shrink-0 ${
            activeTab === "mock-exams"
              ? "bg-pink-600 text-white shadow-md shadow-pink-500/20"
              : "bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800"
          }`}
        >
          <Trophy className="w-4 h-4" />
          <span>Full-Length MCQ Mocks</span>
        </button>

        <button
          onClick={() => setActiveTab("custom-generator")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold transition-all shrink-0 ${
            activeTab === "custom-generator"
              ? "bg-pink-600 text-white shadow-md shadow-pink-500/20"
              : "bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800"
          }`}
        >
          <Sliders className="w-4 h-4" />
          <span>AI Custom Test Builder</span>
        </button>

        <button
          onClick={() => setActiveTab("chapter-tests")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold transition-all shrink-0 ${
            activeTab === "chapter-tests"
              ? "bg-pink-600 text-white shadow-md shadow-pink-500/20"
              : "bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800"
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>Chapter-Wise Diagnostics</span>
        </button>

        <button
          onClick={() => setActiveTab("mistake-test")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold transition-all shrink-0 ${
            activeTab === "mistake-test"
              ? "bg-pink-600 text-white shadow-md shadow-pink-500/20"
              : "bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800"
          }`}
        >
          <RotateCcw className="w-4 h-4" />
          <span>Mistake Drill ({mistakes.length})</span>
        </button>
      </div>

      {/* Tab: Gemini AI Test Paper Architect */}
      {activeTab === "ai-test-paper" && <AITestPaperGenerator />}

      {/* Tab: Subjective Board Tests */}
      {activeTab === "subjective-tests" && (
        <div className="space-y-6">
          <div className="p-4 sm:p-5 rounded-3xl bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <PenTool className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                  Subjective Question Papers & Derivations
                </h2>
              </div>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-2xl">
                Practice official 2-mark short answers, 3-mark conceptual proofs, and 5-mark long answer derivations with <strong>Official Step-Marking</strong> and <strong>AI Answer Evaluation</strong> against ideal model solutions.
              </p>
            </div>

            <button
              onClick={() => {
                const firstPaper = subjectivePapers[0];
                if (firstPaper) setActiveSubjectivePaper(firstPaper);
              }}
              className="px-5 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs sm:text-sm shadow-md shadow-indigo-600/30 flex items-center gap-2 shrink-0 active:scale-95 transition-all"
            >
              <Play className="w-4 h-4 fill-white" />
              <span>Start Featured Paper</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {subjectivePapers.map((paper) => {
              const secACount = paper.questions.filter((q) => q.marks <= 2).length;
              const secBCount = paper.questions.filter((q) => q.marks === 3).length;
              const secCCount = paper.questions.filter((q) => q.marks >= 5).length;

              return (
                <div
                  key={paper.id}
                  className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm hover:border-pink-300 dark:hover:border-pink-700 transition-all flex flex-col justify-between space-y-4 group"
                >
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-900">
                        {paper.badge}
                      </span>
                      <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
                        {paper.classGrade} • {paper.subject}
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-pink-600 dark:group-hover:text-pink-400 transition-colors leading-snug">
                      {paper.title}
                    </h3>

                    <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                      {paper.description}
                    </p>

                    {/* Section Breakdown Badges */}
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-[11px] font-medium text-slate-600 dark:text-slate-300">
                        2M Short ({secACount})
                      </span>
                      <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-[11px] font-medium text-slate-600 dark:text-slate-300">
                        3M Conceptual ({secBCount})
                      </span>
                      <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-[11px] font-medium text-slate-600 dark:text-slate-300">
                        5M Derivations ({secCCount})
                      </span>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs text-slate-500 font-bold">
                      <span className="flex items-center gap-1">
                        <Timer className="w-3.5 h-3.5 text-slate-400" />
                        {paper.timeLimitMinutes}m
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1 text-pink-600 dark:text-pink-400 font-extrabold">
                        <Award className="w-3.5 h-3.5" />
                        {paper.totalMarks} Marks
                      </span>
                    </div>

                    <button
                      onClick={() => setActiveSubjectivePaper(paper)}
                      className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-pink-600 hover:bg-pink-700 text-white text-xs font-extrabold shadow-md shadow-pink-500/20 active:scale-95 transition-all"
                    >
                      <Play className="w-3.5 h-3.5 fill-white" />
                      <span>Write Paper</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Tab 1: Full-Length Mock Exams */}
      {activeTab === "mock-exams" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              Official Class & Entrance Mock Papers
            </h2>
            <span className="text-xs text-slate-400">Realistic timer & negative marking simulation</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {MOCK_EXAM_PRESETS.map((mock) => (
              <div
                key={mock.id}
                className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm hover:border-pink-300 dark:hover:border-pink-700 transition-all flex flex-col justify-between space-y-4 group"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-pink-50 dark:bg-pink-950 text-pink-600 dark:text-pink-400 border border-pink-200 dark:border-pink-900">
                      {mock.badge}
                    </span>
                    <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                      {mock.classGrade}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-pink-600 dark:group-hover:text-pink-400 transition-colors">
                    {mock.title}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                    {mock.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-3 text-xs text-slate-500 font-medium">
                    <span className="flex items-center gap-1">
                      <Timer className="w-3.5 h-3.5 text-slate-400" />
                      {mock.timeLimitMinutes} mins
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Trophy className="w-3.5 h-3.5 text-slate-400" />
                      {mock.questionsCount} Questions
                    </span>
                  </div>

                  <button
                    onClick={() => handleStartPresetMock(mock)}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-pink-600 hover:bg-pink-700 text-white text-xs font-bold shadow-md shadow-pink-500/20 active:scale-95 transition-all"
                  >
                    <Play className="w-3.5 h-3.5 fill-white" />
                    <span>Start Test</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 2: Custom Test Generator */}
      {activeTab === "custom-generator" && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-sm space-y-6">
          <div className="flex items-center gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
            <div className="p-2.5 rounded-2xl bg-pink-50 dark:bg-pink-950 text-pink-600">
              <Sliders className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">AI Custom Test Generator</h2>
              <p className="text-xs text-slate-500">Configure questions, timer, difficulty, and subjects on demand</p>
            </div>
          </div>

          <form onSubmit={handleGenerateCustomTest} className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                Select Subject
              </label>
              <select
                value={customSubject}
                onChange={(e) => setCustomSubject(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm font-medium text-slate-900 dark:text-white focus:ring-2 focus:ring-pink-500 focus:outline-none"
              >
                {subjects.map((sub) => (
                  <option key={sub.id} value={sub.name}>
                    {sub.name}
                  </option>
                ))}
                <option value="All Subjects (Combined Mixed)">All Subjects (Combined Mixed)</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                Test Title / Topic Focus
              </label>
              <input
                type="text"
                value={customTitle}
                onChange={(e) => setCustomTitle(e.target.value)}
                placeholder="e.g. Calculus & Vectors Speed Drill"
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm font-medium text-slate-900 dark:text-white focus:ring-2 focus:ring-pink-500 focus:outline-none"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                Number of Questions
              </label>
              <div className="grid grid-cols-4 gap-2">
                {[5, 10, 20, 30].map((num) => (
                  <button
                    key={num}
                    type="button"
                    onClick={() => setCustomQuestionCount(num)}
                    className={`py-2 rounded-xl text-xs font-bold border transition-all ${
                      customQuestionCount === num
                        ? "bg-pink-600 text-white border-pink-600 shadow-sm"
                        : "bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700"
                    }`}
                  >
                    {num} Qs
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                Difficulty Level
              </label>
              <div className="grid grid-cols-4 gap-2">
                {(["Easy", "Medium", "Hard", "Mixed"] as const).map((diff) => (
                  <button
                    key={diff}
                    type="button"
                    onClick={() => setCustomDifficulty(diff)}
                    className={`py-2 rounded-xl text-xs font-bold border transition-all ${
                      customDifficulty === diff
                        ? "bg-pink-600 text-white border-pink-600 shadow-sm"
                        : "bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700"
                    }`}
                  >
                    {diff}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2 sm:col-span-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-700 dark:text-slate-300">
                  Timer Duration Limit
                </span>
                <span className="font-bold text-pink-600 dark:text-pink-400">
                  {customTimeLimit} Minutes ({Math.round((customTimeLimit * 60) / customQuestionCount)}s per question)
                </span>
              </div>
              <input
                type="range"
                min={5}
                max={60}
                step={5}
                value={customTimeLimit}
                onChange={(e) => setCustomTimeLimit(Number(e.target.value))}
                className="w-full accent-pink-600 h-2 bg-slate-100 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer"
              />
            </div>

            <div className="sm:col-span-2 pt-2 flex justify-end">
              <button
                type="submit"
                className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-pink-600 hover:bg-pink-700 text-white text-xs font-bold shadow-lg shadow-pink-600/30 active:scale-95 transition-all"
              >
                <Sparkles className="w-4 h-4" />
                <span>Launch Custom AI Test Now</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Tab 3: Chapter-Wise Diagnostics */}
      {activeTab === "chapter-tests" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              Syllabus Chapter-Wise Diagnostic Tests
            </h2>
            <span className="text-xs text-slate-400">Short 10-15 min unit assessments</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {syllabusData.flatMap((sub) =>
              sub.chapters.map((ch) => ({ ...ch, subjectName: sub.name, subjectColor: sub.color }))
            ).map((ch) => (
              <div
                key={ch.id}
                className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm hover:border-pink-300 dark:hover:border-pink-700 transition-all flex flex-col justify-between space-y-3"
              >
                <div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                    {ch.subjectName}
                  </span>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white mt-1.5 line-clamp-1">
                    {ch.title}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1 line-clamp-2">{ch.summary}</p>
                </div>

                <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <span className="text-xs font-bold text-pink-600 dark:text-pink-400">
                    {ch.weightageMarks} Marks
                  </span>
                  <button
                    onClick={() => {
                      launchCustomTest({
                        title: `${ch.title} Diagnostic`,
                        subject: ch.subjectName,
                        questionCount: Math.max(ch.topics.length * 2, 6),
                        difficulty: ch.difficulty,
                        timeLimitMinutes: 15,
                      });
                      addToast(`Diagnostic Test Started 🏆`, ch.title);
                    }}
                    className="px-3 py-1.5 rounded-xl bg-pink-600 hover:bg-pink-700 text-white text-xs font-bold transition-all"
                  >
                    Take Test
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 4: Mistake Notebook Test */}
      {activeTab === "mistake-test" && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-sm space-y-6 text-center">
          <div className="w-16 h-16 rounded-3xl bg-pink-50 dark:bg-pink-950 text-pink-600 flex items-center justify-center mx-auto">
            <RotateCcw className="w-8 h-8" />
          </div>

          <div className="max-w-md mx-auto space-y-2">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              Targeted Mistake Re-Test
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Transform weak areas into strong points. We will generate a dedicated test exclusively featuring the concepts and questions you previously got wrong.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-pink-50/60 dark:bg-pink-950/40 border border-pink-100 dark:border-pink-900 max-w-sm mx-auto flex items-center justify-around">
            <div>
              <p className="text-xl font-extrabold text-pink-600 dark:text-pink-400">{mistakes.length}</p>
              <p className="text-[11px] text-slate-500 font-medium">Logged Mistakes</p>
            </div>
            <div className="h-8 w-px bg-pink-200 dark:bg-pink-800" />
            <div>
              <p className="text-xl font-extrabold text-emerald-600 dark:text-emerald-400">
                {mistakes.filter((m) => m.resolved).length}
              </p>
              <p className="text-[11px] text-slate-500 font-medium">Mastered</p>
            </div>
          </div>

          <div className="flex justify-center gap-3">
            <button
              onClick={handleStartMistakeTest}
              className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-pink-600 hover:bg-pink-700 text-white text-xs font-bold shadow-lg shadow-pink-600/30 active:scale-95 transition-all"
            >
              <Play className="w-4 h-4 fill-white" />
              <span>Start Mistake Recovery Test</span>
            </button>
            <button
              onClick={() => setCurrentView("practice")}
              className="px-5 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
            >
              View Mistake Notebook
            </button>
          </div>
        </div>
      )}

      {/* Active Subjective Test Runner Modal */}
      {activeSubjectivePaper && (
        <SubjectiveTestRunner
          paper={activeSubjectivePaper}
          onClose={() => setActiveSubjectivePaper(null)}
        />
      )}
    </div>
  );
};
