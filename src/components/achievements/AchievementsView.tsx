import React from "react";
import {
  Trophy,
  Flame,
  Award,
  Zap,
  Star,
  CheckCircle2,
  Lock,
  Sparkles,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useStudy } from "../../context/StudyContext";

export const AchievementsView: React.FC = () => {
  const { user } = useAuth();
  const { flashcards, quizzes, focusSessions } = useStudy();

  const studyStreak = user?.streak || 5;
  const quizzesTaken = quizzes.length || 8;
  const overallAccuracy = 86;
  const flashcardsReviewed = flashcards.reduce((acc, f) => acc + (f.reviewCount || 1), 0);
  const totalStudyHours = Math.round(
    (focusSessions.reduce((acc, s) => acc + s.durationMinutes, 0) || 1200) / 60
  );

  const achievements = [
    {
      id: "streak_7",
      title: "7-Day Streak Master",
      description: "Maintained a continuous daily study streak for 7 full days.",
      icon: Flame,
      color: "from-amber-500 to-orange-500",
      isUnlocked: studyStreak >= 7,
      progress: `${Math.min(7, studyStreak)}/7 Days`,
    },
    {
      id: "quiz_10",
      title: "Test Champion",
      description: "Completed 10 practice tests and chapter mock quizzes.",
      icon: Trophy,
      color: "from-purple-500 to-indigo-500",
      isUnlocked: quizzesTaken >= 10,
      progress: `${quizzesTaken}/10 Quizzes`,
    },
    {
      id: "accuracy_85",
      title: "Scholar Precision",
      description: "Achieved an overall test accuracy score greater than 85%.",
      icon: Award,
      color: "from-emerald-500 to-teal-500",
      isUnlocked: overallAccuracy >= 85,
      progress: `${overallAccuracy}% / 85%`,
    },
    {
      id: "flash_100",
      title: "Memory Centurion",
      description: "Reviewed 100 flashcards using spaced repetition recall.",
      icon: Zap,
      color: "from-blue-500 to-cyan-500",
      isUnlocked: flashcardsReviewed >= 100,
      progress: `${flashcardsReviewed}/100 Cards`,
    },
    {
      id: "study_50",
      title: "Deep Work Virtuoso",
      description: "Logged over 50 total hours of focused learning sessions.",
      icon: Star,
      color: "from-rose-500 to-pink-500",
      isUnlocked: totalStudyHours >= 50,
      progress: `${totalStudyHours}/50 Hours`,
    },
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300 text-xs font-semibold border border-amber-200/60 dark:border-amber-800/40 mb-2">
          <Trophy className="w-3.5 h-3.5" />
          <span>Gamified Motivation & Milestones</span>
        </div>
        <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">
          Achievements & Mastery Badges
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
          Earn badges, maintain learning streaks, and celebrate academic milestones.
        </p>
      </div>

      {/* Level & XP Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-indigo-600 via-indigo-700 to-purple-700 p-6 sm:p-8 text-white shadow-md space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-200">
              Current Academic Rank
            </span>
            <h3 className="text-2xl sm:text-3xl font-black">Level {user?.level || 14} — Master Scholar</h3>
          </div>

          <div className="flex items-center gap-3">
            <div className="px-4 py-2 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-center">
              <p className="text-[10px] uppercase font-bold text-indigo-200">Study Streak</p>
              <p className="text-xl font-extrabold flex items-center justify-center gap-1">
                <Flame className="w-5 h-5 text-amber-300 fill-amber-300" />
                {studyStreak} Days
              </p>
            </div>
            <div className="px-4 py-2 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-center">
              <p className="text-[10px] uppercase font-bold text-indigo-200">Total XP</p>
              <p className="text-xl font-extrabold">{user?.xp || 3420} XP</p>
            </div>
          </div>
        </div>

        {/* Level progress bar */}
        <div className="space-y-1.5 pt-2">
          <div className="flex justify-between text-xs font-semibold text-indigo-100">
            <span>Next Rank: Grandmaster Scholar (Level {(user?.level || 14) + 1})</span>
            <span>{user?.xp || 3420} / 4,000 XP (85%)</span>
          </div>
          <div className="w-full h-2.5 rounded-full bg-white/20 overflow-hidden">
            <div className="h-full bg-amber-400 rounded-full" style={{ width: "85%" }} />
          </div>
        </div>
      </div>

      {/* Badges Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
        {achievements.map((badge) => {
          const Icon = badge.icon;
          return (
            <div
              key={badge.id}
              className={`p-6 rounded-2xl border transition-all flex flex-col justify-between space-y-4 ${
                badge.isUnlocked
                  ? "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-xs hover:border-indigo-400"
                  : "bg-slate-50/70 dark:bg-slate-900/40 border-slate-200 dark:border-slate-800 opacity-60"
              }`}
            >
              <div className="flex items-start gap-4">
                <div
                  className={`w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-md bg-gradient-to-br ${
                    badge.isUnlocked ? badge.color : "from-slate-400 to-slate-500"
                  }`}
                >
                  {badge.isUnlocked ? <Icon className="w-6 h-6" /> : <Lock className="w-5 h-5" />}
                </div>

                <div className="space-y-1 flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                      {badge.title}
                    </h4>
                    {badge.isUnlocked && (
                      <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
                        Unlocked
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                    {badge.description}
                  </p>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-semibold">
                <span className="text-slate-400">Milestone Progress:</span>
                <span className={badge.isUnlocked ? "text-emerald-600 font-bold" : "text-slate-500"}>
                  {badge.progress}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
