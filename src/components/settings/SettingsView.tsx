import React, { useState } from "react";
import {
  Settings,
  User,
  Sparkles,
  Palette,
  Globe,
  Database,
  Download,
  Upload,
  RotateCcw,
  Shield,
  Check,
  GraduationCap,
  Target,
  School,
  Sun,
  Moon,
  Volume2,
  Clock,
  Save,
  CheckCircle2,
  Heart,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useStudy } from "../../context/StudyContext";
import { AccentColor } from "../../types";
import { ConfirmDialog } from "../common/ConfirmDialog";

const ACCENT_OPTIONS: {
  id: AccentColor;
  label: string;
  sublabel: string;
  previewBg: string;
  previewBorder: string;
  badgeBg: string;
  badgeText: string;
}[] = [
  {
    id: "pink",
    label: "Light Pink (Sakura)",
    sublabel: "Gentle aesthetic pink theme requested for a calm study vibe",
    previewBg: "bg-pink-500",
    previewBorder: "border-pink-500",
    badgeBg: "bg-pink-100 dark:bg-pink-950",
    badgeText: "text-pink-600 dark:text-pink-300",
  },
  {
    id: "indigo",
    label: "Royal Indigo",
    sublabel: "Focused, deep intellectual modern style",
    previewBg: "bg-indigo-600",
    previewBorder: "border-indigo-600",
    badgeBg: "bg-indigo-100 dark:bg-indigo-950",
    badgeText: "text-indigo-600 dark:text-indigo-300",
  },
  {
    id: "blue",
    label: "Ocean Sky Blue",
    sublabel: "Clean, energetic and refreshing visual palette",
    previewBg: "bg-sky-500",
    previewBorder: "border-sky-500",
    badgeBg: "bg-sky-100 dark:bg-sky-950",
    badgeText: "text-sky-600 dark:text-sky-300",
  },
  {
    id: "emerald",
    label: "Emerald Mint",
    sublabel: "Calming botanical green for marathon focus sessions",
    previewBg: "bg-emerald-600",
    previewBorder: "border-emerald-600",
    badgeBg: "bg-emerald-100 dark:bg-emerald-950",
    badgeText: "text-emerald-600 dark:text-emerald-300",
  },
  {
    id: "purple",
    label: "Lavender Purple",
    sublabel: "Creative, modern aesthetic with soft violet tones",
    previewBg: "bg-purple-600",
    previewBorder: "border-purple-600",
    badgeBg: "bg-purple-100 dark:bg-purple-950",
    badgeText: "text-purple-600 dark:text-purple-300",
  },
  {
    id: "amber",
    label: "Warm Sunset Amber",
    sublabel: "Warm golden hue with high contrast legibility",
    previewBg: "bg-amber-500",
    previewBorder: "border-amber-500",
    badgeBg: "bg-amber-100 dark:bg-amber-950",
    badgeText: "text-amber-600 dark:text-amber-300",
  },
  {
    id: "rose",
    label: "Crimson Rose",
    sublabel: "Vibrant and intense high-energy theme",
    previewBg: "bg-rose-600",
    previewBorder: "border-rose-600",
    badgeBg: "bg-rose-100 dark:bg-rose-950",
    badgeText: "text-rose-600 dark:text-rose-300",
  },
];

const LANGUAGE_OPTIONS = [
  { code: "en", name: "English (US / UK)", native: "English" },
  { code: "hi", name: "Hindi", native: "हिन्दी" },
  { code: "es", name: "Spanish", native: "Español" },
  { code: "fr", name: "French", native: "Français" },
  { code: "de", name: "German", native: "Deutsch" },
  { code: "bn", name: "Bengali", native: "বাংলা" },
  { code: "te", name: "Telugu", native: "తెలుగు" },
  { code: "ta", name: "Tamil", native: "தமிழ்" },
  { code: "mr", name: "Marathi", native: "मराठी" },
  { code: "gu", name: "Gujarati", native: "ગુજરાતી" },
  { code: "ur", name: "Urdu", native: "اردو" },
  { code: "ja", name: "Japanese", native: "日本語" },
  { code: "ar", name: "Arabic", native: "العربية" },
];

export const SettingsView: React.FC = () => {
  const { user, updateProfile, isAdmin, setIsCreateProfileModalOpen, resetProfileOnboarding } = useAuth();
  const {
    theme,
    setTheme,
    isDark,
    accentColor,
    setAccentColor,
    appLanguage,
    setAppLanguage,
    subjects,
    notes,
    flashcards,
    quizzes,
    addToast,
    setCurrentView,
  } = useStudy();

  // Profile quick-edit state
  const [name, setName] = useState(user?.name || "Alex Morgan");
  const [grade, setGrade] = useState(user?.grade || "Class 12 - Science (PCM + CS)");
  const [aim, setAim] = useState(
    user?.aim || "IIT JEE Advanced (Target AIR < 500) & 98% Board Marks"
  );
  const [school, setSchool] = useState(user?.school || "St. Jude STEM Academy");
  const [dreamCollege, setDreamCollege] = useState(user?.dreamCollege || "IIT Bombay");
  const [targetScore, setTargetScore] = useState(user?.targetScore || "98.5% Board Marks");
  const [tutorTone, setTutorTone] = useState("Socratic & Step-by-Step with Formulas");
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [isResetConfirmOpen, setIsResetConfirmOpen] = useState(false);

  const handleSaveProfileSettings = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({
      name,
      grade,
      aim,
      school,
      dreamCollege,
      targetScore,
      accentColor,
    });
    addToast("Settings & Profile Saved! ✅", "Your preferences have been updated.");
  };

  const handleSelectAccent = (colorId: AccentColor) => {
    setAccentColor(colorId);
    updateProfile({ accentColor: colorId });
    addToast(`Theme Changed to ${colorId.toUpperCase()}! 🎨`, "Color theme applied across the app.");
  };

  const handleSelectLanguage = (langName: string) => {
    setAppLanguage(langName);
    addToast(`Language set to ${langName} 🌐`, "AI Tutor will prioritize responses in this language.");
  };

  const handleExportData = () => {
    const data = {
      exportDate: new Date().toISOString(),
      user,
      appLanguage,
      accentColor,
      subjects,
      notes,
      flashcards,
      quizzes,
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `ai-study-assistant-backup-${new Date().toISOString().split("T")[0]}.json`;
    a.click();
    addToast("Backup Exported Successfully! 📦", "All study data has been saved to JSON.");
  };

  const handleResetData = () => {
    localStorage.clear();
    window.location.reload();
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto space-y-6 animate-in fade-in duration-300 pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-5">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white flex items-center gap-2.5">
            <Settings className="w-7 h-7 text-indigo-600 dark:text-indigo-400" />
            <span>App Preferences & Settings</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Customize app color themes (including light pink), change language, manage profile, syllabus, and study preferences.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setIsCreateProfileModalOpen(true)}
            className="px-4 py-2 rounded-xl bg-pink-600 hover:bg-pink-700 text-white text-xs font-bold shadow-md shadow-pink-600/30 transition-all flex items-center gap-1.5 active:scale-95"
          >
            <Sparkles className="w-4 h-4 text-pink-200" />
            <span>Create / Switch Profile</span>
          </button>
          <button
            onClick={() => setCurrentView("profile")}
            className="px-4 py-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800 text-xs font-bold hover:bg-indigo-100 transition-all flex items-center gap-1.5"
          >
            <User className="w-4 h-4" />
            <span>Full Profile View</span>
          </button>
        </div>
      </div>

      {/* 1. Theme & Accent Color Customizer (Light Pink & others) */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-7 shadow-sm space-y-5">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-pink-50 dark:bg-pink-950 text-pink-600">
              <Palette className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <span>Color Theme & Visual Style</span>
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-pink-100 dark:bg-pink-950 text-pink-600 dark:text-pink-300 flex items-center gap-1">
                  <Heart className="w-3 h-3 fill-pink-500" /> Light Pink Available
                </span>
              </h2>
              <p className="text-xs text-slate-500">Pick your favorite accent color to personalize buttons, badges, and cards</p>
            </div>
          </div>

          {/* Light/Dark toggle */}
          <div className="flex items-center gap-1 p-1 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
            <button
              onClick={() => setTheme("light")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                theme === "light"
                  ? "bg-white text-slate-900 shadow-sm"
                  : "text-slate-500 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              <Sun className="w-3.5 h-3.5 text-amber-500" />
              <span>Light</span>
            </button>
            <button
              onClick={() => setTheme("dark")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                theme === "dark"
                  ? "bg-slate-900 text-white shadow-sm"
                  : "text-slate-500 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              <Moon className="w-3.5 h-3.5 text-indigo-400" />
              <span>Dark</span>
            </button>
          </div>
        </div>

        {/* Accent Color Palette Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {ACCENT_OPTIONS.map((opt) => {
            const isSelected = accentColor === opt.id;
            return (
              <button
                key={opt.id}
                type="button"
                onClick={() => handleSelectAccent(opt.id)}
                className={`p-4 rounded-2xl border text-left transition-all flex flex-col justify-between space-y-3 relative group ${
                  isSelected
                    ? `bg-slate-50 dark:bg-slate-800/80 ${opt.previewBorder} ring-2 ring-indigo-500/20 shadow-sm`
                    : "bg-white dark:bg-slate-800/40 border-slate-200 dark:border-slate-800 hover:border-slate-300"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className={`w-5 h-5 rounded-full ${opt.previewBg} shadow-sm`} />
                    <span className="text-xs font-bold text-slate-900 dark:text-white">
                      {opt.label}
                    </span>
                  </div>
                  {isSelected && (
                    <CheckCircle2 className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                  )}
                </div>
                <p className="text-[11px] text-slate-500 leading-snug">{opt.sublabel}</p>
                <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${opt.badgeBg} ${opt.badgeText}`}>
                    Active Preview
                  </span>
                  <span className="text-[10px] font-semibold text-slate-400">
                    {isSelected ? "Selected" : "Click to Apply"}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Language & Localization */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-7 shadow-sm space-y-5">
        <div className="flex items-center gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
          <div className="p-2.5 rounded-2xl bg-blue-50 dark:bg-blue-950 text-blue-600">
            <Globe className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              Language & Study Medium
            </h2>
            <p className="text-xs text-slate-500">
              Select the primary language for AI explanations, question generation, and interface guidance
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5">
          {LANGUAGE_OPTIONS.map((lang) => {
            const isSelected = appLanguage === lang.name || appLanguage === lang.native;
            return (
              <button
                key={lang.code}
                onClick={() => handleSelectLanguage(lang.name)}
                className={`p-3 rounded-2xl border text-left transition-all ${
                  isSelected
                    ? "bg-indigo-50 dark:bg-indigo-950/60 border-indigo-500 text-indigo-900 dark:text-indigo-200 font-bold shadow-xs"
                    : "bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700/60 text-slate-700 dark:text-slate-300 hover:bg-slate-100"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold">{lang.native}</span>
                  {isSelected && <Check className="w-3.5 h-3.5 text-indigo-600" />}
                </div>
                <span className="text-[10px] text-slate-400 block mt-0.5">{lang.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Student Profile & Academic Goals */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-7 shadow-sm space-y-5">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                Academic Profile & Goal Tracking
              </h2>
              <p className="text-xs text-slate-500">
                Update your class grade, aim, dream college, and school info
              </p>
            </div>
          </div>

          <button
            onClick={() => setCurrentView("profile")}
            className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
          >
            Edit full avatar & weak topics →
          </button>
        </div>

        <form onSubmit={handleSaveProfileSettings} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                Student Full Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                Class / Grade
              </label>
              <input
                type="text"
                value={grade}
                onChange={(e) => setGrade(e.target.value)}
                placeholder="e.g. Class 12 - Science (PCM)"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>

            <div className="space-y-1.5 sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                Primary Aim / Career Goal
              </label>
              <input
                type="text"
                value={aim}
                onChange={(e) => setAim(e.target.value)}
                placeholder="e.g. IIT JEE Advanced AIR < 500 / Doctor NEET 700+ / 98% Board Topper"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                School / Academy Name
              </label>
              <input
                type="text"
                value={school}
                onChange={(e) => setSchool(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                Dream College / Target Institute
              </label>
              <input
                type="text"
                value={dreamCollege}
                onChange={(e) => setDreamCollege(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md transition-all active:scale-95"
            >
              <Save className="w-4 h-4" />
              <span>Save Profile Information</span>
            </button>
          </div>
        </form>
      </div>

      {/* 4. AI Tutor Preferences */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-7 shadow-sm space-y-4">
        <div className="flex items-center gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
          <div className="p-2.5 rounded-2xl bg-purple-50 dark:bg-purple-950 text-purple-600">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              AI Tutor Intelligence & Style
            </h2>
            <p className="text-xs text-slate-500">Fine-tune the teaching persona and depth of explanations</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
              Teaching Pedagogy Style
            </label>
            <select
              value={tutorTone}
              onChange={(e) => setTutorTone(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            >
              <option value="Socratic & Step-by-Step with Formulas">Socratic & Step-by-Step with Formulas (Recommended)</option>
              <option value="High-Speed Exam Revision (Key Points Only)">High-Speed Exam Revision (Key Points Only)</option>
              <option value="Beginner Friendly Intuitive Analogies">Beginner Friendly Intuitive Analogies</option>
              <option value="Strict JEE / Olympiad Numerical Rigor">Strict JEE / Olympiad Numerical Rigor</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
              Audio & Focus Chimes
            </label>
            <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
              <span className="text-xs font-medium text-slate-700 dark:text-slate-300">
                Play celebration chimes on completed quizzes
              </span>
              <input
                type="checkbox"
                checked={soundEnabled}
                onChange={(e) => setSoundEnabled(e.target.checked)}
                className="w-4 h-4 accent-indigo-600 cursor-pointer"
              />
            </div>
          </div>
        </div>
      </div>

      {/* 5. Data Backup, Export & Reset */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-7 shadow-sm space-y-4">
        <div className="flex items-center gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
          <div className="p-2.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950 text-emerald-600">
            <Database className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              Data Storage & Backup
            </h2>
            <p className="text-xs text-slate-500">
              Your syllabus progress, notes, mistakes, and quiz logs are stored locally and can be downloaded anytime
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 flex-wrap pt-2">
          <button
            onClick={() => resetProfileOnboarding()}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-pink-50 dark:bg-pink-950/60 hover:bg-pink-100 text-pink-700 dark:text-pink-300 text-xs font-bold transition-all border border-pink-200 dark:border-pink-900/50"
          >
            <Sparkles className="w-4 h-4 text-pink-500" />
            <span>Launch First-Time Profile Wizard</span>
          </button>

          <button
            onClick={handleExportData}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold transition-all"
          >
            <Download className="w-4 h-4" />
            <span>Export Complete Backup (JSON)</span>
          </button>

          <button
            onClick={() => setIsResetConfirmOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-rose-50 dark:bg-rose-950/60 hover:bg-rose-100 text-rose-700 dark:text-rose-300 text-xs font-bold transition-all"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Reset Demo & Progress</span>
          </button>
        </div>
      </div>

      {/* 6. Admin Portal */}
      <div className="rounded-3xl bg-slate-900 border border-slate-800 p-6 text-white shadow-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-indigo-600/30 text-indigo-400 flex items-center justify-center shrink-0">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold">Admin Management & Prompt Debugger</h4>
            <p className="text-xs text-slate-400">
              Access platform statistics, system prompt tuning, and user telemetry.
            </p>
          </div>
        </div>

        <button
          onClick={() => setCurrentView("admin")}
          className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shrink-0 transition-all shadow-md active:scale-95"
        >
          {isAdmin ? "Open Admin Panel" : "Admin Login"}
        </button>
      </div>

      {/* Reset Confirmation Dialog */}
      <ConfirmDialog
        isOpen={isResetConfirmOpen}
        onClose={() => setIsResetConfirmOpen(false)}
        onConfirm={handleResetData}
        title="Reset Study Data"
        message="Are you sure you want to reset all your notes, flashcards, and test progress back to default demo state? This cannot be undone."
        confirmText="Reset Everything"
      />
    </div>
  );
};
