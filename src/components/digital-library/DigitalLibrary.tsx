import React, { useState } from "react";
import {
  FolderOpen,
  FileText,
  Upload,
  Sparkles,
  Download,
  Trash2,
  Eye,
  BookOpen,
  Search,
  CheckCircle2,
} from "lucide-react";
import { useStudy } from "../../context/StudyContext";
import { DocumentAnalysis } from "../../types";
import { Modal } from "../common/Modal";

export const DigitalLibrary: React.FC = () => {
  const { documents, subjects, setCurrentView, addToast } = useStudy();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDoc, setSelectedDoc] = useState<DocumentAnalysis | null>(null);

  const sampleLibraryItems = [
    {
      id: "lib_1",
      title: "Physics Mechanics & Derivations Cheat Sheet",
      category: "Formula Sheet",
      subject: "Physics",
      date: "2025-03-01",
      size: "1.4 MB",
      format: "PDF",
    },
    {
      id: "lib_2",
      title: "Organic Chemistry Reaction Mechanisms & Reagents",
      category: "Summary Guide",
      subject: "Chemistry",
      date: "2025-03-05",
      size: "2.8 MB",
      format: "PDF",
    },
    {
      id: "lib_3",
      title: "Calculus Limits, Derivatives & Standard Integrals Table",
      category: "Formula Sheet",
      subject: "Mathematics",
      date: "2025-03-10",
      size: "950 KB",
      format: "PDF",
    },
  ];

  const filteredDocs = documents.filter((d) =>
    d.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Digital Study Library & Resources
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Central repository of all uploaded documents, analyzed lecture slides, formula sheets, and study packs.
          </p>
        </div>

        <button
          onClick={() => setCurrentView("notes-analyzer")}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs sm:text-sm font-semibold shadow-sm transition-all active:scale-95 self-start sm:self-auto"
        >
          <Upload className="w-4 h-4" />
          <span>Upload & Analyze Document</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search documents, formulas, or summaries..."
          className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-xs"
        />
      </div>

      {/* Uploaded AI Documents Grid */}
      <div className="space-y-3">
        <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
          <span>AI-Analyzed Document Packs ({documents.length})</span>
        </h3>

        {documents.length === 0 ? (
          <div className="p-8 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center space-y-2">
            <p className="text-xs font-semibold text-slate-500">
              No documents analyzed yet. Upload lecture notes or PDFs to populate your digital library.
            </p>
            <button
              onClick={() => setCurrentView("notes-analyzer")}
              className="px-4 py-1.5 rounded-xl bg-indigo-600 text-white text-xs font-semibold"
            >
              Analyze First Document
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredDocs.map((doc) => (
              <div
                key={doc.id}
                onClick={() => setSelectedDoc(doc)}
                className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-indigo-400 dark:hover:border-indigo-600 shadow-xs cursor-pointer transition-all space-y-3 flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300">
                      {doc.subject}
                    </span>
                    <span className="text-[10px] text-slate-400">{doc.uploadedAt}</span>
                  </div>

                  <h4 className="text-sm font-bold text-slate-900 dark:text-white line-clamp-2">
                    {doc.title}
                  </h4>

                  <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-3 leading-relaxed">
                    {doc.summary}
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
                  <span>{doc.flashcards.length} Flashcards</span>
                  <span className="text-indigo-600 font-semibold flex items-center gap-1">
                    <Eye className="w-3.5 h-3.5" />
                    View Pack
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Curated Reference Sheets */}
      <div className="space-y-3 pt-4">
        <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          <span>Curated Revision Guides & Formula Cheat Sheets</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {sampleLibraryItems.map((item) => (
            <div
              key={item.id}
              className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3 flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
                    {item.category}
                  </span>
                  <span className="text-[10px] text-slate-400">{item.format} • {item.size}</span>
                </div>

                <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                  {item.title}
                </h4>

                <p className="text-xs text-slate-400">Subject: {item.subject}</p>
              </div>

              <button
                onClick={() => addToast(`Opening ${item.title}...`)}
                className="w-full py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-indigo-50 dark:hover:bg-indigo-950 text-slate-800 dark:text-slate-200 font-semibold text-xs transition-colors flex items-center justify-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download / View Resource</span>
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Document View Modal */}
      {selectedDoc && (
        <Modal
          isOpen={!!selectedDoc}
          onClose={() => setSelectedDoc(null)}
          title={selectedDoc.title}
          subtitle={`Analyzed ${selectedDoc.uploadedAt} • ${selectedDoc.subject}`}
        >
          <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
            <div>
              <h5 className="text-xs font-bold text-indigo-600 uppercase mb-1">
                Executive Summary
              </h5>
              <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                {selectedDoc.summary}
              </p>
            </div>

            {selectedDoc.keyConcepts.length > 0 && (
              <div>
                <h5 className="text-xs font-bold text-indigo-600 uppercase mb-1">
                  Key Concepts
                </h5>
                <ul className="list-disc list-inside text-xs sm:text-sm text-slate-700 dark:text-slate-300 space-y-1">
                  {selectedDoc.keyConcepts.map((k, i) => (
                    <li key={i}>{k}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </Modal>
      )}
    </div>
  );
};
