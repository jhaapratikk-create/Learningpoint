import React, { useState, useRef, useEffect } from "react";
import {
  Send,
  Sparkles,
  Bot,
  User,
  Copy,
  Check,
  BookmarkPlus,
  RotateCcw,
  Volume2,
  Globe,
  Plus,
  Trash2,
  Edit2,
  Mic,
  MicOff,
  Layers,
  MessageSquare,
  BookOpen,
  Zap,
} from "lucide-react";
import { useStudy } from "../../context/StudyContext";
import { AIChatMode, ChatMessage } from "../../types";
import { apiService } from "../../services/api";
import { MarkdownRenderer } from "../common/MarkdownRenderer";

export const AITutorChat: React.FC = () => {
  const {
    chatConversations,
    activeChatId,
    setActiveChatId,
    addChatMessage,
    createNewChat,
    deleteChat,
    renameChat,
    addNote,
    addFlashcard,
    subjects,
    addToast,
    triggerConfetti,
  } = useStudy();

  const activeChat =
    chatConversations.find((c) => c.id === activeChatId) || chatConversations[0];

  const [inputMessage, setInputMessage] = useState("");
  const [selectedMode, setSelectedMode] = useState<AIChatMode>("partner");
  const [selectedSubject, setSelectedSubject] = useState<string>("All Subjects");
  const [selectedModel, setSelectedModel] = useState<string>("gemini-3.1-flash-lite");
  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isListening, setIsListening] = useState(false);
  const [editingChatTitle, setEditingChatTitle] = useState<string | null>(null);
  const [newTitleText, setNewTitleText] = useState("");

  const availableModels = [
    { id: "gemini-3.1-flash-lite", name: "Gemini 3.1 Flash-Lite", badge: "🚀 Instant & High-Availability", provider: "Google" },
    { id: "gemini-3.8-flash", name: "Gemini 3.8 Flash", badge: "⚡ Ultra-Fast Partner", provider: "Google" },
    { id: "gemini-flash-latest", name: "Gemini Flash Latest", badge: "🌐 Adaptive High-Speed", provider: "Google" },
    { id: "gemini-3.1-pro-preview", name: "Gemini 3.1 Pro", badge: "🧠 Deep STEM", provider: "Google" },
  ];

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [activeChat?.messages, isLoading]);

  const modes: { id: AIChatMode; label: string; desc: string; icon: string }[] = [
    { id: "partner", label: "Gemini Partner", desc: "Your study & life companion: ask any academic or real-life question", icon: "✨" },
    { id: "mentor", label: "Mentor Guidance", desc: "Long-term study habits, mindset & motivation", icon: "🧭" },
    { id: "step-by-step", label: "Step-by-Step", desc: "Detailed sequential breakdown", icon: "🔢" },
    { id: "simple", label: "Simple & Clear", desc: "Easy for beginners to grasp", icon: "💡" },
    { id: "detailed", label: "Comprehensive", desc: "In-depth academic mastery", icon: "📖" },
    { id: "exam-oriented", label: "Exam Format", desc: "High-scoring bullet answers", icon: "🎯" },
    { id: "quick-revision", label: "Revision Note", desc: "Rapid bullet summary", icon: "⚡" },
    { id: "examples-analogies", label: "Analogies", desc: "Real-world relatable examples", icon: "🧠" },
    { id: "practice-questions", label: "Practice", desc: "Tests your understanding", icon: "❓" },
  ];

  const handleSendMessage = async (customText?: string) => {
    const textToSend = (customText || inputMessage).trim();
    if (!textToSend || isLoading || !activeChat) return;

    const userMsg: ChatMessage = {
      id: `msg_u_${Date.now()}`,
      role: "user",
      content: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      mode: selectedMode,
    };

    addChatMessage(activeChat.id, userMsg);
    if (!customText) setInputMessage("");
    setIsLoading(true);

    try {
      // Build history
      const history = activeChat.messages.slice(-6).map((m) => ({
        role: m.role,
        content: m.content,
      }));

      const res = await apiService.sendChatMessage({
        message: textToSend,
        mode: selectedMode,
        history,
        subject: selectedSubject !== "All Subjects" ? selectedSubject : undefined,
        model: selectedModel,
      });

      const assistantMsg: ChatMessage = {
        id: `msg_a_${Date.now()}`,
        role: "assistant",
        content: res.text,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        mode: selectedMode,
        modelUsed: res.modelUsed || "Gemini 3.8 Flash",
        responseTimeMs: res.responseTimeMs,
      };

      addChatMessage(activeChat.id, assistantMsg);
    } catch (err) {
      addToast("Failed to receive AI response", "Please try again.", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = (text: string, msgId: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(msgId);
    addToast("Copied to clipboard!");
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleSaveToNotes = (text: string) => {
    const firstLine = text.split("\n")[0].replace(/^[#*\s]+/, "") || "AI Study Note";
    const sub = subjects.find((s) => s.name === selectedSubject) || subjects[0];
    addNote({
      title: firstLine.slice(0, 45),
      content: text,
      subjectId: sub ? sub.id : subjects[0]?.id || "sub_1",
      chapterId: "chap_1",
      tags: ["AI Tutor", selectedMode],
      isFavorite: false,
    });
    addToast("Saved to My Notes! 📝");
  };

  const handleCreateFlashcard = (text: string) => {
    const lines = text.split("\n").filter((l) => l.trim().length > 0);
    const front = lines[0]?.replace(/^[#*\s]+/, "").slice(0, 80) || "Key Concept";
    const back = lines.slice(1, 4).join("\n").replace(/^[#*\s]+/, "") || text.slice(0, 150);
    const sub = subjects.find((s) => s.name === selectedSubject) || subjects[0];

    addFlashcard({
      front,
      back,
      subjectId: sub ? sub.id : subjects[0]?.id || "sub_1",
      chapterId: "chap_1",
      difficultyRating: "Medium",
    });
    triggerConfetti();
    addToast("Converted to Flashcard! 🃏");
  };

  const handleSpeak = (text: string) => {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const cleanText = text.replace(/[*#`$\\]/g, "");
      const utterance = new SpeechSynthesisUtterance(cleanText.slice(0, 300));
      utterance.rate = 1.0;
      window.speechSynthesis.speak(utterance);
      addToast("Speaking answer aloud 🔊");
    } else {
      addToast("Speech synthesis not supported in this browser", undefined, "info");
    }
  };

  // Voice dictation simulation
  const toggleSpeechRecognition = () => {
    if (isListening) {
      setIsListening(false);
      return;
    }

    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      addToast("Voice recognition not supported in browser, type your prompt directly.", undefined, "info");
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = "en-US";

      setIsListening(true);
      addToast("Listening... Speak your study question 🎙️");

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInputMessage((prev) => (prev ? `${prev} ${transcript}` : transcript));
        setIsListening(false);
      };

      recognition.onerror = () => {
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
    } catch (e) {
      setIsListening(false);
    }
  };

  return (
    <div className="flex h-[calc(100vh-6.5rem)] rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
      {/* Left Chat History Panel (Desktop) */}
      <div className="hidden md:flex flex-col w-64 border-r border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 shrink-0">
        <div className="p-3 border-b border-slate-200 dark:border-slate-800">
          <button
            onClick={() => createNewChat("New Study Session", selectedSubject)}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-xs transition-all active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>New Chat Session</span>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          <p className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Recent Conversations
          </p>
          {chatConversations.map((chat) => {
            const isActive = chat.id === activeChatId;
            return (
              <div
                key={chat.id}
                onClick={() => setActiveChatId(chat.id)}
                className={`group flex items-center justify-between p-2.5 rounded-xl cursor-pointer transition-colors text-xs ${
                  isActive
                    ? "bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 font-semibold"
                    : "text-slate-600 dark:text-slate-350 hover:bg-slate-100 dark:hover:bg-slate-800"
                }`}
              >
                <div className="flex items-center gap-2 min-w-0 flex-1">
                  <MessageSquare className="w-3.5 h-3.5 shrink-0 opacity-70" />
                  {editingChatTitle === chat.id ? (
                    <input
                      type="text"
                      autoFocus
                      value={newTitleText}
                      onChange={(e) => setNewTitleText(e.target.value)}
                      onBlur={() => {
                        if (newTitleText.trim()) renameChat(chat.id, newTitleText.trim());
                        setEditingChatTitle(null);
                      }}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          if (newTitleText.trim()) renameChat(chat.id, newTitleText.trim());
                          setEditingChatTitle(null);
                        }
                      }}
                      className="w-full bg-white dark:bg-slate-800 px-1 py-0.5 rounded border border-indigo-400 text-xs text-slate-900 dark:text-white"
                    />
                  ) : (
                    <span className="truncate">{chat.title}</span>
                  )}
                </div>

                <div className="hidden group-hover:flex items-center gap-1 shrink-0">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setEditingChatTitle(chat.id);
                      setNewTitleText(chat.title);
                    }}
                    className="p-1 hover:text-slate-900 dark:hover:text-white"
                  >
                    <Edit2 className="w-3 h-3" />
                  </button>
                  {chatConversations.length > 1 && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteChat(chat.id);
                      }}
                      className="p-1 hover:text-rose-500"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col min-w-0 bg-white dark:bg-slate-900">
        {/* Top Control Bar: Subject Filter & Mode Pills */}
        <div className="p-3 sm:px-4 border-b border-slate-200 dark:border-slate-800 flex flex-col gap-2.5 bg-slate-50/70 dark:bg-slate-900/70">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 min-w-0">
              <div className="p-1.5 rounded-lg bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400">
                <Bot className="w-4 h-4" />
              </div>
              <span className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white truncate">
                {activeChat?.title || "AI Academic Tutor"}
              </span>
            </div>

            <div className="flex items-center gap-2">
              {/* AI Model Selector */}
              <div className="flex items-center gap-1.5 bg-white dark:bg-slate-800 px-2.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-2xs">
                <Zap className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                <select
                  value={selectedModel}
                  onChange={(e) => setSelectedModel(e.target.value)}
                  className="text-xs font-semibold bg-transparent text-slate-800 dark:text-slate-200 focus:outline-none cursor-pointer"
                  title="Choose Google Gemini Model"
                >
                  {availableModels.map((m) => (
                    <option key={m.id} value={m.id} className="dark:bg-slate-800 text-slate-900 dark:text-white">
                      {m.badge} {m.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Subject Selector */}
              <select
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value)}
                className="text-xs font-semibold px-2.5 py-1.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-250 dark:border-slate-700 text-slate-700 dark:text-slate-200 focus:outline-none"
              >
                <option value="All Subjects">All Subjects</option>
                {subjects.map((s) => (
                  <option key={s.id} value={s.name}>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Mode Selector Pill Scroller */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            {modes.map((m) => {
              const isSelected = selectedMode === m.id;
              return (
                <button
                  key={m.id}
                  onClick={() => setSelectedMode(m.id)}
                  title={m.desc}
                  className={`shrink-0 flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium transition-all ${
                    isSelected
                      ? "bg-indigo-600 text-white shadow-xs font-semibold"
                      : "bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-350 hover:bg-slate-100 dark:hover:bg-slate-750 border border-slate-200 dark:border-slate-700/60"
                  }`}
                >
                  <span>{m.icon}</span>
                  <span>{m.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Message Thread */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5">
          {(!activeChat?.messages || activeChat.messages.length === 0) && (
            <div className="flex flex-col items-center justify-center py-10 px-4 text-center max-w-lg mx-auto space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 to-blue-500 text-white flex items-center justify-center shadow-md">
                <Sparkles className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Gemini AI Study & Life Partner
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                  I'm here for all your questions—from tough STEM derivations and exam practice to daily study routines, motivation, and handling student stress.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 w-full pt-2">
                {[
                  { text: "How do I study 3 hours without losing focus?", tag: "Study Habit" },
                  { text: "Explain Newton's Laws with real-life examples", tag: "Physics" },
                  { text: "Solve: Integrate x * sin(x) dx step-by-step", tag: "Math" },
                  { text: "How should I structure my daily exam revision?", tag: "Strategy" },
                ].map((prompt, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSendMessage(prompt.text)}
                    className="p-3 text-left rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-250 dark:border-slate-750 hover:border-indigo-500 text-xs text-slate-700 dark:text-slate-200 transition-all hover:shadow-xs group"
                  >
                    <span className="block text-[10px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 mb-1">
                      {prompt.tag}
                    </span>
                    <span className="group-hover:text-indigo-600 dark:group-hover:text-indigo-400">
                      "{prompt.text}"
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {activeChat?.messages.map((msg) => {
            const isUser = msg.role === "user";
            return (
              <div
                key={msg.id}
                className={`flex items-start gap-3 max-w-3xl ${isUser ? "ml-auto flex-row-reverse" : "mr-auto"}`}
              >
                {/* Avatar */}
                <div
                  className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 text-xs font-bold ${
                    isUser
                      ? "bg-indigo-600 text-white shadow-sm"
                      : "bg-gradient-to-tr from-indigo-600 to-blue-500 text-white shadow-sm"
                  }`}
                >
                  {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                </div>

                {/* Bubble Container */}
                <div
                  className={`group relative rounded-2xl p-4 sm:p-5 shadow-xs text-sm leading-relaxed ${
                    isUser
                      ? "bg-indigo-600 text-white rounded-tr-none"
                      : "bg-slate-50 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/70 text-slate-900 dark:text-slate-100 rounded-tl-none"
                  }`}
                >
                  {/* Mode & Model tag */}
                  {!isUser && (
                    <div className="flex items-center justify-between gap-2 text-[10px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 mb-2 pb-1.5 border-b border-slate-200 dark:border-slate-700/60">
                      <div className="flex items-center gap-1.5">
                        <Sparkles className="w-3 h-3" />
                        <span>{modes.find((m) => m.id === msg.mode)?.label || "AI Explanation"}</span>
                      </div>
                      {msg.modelUsed && (
                        <div className="flex items-center gap-1 normal-case font-semibold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-750 px-2 py-0.5 rounded-md text-[10px]">
                          <Zap className="w-3 h-3 text-amber-500 shrink-0" />
                          <span className="truncate max-w-[140px]">{msg.modelUsed}</span>
                          {msg.responseTimeMs ? (
                            <span className="text-emerald-600 dark:text-emerald-400 font-bold shrink-0">
                              • {(msg.responseTimeMs / 1000).toFixed(2)}s
                            </span>
                          ) : null}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Body Content */}
                  {isUser ? (
                    <p className="whitespace-pre-wrap">{msg.content}</p>
                  ) : (
                    <MarkdownRenderer content={msg.content} />
                  )}

                  {/* Timestamp & Tool Actions */}
                  <div
                    className={`mt-3 pt-2 flex items-center justify-between text-[11px] ${
                      isUser
                        ? "text-indigo-200"
                        : "border-t border-slate-200/60 dark:border-slate-700/50 text-slate-400"
                    }`}
                  >
                    <span>{msg.timestamp}</span>

                    {!isUser && (
                      <div className="flex items-center gap-1 opacity-90 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => handleCopy(msg.content, msg.id)}
                          title="Copy Answer"
                          className="p-1 rounded hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-300"
                        >
                          {copiedId === msg.id ? (
                            <Check className="w-3.5 h-3.5 text-emerald-500" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </button>
                        <button
                          onClick={() => handleSpeak(msg.content)}
                          title="Listen to Explanation"
                          className="p-1 rounded hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-300"
                        >
                          <Volume2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleSaveToNotes(msg.content)}
                          title="Save to My Notes"
                          className="p-1 rounded hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-300"
                        >
                          <BookmarkPlus className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleCreateFlashcard(msg.content)}
                          title="Convert to Flashcard"
                          className="p-1 rounded hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-300"
                        >
                          <Layers className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}

          {/* Loading Indicator */}
          {isLoading && (
            <div className="flex items-start gap-3 max-w-2xl mr-auto">
              <div className="w-8 h-8 rounded-xl bg-indigo-600 flex items-center justify-center text-white shrink-0">
                <Bot className="w-4 h-4 animate-bounce" />
              </div>
              <div className="p-4 rounded-2xl rounded-tl-none bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-2">
                <div className="flex items-center gap-2 text-xs font-semibold text-indigo-600 dark:text-indigo-400">
                  <Sparkles className="w-3.5 h-3.5 animate-spin" />
                  <span>AI Tutor formulating structured response...</span>
                </div>
                <div className="space-y-1.5 w-64 animate-pulse">
                  <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-full" />
                  <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-4/5" />
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <div className="p-3 sm:p-4 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center gap-2"
          >
            <button
              type="button"
              onClick={toggleSpeechRecognition}
              title="Voice Dictation"
              className={`p-2.5 rounded-xl border transition-all ${
                isListening
                  ? "bg-rose-500 border-rose-600 text-white animate-pulse"
                  : "bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:text-indigo-600"
              }`}
            >
              {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            </button>

            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder={`Ask Gemini Partner anything (STEM problems, daily routines, stress, or exam tips)...`}
              className="flex-1 px-4 py-2.5 text-xs sm:text-sm rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-250 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />

            <button
              type="submit"
              disabled={!inputMessage.trim() || isLoading}
              className="p-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 disabled:cursor-not-allowed text-white shadow-sm transition-all active:scale-95 shrink-0"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
