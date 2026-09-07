import React, { useState } from "react";
import {
  Calendar,
  Sparkles,
  Plus,
  CheckCircle2,
  Circle,
  Clock,
  Trash2,
  Zap,
  BookOpen,
  ArrowRight,
} from "lucide-react";
import { useStudy } from "../../context/StudyContext";
import { Modal } from "../common/Modal";

export const StudyPlanner: React.FC = () => {
  const {
    studyPlan,
    toggleSlotComplete,
    addStudySlot,
    generateAIPlan,
    subjects,
    addToast,
    triggerConfetti,
  } = useStudy();

  const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
  const [selectedDay, setSelectedDay] = useState("Monday");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);

  // Manual Form state
  const [topic, setTopic] = useState("");
  const [selectedSubject, setSelectedSubject] = useState(subjects[0]?.name || "Mathematics");
  const [timeRange, setTimeRange] = useState("05:00 PM - 06:00 PM");
  const [type, setType] = useState("Theory");
  const [durationMinutes, setDurationMinutes] = useState(60);
  const [priority, setPriority] = useState<"High" | "Medium" | "Low">("High");

  // AI Timetable Form state
  const [dailyHours, setDailyHours] = useState(4);
  const [targetGoal, setTargetGoal] = useState("Scoring 90%+ in upcoming final term exams");
  const [isAiLoading, setIsAiLoading] = useState(false);

  const currentDayIndex = Math.max(
    0,
    daysOfWeek.findIndex((d) => d.toLowerCase() === selectedDay.toLowerCase())
  );
  const currentDayPlan = studyPlan.dailySchedule[currentDayIndex] || {
    day: selectedDay,
    slots: [],
  };

  const handleManualAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim()) return;

    addStudySlot(selectedDay, {
      time: timeRange,
      subject: selectedSubject,
      topic,
      type,
      durationMinutes,
      priority,
    });

    setTopic("");
    setIsAddModalOpen(false);
  };

  const handleGenerateAiSchedule = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsAiLoading(true);

    try {
      await generateAIPlan({
        subjects: subjects.map((s) => s.name),
        hours: dailyHours,
        examDates: {},
        target: targetGoal,
      });
      setIsAiModalOpen(false);
    } catch (e) {
      addToast("Failed to generate schedule", undefined, "error");
    } finally {
      setIsAiLoading(false);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            AI Study Planner & Weekly Timetable
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Balanced weekly schedule with built-in active recall and spaced revision slots.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            onClick={() => setIsAiModalOpen(true)}
            className="px-3.5 py-2 rounded-xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-300 text-xs sm:text-sm font-semibold border border-indigo-200/60 dark:border-indigo-800/60 hover:bg-indigo-100 flex items-center gap-1.5 transition-all shadow-xs"
          >
            <Sparkles className="w-4 h-4" />
            <span>Generate AI Timetable</span>
          </button>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs sm:text-sm font-semibold shadow-sm transition-all flex items-center gap-1.5 active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>Add Session</span>
          </button>
        </div>
      </div>

      {/* Goal banner */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-indigo-500/10 via-blue-500/10 to-transparent border border-indigo-200 dark:border-indigo-900/60 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center shrink-0 shadow-xs">
            <Zap className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-indigo-600 dark:text-indigo-400">
              Weekly Target Focus
            </span>
            <p className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
              {studyPlan.weeklyGoal}
            </p>
          </div>
        </div>
        <span className="hidden md:inline-flex text-xs font-bold text-slate-500 bg-white dark:bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 shrink-0">
          {studyPlan.totalScheduledHours} Scheduled Hours
        </span>
      </div>

      {/* Days of Week Tab Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {daysOfWeek.map((day, idx) => {
          const dayPlan = studyPlan.dailySchedule[idx];
          const totalSlots = dayPlan?.slots?.length || 0;
          const completedSlots = dayPlan?.slots?.filter((s) => s.isCompleted).length || 0;

          return (
            <button
              key={day}
              onClick={() => setSelectedDay(day)}
              className={`px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all shrink-0 flex items-center gap-2 ${
                selectedDay.toLowerCase() === day.toLowerCase()
                  ? "bg-indigo-600 text-white shadow-sm"
                  : "bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-indigo-300"
              }`}
            >
              <span>{day}</span>
              {totalSlots > 0 && (
                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                    selectedDay.toLowerCase() === day.toLowerCase()
                      ? "bg-indigo-700 text-white"
                      : "bg-slate-100 dark:bg-slate-800 text-slate-500"
                  }`}
                >
                  {completedSlots}/{totalSlots}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Day Schedule List */}
      <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 sm:p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Calendar className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            <span>{selectedDay}&apos;s Study Schedule</span>
          </h3>
          <span className="text-xs text-slate-400">
            {currentDayPlan.slots.length} planned session(s)
          </span>
        </div>

        {currentDayPlan.slots.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mx-auto">
              <Calendar className="w-6 h-6" />
            </div>
            <h4 className="text-sm font-bold text-slate-900 dark:text-white">
              No Study Sessions Scheduled for {selectedDay}
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
              Add a session or use the AI Timetable generator to balance your week.
            </p>
            <div className="flex justify-center gap-2 pt-2">
              <button
                onClick={() => setIsAddModalOpen(true)}
                className="px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-semibold"
              >
                Add Study Task
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            {currentDayPlan.slots.map((item) => (
              <div
                key={item.id}
                className={`p-4 rounded-xl border transition-all flex items-start justify-between gap-4 ${
                  item.isCompleted
                    ? "bg-slate-50/70 dark:bg-slate-900/40 border-slate-200 dark:border-slate-800 opacity-80"
                    : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-xs"
                }`}
              >
                <div className="flex items-start gap-3.5">
                  <button
                    onClick={() => toggleSlotComplete(currentDayIndex, item.id)}
                    className="mt-0.5 text-slate-400 hover:text-emerald-500 transition-colors"
                  >
                    {item.isCompleted ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-500 fill-emerald-100 dark:fill-emerald-950" />
                    ) : (
                      <Circle className="w-5 h-5" />
                    )}
                  </button>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300">
                        {item.subject}
                      </span>
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                        {item.type}
                      </span>
                      <span
                        className={`text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded ${
                          item.priority === "High"
                            ? "bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300"
                            : "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300"
                        }`}
                      >
                        {item.priority}
                      </span>
                    </div>

                    <h4
                      className={`text-sm font-bold ${
                        item.isCompleted
                          ? "line-through text-slate-400 dark:text-slate-500"
                          : "text-slate-900 dark:text-white"
                      }`}
                    >
                      {item.topic}
                    </h4>

                    <div className="flex items-center gap-3 text-[11px] text-slate-400 pt-0.5">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {item.time}
                      </span>
                      <span>•</span>
                      <span>{item.durationMinutes} Minutes</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Manual Add Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title={`Add Study Session (${selectedDay})`}
        subtitle="Schedule a focused revision or practice session"
      >
        <form onSubmit={handleManualAdd} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
              Topic / Task *
            </label>
            <input
              type="text"
              required
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="e.g. Practice 20 Kinematics MCQs & Derivations"
              className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-250 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                Subject
              </label>
              <select
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-250 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none"
              >
                {subjects.map((s) => (
                  <option key={s.id} value={s.name}>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                Session Type
              </label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-250 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none"
              >
                <option value="Theory">Theory</option>
                <option value="Practice">Practice</option>
                <option value="Active Recall">Active Recall</option>
                <option value="Quiz">Quiz</option>
                <option value="Summary">Summary</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                Time Window
              </label>
              <input
                type="text"
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                placeholder="e.g. 05:00 PM - 06:00 PM"
                className="w-full px-3.5 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-250 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                Priority
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as any)}
                className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-250 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none"
              >
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
            </div>
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
              Add Session
            </button>
          </div>
        </form>
      </Modal>

      {/* AI Timetable Generator Modal */}
      <Modal
        isOpen={isAiModalOpen}
        onClose={() => setIsAiModalOpen(false)}
        title="AI Smart Timetable Generator"
        subtitle="Generate an optimized 7-day schedule with spaced repetition"
      >
        <form onSubmit={handleGenerateAiSchedule} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
              Daily Target Study Hours
            </label>
            <input
              type="number"
              min={1}
              max={12}
              value={dailyHours}
              onChange={(e) => setDailyHours(Number(e.target.value))}
              className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-250 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
              Primary Academic Target / Goal
            </label>
            <input
              type="text"
              value={targetGoal}
              onChange={(e) => setTargetGoal(e.target.value)}
              className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-250 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none"
            />
          </div>

          <div className="p-3 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800/60 text-xs text-indigo-900 dark:text-indigo-200 leading-relaxed">
            💡 AI will evenly distribute all <strong>{subjects.length} subjects</strong>, scheduling difficult chapters during peak morning concentration windows and adding active recall sessions.
          </div>

          <div className="flex justify-end gap-2.5 pt-3 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={() => setIsAiModalOpen(false)}
              className="px-4 py-2 text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isAiLoading}
              className="px-4 py-2 text-xs font-semibold rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white shadow-sm flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{isAiLoading ? "Generating Timetable..." : "Generate Timetable"}</span>
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
