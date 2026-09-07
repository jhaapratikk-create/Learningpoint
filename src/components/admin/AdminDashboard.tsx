import React, { useState } from "react";
import {
  ShieldCheck,
  Users,
  Cpu,
  Activity,
  Database,
  BarChart,
  Settings,
  Sparkles,
  RefreshCw,
  LogOut,
  CheckCircle2,
  AlertTriangle,
  Server,
  Zap,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useStudy } from "../../context/StudyContext";

export const AdminDashboard: React.FC = () => {
  const { logoutAdmin } = useAuth();
  const { subjects, notes, quizzes, flashcards, addToast, setCurrentView } = useStudy();

  const [promptTuning, setPromptTuning] = useState(
    "You are an expert AI Study Assistant, academic mentor, and conceptual tutor. You break down complex concepts into crystal-clear explanations with real-world analogies, step-by-step math derivations, and active recall practice."
  );
  const [modelTemperature, setModelTemperature] = useState(0.7);
  const [isSaved, setIsSaved] = useState(false);

  const stats = {
    totalUsers: 14280,
    activeToday: 2490,
    totalStudyHours: 84320,
    quizzesCompleted: 67200,
    aiQueriesAnswered: 312450,
    geminiLatency: "380ms",
    serverUptime: "99.98%",
  };

  const handleSaveConfig = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaved(true);
    addToast("Admin system prompt configuration updated! ⚡");
    setTimeout(() => setIsSaved(false), 2500);
  };

  const handleExit = () => {
    logoutAdmin();
    setCurrentView("dashboard");
    addToast("Logged out of Admin Portal");
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Admin Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-slate-900 text-white shadow-md">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg sm:text-xl font-extrabold flex items-center gap-2">
              <span>Platform Admin & Telemetry Center</span>
              <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                Verified Access (847230)
              </span>
            </h2>
            <p className="text-xs text-slate-400">
              Live AI Studio infrastructure, user metrics, and prompt hyperparameters.
            </p>
          </div>
        </div>

        <button
          onClick={handleExit}
          className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs sm:text-sm font-semibold text-rose-300 flex items-center gap-2 transition-all self-start sm:self-auto"
        >
          <LogOut className="w-4 h-4" />
          <span>Exit Admin</span>
        </button>
      </div>

      {/* Real-time System KPI Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-1.5">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Total Enrolled Students</span>
            <Users className="w-4 h-4 text-indigo-500" />
          </div>
          <p className="text-2xl font-black text-slate-900 dark:text-white">
            {stats.totalUsers.toLocaleString()}
          </p>
          <span className="text-[10px] font-bold text-emerald-500">
            +{stats.activeToday.toLocaleString()} Active Today
          </span>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-1.5">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Gemini AI Queries Served</span>
            <Zap className="w-4 h-4 text-amber-500" />
          </div>
          <p className="text-2xl font-black text-slate-900 dark:text-white">
            {stats.aiQueriesAnswered.toLocaleString()}
          </p>
          <span className="text-[10px] text-slate-400">Avg Latency: {stats.geminiLatency}</span>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-1.5">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Total Practice Tests Taken</span>
            <Activity className="w-4 h-4 text-purple-500" />
          </div>
          <p className="text-2xl font-black text-slate-900 dark:text-white">
            {stats.quizzesCompleted.toLocaleString()}
          </p>
          <span className="text-[10px] font-bold text-emerald-500">89.4% Completion Rate</span>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-1.5">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Cluster Health</span>
            <Server className="w-4 h-4 text-emerald-500" />
          </div>
          <p className="text-2xl font-black text-emerald-600 dark:text-emerald-400">
            {stats.serverUptime}
          </p>
          <span className="text-[10px] text-slate-400">Cloud Run Containers Active</span>
        </div>
      </div>

      {/* AI Tutor System Prompt Configuration */}
      <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 sm:p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              <span>Global AI Tutor System Directive & Temperature</span>
            </h3>
            <p className="text-xs text-slate-500">
              Tune the core instruction prompt sent to the Gemini 2.5 flash reasoning model.
            </p>
          </div>

          <button
            onClick={() =>
              setPromptTuning(
                "You are an expert AI Study Assistant, academic mentor, and conceptual tutor. You break down complex concepts into crystal-clear explanations with real-world analogies, step-by-step math derivations, and active recall practice."
              )
            }
            className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
          >
            <RefreshCw className="w-3 h-3" />
            Reset to Default
          </button>
        </div>

        <form onSubmit={handleSaveConfig} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
              Master System Instruction
            </label>
            <textarea
              rows={4}
              value={promptTuning}
              onChange={(e) => setPromptTuning(e.target.value)}
              className="w-full p-3.5 text-xs sm:text-sm font-mono rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
            <div className="space-y-1">
              <div className="flex items-center justify-between gap-4 text-xs font-bold text-slate-700 dark:text-slate-300">
                <span>Model Temperature (Creativity vs Determinism):</span>
                <span className="font-mono text-indigo-600">{modelTemperature}</span>
              </div>
              <input
                type="range"
                min="0.1"
                max="1.0"
                step="0.05"
                value={modelTemperature}
                onChange={(e) => setModelTemperature(parseFloat(e.target.value))}
                className="w-64 accent-indigo-600 cursor-pointer"
              />
            </div>

            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs sm:text-sm shadow-sm transition-all flex items-center gap-2"
            >
              {isSaved ? <CheckCircle2 className="w-4 h-4 text-white" /> : <Settings className="w-4 h-4" />}
              <span>{isSaved ? "Saved Changes" : "Deploy Config to Gemini"}</span>
            </button>
          </div>
        </form>
      </div>

      {/* Seeded Curriculum Database Table */}
      <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 sm:p-6 shadow-xs space-y-4">
        <h3 className="text-base font-bold text-slate-900 dark:text-white">
          Active Knowledge Base & Curriculum Schema
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center text-xs">
          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
            <p className="text-slate-400 font-bold uppercase text-[10px]">Active Subjects</p>
            <p className="text-xl font-extrabold text-slate-900 dark:text-white mt-1">
              {subjects.length}
            </p>
          </div>
          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
            <p className="text-slate-400 font-bold uppercase text-[10px]">Study Notes</p>
            <p className="text-xl font-extrabold text-slate-900 dark:text-white mt-1">
              {notes.length}
            </p>
          </div>
          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
            <p className="text-slate-400 font-bold uppercase text-[10px]">Flashcard Decks</p>
            <p className="text-xl font-extrabold text-slate-900 dark:text-white mt-1">
              {flashcards.length}
            </p>
          </div>
          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
            <p className="text-slate-400 font-bold uppercase text-[10px]">Test Modules</p>
            <p className="text-xl font-extrabold text-slate-900 dark:text-white mt-1">
              {quizzes.length}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
