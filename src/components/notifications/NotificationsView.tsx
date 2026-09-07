import React from "react";
import {
  Bell,
  CheckCircle2,
  Calendar,
  Zap,
  BookOpen,
  Trophy,
  Trash2,
  ArrowRight,
} from "lucide-react";
import { useStudy } from "../../context/StudyContext";
import { NotificationItem } from "../../types";

export const NotificationsView: React.FC = () => {
  const { notifications, markNotificationRead, clearNotifications, setCurrentView, addToast } = useStudy();

  const getNotificationIcon = (type: NotificationItem["type"]) => {
    switch (type) {
      case "exam":
        return Calendar;
      case "quiz":
        return Trophy;
      case "streak":
        return Zap;
      case "revision":
        return BookOpen;
      default:
        return Bell;
    }
  };

  const handleAction = (notif: NotificationItem) => {
    markNotificationRead(notif.id);
    if (notif.actionView) {
      setCurrentView(notif.actionView);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Notifications & Study Reminders
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Stay updated with spaced repetition alerts, upcoming exam countdowns, and streak milestones.
          </p>
        </div>

        {notifications.length > 0 && (
          <button
            onClick={() => {
              clearNotifications();
              addToast("All notifications cleared!");
            }}
            className="px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-rose-50 text-slate-600 dark:text-slate-300 hover:text-rose-600 text-xs font-semibold flex items-center gap-1.5 transition-all self-start sm:self-auto"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear All</span>
          </button>
        )}
      </div>

      {/* Notifications List */}
      <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 sm:p-6 shadow-xs space-y-3">
        {notifications.length === 0 ? (
          <div className="p-12 text-center space-y-2">
            <Bell className="w-8 h-8 text-slate-300 dark:text-slate-600 mx-auto" />
            <h4 className="text-sm font-bold text-slate-900 dark:text-white">All Caught Up!</h4>
            <p className="text-xs text-slate-400">
              No new alerts or pending reminders right now.
            </p>
          </div>
        ) : (
          notifications.map((notif) => {
            const Icon = getNotificationIcon(notif.type);
            return (
              <div
                key={notif.id}
                onClick={() => handleAction(notif)}
                className={`p-4 rounded-xl border transition-all cursor-pointer flex items-start justify-between gap-4 ${
                  notif.isRead
                    ? "bg-slate-50/50 dark:bg-slate-900/40 border-slate-200/80 dark:border-slate-800 opacity-70"
                    : "bg-white dark:bg-slate-900 border-indigo-200 dark:border-indigo-900/60 shadow-xs hover:border-indigo-400"
                }`}
              >
                <div className="flex items-start gap-3.5">
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                      notif.type === "exam"
                        ? "bg-rose-50 dark:bg-rose-950 text-rose-600"
                        : notif.type === "streak"
                        ? "bg-amber-50 dark:bg-amber-950 text-amber-600"
                        : "bg-indigo-50 dark:bg-indigo-950 text-indigo-600"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                  </div>

                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                        {notif.title}
                      </h4>
                      {!notif.isRead && (
                        <span className="w-2 h-2 rounded-full bg-indigo-600" />
                      )}
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                      {notif.message}
                    </p>
                    <span className="text-[10px] text-slate-400 block pt-1">
                      {notif.timestamp}
                    </span>
                  </div>
                </div>

                {notif.actionView && (
                  <span className="text-indigo-600 text-xs font-semibold flex items-center gap-1 shrink-0">
                    <span>View</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
