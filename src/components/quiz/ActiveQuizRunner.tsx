import React, { useState, useEffect } from "react";
import {
  Clock,
  Flag,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  X,
  RotateCcw,
  Youtube,
  ExternalLink,
} from "lucide-react";
import { useStudy } from "../../context/StudyContext";
import { QuizResult, QuizAnswer } from "../../types";
import { ConfirmDialog } from "../common/ConfirmDialog";
import { getYouTubeSearchUrl } from "../../data/videoLecturesData";

export const ActiveQuizRunner: React.FC = () => {
  const { activeQuiz, finishQuiz, setCurrentView, addToast } = useStudy();

  if (!activeQuiz) {
    return (
      <div className="p-8 text-center">
        <p className="text-sm text-slate-500">No active quiz session found.</p>
        <button
          onClick={() => setCurrentView("quizzes")}
          className="mt-3 px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-semibold"
        >
          Return to Quizzes
        </button>
      </div>
    );
  }

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<{ [questionId: string]: string | number }>({});
  const [flaggedQuestions, setFlaggedQuestions] = useState<{ [questionId: string]: boolean }>({});
  const [timeLeftSeconds, setTimeLeftSeconds] = useState(activeQuiz.timeLimitMinutes * 60);
  const [isSubmitConfirmOpen, setIsSubmitConfirmOpen] = useState(false);
  const [isExitConfirmOpen, setIsExitConfirmOpen] = useState(false);

  const currentQuestion = activeQuiz.questions[currentIndex];
  const totalQuestions = activeQuiz.questions.length;

  // Timer Countdown
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeftSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmitQuiz();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  const handleSelectOption = (value: string | number) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [currentQuestion.id]: value,
    }));
  };

  const handleClearAnswer = () => {
    setSelectedAnswers((prev) => {
      const next = { ...prev };
      delete next[currentQuestion.id];
      return next;
    });
  };

  const toggleFlagCurrent = () => {
    setFlaggedQuestions((prev) => ({
      ...prev,
      [currentQuestion.id]: !prev[currentQuestion.id],
    }));
  };

  const handleSubmitQuiz = () => {
    const answers: QuizAnswer[] = activeQuiz.questions.map((q) => {
      const userAns = selectedAnswers[q.id];
      let isCorrect = false;

      if (q.type === "MCQ" && q.options) {
        isCorrect = userAns === q.correctIndex || userAns === q.correctAnswer;
      } else {
        isCorrect =
          typeof userAns === "string" &&
          userAns.trim().toLowerCase() === q.correctAnswer.trim().toLowerCase();
      }

      return {
        questionId: q.id,
        questionText: q.question,
        userAnswer:
          typeof userAns === "number" && q.options
            ? q.options[userAns]
            : (userAns as string) || "Skipped",
        correctAnswer: q.correctAnswer,
        isCorrect,
        explanation: q.explanation || "Standard verified solution.",
      };
    });

    const score = answers.filter((a) => a.isCorrect).length;
    const incorrectAnswers = answers.filter((a) => !a.isCorrect && a.userAnswer !== "Skipped").length;
    const skippedAnswers = answers.filter((a) => a.userAnswer === "Skipped").length;
    const percentage = Math.round((score / totalQuestions) * 100);
    const timeSpentSeconds = activeQuiz.timeLimitMinutes * 60 - timeLeftSeconds;

    const result: QuizResult = {
      id: `res_${Date.now()}`,
      quizId: activeQuiz.id,
      quizTitle: activeQuiz.title,
      subjectId: activeQuiz.subjectId,
      date: new Date().toISOString().split("T")[0],
      score,
      maxScore: totalQuestions,
      percentage,
      correctAnswers: score,
      incorrectAnswers,
      skippedAnswers,
      timeTakenSeconds: timeSpentSeconds,
      timeSpentSeconds,
      answers,
      weakTopics:
        percentage < 70
          ? [`${activeQuiz.title} Core Concepts`, "Problem Boundary Conditions"]
          : [],
      recommendations:
        percentage >= 80
          ? ["Outstanding grasp of the concepts! Continue with advanced problem sets."]
          : ["Review the missed questions in your Mistake Notebook and re-read the chapter summary."],
      aiRecommendations:
        percentage >= 80
          ? "Outstanding grasp of the concepts! Continue with advanced problem sets."
          : "Review the missed questions in your Mistake Notebook and re-read the chapter summary.",
    };

    finishQuiz(result);
  };

  const answeredCount = Object.keys(selectedAnswers).length;
  const isCurrentAnswered = selectedAnswers[currentQuestion.id] !== undefined;

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-20">
      {/* Top Test Navigation Bar */}
      <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 sm:p-5 shadow-xs flex items-center justify-between gap-4 sticky top-16 z-20 backdrop-blur-md bg-white/95 dark:bg-slate-900/95">
        <div className="min-w-0">
          <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white truncate">
            {activeQuiz.title}
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Question {currentIndex + 1} of {totalQuestions} • {answeredCount} Answered
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          {/* Timer Badge */}
          <div
            className={`flex items-center gap-2 px-3 py-1.5 rounded-xl font-mono text-xs sm:text-sm font-bold border transition-colors ${
              timeLeftSeconds < 120
                ? "bg-rose-50 dark:bg-rose-950/60 border-rose-300 dark:border-rose-800 text-rose-600 animate-pulse"
                : "bg-slate-100 dark:bg-slate-800 border-slate-250 dark:border-slate-700 text-slate-900 dark:text-white"
            }`}
          >
            <Clock className="w-4 h-4" />
            <span>{formatTime(timeLeftSeconds)}</span>
          </div>

          <button
            onClick={() => setIsExitConfirmOpen(true)}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
            title="Quit Test"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Main Question Card */}
      <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-xs space-y-6">
        {/* Question Header & Flag toggle */}
        <div className="flex items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300">
              Q{currentIndex + 1} • {currentQuestion.type}
            </span>
            <span className="text-xs font-bold text-slate-400">
              [{currentQuestion.difficulty}]
            </span>
          </div>

          <div className="flex items-center gap-2">
            {isCurrentAnswered && (
              <button
                type="button"
                onClick={handleClearAnswer}
                className="text-xs text-slate-400 hover:text-rose-500 font-semibold px-2 py-1 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors flex items-center gap-1"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Clear Selection</span>
              </button>
            )}

            <button
              onClick={toggleFlagCurrent}
              className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-xl transition-all ${
                flaggedQuestions[currentQuestion.id]
                  ? "bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 border border-amber-300"
                  : "text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
              }`}
            >
              <Flag className="w-3.5 h-3.5" />
              <span>{flaggedQuestions[currentQuestion.id] ? "Flagged for Review" : "Flag"}</span>
            </button>
          </div>
        </div>

        {/* Question Statement */}
        <h4 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white leading-relaxed">
          {currentQuestion.question}
        </h4>

        {/* Options / Answer Input */}
        {currentQuestion.options ? (
          <div className="space-y-3">
            {currentQuestion.options.map((option, idx) => {
              const isSelected = selectedAnswers[currentQuestion.id] === idx;
              return (
                <div
                  key={idx}
                  onClick={() => handleSelectOption(idx)}
                  className={`p-4 rounded-xl border cursor-pointer transition-all flex items-center justify-between text-xs sm:text-sm font-medium ${
                    isSelected
                      ? "bg-indigo-50/80 dark:bg-indigo-950/60 border-indigo-500 text-indigo-900 dark:text-indigo-200 font-semibold shadow-xs ring-2 ring-indigo-500/20"
                      : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 text-slate-800 dark:text-slate-200"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                        isSelected
                          ? "bg-indigo-600 text-white"
                          : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
                      }`}
                    >
                      {String.fromCharCode(65 + idx)}
                    </span>
                    <span>{option}</span>
                  </div>

                  {isSelected && <CheckCircle2 className="w-4 h-4 text-indigo-600 shrink-0" />}
                </div>
              );
            })}
          </div>
        ) : (
          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase">
              Your Answer / Working:
            </label>
            <textarea
              rows={4}
              value={(selectedAnswers[currentQuestion.id] as string) || ""}
              onChange={(e) => handleSelectOption(e.target.value)}
              placeholder="Type your explanation or final numerical value..."
              className="w-full px-4 py-3 text-xs sm:text-sm rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-250 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        )}

        {/* YouTube Concept Link */}
        <div className="pt-2 flex items-center justify-end">
          <button
            type="button"
            onClick={() => {
              const query = `${activeQuiz.title} ${currentQuestion.question.slice(0, 40)}`;
              window.open(getYouTubeSearchUrl(query), "_blank", "noopener,noreferrer");
              addToast("Opening related concept lecture on YouTube...", "success");
            }}
            className="text-xs text-red-600 hover:text-red-700 dark:text-red-400 font-bold flex items-center gap-1.5 hover:underline"
          >
            <Youtube className="w-3.5 h-3.5" />
            <span>Need concept help? Watch on YouTube</span>
            <ExternalLink className="w-2.5 h-2.5" />
          </button>
        </div>

        {/* Question Palette Scroller */}
        <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-2">
          <p className="text-[11px] font-bold text-slate-400 uppercase">Question Palette</p>
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            {activeQuiz.questions.map((q, idx) => {
              const isAnswered = selectedAnswers[q.id] !== undefined;
              const isFlagged = flaggedQuestions[q.id];
              const isCurrent = idx === currentIndex;

              return (
                <button
                  key={q.id}
                  onClick={() => setCurrentIndex(idx)}
                  className={`w-8 h-8 rounded-lg text-xs font-bold transition-all shrink-0 flex items-center justify-center ${
                    isCurrent
                      ? "ring-2 ring-indigo-500 ring-offset-2 bg-indigo-600 text-white"
                      : isFlagged
                      ? "bg-amber-100 dark:bg-amber-950 text-amber-700 border border-amber-300"
                      : isAnswered
                      ? "bg-emerald-100 dark:bg-emerald-950 text-emerald-700"
                      : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
                  }`}
                >
                  {idx + 1}
                </button>
              );
            })}
          </div>
        </div>

        {/* Footer Navigation & Continue Buttons */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800 gap-3">
          <button
            onClick={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
            disabled={currentIndex === 0}
            className="px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-40 transition-colors flex items-center gap-1.5 border border-slate-200 dark:border-slate-700"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Previous</span>
          </button>

          <div className="flex items-center gap-2">
            {currentIndex === totalQuestions - 1 ? (
              <button
                onClick={() => setIsSubmitConfirmOpen(true)}
                className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-bold shadow-md transition-all active:scale-95 flex items-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Submit & View Score</span>
              </button>
            ) : (
              <button
                onClick={() => setCurrentIndex((prev) => Math.min(totalQuestions - 1, prev + 1))}
                className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs sm:text-sm font-bold shadow-md transition-all flex items-center gap-1.5 active:scale-95"
              >
                <span>Continue / Next Question</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Submit Confirmation Dialog */}
      <ConfirmDialog
        isOpen={isSubmitConfirmOpen}
        onClose={() => setIsSubmitConfirmOpen(false)}
        onConfirm={handleSubmitQuiz}
        title="Submit Quiz"
        message={`You have answered ${answeredCount} of ${totalQuestions} questions. Are you ready to submit and calculate your score?`}
        confirmText="Yes, Submit Test"
        danger={false}
      />

      {/* Exit Test Confirmation */}
      <ConfirmDialog
        isOpen={isExitConfirmOpen}
        onClose={() => setIsExitConfirmOpen(false)}
        onConfirm={() => setCurrentView("quizzes")}
        title="Exit Quiz"
        message="Are you sure you want to exit? Your current test progress will be lost."
        confirmText="Exit Quiz"
      />
    </div>
  );
};
