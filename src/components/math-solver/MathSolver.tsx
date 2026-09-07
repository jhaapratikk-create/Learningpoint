import React, { useState, useRef } from "react";
import {
  Calculator,
  Sparkles,
  CheckCircle2,
  BookmarkPlus,
  Copy,
  Check,
  RotateCcw,
  Zap,
  Volume2,
  VolumeX,
  MessageSquare,
  Layers,
  HelpCircle,
  Lightbulb,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  Cpu,
  ArrowRight,
  Share2,
  Camera,
  BookOpen,
  Eye,
} from "lucide-react";
import { useStudy } from "../../context/StudyContext";
import { apiService } from "../../services/api";
import { MarkdownRenderer } from "../common/MarkdownRenderer";

interface StepItem {
  stepNumber: number;
  title: string;
  expression: string;
  explanation: string;
}

interface ProblemSolution {
  problemStatement: string;
  identifiedTopic: string;
  finalAnswer: string;
  givenData?: string[];
  governingFormulas?: string[];
  steps: StepItem[];
  verification?: string;
  tips?: string;
  alternativeMethod?: string;
  similarProblem?: {
    question: string;
    answer: string;
  };
  engine?: string;
  modelUsed?: string;
}

type SubjectCategory = "math" | "physics" | "chemistry" | "biology" | "cs" | "logic";

export const MathSolver: React.FC = () => {
  const { addNote, addFlashcard, subjects, addToast, setCurrentView } = useStudy();

  const [problem, setProblem] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<SubjectCategory>("math");
  const [selectedModel, setSelectedModel] = useState("gemini-3.1-flash-lite");
  const [isLoading, setIsLoading] = useState(false);
  const [solution, setSolution] = useState<ProblemSolution | null>(null);
  const [isCopied, setIsCopied] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [showSimilarAnswer, setShowSimilarAnswer] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const categories: { id: SubjectCategory; label: string; icon: string; defaultTopic: string }[] = [
    { id: "math", label: "Mathematics", icon: "📐", defaultTopic: "Algebra & Calculus" },
    { id: "physics", label: "Physics", icon: "⚛️", defaultTopic: "Mechanics & Electricity" },
    { id: "chemistry", label: "Chemistry", icon: "🧪", defaultTopic: "Stoichiometry & Reactions" },
    { id: "biology", label: "Biology", icon: "🧬", defaultTopic: "Genetics & Cellular Physiology" },
    { id: "cs", label: "Computer Science", icon: "💻", defaultTopic: "Algorithms & Logic" },
    { id: "logic", label: "Logic & STEM", icon: "🧩", defaultTopic: "Aptitude & Reasoning" },
  ];

  const mathSymbols = [
    "√", "x²", "x³", "xⁿ", "∫", "d/dx", "lim", "π", "θ", "∑",
    "±", "≠", "≤", "≥", "∞", "α", "β", "Δ", "λ", "→",
    "⇌", "log", "ln", "sin(x)", "cos(x)", "tan(x)", "e^x", "|x|", "°"
  ];

  const sampleProblemsByCategory: Record<SubjectCategory, string[]> = {
    math: [
      "2x^2 + 5x - 12 = 0",
      "Integrate: ∫ (3x^2 + 4x - 5) dx from 0 to 2",
      "Find derivative of f(x) = (x^2 + 1) / (x - 2)",
      "Solve system: 2x + 3y = 12 and 5x - y = 13",
      "Find limit: lim (x->0) (sin(3x) / x)",
    ],
    physics: [
      "A car accelerates from 0 to 60 m/s in 5s. Find acceleration and distance traveled.",
      "Calculate resultant force: F1 = 10N at 30 deg, F2 = 15N at 90 deg",
      "A 2kg mass on a spring (k = 200 N/m) is pulled 0.1m. Find total energy and max velocity.",
      "Calculate equivalent resistance of 4Ω, 6Ω, and 12Ω connected in parallel across 24V.",
    ],
    chemistry: [
      "Balance the chemical equation: Fe + O2 -> Fe2O3",
      "Calculate molarity of a solution containing 10g of NaOH in 250 mL of water.",
      "Find pH of a 0.05 M HCl solution and a 0.01 M NaOH solution.",
      "What is the empirical formula of a compound with 40% C, 6.7% H, and 53.3% O?",
    ],
    biology: [
      "In a monohybrid cross of heterozygous tall pea plants (Tt x Tt), calculate genotype and phenotype ratios.",
      "Explain the net ATP yield generated from one molecule of glucose during aerobic respiration.",
      "If a DNA strand has sequence 5'-ATGCGTAGC-3', what is the complementary mRNA sequence?",
    ],
    cs: [
      "Find the time and space complexity of Binary Search with recurrence relation T(n) = T(n/2) + O(1).",
      "Trace Dijkstra's shortest path algorithm step-by-step for a graph with 4 vertices.",
      "Convert decimal 156 to binary, octal, and hexadecimal.",
    ],
    logic: [
      "If 6 workers can build a wall in 10 days, how many days will it take 15 workers?",
      "Find the next number in series: 2, 6, 12, 20, 30, ?",
      "Solve truth table for compound proposition: (P ∧ Q) → (P ∨ ¬Q)",
    ],
  };

  const insertSymbol = (sym: string) => {
    if (!textareaRef.current) {
      setProblem((prev) => prev + sym);
      return;
    }
    const start = textareaRef.current.selectionStart;
    const end = textareaRef.current.selectionEnd;
    const newText = problem.substring(0, start) + sym + problem.substring(end);
    setProblem(newText);
    setTimeout(() => {
      if (textareaRef.current) {
        textareaRef.current.focus();
        textareaRef.current.setSelectionRange(start + sym.length, start + sym.length);
      }
    }, 10);
  };

  const handleSolve = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!problem.trim()) {
      addToast("Please enter a problem or equation to solve", undefined, "warning");
      return;
    }

    setIsLoading(true);
    setShowSimilarAnswer(false);
    try {
      const cat = categories.find((c) => c.id === selectedCategory);
      const data = await apiService.solveProblem({
        problem,
        topic: cat?.defaultTopic || "STEM Problem",
        model: selectedModel,
      });

      setSolution(data);
      addToast("Step-by-step solution generated with verified reasoning! 🎯");
    } catch (err) {
      addToast("Failed to solve problem, please try again", undefined, "error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyAnswer = () => {
    if (!solution) return;
    navigator.clipboard.writeText(
      `Problem: ${solution.problemStatement}\nFinal Answer: ${solution.finalAnswer}`
    );
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
    addToast("Answer copied to clipboard! 📋");
  };

  const handleTextToSpeech = () => {
    if (!solution) return;
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    const textToRead = `Problem: ${solution.problemStatement}. The final answer is: ${solution.finalAnswer}. Key step: ${solution.steps[0]?.explanation || ""}`;
    const utterance = new SpeechSynthesisUtterance(textToRead);
    utterance.rate = 1.0;
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    window.speechSynthesis.speak(utterance);
    setIsSpeaking(true);
  };

  const handleSaveToNotes = () => {
    if (!solution) return;
    const content = `# Solution: ${solution.problemStatement}\n\n**Topic:** ${solution.identifiedTopic}\n**Final Answer:** ${solution.finalAnswer}\n\n${
      solution.givenData && solution.givenData.length > 0
        ? `### 📋 Given Information\n${solution.givenData.map((g) => `- ${g}`).join("\n")}\n\n`
        : ""
    }${
      solution.governingFormulas && solution.governingFormulas.length > 0
        ? `### 📐 Governing Formulas\n${solution.governingFormulas.map((f) => `- \`${f}\``).join("\n")}\n\n`
        : ""
    }### 🔢 Step-by-Step Breakdown\n${solution.steps
      .map(
        (s) =>
          `#### Step ${s.stepNumber}: ${s.title}\n\`${s.expression}\`\n\n${s.explanation}`
      )
      .join("\n\n")}\n\n${
      solution.verification ? `### 🔍 Verification & Sanity Check\n${solution.verification}\n\n` : ""
    }${
      solution.tips ? `### ⚠️ Common Traps & Tips\n${solution.tips}\n\n` : ""
    }${
      solution.alternativeMethod
        ? `### 💡 Alternative Method\n${solution.alternativeMethod}\n\n`
        : ""
    }`;

    addNote({
      title: `${solution.identifiedTopic}: ${solution.problemStatement.slice(0, 30)}`,
      content,
      subjectId:
        subjects.find((s) =>
          s.name.toLowerCase().includes(selectedCategory.toLowerCase())
        )?.id || subjects[0]?.id || "sub_1",
      chapterId: "chap_1",
      tags: ["Problem Solver", solution.identifiedTopic],
      isFavorite: false,
    });
    addToast("Saved step-by-step derivation to My Notes! 📝");
  };

  const handleCreateFlashcard = () => {
    if (!solution) return;
    addFlashcard({
      front: `How do you solve: ${solution.problemStatement}?`,
      back: `**Final Answer:** ${solution.finalAnswer}\n\n**Key Formula:** ${
        solution.governingFormulas?.[0] || solution.steps[0]?.expression || "Standard derivation"
      }`,
      subjectId: subjects[0]?.id || "sub_1",
      chapterId: "chap_1",
      difficultyRating: "Medium",
    });
    addToast("Created Flashcard from problem! 🃏");
  };

  const handleAskInAITutor = () => {
    if (!solution) return;
    setCurrentView("ai-tutor");
    addToast("Switched to AI Tutor to explore follow-up doubts!");
  };

  return (
    <div className="space-y-6 pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-300 text-xs font-semibold border border-indigo-200/60 dark:border-indigo-800/40 mb-2">
            <Cpu className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
            <span>Deep Reasoning AI STEM Engine</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 dark:text-white">
            AI Universal Problem Solver
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Step-by-step rigorous solutions with mathematical proofs, formula extraction, and verification for Math, Physics, Chemistry, Biology & Coding.
          </p>
        </div>

        {/* AI Model Power Selector */}
        <div className="flex items-center gap-2 bg-white dark:bg-slate-900 p-1.5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs shrink-0">
          <span className="text-[11px] font-bold text-slate-400 px-2 uppercase">AI Model:</span>
          <select
            value={selectedModel}
            onChange={(e) => setSelectedModel(e.target.value)}
            className="text-xs font-semibold bg-indigo-50 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300 px-3 py-1.5 rounded-xl border-0 focus:outline-none cursor-pointer"
          >
            <option value="gemini-3.8-flash">⚡ Gemini 3.8 Flash (Ultra-Fast STEM)</option>
            <option value="gemini-3.1-pro-preview">🧠 Gemini 3.1 Pro (Deep STEM Reasoning)</option>
            <option value="gemini-3.1-flash-lite">🚀 Gemini 3.1 Flash-Lite (Instant)</option>
            <option value="gemini-flash-latest">🌐 Gemini Flash Latest (Adaptive)</option>
          </select>
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
        {categories.map((cat) => {
          const isActive = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => {
                setSelectedCategory(cat.id);
                setProblem(sampleProblemsByCategory[cat.id][0]);
              }}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all shrink-0 ${
                isActive
                  ? "bg-indigo-600 text-white shadow-sm shadow-indigo-500/25"
                  : "bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800"
              }`}
            >
              <span>{cat.icon}</span>
              <span>{cat.label}</span>
            </button>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Problem Input Panel */}
        <div className="lg:col-span-5 space-y-4">
          <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 sm:p-6 shadow-xs space-y-4">
            <form onSubmit={handleSolve} className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                    Enter Question / Equation *
                  </label>
                  <span className="text-[11px] text-slate-400">LaTeX & Math symbols supported</span>
                </div>
                <textarea
                  ref={textareaRef}
                  rows={4}
                  required
                  value={problem}
                  onChange={(e) => setProblem(e.target.value)}
                  placeholder="e.g. 2x² + 5x - 12 = 0, or calculate kinetic energy of 5kg at 20 m/s, or balance Fe + O2 -> Fe2O3..."
                  className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-250 dark:border-slate-700 text-slate-900 dark:text-white font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500 leading-relaxed"
                />
              </div>

              {/* Math / Science Quick Symbol Toolbar */}
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
                  Quick Insert Mathematical Symbols
                </span>
                <div className="flex flex-wrap gap-1 p-2 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                  {mathSymbols.map((sym, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => insertSymbol(sym)}
                      className="px-2 py-1 text-xs font-mono font-semibold rounded-lg bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-indigo-50 dark:hover:bg-indigo-950 hover:text-indigo-600 border border-slate-200/80 dark:border-slate-700 transition-colors shadow-2xs"
                    >
                      {sym}
                    </button>
                  ))}
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="flex gap-2">
                <button
                  type="submit"
                  disabled={!problem.trim() || isLoading}
                  className="flex-1 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white text-xs sm:text-sm font-bold shadow-md shadow-indigo-600/20 transition-all flex items-center justify-center gap-2 active:scale-95 cursor-pointer"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>{isLoading ? "Solving with Deep Reasoning..." : "Solve Problem Step-by-Step"}</span>
                </button>

                {problem && (
                  <button
                    type="button"
                    onClick={() => {
                      setProblem("");
                      setSolution(null);
                    }}
                    className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-colors"
                    title="Clear Input"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>
                )}
              </div>
            </form>

            {/* Sample Problems for Current Category */}
            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-2">
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Practice Questions in {categories.find((c) => c.id === selectedCategory)?.label}
              </p>
              <div className="flex flex-col gap-1.5 max-h-48 overflow-y-auto pr-1">
                {sampleProblemsByCategory[selectedCategory].map((prob, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      setProblem(prob);
                      setTimeout(() => handleSolve(), 50);
                    }}
                    className="p-2.5 rounded-xl text-left text-xs bg-slate-50 dark:bg-slate-800/80 hover:bg-indigo-50 dark:hover:bg-indigo-950 font-mono text-slate-700 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-300 transition-colors border border-slate-150 dark:border-slate-700/60"
                  >
                    {prob}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Solution Output Panel */}
        <div className="lg:col-span-7 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 sm:p-6 shadow-xs flex flex-col justify-between min-h-[480px]">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center text-center p-12 m-auto space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center animate-pulse">
                <Cpu className="w-7 h-7 animate-spin" />
              </div>
              <div className="space-y-1">
                <h4 className="text-base font-bold text-slate-900 dark:text-white">
                  Running STEM Reasoning Engine
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm">
                  Extracting variables, applying theorems, deriving intermediate algebra, and computing verified solution...
                </p>
              </div>
            </div>
          ) : solution ? (
            <div className="space-y-5">
              {/* Header Details */}
              <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300">
                      {solution.identifiedTopic}
                    </span>
                    {solution.modelUsed && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
                        ⚡ {solution.modelUsed}
                      </span>
                    )}
                  </div>
                  <p className="text-xs font-mono font-bold text-slate-900 dark:text-white mt-1">
                    {solution.problemStatement}
                  </p>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={handleTextToSpeech}
                    className={`p-2 rounded-xl text-xs font-semibold flex items-center gap-1 transition-colors ${
                      isSpeaking
                        ? "bg-rose-50 dark:bg-rose-950 text-rose-600"
                        : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200"
                    }`}
                    title="Read Aloud (TTS)"
                  >
                    {isSpeaking ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                  </button>

                  <button
                    onClick={handleSaveToNotes}
                    className="px-3 py-1.5 rounded-xl bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 text-xs font-semibold flex items-center gap-1.5 hover:bg-indigo-100 transition-colors"
                  >
                    <BookmarkPlus className="w-3.5 h-3.5" />
                    <span>Save Note</span>
                  </button>

                  <button
                    onClick={handleCreateFlashcard}
                    className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 text-xs font-semibold"
                    title="Convert to Flashcard"
                  >
                    <Layers className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Evaluated Final Answer Hero Card */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-500/10 via-teal-500/10 to-emerald-500/5 border-2 border-emerald-500/40 dark:border-emerald-500/30 flex items-center justify-between gap-4">
                <div>
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-800 dark:text-emerald-300 block mb-0.5">
                    🎯 Verified Final Answer
                  </span>
                  <h3 className="text-base sm:text-xl font-black text-emerald-950 dark:text-emerald-100 font-mono tracking-tight">
                    {solution.finalAnswer}
                  </h3>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={handleCopyAnswer}
                    className="p-2.5 rounded-xl bg-white dark:bg-slate-800 hover:bg-emerald-50 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-700/60 shadow-2xs transition-colors flex items-center gap-1.5 text-xs font-bold"
                  >
                    {isCopied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                    <span>{isCopied ? "Copied!" : "Copy"}</span>
                  </button>
                </div>
              </div>

              {/* Given Data & Governing Formulas */}
              {((solution.givenData && solution.givenData.length > 0) ||
                (solution.governingFormulas && solution.governingFormulas.length > 0)) && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {solution.givenData && solution.givenData.length > 0 && (
                    <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                        📋 Given Parameters
                      </span>
                      <ul className="text-xs space-y-1 text-slate-700 dark:text-slate-300">
                        {solution.givenData.map((g, i) => (
                          <li key={i} className="flex items-start gap-1.5 font-mono">
                            <span className="text-indigo-500">•</span>
                            <span>{g}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {solution.governingFormulas && solution.governingFormulas.length > 0 && (
                    <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                        📐 Governing Formulas
                      </span>
                      <ul className="text-xs space-y-1 text-slate-700 dark:text-slate-300">
                        {solution.governingFormulas.map((f, i) => (
                          <li key={i} className="flex items-start gap-1.5 font-mono text-indigo-600 dark:text-indigo-400 font-semibold">
                            <span>•</span>
                            <span>{f}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}

              {/* Step by Step Breakdown */}
              <div className="space-y-3">
                <span className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
                  <Zap className="w-4 h-4 text-indigo-600" />
                  <span>Step-by-Step Derivation & Proof</span>
                </span>

                <div className="space-y-3 max-h-[360px] overflow-y-auto pr-2">
                  {solution.steps.map((step) => (
                    <div
                      key={step.stepNumber}
                      className="p-4 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-750 space-y-2"
                    >
                      <div className="flex items-center gap-2">
                        <span className="w-6 h-6 rounded-lg bg-indigo-600 text-white text-xs font-black flex items-center justify-center shrink-0">
                          {step.stepNumber}
                        </span>
                        <h5 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                          {step.title}
                        </h5>
                      </div>

                      {step.expression && (
                        <div className="p-2.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-250 dark:border-slate-700 text-xs font-mono text-indigo-700 dark:text-indigo-300 overflow-x-auto">
                          {step.expression}
                        </div>
                      )}

                      <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                        {step.explanation}
                      </p>
                    </div>
                  ))}

                  {/* Verification & Sanity Check Card */}
                  {solution.verification && (
                    <div className="p-3.5 rounded-xl bg-blue-50/60 dark:bg-blue-950/40 border border-blue-200/80 dark:border-blue-800/60 space-y-1">
                      <span className="text-[10px] font-extrabold uppercase tracking-wider text-blue-700 dark:text-blue-300 flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Verification & Sanity Check</span>
                      </span>
                      <p className="text-xs text-blue-950 dark:text-blue-200">
                        {solution.verification}
                      </p>
                    </div>
                  )}

                  {/* Common Pitfalls & Traps */}
                  {solution.tips && (
                    <div className="p-3.5 rounded-xl bg-amber-50/60 dark:bg-amber-950/40 border border-amber-200/80 dark:border-amber-800/60 space-y-1">
                      <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-700 dark:text-amber-300 flex items-center gap-1">
                        <AlertTriangle className="w-3.5 h-3.5" />
                        <span>Common Student Traps & Tips</span>
                      </span>
                      <p className="text-xs text-amber-950 dark:text-amber-200">
                        {solution.tips}
                      </p>
                    </div>
                  )}

                  {/* Alternative Shortcut Method */}
                  {solution.alternativeMethod && (
                    <div className="p-3.5 rounded-xl bg-purple-50/60 dark:bg-purple-950/40 border border-purple-200/80 dark:border-purple-800/60 space-y-1">
                      <span className="text-[10px] font-extrabold uppercase tracking-wider text-purple-700 dark:text-purple-300 flex items-center gap-1">
                        <Lightbulb className="w-3.5 h-3.5" />
                        <span>Alternative Shortcut Method</span>
                      </span>
                      <p className="text-xs text-purple-950 dark:text-purple-200">
                        {solution.alternativeMethod}
                      </p>
                    </div>
                  )}

                  {/* Similar Practice Problem Challenge */}
                  {solution.similarProblem && (
                    <div className="p-4 rounded-xl bg-slate-100/70 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 space-y-2">
                      <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400 block">
                        🏋️ Try a Similar Practice Problem
                      </span>
                      <p className="text-xs font-semibold text-slate-900 dark:text-white font-mono">
                        {solution.similarProblem.question}
                      </p>

                      <div className="pt-1">
                        <button
                          type="button"
                          onClick={() => setShowSimilarAnswer(!showSimilarAnswer)}
                          className="px-3 py-1 rounded-lg bg-white dark:bg-slate-900 border border-slate-250 dark:border-slate-700 text-xs font-semibold text-indigo-600 dark:text-indigo-400 flex items-center gap-1"
                        >
                          {showSimilarAnswer ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                          <span>{showSimilarAnswer ? "Hide Answer" : "Reveal Answer & Solution"}</span>
                        </button>

                        {showSimilarAnswer && (
                          <div className="mt-2 p-2.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 text-xs font-mono text-emerald-900 dark:text-emerald-200">
                            {solution.similarProblem.answer}
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Bottom Quick Action: Ask Follow-up Doubt */}
              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <button
                  onClick={handleAskInAITutor}
                  className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-indigo-50 dark:hover:bg-indigo-950 text-indigo-600 dark:text-indigo-400 text-xs font-bold transition-colors flex items-center gap-2"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Ask Follow-up Doubt in AI Tutor</span>
                </button>

                <p className="text-[10px] text-slate-400">
                  Verified with Multi-step Logic
                </p>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center text-center p-8 m-auto space-y-3">
              <div className="w-14 h-14 rounded-2xl bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                <Calculator className="w-7 h-7" />
              </div>
              <h4 className="text-base font-bold text-slate-900 dark:text-white">
                Universal Problem Solver Ready
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm">
                Enter any quadratic, calculus integral, physics kinematics, chemistry equation, or biology calculation on the left to receive a step-by-step verified breakdown.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
