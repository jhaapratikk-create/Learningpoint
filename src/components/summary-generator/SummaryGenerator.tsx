import React, { useState } from "react";
import { Sparkles, Copy, Check, BookmarkPlus, Download, Globe, FileText, ArrowRight } from "lucide-react";
import { useStudy } from "../../context/StudyContext";
import { apiService } from "../../services/api";
import { MarkdownRenderer } from "../common/MarkdownRenderer";

export const SummaryGenerator: React.FC = () => {
  const { subjects, addNote, addToast } = useStudy();

  const [topic, setTopic] = useState("");
  const [content, setContent] = useState("");
  const [length, setLength] = useState<"very-short" | "short" | "medium" | "detailed">("medium");
  const [difficulty, setDifficulty] = useState<"beginner" | "standard" | "advanced">("standard");
  const [language, setLanguage] = useState("English");
  const [summaryResult, setSummaryResult] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  const handleGenerateSummary = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim()) return;

    setIsLoading(true);
    try {
      const res = await apiService.summarize({
        topic,
        content: content || undefined,
        length,
        difficulty,
        preferredLanguage: language,
      });
      setSummaryResult(res.text);
      addToast("Summary generated! ⚡");
    } catch (e) {
      addToast("Failed to generate summary", undefined, "error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveToNotes = () => {
    if (!summaryResult) return;
    addNote({
      title: `Summary: ${topic}`,
      content: summaryResult,
      subjectId: subjects[0]?.id || "sub_1",
      chapterId: "chap_1",
      tags: ["Summary", length, difficulty],
      isFavorite: false,
    });
    addToast("Summary saved to My Notes! 📝");
  };

  const handleCopy = () => {
    if (!summaryResult) return;
    navigator.clipboard.writeText(summaryResult);
    setIsCopied(true);
    addToast("Copied to clipboard!");
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div className="space-y-6 pb-12">
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-300 text-xs font-semibold border border-indigo-200/60 dark:border-indigo-800/40 mb-2">
          <Sparkles className="w-3.5 h-3.5" />
          <span>High-Yield Retention Engine</span>
        </div>
        <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">
          AI Summary & Revision Generator
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
          Generate structured, high-density study sheets and executive summaries in multiple lengths.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Controls Form (5 cols) */}
        <div className="lg:col-span-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 sm:p-6 shadow-xs space-y-4">
          <form onSubmit={handleGenerateSummary} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                Topic or Chapter Name *
              </label>
              <input
                type="text"
                required
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="e.g. Electromagnetic Induction, French Revolution, Organic Reactions"
                className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-250 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                  Summary Length
                </label>
                <select
                  value={length}
                  onChange={(e) => setLength(e.target.value as any)}
                  className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-250 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none"
                >
                  <option value="very-short">Very Short (1-Minute Quick)</option>
                  <option value="short">Short (Key Bullets)</option>
                  <option value="medium">Medium (Standard Notes)</option>
                  <option value="detailed">Detailed (Comprehensive)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                  Academic Depth
                </label>
                <select
                  value={difficulty}
                  onChange={(e) => setDifficulty(e.target.value as any)}
                  className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-250 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none"
                >
                  <option value="beginner">Beginner / Middle School</option>
                  <option value="standard">High School / Standard</option>
                  <option value="advanced">College / Competitive Exam</option>
                </select>
              </div>
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
                <option value="German">German (Deutsch)</option>
                <option value="Hindi">Hindi (हिंदी)</option>
                <option value="Chinese">Mandarin (中文)</option>
                <option value="Arabic">Arabic (العربية)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                Optional Raw Content / Notes Excerpt
              </label>
              <textarea
                rows={4}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Paste specific textbook pages or lecture transcripts to constrain the summary..."
                className="w-full px-3.5 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-250 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={!topic.trim() || isLoading}
              className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white text-xs sm:text-sm font-semibold shadow-sm transition-all flex items-center justify-center gap-2 active:scale-95"
            >
              <Sparkles className="w-4 h-4" />
              <span>{isLoading ? "Generating Summary..." : "Generate AI Summary Sheet"}</span>
            </button>
          </form>
        </div>

        {/* Summary Output (7 cols) */}
        <div className="lg:col-span-7 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 sm:p-6 shadow-xs flex flex-col justify-between min-h-[400px]">
          {summaryResult ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase">
                  {length} • {difficulty} • {language}
                </span>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleCopy}
                    className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-medium flex items-center gap-1"
                  >
                    {isCopied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                    <span>{isCopied ? "Copied" : "Copy"}</span>
                  </button>

                  <button
                    onClick={handleSaveToNotes}
                    className="px-3 py-1.5 rounded-xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 text-xs font-semibold flex items-center gap-1.5"
                  >
                    <BookmarkPlus className="w-3.5 h-3.5" />
                    <span>Save Note</span>
                  </button>
                </div>
              </div>

              <div className="max-h-[500px] overflow-y-auto pr-2">
                <MarkdownRenderer content={summaryResult} />
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center text-center p-8 m-auto">
              <div className="w-12 h-12 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-3">
                <FileText className="w-6 h-6" />
              </div>
              <h4 className="text-base font-bold text-slate-900 dark:text-white">Summary Preview Ready</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mt-1">
                Enter any topic or paste lecture text on the left to produce a structured revision sheet with key formulas, core concepts, and high-yield exam takeaways.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
