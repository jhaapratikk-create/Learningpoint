import React, { useState } from "react";
import {
  Target,
  Plus,
  CheckCircle2,
  Circle,
  Trophy,
  Calendar,
  Flame,
  Sparkles,
} from "lucide-react";
import { useStudy } from "../../context/StudyContext";
import { Modal } from "../common/Modal";

interface Goal {
  id: string;
  title: string;
  targetMetric: number;
  currentMetric: number;
  unit: string;
  deadline: string;
  isCompleted: boolean;
  category: "Study Time" | "Chapters" | "Quizzes" | "Score" | "Custom";
}

export const GoalsView: React.FC = () => {
  const { addToast, triggerConfetti } = useStudy();

  const [goals, setGoals] = useState<Goal[]>([
    {
      id: "goal_1",
      title: "Complete 25 Hours of Focused Study this Week",
      targetMetric: 25,
      currentMetric: 18,
      unit: "Hours",
      deadline: "Sunday",
      isCompleted: false,
      category: "Study Time",
    },
    {
      id: "goal_2",
      title: "Finish 5 Mock Practice Quizzes with >80% Score",
      targetMetric: 5,
      currentMetric: 3,
      unit: "Quizzes",
      deadline: "Next Week",
      isCompleted: false,
      category: "Quizzes",
    },
    {
      id: "goal_3",
      title: "Master All 6 Physics Optics Chapters",
      targetMetric: 6,
      currentMetric: 6,
      unit: "Chapters",
      deadline: "Completed",
      isCompleted: true,
      category: "Chapters",
    },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [targetMetric, setTargetMetric] = useState(10);
  const [unit, setUnit] = useState("Hours");
  const [deadline, setDeadline] = useState("Next Friday");
  const [category, setCategory] = useState<Goal["category"]>("Study Time");

  const handleToggle = (id: string) => {
    setGoals((prev) =>
      prev.map((g) => {
        if (g.id === id) {
          const nextState = !g.isCompleted;
          if (nextState) {
            triggerConfetti();
            addToast("Goal Achieved! 🏆");
          }
          return { ...g, isCompleted: nextState };
        }
        return g;
      })
    );
  };

  const handleAddGoal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    setGoals((prev) => [
      ...prev,
      {
        id: `goal_${Date.now()}`,
        title,
        targetMetric,
        currentMetric: 0,
        unit,
        deadline,
        isCompleted: false,
        category,
      },
    ]);

    setIsModalOpen(false);
    setTitle("");
    addToast("New Academic Goal Set! 🎯");
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Academic Goals & Targets
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Set SMART weekly and monthly milestones to maintain consistent study habits.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs sm:text-sm font-semibold shadow-sm transition-all active:scale-95 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Set New Goal</span>
        </button>
      </div>

      {/* Goals Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5">
        {goals.map((goal) => {
          const progressPercent = Math.min(
            100,
            Math.round((goal.currentMetric / goal.targetMetric) * 100)
          );

          return (
            <div
              key={goal.id}
              className={`p-6 rounded-2xl border transition-all flex flex-col justify-between space-y-4 ${
                goal.isCompleted
                  ? "bg-slate-50/70 dark:bg-slate-900/40 border-slate-200 dark:border-slate-800 opacity-80"
                  : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-xs"
              }`}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300">
                    {goal.category}
                  </span>
                  <span className="text-xs text-slate-400 font-semibold flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {goal.deadline}
                  </span>
                </div>

                <h4
                  className={`text-sm sm:text-base font-bold ${
                    goal.isCompleted
                      ? "line-through text-slate-400 dark:text-slate-500"
                      : "text-slate-900 dark:text-white"
                  }`}
                >
                  {goal.title}
                </h4>

                <div className="space-y-1.5 pt-1">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-slate-400">Current Progress</span>
                    <span className="text-slate-900 dark:text-white">
                      {goal.currentMetric} / {goal.targetMetric} {goal.unit} ({progressPercent}%)
                    </span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        goal.isCompleted ? "bg-emerald-500" : "bg-indigo-600"
                      }`}
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <button
                  onClick={() => handleToggle(goal.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                    goal.isCompleted
                      ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
                      : "bg-slate-100 dark:bg-slate-800 hover:bg-emerald-50 hover:text-emerald-700 text-slate-600 dark:text-slate-300"
                  }`}
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{goal.isCompleted ? "Completed" : "Mark Done"}</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Goal Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Set Academic Target"
        subtitle="Define a measurable target to stay focused"
      >
        <form onSubmit={handleAddGoal} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
              Goal Description *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Complete 20 Calculus Integration problems"
              className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-250 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                Target Metric
              </label>
              <input
                type="number"
                min={1}
                value={targetMetric}
                onChange={(e) => setTargetMetric(Number(e.target.value))}
                className="w-full px-3.5 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-250 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                Unit
              </label>
              <input
                type="text"
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
                placeholder="e.g. Hours / Quizzes / Chapters"
                className="w-full px-3.5 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-250 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2.5 pt-3 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-xs font-semibold rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm"
            >
              Set Goal
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
