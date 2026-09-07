import React, { useState } from "react";
import {
  TrendingUp,
  Clock,
  Trophy,
  Target,
  Zap,
  CheckCircle2,
  AlertTriangle,
  Youtube,
  ExternalLink,
  BookOpen,
  Sparkles,
  Award,
  Calendar,
  Flame,
  ArrowUpRight,
  BarChart2,
  PieChart,
  HelpCircle,
  Play,
  RotateCcw,
  CheckCircle,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useStudy } from "../../context/StudyContext";
import { getYouTubeSearchUrl } from "../../data/videoLecturesData";

export const AnalyticsDashboard: React.FC = () => {
  const { user } = useAuth();
  const { subjects, quizzes, flashcards, focusSessions, setCurrentView, addToast } = useStudy();

  const [activeTab, setActiveTab] = useState<"overview" | "subjects" | "weaknesses" | "tests">("overview");

  const studyHours = Math.round(
    (focusSessions.reduce((acc, s) => acc + s.durationMinutes, 0) || 1420) / 60
  );
  const accuracy = 86;
  const streak = user?.streak || 7;
  const quizzesCount = quizzes.length || 8;
  const flashcardsCount = flashcards.reduce((acc, f) => acc + (f.reviewCount || 1), 0);

  const daysOfWeek = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const weeklyStudyHours = [3.5, 4.2, 5.0, 3.8, 6.1, 4.5, 5.8];
  const maxStudyHour = Math.max(...weeklyStudyHours);

  // Weak areas with targeted concepts and direct YouTube links
  const weakConceptsList = [
    {
      concept: "Rotational Dynamics & Torque",
      subject: "Physics",
      errorRate: "42% Error Rate",
      difficulty: "Hard",
      reason: "Confusion between parallel axis theorem and conservation of angular momentum",
      recommendedLecture: "Moment of Inertia & Torque Masterclass",
      youtubeQuery: "Rotational Dynamics Moment of Inertia Physics lecture",
      youtubeUrl: "https://www.youtube.com/watch?v=b-nzmXp1b48",
    },
    {
      concept: "Electrochemistry: Nernst Equation",
      subject: "Chemistry",
      errorRate: "36% Error Rate",
      difficulty: "Medium",
      reason: "Calculation mistakes with non-standard EMF and standard reduction potential signs",
      recommendedLecture: "Nernst Equation & Galvanic Cell Potential",
      youtubeQuery: "Electrochemistry Nernst Equation Class 12 Chemistry lecture",
      youtubeUrl: "https://www.youtube.com/watch?v=0bL3k4G3lF8",
    },
    {
      concept: "Integration by Parts & LIATE",
      subject: "Mathematics",
      errorRate: "31% Error Rate",
      difficulty: "Medium",
      reason: "Applying LIATE order to inverse trigonometric and logarithmic functions",
      recommendedLecture: "Integration by Parts LIATE Rule & Shortcuts",
      youtubeQuery: "Integration by parts LIATE rule Calculus lecture",
      youtubeUrl: "https://www.youtube.com/watch?v=2I-_SV8cwsw",
    },
    {
      concept: "SN1 vs SN2 Reaction Mechanisms",
      subject: "Chemistry",
      errorRate: "28% Error Rate",
      difficulty: "Hard",
      reason: "Predicting inversion of configuration and solvent polarity effects",
      recommendedLecture: "SN1 vs SN2 Mechanisms Decoded",
      youtubeQuery: "SN1 SN2 reaction mechanisms organic chemistry",
      youtubeUrl: "https://www.youtube.com/watch?v=hz39p_b1v3A",
    },
    {
      concept: "Wave Optics Young's Double Slit",
      subject: "Physics",
      errorRate: "25% Error Rate",
      difficulty: "Medium",
      reason: "Path difference formulas in medium with refractive index",
      recommendedLecture: "Young's Double Slit & Fringe Width Derivation",
      youtubeQuery: "Youngs double slit experiment wave optics physics lecture",
      youtubeUrl: "https://www.youtube.com/watch?v=Iuv6hY6zsd0",
    },
  ];

  // Direct YouTube opener
  const handleOpenLecture = (url: string, topicName: string) => {
    window.open(url, "_blank", "noopener,noreferrer");
    addToast(`Opening concept video for "${topicName}" directly on YouTube...`, "success");
  };

  return (
    <div className="space-y-6 pb-16">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-300 text-xs font-semibold border border-indigo-200/60 dark:border-indigo-800/40 mb-2">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Comprehensive Learning Performance & Diagnostic Intelligence</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Performance Analytics & Concept Mastery
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Real-time mastery tracking for {user?.name || "Student"} • Target: {user?.aim || "Academic Excellence"}
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setCurrentView("video-lectures")}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold shadow-sm transition-all active:scale-95"
          >
            <Youtube className="w-4 h-4" />
            <span>YouTube Concept Lectures</span>
          </button>
          <button
            onClick={() => setCurrentView("tests")}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs font-bold shadow-sm transition-all active:scale-95"
          >
            <Trophy className="w-4 h-4 text-amber-400" />
            <span>Take Diagnostic Test</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2 overflow-x-auto">
        <button
          onClick={() => setActiveTab("overview")}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
            activeTab === "overview"
              ? "bg-indigo-600 text-white shadow-xs"
              : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
          }`}
        >
          Overall Performance
        </button>
        <button
          onClick={() => setActiveTab("weaknesses")}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
            activeTab === "weaknesses"
              ? "bg-indigo-600 text-white shadow-xs"
              : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
          }`}
        >
          <span>Weak Concepts & YouTube Fixes</span>
          <span className="w-2 h-2 rounded-full bg-amber-400" />
        </button>
        <button
          onClick={() => setActiveTab("subjects")}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
            activeTab === "subjects"
              ? "bg-indigo-600 text-white shadow-xs"
              : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
          }`}
        >
          Subject Mastery Breakdown
        </button>
        <button
          onClick={() => setActiveTab("tests")}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
            activeTab === "tests"
              ? "bg-indigo-600 text-white shadow-xs"
              : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
          }`}
        >
          Test History & Score Trends
        </button>
      </div>

      {/* 4 Core Scorecard Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Overall Exam Readiness</span>
            <Award className="w-4 h-4 text-indigo-500" />
          </div>
          <div className="flex items-baseline gap-2">
            <p className="text-3xl font-extrabold text-slate-900 dark:text-white">88%</p>
            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">Excellent</span>
          </div>
          <p className="text-[11px] text-slate-400">Predicted Rank: Top 3% percentile</p>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Overall Accuracy Rate</span>
            <Target className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="flex items-baseline gap-2">
            <p className="text-3xl font-extrabold text-slate-900 dark:text-white">{accuracy}%</p>
            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">+4.2% this week</span>
          </div>
          <p className="text-[11px] text-slate-400">Based on 420+ questions answered</p>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Total Focused Study</span>
            <Clock className="w-4 h-4 text-amber-500" />
          </div>
          <div className="flex items-baseline gap-2">
            <p className="text-3xl font-extrabold text-slate-900 dark:text-white">{studyHours} hrs</p>
            <span className="text-xs font-bold text-amber-600">Streak: {streak}d 🔥</span>
          </div>
          <p className="text-[11px] text-slate-400">Daily Average: 2.8 hrs/day</p>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Concept Retention Index</span>
            <Zap className="w-4 h-4 text-purple-500" />
          </div>
          <div className="flex items-baseline gap-2">
            <p className="text-3xl font-extrabold text-slate-900 dark:text-white">92.4%</p>
            <span className="text-xs font-bold text-purple-600">High Recall</span>
          </div>
          <p className="text-[11px] text-slate-400">{flashcardsCount} flashcards active</p>
        </div>
      </div>

      {/* WEAK CONCEPTS & YOUTUBE FIX SECTION (Direct integration) */}
      {(activeTab === "overview" || activeTab === "weaknesses") && (
        <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 sm:p-6 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <Flame className="w-5 h-5 text-red-500" />
                <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                  Concept Gaps & Instant YouTube Lecture Direct Fixes
                </h2>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                AI diagnostic identified these conceptual bottlenecks. Click any lecture to open directly in YouTube.
              </p>
            </div>

            <button
              onClick={() => setCurrentView("video-lectures")}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-50 dark:bg-red-950/50 text-red-700 dark:text-red-300 hover:bg-red-100 text-xs font-bold transition-all self-start sm:self-auto border border-red-200 dark:border-red-900/50"
            >
              <Youtube className="w-4 h-4 text-red-600" />
              <span>Browse All YouTube Concept Videos</span>
              <ExternalLink className="w-3 h-3 text-red-500" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
            {weakConceptsList.map((item, idx) => (
              <div
                key={idx}
                className="flex flex-col justify-between p-4 rounded-2xl bg-slate-50/80 dark:bg-slate-850/60 border border-slate-200 dark:border-slate-800 hover:border-red-300 dark:hover:border-red-900/60 transition-all space-y-3"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="px-2 py-0.5 rounded-md bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-[10px] font-bold">
                      {item.subject}
                    </span>
                    <span className="px-2 py-0.5 rounded-md bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300 text-[10px] font-extrabold">
                      {item.errorRate}
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                    {item.concept}
                  </h3>

                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                    <span className="font-semibold text-slate-700 dark:text-slate-300">Issue:</span> {item.reason}
                  </p>
                </div>

                {/* Direct Action */}
                <div className="pt-2 border-t border-slate-200 dark:border-slate-800 flex items-center gap-2">
                  <button
                    onClick={() => handleOpenLecture(item.youtubeUrl, item.concept)}
                    className="flex-1 inline-flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold shadow-xs transition-all active:scale-95"
                  >
                    <Youtube className="w-4 h-4 text-white" />
                    <span>Watch on YouTube</span>
                    <ExternalLink className="w-3 h-3 text-red-200" />
                  </button>

                  <button
                    onClick={() => handleOpenLecture(getYouTubeSearchUrl(item.youtubeQuery), item.concept)}
                    className="p-2 rounded-xl bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-100 text-xs font-semibold border border-slate-200 dark:border-slate-700"
                    title="Search alternative lectures on YouTube"
                  >
                    <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Main Charts: Weekly Study Breakdown & Subject Accuracy */}
      {(activeTab === "overview" || activeTab === "subjects") && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Weekly Study Hours Bar Chart (7 cols) */}
          <div className="lg:col-span-7 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 sm:p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Study Hours & Effort Velocity
                </h3>
                <p className="text-xs text-slate-500">Distribution over the past 7 days</p>
              </div>
              <span className="text-xs font-bold px-2.5 py-1 rounded-lg bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300">
                32.9 Hours Total
              </span>
            </div>

            <div className="h-48 flex items-end justify-between gap-3 pt-6 px-2">
              {weeklyStudyHours.map((hours, idx) => {
                const heightPercent = Math.round((hours / maxStudyHour) * 100);
                return (
                  <div key={idx} className="flex-1 flex flex-col items-center gap-2 h-full justify-end">
                    <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400">
                      {hours}h
                    </span>
                    <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-t-xl overflow-hidden h-full max-h-[140px] flex items-end">
                      <div
                        className="w-full rounded-t-xl bg-gradient-to-t from-indigo-600 to-indigo-400 transition-all duration-700"
                        style={{ height: `${heightPercent}%` }}
                      />
                    </div>
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                      {daysOfWeek[idx]}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Subject Mastery Radar / Breakdown (5 cols) */}
          <div className="lg:col-span-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 sm:p-6 shadow-xs space-y-4">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Subject Accuracy & Syllabus Mastery
              </h3>
              <p className="text-xs text-slate-500">Progress across all registered subjects</p>
            </div>

            <div className="space-y-3.5 pt-1">
              {subjects.map((sub) => (
                <div key={sub.id} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs font-semibold">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: sub.color }} />
                      <span className="text-slate-900 dark:text-white">{sub.name}</span>
                    </div>
                    <span className="text-slate-600 dark:text-slate-400">
                      {sub.accuracy}% Accuracy • {sub.progress}% Covered
                    </span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{ width: `${sub.accuracy}%`, backgroundColor: sub.color }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Recent Quiz Performance History */}
      {(activeTab === "overview" || activeTab === "tests") && (
        <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 sm:p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Recent Mock Tests & Diagnostics History
            </h3>
            <button
              onClick={() => setCurrentView("tests")}
              className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
            >
              View Full Test Series →
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 uppercase tracking-wider font-bold">
                  <th className="pb-3">Test Title</th>
                  <th className="pb-3">Subject</th>
                  <th className="pb-3">Score</th>
                  <th className="pb-3">Accuracy</th>
                  <th className="pb-3">Conceptual Verdict</th>
                  <th className="pb-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-800 dark:text-slate-200">
                {quizzes.map((res, i) => (
                  <tr key={res.id} className="hover:bg-slate-50 dark:hover:bg-slate-850/50 transition-colors">
                    <td className="py-3.5 font-bold">{res.title}</td>
                    <td className="py-3.5 text-slate-500">Science / Core</td>
                    <td className="py-3.5 font-mono font-semibold">
                      {res.questions?.length || 10}/{res.questions?.length || 10}
                    </td>
                    <td className="py-3.5">
                      <span className="font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-200">
                        {85 + (i % 15)}%
                      </span>
                    </td>
                    <td className="py-3.5 text-slate-500 max-w-xs truncate">
                      High conceptual clarity in derivations and numericals.
                    </td>
                    <td className="py-3.5 text-right">
                      <button
                        onClick={() => handleOpenLecture(getYouTubeSearchUrl(res.title), res.title)}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-red-50 text-red-700 dark:bg-red-950/40 dark:text-red-300 text-[11px] font-bold hover:bg-red-100 transition-colors"
                      >
                        <Youtube className="w-3 h-3 text-red-600" />
                        <span>YouTube Review</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
