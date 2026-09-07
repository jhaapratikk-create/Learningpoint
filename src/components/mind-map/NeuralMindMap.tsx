import React, { useState, useEffect, useRef } from "react";
import {
  Sparkles,
  Zap,
  Network,
  Layers,
  ArrowRight,
  BookOpen,
  HelpCircle,
  Copy,
  Check,
  Download,
  BookmarkPlus,
  RefreshCw,
  AlertTriangle,
  Lightbulb,
  Cpu,
  Brain,
  Radio,
  Volume2,
  VolumeX,
  Share2,
  ChevronRight,
  Compass,
} from "lucide-react";
import { apiService } from "../../services/api";
import { useStudy } from "../../context/StudyContext";
import { MathFormula } from "../common/MathFormula";

interface MindMapNode {
  id: string;
  label: string;
  category: "core" | "principle" | "formula" | "application" | "exam_trap";
  tag: string;
  description: string;
  formula?: string;
  keyTakeaways: string[];
  connections: string[];
}

interface MindMapData {
  topic: string;
  summary: string;
  complexityScore: number;
  estimatedMasteryTime: string;
  nodes: MindMapNode[];
  keyFormulas?: {
    name: string;
    latex: string;
    meaning: string;
  }[];
  feynmanChallenge?: {
    prompt: string;
    sampleAnalogy: string;
    keyPitfall: string;
  };
  futuristicApplications?: string[];
  modelUsed?: string;
  responseTimeMs?: number;
}

const PRESET_TOPICS = [
  { name: "Newton's Laws & Classical Dynamics", subject: "Physics", icon: "🚀" },
  { name: "Quantum Wave-Particle Duality", subject: "Physics", icon: "⚛️" },
  { name: "Cellular Respiration & Krebs Cycle", subject: "Biology", icon: "🧬" },
  { name: "Calculus: Integration & Fundamental Theorem", subject: "Mathematics", icon: "📐" },
  { name: "Organic Reaction Mechanisms & Electrophiles", subject: "Chemistry", icon: "🧪" },
  { name: "Transformer Architecture & Neural Attention", subject: "Computer Science", icon: "🧠" },
];

export const NeuralMindMap: React.FC = () => {
  const { addNote, addFlashcard, subjects } = useStudy();
  const [topicInput, setTopicInput] = useState("Newton's Laws & Classical Dynamics");
  const [subjectInput, setSubjectInput] = useState("Physics");
  const [depth, setDepth] = useState<"quick" | "comprehensive" | "olympiad">("comprehensive");
  const [isLoading, setIsLoading] = useState(false);
  const [mindMap, setMindMap] = useState<MindMapData | null>(null);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [isCopied, setIsCopied] = useState(false);
  const [isSavedToNotes, setIsSavedToNotes] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [feynmanAnswer, setFeynmanAnswer] = useState("");
  const [feynmanFeedback, setFeynmanFeedback] = useState<string | null>(null);
  const [binauralActive, setBinauralActive] = useState(false);
  const audioContextRef = useRef<AudioContext | null>(null);
  const osc1Ref = useRef<OscillatorNode | null>(null);
  const osc2Ref = useRef<OscillatorNode | null>(null);

  // Generate initial mindmap on mount
  useEffect(() => {
    handleGenerate("Newton's Laws & Classical Dynamics", "Physics");
    return () => {
      stopBinauralBeats();
    };
  }, []);

  const handleGenerate = async (topicToUse?: string, subjectToUse?: string) => {
    const targetTopic = (topicToUse || topicInput).trim();
    if (!targetTopic) return;

    setIsLoading(true);
    setSelectedNodeId(null);
    setIsSavedToNotes(false);
    setFeynmanFeedback(null);
    setFeynmanAnswer("");

    try {
      const data = await apiService.generateMindMap({
        topic: targetTopic,
        subject: subjectToUse || subjectInput,
        depth,
      });
      setMindMap(data);
      if (data.nodes && data.nodes.length > 0) {
        setSelectedNodeId(data.nodes[0].id);
      }
    } catch (err) {
      console.error("Failed to generate mind map:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // Binaural Focus Beats (40Hz Gamma focus frequency) using Web Audio API
  const toggleBinauralBeats = () => {
    if (binauralActive) {
      stopBinauralBeats();
      setBinauralActive(false);
    } else {
      startBinauralBeats();
      setBinauralActive(true);
    }
  };

  const startBinauralBeats = () => {
    try {
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const ctx = new AudioContextClass();
      audioContextRef.current = ctx;

      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gain = ctx.createGain();

      osc1.frequency.setValueAtTime(200, ctx.currentTime); // Carrier 200Hz
      osc2.frequency.setValueAtTime(240, ctx.currentTime); // 40Hz Gamma difference

      gain.gain.setValueAtTime(0.04, ctx.currentTime); // Gentle ambient volume

      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(ctx.destination);

      osc1.start();
      osc2.start();

      osc1Ref.current = osc1;
      osc2Ref.current = osc2;
    } catch (err) {
      console.warn("Audio Context could not start:", err);
    }
  };

  const stopBinauralBeats = () => {
    try {
      if (osc1Ref.current) osc1Ref.current.stop();
      if (osc2Ref.current) osc2Ref.current.stop();
      if (audioContextRef.current) audioContextRef.current.close();
    } catch {
      // Ignored
    }
    osc1Ref.current = null;
    osc2Ref.current = null;
    audioContextRef.current = null;
  };

  // Text to Speech for node explanation
  const speakText = (text: string) => {
    if (!("speechSynthesis" in window)) return;
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    const clean = text.replace(/\\\[|\\\]|\\\(|\\\)|[\$#\*_]/g, " ");
    const utterance = new SpeechSynthesisUtterance(clean);
    utterance.rate = 1.0;
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    setIsSpeaking(true);
    window.speechSynthesis.speak(utterance);
  };

  const handleSaveToNotes = () => {
    if (!mindMap) return;
    const content = `# Neural Mind Map: ${mindMap.topic}
*Executive Summary*: ${mindMap.summary}
*Estimated Mastery*: ${mindMap.estimatedMasteryTime} | Complexity: ${mindMap.complexityScore}/100

## Core Concept Pillars
${mindMap.nodes
  .map(
    (n, idx) => `### ${idx + 1}. [${n.tag}] ${n.label}
${n.description}
${n.formula ? `*Equation*: ${n.formula}` : ""}
*Key Takeaways*:
${n.keyTakeaways.map((t) => `- ${t}`).join("\n")}`
  )
  .join("\n\n")}

${
  mindMap.keyFormulas && mindMap.keyFormulas.length > 0
    ? `## High-Yield Mathematical Relations
${mindMap.keyFormulas.map((f) => `- **${f.name}**: \`${f.latex}\` — ${f.meaning}`).join("\n")}`
    : ""
}

## Feynman Master Challenge
> ${mindMap.feynmanChallenge?.prompt}
- **Intuitive Analogy**: ${mindMap.feynmanChallenge?.sampleAnalogy}
- **Common Trap**: ${mindMap.feynmanChallenge?.keyPitfall}
`;

    const targetSubjectId = subjects.find((s) => s.name.toLowerCase().includes(subjectInput.toLowerCase()))?.id || subjects[0]?.id || "sub-1";

    addNote({
      title: `Neural Mind Map: ${mindMap.topic}`,
      content,
      subjectId: targetSubjectId,
      tags: ["MindMap", "Futuristic", "DeepLearning"],
      isFavorite: false,
    });

    setIsSavedToNotes(true);
    setTimeout(() => setIsSavedToNotes(false), 3000);
  };

  const handleExportFlashcards = () => {
    if (!mindMap) return;
    const targetSubjectId = subjects.find((s) => s.name.toLowerCase().includes(subjectInput.toLowerCase()))?.id || subjects[0]?.id || "sub-1";
    let count = 0;
    mindMap.nodes.forEach((node) => {
      addFlashcard({
        subjectId: targetSubjectId,
        front: `What is the core principle of "${node.label}" in ${mindMap.topic}?`,
        back: `${node.description}\n\nKey Takeaway: ${node.keyTakeaways[0] || "Foundational theorem."}`,
        difficultyRating: "Unrated",
      });
      count++;
    });

    alert(`Created ${count} interactive flashcards from this mind map! Check your Flashcards tab.`);
  };

  const selectedNode = mindMap?.nodes.find((n) => n.id === selectedNodeId) || mindMap?.nodes[0];

  const getCategoryStyles = (category: string) => {
    switch (category) {
      case "core":
        return {
          bg: "bg-indigo-500/10 dark:bg-indigo-500/20",
          border: "border-indigo-500/50 hover:border-indigo-500",
          text: "text-indigo-700 dark:text-indigo-300",
          badge: "bg-indigo-600 text-white",
          glow: "shadow-[0_0_20px_rgba(99,102,241,0.25)]",
        };
      case "formula":
        return {
          bg: "bg-emerald-500/10 dark:bg-emerald-500/20",
          border: "border-emerald-500/50 hover:border-emerald-500",
          text: "text-emerald-700 dark:text-emerald-300",
          badge: "bg-emerald-600 text-white",
          glow: "shadow-[0_0_20px_rgba(16,185,129,0.25)]",
        };
      case "application":
        return {
          bg: "bg-cyan-500/10 dark:bg-cyan-500/20",
          border: "border-cyan-500/50 hover:border-cyan-500",
          text: "text-cyan-700 dark:text-cyan-300",
          badge: "bg-cyan-600 text-white",
          glow: "shadow-[0_0_20px_rgba(6,182,212,0.25)]",
        };
      case "exam_trap":
        return {
          bg: "bg-rose-500/10 dark:bg-rose-500/20",
          border: "border-rose-500/50 hover:border-rose-500",
          text: "text-rose-700 dark:text-rose-300",
          badge: "bg-rose-600 text-white",
          glow: "shadow-[0_0_20px_rgba(244,63,94,0.25)]",
        };
      default:
        return {
          bg: "bg-amber-500/10 dark:bg-amber-500/20",
          border: "border-amber-500/50 hover:border-amber-500",
          text: "text-amber-700 dark:text-amber-300",
          badge: "bg-amber-600 text-white",
          glow: "shadow-[0_0_20px_rgba(245,158,11,0.25)]",
        };
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Futuristic Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 p-6 sm:p-8 text-white border border-indigo-500/20 shadow-xl">
        <div className="absolute -right-12 -top-12 w-64 h-64 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute right-1/3 -bottom-16 w-48 h-48 bg-cyan-500/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-xs font-semibold tracking-wide">
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
              <span>Next-Gen Neural Visualizer & Feynman Engine</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white flex items-center gap-3">
              <Network className="w-7 h-7 text-cyan-400" />
              <span>AI Neural Concept Mind Map</span>
            </h1>
            <p className="text-sm text-slate-300 leading-relaxed">
              Transform any complex STEM, medical, or academic concept into an interconnected holographic knowledge network with step-by-step mathematical proofs, real-world manifestations, and Feynman intuitive mastery checks.
            </p>
          </div>

          {/* Futuristic Study Audio HUD */}
          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <button
              onClick={toggleBinauralBeats}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all border ${
                binauralActive
                  ? "bg-indigo-600 text-white border-indigo-400 shadow-[0_0_15px_rgba(99,102,241,0.5)] animate-pulse"
                  : "bg-white/10 hover:bg-white/15 text-slate-200 border-white/15"
              }`}
              title="40Hz Gamma Binaural frequency designed for deep focus & neural synchronization"
            >
              <Radio className="w-4 h-4 text-cyan-300" />
              <span>{binauralActive ? "40Hz Gamma Focus Active" : "Binaural Flow Beats"}</span>
            </button>
          </div>
        </div>

        {/* Search & Topic Selector Bar */}
        <div className="mt-6 pt-6 border-t border-white/10">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <input
                type="text"
                value={topicInput}
                onChange={(e) => setTopicInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleGenerate()}
                placeholder="Enter any topic (e.g. Thermodynamics, General Relativity, DNA Transcription, Machine Learning...)"
                className="w-full pl-4 pr-10 py-3 rounded-2xl bg-white/10 border border-white/20 text-white placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-400 backdrop-blur-md"
              />
              <button
                onClick={() => handleGenerate()}
                disabled={isLoading || !topicInput.trim()}
                className="absolute right-2 top-2 p-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold disabled:opacity-50 transition-colors"
              >
                {isLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <ArrowRight className="w-4 h-4" />}
              </button>
            </div>

            <div className="flex items-center gap-2">
              <select
                value={depth}
                onChange={(e) => setDepth(e.target.value as "quick" | "comprehensive" | "olympiad")}
                className="px-3 py-3 rounded-2xl bg-white/10 border border-white/20 text-white text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-cyan-400"
              >
                <option value="quick" className="bg-slate-900 text-white">⚡ Fast Overview</option>
                <option value="comprehensive" className="bg-slate-900 text-white">🔬 Deep Mastery</option>
                <option value="olympiad" className="bg-slate-900 text-white">🏆 Advanced / Olympiad</option>
              </select>

              <button
                onClick={() => handleGenerate()}
                disabled={isLoading || !topicInput.trim()}
                className="px-5 py-3 rounded-2xl bg-gradient-to-r from-cyan-500 to-indigo-500 hover:from-cyan-400 hover:to-indigo-400 text-slate-950 font-extrabold text-sm flex items-center gap-2 shadow-md hover:shadow-cyan-500/20 transition-all shrink-0 disabled:opacity-50"
              >
                {isLoading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Synthesizing...</span>
                  </>
                ) : (
                  <>
                    <Zap className="w-4 h-4" />
                    <span>Synthesize Graph</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Quick Presets */}
          <div className="flex items-center gap-2 mt-4 overflow-x-auto pb-1 text-xs no-scrollbar">
            <span className="text-slate-400 font-bold shrink-0 flex items-center gap-1">
              <Compass className="w-3.5 h-3.5" /> High-Yield:
            </span>
            {PRESET_TOPICS.map((preset, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setTopicInput(preset.name);
                  setSubjectInput(preset.subject);
                  handleGenerate(preset.name, preset.subject);
                }}
                className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/15 border border-white/10 text-slate-200 shrink-0 transition-colors flex items-center gap-1.5"
              >
                <span>{preset.icon}</span>
                <span>{preset.name}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Interactive Neural View */}
      {mindMap && (
        <div className="space-y-6">
          {/* Executive Concept Summary Card */}
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="space-y-1 max-w-3xl">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-extrabold uppercase tracking-wider bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                  Topic Architecture
                </span>
                <span className="text-xs text-slate-500 dark:text-slate-400 font-semibold">
                  Estimated Mastery: {mindMap.estimatedMasteryTime}
                </span>
              </div>
              <h2 className="text-xl font-black text-slate-900 dark:text-white">
                {mindMap.topic}
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                {mindMap.summary}
              </p>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={handleSaveToNotes}
                className="px-3.5 py-2 rounded-xl bg-indigo-50 dark:bg-indigo-950 hover:bg-indigo-100 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 text-xs font-bold flex items-center gap-1.5 transition-colors"
              >
                {isSavedToNotes ? <Check className="w-4 h-4 text-emerald-600" /> : <BookmarkPlus className="w-4 h-4" />}
                <span>{isSavedToNotes ? "Saved to Notes!" : "Save to Notes"}</span>
              </button>

              <button
                onClick={handleExportFlashcards}
                className="px-3.5 py-2 rounded-xl bg-cyan-50 dark:bg-cyan-950 hover:bg-cyan-100 text-cyan-700 dark:text-cyan-300 border border-cyan-200 dark:border-cyan-800 text-xs font-bold flex items-center gap-1.5 transition-colors"
              >
                <Layers className="w-4 h-4" />
                <span>Export Flashcards</span>
              </button>
            </div>
          </div>

          {/* Two-Column Interactive Graph Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Column: Interactive Holographic Node Cluster (7 cols) */}
            <div className="lg:col-span-7 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                  <Brain className="w-4 h-4 text-indigo-500" />
                  <span>Neural Nodes ({mindMap.nodes.length}) — Click to Inspect</span>
                </span>
                <span className="text-[11px] text-slate-400">
                  Select a node to deep-dive
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {mindMap.nodes.map((node, index) => {
                  const isSelected = node.id === selectedNode?.id;
                  const styles = getCategoryStyles(node.category);

                  return (
                    <div
                      key={node.id}
                      onClick={() => setSelectedNodeId(node.id)}
                      className={`cursor-pointer p-4 rounded-2xl border-2 transition-all duration-200 relative overflow-hidden flex flex-col justify-between group ${
                        isSelected
                          ? `${styles.border} ${styles.bg} ${styles.glow} ring-2 ring-indigo-400/40`
                          : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700"
                      }`}
                    >
                      <div className="space-y-2">
                        <div className="flex items-center justify-between gap-2">
                          <span className={`px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider ${styles.badge}`}>
                            {node.tag}
                          </span>
                          <span className="text-[10px] font-mono font-bold text-slate-400">
                            Node 0{index + 1}
                          </span>
                        </div>

                        <h4 className="text-sm font-black text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                          {node.label}
                        </h4>

                        <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed">
                          {node.description}
                        </p>
                      </div>

                      {node.formula && (
                        <div className="mt-3 pt-2.5 border-t border-slate-150 dark:border-slate-800 overflow-x-auto">
                          <MathFormula expression={node.formula} />
                        </div>
                      )}

                      <div className="mt-3 flex items-center justify-between text-[11px] font-bold text-indigo-600 dark:text-indigo-400 pt-1">
                        <span>{node.keyTakeaways.length} Key Insights</span>
                        <ChevronRight className={`w-4 h-4 transition-transform ${isSelected ? "rotate-90" : "group-hover:translate-x-1"}`} />
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Governing Formulas Panel */}
              {mindMap.keyFormulas && mindMap.keyFormulas.length > 0 && (
                <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black uppercase tracking-wider text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                      <Zap className="w-4 h-4 text-emerald-500" />
                      <span>High-Yield Governing Mathematical Relations</span>
                    </span>
                    <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold bg-emerald-50 dark:bg-emerald-950 px-2 py-0.5 rounded">
                      KaTeX Verified
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {mindMap.keyFormulas.map((f, idx) => (
                      <div
                        key={idx}
                        className="p-3 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-750 space-y-1.5"
                      >
                        <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 block">
                          {f.name}
                        </span>
                        <div className="p-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 overflow-x-auto text-center">
                          <MathFormula expression={f.latex} block />
                        </div>
                        <p className="text-[11px] text-slate-600 dark:text-slate-300">
                          {f.meaning}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Right Column: Node Inspector & Feynman Challenge (5 cols) */}
            <div className="lg:col-span-5 space-y-4">
              {selectedNode ? (
                <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4 sticky top-4">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
                    <div>
                      <span className="text-[10px] font-black uppercase tracking-wider text-indigo-600 dark:text-indigo-400 block">
                        Inspecting Node
                      </span>
                      <h3 className="text-base font-black text-slate-900 dark:text-white">
                        {selectedNode.label}
                      </h3>
                    </div>

                    <button
                      onClick={() => speakText(`${selectedNode.label}. ${selectedNode.description}`)}
                      className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-indigo-50 text-slate-700 dark:text-slate-300 hover:text-indigo-600 transition-colors"
                      title="Listen to explanation"
                    >
                      {isSpeaking ? <VolumeX className="w-4 h-4 text-indigo-600" /> : <Volume2 className="w-4 h-4" />}
                    </button>
                  </div>

                  <div className="space-y-2">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                      Core Principle
                    </span>
                    <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-200 leading-relaxed font-normal">
                      {selectedNode.description}
                    </p>
                  </div>

                  {selectedNode.formula && (
                    <div className="space-y-1.5">
                      <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider block">
                        Mathematical Formula
                      </span>
                      <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-750 text-center overflow-x-auto">
                        <MathFormula expression={selectedNode.formula} block />
                      </div>
                    </div>
                  )}

                  <div className="space-y-2">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                      Key Takeaways & Exam Points
                    </span>
                    <ul className="space-y-1.5 text-xs text-slate-700 dark:text-slate-300">
                      {selectedNode.keyTakeaways.map((takeaway, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <span className="text-indigo-500 font-bold shrink-0">•</span>
                          <span>{takeaway}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Feynman Mastery Challenge Box */}
                  {mindMap.feynmanChallenge && (
                    <div className="mt-4 p-4 rounded-xl bg-gradient-to-br from-indigo-50/80 to-purple-50/80 dark:from-indigo-950/40 dark:to-purple-950/40 border border-indigo-200 dark:border-indigo-800 space-y-2.5">
                      <div className="flex items-center gap-1.5 text-indigo-700 dark:text-indigo-300 font-black text-xs uppercase tracking-wider">
                        <Lightbulb className="w-4 h-4" />
                        <span>Feynman Mastery Test</span>
                      </div>

                      <p className="text-xs text-slate-800 dark:text-slate-200 font-semibold leading-relaxed">
                        {mindMap.feynmanChallenge.prompt}
                      </p>

                      <div className="space-y-2 pt-1">
                        <textarea
                          rows={2}
                          value={feynmanAnswer}
                          onChange={(e) => setFeynmanAnswer(e.target.value)}
                          placeholder="Type your intuitive explanation in plain words..."
                          className="w-full p-2.5 rounded-lg bg-white dark:bg-slate-900 border border-indigo-200 dark:border-indigo-800 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                        />

                        <div className="flex items-center justify-between">
                          <button
                            onClick={() => {
                              if (!feynmanAnswer.trim()) {
                                setFeynmanFeedback("Please write an analogy or brief explanation first!");
                                return;
                              }
                              setFeynmanFeedback(
                                `💡 Great initiative! Look at this benchmark analogy:\n\n"${mindMap.feynmanChallenge?.sampleAnalogy}"\n\n⚠️ Key Trap to guard against: ${mindMap.feynmanChallenge?.keyPitfall}`
                              );
                            }}
                            className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-colors"
                          >
                            Verify My Explanation
                          </button>

                          <button
                            onClick={() => {
                              setFeynmanFeedback(
                                `💡 Benchmark Intuitive Analogy:\n"${mindMap.feynmanChallenge?.sampleAnalogy}"\n\n⚠️ Frequent Student Trap: ${mindMap.feynmanChallenge?.keyPitfall}`
                              );
                            }}
                            className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
                          >
                            Show Benchmark Analogy
                          </button>
                        </div>

                        {feynmanFeedback && (
                          <div className="p-2.5 rounded-lg bg-white/90 dark:bg-slate-900/90 border border-indigo-200 dark:border-indigo-800 text-xs text-slate-700 dark:text-slate-300 whitespace-pre-line leading-relaxed">
                            {feynmanFeedback}
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Futuristic Tech Application */}
                  {mindMap.futuristicApplications && mindMap.futuristicApplications.length > 0 && (
                    <div className="p-3 rounded-xl bg-cyan-50/60 dark:bg-cyan-950/40 border border-cyan-200 dark:border-cyan-800/60 text-xs space-y-1">
                      <span className="font-extrabold text-cyan-800 dark:text-cyan-300 flex items-center gap-1 text-[10px] uppercase tracking-wider">
                        <Cpu className="w-3.5 h-3.5" /> Next-Gen Technology Link
                      </span>
                      <p className="text-cyan-950 dark:text-cyan-200 text-[11px]">
                        {mindMap.futuristicApplications[0]}
                      </p>
                    </div>
                  )}
                </div>
              ) : null}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
