import React, { useState } from "react";
import {
  BookOpen,
  Sparkles,
  Search,
  Bookmark,
  BookmarkCheck,
  Trash2,
  Copy,
  Printer,
  FileText,
  HelpCircle,
  AlertTriangle,
  Lightbulb,
  CheckCircle2,
  Atom,
  Calculator,
  Layers,
  ChevronRight,
  Send,
  Loader2,
  Share2,
  Clock,
  RotateCcw,
  BadgeAlert,
  ArrowRight,
} from "lucide-react";
import { useStudy } from "../../context/StudyContext";
import { useAuth } from "../../context/AuthContext";
import { SmartNoteItem, EducationBoard } from "../../types";
import { apiService } from "../../services/api";
import { motion } from "motion/react";

const CLASS_OPTIONS = ["Class 9", "Class 10", "Class 11", "Class 12"] as const;
const BOARD_OPTIONS: EducationBoard[] = ["CBSE", "ICSE", "State Board", "Cambridge IGCSE", "IB"];

const QUICK_TOPICS_BY_CLASS: { [cls: string]: { [subject: string]: string[] } } = {
  "Class 9": {
    Science: [
      "Motion & Equations of Motion",
      "Force and Newton's Laws of Motion",
      "Gravitation & Archimedes' Principle",
      "Atoms and Molecules (Criss-Cross Valency)",
      "Structure of the Atom & Bohr's Model",
      "The Fundamental Unit of Life (Cell & Osmosis)",
      "Tissues (Xylem, Phloem & Animal Tissues)",
      "Work, Energy & Conservation of Energy",
      "Sound (Wave Characteristics & Echo)",
    ],
    Mathematics: [
      "Number Systems & Rationalization of Denominators",
      "Polynomials & Algebraic Identities",
      "Coordinate Geometry & Quadrants",
      "Lines, Angles & Transversal Theorems",
      "Triangles (SAS, ASA, RHS Congruence Proofs)",
      "Quadrilaterals & Mid-Point Theorem",
      "Circles & Arc Angle Theorems",
      "Heron's Formula & Scalene Triangles",
      "Surface Areas & Volumes of Cones & Spheres",
    ],
  },
  "Class 10": {
    Science: [
      "Chemical Reactions and Equations",
      "Acids, Bases and Salts",
      "Metals and Non-metals",
      "Carbon and its Compounds",
      "Life Processes (Nutrition & Respiration)",
      "Control and Coordination (Nervous System)",
      "How do Organisms Reproduce?",
      "Heredity and Evolution",
      "Light: Reflection and Refraction",
      "Electricity (Ohm's Law & Circuit Numericals)",
    ],
    Mathematics: [
      "Real Numbers (Fundamental Theorem of Arithmetic)",
      "Polynomials (Geometrical Meaning of Zeros)",
      "Pair of Linear Equations in Two Variables",
      "Quadratic Equations (Nature of Roots)",
      "Arithmetic Progressions (nth Term & Sum)",
      "Triangles (Basic Proportionality Theorem)",
      "Coordinate Geometry (Section Formula)",
      "Introduction to Trigonometry (Identities)",
      "Surface Areas and Volumes",
    ],
  },
  "Class 11": {
    Physics: [
      "Units, Dimensions and Error Analysis",
      "Motion in a Straight Line & Calculus",
      "Laws of Motion and Friction",
      "Work, Energy, Power & Collisions",
      "Rotational Motion & Moment of Inertia",
      "Gravitation & Kepler's Laws",
      "Thermodynamics & Carnot Cycle",
    ],
    Chemistry: [
      "Some Basic Concepts of Chemistry (Mole Concept)",
      "Structure of Atom (Quantum Numbers)",
      "Classification of Elements & Periodicity",
      "Chemical Bonding and Molecular Structure",
      "Chemical Thermodynamics",
      "Equilibrium (Le Chatelier's Principle)",
      "Organic Chemistry: Basic Principles and Techniques",
    ],
    Mathematics: [
      "Sets, Relations and Functions",
      "Trigonometric Functions & General Solutions",
      "Complex Numbers and Quadratic Equations",
      "Linear Inequalities",
      "Permutations and Combinations",
      "Binomial Theorem",
      "Sequences and Series",
      "Straight Lines & Conic Sections",
    ],
  },
  "Class 12": {
    Physics: [
      "Electrostatics & Gauss's Theorem",
      "Current Electricity & Kirchhoff's Laws",
      "Moving Charges and Magnetism",
      "Electromagnetic Induction & Lenz's Law",
      "Alternating Current & Transformers",
      "Wave Optics & Young's Double Slit",
      "Dual Nature of Radiation and Matter",
    ],
    Chemistry: [
      "Solutions (Raoult's Law & Colligative Properties)",
      "Electrochemistry (Nernst Equation)",
      "Chemical Kinetics (Rate Laws & Activation Energy)",
      "d and f Block Elements",
      "Coordination Compounds (CFT & Hybridization)",
      "Haloalkanes and Haloarenes (SN1 & SN2)",
      "Biomolecules (Proteins & Nucleic Acids)",
    ],
    Mathematics: [
      "Relations and Functions",
      "Inverse Trigonometric Functions",
      "Matrices and Determinants",
      "Continuity and Differentiability",
      "Application of Derivatives (Maxima & Minima)",
      "Integrals (Definite & Substitution)",
      "Differential Equations",
      "Vector Algebra and 3D Geometry",
    ],
  },
};

export const SmartNotesView: React.FC = () => {
  const {
    smartNotes,
    selectedSmartNoteId,
    setSelectedSmartNoteId,
    addSmartNote,
    deleteSmartNote,
    toggleFavoriteSmartNote,
    addToast,
    selectedBoard,
    setSelectedBoard,
    setCurrentView,
    addStudyAlarm,
  } = useStudy();
  const { user } = useAuth();

  const defaultClass = user?.grade?.includes("9")
    ? "Class 9"
    : user?.grade?.includes("10")
    ? "Class 10"
    : user?.grade?.includes("11")
    ? "Class 11"
    : user?.grade?.includes("12")
    ? "Class 12"
    : "Class 9";

  // Generator Form State
  const [classGrade, setClassGrade] = useState<string>(defaultClass);
  const [board, setBoard] = useState<EducationBoard>(user?.board || selectedBoard || "CBSE");
  const [subject, setSubject] = useState<string>("Science");
  const [topic, setTopic] = useState<string>("Motion and Newton's Laws of Motion");
  const [noteType, setNoteType] = useState<"comprehensive" | "high-yield" | "formulas" | "concept-map" | "quick-summary">("comprehensive");
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [filterFavorites, setFilterFavorites] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<"concepts" | "formulas" | "questions" | "pitfalls" | "full">("concepts");

  const suggestedTopics = QUICK_TOPICS_BY_CLASS[classGrade]?.[subject] || QUICK_TOPICS_BY_CLASS["Class 9"]?.[subject] || [];

  const activeNote = smartNotes.find((n) => n.id === selectedSmartNoteId) || smartNotes[0] || null;

  const filteredNotes = smartNotes.filter((note) => {
    if (filterFavorites && !note.isFavorite) return false;
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      note.title.toLowerCase().includes(q) ||
      note.topic.toLowerCase().includes(q) ||
      note.classGrade.toLowerCase().includes(q) ||
      note.board.toLowerCase().includes(q) ||
      note.subject.toLowerCase().includes(q)
    );
  });

  const handleGenerateNotes = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!topic.trim()) {
      addToast("Topic Required", "Please enter or select a topic to generate smart notes.", "warning");
      return;
    }

    setIsGenerating(true);
    addToast("Synthesizing Smart Notes", `Analyzing New NCERT & ${board} curriculum for ${topic}...`, "info");

    try {
      const generated = await apiService.generateSmartNotes({
        classGrade,
        board,
        subject,
        topic: topic.trim(),
        noteType,
      });

      addSmartNote(generated);
    } catch (err) {
      addToast("Generation Error", "Could not generate smart notes. Please try again.", "error");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopyMarkdown = () => {
    if (!activeNote) return;
    const content = activeNote.formattedMarkdown || `${activeNote.title}\n\n${activeNote.overview}`;
    navigator.clipboard.writeText(content);
    addToast("Copied to Clipboard", "Smart note formatted markdown copied!", "success");
  };

  const handlePrint = () => {
    window.print();
  };

  const handleCreateAlarmForTopic = () => {
    if (!activeNote) return;
    addStudyAlarm({
      title: `Revise: ${activeNote.topic}`,
      subject: activeNote.subject,
      topic: activeNote.topic,
      classGrade: activeNote.classGrade,
      board: activeNote.board,
      time: "07:00",
      days: ["Mon", "Wed", "Fri"],
      isEnabled: true,
      sound: "chime",
      repeat: "weekdays",
      autoOpenView: "smart-notes",
    });
    addToast("Alarm Scheduled", `Alarm set to revise ${activeNote.topic}!`, "success");
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16">
      {/* Header Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 text-white shadow-lg">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 text-xs font-semibold tracking-wide uppercase backdrop-blur-sm">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" /> AI Master Academic Notes
            </div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
              Smart Notes System
            </h1>
            <p className="text-blue-100 text-xs md:text-sm max-w-2xl">
              Input any Class, Board, and Topic to generate structured New NCERT smart notes with core definitions, formulas, model exam answers, and step marking keys.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="px-3 py-1.5 rounded-xl bg-white/10 border border-white/20 text-xs flex items-center gap-1.5 backdrop-blur-sm">
              <BookOpen className="w-3.5 h-3.5 text-blue-200" />
              <span>Rationalized New NCERT (2025-2026)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: Left Generator + List, Right Note Viewer */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Generator & Saved Notes (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Note Generator Card */}
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-500" /> Generate New Smart Note
              </h2>
              <span className="text-[11px] px-2 py-0.5 rounded-md bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 font-medium">
                AI Powered
              </span>
            </div>

            <form onSubmit={handleGenerateNotes} className="space-y-3.5">
              {/* Class and Board Pickers */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Class / Grade
                  </label>
                  <select
                    value={classGrade}
                    onChange={(e) => setClassGrade(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-900 dark:text-white"
                  >
                    {CLASS_OPTIONS.map((cg) => (
                      <option key={cg} value={cg}>
                        {cg} {cg === "Class 9" ? "★ (New NCERT)" : ""}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Education Board
                  </label>
                  <select
                    value={board}
                    onChange={(e) => {
                      setBoard(e.target.value as EducationBoard);
                      setSelectedBoard(e.target.value as EducationBoard);
                    }}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-900 dark:text-white"
                  >
                    {BOARD_OPTIONS.map((b) => (
                      <option key={b} value={b}>
                        {b} Board
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Subject & Style */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Subject
                  </label>
                  <select
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-900 dark:text-white"
                  >
                    <option value="Science">Science</option>
                    <option value="Mathematics">Mathematics</option>
                    <option value="Social Science">Social Science</option>
                    <option value="Physics">Physics</option>
                    <option value="Chemistry">Chemistry</option>
                    <option value="Biology">Biology</option>
                    <option value="English">English</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Note Focus
                  </label>
                  <select
                    value={noteType}
                    onChange={(e) => setNoteType(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-900 dark:text-white"
                  >
                    <option value="comprehensive">Comprehensive (All Sections)</option>
                    <option value="high-yield">High-Yield Exam Focus</option>
                    <option value="formulas">Formulas & Derivations</option>
                    <option value="concept-map">Concept Map & Key Rules</option>
                    <option value="quick-summary">Quick 5-Minute Summary</option>
                  </select>
                </div>
              </div>

              {/* Topic Input */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Topic / Chapter Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Motion, Laws of Motion, Number Systems..."
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Quick NCERT Topic Suggestions */}
              {suggestedTopics.length > 0 && (
                <div>
                  <div className="text-[11px] font-medium text-slate-500 dark:text-slate-400 mb-1.5">
                    {classGrade} New NCERT Suggestions:
                  </div>
                  <div className="flex flex-wrap gap-1.5 max-h-28 overflow-y-auto pr-1">
                    {suggestedTopics.map((t) => (
                      <button
                        key={t}
                        type="button"
                        onClick={() => setTopic(t)}
                        className={`text-[11px] px-2 py-1 rounded-lg border text-left transition-colors ${
                          topic === t
                            ? "bg-blue-500 text-white border-blue-600"
                            : "bg-slate-50 dark:bg-slate-800/80 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-blue-300"
                        }`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Generate Button */}
              <button
                type="submit"
                disabled={isGenerating}
                className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold text-xs shadow-md flex items-center justify-center gap-2 transition-all disabled:opacity-60"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Generating {classGrade} ({board}) Notes...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-amber-300" />
                    Generate Smart Notes with AI
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Saved Smart Notes List */}
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300">
                Your Smart Notes Library ({smartNotes.length})
              </h3>
              <button
                type="button"
                onClick={() => setFilterFavorites(!filterFavorites)}
                className={`text-xs px-2 py-0.5 rounded-md flex items-center gap-1 transition-colors ${
                  filterFavorites
                    ? "bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 font-semibold"
                    : "text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                }`}
              >
                <Bookmark className="w-3 h-3" /> Starred
              </button>
            </div>

            {/* Search filter */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search notes by topic or class..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white placeholder-slate-400"
              />
            </div>

            {/* Notes list */}
            <div className="space-y-2 max-h-[420px] overflow-y-auto pr-1">
              {filteredNotes.length === 0 ? (
                <div className="text-center py-6 text-xs text-slate-400">
                  No notes match your filter.
                </div>
              ) : (
                filteredNotes.map((note) => {
                  const isSelected = activeNote?.id === note.id;
                  return (
                    <div
                      key={note.id}
                      onClick={() => setSelectedSmartNoteId(note.id)}
                      className={`cursor-pointer p-3 rounded-xl border transition-all ${
                        isSelected
                          ? "border-blue-500 bg-blue-50/50 dark:bg-blue-950/30 shadow-sm"
                          : "border-slate-200/80 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-white dark:bg-slate-900"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1.5 text-[10px] font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
                            <span>{note.classGrade}</span>
                            <span>•</span>
                            <span>{note.board}</span>
                            <span>•</span>
                            <span>{note.subject}</span>
                          </div>
                          <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate mt-0.5">
                            {note.topic}
                          </h4>
                          <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate mt-0.5">
                            {note.overview}
                          </p>
                        </div>

                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleFavoriteSmartNote(note.id);
                            }}
                            className="p-1 text-slate-400 hover:text-amber-500 transition-colors"
                          >
                            {note.isFavorite ? (
                              <BookmarkCheck className="w-3.5 h-3.5 text-amber-500" />
                            ) : (
                              <Bookmark className="w-3.5 h-3.5" />
                            )}
                          </button>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteSmartNote(note.id);
                            }}
                            className="p-1 text-slate-300 hover:text-rose-500 transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Active Smart Note Reader (7 cols) */}
        <div className="lg:col-span-7">
          {activeNote ? (
            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
              {/* Note Header */}
              <div className="border-b border-slate-100 dark:border-slate-800 pb-5 space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="px-2.5 py-1 rounded-md bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 text-xs font-bold">
                      {activeNote.classGrade}
                    </span>
                    <span className="px-2.5 py-1 rounded-md bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 text-xs font-bold">
                      {activeNote.board} Board
                    </span>
                    <span className="px-2.5 py-1 rounded-md bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 text-xs font-bold">
                      {activeNote.subject}
                    </span>
                    <span className="px-2.5 py-1 rounded-md bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 text-[11px] font-semibold border border-amber-200 dark:border-amber-800">
                      ★ New NCERT
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      title="Set study alarm for this topic"
                      onClick={handleCreateAlarmForTopic}
                      className="px-2.5 py-1.5 rounded-lg bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 hover:bg-amber-100 text-xs font-medium flex items-center gap-1 transition-colors"
                    >
                      <Clock className="w-3.5 h-3.5" /> Alarm
                    </button>
                    <button
                      type="button"
                      title="Copy full notes markdown"
                      onClick={handleCopyMarkdown}
                      className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-colors"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      title="Print or export note"
                      onClick={handlePrint}
                      className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-colors"
                    >
                      <Printer className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div>
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                    {activeNote.title}
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    {activeNote.syllabusContext}
                  </p>
                </div>

                {/* Sub-Navigation Tabs */}
                <div className="flex flex-wrap items-center gap-2 pt-2">
                  {[
                    { id: "concepts", label: "Core Concepts", icon: BookOpen },
                    { id: "formulas", label: "Formulas & Laws", icon: Calculator },
                    { id: "questions", label: "Board Questions (PYQs)", icon: HelpCircle },
                    { id: "pitfalls", label: "Common Pitfalls", icon: AlertTriangle },
                    { id: "full", label: "Full Markdown", icon: FileText },
                  ].map((tab) => {
                    const Icon = tab.icon;
                    const isActive = activeTab === tab.id;
                    return (
                      <button
                        key={tab.id}
                        type="button"
                        onClick={() => setActiveTab(tab.id as any)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
                          isActive
                            ? "bg-blue-600 text-white shadow-sm"
                            : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700"
                        }`}
                      >
                        <Icon className="w-3.5 h-3.5" />
                        {tab.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Overview Box */}
              <div className="p-4 rounded-xl bg-blue-50/50 dark:bg-blue-950/20 border border-blue-200/60 dark:border-blue-800/40">
                <div className="text-xs font-bold text-blue-800 dark:text-blue-300 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                  <Lightbulb className="w-3.5 h-3.5 text-amber-500" /> Topic Essence & Significance
                </div>
                <p className="text-xs leading-relaxed text-slate-700 dark:text-slate-300">
                  {activeNote.overview}
                </p>
              </div>

              {/* Tab 1: Core Concepts */}
              {activeTab === "concepts" && (
                <div className="space-y-4">
                  {activeNote.keyConcepts && activeNote.keyConcepts.map((concept, idx) => (
                    <div
                      key={idx}
                      className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 space-y-2.5"
                    >
                      <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                        {concept.heading}
                      </h3>
                      <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                        {concept.explanation}
                      </p>

                      {concept.diagramDescription && (
                        <div className="p-3 rounded-lg bg-white dark:bg-slate-900 border border-dashed border-slate-300 dark:border-slate-700 text-xs">
                          <div className="font-semibold text-slate-800 dark:text-slate-200 text-[11px] uppercase tracking-wider text-indigo-600 dark:text-indigo-400 mb-1">
                            📐 Diagram / Graph Blueprint for Board Exam
                          </div>
                          <p className="text-slate-600 dark:text-slate-400 italic">
                            {concept.diagramDescription}
                          </p>
                        </div>
                      )}

                      {concept.examples && concept.examples.length > 0 && (
                        <div className="text-xs space-y-1">
                          <span className="font-semibold text-slate-800 dark:text-slate-200 text-[11px]">
                            Example / Worked Application:
                          </span>
                          <ul className="list-disc list-inside text-slate-600 dark:text-slate-400 space-y-0.5">
                            {concept.examples.map((ex, i) => (
                              <li key={i}>{ex}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  ))}

                  {/* Quick Revision Bullets */}
                  {activeNote.quickRevisionPoints && (
                    <div className="p-4 rounded-xl bg-emerald-50/60 dark:bg-emerald-950/20 border border-emerald-200/60 dark:border-emerald-800/40 space-y-2">
                      <div className="text-xs font-bold text-emerald-800 dark:text-emerald-300 uppercase tracking-wider flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5" /> Rapid Exam Revision Anchors
                      </div>
                      <ul className="space-y-1.5 text-xs text-slate-700 dark:text-slate-300">
                        {activeNote.quickRevisionPoints.map((pt, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <span className="text-emerald-500 font-bold">•</span>
                            <span>{pt}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}

              {/* Tab 2: Formulas & Laws */}
              {activeTab === "formulas" && (
                <div className="space-y-3">
                  {activeNote.formulasAndLaws && activeNote.formulasAndLaws.length > 0 ? (
                    activeNote.formulasAndLaws.map((f, i) => (
                      <div
                        key={i}
                        className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 space-y-2"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-slate-900 dark:text-white">
                            {f.name}
                          </span>
                          {f.units && (
                            <span className="text-[11px] px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-700 font-mono text-slate-700 dark:text-slate-300">
                              Unit: {f.units}
                            </span>
                          )}
                        </div>

                        <div className="p-3 rounded-lg bg-slate-900 text-amber-300 font-mono text-sm tracking-wide shadow-inner">
                          {f.formula}
                        </div>

                        {f.variables && (
                          <div className="text-xs text-slate-600 dark:text-slate-400">
                            <span className="font-semibold text-slate-700 dark:text-slate-300">Symbols:</span>{" "}
                            {f.variables}
                          </div>
                        )}
                      </div>
                    ))
                  ) : (
                    <div className="text-xs text-slate-400 text-center py-8">
                      No explicit mathematical formulas for this conceptual unit.
                    </div>
                  )}
                </div>
              )}

              {/* Tab 3: Must-Know Board Questions */}
              {activeTab === "questions" && (
                <div className="space-y-4">
                  {activeNote.mustKnowExamQuestions && activeNote.mustKnowExamQuestions.map((q, idx) => (
                    <div
                      key={idx}
                      className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 space-y-3"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                          Q{idx + 1}. {q.question}
                        </h4>
                        {q.marks && (
                          <span className="px-2 py-0.5 rounded bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 text-[10px] font-bold whitespace-nowrap">
                            {q.marks} Marks
                          </span>
                        )}
                      </div>

                      {/* Model Answer */}
                      <div className="p-3 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs text-slate-800 dark:text-slate-200 leading-relaxed whitespace-pre-line">
                        <span className="font-semibold text-blue-600 dark:text-blue-400 block mb-1">
                          Model Answer (Scoring Full Credit):
                        </span>
                        {q.answer}
                      </div>

                      {/* Step Marking Key Points */}
                      {q.markingKeyPoints && q.markingKeyPoints.length > 0 && (
                        <div className="p-2.5 rounded-lg bg-blue-50/50 dark:bg-blue-950/30 text-[11px] text-blue-800 dark:text-blue-300">
                          <span className="font-bold block mb-1">
                            {activeNote.board} Examiner Marking Key Breakdown:
                          </span>
                          <ul className="list-disc list-inside space-y-0.5">
                            {q.markingKeyPoints.map((kp, i) => (
                              <li key={i}>{kp}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* Tab 4: Common Pitfalls */}
              {activeTab === "pitfalls" && (
                <div className="space-y-3">
                  <div className="p-4 rounded-xl bg-rose-50/60 dark:bg-rose-950/20 border border-rose-200/60 dark:border-rose-800/40 space-y-3">
                    <div className="text-xs font-bold text-rose-800 dark:text-rose-300 uppercase tracking-wider flex items-center gap-1.5">
                      <AlertTriangle className="w-4 h-4 text-rose-500" /> Common Board Exam Traps & Mistakes
                    </div>
                    <ul className="space-y-2 text-xs text-slate-700 dark:text-slate-300">
                      {activeNote.commonPitfalls && activeNote.commonPitfalls.map((pf, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <span className="text-rose-500 font-bold">⚠️</span>
                          <span>{pf}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}

              {/* Tab 5: Full Markdown */}
              {activeTab === "full" && (
                <div className="p-4 rounded-xl bg-slate-900 text-slate-100 font-mono text-xs overflow-x-auto whitespace-pre-wrap leading-relaxed">
                  {activeNote.formattedMarkdown || `${activeNote.title}\n\n${activeNote.overview}`}
                </div>
              )}

              {/* Bottom Action Footer */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-slate-100 dark:border-slate-800 text-xs">
                <span className="text-slate-400">
                  Ready to test your mastery of {activeNote.topic}?
                </span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setCurrentView("quizzes")}
                    className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold flex items-center gap-1.5 shadow-sm transition-all"
                  >
                    Launch Topic Practice Quiz <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-12 text-center rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              <BookOpen className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
              <h3 className="text-base font-semibold text-slate-700 dark:text-slate-300">
                No note selected
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Choose a note from the left list or generate a new one for your Class and Board!
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
