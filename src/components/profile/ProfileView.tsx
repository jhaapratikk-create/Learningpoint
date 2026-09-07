import React, { useState } from "react";
import {
  User as UserIcon,
  GraduationCap,
  Target,
  School,
  MapPin,
  Sparkles,
  Trophy,
  Flame,
  Clock,
  BookOpen,
  Award,
  CheckCircle2,
  Save,
  Plus,
  X,
  Share2,
  Calendar,
  Zap,
  Globe,
  Palette,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useStudy } from "../../context/StudyContext";
import { AccentColor, EducationBoard } from "../../types";

const BOARD_OPTIONS: EducationBoard[] = [
  "CBSE",
  "ICSE",
  "State Board",
  "Cambridge IGCSE",
  "IB",
];

const AVATAR_PRESETS = [
  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
];

const GRADE_OPTIONS = [
  "Class 9 (Secondary Foundation)",
  "Class 10 (Board Exam Year)",
  "Class 11 - Science (PCM)",
  "Class 11 - Science (PCB)",
  "Class 11 - Commerce with Math",
  "Class 11 - Arts & Humanities",
  "Class 12 - Science (PCM + CS)",
  "Class 12 - Science (PCB / Pre-Med)",
  "Class 12 - Commerce",
  "Class 12 - Arts & Humanities",
  "Dropper / Competitive Exam Aspirant (JEE / NEET / CUET)",
  "Undergraduate / Engineering / Medical College",
];

const AIM_SUGGESTIONS = [
  "IIT JEE Advanced (Target AIR < 500) & 98% Board Marks",
  "Doctor (NEET UG Score 700+ / AIIMS Admission)",
  "Board Exam Topper (98%+ Aggregate Marks)",
  "UPSC Civil Services / IAS Officer Dream",
  "Top US / Global University (Ivy League / SAT 1550+)",
  "Chartered Accountant (CA Foundation & Inter Rank)",
  "CUET 100 Percentile / Top Central University",
  "Software Engineer & AI Researcher",
  "National Olympiad Gold Medalist (KVPY / INPhO / RMO)",
];

const TARGET_EXAM_OPTIONS = [
  "CBSE Class 12 Board Exam 2026",
  "CBSE Class 10 Board Exam 2026",
  "JEE Main & JEE Advanced 2026",
  "NEET UG 2026 (Medical)",
  "ICSE / ISC Board Exam 2026",
  "State Board Intermediate Exam 2026",
  "CUET (Common University Entrance Test) 2026",
  "SAT / ACT / AP Exams 2026",
];

export const ProfileView: React.FC = () => {
  const { user, updateProfile, setIsCreateProfileModalOpen } = useAuth();
  const { addToast, setCurrentView, accentColor, setAccentColor, selectedBoard, setSelectedBoard } = useStudy();

  const [name, setName] = useState(user?.name || "Alex Morgan");
  const [email, setEmail] = useState(user?.email || "alex.morgan@student.edu");
  const [avatar, setAvatar] = useState(
    user?.avatar || AVATAR_PRESETS[0]
  );
  const [grade, setGrade] = useState(user?.grade || "Class 9 (Secondary Foundation)");
  const [board, setBoard] = useState<EducationBoard>(user?.board || selectedBoard || "CBSE");
  const [aim, setAim] = useState(
    user?.aim || "Master Class 9 Science & Math with Rationalized NCERT"
  );
  const [stream, setStream] = useState(user?.stream || "Science (PCM + Computer Science)");
  const [targetExam, setTargetExam] = useState(user?.targetExam || "JEE Main & Advanced 2026 + CBSE Board");
  const [targetYear, setTargetYear] = useState(user?.targetYear || "2026");
  const [dreamCollege, setDreamCollege] = useState(user?.dreamCollege || "IIT Bombay (Computer Science & Engineering)");
  const [targetScore, setTargetScore] = useState(user?.targetScore || "98.5% Board / 280+ in JEE Main");
  const [school, setSchool] = useState(user?.school || "St. Jude STEM Academy");
  const [city, setCity] = useState(user?.city || "San Francisco / New Delhi");
  const [bio, setBio] = useState(
    user?.bio ||
      "Aspiring computer scientist and AI researcher. Dedicated to solving 50+ numericals daily and mastering calculus & organic mechanisms."
  );
  const [targetDailyMinutes, setTargetDailyMinutes] = useState(user?.targetDailyMinutes || 120);

  // Weak & Strong Topics tags
  const [weakTopics, setWeakTopics] = useState<string[]>(
    user?.weakTopics || ["Rotational Dynamics", "Electrochemistry Nernst Equation", "Integration by Parts"]
  );
  const [newWeakTopic, setNewWeakTopic] = useState("");

  const [strongTopics, setStrongTopics] = useState<string[]>(
    user?.strongTopics || ["Calculus Derivatives", "Kinematics & Optics", "Organic Hydrocarbons"]
  );
  const [newStrongTopic, setNewStrongTopic] = useState("");

  const handleAddWeakTopic = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newWeakTopic.trim()) return;
    if (!weakTopics.includes(newWeakTopic.trim())) {
      setWeakTopics([...weakTopics, newWeakTopic.trim()]);
    }
    setNewWeakTopic("");
  };

  const handleRemoveWeakTopic = (topic: string) => {
    setWeakTopics(weakTopics.filter((t) => t !== topic));
  };

  const handleAddStrongTopic = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStrongTopic.trim()) return;
    if (!strongTopics.includes(newStrongTopic.trim())) {
      setStrongTopics([...strongTopics, newStrongTopic.trim()]);
    }
    setNewStrongTopic("");
  };

  const handleRemoveStrongTopic = (topic: string) => {
    setStrongTopics(strongTopics.filter((t) => t !== topic));
  };

  const handleSaveProfile = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setSelectedBoard(board);
    updateProfile({
      name,
      email,
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
      bio,
      targetDailyMinutes,
      weakTopics,
      strongTopics,
      accentColor,
    });
    addToast("Profile Updated Successfully! 🎓", `Your class, ${board} board, and academic aims have been saved.`);
  };

  const copyProfileCard = () => {
    const text = `🎓 Student Profile: ${name}\n📚 Class: ${grade}\n🎯 Aim: ${aim}\n🏫 School: ${school} (${city})\n🏛️ Dream Institute: ${dreamCollege}\n🎯 Target: ${targetScore} (${targetExam})`;
    navigator.clipboard?.writeText(text);
    addToast("Profile Summary Copied! 📋", "Share your academic goal with friends or mentors.");
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto space-y-6 animate-in fade-in duration-300">
      {/* Top Banner & Header */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-900 via-indigo-800 to-purple-900 text-white p-6 sm:p-8 shadow-xl">
        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-72 h-72 bg-pink-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-4 sm:gap-6">
            <div className="relative group">
              <img
                src={avatar}
                alt={name}
                className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover ring-4 ring-white/30 shadow-lg"
              />
              <div className="absolute -bottom-2 -right-2 p-1.5 rounded-xl bg-amber-500 text-slate-950 font-black text-[10px] flex items-center gap-1 shadow-md">
                <Flame className="w-3.5 h-3.5 fill-slate-950" />
                {user?.streak || 7}d
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2.5 flex-wrap">
                <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">{name}</h1>
                <span className="px-2.5 py-0.5 rounded-full bg-white/20 backdrop-blur-md text-xs font-semibold text-indigo-100">
                  Level {user?.level || 5} Student
                </span>
              </div>
              <p className="text-indigo-200 text-sm font-medium mt-1 flex items-center gap-2 flex-wrap">
                <GraduationCap className="w-4 h-4 text-indigo-300 shrink-0" />
                <span>{grade}</span>
                <span>•</span>
                <School className="w-4 h-4 text-indigo-300 shrink-0" />
                <span>{school}</span>
              </p>
              <div className="mt-2.5 flex items-center gap-2 text-xs text-amber-200 font-semibold bg-white/10 w-fit px-3 py-1 rounded-xl">
                <Target className="w-3.5 h-3.5 text-amber-300" />
                <span>Aim: {aim}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto flex-wrap">
            <button
              onClick={() => setIsCreateProfileModalOpen(true)}
              className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-pink-600 hover:bg-pink-700 text-white text-xs font-bold shadow-lg shadow-pink-600/30 transition-all active:scale-95 border border-pink-400/30"
            >
              <Sparkles className="w-4 h-4 text-pink-200" />
              <span>Create / Switch Profile</span>
            </button>
            <button
              onClick={copyProfileCard}
              className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold backdrop-blur-md transition-all border border-white/10"
            >
              <Share2 className="w-4 h-4" />
              <span>Share Profile</span>
            </button>
            <button
              onClick={() => handleSaveProfile()}
              className="flex-1 md:flex-none flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-white text-indigo-900 hover:bg-indigo-50 text-xs font-bold shadow-lg transition-all active:scale-95"
            >
              <Save className="w-4 h-4 text-indigo-600" />
              <span>Save Changes</span>
            </button>
          </div>
        </div>
      </div>

      {/* Quick Action Navigation Buttons */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <button
          onClick={() => setCurrentView("syllabus")}
          className="flex items-center gap-3 p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-indigo-400 dark:hover:border-indigo-600 shadow-xs transition-all text-left group"
        >
          <div className="p-2.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 group-hover:scale-110 transition-transform">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-900 dark:text-white">Class Syllabus</p>
            <p className="text-[11px] text-slate-500">Chapters & Weightage</p>
          </div>
        </button>

        <button
          onClick={() => setCurrentView("tests")}
          className="flex items-center gap-3 p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-pink-400 dark:hover:border-pink-600 shadow-xs transition-all text-left group"
        >
          <div className="p-2.5 rounded-xl bg-pink-50 dark:bg-pink-950/60 text-pink-600 dark:text-pink-400 group-hover:scale-110 transition-transform">
            <Trophy className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-900 dark:text-white">Tests & Mocks</p>
            <p className="text-[11px] text-slate-500">Class & Chapter Tests</p>
          </div>
        </button>

        <button
          onClick={() => setCurrentView("settings")}
          className="flex items-center gap-3 p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-emerald-400 dark:hover:border-emerald-600 shadow-xs transition-all text-left group"
        >
          <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 group-hover:scale-110 transition-transform">
            <Palette className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-900 dark:text-white">App Theme</p>
            <p className="text-[11px] text-slate-500">Light Pink & Accents</p>
          </div>
        </button>

        <button
          onClick={() => setCurrentView("ai-tutor")}
          className="flex items-center gap-3 p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-amber-400 dark:hover:border-amber-600 shadow-xs transition-all text-left group"
        >
          <div className="p-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 group-hover:scale-110 transition-transform">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-900 dark:text-white">Ask AI Tutor</p>
            <p className="text-[11px] text-slate-500">24/7 Study Doubts</p>
          </div>
        </button>
      </div>

      {/* Main Profile Form Sections */}
      <form onSubmit={handleSaveProfile} className="space-y-6">
        {/* Section 1: Academic Identity & Goals */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-5">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
                <GraduationCap className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-bold text-slate-900 dark:text-white">Academic Details & Dream Aim</h2>
                <p className="text-xs text-slate-500">Specify your class, target exam, dream college, and career goal</p>
              </div>
            </div>
            <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400">
              Personalized AI Tuning
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {/* Student Class / Grade */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                Select Your Class / Grade Level <span className="text-rose-500">*</span>
              </label>
              <select
                value={grade}
                onChange={(e) => setGrade(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-sm font-medium text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              >
                {GRADE_OPTIONS.map((g) => (
                  <option key={g} value={g}>
                    {g}
                  </option>
                ))}
              </select>
            </div>

            {/* Education Board */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                Education Board <span className="text-rose-500">*</span>
              </label>
              <select
                value={board}
                onChange={(e) => setBoard(e.target.value as EducationBoard)}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-sm font-semibold text-indigo-600 dark:text-indigo-400 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              >
                {BOARD_OPTIONS.map((b) => (
                  <option key={b} value={b}>
                    {b} Board
                  </option>
                ))}
              </select>
            </div>

            {/* Student Aim / Career Dream */}
            <div className="space-y-1.5 sm:col-span-2">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                  Primary Academic Aim & Dream Goal <span className="text-rose-500">*</span>
                </label>
                <span className="text-[11px] text-slate-400">e.g. Doctor, IIT JEE, Board Topper</span>
              </div>
              <input
                type="text"
                value={aim}
                onChange={(e) => setAim(e.target.value)}
                placeholder="e.g. Doctor (NEET Score 700+) / IIT Bombay CSE / 98% Board Topper"
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-sm font-medium text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />

              {/* Aim Presets Quick Pick */}
              <div className="flex items-center gap-1.5 flex-wrap pt-1">
                <span className="text-[10px] text-slate-400 font-semibold">Quick picks:</span>
                {AIM_SUGGESTIONS.slice(0, 4).map((sugg) => (
                  <button
                    key={sugg}
                    type="button"
                    onClick={() => setAim(sugg)}
                    className="text-[11px] px-2 py-0.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-indigo-50 dark:hover:bg-indigo-950 text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                  >
                    {sugg.split("(")[0]}
                  </button>
                ))}
              </div>
            </div>

            {/* Target Exam */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                Target Examination
              </label>
              <select
                value={targetExam}
                onChange={(e) => setTargetExam(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-sm font-medium text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              >
                {TARGET_EXAM_OPTIONS.map((ex) => (
                  <option key={ex} value={ex}>
                    {ex}
                  </option>
                ))}
              </select>
            </div>

            {/* Stream / Branch */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                Academic Stream / Core Subjects
              </label>
              <input
                type="text"
                value={stream}
                onChange={(e) => setStream(e.target.value)}
                placeholder="e.g. Science PCM, Commerce with Math, Arts"
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-sm font-medium text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>

            {/* Dream College / University */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                Dream College / Target University
              </label>
              <input
                type="text"
                value={dreamCollege}
                onChange={(e) => setDreamCollege(e.target.value)}
                placeholder="e.g. AIIMS Delhi, IIT Bombay, Harvard, SRCC"
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-sm font-medium text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>

            {/* Target Score / Dream Marks */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                Target Score / Percentile
              </label>
              <input
                type="text"
                value={targetScore}
                onChange={(e) => setTargetScore(e.target.value)}
                placeholder="e.g. 98.5% Board / 280+ in JEE / 710 in NEET"
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-sm font-medium text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Section 2: Personal Info & Avatar */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-5">
          <div className="flex items-center gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
            <div className="p-2 rounded-xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400">
              <UserIcon className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">Personal Information & Avatar</h2>
              <p className="text-xs text-slate-500">Update your name, avatar, school institution, and bio</p>
            </div>
          </div>

          {/* Avatar Presets */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
              Choose Student Avatar
            </label>
            <div className="flex items-center gap-3 flex-wrap">
              {AVATAR_PRESETS.map((preset, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setAvatar(preset)}
                  className={`relative rounded-2xl overflow-hidden p-1 transition-all ${
                    avatar === preset
                      ? "ring-3 ring-indigo-600 dark:ring-indigo-400 scale-105"
                      : "opacity-75 hover:opacity-100"
                  }`}
                >
                  <img src={preset} alt={`Avatar ${idx + 1}`} className="w-12 h-12 rounded-xl object-cover" />
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                Full Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-sm font-medium text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-sm font-medium text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                School / College / Academy Name
              </label>
              <input
                type="text"
                value={school}
                onChange={(e) => setSchool(e.target.value)}
                placeholder="e.g. Delhi Public School / St. Xavier's / STEM Academy"
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-sm font-medium text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                City & State / Country
              </label>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="e.g. New Delhi, Mumbai, New York, London"
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-sm font-medium text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>

            <div className="space-y-1.5 sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                Student Motto / Personal Motivation Bio
              </label>
              <textarea
                rows={2}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Write your daily motivation or academic vision..."
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-sm font-medium text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none resize-none"
              />
            </div>
          </div>
        </div>

        {/* Section 3: Strengths, Weak Topics & Daily Study Target */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-5">
          <div className="flex items-center gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
            <div className="p-2 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">Weak Topics & Study Habits</h2>
              <p className="text-xs text-slate-500">AI Tutor focuses on strengthening your weak topics automatically</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Weak Topics */}
            <div className="space-y-3">
              <label className="block text-xs font-bold text-rose-600 dark:text-rose-400 flex items-center gap-1.5">
                <span>Topics Needing Practice & Improvement</span>
                <span className="text-[10px] font-normal px-2 py-0.5 rounded-full bg-rose-50 dark:bg-rose-950/60">
                  High Priority for AI
                </span>
              </label>

              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={newWeakTopic}
                  onChange={(e) => setNewWeakTopic(e.target.value)}
                  placeholder="e.g. Integration by parts, Nernst Eq..."
                  className="flex-1 px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-900 dark:text-white focus:ring-2 focus:ring-rose-500 focus:outline-none"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleAddWeakTopic(e);
                    }
                  }}
                />
                <button
                  type="button"
                  onClick={handleAddWeakTopic}
                  className="px-3 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition-all shrink-0 flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Add
                </button>
              </div>

              <div className="flex flex-wrap gap-2 pt-1">
                {weakTopics.map((topic) => (
                  <span
                    key={topic}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-900/60 text-xs font-medium"
                  >
                    {topic}
                    <button
                      type="button"
                      onClick={() => handleRemoveWeakTopic(topic)}
                      className="text-rose-400 hover:text-rose-600 transition-colors"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            </div>

            {/* Strong Topics */}
            <div className="space-y-3">
              <label className="block text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                <span>Mastered Strengths & Top Topics</span>
                <span className="text-[10px] font-normal px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60">
                  Confidence
                </span>
              </label>

              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={newStrongTopic}
                  onChange={(e) => setNewStrongTopic(e.target.value)}
                  placeholder="e.g. Calculus, Kinematics, Optics..."
                  className="flex-1 px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleAddStrongTopic(e);
                    }
                  }}
                />
                <button
                  type="button"
                  onClick={handleAddStrongTopic}
                  className="px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shrink-0 flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Add
                </button>
              </div>

              <div className="flex flex-wrap gap-2 pt-1">
                {strongTopics.map((topic) => (
                  <span
                    key={topic}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-900/60 text-xs font-medium"
                  >
                    {topic}
                    <button
                      type="button"
                      onClick={() => handleRemoveStrongTopic(topic)}
                      className="text-emerald-400 hover:text-emerald-600 transition-colors"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Daily Study Target Slider */}
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-indigo-500" />
                Target Daily Study Time
              </span>
              <span className="font-extrabold text-indigo-600 dark:text-indigo-400 text-sm">
                {targetDailyMinutes} mins ({Math.floor(targetDailyMinutes / 60)}h {targetDailyMinutes % 60}m) / day
              </span>
            </div>
            <input
              type="range"
              min={30}
              max={480}
              step={15}
              value={targetDailyMinutes}
              onChange={(e) => setTargetDailyMinutes(Number(e.target.value))}
              className="w-full accent-indigo-600 dark:accent-indigo-400 h-2 bg-slate-100 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400 font-medium">
              <span>30 mins (Casual)</span>
              <span>2 hours (Standard)</span>
              <span>4 hours (Rigorous)</span>
              <span>8 hours (Intense Exam Prep)</span>
            </div>
          </div>
        </div>

        {/* Bottom Save Bar */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={() => setCurrentView("dashboard")}
            className="px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-semibold transition-all"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-lg shadow-indigo-500/20 active:scale-95 transition-all"
          >
            <Save className="w-4 h-4" />
            <span>Save Profile & Academic Goals</span>
          </button>
        </div>
      </form>
    </div>
  );
};
