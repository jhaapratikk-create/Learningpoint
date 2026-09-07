import React, { useState } from "react";
import { Plus, X, Bot, Camera, Calculator, Timer, FileSearch, Layers, Sparkles, BookOpen, Trophy, AlarmClock } from "lucide-react";
import { useStudy } from "../../context/StudyContext";
import { AppView } from "../../types";

export const FloatingActionMenu: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { setCurrentView } = useStudy();

  const handleAction = (view: AppView) => {
    setCurrentView(view);
    setIsOpen(false);
  };

  return (
    <div className="fixed bottom-20 lg:bottom-6 right-4 sm:right-6 z-50 select-none">
      {/* Expanded Action Options */}
      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40 bg-slate-950/40 backdrop-blur-xs animate-in fade-in duration-150"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute bottom-16 right-0 z-50 flex flex-col gap-2 items-end min-w-[220px] animate-in fade-in slide-in-from-bottom-4 duration-200">
            <button
              onClick={() => handleAction("smart-notes")}
              className="flex items-center justify-between w-full gap-3 px-3.5 py-2.5 rounded-xl bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 shadow-xl border border-purple-300 dark:border-purple-700 hover:bg-purple-50 dark:hover:bg-slate-750 transition-all text-xs font-bold group"
            >
              <span className="text-purple-600 dark:text-purple-400">AI Smart Notes</span>
              <div className="w-7 h-7 rounded-lg bg-purple-100 dark:bg-purple-950/80 flex items-center justify-center text-purple-600 dark:text-purple-400 group-hover:scale-110 transition-transform">
                <Sparkles className="w-4 h-4" />
              </div>
            </button>

            <button
              onClick={() => handleAction("study-alarms")}
              className="flex items-center justify-between w-full gap-3 px-3.5 py-2.5 rounded-xl bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 shadow-xl border border-rose-300 dark:border-rose-700 hover:bg-rose-50 dark:hover:bg-slate-750 transition-all text-xs font-bold group"
            >
              <span className="text-rose-600 dark:text-rose-400">Study Alarms</span>
              <div className="w-7 h-7 rounded-lg bg-rose-100 dark:bg-rose-950/80 flex items-center justify-center text-rose-600 dark:text-rose-400 group-hover:scale-110 transition-transform">
                <AlarmClock className="w-4 h-4" />
              </div>
            </button>

            <button
              onClick={() => handleAction("ai-tutor")}
              className="flex items-center justify-between w-full gap-3 px-3.5 py-2.5 rounded-xl bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 shadow-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-750 transition-all text-xs font-bold group"
            >
              <span>Ask AI Tutor</span>
              <div className="w-7 h-7 rounded-lg bg-indigo-100 dark:bg-indigo-950/80 flex items-center justify-center text-indigo-600 dark:text-indigo-400 group-hover:scale-110 transition-transform">
                <Bot className="w-4 h-4" />
              </div>
            </button>

            <button
              onClick={() => handleAction("math-solver")}
              className="flex items-center justify-between w-full gap-3 px-3.5 py-2.5 rounded-xl bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 shadow-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-750 transition-all text-xs font-bold group"
            >
              <span>Solve Math / STEM</span>
              <div className="w-7 h-7 rounded-lg bg-blue-100 dark:bg-blue-950/80 flex items-center justify-center text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform">
                <Calculator className="w-4 h-4" />
              </div>
            </button>

            <button
              onClick={() => handleAction("question-scanner")}
              className="flex items-center justify-between w-full gap-3 px-3.5 py-2.5 rounded-xl bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 shadow-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-750 transition-all text-xs font-bold group"
            >
              <span>Scan Question / OCR</span>
              <div className="w-7 h-7 rounded-lg bg-pink-100 dark:bg-pink-950/80 flex items-center justify-center text-pink-600 dark:text-pink-400 group-hover:scale-110 transition-transform">
                <Camera className="w-4 h-4" />
              </div>
            </button>

            <button
              onClick={() => handleAction("notes-analyzer")}
              className="flex items-center justify-between w-full gap-3 px-3.5 py-2.5 rounded-xl bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 shadow-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-750 transition-all text-xs font-bold group"
            >
              <span>Analyze Notes</span>
              <div className="w-7 h-7 rounded-lg bg-emerald-100 dark:bg-emerald-950/80 flex items-center justify-center text-emerald-600 dark:text-emerald-400 group-hover:scale-110 transition-transform">
                <FileSearch className="w-4 h-4" />
              </div>
            </button>

            <button
              onClick={() => handleAction("flashcards")}
              className="flex items-center justify-between w-full gap-3 px-3.5 py-2.5 rounded-xl bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 shadow-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-750 transition-all text-xs font-bold group"
            >
              <span>Flashcard Decks</span>
              <div className="w-7 h-7 rounded-lg bg-purple-100 dark:bg-purple-950/80 flex items-center justify-center text-purple-600 dark:text-purple-400 group-hover:scale-110 transition-transform">
                <Layers className="w-4 h-4" />
              </div>
            </button>

            <button
              onClick={() => handleAction("focus-timer")}
              className="flex items-center justify-between w-full gap-3 px-3.5 py-2.5 rounded-xl bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 shadow-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-750 transition-all text-xs font-bold group"
            >
              <span>Start Focus Timer</span>
              <div className="w-7 h-7 rounded-lg bg-amber-100 dark:bg-amber-950/80 flex items-center justify-center text-amber-600 dark:text-amber-400 group-hover:scale-110 transition-transform">
                <Timer className="w-4 h-4" />
              </div>
            </button>
          </div>
        </>
      )}

      {/* Main Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-13 h-13 sm:w-14 sm:h-14 rounded-full flex items-center justify-center text-white shadow-2xl transition-all duration-300 active:scale-95 cursor-pointer ring-4 ring-white/60 dark:ring-slate-900/60 ${
          isOpen
            ? "bg-slate-900 dark:bg-slate-700 rotate-45 shadow-slate-900/40"
            : "bg-gradient-to-tr from-indigo-600 via-indigo-500 to-blue-500 hover:scale-105 shadow-indigo-600/40 animate-pulse hover:animate-none"
        }`}
        aria-label="Quick Actions"
        title="Quick AI & Study Actions"
      >
        <Plus className="w-6 h-6 stroke-[2.5]" />
      </button>
    </div>
  );
};
