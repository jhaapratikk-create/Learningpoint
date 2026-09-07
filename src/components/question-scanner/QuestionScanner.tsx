import React, { useState } from "react";
import {
  Camera,
  Upload,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  BookmarkPlus,
  RefreshCw,
  Eye,
  HelpCircle,
} from "lucide-react";
import { useStudy } from "../../context/StudyContext";
import { apiService } from "../../services/api";
import { MarkdownRenderer } from "../common/MarkdownRenderer";

export const QuestionScanner: React.FC = () => {
  const { addNote, subjects, addToast, triggerConfetti } = useStudy();

  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [textHint, setTextHint] = useState("");
  const [selectedModel, setSelectedModel] = useState("gemini-3.1-flash-lite");
  const [isLoading, setIsLoading] = useState(false);
  const [scanResult, setScanResult] = useState<{
    transcribedQuestion: string;
    subject: string;
    difficulty: string;
    stepByStepSolution: string;
    finalAnswer: string;
    keyConceptsUsed: string[];
    disclaimer: string;
  } | null>(null);

  const handleImageUpload = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      setImagePreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleScanAndSolve = async () => {
    if (!imagePreview && !textHint.trim()) {
      addToast("Please upload an image or type the question hint", undefined, "warning");
      return;
    }

    setIsLoading(true);
    try {
      const base64Data = imagePreview ? imagePreview.split(",")[1] || imagePreview : "";
      const result = await apiService.scanQuestion({
        imageBase64: base64Data,
        mimeType: "image/jpeg",
        textHint: textHint || undefined,
        model: selectedModel,
      });

      setScanResult(result);
      triggerConfetti();
      addToast("Question Transcribed & Solved with Step-by-Step Proof! 📷");
    } catch (e) {
      addToast("Failed to scan question", undefined, "error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveToNotes = () => {
    if (!scanResult) return;
    addNote({
      title: `Scanned Question: ${scanResult.transcribedQuestion.slice(0, 35)}`,
      content: `### 📷 Scanned Problem\n${scanResult.transcribedQuestion}\n\n**Subject:** ${scanResult.subject} • **Difficulty:** ${scanResult.difficulty}\n\n${scanResult.stepByStepSolution}\n\n### 🎯 Final Answer\n**${scanResult.finalAnswer}**\n\n*Key Concepts: ${scanResult.keyConceptsUsed.join(", ")}*`,
      subjectId: subjects[0]?.id || "sub_1",
      chapterId: "chap_1",
      tags: ["Scanned Question", "OCR"],
      isFavorite: false,
    });
    addToast("Saved to My Notes! 📝");
  };

  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-pink-50 dark:bg-pink-950/50 text-pink-700 dark:text-pink-300 text-xs font-semibold border border-pink-200/60 dark:border-pink-800/40 mb-2">
            <Camera className="w-3.5 h-3.5" />
            <span>Multimodal Vision OCR</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            AI Question & Image Scanner
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Snap or upload textbook questions, homework worksheets, or diagrams for immediate transcription and solution.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-white dark:bg-slate-900 p-1.5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs shrink-0">
          <span className="text-[11px] font-bold text-slate-400 px-2 uppercase">AI Model:</span>
          <select
            value={selectedModel}
            onChange={(e) => setSelectedModel(e.target.value)}
            className="text-xs font-semibold bg-pink-50 dark:bg-pink-950/80 text-pink-700 dark:text-pink-300 px-3 py-1.5 rounded-xl border-0 focus:outline-none cursor-pointer"
          >
            <option value="gemini-3.8-flash">⚡ Gemini 3.8 Flash (Ultra-Fast Vision)</option>
            <option value="gemini-3.1-pro-preview">🧠 Gemini 3.1 Pro (Deep STEM Reasoning)</option>
            <option value="gemini-3.1-flash-lite">🚀 Gemini 3.1 Flash-Lite (Instant)</option>
            <option value="gemini-flash-latest">🌐 Gemini Flash Latest (Adaptive)</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Scanner Input Panel */}
        <div className="lg:col-span-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 sm:p-6 shadow-xs space-y-4">
          {/* Image Drop Zone */}
          <div
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault();
              if (e.dataTransfer.files?.[0]) handleImageUpload(e.dataTransfer.files[0]);
            }}
            onClick={() => {
              const input = document.createElement("input");
              input.type = "file";
              input.accept = "image/*";
              input.onchange = (e: any) => {
                if (e.target.files?.[0]) handleImageUpload(e.target.files[0]);
              };
              input.click();
            }}
            className="border-2 border-dashed border-slate-250 dark:border-slate-700 hover:border-pink-500 rounded-2xl p-6 text-center bg-slate-50/50 dark:bg-slate-850/50 cursor-pointer transition-colors"
          >
            {imagePreview ? (
              <div className="space-y-3">
                <img
                  src={imagePreview}
                  alt="Scanned preview"
                  className="max-h-48 rounded-xl mx-auto object-contain shadow-sm"
                />
                <p className="text-xs font-semibold text-pink-600 dark:text-pink-400">
                  Click to replace image
                </p>
              </div>
            ) : (
              <div>
                <div className="w-12 h-12 rounded-xl bg-pink-50 dark:bg-pink-950/60 text-pink-600 dark:text-pink-400 flex items-center justify-center mx-auto mb-2">
                  <Camera className="w-6 h-6" />
                </div>
                <p className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200">
                  Upload or Take Photo of Problem
                </p>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Supports PNG, JPG, JPEG, or Mobile Screenshots
                </p>
              </div>
            )}
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
              Optional Question Hint / Clarification
            </label>
            <input
              type="text"
              value={textHint}
              onChange={(e) => setTextHint(e.target.value)}
              placeholder="e.g. Find acceleration in part (b), or solve with SI units..."
              className="w-full px-3.5 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-250 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none"
            />
          </div>

          <button
            onClick={handleScanAndSolve}
            disabled={(!imagePreview && !textHint.trim()) || isLoading}
            className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white text-xs sm:text-sm font-semibold shadow-sm transition-all flex items-center justify-center gap-2 active:scale-95"
          >
            <Sparkles className="w-4 h-4" />
            <span>{isLoading ? "Reading Image & Solving with AI..." : "Transcribe & Solve Question"}</span>
          </button>
        </div>

        {/* Scan Results Panel */}
        <div className="lg:col-span-7 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 sm:p-6 shadow-xs flex flex-col justify-between min-h-[440px]">
          {scanResult ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-pink-100 dark:bg-pink-950 text-pink-700 dark:text-pink-300">
                    {scanResult.subject}
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-350">
                    {scanResult.difficulty}
                  </span>
                </div>

                <button
                  onClick={handleSaveToNotes}
                  className="px-3 py-1.5 rounded-xl bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 text-xs font-semibold flex items-center gap-1.5"
                >
                  <BookmarkPlus className="w-3.5 h-3.5" />
                  <span>Save to Notes</span>
                </button>
              </div>

              {/* Transcribed Problem Box */}
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700 space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Transcribed Question
                </span>
                <p className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-white leading-relaxed">
                  {scanResult.transcribedQuestion}
                </p>
              </div>

              {/* Step by step solution */}
              <div className="max-h-[250px] overflow-y-auto pr-2 space-y-2">
                <MarkdownRenderer content={scanResult.stepByStepSolution} />
              </div>

              {/* Final Answer */}
              <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-300 dark:border-emerald-800 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-300">
                    Evaluated Final Result
                  </span>
                  <h4 className="text-sm sm:text-base font-extrabold text-emerald-900 dark:text-emerald-100">
                    {scanResult.finalAnswer}
                  </h4>
                </div>
                <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
              </div>

              {/* Disclaimer */}
              <p className="text-[10px] text-slate-400 italic">
                ⚠️ {scanResult.disclaimer}
              </p>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center text-center p-8 m-auto">
              <div className="w-12 h-12 rounded-xl bg-pink-50 dark:bg-pink-950/50 text-pink-600 dark:text-pink-400 flex items-center justify-center mb-3">
                <Camera className="w-6 h-6" />
              </div>
              <h4 className="text-base font-bold text-slate-900 dark:text-white">
                Scanner Solution Engine Ready
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mt-1">
                Upload any math diagram, chemistry equation, or textbook question to receive an instant transcription and step-by-step breakdown.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
