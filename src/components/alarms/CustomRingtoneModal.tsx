import React, { useState, useRef } from "react";
import {
  Folder,
  Music,
  Link2,
  Play,
  Square,
  Trash2,
  Upload,
  Check,
  X,
  Volume2,
  AlertCircle,
} from "lucide-react";
import { CustomRingtone, AlarmTone } from "../../types";
import { convertAudioFileToDataUrl, alarmSound } from "../../utils/alarmSound";

interface CustomRingtoneModalProps {
  isOpen: boolean;
  onClose: () => void;
  customRingtones: CustomRingtone[];
  onAddRingtone: (ringtone: CustomRingtone) => void;
  onDeleteRingtone: (id: string) => void;
  onSelectForAlarm?: (ringtone: CustomRingtone) => void;
  activeSelectedRingtoneId?: string;
}

export const CustomRingtoneModal: React.FC<CustomRingtoneModalProps> = ({
  isOpen,
  onClose,
  customRingtones,
  onAddRingtone,
  onDeleteRingtone,
  onSelectForAlarm,
  activeSelectedRingtoneId,
}) => {
  const [activeTab, setActiveTab] = useState<"upload" | "url">("upload");
  const [urlInput, setUrlInput] = useState("");
  const [nameInput, setNameInput] = useState("");
  const [isProcessingFile, setIsProcessingFile] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [currentlyPlayingId, setCurrentlyPlayingId] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const audioPreviewRef = useRef<HTMLAudioElement | null>(null);

  if (!isOpen) return null;

  const handleStopAudio = () => {
    if (audioPreviewRef.current) {
      audioPreviewRef.current.pause();
      audioPreviewRef.current.currentTime = 0;
    }
    alarmSound.stopRepeating();
    setCurrentlyPlayingId(null);
  };

  const handlePlayPreview = (ringtone: CustomRingtone) => {
    if (currentlyPlayingId === ringtone.id) {
      handleStopAudio();
      return;
    }
    handleStopAudio();
    try {
      const audio = new Audio(ringtone.dataUrl);
      audioPreviewRef.current = audio;
      setCurrentlyPlayingId(ringtone.id);
      audio.play().catch((err) => {
        setErrorMessage("Unable to play this audio format on this device.");
        setCurrentlyPlayingId(null);
      });
      audio.onended = () => {
        setCurrentlyPlayingId(null);
      };
    } catch (e) {
      setErrorMessage("Error initializing audio player.");
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setErrorMessage(null);
    setIsProcessingFile(true);

    try {
      const { dataUrl, fileSizeStr } = await convertAudioFileToDataUrl(file);
      const cleanName = file.name.replace(/\.[^/.]+$/, ""); // strip extension

      const newRingtone: CustomRingtone = {
        id: `ringtone_${Date.now()}`,
        name: cleanName || "Custom Ringtone",
        dataUrl,
        fileSize: fileSizeStr,
        sourceType: "upload",
        createdAt: new Date().toISOString().slice(0, 10),
      };

      onAddRingtone(newRingtone);
      if (onSelectForAlarm) {
        onSelectForAlarm(newRingtone);
      }
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (err: any) {
      setErrorMessage(err.message || "Failed to process audio file.");
    } finally {
      setIsProcessingFile(false);
    }
  };

  const handleAddFromUrl = (e: React.FormEvent) => {
    e.preventDefault();
    if (!urlInput.trim()) return;

    setErrorMessage(null);
    try {
      const parsed = new URL(urlInput.trim());
      const cleanName = nameInput.trim() || parsed.pathname.split("/").pop() || "Online Ringtone";

      const newRingtone: CustomRingtone = {
        id: `ringtone_url_${Date.now()}`,
        name: cleanName,
        dataUrl: urlInput.trim(),
        sourceType: "url",
        createdAt: new Date().toISOString().slice(0, 10),
      };

      onAddRingtone(newRingtone);
      if (onSelectForAlarm) {
        onSelectForAlarm(newRingtone);
      }
      setUrlInput("");
      setNameInput("");
    } catch (err) {
      setErrorMessage("Please enter a valid HTTP/HTTPS audio URL (e.g. .mp3, .ogg, .wav).");
    }
  };

  return (
    <div
      id="custom-ringtone-modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm animate-fade-in"
    >
      <div className="relative w-full max-w-xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center">
              <Music className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Alarm Ringtones & Audio Library
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Upload custom ringtones from your folders or web sound libraries
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              handleStopAudio();
              onClose();
            }}
            className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Area */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {/* Add Ringtone Method Tabs */}
          <div className="bg-slate-100 dark:bg-slate-800/60 p-1 rounded-xl flex gap-1">
            <button
              onClick={() => setActiveTab("upload")}
              className={`flex-1 flex items-center justify-center gap-2 py-2 text-xs font-semibold rounded-lg transition-all ${
                activeTab === "upload"
                  ? "bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900"
              }`}
            >
              <Folder className="w-4 h-4" />
              Upload from Device Folder
            </button>
            <button
              onClick={() => setActiveTab("url")}
              className={`flex-1 flex items-center justify-center gap-2 py-2 text-xs font-semibold rounded-lg transition-all ${
                activeTab === "url"
                  ? "bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900"
              }`}
            >
              <Link2 className="w-4 h-4" />
              Add Sound Link / URL
            </button>
          </div>

          {errorMessage && (
            <div className="flex items-center gap-2 p-3 text-xs text-rose-700 bg-rose-50 dark:bg-rose-950/40 dark:text-rose-300 rounded-xl border border-rose-200 dark:border-rose-900">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Upload Tab */}
          {activeTab === "upload" && (
            <div className="border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-2xl p-6 text-center hover:border-indigo-400 transition-colors bg-slate-50/50 dark:bg-slate-800/30">
              <input
                ref={fileInputRef}
                type="file"
                accept="audio/*,.mp3,.wav,.ogg,.m4a,.aac"
                onChange={handleFileUpload}
                className="hidden"
                id="ringtone-folder-file-input"
              />
              <div className="w-12 h-12 rounded-full bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mx-auto mb-3">
                <Upload className="w-6 h-6" />
              </div>
              <h4 className="text-sm font-semibold text-slate-800 dark:text-slate-200 mb-1">
                Choose Ringtone from Your Phone or Computer
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto mb-4">
                Supports MP3, WAV, AAC, M4A, OGG files from your Music or Downloads folder (up to 8 MB)
              </p>
              <label
                htmlFor="ringtone-folder-file-input"
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-xl cursor-pointer shadow-sm transition-colors"
              >
                <Folder className="w-4 h-4" />
                {isProcessingFile ? "Importing Audio..." : "Browse Folders"}
              </label>
            </div>
          )}

          {/* URL Tab */}
          {activeTab === "url" && (
            <form onSubmit={handleAddFromUrl} className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Audio URL (Direct MP3 / OGG link)
                </label>
                <input
                  type="url"
                  placeholder="https://example.com/sound.mp3"
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                  required
                  className="w-full px-3.5 py-2 text-xs rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Ringtone Title (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g., Morning Temple Bell"
                  value={nameInput}
                  onChange={(e) => setNameInput(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <button
                type="submit"
                className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-xl transition-colors shadow-sm"
              >
                Save Audio Link
              </button>
            </form>
          )}

          {/* Current Saved Ringtones List */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Your Custom Ringtones ({customRingtones.length})
              </h4>
              <span className="text-[11px] text-slate-400">
                Stored offline in your browser
              </span>
            </div>

            {customRingtones.length === 0 ? (
              <p className="text-xs text-slate-400 text-center py-6 border border-dashed border-slate-200 dark:border-slate-800 rounded-xl">
                No custom ringtones uploaded yet. Add one above!
              </p>
            ) : (
              <div className="space-y-2">
                {customRingtones.map((ringtone) => {
                  const isPlaying = currentlyPlayingId === ringtone.id;
                  const isSelected = activeSelectedRingtoneId === ringtone.id;

                  return (
                    <div
                      key={ringtone.id}
                      className={`flex items-center justify-between p-3 rounded-xl border transition-all ${
                        isSelected
                          ? "bg-indigo-50/70 dark:bg-indigo-950/40 border-indigo-300 dark:border-indigo-700"
                          : "bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-800 hover:border-slate-300"
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        {/* Play/Stop button */}
                        <button
                          type="button"
                          onClick={() => handlePlayPreview(ringtone)}
                          className={`w-9 h-9 rounded-lg flex items-center justify-center transition-colors flex-shrink-0 ${
                            isPlaying
                              ? "bg-rose-500 text-white"
                              : "bg-indigo-600 text-white hover:bg-indigo-700"
                          }`}
                          title={isPlaying ? "Stop Preview" : "Play Preview"}
                        >
                          {isPlaying ? (
                            <Square className="w-4 h-4 fill-current" />
                          ) : (
                            <Play className="w-4 h-4 fill-current ml-0.5" />
                          )}
                        </button>

                        <div className="min-w-0">
                          <p className="text-xs font-semibold text-slate-900 dark:text-white truncate">
                            {ringtone.name}
                          </p>
                          <p className="text-[10px] text-slate-500 dark:text-slate-400 flex items-center gap-2">
                            <span>{ringtone.sourceType === "upload" ? "Folder File" : "Web URL"}</span>
                            {ringtone.fileSize && <span>• {ringtone.fileSize}</span>}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 flex-shrink-0">
                        {onSelectForAlarm && (
                          <button
                            type="button"
                            onClick={() => onSelectForAlarm(ringtone)}
                            className={`px-2.5 py-1.5 text-xs font-medium rounded-lg flex items-center gap-1 transition-all ${
                              isSelected
                                ? "bg-indigo-600 text-white"
                                : "bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-indigo-100 dark:hover:bg-indigo-950"
                            }`}
                          >
                            {isSelected ? (
                              <>
                                <Check className="w-3.5 h-3.5" /> Selected
                              </>
                            ) : (
                              "Use for Alarm"
                            )}
                          </button>
                        )}

                        <button
                          type="button"
                          onClick={() => onDeleteRingtone(ringtone.id)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/50 rounded-lg transition-colors"
                          title="Delete Ringtone"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 bg-slate-50 dark:bg-slate-800/40 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <span className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
            <Volume2 className="w-4 h-4 text-indigo-500" />
            Background alarms play full ringtone with loop
          </span>
          <button
            onClick={() => {
              handleStopAudio();
              onClose();
            }}
            className="px-4 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
