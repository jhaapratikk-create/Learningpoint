import React, { useState } from "react";
import { Download, Smartphone, CheckCircle, Bell, Zap, X, Share, PlusSquare } from "lucide-react";

interface PWAInstallModalProps {
  isOpen: boolean;
  onClose: () => void;
  onInstall: () => Promise<boolean>;
  canPrompt: boolean;
  isIOS: boolean;
  isInstalled: boolean;
}

export const PWAInstallModal: React.FC<PWAInstallModalProps> = ({
  isOpen,
  onClose,
  onInstall,
  canPrompt,
  isIOS,
  isInstalled,
}) => {
  const [installing, setInstalling] = useState(false);
  const [success, setSuccess] = useState(false);
  const [showManualSteps, setShowManualSteps] = useState(false);

  if (!isOpen || isInstalled) return null;

  const handleConfirmInstall = async () => {
    setInstalling(true);
    if (isIOS) {
      setShowManualSteps(true);
      setInstalling(false);
      return;
    }

    if (canPrompt) {
      const accepted = await onInstall();
      if (accepted) {
        setSuccess(true);
        setTimeout(() => {
          onClose();
        }, 1800);
      }
    } else {
      // Browser didn't expose native prompt yet (e.g., Desktop or already queued)
      setShowManualSteps(true);
    }
    setInstalling(false);
  };

  return (
    <div
      id="pwa-install-modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/75 backdrop-blur-sm animate-fade-in"
    >
      <div className="relative w-full max-w-md overflow-hidden bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6">
        {/* Close Button */}
        <button
          id="btn-close-pwa-modal"
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors"
          title="Dismiss"
        >
          <X className="w-5 h-5" />
        </button>

        {success ? (
          <div className="py-8 text-center">
            <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
              Added to Home Screen! 🎉
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              AI Study Assistant is now ready on your device. Look for the app icon on your home screen.
            </p>
          </div>
        ) : (
          <div>
            {/* Header with App Icon */}
            <div className="flex items-center gap-4 mb-4">
              <img
                src="/pwa-192x192.png"
                alt="Learning Point Icon"
                className="w-14 h-14 rounded-2xl shadow-lg border border-amber-900/40 object-cover flex-shrink-0"
                referrerPolicy="no-referrer"
              />
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white leading-tight">
                  Add Website to Home Screen?
                </h3>
                <p className="text-xs text-indigo-600 dark:text-indigo-400 font-medium mt-0.5">
                  Install as Native App on Your Device
                </p>
              </div>
            </div>

            <p className="text-sm text-slate-600 dark:text-slate-300 mb-5 leading-relaxed">
              Add <strong>AI Study Assistant</strong> to your phone or computer home screen for automatic background alarms, instant offline study access, and fullscreen experience.
            </p>

            {/* Feature Highlights */}
            <div className="space-y-2.5 mb-6 bg-slate-50 dark:bg-slate-800/60 rounded-xl p-3.5 border border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2.5 text-xs text-slate-700 dark:text-slate-300">
                <Bell className="w-4 h-4 text-amber-500 flex-shrink-0" />
                <span>
                  <strong>Background Alarms:</strong> Rings automatically even when the tab is closed
                </span>
              </div>
              <div className="flex items-center gap-2.5 text-xs text-slate-700 dark:text-slate-300">
                <Zap className="w-4 h-4 text-indigo-500 flex-shrink-0" />
                <span>
                  <strong>Custom Ringtones:</strong> Choose alarms from device folders or audio links
                </span>
              </div>
              <div className="flex items-center gap-2.5 text-xs text-slate-700 dark:text-slate-300">
                <Download className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                <span>
                  <strong>Instant Home Access:</strong> One-tap launch with zero lag
                </span>
              </div>
            </div>

            {/* If manual guidance is needed (e.g., iOS Safari or browser prompt fallback) */}
            {(isIOS || showManualSteps) && (
              <div className="mb-5 p-3.5 bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800/60 rounded-xl text-xs text-indigo-900 dark:text-indigo-200 space-y-2">
                <p className="font-semibold flex items-center gap-1.5">
                  {isIOS ? "📱 iPhone / iPad Instructions:" : "💻 Quick Install Guide:"}
                </p>
                {isIOS ? (
                  <ol className="list-decimal list-inside space-y-1 text-slate-700 dark:text-slate-300">
                    <li>
                      Tap the <strong>Share</strong> button <Share className="w-3.5 h-3.5 inline text-indigo-600 dark:text-indigo-400 mx-1" /> at the bottom of Safari
                    </li>
                    <li>
                      Scroll down and tap <strong>"Add to Home Screen"</strong> <PlusSquare className="w-3.5 h-3.5 inline text-indigo-600 dark:text-indigo-400 mx-1" />
                    </li>
                    <li>Tap <strong>"Add"</strong> in the top-right corner</li>
                  </ol>
                ) : (
                  <p className="text-slate-600 dark:text-slate-400">
                    Click the <strong>Install App</strong> icon <Download className="w-3.5 h-3.5 inline mx-1" /> in your browser address bar or menu to add to your desktop/home screen.
                  </p>
                )}
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex items-center gap-3">
              <button
                id="btn-confirm-add-home"
                onClick={handleConfirmInstall}
                disabled={installing}
                className="flex-1 flex items-center justify-center gap-2 px-5 py-3 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 rounded-xl shadow-md shadow-indigo-600/20 transition-all disabled:opacity-50"
              >
                <Download className="w-4 h-4" />
                {installing ? "Adding to Home Screen..." : "Yes, Add to Home Screen"}
              </button>
              <button
                id="btn-cancel-add-home"
                onClick={onClose}
                className="px-4 py-3 text-sm font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
              >
                Maybe Later
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
