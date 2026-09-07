import React, { useState, useEffect, useRef } from "react";
import {
  Timer,
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  Sparkles,
  CheckCircle2,
  Coffee,
  Brain,
  Headphones,
  Flame,
} from "lucide-react";
import { useStudy } from "../../context/StudyContext";

export const FocusTimer: React.FC = () => {
  const { subjects, addToast, triggerConfetti } = useStudy();

  const [mode, setMode] = useState<"pomodoro" | "deep" | "shortBreak" | "longBreak">("pomodoro");
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [selectedSubjectId, setSelectedSubjectId] = useState(subjects[0]?.id || "");
  const [focusTask, setFocusTask] = useState("");
  const [totalFocusMinutesToday, setTotalFocusMinutesToday] = useState(95);
  const [completedSessionsCount, setCompletedSessionsCount] = useState(3);
  const [ambientSound, setAmbientSound] = useState<"none" | "white" | "binaural" | "rain">("none");

  // Audio Context Ref for Synthesized Ambient Sound & Chime
  const audioCtxRef = useRef<AudioContext | null>(null);
  const noiseNodeRef = useRef<AudioNode | null>(null);

  const modeDurations = {
    pomodoro: 25 * 60,
    deep: 50 * 60,
    shortBreak: 5 * 60,
    longBreak: 15 * 60,
  };

  const setTimerMode = (m: "pomodoro" | "deep" | "shortBreak" | "longBreak") => {
    setIsRunning(false);
    setMode(m);
    setTimeLeft(modeDurations[m]);
  };

  // Timer Tick Hook
  useEffect(() => {
    let interval: any = null;
    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && isRunning) {
      setIsRunning(false);
      playChime();
      triggerConfetti();

      if (mode === "pomodoro" || mode === "deep") {
        const addedMins = mode === "pomodoro" ? 25 : 50;
        setTotalFocusMinutesToday((prev) => prev + addedMins);
        setCompletedSessionsCount((prev) => prev + 1);
        addToast("🎉 Focus Session Completed!", `Great job! You logged ${addedMins} minutes.`);
      } else {
        addToast("Break finished!", "Ready to dive back into learning?");
      }
    }
    return () => clearInterval(interval);
  }, [isRunning, timeLeft, mode]);

  // Web Audio Synth Bell Chime
  const playChime = () => {
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
      osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.3); // A5

      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.5);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 1.5);
    } catch (e) {
      console.warn("Audio chime not supported", e);
    }
  };

  // Synthesize Ambient Sounds (White Noise, Binaural Beats, Rain simulator)
  useEffect(() => {
    if (ambientSound === "none" || !isRunning) {
      if (noiseNodeRef.current) {
        noiseNodeRef.current.disconnect();
        noiseNodeRef.current = null;
      }
      return;
    }

    try {
      const ctx = audioCtxRef.current || new (window.AudioContext || (window as any).webkitAudioContext)();
      audioCtxRef.current = ctx;

      if (ctx.state === "suspended") {
        ctx.resume();
      }

      // Stop previous
      if (noiseNodeRef.current) {
        noiseNodeRef.current.disconnect();
      }

      if (ambientSound === "binaural") {
        // Binaural 40Hz Gamma Focus Beat (Left 200Hz, Right 240Hz)
        const merger = ctx.createChannelMerger(2);
        const oscL = ctx.createOscillator();
        const oscR = ctx.createOscillator();
        const gain = ctx.createGain();
        gain.gain.value = 0.08;

        oscL.frequency.value = 210;
        oscR.frequency.value = 250;

        oscL.connect(gain);
        oscR.connect(gain);
        gain.connect(ctx.destination);

        oscL.start();
        oscR.start();

        noiseNodeRef.current = gain;
      } else {
        // White / Pink noise buffer for rain/white noise
        const bufferSize = 2 * ctx.sampleRate;
        const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const output = noiseBuffer.getChannelData(0);
        let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;

        for (let i = 0; i < bufferSize; i++) {
          const white = Math.random() * 2 - 1;
          if (ambientSound === "rain") {
            // Pink noise filtering for soothing rain sound
            b0 = 0.99886 * b0 + white * 0.0555179;
            b1 = 0.99332 * b1 + white * 0.0750759;
            b2 = 0.96900 * b2 + white * 0.1538520;
            b3 = 0.86650 * b3 + white * 0.3104856;
            b4 = 0.55000 * b4 + white * 0.5329522;
            b5 = -0.7616 * b5 - white * 0.0168980;
            output[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.06;
            b6 = white * 0.115926;
          } else {
            output[i] = white * 0.04;
          }
        }

        const whiteNoise = ctx.createBufferSource();
        whiteNoise.buffer = noiseBuffer;
        whiteNoise.loop = true;

        const gainNode = ctx.createGain();
        gainNode.gain.value = 0.06;

        whiteNoise.connect(gainNode);
        gainNode.connect(ctx.destination);
        whiteNoise.start();

        noiseNodeRef.current = gainNode;
      }
    } catch (e) {
      console.warn("Ambient audio error", e);
    }

    return () => {
      if (noiseNodeRef.current) {
        noiseNodeRef.current.disconnect();
      }
    };
  }, [ambientSound, isRunning]);

  const totalCurrentDuration = modeDurations[mode];
  const progressPercent = ((totalCurrentDuration - timeLeft) / totalCurrentDuration) * 100;

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const formattedTime = `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      {/* Header */}
      <div className="text-center space-y-1">
        <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">
          Focus Room & Pomodoro Engine
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
          Eliminate digital distractions with science-backed interval cycles and synthesized audio frequencies.
        </p>
      </div>

      {/* Main Focus Card */}
      <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 sm:p-10 shadow-md flex flex-col items-center justify-center space-y-8">
        {/* Mode Buttons */}
        <div className="p-1.5 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center gap-1 flex-wrap justify-center">
          <button
            onClick={() => setTimerMode("pomodoro")}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              mode === "pomodoro"
                ? "bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs"
                : "text-slate-600 dark:text-slate-400"
            }`}
          >
            Pomodoro (25m)
          </button>

          <button
            onClick={() => setTimerMode("deep")}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              mode === "deep"
                ? "bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs"
                : "text-slate-600 dark:text-slate-400"
            }`}
          >
            Deep Sprint (50m)
          </button>

          <button
            onClick={() => setTimerMode("shortBreak")}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              mode === "shortBreak"
                ? "bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 shadow-xs"
                : "text-slate-600 dark:text-slate-400"
            }`}
          >
            Short Break (5m)
          </button>

          <button
            onClick={() => setTimerMode("longBreak")}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              mode === "longBreak"
                ? "bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 shadow-xs"
                : "text-slate-600 dark:text-slate-400"
            }`}
          >
            Long Break (15m)
          </button>
        </div>

        {/* Circular Dial / Giant Timer Display */}
        <div className="relative flex flex-col items-center justify-center">
          {/* Progress Ring */}
          <div className="w-64 h-64 sm:w-72 sm:h-72 rounded-full border-8 border-slate-100 dark:border-slate-800 flex items-center justify-center relative shadow-inner">
            {/* Subtle glow / inner fill */}
            <div
              className="absolute inset-2 rounded-full opacity-10"
              style={{
                background: `conic-gradient(#4f46e5 ${progressPercent}%, transparent 0)`,
              }}
            />

            <div className="text-center space-y-1 z-10 select-none">
              <span className="text-5xl sm:text-6xl font-black font-mono tracking-tight text-slate-900 dark:text-white">
                {formattedTime}
              </span>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                {isRunning ? (mode.includes("Break") ? "Resting" : "Deep Focus") : "Paused"}
              </p>
            </div>
          </div>
        </div>

        {/* Focus Task Input */}
        <div className="w-full max-w-md space-y-3">
          <input
            type="text"
            value={focusTask}
            onChange={(e) => setFocusTask(e.target.value)}
            placeholder="What is your singular target for this session? (e.g. Master Optics Equations)"
            className="w-full px-4 py-2.5 text-xs sm:text-sm rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-center focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
          />
        </div>

        {/* Controls: Play / Pause / Reset */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => {
              setTimeLeft(modeDurations[mode]);
              setIsRunning(false);
            }}
            className="p-3.5 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 transition-all"
            title="Reset Timer"
          >
            <RotateCcw className="w-5 h-5" />
          </button>

          <button
            onClick={() => setIsRunning((prev) => !prev)}
            className="px-8 py-4 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-base shadow-lg hover:shadow-indigo-500/25 transition-all flex items-center gap-3 active:scale-95"
          >
            {isRunning ? (
              <>
                <Pause className="w-5 h-5 fill-white" />
                <span>Pause Session</span>
              </>
            ) : (
              <>
                <Play className="w-5 h-5 fill-white" />
                <span>Start Focus</span>
              </>
            )}
          </button>
        </div>

        {/* Synthesized Ambient Audio Tones */}
        <div className="pt-4 border-t border-slate-100 dark:border-slate-800 w-full max-w-lg space-y-2 text-center">
          <p className="text-xs font-bold text-slate-400 uppercase flex items-center justify-center gap-1.5">
            <Headphones className="w-3.5 h-3.5 text-indigo-500" />
            <span>Focus Audio Generator (Web Audio Synthesizer)</span>
          </p>

          <div className="flex items-center justify-center gap-2 flex-wrap">
            {[
              { id: "none", label: "Mute" },
              { id: "rain", label: "Calming Rain 🌧️" },
              { id: "binaural", label: "Gamma 40Hz Beat 🧠" },
              { id: "white", label: "White Noise 💨" },
            ].map((sound) => (
              <button
                key={sound.id}
                onClick={() => setAmbientSound(sound.id as any)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                  ambientSound === sound.id
                    ? "bg-indigo-50 dark:bg-indigo-950 border-indigo-500 text-indigo-700 dark:text-indigo-300"
                    : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400"
                }`}
              >
                {sound.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Daily Progress Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
            <Timer className="w-6 h-6" />
          </div>
          <div>
            <span className="text-2xl font-black text-slate-900 dark:text-white">
              {totalFocusMinutesToday} mins
            </span>
            <p className="text-xs text-slate-400">Total Focus Today</p>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <span className="text-2xl font-black text-slate-900 dark:text-white">
              {completedSessionsCount}
            </span>
            <p className="text-xs text-slate-400">Completed Sprints</p>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-50 dark:bg-amber-950 text-amber-600 dark:text-amber-400 flex items-center justify-center">
            <Flame className="w-6 h-6" />
          </div>
          <div>
            <span className="text-2xl font-black text-slate-900 dark:text-white">
              7 Days
            </span>
            <p className="text-xs text-slate-400">Active Study Streak</p>
          </div>
        </div>
      </div>
    </div>
  );
};
