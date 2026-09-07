import React from "react";
import { BellRing, Volume2, Clock, BookOpen, Check, X, Sparkles } from "lucide-react";
import { useStudy } from "../../context/StudyContext";
import { motion, AnimatePresence } from "motion/react";

export const ActiveAlarmRingingModal: React.FC = () => {
  const { activeRingingAlarm, dismissActiveAlarm, snoozeActiveAlarm, setCurrentView } = useStudy();

  if (!activeRingingAlarm) return null;

  const handleOpenStudyView = () => {
    const targetView = activeRingingAlarm.autoOpenView || "smart-notes";
    dismissActiveAlarm();
    setCurrentView(targetView);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 10 }}
          className="w-full max-w-lg overflow-hidden rounded-2xl bg-white dark:bg-slate-900 border border-amber-300/40 dark:border-amber-500/30 shadow-2xl"
        >
          {/* Glowing Header Banner */}
          <div className="relative overflow-hidden bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 p-6 text-white text-center">
            <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]" />
            
            <motion.div
              animate={{ rotate: [-12, 12, -12, 12, 0] }}
              transition={{ repeat: Infinity, duration: 1.2, ease: "easeInOut" }}
              className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white/20 backdrop-blur-md mb-3 shadow-inner"
            >
              <BellRing className="w-8 h-8 text-white drop-shadow-md" />
            </motion.div>

            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-black/20 text-xs font-semibold tracking-wide uppercase mb-1">
              <Clock className="w-3.5 h-3.5" /> Scheduled Study Alarm
            </div>
            <h2 className="text-2xl font-bold tracking-tight text-white drop-shadow-sm">
              {activeRingingAlarm.title}
            </h2>
            <p className="text-amber-100 text-sm mt-1">
              Time: <span className="font-semibold text-white">{activeRingingAlarm.time}</span> • Scheduled for focused study
            </p>
          </div>

          {/* Alarm Details Body */}
          <div className="p-6 space-y-4">
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <span className="px-2.5 py-1 rounded-md bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 font-medium border border-amber-200 dark:border-amber-800">
                {activeRingingAlarm.subject}
              </span>
              {activeRingingAlarm.classGrade && (
                <span className="px-2.5 py-1 rounded-md bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 font-medium border border-blue-200 dark:border-blue-800">
                  {activeRingingAlarm.classGrade}
                </span>
              )}
              {activeRingingAlarm.board && (
                <span className="px-2.5 py-1 rounded-md bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 font-medium border border-emerald-200 dark:border-emerald-800">
                  {activeRingingAlarm.board} Board
                </span>
              )}
              <span className="px-2.5 py-1 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-medium ml-auto flex items-center gap-1">
                <Volume2 className="w-3 h-3 text-amber-500 animate-pulse" /> Tone: {activeRingingAlarm.sound}
              </span>
            </div>

            {activeRingingAlarm.topic && (
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60">
                <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Target Topic & Concepts
                </div>
                <div className="text-sm font-medium text-slate-800 dark:text-slate-100 mt-1 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-500" />
                  {activeRingingAlarm.topic}
                </div>
              </div>
            )}

            <p className="text-xs text-slate-500 dark:text-slate-400 text-center">
              Your alarm is ringing to help you maintain study consistency. Ready to begin?
            </p>

            {/* Action Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <button
                type="button"
                onClick={handleOpenStudyView}
                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-semibold text-sm shadow-md flex items-center justify-center gap-2 transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                <BookOpen className="w-4 h-4" />
                {activeRingingAlarm.autoOpenView === "focus-timer" ? "Start Focus Session" : "Open Smart Notes"}
              </button>

              <button
                type="button"
                onClick={dismissActiveAlarm}
                className="w-full py-3 px-4 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-semibold text-sm flex items-center justify-center gap-2 transition-all"
              >
                <Check className="w-4 h-4 text-emerald-500" /> Dismiss Alarm
              </button>
            </div>

            {/* Snooze Options */}
            <div className="flex items-center justify-center gap-3 pt-1 border-t border-slate-100 dark:border-slate-800 text-xs">
              <span className="text-slate-400">Need a few minutes?</span>
              <button
                type="button"
                onClick={() => snoozeActiveAlarm(5)}
                className="px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-amber-50 dark:hover:bg-amber-950/40 text-slate-600 dark:text-slate-300 hover:text-amber-600 font-medium transition-colors"
              >
                Snooze +5 min
              </button>
              <button
                type="button"
                onClick={() => snoozeActiveAlarm(10)}
                className="px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-amber-50 dark:hover:bg-amber-950/40 text-slate-600 dark:text-slate-300 hover:text-amber-600 font-medium transition-colors"
              >
                Snooze +10 min
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
