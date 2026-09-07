import React, { useState } from "react";
import {
  BookMarked,
  Sparkles,
  RotateCcw,
  Lightbulb,
  Zap,
  HelpCircle,
  BookmarkPlus,
  Copy,
  Check,
  ArrowRight,
  Layers,
} from "lucide-react";
import { useStudy } from "../../context/StudyContext";
import { apiService } from "../../services/api";
import { MarkdownRenderer } from "../common/MarkdownRenderer";

export const ExplanationEngine: React.FC = () => {
  const { subjects, addNote, addFlashcard, addToast, triggerConfetti } = useStudy();

  const [topic, setTopic] = useState("");
  const [style, setStyle] = useState("Standard Academic");
  const [language, setLanguage] = useState("English");
  const [explanation, setExplanation] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  const styles = [
    "Standard Academic",
    "ELIF5 (Explain Like I'm 5)",
    "Deep Academic / University Level",
    "Analogy & Metaphor Driven",
    "Step-by-Step Problem Solving",
    "Exam-Focused Bullet Guide",
    "Visual Diagram & Mental Model Description",
  ];

  const explainAgainOptions: {
    type: "simpler" | "detailed" | "example" | "analogy" | "practice";
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    color: string;
  }[] = [
    { type: "simpler", label: "Make it Simpler", icon: Lightbulb, color: "text-amber-500" },
    { type: "detailed", label: "More Detailed", icon: BookMarked, color: "text-indigo-500" },
    { type: "example", label: "Give Real-World Example", icon: Zap, color: "text-emerald-500" },
    { type: "analogy", label: "Use an Analogy", icon: Sparkles, color: "text-purple-500" },
    { type: "practice", label: "Give Practice Question", icon: HelpCircle, color: "text-blue-500" },
  ];

  const handleExplain = async (customType?: "simpler" | "detailed" | "example" | "analogy" | "practice") => {
    if (!topic.trim()) return;

    setIsLoading(true);
    try {
      const res = await apiService.explainConcept({
        topic,
        style: customType ? undefined : style,
        explainAgainType: customType,
        preferredLanguage: language,
      });
      setExplanation(res.text);
      if (customType) {
        addToast(`Refined explanation: ${customType}!`);
      } else {
        addToast("Explanation generated! 🧠");
      }
    } catch (e) {
      addToast("Failed to generate explanation", undefined, "error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveToNotes = () => {
    if (!explanation) return;
    addNote({
      title: `Explanation: ${topic}`,
      content: explanation,
      subjectId: subjects[0]?.id || "sub_1",
      chapterId: "chap_1",
      tags: ["AI Explanation", style],
      isFavorite: false,
    });
    addToast("Explanation saved to My Notes! 📝");
  };

  const handleConvertFlashcard = () => {
    if (!explanation) return;
    addFlashcard({
      front: `Explain the concept of: ${topic}`,
      back: explanation.slice(0, 200) + "...",
      subjectId: subjects[0]?.id || "sub_1",
      chapterId: "chap_1",
      difficultyRating: "Medium",
    });
    triggerConfetti();
    addToast("Flashcard created! 🃏");
  };

  const handleCopy = () => {
    if (!explanation) return;
    navigator.clipboard.writeText(explanation);
    setIsCopied(true);
    addToast("Copied to clipboard!");
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div className="space-y-6 pb-12">
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-50 dark:bg-purple-950/50 text-purple-700 dark:text-purple-300 text-xs font-semibold border border-purple-200/60 dark:border-purple-800/40 mb-2">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Interactive Concept Tutor</span>
        </div>
        <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">
          AI Concept Explanation Engine
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
          Ask to explain any complex topic in multiple styles, then interactively request simpler breakdowns, real-world analogies, or practice questions.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Form Controls */}
        <div className="lg:col-span-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 sm:p-6 shadow-xs space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
              Concept / Topic to Master *
            </label>
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="e.g. Bernoulli's Principle, Enzyme Catalysis, Mitosis vs Meiosis"
              className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-250 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
              Initial Explanation Style
            </label>
            <select
              value={style}
              onChange={(e) => setStyle(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-250 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none"
            >
              {styles.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
              Language
            </label>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-250 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none"
            >
              <option value="English">English</option>
              <option value="Spanish">Spanish (Español)</option>
              <option value="French">French (Français)</option>
              <option value="Hindi">Hindi (हिंदी)</option>
              <option value="German">German (Deutsch)</option>
              <option value="Mandarin">Mandarin (中文)</option>
            </select>
          </div>

          <button
            onClick={() => handleExplain()}
            disabled={!topic.trim() || isLoading}
            className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white text-xs sm:text-sm font-semibold shadow-sm transition-all flex items-center justify-center gap-2 active:scale-95"
          >
            <Sparkles className="w-4 h-4" />
            <span>{isLoading ? "Formulating Explanation..." : "Explain Concept"}</span>
          </button>

          {/* Quick Suggestion Chips */}
          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-2">
            <p className="text-[11px] font-bold text-slate-400 uppercase">Popular Concepts</p>
            <div className="flex flex-wrap gap-1.5">
              {[
                "Schrödinger Wave Equation",
                "Keynesian Multiplier",
                "Mendelian Genetics",
                "Fourier Transform",
                "Plate Tectonics",
              ].map((sug) => (
                <button
                  key={sug}
                  onClick={() => setTopic(sug)}
                  className="px-2.5 py-1 rounded-lg text-[11px] bg-slate-100 dark:bg-slate-800 hover:bg-indigo-50 dark:hover:bg-indigo-950 text-slate-700 dark:text-slate-300 transition-colors"
                >
                  {sug}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Explanation Output & "Explain Again" Interactive Bar */}
        <div className="lg:col-span-7 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 sm:p-6 shadow-xs flex flex-col justify-between min-h-[420px]">
          {explanation ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                <span className="text-xs font-bold text-purple-600 dark:text-purple-400 uppercase">
                  Concept Breakdown: {topic}
                </span>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleCopy}
                    className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-medium flex items-center gap-1"
                  >
                    {isCopied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                  </button>
                  <button
                    onClick={handleConvertFlashcard}
                    className="px-2.5 py-1.5 rounded-xl bg-violet-50 dark:bg-violet-950 text-violet-700 dark:text-violet-300 text-xs font-semibold flex items-center gap-1"
                  >
                    <Layers className="w-3.5 h-3.5" />
                    <span>Card</span>
                  </button>
                  <button
                    onClick={handleSaveToNotes}
                    className="px-2.5 py-1.5 rounded-xl bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 text-xs font-semibold flex items-center gap-1"
                  >
                    <BookmarkPlus className="w-3.5 h-3.5" />
                    <span>Save</span>
                  </button>
                </div>
              </div>

              <div className="max-h-[380px] overflow-y-auto pr-2">
                <MarkdownRenderer content={explanation} />
              </div>

              {/* Explain Again Interactive Action Ribbon */}
              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-2">
                <p className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                  <RotateCcw className="w-3.5 h-3.5 text-indigo-500" />
                  <span>Explain Again Options:</span>
                </p>
                <div className="flex items-center gap-2 flex-wrap">
                  {explainAgainOptions.map((opt) => {
                    const Icon = opt.icon;
                    return (
                      <button
                        key={opt.type}
                        onClick={() => handleExplain(opt.type)}
                        disabled={isLoading}
                        className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-indigo-50 dark:hover:bg-indigo-950 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1.5 transition-all active:scale-95 disabled:opacity-50"
                      >
                        <Icon className={`w-3.5 h-3.5 ${opt.color}`} />
                        <span>{opt.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center text-center p-8 m-auto">
              <div className="w-12 h-12 rounded-xl bg-purple-50 dark:bg-purple-950/50 text-purple-600 dark:text-purple-400 flex items-center justify-center mb-3">
                <BookMarked className="w-6 h-6" />
              </div>
              <h4 className="text-base font-bold text-slate-900 dark:text-white">
                Concept Tutor Ready
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mt-1">
                Enter any challenging topic to generate a crystal-clear explanation, or test your comprehension with interactive follow-up prompts.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
