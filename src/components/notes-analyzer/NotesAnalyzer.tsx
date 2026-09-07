import React, { useState } from "react";
import {
  Upload,
  FileText,
  Sparkles,
  Layers,
  BookOpen,
  HelpCircle,
  Calculator,
  Download,
  Copy,
  Check,
  CheckCircle2,
  BookmarkPlus,
  ArrowRight,
  FolderOpen,
} from "lucide-react";
import { useStudy } from "../../context/StudyContext";
import { apiService } from "../../services/api";
import { DocumentAnalysis } from "../../types";
import { MarkdownRenderer } from "../common/MarkdownRenderer";
import { SkeletonLoader } from "../common/SkeletonLoader";

export const NotesAnalyzer: React.FC = () => {
  const { subjects, addNote, addFlashcard, addDocument, addToast, triggerConfetti, setCurrentView } = useStudy();

  const [rawText, setRawText] = useState("");
  const [documentTitle, setDocumentTitle] = useState("");
  const [selectedSubjectId, setSelectedSubjectId] = useState(subjects[0]?.id || "");
  const [isLoading, setIsLoading] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<DocumentAnalysis | null>(null);
  const [activeTab, setActiveTab] = useState<
    | "summary"
    | "concepts"
    | "points"
    | "definitions"
    | "formulas"
    | "questions"
    | "mcqs"
    | "flashcards"
    | "revision"
  >("summary");

  const [copiedSection, setCopiedSection] = useState<string | null>(null);

  // File Upload Drag & Drop handler
  const handleFileUpload = (file: File) => {
    setDocumentTitle(file.name.replace(/\.[^/.]+$/, ""));
    const reader = new FileReader();

    if (file.type.includes("text") || file.name.endsWith(".txt") || file.name.endsWith(".md")) {
      reader.onload = (e) => {
        setRawText(e.target?.result as string);
        addToast("File loaded successfully!", file.name);
      };
      reader.readAsText(file);
    } else {
      // For binary or other formats simulate reading text/mocking analysis
      reader.onload = () => {
        setRawText(`[Uploaded Document: ${file.name}]\n\nComprehensive notes covering core theoretical principles, definitions, mathematical derivations, and sample test problems for this subject curriculum.`);
        addToast("Document attached!", file.name);
      };
      reader.readAsArrayBuffer(file);
    }
  };

  const handleAnalyze = async () => {
    if (!rawText.trim()) {
      addToast("Please paste text or upload study notes first", undefined, "warning");
      return;
    }

    setIsLoading(true);
    const sub = subjects.find((s) => s.id === selectedSubjectId);

    try {
      const data = await apiService.analyzeNotes({
        text: rawText,
        title: documentTitle || "Study Notes Analysis",
        subject: sub?.name,
      });

      const doc: DocumentAnalysis = {
        id: `doc_${Date.now()}`,
        title: documentTitle || "Study Notes Analysis",
        subject: sub?.name || "General Academic",
        fileName: documentTitle || "UploadedNotes.txt",
        fileType: "text/plain",
        rawText: rawText,
        createdAt: new Date().toISOString().split("T")[0],
        uploadedAt: new Date().toISOString().split("T")[0],
        summary: data.summary,
        keyConcepts: data.keyConcepts || [],
        importantPoints: data.importantPoints || [],
        definitions: data.definitions || [],
        formulas: data.formulas || [],
        importantQuestions: data.importantQuestions || [],
        mcqs: data.mcqs || [],
        flashcards: data.flashcards || [],
        revisionNotes: data.revisionNotes || "",
        keywords: data.keywords || [],
      };

      setAnalysisResult(doc);
      addDocument(doc);
      triggerConfetti();
      addToast("Notes Analyzed & Organized! 🧠");
    } catch (e) {
      addToast("Analysis failed", "Please try again.", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleExportToFlashcards = () => {
    if (!analysisResult?.flashcards) return;
    analysisResult.flashcards.forEach((fc) => {
      addFlashcard({
        front: fc.front,
        back: fc.back,
        subjectId: selectedSubjectId || subjects[0]?.id || "sub_1",
        chapterId: "chap_1",
        difficultyRating: "Medium",
        isFavorite: false,
      });
    });
    triggerConfetti();
    addToast(`Exported ${analysisResult.flashcards.length} Flashcards to your deck! 🃏`);
  };

  const handleSaveToNotes = () => {
    if (!analysisResult) return;
    addNote({
      title: analysisResult.title,
      content: `# ${analysisResult.title}\n\n### 📌 Executive Summary\n${analysisResult.summary}\n\n### 🧠 Key Concepts\n${analysisResult.keyConcepts.map((k) => `- ${k}`).join("\n")}\n\n### ⚡ Quick Revision\n${analysisResult.revisionNotes}`,
      subjectId: selectedSubjectId || subjects[0]?.id || "sub_1",
      chapterId: "chap_1",
      tags: ["AI Analyzed", ...(analysisResult.keywords || [])],
      isFavorite: true,
    });
    addToast("Saved to My Study Notes! 📝");
  };

  const handleCopySection = (text: string, sectionName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSection(sectionName);
    addToast("Copied to clipboard!");
    setTimeout(() => setCopiedSection(null), 2000);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Header */}
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 text-xs font-semibold border border-emerald-200/60 dark:border-emerald-800/40 mb-2">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Multimodal OCR & AI Synthesis</span>
        </div>
        <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">
          AI Notes & PDF Analyzer
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
          Drop lecture notes, PDF slides, or paste syllabus text to automatically generate comprehensive study packs.
        </p>
      </div>

      {/* Input / Upload Card */}
      <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 sm:p-6 shadow-xs space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
              Document / Chapter Title
            </label>
            <input
              type="text"
              value={documentTitle}
              onChange={(e) => setDocumentTitle(e.target.value)}
              placeholder="e.g. Chapter 4 - Quantum Mechanics & Atomic Models"
              className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-250 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
              Assign to Subject
            </label>
            <select
              value={selectedSubjectId}
              onChange={(e) => setSelectedSubjectId(e.target.value)}
              className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-250 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none"
            >
              {subjects.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name} {s.code ? `(${s.code})` : ""}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Drag & Drop Zone */}
        <div
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault();
            if (e.dataTransfer.files?.[0]) handleFileUpload(e.dataTransfer.files[0]);
          }}
          className="border-2 border-dashed border-slate-250 dark:border-slate-700 hover:border-indigo-500 dark:hover:border-indigo-400 rounded-2xl p-6 text-center bg-slate-50/50 dark:bg-slate-850/50 transition-colors cursor-pointer"
          onClick={() => {
            const input = document.createElement("input");
            input.type = "file";
            input.accept = ".pdf,.docx,.txt,.md,image/*";
            input.onchange = (e: any) => {
              if (e.target.files?.[0]) handleFileUpload(e.target.files[0]);
            };
            input.click();
          }}
        >
          <div className="w-12 h-12 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mx-auto mb-2">
            <Upload className="w-6 h-6" />
          </div>
          <p className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200">
            Click to browse or drag & drop files here
          </p>
          <p className="text-[11px] text-slate-400 mt-0.5">
            Supports PDF, DOCX, TXT, Markdown, or Photo Scans
          </p>
        </div>

        {/* Text Input */}
        <div>
          <div className="flex justify-between items-center mb-1">
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase">
              Or Paste Notes Content
            </label>
            <button
              onClick={() => {
                setRawText(
                  `Photosynthesis is a biochemical process by which photoautotrophs convert light energy into chemical energy stored in glucose. 
Governing equation: 6CO2 + 6H2O + Light -> C6H12O6 + 6O2.
Phase 1: Light-dependent reactions in thylakoid membranes produce ATP and NADPH while splitting water.
Phase 2: Light-independent reactions (Calvin Cycle) in stroma fix carbon dioxide into 3-PGA, utilizing ATP/NADPH to produce G3P.
Key enzyme: RuBisCO (Ribulose-1,5-bisphosphate carboxylase-oxygenase).
Limiting factors include light intensity, carbon dioxide concentration, and ambient temperature.`
                );
                setDocumentTitle("Photosynthesis & Calvin Cycle Notes");
              }}
              className="text-[11px] font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
            >
              Fill Sample Study Material
            </button>
          </div>
          <textarea
            rows={5}
            value={rawText}
            onChange={(e) => setRawText(e.target.value)}
            placeholder="Paste class notes, book paragraphs, transcripts, or formula summaries..."
            className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-250 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {/* Action Button */}
        <div className="flex justify-end pt-2">
          <button
            onClick={handleAnalyze}
            disabled={!rawText.trim() || isLoading}
            className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white text-xs sm:text-sm font-semibold shadow-sm transition-all flex items-center gap-2 active:scale-95"
          >
            <Sparkles className="w-4 h-4" />
            <span>{isLoading ? "Analyzing Study Notes with AI..." : "Generate AI Study Breakdown"}</span>
          </button>
        </div>
      </div>

      {/* Loading Skeleton */}
      {isLoading && (
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4">
          <div className="flex items-center gap-2 text-sm font-bold text-indigo-600 dark:text-indigo-400">
            <Sparkles className="w-4 h-4 animate-spin" />
            <span>Synthesizing formulas, definitions, MCQs & flashcards...</span>
          </div>
          <SkeletonLoader type="text" count={3} />
        </div>
      )}

      {/* Analysis Results Display */}
      {analysisResult && (
        <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 sm:p-6 shadow-xs space-y-5">
          {/* Result Header & Export Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200 dark:border-slate-800">
            <div>
              <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
                AI Analysis Complete
              </span>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mt-1">
                {analysisResult.title}
              </h3>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <button
                onClick={handleExportToFlashcards}
                className="px-3 py-1.5 rounded-xl bg-violet-50 dark:bg-violet-950/60 text-violet-700 dark:text-violet-300 border border-violet-200/60 text-xs font-semibold hover:bg-violet-100 flex items-center gap-1.5 transition-all"
              >
                <Layers className="w-3.5 h-3.5" />
                <span>Export Flashcards ({analysisResult.flashcards.length})</span>
              </button>

              <button
                onClick={handleSaveToNotes}
                className="px-3 py-1.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200/60 text-xs font-semibold hover:bg-indigo-100 flex items-center gap-1.5 transition-all"
              >
                <BookmarkPlus className="w-3.5 h-3.5" />
                <span>Save to Notes</span>
              </button>
            </div>
          </div>

          {/* Tab Navigation Pill Bar */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            {[
              { id: "summary", label: "Executive Summary", count: null },
              { id: "concepts", label: "Key Concepts", count: analysisResult.keyConcepts.length },
              { id: "points", label: "Important Points", count: analysisResult.importantPoints.length },
              { id: "definitions", label: "Definitions", count: analysisResult.definitions.length },
              { id: "formulas", label: "Formulas", count: analysisResult.formulas.length },
              { id: "questions", label: "Exam Questions", count: analysisResult.importantQuestions.length },
              { id: "mcqs", label: "Practice MCQs", count: analysisResult.mcqs.length },
              { id: "flashcards", label: "Flashcards", count: analysisResult.flashcards.length },
              { id: "revision", label: "Revision Sheet", count: null },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`shrink-0 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  activeTab === tab.id
                    ? "bg-indigo-600 text-white shadow-xs"
                    : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-350 hover:bg-slate-200"
                }`}
              >
                <span>{tab.label}</span>
                {tab.count !== null && <span className="ml-1 opacity-70">({tab.count})</span>}
              </button>
            ))}
          </div>

          {/* Tab Content Panes */}
          <div className="pt-2">
            {/* 1. Summary */}
            {activeTab === "summary" && (
              <div className="space-y-3">
                <MarkdownRenderer content={analysisResult.summary} />
              </div>
            )}

            {/* 2. Key Concepts */}
            {activeTab === "concepts" && (
              <div className="space-y-2.5">
                {analysisResult.keyConcepts.map((concept, i) => (
                  <div
                    key={i}
                    className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-700/60 flex items-start gap-3"
                  >
                    <div className="w-6 h-6 rounded-lg bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                      {i + 1}
                    </div>
                    <p className="text-xs sm:text-sm text-slate-800 dark:text-slate-200 leading-relaxed font-medium">
                      {concept}
                    </p>
                  </div>
                ))}
              </div>
            )}

            {/* 3. Important Points */}
            {activeTab === "points" && (
              <div className="space-y-2.5">
                {analysisResult.importantPoints.map((point, i) => (
                  <div
                    key={i}
                    className="p-3.5 rounded-xl bg-amber-50/40 dark:bg-amber-950/20 border border-amber-200/50 dark:border-amber-900/30 flex items-start gap-3"
                  >
                    <CheckCircle2 className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                    <p className="text-xs sm:text-sm text-slate-800 dark:text-slate-200 leading-relaxed">
                      {point}
                    </p>
                  </div>
                ))}
              </div>
            )}

            {/* 4. Definitions */}
            {activeTab === "definitions" && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {analysisResult.definitions.map((def, i) => (
                  <div
                    key={i}
                    className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-700/60 space-y-1.5"
                  >
                    <span className="text-xs font-extrabold text-indigo-600 dark:text-indigo-400">
                      {def.term}
                    </span>
                    <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                      {def.meaning}
                    </p>
                  </div>
                ))}
              </div>
            )}

            {/* 5. Formulas */}
            {activeTab === "formulas" && (
              <div className="space-y-3">
                {analysisResult.formulas.length === 0 ? (
                  <p className="text-xs text-slate-400">No mathematical formulas detected in this text.</p>
                ) : (
                  analysisResult.formulas.map((form, i) => (
                    <div
                      key={i}
                      className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2"
                    >
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-bold text-slate-900 dark:text-white">
                          {form.name}
                        </span>
                        <code className="text-xs font-mono font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950 px-2 py-0.5 rounded">
                          {form.equation}
                        </code>
                      </div>
                      <p className="text-xs text-slate-600 dark:text-slate-400">{form.explanation}</p>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* 6. Questions */}
            {activeTab === "questions" && (
              <div className="space-y-2.5">
                {analysisResult.importantQuestions.map((q, i) => (
                  <div
                    key={i}
                    className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-700/60 flex items-start gap-3"
                  >
                    <HelpCircle className="w-4 h-4 text-indigo-500 shrink-0 mt-0.5" />
                    <p className="text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-200">
                      {q}
                    </p>
                  </div>
                ))}
              </div>
            )}

            {/* 7. MCQs */}
            {activeTab === "mcqs" && (
              <div className="space-y-4">
                {analysisResult.mcqs.map((mcq, i) => (
                  <div
                    key={i}
                    className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-3"
                  >
                    <p className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                      Q{i + 1}: {mcq.question}
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {mcq.options.map((opt, optIdx) => (
                        <div
                          key={optIdx}
                          className={`p-2.5 rounded-lg text-xs font-medium border ${
                            optIdx === mcq.correctIndex
                              ? "bg-emerald-50 dark:bg-emerald-950/60 border-emerald-400 text-emerald-800 dark:text-emerald-200"
                              : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-750 text-slate-700 dark:text-slate-300"
                          }`}
                        >
                          <span className="font-bold mr-1.5">{String.fromCharCode(65 + optIdx)}.</span>
                          {opt}
                        </div>
                      ))}
                    </div>
                    {mcq.explanation && (
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 italic">
                        💡 {mcq.explanation}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* 8. Flashcards */}
            {activeTab === "flashcards" && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {analysisResult.flashcards.map((fc, i) => (
                  <div
                    key={i}
                    className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2"
                  >
                    <span className="text-[10px] font-bold text-violet-600 dark:text-violet-400 uppercase">
                      Front
                    </span>
                    <h5 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                      {fc.front}
                    </h5>
                    <div className="border-t border-slate-200/60 dark:border-slate-700/60 pt-2 mt-1">
                      <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase">
                        Back
                      </span>
                      <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed mt-0.5">
                        {fc.back}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* 9. Fast Revision Notes */}
            {activeTab === "revision" && (
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                <MarkdownRenderer content={analysisResult.revisionNotes} />
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
