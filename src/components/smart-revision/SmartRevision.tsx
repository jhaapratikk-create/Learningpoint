import React, { useState } from "react";
import {
  RotateCcw,
  Sparkles,
  AlertTriangle,
  BookOpen,
  CheckCircle2,
  Trophy,
  ArrowRight,
  Layers,
  HelpCircle,
} from "lucide-react";
import { useStudy } from "../../context/StudyContext";

export const SmartRevision: React.FC = () => {
  const { flashcards, mistakes, resolveMistake, subjects, startQuiz, quizzes, setCurrentView, addToast } = useStudy();

  const [activeTab, setActiveTab] = useState<"weaknesses" | "spaced" | "mistakes">("weaknesses");

  // Spaced repetition due items
  const dueFlashcards = flashcards.filter((f) => f.difficultyRating === "Hard" || f.difficultyRating === "Again");

  // Identified weakness topics from test results
  const detectedWeaknesses = [
    {
      topic: "Rotational Mechanics & Moment of Inertia",
      subject: "Physics",
      errorRate: "42% Error Rate",
      recommendation: "Focus on perpendicular and parallel axis theorem problems.",
    },
    {
      topic: "Nucleophilic Substitution Mechanisms (SN1 vs SN2)",
      subject: "Organic Chemistry",
      errorRate: "35% Error Rate",
      recommendation: "Review solvent polarity effects and steric hindrance rules.",
    },
    {
      topic: "Integration by Partial Fractions & Trigonometric Substitution",
      subject: "Mathematics",
      errorRate: "28% Error Rate",
      recommendation: "Practice 10 standard textbook integrals with step verification.",
    },
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-50 dark:bg-rose-950/50 text-rose-700 dark:text-rose-300 text-xs font-semibold border border-rose-200/60 dark:border-rose-800/40 mb-2">
          <AlertTriangle className="w-3.5 h-3.5" />
          <span>Intelligent Weakness Remediation</span>
        </div>
        <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">
          Smart Revision & Mistake Notebook
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
          AI automatically diagnoses recurring exam errors and schedules targeted recall drills.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2">
        <button
          onClick={() => setActiveTab("weaknesses")}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
            activeTab === "weaknesses"
              ? "bg-indigo-600 text-white shadow-xs"
              : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
          }`}
        >
          Weakness Topics ({detectedWeaknesses.length})
        </button>

        <button
          onClick={() => setActiveTab("spaced")}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
            activeTab === "spaced"
              ? "bg-indigo-600 text-white shadow-xs"
              : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
          }`}
        >
          Spaced Repetition Queue ({dueFlashcards.length})
        </button>

        <button
          onClick={() => setActiveTab("mistakes")}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
            activeTab === "mistakes"
              ? "bg-indigo-600 text-white shadow-xs"
              : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
          }`}
        >
          Mistake Notebook ({mistakes.length})
        </button>
      </div>

      {/* TAB 1: WEAKNESSES */}
      {activeTab === "weaknesses" && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {detectedWeaknesses.map((weak, i) => (
              <div
                key={i}
                className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3 flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-rose-50 dark:bg-rose-950 text-rose-700 dark:text-rose-300">
                      {weak.subject}
                    </span>
                    <span className="text-xs font-bold text-rose-600 dark:text-rose-400">
                      {weak.errorRate}
                    </span>
                  </div>

                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                    {weak.topic}
                  </h4>

                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                    💡 {weak.recommendation}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center gap-2">
                  <button
                    onClick={() => setCurrentView("explanation-engine")}
                    className="flex-1 py-2 rounded-xl bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 font-semibold text-xs text-center hover:bg-indigo-100 transition-all"
                  >
                    Deep Explain
                  </button>
                  <button
                    onClick={() => setCurrentView("question-generator")}
                    className="flex-1 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs text-center shadow-xs transition-all"
                  >
                    Practice Drills
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: SPACED REPETITION */}
      {activeTab === "spaced" && (
        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Layers className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              <div>
                <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                  {dueFlashcards.length} Cards Scheduled for Review Today
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Cards marked &quot;Hard&quot; or &quot;Again&quot; require reinforcement to prevent forgetting.
                </p>
              </div>
            </div>

            <button
              onClick={() => setCurrentView("flashcards")}
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-sm"
            >
              Start Recall Drill
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {dueFlashcards.map((fc) => (
              <div
                key={fc.id}
                className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-2"
              >
                <div className="flex items-center justify-between text-[10px] font-bold uppercase text-slate-400">
                  <span>Prompt</span>
                  <span className="text-rose-500">Status: Due for Review</span>
                </div>
                <h5 className="text-sm font-bold text-slate-900 dark:text-white">{fc.front}</h5>
                <p className="text-xs text-slate-600 dark:text-slate-400 border-t border-slate-100 dark:border-slate-800 pt-2 leading-relaxed">
                  {fc.back}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: MISTAKE NOTEBOOK */}
      {activeTab === "mistakes" && (
        <div className="space-y-3">
          {mistakes.length === 0 ? (
            <div className="p-12 text-center bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
              <p className="text-sm font-semibold text-slate-500">
                🎉 No mistakes recorded yet! Keep acing your practice tests.
              </p>
            </div>
          ) : (
            mistakes.map((q) => (
              <div
                key={q.id}
                className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400">
                    Topic: {q.topic} • {q.subject}
                  </span>
                  <span className="text-[10px] text-slate-400">{q.date}</span>
                </div>

                <p className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                  {q.question}
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  <div className="p-2.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 text-rose-800 dark:text-rose-200">
                    <span className="text-[10px] text-rose-500 block font-bold">Your Missed Answer:</span>
                    <span className="font-semibold">{q.studentAnswer}</span>
                  </div>

                  <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 text-emerald-800 dark:text-emerald-200">
                    <span className="text-[10px] text-emerald-500 block font-bold">Correct Solution:</span>
                    <span className="font-semibold">{q.correctAnswer}</span>
                  </div>
                </div>

                {q.explanation && (
                  <p className="text-xs text-slate-500 dark:text-slate-400 italic pt-1 border-t border-slate-100 dark:border-slate-800">
                    💡 {q.explanation}
                  </p>
                )}

                <div className="pt-2 flex justify-end">
                  <button
                    onClick={() => {
                      resolveMistake(q.id);
                      addToast("Mistake marked as resolved! 🎉");
                    }}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
                      q.resolved
                        ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300"
                        : "bg-slate-100 dark:bg-slate-800 hover:bg-emerald-100 text-slate-700 dark:text-slate-300"
                    }`}
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>{q.resolved ? "Resolved" : "Mark as Mastered"}</span>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};
