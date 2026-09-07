import React, { useState } from "react";
import {
  Calendar,
  Clock,
  Trophy,
  CheckCircle2,
  Circle,
  Plus,
  ArrowRight,
  Flame,
  Sparkles,
  BookOpen,
} from "lucide-react";
import { useStudy } from "../../context/StudyContext";
import { Modal } from "../common/Modal";

interface ExamTarget {
  id: string;
  name: string;
  date: string;
  subject: string;
  totalChapters: number;
  completedChapters: number;
}

export const ExamCenter: React.FC = () => {
  const { subjects, quizzes, startQuiz, setCurrentView, addToast } = useStudy();

  const [exams, setExams] = useState<ExamTarget[]>([
    {
      id: "exam_1",
      name: "Mid-Term Physics & Mechanics",
      date: "2025-04-10",
      subject: "Physics",
      totalChapters: 6,
      completedChapters: 4,
    },
    {
      id: "exam_2",
      name: "Organic Chemistry Comprehensive",
      date: "2025-04-25",
      subject: "Chemistry",
      totalChapters: 8,
      completedChapters: 5,
    },
    {
      id: "exam_3",
      name: "Calculus Final Exam",
      date: "2025-05-12",
      subject: "Mathematics",
      totalChapters: 7,
      completedChapters: 6,
    },
  ]);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [examName, setExamName] = useState("");
  const [examDate, setExamDate] = useState("");
  const [examSubject, setExamSubject] = useState(subjects[0]?.name || "General");
  const [totalChapters, setTotalChapters] = useState(6);

  const calculateDaysLeft = (targetDate: string) => {
    const diff = new Date(targetDate).getTime() - new Date().getTime();
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
    return Math.max(0, days);
  };

  const handleAddExam = (e: React.FormEvent) => {
    e.preventDefault();
    if (!examName.trim() || !examDate) return;

    setExams((prev) => [
      ...prev,
      {
        id: `exam_${Date.now()}`,
        name: examName,
        date: examDate,
        subject: examSubject,
        totalChapters,
        completedChapters: 0,
      },
    ]);

    setIsAddModalOpen(false);
    setExamName("");
    addToast("Target Exam Scheduled! 🎯");
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Exam Preparation Hub & Countdowns
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Monitor target exam dates, syllabus completion status, and take full-length simulated mock tests.
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs sm:text-sm font-semibold shadow-sm transition-all active:scale-95 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add Target Exam</span>
        </button>
      </div>

      {/* Countdown Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5">
        {exams.map((exam) => {
          const daysLeft = calculateDaysLeft(exam.date);
          const percent = Math.round((exam.completedChapters / exam.totalChapters) * 100);

          return (
            <div
              key={exam.id}
              className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 sm:p-6 shadow-xs space-y-4 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-500">{exam.subject}</span>
                  <span
                    className={`text-xs font-extrabold px-2.5 py-1 rounded-xl flex items-center gap-1 ${
                      daysLeft <= 14
                        ? "bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300 animate-pulse"
                        : "bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300"
                    }`}
                  >
                    <Clock className="w-3.5 h-3.5" />
                    <span>{daysLeft} Days Left</span>
                  </span>
                </div>

                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  {exam.name}
                </h3>
                <p className="text-xs text-slate-400">Scheduled on {exam.date}</p>

                {/* Progress bar */}
                <div className="space-y-1.5 pt-1">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-slate-500">Syllabus Covered</span>
                    <span className="text-slate-900 dark:text-white">
                      {exam.completedChapters}/{exam.totalChapters} Chaps ({percent}%)
                    </span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-indigo-600 transition-all duration-500"
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center gap-2">
                <button
                  onClick={() => setCurrentView("quizzes")}
                  className="w-full py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-xs transition-all flex items-center justify-center gap-1.5"
                >
                  <Trophy className="w-3.5 h-3.5" />
                  <span>Launch Mock Test</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Exam Day Checklist & Strategy Tips */}
      <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 sm:p-6 shadow-xs space-y-4">
        <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
          <span>High-Yield Exam Strategy Protocol</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs leading-relaxed">
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700 space-y-1.5">
            <h4 className="font-bold text-slate-900 dark:text-white">1. Active Recall Over Re-Reading</h4>
            <p className="text-slate-500 dark:text-slate-400">
              Solve timed mock questions rather than passively reading highlights. Flashcard recall triggers 3x neural retention.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700 space-y-1.5">
            <h4 className="font-bold text-slate-900 dark:text-white">2. Mistake Log Review</h4>
            <p className="text-slate-500 dark:text-slate-400">
              Spend 30 minutes daily reviewing questions you previously answered incorrectly in practice tests.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700 space-y-1.5">
            <h4 className="font-bold text-slate-900 dark:text-white">3. Sleep & Consolidation</h4>
            <p className="text-slate-500 dark:text-slate-400">
              Memory consolidation occurs during REM sleep cycles. Maintain 7-8 hours of sleep before exam days.
            </p>
          </div>
        </div>
      </div>

      {/* Add Exam Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Schedule Target Exam"
        subtitle="Set a countdown and track chapter readiness"
      >
        <form onSubmit={handleAddExam} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
              Exam Name *
            </label>
            <input
              type="text"
              required
              value={examName}
              onChange={(e) => setExamName(e.target.value)}
              placeholder="e.g. SAT Mathematics / Biology Finals"
              className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-250 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                Exam Date *
              </label>
              <input
                type="date"
                required
                value={examDate}
                onChange={(e) => setExamDate(e.target.value)}
                className="w-full px-3.5 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-250 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                Subject
              </label>
              <select
                value={examSubject}
                onChange={(e) => setExamSubject(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-250 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none"
              >
                {subjects.map((s) => (
                  <option key={s.id} value={s.name}>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
              Total Chapters in Syllabus
            </label>
            <input
              type="number"
              min={1}
              max={30}
              value={totalChapters}
              onChange={(e) => setTotalChapters(Number(e.target.value))}
              className="w-full px-3.5 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-250 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none"
            />
          </div>

          <div className="flex justify-end gap-2.5 pt-3 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={() => setIsAddModalOpen(false)}
              className="px-4 py-2 text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-xs font-semibold rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm"
            >
              Add Exam Target
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
