import React, { useState, useEffect } from "react";
import { Search, BookOpen, FileText, HelpCircle, Layers, Calendar, Sparkles, X, ArrowRight } from "lucide-react";
import { useStudy } from "../../context/StudyContext";
import { AppView } from "../../types";

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GlobalSearchModal: React.FC<GlobalSearchModalProps> = ({ isOpen, onClose }) => {
  const {
    subjects,
    notes,
    quizzes,
    flashcards,
    exams,
    setCurrentView,
    setSelectedSubjectId,
    setActiveNoteId,
    startQuiz,
  } = useStudy();

  const [query, setQuery] = useState("");

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        // toggle
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  if (!isOpen) return null;

  const cleanQuery = query.toLowerCase().trim();

  const matchingSubjects = cleanQuery
    ? subjects.filter((s) => s.name.toLowerCase().includes(cleanQuery) || s.description.toLowerCase().includes(cleanQuery))
    : subjects.slice(0, 3);

  const matchingNotes = cleanQuery
    ? notes.filter((n) => n.title.toLowerCase().includes(cleanQuery) || n.content.toLowerCase().includes(cleanQuery) || n.tags.some((t) => t.toLowerCase().includes(cleanQuery)))
    : notes.slice(0, 3);

  const matchingQuizzes = cleanQuery
    ? quizzes.filter((q) => q.title.toLowerCase().includes(cleanQuery))
    : quizzes.slice(0, 2);

  const matchingFlashcards = cleanQuery
    ? flashcards.filter((f) => f.front.toLowerCase().includes(cleanQuery) || f.back.toLowerCase().includes(cleanQuery))
    : [];

  const matchingExams = cleanQuery
    ? exams.filter((e) => e.name.toLowerCase().includes(cleanQuery) || e.subject.toLowerCase().includes(cleanQuery))
    : [];

  const handleNavigate = (view: AppView, action?: () => void) => {
    if (action) action();
    setCurrentView(view);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 overflow-y-auto">
      <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm" onClick={onClose} />

      <div className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col z-10 animate-in fade-in zoom-in-95">
        {/* Search Input Bar */}
        <div className="flex items-center px-4 py-3.5 border-b border-slate-200 dark:border-slate-800 gap-3">
          <Search className="w-5 h-5 text-slate-400 shrink-0" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search anything: calculus, notes, flashcards, exams, questions..."
            className="w-full bg-transparent text-sm sm:text-base text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none"
          />
          {query && (
            <button onClick={() => setQuery("")} className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
              <X className="w-4 h-4" />
            </button>
          )}
          <kbd className="hidden sm:inline-block px-2 py-0.5 text-xs text-slate-400 bg-slate-100 dark:bg-slate-800 rounded border border-slate-250 dark:border-slate-700">
            ESC
          </kbd>
        </div>

        {/* Results Body */}
        <div className="max-h-[60vh] overflow-y-auto p-4 space-y-5">
          {/* Quick AI Shortcuts */}
          {cleanQuery && (
            <div>
              <p className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2">
                Ask AI Assistant
              </p>
              <button
                onClick={() => handleNavigate("ai-tutor")}
                className="w-full flex items-center justify-between p-3 rounded-xl bg-indigo-50/80 dark:bg-indigo-950/40 hover:bg-indigo-100 dark:hover:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 transition-colors text-left"
              >
                <div className="flex items-center gap-2.5">
                  <Sparkles className="w-4 h-4 text-indigo-500 shrink-0" />
                  <span className="text-sm font-medium">Ask AI to explain "{query}"</span>
                </div>
                <ArrowRight className="w-4 h-4 text-indigo-500" />
              </button>
            </div>
          )}

          {/* Subjects */}
          {matchingSubjects.length > 0 && (
            <div>
              <p className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2">
                Subjects
              </p>
              <div className="space-y-1.5">
                {matchingSubjects.map((sub) => (
                  <button
                    key={sub.id}
                    onClick={() =>
                      handleNavigate("subject-detail", () => setSelectedSubjectId(sub.id))
                    }
                    className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800/80 text-left transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-indigo-100 dark:bg-indigo-950 flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-semibold text-xs">
                        <BookOpen className="w-4 h-4" />
                      </div>
                      <div>
                        <h5 className="text-sm font-medium text-slate-900 dark:text-white">
                          {sub.name}
                        </h5>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          {sub.chaptersCount} chapters • {sub.progress}% mastered
                        </p>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-400" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Notes */}
          {matchingNotes.length > 0 && (
            <div>
              <p className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2">
                Study Notes
              </p>
              <div className="space-y-1.5">
                {matchingNotes.map((note) => (
                  <button
                    key={note.id}
                    onClick={() =>
                      handleNavigate("notes", () => setActiveNoteId(note.id))
                    }
                    className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800/80 text-left transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <FileText className="w-4 h-4 text-emerald-500 shrink-0" />
                      <span className="text-sm font-medium text-slate-800 dark:text-slate-200 truncate">
                        {note.title}
                      </span>
                    </div>
                    <span className="text-xs text-slate-400">{note.createdAt}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quizzes */}
          {matchingQuizzes.length > 0 && (
            <div>
              <p className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2">
                Quizzes & Tests
              </p>
              <div className="space-y-1.5">
                {matchingQuizzes.map((quiz) => (
                  <button
                    key={quiz.id}
                    onClick={() =>
                      handleNavigate("active-quiz", () => startQuiz(quiz))
                    }
                    className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800/80 text-left transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <HelpCircle className="w-4 h-4 text-amber-500 shrink-0" />
                      <div>
                        <span className="text-sm font-medium text-slate-800 dark:text-slate-200">
                          {quiz.title}
                        </span>
                        <span className="text-xs text-slate-400 ml-2">
                          ({quiz.totalQuestions} Qs • {quiz.timeLimitMinutes} min)
                        </span>
                      </div>
                    </div>
                    <span className="text-xs font-medium px-2 py-0.5 rounded bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300">
                      Start
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Flashcards */}
          {matchingFlashcards.length > 0 && (
            <div>
              <p className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2">
                Flashcards
              </p>
              <div className="space-y-1.5">
                {matchingFlashcards.slice(0, 3).map((fc) => (
                  <button
                    key={fc.id}
                    onClick={() => handleNavigate("flashcards")}
                    className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800/80 text-left transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <Layers className="w-4 h-4 text-rose-500 shrink-0" />
                      <span className="text-sm text-slate-800 dark:text-slate-200 truncate">
                        {fc.front}
                      </span>
                    </div>
                    <span className="text-xs text-slate-400">{fc.difficultyRating}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Exams */}
          {matchingExams.length > 0 && (
            <div>
              <p className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2">
                Upcoming Exams
              </p>
              <div className="space-y-1.5">
                {matchingExams.map((exam) => (
                  <button
                    key={exam.id}
                    onClick={() => handleNavigate("exams")}
                    className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800/80 text-left transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <Calendar className="w-4 h-4 text-purple-500 shrink-0" />
                      <div>
                        <span className="text-sm font-medium text-slate-800 dark:text-slate-200">
                          {exam.name}
                        </span>
                        <span className="text-xs text-slate-400 ml-2">({exam.date})</span>
                      </div>
                    </div>
                    <span className="text-xs font-semibold text-purple-600 dark:text-purple-400">
                      {exam.preparationStatus}% Ready
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
