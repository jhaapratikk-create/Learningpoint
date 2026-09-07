import React from "react";
import {
  Trophy,
  CheckCircle2,
  XCircle,
  Clock,
  RotateCcw,
  Sparkles,
  ArrowRight,
  BookmarkPlus,
  BookOpen,
} from "lucide-react";
import { useStudy } from "../../context/StudyContext";

export const QuizResultView: React.FC = () => {
  const { activeQuizResult: latestResult, setCurrentView, startQuiz, quizzes, addToast, triggerConfetti } = useStudy();

  if (!latestResult) {
    return (
      <div className="p-8 text-center">
        <p className="text-sm text-slate-500">No test results available to display.</p>
        <button
          onClick={() => setCurrentView("quizzes")}
          className="mt-3 px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-semibold"
        >
          View Quizzes
        </button>
      </div>
    );
  }

  const associatedQuiz = quizzes.find((q) => q.id === latestResult.quizId);

  const formatMinutes = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      {/* Score Banner */}
      <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-xs text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 text-xs font-semibold">
          <Trophy className="w-3.5 h-3.5" />
          <span>Quiz Complete & Evaluated</span>
        </div>

        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          {latestResult.quizTitle}
        </h2>

        {/* Circular / Large Score Badge */}
        <div className="flex items-center justify-center gap-8 py-3">
          <div>
            <span className="text-4xl sm:text-5xl font-black text-indigo-600 dark:text-indigo-400">
              {latestResult.percentage}%
            </span>
            <p className="text-xs font-semibold text-slate-400 mt-1">Accuracy Score</p>
          </div>

          <div className="h-12 w-px bg-slate-200 dark:bg-slate-800" />

          <div>
            <span className="text-4xl sm:text-5xl font-black text-slate-800 dark:text-slate-200">
              {latestResult.score} / {latestResult.maxScore}
            </span>
            <p className="text-xs font-semibold text-slate-400 mt-1">Correct Answers</p>
          </div>

          <div className="h-12 w-px bg-slate-200 dark:bg-slate-800" />

          <div>
            <span className="text-2xl sm:text-3xl font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1 justify-center">
              <Clock className="w-6 h-6 text-slate-400" />
              {formatMinutes(latestResult.timeSpentSeconds)}
            </span>
            <p className="text-xs font-semibold text-slate-400 mt-1">Time Spent</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-center gap-3 pt-2">
          {associatedQuiz && (
            <button
              onClick={() => startQuiz(associatedQuiz)}
              className="px-4 py-2 rounded-xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-300 text-xs font-semibold flex items-center gap-1.5 hover:bg-indigo-100 transition-all"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Retake Quiz</span>
            </button>
          )}

          <button
            onClick={() => setCurrentView("quizzes")}
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-sm transition-all"
          >
            Back to Quizzes
          </button>
        </div>
      </div>

      {/* AI Performance Diagnosis & Weak Topic Detection */}
      <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 sm:p-6 shadow-xs space-y-4">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            AI Diagnosis & Recommendations
          </h3>
        </div>

        <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed bg-indigo-50/50 dark:bg-indigo-950/30 p-4 rounded-xl border border-indigo-100 dark:border-indigo-900/40">
          {latestResult.aiRecommendations}
        </p>

        {latestResult.weakTopics.length > 0 && (
          <div className="space-y-2 pt-2">
            <p className="text-xs font-bold text-rose-600 dark:text-rose-400 uppercase">
              Targeted Weakness Areas Detected:
            </p>
            <div className="flex flex-wrap gap-2">
              {latestResult.weakTopics.map((topic, i) => (
                <span
                  key={i}
                  className="px-3 py-1 rounded-lg text-xs font-semibold bg-rose-50 dark:bg-rose-950 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800"
                >
                  ⚠️ {topic}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Detailed Question Review */}
      <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 sm:p-6 shadow-xs space-y-4">
        <h3 className="text-base font-bold text-slate-900 dark:text-white">
          Detailed Answers Breakdown ({latestResult.answers.length} Questions)
        </h3>

        <div className="space-y-4">
          {latestResult.answers.map((ans, idx) => (
            <div
              key={ans.questionId || idx}
              className={`p-4 rounded-xl border space-y-2.5 ${
                ans.isCorrect
                  ? "bg-emerald-50/40 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-900/40"
                  : "bg-rose-50/40 dark:bg-rose-950/20 border-rose-200 dark:border-rose-900/40"
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-2">
                  {ans.isCorrect ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                  ) : (
                    <XCircle className="w-5 h-5 text-rose-500 shrink-0" />
                  )}
                  <span className="text-xs font-bold text-slate-900 dark:text-white">
                    Question {idx + 1}
                  </span>
                </div>

                <span
                  className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded ${
                    ans.isCorrect
                      ? "bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-200"
                      : "bg-rose-100 dark:bg-rose-950 text-rose-800 dark:text-rose-200"
                  }`}
                >
                  {ans.isCorrect ? "Correct (+1)" : "Incorrect (0)"}
                </span>
              </div>

              <p className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-white">
                {ans.questionText}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs pt-1">
                <div className="p-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                  <span className="text-slate-400 block text-[10px]">Your Answer:</span>
                  <span
                    className={`font-semibold ${
                      ans.isCorrect ? "text-emerald-600" : "text-rose-600"
                    }`}
                  >
                    {ans.userAnswer}
                  </span>
                </div>

                <div className="p-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                  <span className="text-slate-400 block text-[10px]">Correct Answer:</span>
                  <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                    {ans.correctAnswer}
                  </span>
                </div>
              </div>

              {ans.explanation && (
                <p className="text-xs text-slate-600 dark:text-slate-400 italic pt-1 border-t border-slate-200/50 dark:border-slate-800">
                  💡 <strong>Explanation:</strong> {ans.explanation}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
