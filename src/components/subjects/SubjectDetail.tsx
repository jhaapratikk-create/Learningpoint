import React, { useState } from "react";
import {
  ArrowLeft,
  BookOpen,
  Plus,
  CheckCircle2,
  Circle,
  FileText,
  Trophy,
  Layers,
  Sparkles,
  Bot,
  Timer,
  Clock,
  ChevronRight,
  ExternalLink,
} from "lucide-react";
import { useStudy } from "../../context/StudyContext";
import { Modal } from "../common/Modal";
import { EmptyState } from "../common/EmptyState";

export const SubjectDetail: React.FC = () => {
  const {
    subjects,
    selectedSubjectId,
    setCurrentView,
    chapters,
    addChapter,
    toggleChapterComplete,
    notes,
    setActiveNoteId,
    quizzes,
    startQuiz,
    flashcards,
  } = useStudy();

  const currentSubject =
    subjects.find((s) => s.id === selectedSubjectId) || subjects[0];

  const [activeTab, setActiveTab] = useState<"chapters" | "notes" | "quizzes" | "flashcards">(
    "chapters"
  );
  const [isAddChapterModalOpen, setIsAddChapterModalOpen] = useState(false);
  const [chapterTitle, setChapterTitle] = useState("");
  const [chapterDescription, setChapterDescription] = useState("");
  const [chapterOrder, setChapterOrder] = useState<number>(1);

  if (!currentSubject) {
    return (
      <div className="p-8 text-center">
        <p className="text-sm text-slate-500">Subject not found.</p>
        <button
          onClick={() => setCurrentView("subjects")}
          className="mt-3 px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-semibold"
        >
          Back to Subjects
        </button>
      </div>
    );
  }

  const subjectChapters = chapters.filter((c) => c.subjectId === currentSubject.id);
  const subjectNotes = notes.filter((n) => n.subjectId === currentSubject.id);
  const subjectQuizzes = quizzes.filter((q) => q.subjectId === currentSubject.id);
  const subjectFlashcards = flashcards.filter((f) => f.subjectId === currentSubject.id);

  const completedChaptersCount = subjectChapters.filter((c) => c.isCompleted).length;
  const progressPercent =
    subjectChapters.length > 0
      ? Math.round((completedChaptersCount / subjectChapters.length) * 100)
      : currentSubject.progress;

  const handleSaveChapter = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chapterTitle.trim()) return;

    addChapter({
      subjectId: currentSubject.id,
      title: chapterTitle,
      summary: chapterDescription || chapterTitle,
      description: chapterDescription,
      difficulty: "Medium",
      order: subjectChapters.length + 1,
    });
    setChapterTitle("");
    setChapterDescription("");
    setIsAddChapterModalOpen(false);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Breadcrumb / Back Navigation */}
      <button
        onClick={() => setCurrentView("subjects")}
        className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to All Subjects</span>
      </button>

      {/* Subject Header Card */}
      <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 shadow-xs space-y-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center text-white shadow-md"
              style={{ backgroundColor: currentSubject.color }}
            >
              <BookOpen className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  {currentSubject.code || currentSubject.name.slice(0, 4).toUpperCase()}
                </span>
                <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                  {currentSubject.accuracy ?? 85}% Accuracy
                </span>
              </div>
              <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                {currentSubject.name}
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5 max-w-xl leading-relaxed">
                {currentSubject.description}
              </p>
            </div>
          </div>

          {/* Quick AI Tutor / Practice triggers */}
          <div className="flex items-center gap-2.5 flex-wrap">
            <button
              onClick={() => setCurrentView("ai-tutor")}
              className="px-3.5 py-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-300 font-semibold text-xs border border-indigo-200/60 dark:border-indigo-800/60 hover:bg-indigo-100 transition-all flex items-center gap-1.5"
            >
              <Bot className="w-4 h-4" />
              <span>Ask AI Tutor</span>
            </button>
            <button
              onClick={() => setIsAddChapterModalOpen(true)}
              className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs shadow-sm transition-all flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Add Chapter</span>
            </button>
          </div>
        </div>

        {/* Progress Bar & Stats */}
        <div className="pt-2 border-t border-slate-100 dark:border-slate-800 grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
          <div className="md:col-span-2 space-y-1.5">
            <div className="flex justify-between text-xs font-semibold">
              <span className="text-slate-500 dark:text-slate-400">Syllabus Completion</span>
              <span className="text-slate-900 dark:text-white">{progressPercent}%</span>
            </div>
            <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{ width: `${progressPercent}%`, backgroundColor: currentSubject.color }}
              />
            </div>
          </div>

          <div className="flex justify-around md:col-span-2 text-center text-xs">
            <div>
              <p className="text-[11px] text-slate-400">Chapters</p>
              <p className="font-bold text-slate-900 dark:text-white">
                {completedChaptersCount}/{subjectChapters.length} Done
              </p>
            </div>
            <div>
              <p className="text-[11px] text-slate-400">Study Notes</p>
              <p className="font-bold text-slate-900 dark:text-white">{subjectNotes.length}</p>
            </div>
            <div>
              <p className="text-[11px] text-slate-400">Flashcards</p>
              <p className="font-bold text-slate-900 dark:text-white">{subjectFlashcards.length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2">
        <button
          onClick={() => setActiveTab("chapters")}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
            activeTab === "chapters"
              ? "bg-indigo-600 text-white shadow-xs"
              : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
          }`}
        >
          Chapters ({subjectChapters.length})
        </button>

        <button
          onClick={() => setActiveTab("notes")}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
            activeTab === "notes"
              ? "bg-indigo-600 text-white shadow-xs"
              : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
          }`}
        >
          Notes ({subjectNotes.length})
        </button>

        <button
          onClick={() => setActiveTab("quizzes")}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
            activeTab === "quizzes"
              ? "bg-indigo-600 text-white shadow-xs"
              : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
          }`}
        >
          Quizzes ({subjectQuizzes.length})
        </button>

        <button
          onClick={() => setActiveTab("flashcards")}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
            activeTab === "flashcards"
              ? "bg-indigo-600 text-white shadow-xs"
              : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
          }`}
        >
          Flashcards ({subjectFlashcards.length})
        </button>
      </div>

      {/* Tab 1: Chapters */}
      {activeTab === "chapters" && (
        <div className="space-y-3">
          {subjectChapters.length === 0 ? (
            <EmptyState
              icon={BookOpen}
              title="No Chapters Added Yet"
              description="Start breaking down this subject into clear chapters and syllabus modules."
              actionText="Add First Chapter"
              onAction={() => setIsAddChapterModalOpen(true)}
            />
          ) : (
            subjectChapters.map((chap, idx) => (
              <div
                key={chap.id}
                className={`p-4 sm:p-5 rounded-2xl border transition-all flex items-start justify-between gap-4 ${
                  chap.isCompleted
                    ? "bg-slate-50/60 dark:bg-slate-900/40 border-slate-200 dark:border-slate-800 opacity-90"
                    : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-xs"
                }`}
              >
                <div className="flex items-start gap-3.5">
                  <button
                    onClick={() => toggleChapterComplete(chap.id)}
                    className="mt-0.5 text-slate-400 hover:text-emerald-500 transition-colors"
                  >
                    {chap.isCompleted ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-500 fill-emerald-100 dark:fill-emerald-950" />
                    ) : (
                      <Circle className="w-5 h-5" />
                    )}
                  </button>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                        Chapter {idx + 1}
                      </span>
                      {chap.isCompleted && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
                          Completed
                        </span>
                      )}
                    </div>

                    <h4
                      className={`text-base font-bold ${
                        chap.isCompleted
                          ? "line-through text-slate-400 dark:text-slate-500"
                          : "text-slate-900 dark:text-white"
                      }`}
                    >
                      {chap.title}
                    </h4>

                    {chap.description && (
                      <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                        {chap.description}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => setCurrentView("notes")}
                    className="p-2 rounded-xl text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-medium flex items-center gap-1"
                    title="Open Notes"
                  >
                    <FileText className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setCurrentView("quizzes")}
                    className="p-2 rounded-xl text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-medium flex items-center gap-1"
                    title="Take Chapter Quiz"
                  >
                    <Trophy className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Tab 2: Notes */}
      {activeTab === "notes" && (
        <div className="space-y-3">
          {subjectNotes.length === 0 ? (
            <EmptyState
              icon={FileText}
              title="No Notes for this Subject"
              description="Create your first study notes or let the AI Notes Analyzer generate structured revision sheets."
              actionText="Create Note"
              onAction={() => setCurrentView("notes")}
            />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {subjectNotes.map((note) => (
                <div
                  key={note.id}
                  onClick={() => {
                    setActiveNoteId(note.id);
                    setCurrentView("notes");
                  }}
                  className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-indigo-400 dark:hover:border-indigo-600 shadow-xs cursor-pointer transition-all space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-slate-400">{note.updatedAt}</span>
                    {note.isFavorite && (
                      <span className="text-amber-500 text-xs font-bold">★ Favorite</span>
                    )}
                  </div>
                  <h4 className="text-base font-bold text-slate-900 dark:text-white">
                    {note.title}
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-3 leading-relaxed">
                    {note.content}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 3: Quizzes */}
      {activeTab === "quizzes" && (
        <div className="space-y-3">
          {subjectQuizzes.length === 0 ? (
            <EmptyState
              icon={Trophy}
              title="No Quizzes Available"
              description="Generate a practice quiz for this subject using the AI Question Generator."
              actionText="Generate AI Quiz"
              onAction={() => setCurrentView("question-generator")}
            />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {subjectQuizzes.map((quiz) => (
                <div
                  key={quiz.id}
                  className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3 flex flex-col justify-between"
                >
                  <div>
                    <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300">
                      {quiz.difficulty}
                    </span>
                    <h4 className="text-base font-bold text-slate-900 dark:text-white mt-2">
                      {quiz.title}
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                      {quiz.totalQuestions} Questions • {quiz.timeLimitMinutes} Minutes
                    </p>
                  </div>

                  <button
                    onClick={() => startQuiz(quiz)}
                    className="w-full py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-sm transition-all"
                  >
                    Start Test Now
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 4: Flashcards */}
      {activeTab === "flashcards" && (
        <div className="space-y-3">
          {subjectFlashcards.length === 0 ? (
            <EmptyState
              icon={Layers}
              title="No Flashcards Created"
              description="Create flashcards or extract them automatically from your lecture notes with AI."
              actionText="Open Flashcards Hub"
              onAction={() => setCurrentView("flashcards")}
            />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {subjectFlashcards.map((fc) => (
                <div
                  key={fc.id}
                  className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-2"
                >
                  <span className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 uppercase">
                    Q: Concept Recall
                  </span>
                  <h5 className="text-sm font-bold text-slate-900 dark:text-white">{fc.front}</h5>
                  <p className="text-xs text-slate-600 dark:text-slate-350 border-t border-slate-100 dark:border-slate-800 pt-2 leading-relaxed">
                    {fc.back}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Add Chapter Modal */}
      <Modal
        isOpen={isAddChapterModalOpen}
        onClose={() => setIsAddChapterModalOpen(false)}
        title={`Add Chapter to ${currentSubject.name}`}
        subtitle="Break your syllabus into manageable sections"
      >
        <form onSubmit={handleSaveChapter} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
              Chapter Title *
            </label>
            <input
              type="text"
              required
              value={chapterTitle}
              onChange={(e) => setChapterTitle(e.target.value)}
              placeholder="e.g. Thermodynamics, Linear Algebra, Cell Division"
              className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-250 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
              Key Topics & Scope
            </label>
            <textarea
              rows={3}
              value={chapterDescription}
              onChange={(e) => setChapterDescription(e.target.value)}
              placeholder="Summary of topics covered, essential derivations, problem patterns..."
              className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-250 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none"
            />
          </div>

          <div className="flex justify-end gap-2.5 pt-3 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={() => setIsAddChapterModalOpen(false)}
              className="px-4 py-2 text-xs sm:text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-xs sm:text-sm font-semibold rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm transition-all"
            >
              Save Chapter
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
