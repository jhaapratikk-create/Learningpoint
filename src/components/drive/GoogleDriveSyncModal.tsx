import React, { useState } from "react";
import {
  FolderCheck,
  ExternalLink,
  CloudUpload,
  CheckCircle2,
  AlertCircle,
  X,
  FileText,
  Share2,
  RefreshCw,
  HardDrive,
} from "lucide-react";
import { GoogleDriveSyncRecord } from "../../types";

interface GoogleDriveSyncModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSyncToDrive: () => Promise<{ success: boolean; link?: string; folderLink?: string; error?: string }>;
  syncRecord: GoogleDriveSyncRecord | null;
  isSyncing: boolean;
  userEmail?: string;
}

export const GoogleDriveSyncModal: React.FC<GoogleDriveSyncModalProps> = ({
  isOpen,
  onClose,
  onSyncToDrive,
  syncRecord,
  isSyncing,
  userEmail = "student@learningpoint.edu",
}) => {
  const [error, setError] = useState<string | null>(null);
  const [justSynced, setJustSynced] = useState(false);

  if (!isOpen) return null;

  const handleSync = async () => {
    setError(null);
    setJustSynced(false);
    const result = await onSyncToDrive();
    if (result.success) {
      setJustSynced(true);
    } else {
      setError(result.error || "Failed to save website to Google Drive");
    }
  };

  return (
    <div
      id="google-drive-sync-modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/75 backdrop-blur-sm animate-fade-in"
    >
      <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Google Drive Tri-color Icon */}
            <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/50 flex items-center justify-center">
              <svg className="w-6 h-6" viewBox="0 0 87.3 78" xmlns="http://www.w3.org/2000/svg">
                <path d="m6.6 66.85 3.85 6.65c.8 1.4 1.95 2.5 3.3 3.3l13.75-23.8h-27.5c0 1.55.4 3.1 1.2 4.5z" fill="#0066da"/>
                <path d="m43.65 25-13.75-23.8c-1.35.8-2.5 1.9-3.3 3.3l-25.4 44a9.06 9.06 0 0 0 -1.2 4.5h27.5z" fill="#00ac47"/>
                <path d="m73.55 76.8c1.35-.8 2.5-1.9 3.3-3.3l1.6-2.75 7.65-13.25c.8-1.4 1.2-2.95 1.2-4.5h-27.502l5.852 11.5z" fill="#ea4335"/>
                <path d="m43.65 25 13.75-23.8c-1.35-.8-2.9-1.2-4.5-1.2h-18.5c-1.6 0-3.15.45-4.5 1.2z" fill="#00832d"/>
                <path d="m59.8 53h-32.3l-13.75 23.8c1.35.8 2.9 1.2 4.5 1.2h50.8c1.6 0 3.15-.45 4.5-1.2z" fill="#2684fc"/>
                <path d="m73.4 26.5-12.7-22c-.8-1.4-1.95-2.5-3.3-3.3l-13.75 23.8 16.15 28h27.45c0-1.55-.4-3.1-1.2-4.5z" fill="#ffba00"/>
              </svg>
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Save Website to Google Drive
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Create a quick-launch shortcut and study backup in your Drive
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-5">
          {error && (
            <div className="flex items-center gap-2 p-3 text-xs text-rose-700 bg-rose-50 dark:bg-rose-950/40 dark:text-rose-300 rounded-xl border border-rose-200 dark:border-rose-900">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Sync Status Card */}
          <div className="bg-slate-50 dark:bg-slate-800/60 rounded-2xl p-4 border border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <HardDrive className="w-4 h-4 text-indigo-500" />
                Google Drive Storage
              </span>
              <span className="text-xs text-indigo-600 dark:text-indigo-400 font-medium">
                {userEmail}
              </span>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
              Saving to Google Drive adds a dedicated folder named <strong>"AI Study Assistant"</strong> containing:
            </p>

            <ul className="space-y-2 text-xs text-slate-700 dark:text-slate-300">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />
                <span><strong>Study_AI_Assistant_Web_Launcher.html</strong> (1-click interactive app launcher)</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />
                <span><strong>Study_AI_Assistant.url</strong> (Desktop & Mobile Internet shortcut)</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />
                <span><strong>Study_Plan_and_Alarms_Backup.json</strong> (NCERT Class 9 syllabus & alarm backup)</span>
              </li>
            </ul>
          </div>

          {/* Success / Recent Sync Info */}
          {(justSynced || syncRecord) && (
            <div className="p-4 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/80 rounded-2xl space-y-3">
              <div className="flex items-center gap-2 text-emerald-800 dark:text-emerald-300 font-semibold text-xs">
                <FolderCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span>Successfully Saved to Google Drive!</span>
              </div>
              <p className="text-xs text-emerald-700 dark:text-emerald-400/90">
                You can access your website launcher and backup directly in your Google Drive.
              </p>
              <div className="flex flex-wrap items-center gap-2 pt-1">
                {syncRecord?.webViewLink && (
                  <a
                    href={syncRecord.webViewLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-medium rounded-lg shadow-sm transition-colors"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    Open Launcher File
                  </a>
                )}
                {syncRecord?.folderViewLink && (
                  <a
                    href={syncRecord.folderViewLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white dark:bg-slate-800 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700 text-xs font-medium rounded-lg hover:bg-emerald-50 transition-colors"
                  >
                    <HardDrive className="w-3.5 h-3.5" />
                    View Drive Folder
                  </a>
                )}
              </div>
            </div>
          )}

          {/* Action Button */}
          <button
            id="btn-save-website-google-drive"
            onClick={handleSync}
            disabled={isSyncing}
            className="w-full flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold text-sm rounded-xl shadow-md shadow-blue-500/25 transition-all disabled:opacity-50"
          >
            {isSyncing ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                Connecting & Saving to Drive...
              </>
            ) : (
              <>
                <CloudUpload className="w-4 h-4" />
                {syncRecord ? "Update Website & Backups in Drive" : "Save Website to My Drive Now"}
              </>
            )}
          </button>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-slate-50 dark:bg-slate-800/40 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
          <span>Uses Google Drive API v3 (drive.file scope)</span>
          <button
            onClick={onClose}
            className="font-medium text-slate-700 dark:text-slate-300 hover:text-indigo-600"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
