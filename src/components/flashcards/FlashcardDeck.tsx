import React, { useState } from "react";
import {
  Layers,
  Sparkles,
  RotateCw,
  Plus,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Clock,
  ArrowLeft,
  ArrowRight,
  Filter,
  Check,
  Zap,
} from "lucide-react";
import { useStudy } from "../../context/StudyContext";
import { Flashcard } from "../../types";
import { Modal } from "../common/Modal";
import { apiService } from "../../services/api";

export const FlashcardDeck: React.FC = () => {
  const { flashcards, addFlashcard, updateFlashcard, deleteFlashcard, subjects, addToast, triggerConfetti } = useStudy();

  const [mode, setMode] = useState<"study" | "manage">("study");
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>("all");
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  // Modal states
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isAIModalOpen, setIsAIModalOpen] = useState(false);
  const [front, setFront] = useState("");
  const [back, setBack] = useState("");
  const [cardSubjectId, setCardSubjectId] = useState(subjects[0]?.id || "");

  // AI Gen state
  const [aiTopic, setAiTopic] = useState("");
  const [aiCount, setAiCount] = useState(5);
  const [isAiLoading, setIsAiLoading] = useState(false);

  const filteredCards = flashcards.filter((fc) => {
    if (selectedSubjectId !== "all" && fc.subjectId !== selectedSubjectId) return false;
    return true;
  });

  const currentCard = filteredCards[currentCardIndex] || filteredCards[0];

  const handleFlip = () => {
    setIsFlipped((prev) => !prev);
  };

  const handleNextCard = () => {
    setIsFlipped(false);
    setCurrentCardIndex((prev) => (prev + 1) % filteredCards.length);
  };

  const handlePrevCard = () => {
    setIsFlipped(false);
    setCurrentCardIndex((prev) => (prev - 1 + filteredCards.length) % filteredCards.length);
  };

  const handleRateCard = (rating: "Easy" | "Medium" | "Hard" | "Again") => {
    if (!currentCard) return;

    const currentInterval = currentCard.intervalDays || 1;
    const currentReps = currentCard.repetitions || currentCard.reviewCount || 0;

    const nextInterval =
      rating === "Easy"
        ? currentInterval * 2 + 1
        : rating === "Medium"
        ? currentInterval + 1
        : 1;

    updateFlashcard(currentCard.id, {
      difficultyRating: rating,
      intervalDays: nextInterval,
      repetitions: currentReps + 1,
      lastReviewed: new Date().toISOString().split("T")[0],
    });

    if (currentCardIndex === filteredCards.length - 1) {
      triggerConfetti();
      addToast("Deck Review Complete! 🎉");
    }
    handleNextCard();
  };

  const handleCreateManual = (e: React.FormEvent) => {
    e.preventDefault();
    if (!front.trim() || !back.trim()) return;

    addFlashcard({
      front,
      back,
      subjectId: cardSubjectId || subjects[0]?.id || "sub_1",
      chapterId: "chap_1",
      difficultyRating: "Medium",
      isFavorite: false,
    });

    setFront("");
    setBack("");
    setIsAddModalOpen(false);
    addToast("Flashcard created! 🃏");
  };

  const handleGenerateWithAI = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiTopic.trim()) return;

    setIsAiLoading(true);
    const sub = subjects.find((s) => s.id === cardSubjectId);

    try {
      const cards = await apiService.generateFlashcards({
        topic: aiTopic,
        count: aiCount,
        subject: sub?.name,
      });

      cards.forEach((c: any) => {
        addFlashcard({
          front: c.front,
          back: c.back,
          subjectId: cardSubjectId || subjects[0]?.id || "sub_1",
          chapterId: "chap_1",
          difficultyRating: "Medium",
          isFavorite: false,
        });
      });

      triggerConfetti();
      addToast(`Generated ${cards.length} Flashcards! 🚀`);
      setIsAIModalOpen(false);
      setAiTopic("");
    } catch (e) {
      addToast("Failed to generate flashcards", undefined, "error");
    } finally {
      setIsAiLoading(false);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header & Mode Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Flashcards & Spaced Repetition
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Optimize long-term recall using automated Leitner interval scheduling.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <div className="p-1 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center gap-1">
            <button
              onClick={() => setMode("study")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                mode === "study"
                  ? "bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs"
                  : "text-slate-600 dark:text-slate-400"
              }`}
            >
              Study Deck
            </button>
            <button
              onClick={() => setMode("manage")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                mode === "manage"
                  ? "bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs"
                  : "text-slate-600 dark:text-slate-400"
              }`}
            >
              Manage ({flashcards.length})
            </button>
          </div>

          <button
            onClick={() => setIsAIModalOpen(true)}
            className="px-3 py-2 rounded-xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-300 text-xs font-semibold border border-indigo-200/60 dark:border-indigo-800/60 hover:bg-indigo-100 flex items-center gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI Generate</span>
          </button>

          <button
            onClick={() => setIsAddModalOpen(true)}
            className="px-3 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-xs flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Card</span>
          </button>
        </div>
      </div>

      {/* Filter by Subject */}
      <div className="flex items-center gap-3 overflow-x-auto pb-1 scrollbar-none">
        <button
          onClick={() => {
            setSelectedSubjectId("all");
            setCurrentCardIndex(0);
          }}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all shrink-0 ${
            selectedSubjectId === "all"
              ? "bg-indigo-600 text-white shadow-xs"
              : "bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400"
          }`}
        >
          All Subjects ({flashcards.length})
        </button>

        {subjects.map((s) => {
          const count = flashcards.filter((f) => f.subjectId === s.id).length;
          return (
            <button
              key={s.id}
              onClick={() => {
                setSelectedSubjectId(s.id);
                setCurrentCardIndex(0);
              }}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all shrink-0 flex items-center gap-1.5 ${
                selectedSubjectId === s.id
                  ? "bg-indigo-600 text-white shadow-xs"
                  : "bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400"
              }`}
            >
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: s.color }} />
              <span>{s.name}</span>
              <span className="opacity-70">({count})</span>
            </button>
          );
        })}
      </div>

      {/* MODE 1: STUDY DECK */}
      {mode === "study" && (
        <div className="max-w-2xl mx-auto space-y-6">
          {filteredCards.length === 0 ? (
            <div className="text-center p-12 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
              <p className="text-sm font-semibold text-slate-600 dark:text-slate-300">
                No flashcards in this subject deck.
              </p>
              <button
                onClick={() => setIsAIModalOpen(true)}
                className="mt-3 px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-semibold"
              >
                Generate Cards with AI
              </button>
            </div>
          ) : (
            <div className="space-y-5">
              {/* Progress counter */}
              <div className="flex items-center justify-between text-xs font-semibold text-slate-400">
                <span>
                  Card {currentCardIndex + 1} of {filteredCards.length}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  Interval: {currentCard.intervalDays || 1} Days
                </span>
              </div>

              {/* Interactive Flip Card */}
              <div
                onClick={handleFlip}
                className="min-h-[280px] sm:min-h-[320px] rounded-3xl bg-white dark:bg-slate-900 border-2 border-indigo-100 dark:border-slate-800 p-8 sm:p-10 shadow-md hover:shadow-xl transition-all cursor-pointer flex flex-col justify-between text-center select-none"
              >
                <div className="flex items-center justify-between text-xs">
                  <span className="font-extrabold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                    {isFlipped ? "Answer / Explanation" : "Question / Prompt"}
                  </span>
                  <span className="text-[11px] text-slate-400 flex items-center gap-1">
                    <RotateCw className="w-3.5 h-3.5" />
                    Click anywhere to flip
                  </span>
                </div>

                <div className="my-auto py-4">
                  <h3
                    className={`text-lg sm:text-2xl font-extrabold transition-all leading-relaxed ${
                      isFlipped
                        ? "text-emerald-950 dark:text-emerald-200"
                        : "text-slate-900 dark:text-white"
                    }`}
                  >
                    {isFlipped ? currentCard.back : currentCard.front}
                  </h3>
                </div>

                <div className="flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800">
                  <span>Rating: {currentCard.difficultyRating}</span>
                  <span>{currentCard.repetitions || currentCard.reviewCount || 0} Reviews</span>
                </div>
              </div>

              {/* Rating Buttons (Visible when flipped or ready) */}
              {isFlipped ? (
                <div className="space-y-2">
                  <p className="text-center text-xs font-bold text-slate-400 uppercase">
                    Rate Recall Confidence:
                  </p>
                  <div className="grid grid-cols-4 gap-2.5">
                    <button
                      onClick={() => handleRateCard("Again")}
                      className="py-2.5 rounded-xl bg-rose-50 dark:bg-rose-950/60 hover:bg-rose-100 text-rose-700 dark:text-rose-300 font-bold text-xs border border-rose-200 dark:border-rose-900 transition-all active:scale-95"
                    >
                      Again (&lt;10m)
                    </button>
                    <button
                      onClick={() => handleRateCard("Hard")}
                      className="py-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/60 hover:bg-amber-100 text-amber-700 dark:text-amber-300 font-bold text-xs border border-amber-200 dark:border-amber-900 transition-all active:scale-95"
                    >
                      Hard (1 Day)
                    </button>
                    <button
                      onClick={() => handleRateCard("Medium")}
                      className="py-2.5 rounded-xl bg-blue-50 dark:bg-blue-950/60 hover:bg-blue-100 text-blue-700 dark:text-blue-300 font-bold text-xs border border-blue-200 dark:border-blue-900 transition-all active:scale-95"
                    >
                      Good (3 Days)
                    </button>
                    <button
                      onClick={() => handleRateCard("Easy")}
                      className="py-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 hover:bg-emerald-100 text-emerald-700 dark:text-emerald-300 font-bold text-xs border border-emerald-200 dark:border-emerald-900 transition-all active:scale-95"
                    >
                      Easy (7 Days)
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-between">
                  <button
                    onClick={handlePrevCard}
                    className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50 text-xs font-semibold flex items-center gap-1"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Previous</span>
                  </button>
                  <button
                    onClick={handleFlip}
                    className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-sm transition-all"
                  >
                    Reveal Answer (Space)
                  </button>
                  <button
                    onClick={handleNextCard}
                    className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50 text-xs font-semibold flex items-center gap-1"
                  >
                    <span>Next</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* MODE 2: MANAGE CARDS */}
      {mode === "manage" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredCards.map((card) => {
            const sub = subjects.find((s) => s.id === card.subjectId);
            return (
              <div
                key={card.id}
                className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3 flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300">
                      {sub?.name || "General"}
                    </span>
                    <button
                      onClick={() => deleteFlashcard(card.id)}
                      className="p-1 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <p className="text-xs font-bold text-slate-900 dark:text-white">
                    Q: {card.front}
                  </p>
                  <p className="text-xs text-slate-600 dark:text-slate-400 border-t border-slate-100 dark:border-slate-800 pt-2 leading-relaxed">
                    A: {card.back}
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
                  <span>Rating: {card.difficultyRating}</span>
                  <span>Interval: {card.intervalDays || 1}d</span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Manual Add Card Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Create New Flashcard"
        subtitle="Add a custom concept pair to your study deck"
      >
        <form onSubmit={handleCreateManual} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
              Select Subject *
            </label>
            <select
              value={cardSubjectId}
              onChange={(e) => setCardSubjectId(e.target.value)}
              className="w-full px-3.5 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-250 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none"
            >
              {subjects.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
              Front (Question / Term) *
            </label>
            <textarea
              rows={2}
              required
              value={front}
              onChange={(e) => setFront(e.target.value)}
              placeholder="e.g. What is Hooke's Law?"
              className="w-full px-3.5 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-250 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
              Back (Answer / Definition) *
            </label>
            <textarea
              rows={3}
              required
              value={back}
              onChange={(e) => setBack(e.target.value)}
              placeholder="e.g. F = -k * x (Force exerted by a spring is directly proportional to displacement)"
              className="w-full px-3.5 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-250 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none"
            />
          </div>

          <div className="flex justify-end gap-2.5 pt-3 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={() => setIsAddModalOpen(false)}
              className="px-4 py-2 text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-xs font-semibold rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm"
            >
              Add Flashcard
            </button>
          </div>
        </form>
      </Modal>

      {/* AI Generate Cards Modal */}
      <Modal
        isOpen={isAIModalOpen}
        onClose={() => setIsAIModalOpen(false)}
        title="AI Flashcards Generator"
        subtitle="Instantly produce high-yield flashcards on any topic"
      >
        <form onSubmit={handleGenerateWithAI} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
              Topic / Chapter *
            </label>
            <input
              type="text"
              required
              value={aiTopic}
              onChange={(e) => setAiTopic(e.target.value)}
              placeholder="e.g. Cell Membrane Transport, Calculus Limits, World War 2 Causes"
              className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-250 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                Subject
              </label>
              <select
                value={cardSubjectId}
                onChange={(e) => setCardSubjectId(e.target.value)}
                className="w-full px-3.5 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-250 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none"
              >
                {subjects.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                Number of Cards
              </label>
              <select
                value={aiCount}
                onChange={(e) => setAiCount(Number(e.target.value))}
                className="w-full px-3.5 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-250 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none"
              >
                <option value={3}>3 Cards</option>
                <option value={5}>5 Cards</option>
                <option value={10}>10 Cards</option>
                <option value={15}>15 Cards</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-2.5 pt-3 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={() => setIsAIModalOpen(false)}
              className="px-4 py-2 text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isAiLoading || !aiTopic.trim()}
              className="px-4 py-2 text-xs font-semibold rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white shadow-sm flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{isAiLoading ? "Generating Cards..." : "Generate Cards"}</span>
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
