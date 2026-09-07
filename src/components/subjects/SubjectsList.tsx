import React, { useState } from "react";
import {
  BookOpen,
  Plus,
  ArrowRight,
  Sparkles,
  BarChart3,
  FileText,
  Trophy,
  Layers,
  Trash2,
  Edit2,
  CheckCircle2,
} from "lucide-react";
import { useStudy } from "../../context/StudyContext";
import { Modal } from "../common/Modal";
import { ConfirmDialog } from "../common/ConfirmDialog";

export const SubjectsList: React.FC = () => {
  const { subjects, addSubject, updateSubject, deleteSubject, setSelectedSubjectId, setCurrentView } = useStudy();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingSubject, setEditingSubject] = useState<{ id: string; name: string; description: string; code: string; color: string } | null>(null);
  const [deletingSubjectId, setDeletingSubjectId] = useState<string | null>(null);

  // Form state
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [code, setCode] = useState("");
  const [color, setColor] = useState("#4f46e5");

  const colors = ["#4f46e5", "#0284c7", "#059669", "#d97706", "#dc2626", "#7c3aed", "#db2777"];

  const handleOpenAdd = () => {
    setName("");
    setDescription("");
    setCode("");
    setColor("#4f46e5");
    setIsAddModalOpen(true);
  };

  const handleSaveSubject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    if (editingSubject) {
      updateSubject(editingSubject.id, {
        name,
        description,
        code: code || name.slice(0, 4).toUpperCase(),
        color,
      });
      setEditingSubject(null);
    } else {
      addSubject({
        name,
        description,
        code: code || name.slice(0, 4).toUpperCase(),
        color,
        icon: "BookOpen",
        chaptersCount: 0,
      });
      setIsAddModalOpen(false);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            My Subjects & Curriculum
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Organize chapters, track syllabus mastery, and access subject-specific study resources
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs sm:text-sm font-semibold shadow-sm transition-all active:scale-95 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Subject</span>
        </button>
      </div>

      {/* Grid of Subjects */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
        {subjects.map((sub) => (
          <div
            key={sub.id}
            onClick={() => {
              setSelectedSubjectId(sub.id);
              setCurrentView("subject-detail");
            }}
            className="group relative rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 sm:p-6 shadow-xs hover:shadow-md hover:border-indigo-400 dark:hover:border-indigo-600 transition-all cursor-pointer flex flex-col justify-between"
          >
            {/* Top row: Color chip & Actions */}
            <div className="space-y-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-xs"
                    style={{ backgroundColor: sub.color }}
                  >
                    <BookOpen className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      {sub.code}
                    </span>
                    <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                      {sub.name}
                    </h3>
                  </div>
                </div>

                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setEditingSubject({
                        id: sub.id,
                        name: sub.name,
                        description: sub.description,
                        code: sub.code,
                        color: sub.color,
                      });
                      setName(sub.name);
                      setDescription(sub.description);
                      setCode(sub.code);
                      setColor(sub.color);
                    }}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  {subjects.length > 1 && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setDeletingSubjectId(sub.id);
                      }}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/50"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>

              <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                {sub.description}
              </p>

              {/* Progress Bar */}
              <div className="space-y-1.5 pt-2">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-slate-500 dark:text-slate-400">Curriculum Progress</span>
                  <span className="text-slate-900 dark:text-white">{sub.progress}%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{ width: `${sub.progress}%`, backgroundColor: sub.color }}
                  />
                </div>
              </div>
            </div>

            {/* Bottom Meta Stats */}
            <div className="mt-5 pt-3.5 border-t border-slate-100 dark:border-slate-800/80 grid grid-cols-3 gap-2 text-center text-xs">
              <div className="p-1.5 rounded-lg bg-slate-50 dark:bg-slate-800/50">
                <p className="text-[10px] text-slate-400">Chapters</p>
                <p className="font-bold text-slate-800 dark:text-slate-200">{sub.chaptersCount}</p>
              </div>
              <div className="p-1.5 rounded-lg bg-slate-50 dark:bg-slate-800/50">
                <p className="text-[10px] text-slate-400">Notes</p>
                <p className="font-bold text-slate-800 dark:text-slate-200">{sub.notesCount}</p>
              </div>
              <div className="p-1.5 rounded-lg bg-slate-50 dark:bg-slate-800/50">
                <p className="text-[10px] text-slate-400">Accuracy</p>
                <p className="font-bold text-emerald-600 dark:text-emerald-400">{sub.accuracy}%</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add / Edit Modal */}
      <Modal
        isOpen={isAddModalOpen || !!editingSubject}
        onClose={() => {
          setIsAddModalOpen(false);
          setEditingSubject(null);
        }}
        title={editingSubject ? "Edit Subject" : "Create New Subject"}
        subtitle="Add a subject to your curriculum"
      >
        <form onSubmit={handleSaveSubject} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
              Subject Name *
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Physics, World History, Organic Chemistry"
              className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-250 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                Subject Code
              </label>
              <input
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="e.g. PHY101"
                className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-250 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                Theme Color
              </label>
              <div className="flex items-center gap-2 pt-1.5">
                {colors.map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setColor(c)}
                    className={`w-6 h-6 rounded-full transition-transform ${
                      color === c ? "scale-125 ring-2 ring-indigo-500 ring-offset-2" : ""
                    }`}
                    style={{ backgroundColor: c }}
                  />
                ))}
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
              Description & Topics
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Key focus areas, syllabus scope, target goals..."
              className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-250 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none"
            />
          </div>

          <div className="flex justify-end gap-2.5 pt-3 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={() => {
                setIsAddModalOpen(false);
                setEditingSubject(null);
              }}
              className="px-4 py-2 text-xs sm:text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-xs sm:text-sm font-semibold rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm transition-all"
            >
              {editingSubject ? "Save Changes" : "Create Subject"}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={!!deletingSubjectId}
        onClose={() => setDeletingSubjectId(null)}
        onConfirm={() => {
          if (deletingSubjectId) deleteSubject(deletingSubjectId);
        }}
        title="Delete Subject"
        message="Are you sure you want to delete this subject? All associated chapters, notes, flashcards, and quizzes will be preserved in your library."
        confirmText="Delete Subject"
      />
    </div>
  );
};
