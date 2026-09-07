import React, { useState } from "react";
import {
  Bell,
  BellRing,
  Plus,
  Trash2,
  Volume2,
  Clock,
  Sparkles,
  BookOpen,
  Calendar,
  Check,
  AlertCircle,
  Play,
  RotateCcw,
  Zap,
  Folder,
  Music,
  HardDrive,
  Download,
  Smartphone,
  ExternalLink,
} from "lucide-react";
import { useStudy } from "../../context/StudyContext";
import { useAuth } from "../../context/AuthContext";
import { StudyAlarm, AlarmTone, CustomRingtone } from "../../types";
import { alarmSound, requestAlarmNotificationPermission } from "../../utils/alarmSound";
import { CustomRingtoneModal } from "./CustomRingtoneModal";
import { GoogleDriveSyncModal } from "../drive/GoogleDriveSyncModal";
import { motion } from "motion/react";

const ALL_DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"] as const;

interface StudyAlarmsViewProps {
  onOpenPwaModal?: () => void;
}

export const StudyAlarmsView: React.FC<StudyAlarmsViewProps> = ({ onOpenPwaModal }) => {
  const {
    studyAlarms,
    addStudyAlarm,
    updateStudyAlarm,
    deleteStudyAlarm,
    toggleStudyAlarm,
    setCurrentView,
    selectedBoard,
    customRingtones,
    addCustomRingtone,
    deleteCustomRingtoneItem,
    syncWebsiteToGoogleDrive,
    googleDriveSyncRecord,
    isSyncingDrive,
  } = useStudy();
  const { user } = useAuth();

  const defaultClass = user?.grade?.includes("9")
    ? "Class 9"
    : user?.grade?.includes("10")
    ? "Class 10"
    : user?.grade?.includes("11")
    ? "Class 11"
    : user?.grade?.includes("12")
    ? "Class 12"
    : "Class 9";

  const [isCreating, setIsCreating] = useState(false);
  const [title, setTitle] = useState("");
  const [time, setTime] = useState("06:30");
  const [subject, setSubject] = useState("Science");
  const [topic, setTopic] = useState("Motion & Laws of Motion");
  const [classGrade, setClassGrade] = useState(defaultClass);
  const [board, setBoard] = useState(user?.board || selectedBoard || "CBSE");
  const [sound, setSound] = useState<AlarmTone>("bell");
  const [selectedCustomRingtoneId, setSelectedCustomRingtoneId] = useState<string | null>(null);
  const [selectedCustomRingtoneData, setSelectedCustomRingtoneData] = useState<string | undefined>(undefined);
  const [selectedCustomRingtoneName, setSelectedCustomRingtoneName] = useState<string | undefined>(undefined);

  const [repeatPreset, setRepeatPreset] = useState<"daily" | "weekdays" | "weekends" | "custom">("daily");
  const [selectedDays, setSelectedDays] = useState<("Mon" | "Tue" | "Wed" | "Thu" | "Fri" | "Sat" | "Sun")[]>([
    "Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun",
  ]);
  const [autoOpenView, setAutoOpenView] = useState<"smart-notes" | "focus-timer">("smart-notes");
  const [previewingSound, setPreviewingSound] = useState<string | null>(null);

  // Modals state
  const [isRingtoneModalOpen, setIsRingtoneModalOpen] = useState(false);
  const [isDriveModalOpen, setIsDriveModalOpen] = useState(false);

  const handlePreviewTone = (tone: AlarmTone, customData?: string) => {
    setPreviewingSound(tone);
    alarmSound.playTone(tone, customData);
    setTimeout(() => setPreviewingSound(null), 1400);
  };

  const handleSelectCustomRingtoneForAlarm = (ringtone: CustomRingtone) => {
    setSound("custom");
    setSelectedCustomRingtoneId(ringtone.id);
    setSelectedCustomRingtoneData(ringtone.dataUrl);
    setSelectedCustomRingtoneName(ringtone.name);
    setIsRingtoneModalOpen(false);
  };

  const handleRepeatPreset = (preset: "daily" | "weekdays" | "weekends") => {
    setRepeatPreset(preset);
    if (preset === "daily") {
      setSelectedDays(["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]);
    } else if (preset === "weekdays") {
      setSelectedDays(["Mon", "Tue", "Wed", "Thu", "Fri"]);
    } else {
      setSelectedDays(["Sat", "Sun"]);
    }
  };

  const toggleDay = (day: "Mon" | "Tue" | "Wed" | "Thu" | "Fri" | "Sat" | "Sun") => {
    setRepeatPreset("custom");
    if (selectedDays.includes(day)) {
      if (selectedDays.length > 1) {
        setSelectedDays(selectedDays.filter((d) => d !== day));
      }
    } else {
      setSelectedDays([...selectedDays, day]);
    }
  };

  const handleSaveAlarm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    addStudyAlarm({
      title: title.trim(),
      time,
      subject,
      topic: topic.trim() || undefined,
      classGrade,
      board,
      sound,
      customRingtoneId: sound === "custom" ? selectedCustomRingtoneId || undefined : undefined,
      customRingtoneName: sound === "custom" ? selectedCustomRingtoneName : undefined,
      customRingtoneData: sound === "custom" ? selectedCustomRingtoneData : undefined,
      days: selectedDays,
      repeat: repeatPreset,
      autoOpenView,
      isEnabled: true,
    });

    setIsCreating(false);
    setTitle("");
    setTopic("");
  };

  const handleTestTrigger = (alarm: StudyAlarm) => {
    alarmSound.playTone(alarm.sound, alarm.customRingtoneData);
    requestAlarmNotificationPermission();
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-rose-500/10 border border-amber-200/60 dark:border-amber-800/40">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-amber-700 dark:text-amber-400 uppercase tracking-wider mb-1">
            <BellRing className="w-4 h-4 animate-bounce" /> Smart Academic Routine & Alarm System
          </div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
            Study Alarms & Background Reminders
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-0.5">
            Starts automatically even when website is closed. Upload custom ringtones from folders, save to Google Drive, or add to your home screen.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Add to Home Screen Button */}
          {onOpenPwaModal && (
            <button
              type="button"
              id="btn-open-pwa-from-alarm"
              onClick={onOpenPwaModal}
              className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-sm flex items-center gap-1.5 transition-all"
            >
              <Smartphone className="w-3.5 h-3.5" /> Add to Home Screen
            </button>
          )}

          {/* Google Drive Button */}
          <button
            type="button"
            id="btn-open-drive-sync-modal"
            onClick={() => setIsDriveModalOpen(true)}
            className="px-3.5 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-800 dark:text-slate-200 hover:border-blue-400 flex items-center gap-1.5 transition-colors shadow-sm"
          >
            <HardDrive className="w-3.5 h-3.5 text-blue-500" /> Save to My Drive
          </button>

          {/* Manage Ringtones */}
          <button
            type="button"
            id="btn-open-ringtone-library"
            onClick={() => setIsRingtoneModalOpen(true)}
            className="px-3.5 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 flex items-center gap-1.5 transition-colors"
          >
            <Music className="w-3.5 h-3.5 text-amber-500" /> Custom Ringtones ({customRingtones.length})
          </button>

          <button
            type="button"
            id="btn-create-study-alarm"
            onClick={() => setIsCreating(true)}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white text-xs font-semibold shadow-md hover:shadow-lg flex items-center gap-1.5 transition-all active:scale-95"
          >
            <Plus className="w-4 h-4" /> Set Study Alarm
          </button>
        </div>
      </div>

      {/* Feature Highlights Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center flex-shrink-0">
            <Bell className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-900 dark:text-white">Auto-Starts in Background</h4>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">Works with Service Worker & Web Notifications</p>
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center flex-shrink-0">
            <Folder className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-900 dark:text-white">Custom Device Ringtones</h4>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">Import any MP3/WAV from phone or laptop folders</p>
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center flex-shrink-0">
            <HardDrive className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-900 dark:text-white">Connected to Google Drive</h4>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              {googleDriveSyncRecord ? "Synced with shortcut in Drive" : "1-Click launcher saved to Drive"}
            </p>
          </div>
        </div>
      </div>

      {/* New Alarm Form Modal / Collapse */}
      {isCreating && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-amber-200 dark:border-amber-800 shadow-xl space-y-5"
        >
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-white text-base">
              <Clock className="w-5 h-5 text-amber-500" /> Create Scheduled Study Alarm
            </div>
            <button
              type="button"
              onClick={() => setIsCreating(false)}
              className="text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              Cancel
            </button>
          </div>

          <form onSubmit={handleSaveAlarm} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Alarm Title
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Morning Science NCERT Notes Revision"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Alarm Time (24h)
                </label>
                <input
                  type="time"
                  required
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>
            </div>

            {/* Target Class, Board, Subject */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Class / Grade
                </label>
                <select
                  value={classGrade}
                  onChange={(e) => setClassGrade(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white"
                >
                  <option value="Class 9">Class 9 (New NCERT)</option>
                  <option value="Class 10">Class 10 (Board)</option>
                  <option value="Class 11">Class 11 (Senior)</option>
                  <option value="Class 12">Class 12 (Board / JEE / NEET)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Education Board
                </label>
                <select
                  value={board}
                  onChange={(e) => setBoard(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white"
                >
                  <option value="CBSE">CBSE Board</option>
                  <option value="ICSE">ICSE / ISC Board</option>
                  <option value="State Board">State Board</option>
                  <option value="Cambridge IGCSE">Cambridge IGCSE</option>
                  <option value="IB">IB Diploma</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Subject
                </label>
                <select
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white"
                >
                  <option value="Science">Science</option>
                  <option value="Mathematics">Mathematics</option>
                  <option value="Social Science">Social Science</option>
                  <option value="Physics">Physics</option>
                  <option value="Chemistry">Chemistry</option>
                  <option value="Biology">Biology</option>
                  <option value="English">English</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Auto-Open View
                </label>
                <select
                  value={autoOpenView}
                  onChange={(e) => setAutoOpenView(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white"
                >
                  <option value="smart-notes">Open Smart Notes System</option>
                  <option value="focus-timer">Open Focus Pomodoro Timer</option>
                </select>
              </div>
            </div>

            {/* Target Topic */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Target Topic / Chapter
                </label>
                <span className="text-[11px] text-slate-400">Quick suggestions:</span>
              </div>
              <input
                type="text"
                placeholder="e.g. Motion & Equations of Motion, Number Systems, Tissues"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
              <div className="flex flex-wrap gap-1.5 mt-2">
                {[
                  "Motion & Laws of Motion",
                  "Atoms & Molecules",
                  "Number Systems & Surds",
                  "Polynomials & Identities",
                  "The Fundamental Unit of Life (Cell)",
                  "Gravitation & Archimedes Principle",
                ].map((sug) => (
                  <button
                    key={sug}
                    type="button"
                    onClick={() => setTopic(sug)}
                    className="text-[11px] px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 hover:bg-amber-100 dark:hover:bg-amber-950/50 text-slate-600 dark:text-slate-300 hover:text-amber-700 dark:hover:text-amber-300 transition-colors"
                  >
                    + {sug}
                  </button>
                ))}
              </div>
            </div>

            {/* Repeat Presets & Days */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Repeat Frequency
              </label>
              <div className="flex items-center gap-2 mb-2">
                {(["daily", "weekdays", "weekends"] as const).map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => handleRepeatPreset(preset)}
                    className={`px-3 py-1 rounded-lg text-xs font-medium capitalize transition-all ${
                      repeatPreset === preset
                        ? "bg-amber-500 text-white shadow-sm"
                        : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700"
                    }`}
                  >
                    {preset}
                  </button>
                ))}
              </div>

              <div className="flex flex-wrap items-center gap-2">
                {ALL_DAYS.map((day) => {
                  const active = selectedDays.includes(day);
                  return (
                    <button
                      key={day}
                      type="button"
                      onClick={() => toggleDay(day)}
                      className={`w-9 h-9 rounded-xl text-xs font-semibold flex items-center justify-center transition-all ${
                        active
                          ? "bg-amber-500 text-white shadow-sm ring-2 ring-amber-400/30"
                          : "bg-slate-100 dark:bg-slate-800 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
                      }`}
                    >
                      {day}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Sound Tone & Custom Ringtones Selector */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Alarm Ringtone / Sound
                </label>
                <button
                  type="button"
                  onClick={() => setIsRingtoneModalOpen(true)}
                  className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline font-semibold flex items-center gap-1"
                >
                  <Folder className="w-3.5 h-3.5" />
                  Upload from Folder / Library
                </button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {(["bell", "chime", "zen", "digital"] as AlarmTone[]).map((t) => (
                  <div
                    key={t}
                    onClick={() => {
                      setSound(t);
                      setSelectedCustomRingtoneId(null);
                      setSelectedCustomRingtoneData(undefined);
                      setSelectedCustomRingtoneName(undefined);
                    }}
                    className={`cursor-pointer p-3 rounded-xl border flex items-center justify-between transition-all ${
                      sound === t
                        ? "border-amber-500 bg-amber-50/60 dark:bg-amber-950/30 text-amber-700 dark:text-amber-300 shadow-sm"
                        : "border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 text-slate-700 dark:text-slate-300"
                    }`}
                  >
                    <div className="text-xs font-semibold capitalize">{t}</div>
                    <button
                      type="button"
                      title={`Preview ${t} sound`}
                      onClick={(e) => {
                        e.stopPropagation();
                        handlePreviewTone(t);
                      }}
                      className="p-1.5 rounded-lg bg-white dark:bg-slate-700 hover:bg-amber-100 dark:hover:bg-slate-600 text-slate-500 hover:text-amber-600 transition-colors"
                    >
                      <Volume2 className={`w-3.5 h-3.5 ${previewingSound === t ? "text-amber-500 animate-spin" : ""}`} />
                    </button>
                  </div>
                ))}
              </div>

              {/* Custom Ringtones Quick Chips */}
              {customRingtones.length > 0 && (
                <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800">
                  <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 block mb-1.5">
                    Your Folder / Uploaded Ringtones:
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {customRingtones.map((cr) => {
                      const isSelected = sound === "custom" && selectedCustomRingtoneId === cr.id;
                      return (
                        <div
                          key={cr.id}
                          onClick={() => handleSelectCustomRingtoneForAlarm(cr)}
                          className={`cursor-pointer px-3 py-1.5 rounded-xl border text-xs font-medium flex items-center gap-2 transition-all ${
                            isSelected
                              ? "bg-indigo-600 text-white border-indigo-600 shadow-sm"
                              : "bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-indigo-400"
                          }`}
                        >
                          <Music className="w-3.5 h-3.5" />
                          <span className="max-w-[120px] truncate">{cr.name}</span>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handlePreviewTone("custom", cr.dataUrl);
                            }}
                            className={`p-1 rounded ${isSelected ? "hover:bg-indigo-700" : "hover:bg-slate-200 dark:hover:bg-slate-700"}`}
                          >
                            <Play className="w-3 h-3 fill-current" />
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Submit Button */}
            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setIsCreating(false)}
                className="px-4 py-2 rounded-xl text-xs font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white text-xs font-bold shadow-md hover:shadow-lg transition-all"
              >
                Save Study Alarm
              </button>
            </div>
          </form>
        </motion.div>
      )}

      {/* Alarms List */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <h2 className="text-sm font-bold text-slate-800 dark:text-slate-200">
            Active Study Alarms ({studyAlarms.length})
          </h2>
          <span className="text-xs text-slate-400">
            Automatically ticks every 5 seconds • Background active
          </span>
        </div>

        {studyAlarms.length === 0 ? (
          <div className="p-12 text-center rounded-2xl bg-white dark:bg-slate-900 border border-dashed border-slate-200 dark:border-slate-800">
            <Bell className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
            <h3 className="text-base font-semibold text-slate-700 dark:text-slate-300">
              No study alarms set yet
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-sm mx-auto">
              Set study reminders for your Class 9 / Class 10 NCERT subjects so you never fall behind in your preparation.
            </p>
            <button
              type="button"
              onClick={() => setIsCreating(true)}
              className="mt-4 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-semibold shadow-md transition-all"
            >
              Add First Study Alarm
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {studyAlarms.map((alarm) => (
              <div
                key={alarm.id}
                className={`p-4 rounded-2xl border transition-all ${
                  alarm.isEnabled
                    ? "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md"
                    : "bg-slate-50 dark:bg-slate-950/60 border-slate-200/60 dark:border-slate-800/40 opacity-70"
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1 flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl font-black tracking-tight text-slate-900 dark:text-white font-mono">
                        {alarm.time}
                      </span>
                      <span className="text-[11px] px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300 font-semibold uppercase">
                        {alarm.repeat}
                      </span>
                      {alarm.classGrade && (
                        <span className="text-[11px] px-2 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 font-medium">
                          {alarm.classGrade}
                        </span>
                      )}
                    </div>

                    <h3 className="text-sm font-bold text-slate-900 dark:text-white truncate">
                      {alarm.title}
                    </h3>

                    <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1.5 truncate">
                      <span className="font-semibold text-slate-700 dark:text-slate-300">{alarm.subject}</span>
                      {alarm.topic && <span>• {alarm.topic}</span>}
                    </p>
                  </div>

                  {/* Toggle Switch */}
                  <button
                    type="button"
                    onClick={() => toggleStudyAlarm(alarm.id)}
                    className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                      alarm.isEnabled ? "bg-amber-500" : "bg-slate-300 dark:bg-slate-700"
                    }`}
                  >
                    <span
                      className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                        alarm.isEnabled ? "translate-x-5" : "translate-x-0"
                      }`}
                    />
                  </button>
                </div>

                {/* Days Badges */}
                <div className="flex items-center gap-1 mt-3">
                  {ALL_DAYS.map((d) => {
                    const isDayActive = alarm.days.includes(d);
                    return (
                      <span
                        key={d}
                        className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                          isDayActive
                            ? "bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300"
                            : "bg-slate-100 dark:bg-slate-800/40 text-slate-300 dark:text-slate-600"
                        }`}
                      >
                        {d[0]}
                      </span>
                    );
                  })}
                </div>

                {/* Footer Controls */}
                <div className="flex items-center justify-between gap-2 mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 text-xs">
                  <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
                    <button
                      type="button"
                      title="Audition sound"
                      onClick={() => handlePreviewTone(alarm.sound, alarm.customRingtoneData)}
                      className="hover:text-amber-600 flex items-center gap-1 transition-colors"
                    >
                      <Volume2 className="w-3.5 h-3.5 text-amber-500" />
                      <span className="capitalize max-w-[100px] truncate">
                        {alarm.customRingtoneName || alarm.sound}
                      </span>
                    </button>
                    <span>•</span>
                    <button
                      type="button"
                      onClick={() => handleTestTrigger(alarm)}
                      className="hover:text-amber-600 transition-colors"
                    >
                      Test Ring
                    </button>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setCurrentView(alarm.autoOpenView || "smart-notes")}
                      className="text-amber-600 dark:text-amber-400 hover:underline font-semibold flex items-center gap-1"
                    >
                      <BookOpen className="w-3.5 h-3.5" />
                      {alarm.autoOpenView === "focus-timer" ? "Focus Timer" : "Smart Notes"}
                    </button>
                    <button
                      type="button"
                      onClick={() => deleteStudyAlarm(alarm.id)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Routine Recommendations */}
      <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2 flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-amber-500" /> Proven NCERT Study Schedule Guidelines
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-slate-600 dark:text-slate-300">
          <div className="p-3 rounded-xl bg-white dark:bg-slate-800/70 border border-slate-100 dark:border-slate-800">
            <div className="font-semibold text-slate-900 dark:text-white">🌅 06:00 - 07:00 AM</div>
            <p className="text-[11px] text-slate-500 mt-1">
              High-focus conceptual reading. Best for Class 9/10 Science definitions, cell organelles, and atomic structure.
            </p>
          </div>
          <div className="p-3 rounded-xl bg-white dark:bg-slate-800/70 border border-slate-100 dark:border-slate-800">
            <div className="font-semibold text-slate-900 dark:text-white">🌇 05:00 - 06:30 PM</div>
            <p className="text-[11px] text-slate-500 mt-1">
              Mathematics problem-solving. Solve 10-15 New NCERT textbook problems in Polynomials, Geometry, or Equations of Motion.
            </p>
          </div>
          <div className="p-3 rounded-xl bg-white dark:bg-slate-800/70 border border-slate-100 dark:border-slate-800">
            <div className="font-semibold text-slate-900 dark:text-white">🌙 09:00 - 09:45 PM</div>
            <p className="text-[11px] text-slate-500 mt-1">
              Consolidation and quick flashcard recap. Locks formulas and common exam pitfalls into long-term memory before sleep.
            </p>
          </div>
        </div>
      </div>

      {/* Custom Ringtone Modal */}
      <CustomRingtoneModal
        isOpen={isRingtoneModalOpen}
        onClose={() => setIsRingtoneModalOpen(false)}
        customRingtones={customRingtones}
        onAddRingtone={addCustomRingtone}
        onDeleteRingtone={deleteCustomRingtoneItem}
        onSelectForAlarm={handleSelectCustomRingtoneForAlarm}
        activeSelectedRingtoneId={selectedCustomRingtoneId || undefined}
      />

      {/* Google Drive Sync Modal */}
      <GoogleDriveSyncModal
        isOpen={isDriveModalOpen}
        onClose={() => setIsDriveModalOpen(false)}
        onSyncToDrive={syncWebsiteToGoogleDrive}
        syncRecord={googleDriveSyncRecord}
        isSyncing={isSyncingDrive}
        userEmail={user?.email || "student@learningpoint.edu"}
      />
    </div>
  );
};

