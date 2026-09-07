import React, { useState } from "react";
import {
  Sparkles,
  GraduationCap,
  Target,
  School,
  MapPin,
  Palette,
  CheckCircle2,
  ArrowRight,
  X,
  User as UserIcon,
  Wand2,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useStudy } from "../../context/StudyContext";
import { AccentColor, EducationBoard } from "../../types";

const GRADE_OPTIONS = [
  "Class 9 - Secondary (New NCERT Curriculum)",
  "Class 10 - Secondary Board",
  "Class 11 - Science (PCM / PCB)",
  "Class 11 - Commerce",
  "Class 11 - Humanities / Arts",
  "Class 12 - Science (PCM + CS)",
  "Class 12 - Science (PCB + Biotech)",
  "Class 12 - Commerce",
  "Class 12 - Humanities / Arts",
  "Undergraduate / Engineering",
  "Medical (MBBS / NEET Prep)",
  "Competitive Exam Aspirant (JEE/NEET/UPSC)",
];

const BOARD_OPTIONS: EducationBoard[] = [
  "CBSE",
  "ICSE",
  "State Board",
  "Cambridge IGCSE",
  "IB",
];

const PRESET_PROFILES = [
  {
    id: "class9_ncert",
    title: "Class 9 New NCERT Topper",
    tag: "Rationalized NCERT 2025-26",
    grade: "Class 9 - Secondary (New NCERT Curriculum)",
    board: "CBSE" as EducationBoard,
    aim: "Master Class 9 Science & Math with New Rationalized NCERT",
    stream: "Science, Math & Social Science",
    targetExam: "CBSE Class 9 Annual Exam 2026",
    targetYear: "2026",
    dreamCollege: "Top STEM High School Stream",
    targetScore: "96.5% Aggregate",
    dailyMinutes: 120,
    accent: "indigo" as AccentColor,
  },
  {
    id: "jee_pcm",
    title: "IIT-JEE PCM Top Ranker",
    tag: "High Yield JEE 2026",
    grade: "Class 12 - Science (PCM + CS)",
    board: "CBSE" as EducationBoard,
    aim: "IIT JEE Advanced (Target AIR < 500) & 98% Board Marks",
    stream: "Science (Physics, Chemistry, Math)",
    targetExam: "JEE Main & Advanced 2026 + CBSE Board",
    targetYear: "2026",
    dreamCollege: "IIT Bombay (Computer Science & Engineering)",
    targetScore: "98.5% Board / 285+ in JEE Main",
    dailyMinutes: 180,
    accent: "pink" as AccentColor,
  },
  {
    id: "neet_pcb",
    title: "NEET Medical Prodigy",
    tag: "Target 700+ NEET",
    grade: "Class 12 - Science (PCB + Biotech)",
    aim: "NEET UG AIR < 100 & 99% Biology Marks",
    stream: "Medical Science (Physics, Chemistry, Biology)",
    targetExam: "NEET UG 2026 + Class 12 Boards",
    targetYear: "2026",
    dreamCollege: "AIIMS New Delhi (MBBS)",
    targetScore: "710/720 in NEET / 98% Boards",
    dailyMinutes: 180,
    accent: "rose" as AccentColor,
  },
  {
    id: "cbse_10th",
    title: "Class 10 Board Topper",
    tag: "CBSE 10th 98%+",
    grade: "Class 10 - Secondary Board",
    aim: "Score 98%+ in Class 10 Board Examination",
    stream: "All Subjects (Math, Science, Social Science, English)",
    targetExam: "CBSE Class 10 Board 2026",
    targetYear: "2026",
    dreamCollege: "Premier Senior Secondary STEM School",
    targetScore: "98.8% Aggregate",
    dailyMinutes: 120,
    accent: "purple" as AccentColor,
  },
  {
    id: "commerce_cuet",
    title: "Commerce & CUET Top Scorer",
    tag: "SRCC & CA Foundation",
    grade: "Class 12 - Commerce",
    aim: "Clear CA Foundation & Get into SRCC via CUET (100%ile)",
    stream: "Commerce (Accountancy, Economics, Business Studies, Math)",
    targetExam: "CUET UG 2026 + CBSE Commerce",
    targetYear: "2026",
    dreamCollege: "SRCC Delhi University (B.Com Hons)",
    targetScore: "100 Percentile in CUET / 99% Boards",
    dailyMinutes: 120,
    accent: "indigo" as AccentColor,
  },
];

const AVATAR_PRESETS = [
  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=150&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?w=150&auto=format&fit=crop&q=80",
];

const ACCENT_PRESETS: { id: AccentColor; name: string; bgClass: string }[] = [
  { id: "pink", name: "Sakura Pink (Default)", bgClass: "bg-pink-500" },
  { id: "rose", name: "Rose Coral", bgClass: "bg-rose-500" },
  { id: "purple", name: "Royal Purple", bgClass: "bg-purple-600" },
  { id: "indigo", name: "Deep Indigo", bgClass: "bg-indigo-600" },
  { id: "blue", name: "Ocean Blue", bgClass: "bg-blue-600" },
  { id: "cyan", name: "Cyber Cyan", bgClass: "bg-cyan-500" },
  { id: "emerald", name: "Forest Emerald", bgClass: "bg-emerald-600" },
  { id: "amber", name: "Golden Amber", bgClass: "bg-amber-500" },
];

const AIM_SUGGESTIONS = [
  "IIT JEE Advanced (AIR < 500) & Top Board Scores",
  "NEET UG (Score 700+ / Top Medical College)",
  "CBSE Class 10/12 Board Exams (98%+ Target)",
  "CUET UG Top Percentile for DU / BHU",
  "Olympiad Gold Medal (Physics / Math / Chemistry)",
  "SAT 1550+ & Ivy League / MIT Admissions",
];

export const CreateProfileModal: React.FC = () => {
  const { user, isCreateProfileModalOpen, setIsCreateProfileModalOpen, createProfile } = useAuth();
  const { addToast, setAccentColor, accentColor, setCurrentView, setSelectedBoard } = useStudy();

  const [step, setStep] = useState<"preset" | "form">("preset");
  const [selectedPresetId, setSelectedPresetId] = useState<string>("class9_ncert");
  const [name, setName] = useState(user?.name || "Alex Morgan");
  const [email, setEmail] = useState(user?.email || "alex.morgan@student.edu");
  const [avatar, setAvatar] = useState(user?.avatar || AVATAR_PRESETS[0]);
  const [grade, setGrade] = useState(user?.grade || "Class 9 - Secondary (New NCERT Curriculum)");
  const [board, setBoard] = useState<EducationBoard>(user?.board || "CBSE");
  const [aim, setAim] = useState(user?.aim || "Master Class 9 Science & Math with Rationalized NCERT");
  const [stream, setStream] = useState(user?.stream || "Science & Mathematics");
  const [targetExam, setTargetExam] = useState(user?.targetExam || "CBSE Class 9 Annual Exam 2026");
  const [targetYear, setTargetYear] = useState(user?.targetYear || "2026");
  const [dreamCollege, setDreamCollege] = useState(user?.dreamCollege || "Premier STEM High School");
  const [targetScore, setTargetScore] = useState(user?.targetScore || "96.5% Aggregate");
  const [school, setSchool] = useState(user?.school || "St. Jude STEM Academy");
  const [city, setCity] = useState(user?.city || "New Delhi / San Francisco");
  const [targetDailyMinutes, setTargetDailyMinutes] = useState(user?.targetDailyMinutes || 120);
  const [selectedAccent, setSelectedAccent] = useState<AccentColor>(accentColor || "indigo");

  if (!isCreateProfileModalOpen) return null;

  const handleSelectPreset = (preset: (typeof PRESET_PROFILES)[0]) => {
    setSelectedPresetId(preset.id);
    setGrade(preset.grade);
    setBoard(preset.board || "CBSE");
    setStream(preset.stream);
    setAim(preset.aim);
    setTargetExam(preset.targetExam);
    setTargetYear(preset.targetYear);
    setDreamCollege(preset.dreamCollege);
    setTargetScore(preset.targetScore);
    setTargetDailyMinutes(preset.dailyMinutes);
    setSelectedAccent(preset.accent);
    setAccentColor(preset.accent);
  };

  const handleApplyPresetAndContinue = () => {
    const matchedPreset = PRESET_PROFILES.find((p) => p.id === selectedPresetId) || PRESET_PROFILES[0];
    const presetBoard = matchedPreset.board || "CBSE";
    setSelectedBoard(presetBoard);
    createProfile({
      name: name.trim() || "Student Scholar",
      email: email.trim() || "student@academy.edu",
      avatar,
      grade: matchedPreset.grade,
      board: presetBoard,
      aim: matchedPreset.aim,
      stream: matchedPreset.stream,
      targetExam: matchedPreset.targetExam,
      targetYear: matchedPreset.targetYear,
      dreamCollege: matchedPreset.dreamCollege,
      targetScore: matchedPreset.targetScore,
      school,
      city,
      targetDailyMinutes: matchedPreset.dailyMinutes,
      bio: `Dedicated student preparing for ${matchedPreset.targetExam} with target score ${matchedPreset.targetScore}.`,
    });

    setAccentColor(matchedPreset.accent);
    addToast(`🎉 Profile created for ${name || "Scholar"}! Target: ${matchedPreset.targetExam}`);
    setCurrentView("dashboard");
  };

  const handleCreateProfileSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    setSelectedBoard(board);
    createProfile({
      name: name.trim() || "Student Scholar",
      email: email.trim() || "student@academy.edu",
      avatar,
      grade,
      board,
      aim,
      stream,
      targetExam,
      targetYear,
      dreamCollege,
      targetScore,
      school,
      city,
      targetDailyMinutes,
      bio: `Dedicated student preparing for ${targetExam} with target score ${targetScore}.`,
    });

    setAccentColor(selectedAccent);
    addToast(`🎉 Profile created for ${name}! Welcome to your personalized workspace!`);
    setCurrentView("dashboard");
  };

  const handleSkipOrQuickStart = () => {
    createProfile({
      name: name || "Scholar",
      grade,
      aim,
      stream,
      targetExam,
      targetYear,
      dreamCollege,
      targetScore,
    });
    addToast("Welcome! You can update your profile anytime from the Student Profile menu.");
    setIsCreateProfileModalOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 overflow-hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-950/75 backdrop-blur-md transition-opacity animate-in fade-in"
        onClick={handleSkipOrQuickStart}
      />

      {/* Main Modal Dialog */}
      <div className="relative w-full max-w-3xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 z-10 transition-all animate-in zoom-in-95 h-[90vh] max-h-[90vh] flex flex-col overflow-hidden">
        {/* Header Ribbon */}
        <div className="p-4 sm:p-6 border-b border-slate-100 dark:border-slate-800 flex items-start justify-between shrink-0 bg-slate-50/70 dark:bg-slate-900/70">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-pink-100 dark:bg-pink-950/60 text-pink-700 dark:text-pink-300 text-xs font-extrabold border border-pink-200 dark:border-pink-900/50">
              <Sparkles className="w-3.5 h-3.5 animate-pulse text-pink-500" />
              <span>Student Profile Setup • Instant Customization</span>
            </div>
            <h2 className="text-lg sm:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
              <span>Personalize Your Study App</span>
              <GraduationCap className="w-5 h-5 sm:w-6 sm:h-6 text-pink-500" />
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              Configure your Class, Aim, and Dream College so AI Tutors and Syllabuses adapt to you.
            </p>
          </div>

          <button
            onClick={handleSkipOrQuickStart}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title="Close / Skip"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher: Fast Preset vs Custom Form */}
        <div className="px-4 sm:px-6 pt-3 pb-2 flex items-center gap-2 shrink-0 bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800">
          <button
            type="button"
            onClick={() => setStep("preset")}
            className={`flex-1 py-2 px-3 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all ${
              step === "preset"
                ? "bg-pink-600 text-white shadow-md shadow-pink-600/30"
                : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
            }`}
          >
            <Wand2 className="w-4 h-4" />
            <span>1-Click Popular Tracks</span>
          </button>
          <button
            type="button"
            onClick={() => setStep("form")}
            className={`flex-1 py-2 px-3 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all ${
              step === "form"
                ? "bg-pink-600 text-white shadow-md shadow-pink-600/30"
                : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
            }`}
          >
            <UserIcon className="w-4 h-4" />
            <span>Customize Every Detail</span>
          </button>
        </div>

        {/* Scrollable Modal Body */}
        <div className="flex-1 overflow-y-auto min-h-0 p-4 sm:p-6 space-y-6">
          {step === "preset" ? (
            <div className="space-y-4">
              <div className="p-3 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/40 text-xs text-indigo-900 dark:text-indigo-200 flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-indigo-500 shrink-0" />
                  <span>Click any profile track to select, then click &quot;Continue with Selected Track&quot; below.</span>
                </div>
                <span className="font-bold text-pink-600 dark:text-pink-400 shrink-0 hidden sm:inline">
                  Step 1 of 2
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {PRESET_PROFILES.map((p) => {
                  const isSelected = selectedPresetId === p.id;
                  return (
                    <div
                      key={p.id}
                      onClick={() => handleSelectPreset(p)}
                      className={`group p-4 rounded-2xl border transition-all text-left flex flex-col justify-between gap-3 relative cursor-pointer ${
                        isSelected
                          ? "bg-pink-50/60 dark:bg-pink-950/30 border-pink-500 shadow-md ring-2 ring-pink-500/20"
                          : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-pink-300 dark:hover:border-pink-900"
                      }`}
                    >
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between">
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold transition-colors ${
                              isSelected
                                ? "bg-pink-600 text-white"
                                : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 group-hover:bg-pink-100 group-hover:text-pink-700"
                            }`}
                          >
                            {p.tag}
                          </span>
                          {isSelected ? (
                            <span className="flex items-center gap-1 text-xs font-black text-pink-600 dark:text-pink-400">
                              <CheckCircle2 className="w-4 h-4 fill-pink-600 text-white" /> Selected
                            </span>
                          ) : (
                            <span className="text-[11px] font-semibold text-slate-400 group-hover:text-pink-500">
                              Select
                            </span>
                          )}
                        </div>
                        <h4 className="font-extrabold text-sm sm:text-base text-slate-900 dark:text-white group-hover:text-pink-600 dark:group-hover:text-pink-400">
                          {p.title}
                        </h4>
                        <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2">
                          {p.aim}
                        </p>
                      </div>

                      <div className="pt-2 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-600 dark:text-slate-400 flex items-center justify-between">
                        <span className="font-medium truncate max-w-[170px]">🎯 {p.dreamCollege.split("(")[0]}</span>
                        <span className="font-bold text-pink-600 dark:text-pink-400">
                          {isSelected ? "Active Choice ✓" : "Click to Choose"}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Section 1: Basic Identity & Avatar */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                  <UserIcon className="w-4 h-4 text-pink-500" />
                  <span>1. Student Identity & Avatar</span>
                </h3>

                <div className="flex flex-col sm:flex-row items-center gap-4">
                  <div className="relative">
                    <img
                      src={avatar}
                      alt={name}
                      referrerPolicy="no-referrer"
                      className="w-16 h-16 rounded-2xl object-cover ring-4 ring-pink-500/20 shadow-md"
                    />
                  </div>

                  <div className="flex-1 w-full space-y-2">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                          Full Name *
                        </label>
                        <input
                          type="text"
                          required
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder="e.g. Alex Morgan"
                          className="w-full px-3.5 py-2 text-xs sm:text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-pink-500 focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                          Student Email
                        </label>
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="student@academy.edu"
                          className="w-full px-3.5 py-2 text-xs sm:text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-pink-500 focus:outline-none"
                        />
                      </div>
                    </div>

                    {/* Avatar Preset Picker */}
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-1">
                        Choose Avatar Icon:
                      </label>
                      <div className="flex items-center gap-2 overflow-x-auto pb-1">
                        {AVATAR_PRESETS.map((av, idx) => (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => setAvatar(av)}
                            className={`relative rounded-xl overflow-hidden shrink-0 transition-transform ${
                              avatar === av
                                ? "ring-2 ring-pink-500 ring-offset-2 scale-105"
                                : "opacity-70 hover:opacity-100"
                            }`}
                          >
                            <img
                              src={av}
                              alt="avatar preset"
                              referrerPolicy="no-referrer"
                              className="w-9 h-9 object-cover"
                            />
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Section 2: Academic Grade & Stream */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                  <GraduationCap className="w-4 h-4 text-pink-500" />
                  <span>2. Current Class / Grade & Stream</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Current Grade / Level *
                    </label>
                    <select
                      value={grade}
                      onChange={(e) => setGrade(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-pink-500 focus:outline-none"
                    >
                      {GRADE_OPTIONS.map((g) => (
                        <option key={g} value={g}>
                          {g}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Education Board *
                    </label>
                    <select
                      value={board}
                      onChange={(e) => setBoard(e.target.value as EducationBoard)}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-pink-500 focus:outline-none font-semibold text-pink-600 dark:text-pink-400"
                    >
                      {BOARD_OPTIONS.map((b) => (
                        <option key={b} value={b}>
                          {b} Board
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Academic Stream / Subjects
                    </label>
                    <input
                      type="text"
                      value={stream}
                      onChange={(e) => setStream(e.target.value)}
                      placeholder="e.g. Science, Math, Social Science"
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-pink-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      School / Institution Name
                    </label>
                    <div className="relative">
                      <School className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        value={school}
                        onChange={(e) => setSchool(e.target.value)}
                        placeholder="e.g. DPS International / STEM High"
                        className="w-full pl-9 pr-3.5 py-2 text-xs sm:text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-pink-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      City / Region
                    </label>
                    <div className="relative">
                      <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        placeholder="e.g. New Delhi, Mumbai, SF"
                        className="w-full pl-9 pr-3.5 py-2 text-xs sm:text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-pink-500 focus:outline-none"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Section 3: Primary Aim & Dream Goal */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                  <Target className="w-4 h-4 text-pink-500" />
                  <span>3. Primary Aim & Dream University</span>
                </h3>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Primary Academic / Career Aim *
                  </label>
                  <input
                    type="text"
                    required
                    value={aim}
                    onChange={(e) => setAim(e.target.value)}
                    placeholder="e.g. IIT JEE Advanced AIR < 500 / NEET 700+"
                    className="w-full px-3.5 py-2 text-xs sm:text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-pink-500 focus:outline-none"
                  />

                  {/* Suggestions pills */}
                  <div className="flex items-center gap-1.5 flex-wrap pt-2">
                    <span className="text-[10px] font-bold text-slate-400">Quick Aims:</span>
                    {AIM_SUGGESTIONS.slice(0, 4).map((sug, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setAim(sug)}
                        className="px-2 py-0.5 rounded-lg text-[10px] font-semibold bg-slate-200/70 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-pink-100 hover:text-pink-700 transition-colors truncate max-w-[200px]"
                      >
                        {sug.split("(")[0]}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Dream University / College
                    </label>
                    <input
                      type="text"
                      value={dreamCollege}
                      onChange={(e) => setDreamCollege(e.target.value)}
                      placeholder="e.g. IIT Bombay, AIIMS Delhi, Stanford"
                      className="w-full px-3.5 py-2 text-xs sm:text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-pink-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Target Exam & Year
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={targetExam}
                        onChange={(e) => setTargetExam(e.target.value)}
                        placeholder="CBSE 12th + JEE 2026"
                        className="flex-1 px-3.5 py-2 text-xs sm:text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-pink-500 focus:outline-none"
                      />
                      <input
                        type="text"
                        value={targetYear}
                        onChange={(e) => setTargetYear(e.target.value)}
                        placeholder="2026"
                        className="w-20 px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-pink-500 focus:outline-none"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Section 4: Color Theme & Daily Study Target */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                  <Palette className="w-4 h-4 text-pink-500" />
                  <span>4. Choose Your Favorite Theme & Daily Goal</span>
                </h3>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    Accent Color Theme (Includes Light Pink / Sakura)
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {ACCENT_PRESETS.map((acc) => (
                      <button
                        key={acc.id}
                        type="button"
                        onClick={() => {
                          setSelectedAccent(acc.id);
                          setAccentColor(acc.id);
                        }}
                        className={`p-2 rounded-xl border text-xs font-bold flex items-center gap-2 transition-all ${
                          selectedAccent === acc.id
                            ? "bg-white dark:bg-slate-900 border-pink-500 shadow-md ring-2 ring-pink-500/20 text-slate-900 dark:text-white"
                            : "bg-white/60 dark:bg-slate-900/60 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-slate-300"
                        }`}
                      >
                        <span className={`w-3.5 h-3.5 rounded-full ${acc.bgClass}`} />
                        <span className="truncate">{acc.name}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="pt-2">
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Daily Study Target (Minutes)
                  </label>
                  <div className="flex items-center gap-2">
                    {[60, 90, 120, 180, 240].map((mins) => (
                      <button
                        key={mins}
                        type="button"
                        onClick={() => setTargetDailyMinutes(mins)}
                        className={`flex-1 py-1.5 rounded-xl text-xs font-bold transition-all ${
                          targetDailyMinutes === mins
                            ? "bg-pink-600 text-white shadow-sm"
                            : "bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-100"
                        }`}
                      >
                        {mins}m
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ALWAYS VISIBLE STICKY FOOTER ACTION BAR */}
        <div className="p-4 sm:p-5 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/95 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0 shadow-lg z-20">
          <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-start">
            {step === "form" ? (
              <button
                type="button"
                onClick={() => setStep("preset")}
                className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs transition-colors flex items-center gap-1.5"
              >
                <span>← Back to Presets</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setStep("form")}
                className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs transition-colors flex items-center gap-1.5"
              >
                <UserIcon className="w-3.5 h-3.5" />
                <span>Customize Details</span>
              </button>
            )}

            <button
              type="button"
              onClick={handleSkipOrQuickStart}
              className="px-3.5 py-2.5 rounded-xl text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 font-semibold text-xs transition-colors"
            >
              Skip / Default
            </button>
          </div>

          <div className="w-full sm:w-auto">
            {step === "preset" ? (
              <button
                type="button"
                onClick={handleApplyPresetAndContinue}
                className="w-full sm:w-auto py-3 px-6 rounded-2xl bg-pink-600 hover:bg-pink-700 text-white font-extrabold text-xs sm:text-sm shadow-xl shadow-pink-600/30 transition-all flex items-center justify-center gap-2 active:scale-98"
              >
                <Sparkles className="w-4 h-4 text-pink-200 animate-pulse" />
                <span>Continue with Selected Track</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="button"
                onClick={() => handleCreateProfileSubmit()}
                className="w-full sm:w-auto py-3 px-6 rounded-2xl bg-pink-600 hover:bg-pink-700 text-white font-extrabold text-xs sm:text-sm shadow-xl shadow-pink-600/30 transition-all flex items-center justify-center gap-2 active:scale-98"
              >
                <Sparkles className="w-4 h-4 text-pink-200 animate-pulse" />
                <span>Save Profile & Launch Study Workspace</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
