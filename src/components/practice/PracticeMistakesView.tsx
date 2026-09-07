import React, { useState } from "react";
import {
  HelpCircle,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Sparkles,
  Search,
  BookOpen,
  ArrowRight,
} from "lucide-react";
import { useStudy } from "../../context/StudyContext";
import { MistakeItem } from "../../types";

export const PracticeMistakesView: React.FC = () => {
  const { mistakes, resolveMistake, setCurrentView, addToast, triggerConfetti } = useStudy();

  const [filter, setFilter] = useState<"all" | "unresolved" | "resolved">("unresolved");
  const [search, setSearch] = useState("");

  const filteredMistakes = mistakes.filter((m) => {
    if (filter === "unresolved" && m.resolved) return false;
    if (filter === "resolved" && !m.resolved) return false;
    if (search && !m.question.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const handleResolve = (id: string) => {
    resolveMistake(id);
    triggerConfetti();
    addToast("Mistake resolved and marked as mastered! 🎯");
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-50 dark:bg-rose-950/50 text-rose-700 dark:text-rose-300 text-xs font-semibold border border-rose-200/60 dark:border-rose-800/40 mb-2">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Targeted Weakness Remediation</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Practice & Mistake Bank
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Review and master past exam errors. Re-solving missed questions ensures zero repeated test mistakes.
          </p>
        </div>

        <button
          onClick={() => setCurrentView("question-generator")}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs sm:text-sm font-semibold shadow-sm transition-all active:scale-95 self-start sm:self-auto"
        >
          <Sparkles className="w-4 h-4" />
          <span>Generate New Practice Set</span>
        </button>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setFilter("unresolved")}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
              filter === "unresolved"
                ? "bg-indigo-600 text-white shadow-xs"
                : "bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400"
            }`}
          >
            Needs Practice ({mistakes.filter((m) => !m.resolved).length})
          </button>
          <button
            onClick={() => setFilter("resolved")}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
              filter === "resolved"
                ? "bg-indigo-600 text-white shadow-xs"
                : "bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400"
            }`}
          >
            Mastered ({mistakes.filter((m) => m.resolved).length})
          </button>
          <button
            onClick={() => setFilter("all")}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
              filter === "all"
                ? "bg-indigo-600 text-white shadow-xs"
                : "bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400"
            }`}
          >
            All Items ({mistakes.length})
          </button>
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search mistakes..."
            className="w-full pl-8 pr-3 py-1.5 text-xs rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none"
          />
        </div>
      </div>

      {/* Mistake Items Grid */}
      <div className="space-y-4">
        {filteredMistakes.length === 0 ? (
          <div className="p-12 text-center bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-2">
            <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto" />
            <h4 className="text-sm font-bold text-slate-900 dark:text-white">
              No Mistakes Found!
            </h4>
            <p className="text-xs text-slate-500">
              You haven&apos;t missed any questions matching this filter.
            </p>
          </div>
        ) : (
          filteredMistakes.map((item) => (
            <div
              key={item.id}
              className={`p-5 rounded-2xl border transition-all space-y-3 ${
                item.resolved
                  ? "bg-slate-50/50 dark:bg-slate-900/40 border-slate-200 dark:border-slate-800 opacity-75"
                  : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-xs"
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300">
                    {item.subject}
                  </span>
                  <span className="text-xs text-slate-400 font-semibold">• {item.topic}</span>
                </div>
                <span className="text-[10px] text-slate-400">{item.date}</span>
              </div>

              <h4 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white leading-relaxed">
                {item.question}
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-rose-50/80 dark:bg-rose-950/40 border border-rose-200/80 text-rose-900 dark:text-rose-200">
                  <span className="text-[10px] font-bold uppercase text-rose-500 block mb-0.5">
                    Your Previous Answer
                  </span>
                  <span className="font-semibold">{item.studentAnswer}</span>
                </div>

                <div className="p-3 rounded-xl bg-emerald-50/80 dark:bg-emerald-950/40 border border-emerald-200/80 text-emerald-900 dark:text-emerald-200">
                  <span className="text-[10px] font-bold uppercase text-emerald-500 block mb-0.5">
                    Correct Solution
                  </span>
                  <span className="font-semibold">{item.correctAnswer}</span>
                </div>
              </div>

              {item.explanation && (
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 text-xs text-slate-600 dark:text-slate-300 leading-relaxed border border-slate-100 dark:border-slate-800">
                  💡 <strong>Concept Explanation:</strong> {item.explanation}
                </div>
              )}

              <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-3">
                <button
                  onClick={() => setCurrentView("explanation-engine")}
                  className="text-xs text-indigo-600 dark:text-indigo-400 font-semibold hover:underline flex items-center gap-1"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  Ask AI Tutor to Explain this concept
                </button>

                {!item.resolved && (
                  <button
                    onClick={() => handleResolve(item.id)}
                    className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs flex items-center gap-1.5 transition-all"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>I Understand — Mark Mastered</span>
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
