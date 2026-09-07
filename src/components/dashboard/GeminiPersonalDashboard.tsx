import React, { useState, useEffect } from "react";
import {
  Sparkles,
  Bot,
  Flame,
  CheckCircle2,
  Clock,
  Target,
  GraduationCap,
  RefreshCw,
  Send,
  Heart,
  TrendingUp,
  AlertCircle,
  Lightbulb,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useStudy } from "../../context/StudyContext";
import { apiService } from "../../services/api";
import { AIGeminiDashboardInsights } from "../../types";

export const GeminiPersonalDashboard: React.FC = () => {
  const { user } = useAuth();
  const {
    setCurrentView,
    focusSessions,
    mistakes,
    subjects,
    addToast,
  } = useStudy();

  const [insights, setInsights] = useState<AIGeminiDashboardInsights | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [completedTasks, setCompletedTasks] = useState<Record<number, boolean>>({});
  const [quickPrompt, setQuickPrompt] = useState("");
  const [isAnswering, setIsAnswering] = useState(false);
  const [partnerAnswer, setPartnerAnswer] = useState<string | null>(null);

  // Compute stats for personalization
  const todayStr = new Date().toISOString().split("T")[0];
  const totalStudyMinutesToday = focusSessions
    .filter((s) => s.completedAt?.startsWith(todayStr))
    .reduce((acc, s) => acc + s.durationMinutes, 0);

  const fetchInsights = async () => {
    setIsLoading(true);
    try {
      const data = await apiService.getPersonalDashboardInsights({
        name: user?.name || "Scholar",
        grade: user?.grade || "Class 12 Science",
        aim: user?.aim || "Academic Excellence",
        stream: user?.stream || "Science",
        targetExam: user?.targetExam || "Board & Competitive Exams",
        streak: user?.streak || 3,
        totalStudyMinutesToday: Math.max(15, totalStudyMinutesToday),
        mistakeCount: mistakes.length,
        weakTopics: mistakes.slice(0, 3).map((m) => `${m.subject}: ${m.topic}`),
        strongTopics: subjects.slice(0, 2).map((s) => s.name),
        preferredLanguage: user?.preferredLanguage || "English",
      });
      setInsights(data);
    } catch (err) {
      console.error("Failed to load Gemini insights", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchInsights();
  }, [user?.id, user?.grade, user?.aim]);

  const toggleTask = (idx: number) => {
    setCompletedTasks((prev) => ({
      ...prev,
      [idx]: !prev[idx],
    }));
    if (!completedTasks[idx]) {
      addToast("Focus Task Completed! 🎯", "Great job staying disciplined today.");
    }
  };

  const handleAskPartner = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickPrompt.trim()) return;

    setIsAnswering(true);
    setPartnerAnswer(null);
    try {
      const res = await apiService.sendChatMessage({
        message: quickPrompt,
        mode: "partner",
        subject: "Personal Student Life & Studies",
        preferredLanguage: user?.preferredLanguage || "English",
        model: "gemini-3.1-flash-lite",
      });
      setPartnerAnswer(res.text);
    } catch (err) {
      addToast("Gemini Partner is offline", undefined, "error");
    } finally {
      setIsAnswering(false);
    }
  };

  const promptSuggestions = [
    "How do I study for 3 hours without getting distracted?",
    "I feel stressed about my upcoming syllabus. Give me advice.",
    "Best way to memorize formulas permanently?",
    "How to manage sleep and late-night study?",
  ];

  return (
    <div className="rounded-3xl bg-gradient-to-br from-indigo-950 via-slate-900 to-slate-950 border border-indigo-500/20 p-5 sm:p-7 shadow-2xl text-white space-y-6 relative overflow-hidden">
      {/* Background glowing accents */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-60 h-60 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header bar */}
      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-indigo-500/20 pb-5">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gradient-to-r from-indigo-500/20 to-blue-500/20 border border-indigo-400/30 text-indigo-300 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-indigo-300 animate-pulse" />
            <span>Google Gemini Personal Student Dashboard</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            <span className="text-[10px] text-emerald-300 uppercase font-bold">Active Partner</span>
          </div>

          <h3 className="text-xl sm:text-2xl font-black tracking-tight text-white flex items-center gap-2">
            <span>{user?.name || "Scholar"}'s AI Intelligence Center</span>
          </h3>

          <div className="flex items-center gap-3 text-xs text-indigo-200/80 flex-wrap">
            <span className="flex items-center gap-1">
              <GraduationCap className="w-3.5 h-3.5 text-indigo-400" />
              {user?.grade || "Class 12"}
            </span>
            <span>•</span>
            <span className="flex items-center gap-1 text-amber-300 font-semibold">
              <Target className="w-3.5 h-3.5" />
              Target: {user?.aim || "Academic Mastery"}
            </span>
            <span>•</span>
            <span className="flex items-center gap-1 text-rose-300 font-semibold">
              <Flame className="w-3.5 h-3.5 fill-rose-400 text-rose-400" />
              {user?.streak || 1} Day Streak
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={fetchInsights}
            disabled={isLoading}
            className="px-3 py-2 rounded-xl bg-indigo-900/60 hover:bg-indigo-800/80 border border-indigo-400/30 text-xs font-semibold text-indigo-200 flex items-center gap-1.5 transition-all disabled:opacity-50"
            title="Regenerate Gemini Insights"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? "animate-spin text-indigo-400" : ""}`} />
            <span>{isLoading ? "Updating..." : "Refresh Insights"}</span>
          </button>
          <button
            onClick={() => setCurrentView("ai-tutor")}
            className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-xs font-bold text-white flex items-center gap-1.5 shadow-md shadow-indigo-600/30 transition-all active:scale-95"
          >
            <Bot className="w-4 h-4" />
            <span>Open Full Chat</span>
          </button>
        </div>
      </div>

      {/* Partner Greeting & Thought of the Day */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-2 rounded-2xl bg-indigo-900/30 border border-indigo-500/20 p-4 sm:p-5 flex flex-col justify-between space-y-3">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-indigo-300">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>Gemini Partner Briefing</span>
            </div>
            <p className="text-sm sm:text-base font-medium text-slate-100 leading-relaxed">
              {insights?.partnerGreeting ||
                `Hey ${user?.name || "Scholar"}! Ready to tackle today's study goals for ${user?.aim || "academic excellence"}? Every focused hour counts!`}
            </p>
          </div>

          <div className="pt-2 border-t border-indigo-500/20 flex items-center gap-2 text-xs text-indigo-200/90">
            <Lightbulb className="w-4 h-4 text-amber-300 shrink-0" />
            <span className="italic">
              "{insights?.dailyQuote || "Small disciplines repeated with consistency every day lead to great achievements."}"
            </span>
          </div>
        </div>

        {/* Mindset & Routine Card */}
        <div className="rounded-2xl bg-slate-800/50 border border-slate-700/60 p-4 sm:p-5 flex flex-col justify-between space-y-3">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-300">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Student Mindset Tip</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              {insights?.mindsetTip ||
                "When feeling overwhelmed by a big chapter, start with just 15 minutes of uninterrupted focus. Momentum will take care of the rest."}
            </p>
          </div>

          <div className="pt-2 border-t border-slate-700/60 flex items-center justify-between text-[11px] text-slate-400">
            <span className="flex items-center gap-1 text-teal-300">
              <Heart className="w-3.5 h-3.5 text-rose-400" />
              {insights?.wellnessAndBalanceAdvice || "Hydrate & take screen breaks"}
            </span>
          </div>
        </div>
      </div>

      {/* Today's Tailored Focus Plan */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-indigo-400" />
            <h4 className="text-sm font-bold text-white">Gemini Recommended Focus Plan For Today</h4>
          </div>
          <span className="text-[11px] text-indigo-300 font-medium">Personalized for {user?.grade}</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {(insights?.todaysFocusPlan || [
            {
              task: "High-Priority Derivation Review",
              subject: "Physics / Math",
              durationMinutes: 35,
              reason: "Mastering step derivations guarantees zero step-mark loss.",
            },
            {
              task: "Practice 10 High-Yield Exam Questions",
              subject: "Problem Drill",
              durationMinutes: 40,
              reason: "Reinforces speed and accuracy under timed conditions.",
            },
            {
              task: "Mistake Notebook Active Recall",
              subject: "Revision",
              durationMinutes: 20,
              reason: "Eliminates previously identified conceptual traps.",
            },
          ]).map((item, idx) => {
            const isDone = completedTasks[idx];
            return (
              <div
                key={idx}
                className={`rounded-2xl p-4 border transition-all flex flex-col justify-between space-y-3 ${
                  isDone
                    ? "bg-emerald-950/30 border-emerald-500/40 text-slate-300"
                    : "bg-indigo-900/20 border-indigo-500/20 hover:border-indigo-400/50"
                }`}
              >
                <div className="space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-indigo-500/20 text-indigo-300 border border-indigo-400/20">
                      {item.subject}
                    </span>
                    <span className="text-xs font-semibold text-amber-300 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {item.durationMinutes}m
                    </span>
                  </div>

                  <h5 className={`text-xs sm:text-sm font-bold leading-snug ${isDone ? "line-through text-slate-400" : "text-white"}`}>
                    {item.task}
                  </h5>

                  <p className="text-[11px] text-slate-400 leading-normal">
                    {item.reason}
                  </p>
                </div>

                <div className="pt-2 border-t border-white/5 flex items-center justify-between">
                  <button
                    onClick={() => toggleTask(idx)}
                    className={`flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-lg transition-colors ${
                      isDone
                        ? "text-emerald-400 hover:text-emerald-300"
                        : "text-indigo-300 hover:text-indigo-200 bg-indigo-500/10 hover:bg-indigo-500/20"
                    }`}
                  >
                    <CheckCircle2 className={`w-3.5 h-3.5 ${isDone ? "fill-emerald-400 text-slate-900" : ""}`} />
                    <span>{isDone ? "Completed" : "Mark Done"}</span>
                  </button>

                  <button
                    onClick={() => {
                      setCurrentView("focus-timer");
                      addToast(`Opening Focus Timer ⏱️`, item.task);
                    }}
                    className="text-[11px] font-bold text-indigo-300 hover:text-white flex items-center gap-1"
                  >
                    <span>Start Timer</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Diagnostic Insights: Strength & Weakness prescription */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
        <div className="rounded-2xl bg-slate-900/80 border border-emerald-500/20 p-4 space-y-1.5">
          <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-400 uppercase tracking-wider">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Identified Strengths & Momentum</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            {insights?.strengthAnalysis ||
              `Great job maintaining consistency! Your active engagement shows strong foundational readiness for ${user?.aim || "your exams"}.`}
          </p>
        </div>

        <div className="rounded-2xl bg-slate-900/80 border border-amber-500/20 p-4 space-y-1.5">
          <div className="flex items-center gap-1.5 text-xs font-bold text-amber-400 uppercase tracking-wider">
            <AlertCircle className="w-3.5 h-3.5" />
            <span>Targeted Weakness Prescription</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            {insights?.weakAreaPrescription ||
              "Spend 25 focused minutes on tricky derivations and formula conversions. Solving 5 step-by-step questions will cement the concept."}
          </p>
        </div>
      </div>

      {/* Quick Interactive Gemini Study & Life Partner Bar */}
      <div className="rounded-2xl bg-indigo-900/30 border border-indigo-500/30 p-4 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-indigo-600 flex items-center justify-center text-white text-xs font-bold">
              ✨
            </div>
            <h4 className="text-xs sm:text-sm font-bold text-white">
              Ask Gemini Partner Anything
            </h4>
          </div>
          <span className="text-[11px] text-indigo-300">
            Academic doubts, daily routine, stress & personal questions
          </span>
        </div>

        <form onSubmit={handleAskPartner} className="flex gap-2">
          <input
            type="text"
            value={quickPrompt}
            onChange={(e) => setQuickPrompt(e.target.value)}
            placeholder={`Ask Gemini Partner (e.g. "How do I beat procrastination today?" or "Derive kinetic energy")...`}
            className="flex-1 px-4 py-2 text-xs sm:text-sm rounded-xl bg-slate-900/90 border border-indigo-500/30 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <button
            type="submit"
            disabled={!quickPrompt.trim() || isAnswering}
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-bold text-xs sm:text-sm flex items-center gap-1.5 transition-all shrink-0"
          >
            <Send className={`w-3.5 h-3.5 ${isAnswering ? "animate-pulse" : ""}`} />
            <span>{isAnswering ? "Thinking..." : "Ask"}</span>
          </button>
        </form>

        {/* Suggestion Chips */}
        <div className="flex items-center gap-1.5 flex-wrap pt-0.5">
          {promptSuggestions.map((prompt, pIdx) => (
            <button
              key={pIdx}
              onClick={() => {
                setQuickPrompt(prompt);
              }}
              className="text-[10px] px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-indigo-200 border border-white/10 transition-colors"
            >
              {prompt}
            </button>
          ))}
        </div>

        {/* Answer Box */}
        {partnerAnswer && (
          <div className="mt-3 p-4 rounded-xl bg-slate-900/90 border border-indigo-400/40 text-xs sm:text-sm text-slate-200 space-y-2 animate-in fade-in">
            <div className="flex items-center justify-between text-indigo-300 text-[11px] font-bold">
              <span className="flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                Gemini Partner Answer
              </span>
              <button
                onClick={() => setPartnerAnswer(null)}
                className="text-slate-400 hover:text-white"
              >
                ✕ Close
              </button>
            </div>
            <div className="whitespace-pre-wrap leading-relaxed">
              {partnerAnswer}
            </div>
            <div className="pt-2 border-t border-slate-800 flex justify-end">
              <button
                onClick={() => setCurrentView("ai-tutor")}
                className="text-xs font-bold text-indigo-400 hover:underline flex items-center gap-1"
              >
                <span>Continue conversation in AI Tutor</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
