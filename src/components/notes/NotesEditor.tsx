import React, { useState } from "react";
import {
  FileText,
  Plus,
  Trash2,
  Bookmark,
  Sparkles,
  Copy,
  Check,
  Search,
  Eye,
  Edit3,
  Download,
  Share2,
  BookOpen,
  HelpCircle,
  Tag,
} from "lucide-react";
import { useStudy } from "../../context/StudyContext";
import { Note } from "../../types";
import { MarkdownRenderer } from "../common/MarkdownRenderer";
import { apiService } from "../../services/api";

export const NotesEditor: React.FC = () => {
  const {
    notes,
    addNote,
    updateNote,
    deleteNote,
    activeNoteId,
    setActiveNoteId,
    subjects,
    addToast,
    triggerConfetti,
  } = useStudy();

  const currentNote = notes.find((n) => n.id === activeNoteId) || notes[0];

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>("all");
  const [viewMode, setViewMode] = useState<"edit" | "preview" | "split">("split");
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  const filteredNotes = notes.filter((n) => {
    if (selectedSubjectId !== "all" && n.subjectId !== selectedSubjectId) return false;
    if (
      searchQuery &&
      !n.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !n.content.toLowerCase().includes(searchQuery.toLowerCase())
    ) {
      return false;
    }
    return true;
  });

  const handleCreateNewNote = () => {
    const newNoteId = addNote({
      title: "Untitled Study Note",
      content: "# Untitled Note\n\nStart typing key concepts, equations, and lecture notes here...",
      subjectId: selectedSubjectId !== "all" ? selectedSubjectId : subjects[0]?.id || "sub_1",
      chapterId: "chap_1",
      tags: ["Study"],
      isFavorite: false,
    });
    setActiveNoteId(newNoteId);
    addToast("New note created! 📝");
  };

  const handleAiRefine = async (action: "summarize" | "expand" | "questions") => {
    if (!currentNote) return;
    setIsAiLoading(true);

    try {
      if (action === "summarize") {
        const res = await apiService.summarize({
          topic: currentNote.title,
          content: currentNote.content,
          length: "short",
        });
        updateNote(currentNote.id, {
          content: `${currentNote.content}\n\n### ⚡ AI Executive Summary\n${res.text}`,
        });
        addToast("Summary appended to note! ⚡");
      } else if (action === "expand") {
        const res = await apiService.explainConcept({
          topic: currentNote.title,
          style: "Deep Academic",
        });
        updateNote(currentNote.id, {
          content: `${currentNote.content}\n\n### 🧠 Detailed Explanation\n${res.text}`,
        });
        addToast("Explanation appended! 💡");
      } else if (action === "questions") {
        const questions = await apiService.generateQuestions({
          topic: currentNote.title,
          questionType: "MCQ",
          count: 3,
        });
        const qText = questions
          .map(
            (q: any, i: number) =>
              `**Q${i + 1}:** ${q.question}\n- Correct Answer: ${q.correctAnswer}\n*Reason:* ${q.explanation}`
          )
          .join("\n\n");
        updateNote(currentNote.id, {
          content: `${currentNote.content}\n\n### ❓ Practice Questions\n${qText}`,
        });
        triggerConfetti();
        addToast("Practice questions generated! ❓");
      }
    } catch (e) {
      addToast("AI action failed", undefined, "error");
    } finally {
      setIsAiLoading(false);
    }
  };

  const handleCopyNote = () => {
    if (!currentNote) return;
    navigator.clipboard.writeText(currentNote.content);
    setIsCopied(true);
    addToast("Note copied to clipboard!");
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Smart Notes & Study Sheets
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Organize revision sheets with Markdown support, LaTeX math rendering, and AI enhancement.
          </p>
        </div>

        <button
          onClick={handleCreateNewNote}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs sm:text-sm font-semibold shadow-sm transition-all active:scale-95 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>New Note</span>
        </button>
      </div>

      {/* Editor & Notes Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Notes List (4 cols) */}
        <div className="lg:col-span-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 shadow-xs space-y-3">
          {/* Search & Subject Filter */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search notes..."
              className="w-full pl-8 pr-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-250 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none"
            />
          </div>

          <select
            value={selectedSubjectId}
            onChange={(e) => setSelectedSubjectId(e.target.value)}
            className="w-full px-3 py-1.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-250 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none"
          >
            <option value="all">All Subjects ({notes.length})</option>
            {subjects.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>

          {/* Notes List Scroller */}
          <div className="max-h-[560px] overflow-y-auto space-y-2 pr-1">
            {filteredNotes.length === 0 ? (
              <p className="text-xs text-slate-400 text-center py-6">No notes found.</p>
            ) : (
              filteredNotes.map((note) => {
                const isSelected = currentNote?.id === note.id;
                const sub = subjects.find((s) => s.id === note.subjectId);

                return (
                  <div
                    key={note.id}
                    onClick={() => setActiveNoteId(note.id)}
                    className={`p-3.5 rounded-xl border cursor-pointer transition-all space-y-1.5 ${
                      isSelected
                        ? "bg-indigo-50/80 dark:bg-indigo-950/60 border-indigo-500 shadow-xs"
                        : "bg-slate-50/50 dark:bg-slate-850/40 border-slate-200/80 dark:border-slate-800 hover:border-slate-300"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <span
                          className="w-2 h-2 rounded-full"
                          style={{ backgroundColor: sub?.color || "#6366f1" }}
                        />
                        <span className="text-[10px] font-bold text-slate-500 truncate max-w-[120px]">
                          {sub?.name || "General"}
                        </span>
                      </div>

                      <div className="flex items-center gap-1">
                        {note.isFavorite && (
                          <span className="text-amber-500 text-xs">★</span>
                        )}
                        <span className="text-[10px] text-slate-400">{note.updatedAt}</span>
                      </div>
                    </div>

                    <h4
                      className={`text-xs sm:text-sm font-bold truncate ${
                        isSelected
                          ? "text-indigo-950 dark:text-indigo-100"
                          : "text-slate-900 dark:text-white"
                      }`}
                    >
                      {note.title}
                    </h4>

                    <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                      {note.content.replace(/[#*`]/g, "")}
                    </p>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right Column: Note Editor & Split Screen (8 cols) */}
        {currentNote ? (
          <div className="lg:col-span-8 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 sm:p-6 shadow-xs space-y-4">
            {/* Note Title & Action Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
              <input
                type="text"
                value={currentNote.title}
                onChange={(e) => updateNote(currentNote.id, { title: e.target.value })}
                placeholder="Note Title..."
                className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white bg-transparent border-none focus:outline-none focus:ring-0 w-full"
              />

              <div className="flex items-center gap-1.5 shrink-0">
                {/* View Mode Switcher */}
                <div className="p-1 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center gap-0.5">
                  <button
                    onClick={() => setViewMode("edit")}
                    className={`p-1.5 rounded-lg text-xs font-semibold ${
                      viewMode === "edit"
                        ? "bg-white dark:bg-slate-900 text-indigo-600 shadow-xs"
                        : "text-slate-500"
                    }`}
                    title="Editor Only"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => setViewMode("split")}
                    className={`p-1.5 rounded-lg text-xs font-semibold ${
                      viewMode === "split"
                        ? "bg-white dark:bg-slate-900 text-indigo-600 shadow-xs"
                        : "text-slate-500"
                    }`}
                    title="Split Mode"
                  >
                    <BookOpen className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => setViewMode("preview")}
                    className={`p-1.5 rounded-lg text-xs font-semibold ${
                      viewMode === "preview"
                        ? "bg-white dark:bg-slate-900 text-indigo-600 shadow-xs"
                        : "text-slate-500"
                    }`}
                    title="Preview Only"
                  >
                    <Eye className="w-3.5 h-3.5" />
                  </button>
                </div>

                <button
                  onClick={() =>
                    updateNote(currentNote.id, { isFavorite: !currentNote.isFavorite })
                  }
                  className={`p-2 rounded-xl text-xs ${
                    currentNote.isFavorite
                      ? "text-amber-500 bg-amber-50 dark:bg-amber-950/60"
                      : "text-slate-400 hover:bg-slate-100"
                  }`}
                  title="Favorite Note"
                >
                  <Bookmark className="w-4 h-4" />
                </button>

                <button
                  onClick={handleCopyNote}
                  className="p-2 rounded-xl text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs"
                  title="Copy Note"
                >
                  {isCopied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                </button>

                {notes.length > 1 && (
                  <button
                    onClick={() => deleteNote(currentNote.id)}
                    className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950 text-xs"
                    title="Delete Note"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

            {/* Subject Selector & AI Prompt Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
              <div className="flex items-center gap-2">
                <span className="text-slate-400 font-bold uppercase text-[10px]">Subject:</span>
                <select
                  value={currentNote.subjectId}
                  onChange={(e) => updateNote(currentNote.id, { subjectId: e.target.value })}
                  className="px-2.5 py-1 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-250 dark:border-slate-700 text-slate-800 dark:text-slate-200 focus:outline-none font-semibold text-xs"
                >
                  {subjects.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* AI Quick Actions */}
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-slate-400 text-[10px] font-bold uppercase flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-indigo-500" />
                  AI Enrich:
                </span>
                <button
                  onClick={() => handleAiRefine("summarize")}
                  disabled={isAiLoading}
                  className="px-2.5 py-1 rounded-lg bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 font-semibold text-[11px] hover:bg-indigo-100 disabled:opacity-50"
                >
                  + Summary
                </button>
                <button
                  onClick={() => handleAiRefine("expand")}
                  disabled={isAiLoading}
                  className="px-2.5 py-1 rounded-lg bg-purple-50 dark:bg-purple-950 text-purple-700 dark:text-purple-300 font-semibold text-[11px] hover:bg-purple-100 disabled:opacity-50"
                >
                  + Deep Explainer
                </button>
                <button
                  onClick={() => handleAiRefine("questions")}
                  disabled={isAiLoading}
                  className="px-2.5 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-semibold text-[11px] hover:bg-emerald-100 disabled:opacity-50"
                >
                  + MCQs
                </button>
              </div>
            </div>

            {/* Note Editor Area */}
            <div
              className={`grid gap-4 min-h-[460px] ${
                viewMode === "split"
                  ? "grid-cols-1 md:grid-cols-2"
                  : "grid-cols-1"
              }`}
            >
              {/* Textarea Editor */}
              {(viewMode === "edit" || viewMode === "split") && (
                <textarea
                  value={currentNote.content}
                  onChange={(e) => updateNote(currentNote.id, { content: e.target.value })}
                  placeholder="Type Markdown content, equations, bullet points..."
                  className="w-full h-full min-h-[400px] p-4 text-xs sm:text-sm font-mono rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 leading-relaxed resize-none"
                />
              )}

              {/* Formatted Markdown Preview */}
              {(viewMode === "preview" || viewMode === "split") && (
                <div className="h-full min-h-[400px] p-4 rounded-xl bg-slate-50/50 dark:bg-slate-850/40 border border-slate-200 dark:border-slate-750 overflow-y-auto max-h-[500px]">
                  <MarkdownRenderer content={currentNote.content} />
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="lg:col-span-8 p-12 text-center bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
            <p className="text-sm font-semibold text-slate-500">No note selected.</p>
            <button
              onClick={handleCreateNewNote}
              className="mt-3 px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-semibold"
            >
              Create First Note
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
