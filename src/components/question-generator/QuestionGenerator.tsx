import React, { useState } from "react";
import {
  Zap,
  Sparkles,
  HelpCircle,
  Trophy,
  CheckCircle2,
  BookmarkPlus,
  Plus,
  Play,
  ArrowRight,
} from "lucide-react";
import { useStudy } from "../../context/StudyContext";
import { apiService } from "../../services/api";
import { Question, QuestionType, Quiz } from "../../types";

export const QuestionGenerator: React.FC = () => {
  const { subjects, addQuiz, startQuiz, addToast, triggerConfetti } = useStudy();

  const [topic, setTopic] = useState("");
  const [selectedSubjectId, setSelectedSubjectId] = useState(subjects[0]?.id || "");
  const [questionType, setQuestionType] = useState<QuestionType>("MCQ");
  const [difficulty, setDifficulty] = useState<"Easy" | "Medium" | "Hard">("Medium");
  const [count, setCount] = useState<number>(5);
  const [selectedModel, setSelectedModel] = useState("gemini-3.1-flash-lite");
  const [isLoading, setIsLoading] = useState(false);
  const [generatedQuestions, setGeneratedQuestions] = useState<Question[]>([]);

  const questionTypes: QuestionType[] = [
    "MCQ",
    "True/False",
    "Fill in the Blanks",
    "Short Answer",
    "Long Answer",
    "Assertion & Reason",
    "Numerical Problem",
    "Case-Based Question",
  ];

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim()) return;

    setIsLoading(true);
    const sub = subjects.find((s) => s.id === selectedSubjectId);

    try {
      const data = await apiService.generateQuestions({
        topic,
        questionType,
        difficulty,
        count,
        subject: sub?.name,
        model: selectedModel,
      });

      const formatted: Question[] = (data || []).map((q: any, idx: number) => ({
        id: q.id || `gen_q_${Date.now()}_${idx}`,
        type: q.type || questionType,
        difficulty: q.difficulty || difficulty,
        question: q.question,
        options: q.options || undefined,
        correctAnswer: q.correctAnswer || (q.options ? q.options[q.correctIndex || 0] : "Verified Concept"),
        correctIndex: q.correctIndex,
        explanation: q.explanation || "Detailed reasoning according to standard syllabus.",
        hint: q.hint || "Review the governing theory.",
      }));

      setGeneratedQuestions(formatted);
      triggerConfetti();
      addToast(`Generated ${formatted.length} ${questionType} questions! ❓`);
    } catch (e) {
      addToast("Failed to generate questions", undefined, "error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateQuizAndStart = () => {
    if (generatedQuestions.length === 0) return;

    const newQuiz: Quiz = {
      id: `quiz_${Date.now()}`,
      subjectId: selectedSubjectId || subjects[0]?.id || "sub_1",
      chapterId: "chap_1",
      title: `${topic} (${questionType})`,
      description: `AI Generated practice test covering ${topic}.`,
      difficulty,
      totalQuestions: generatedQuestions.length,
      timeLimitMinutes: Math.max(5, generatedQuestions.length * 2),
      questions: generatedQuestions,
      category: "Chapter Test",
    };

    addQuiz(newQuiz);
    startQuiz(newQuiz);
  };

  return (
    <div className="space-y-6 pb-12">
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300 text-xs font-semibold border border-amber-200/60 dark:border-amber-800/40 mb-2">
          <Zap className="w-3.5 h-3.5" />
          <span>Curriculum Exam Pattern AI</span>
        </div>
        <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">
          AI Question & Test Generator
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
          Generate targeted question sets in 8 distinct academic exam formats with custom difficulty.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Generator Controls */}
        <div className="lg:col-span-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 sm:p-6 shadow-xs space-y-4">
          <form onSubmit={handleGenerate} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                Topic / Syllabus Chapter *
              </label>
              <input
                type="text"
                required
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="e.g. Thermodynamics, Kinematics, Mughal Empire, Cell Cycle"
                className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-250 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                Subject
              </label>
              <select
                value={selectedSubjectId}
                onChange={(e) => setSelectedSubjectId(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-250 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none"
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
                Question Type Pattern (8 Formats)
              </label>
              <select
                value={questionType}
                onChange={(e) => setQuestionType(e.target.value as any)}
                className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-250 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none"
              >
                {questionTypes.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                  Difficulty
                </label>
                <select
                  value={difficulty}
                  onChange={(e) => setDifficulty(e.target.value as any)}
                  className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-250 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none"
                >
                  <option value="Easy">Easy (Fundamental)</option>
                  <option value="Medium">Medium (Standard Exam)</option>
                  <option value="Hard">Hard (Advanced / Competitive)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                  Count of Questions
                </label>
                <select
                  value={count}
                  onChange={(e) => setCount(Number(e.target.value))}
                  className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-250 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none"
                >
                  <option value={3}>3 Questions</option>
                  <option value={5}>5 Questions</option>
                  <option value={10}>10 Questions</option>
                  <option value={15}>15 Questions</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                Gemini AI Engine
              </label>
              <select
                value={selectedModel}
                onChange={(e) => setSelectedModel(e.target.value)}
                className="w-full px-3 py-2 text-xs font-semibold rounded-xl bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 focus:outline-none"
              >
                <option value="gemini-3.8-flash">⚡ Gemini 3.8 Flash (Ultra-Fast)</option>
                <option value="gemini-3.1-pro-preview">🧠 Gemini 3.1 Pro (Deep STEM & Rigor)</option>
                <option value="gemini-3.1-flash-lite">🚀 Gemini 3.1 Flash-Lite (Instant Speed)</option>
                <option value="gemini-flash-latest">🌐 Gemini Flash Latest (Adaptive)</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={!topic.trim() || isLoading}
              className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white text-xs sm:text-sm font-semibold shadow-sm transition-all flex items-center justify-center gap-2 active:scale-95"
            >
              <Zap className="w-4 h-4" />
              <span>{isLoading ? "Generating Exam Questions..." : "Generate Question Set"}</span>
            </button>
          </form>
        </div>

        {/* Output Panel */}
        <div className="lg:col-span-7 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 sm:p-6 shadow-xs flex flex-col justify-between min-h-[440px]">
          {generatedQuestions.length > 0 ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                <div>
                  <span className="text-xs font-bold text-amber-600 dark:text-amber-400 uppercase">
                    {generatedQuestions.length} Questions • {difficulty} • {questionType}
                  </span>
                  <h4 className="text-base font-bold text-slate-900 dark:text-white mt-0.5">
                    {topic}
                  </h4>
                </div>

                <button
                  onClick={handleCreateQuizAndStart}
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-sm transition-all flex items-center gap-2"
                >
                  <Play className="w-3.5 h-3.5 fill-white" />
                  <span>Launch Practice Test</span>
                </button>
              </div>

              <div className="max-h-[450px] overflow-y-auto space-y-3.5 pr-2">
                {generatedQuestions.map((q, idx) => (
                  <div
                    key={q.id}
                    className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700 space-y-2.5"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400">
                        Question {idx + 1} ({q.type})
                      </span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                        {q.difficulty}
                      </span>
                    </div>

                    <p className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-white">
                      {q.question}
                    </p>

                    {q.options && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                        {q.options.map((opt, optIdx) => (
                          <div
                            key={optIdx}
                            className={`p-2 rounded-lg text-xs border ${
                              optIdx === q.correctIndex
                                ? "bg-emerald-50 dark:bg-emerald-950/60 border-emerald-400 text-emerald-800 dark:text-emerald-200 font-bold"
                                : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300"
                            }`}
                          >
                            <span className="mr-1">{String.fromCharCode(65 + optIdx)}.</span>
                            {opt}
                          </div>
                        ))}
                      </div>
                    )}

                    <div className="pt-2 border-t border-slate-200/60 dark:border-slate-700/60 text-xs text-slate-600 dark:text-slate-300 space-y-1">
                      <p>
                        <strong className="text-slate-900 dark:text-white">Correct Answer:</strong>{" "}
                        {q.correctAnswer}
                      </p>
                      {q.explanation && (
                        <p className="text-[11px] text-slate-500 dark:text-slate-400">
                          💡 {q.explanation}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center text-center p-8 m-auto">
              <div className="w-12 h-12 rounded-xl bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400 flex items-center justify-center mb-3">
                <HelpCircle className="w-6 h-6" />
              </div>
              <h4 className="text-base font-bold text-slate-900 dark:text-white">
                Exam Question Generator Ready
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mt-1">
                Configure your topic, choose from 8 syllabus question formats, and let AI generate a targeted question set or instant mock test.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
