import React, { useState } from "react";
import {
  Sparkles,
  BookOpen,
  Trophy,
  Clock,
  CheckCircle2,
  FileText,
  Send,
  HelpCircle,
  Award,
  ChevronDown,
  ChevronUp,
  AlertCircle,
  RotateCcw,
  Zap,
  Printer,
  Share2,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useStudy } from "../../context/StudyContext";
import { apiService } from "../../services/api";
import { AITestPaper, AITestEvaluationResult } from "../../types";

export const AITestPaperGenerator: React.FC = () => {
  const { user } = useAuth();
  const { subjects, addToast, triggerConfetti } = useStudy();

  // Test Paper Config
  const [selectedSubject, setSelectedSubject] = useState(subjects[0]?.name || "Mathematics");
  const [topic, setTopic] = useState("Calculus & Algebra");
  const [grade, setGrade] = useState(user?.grade || "Class 12");
  const [targetExam, setTargetExam] = useState(user?.targetExam || "Board Examination");
  const [difficulty, setDifficulty] = useState<"Easy" | "Medium" | "Hard" | "Mixed">("Medium");
  const [questionCount, setQuestionCount] = useState(8);
  const [durationMinutes, setDurationMinutes] = useState(45);
  const [selectedModel, setSelectedModel] = useState("gemini-3.1-flash-lite");

  // State for generated paper
  const [isLoading, setIsLoading] = useState(false);
  const [currentPaper, setCurrentPaper] = useState<AITestPaper | null>(null);

  // Student Answers
  const [studentAnswers, setStudentAnswers] = useState<{ [questionId: string]: string }>({});
  const [showHints, setShowHints] = useState<{ [questionId: string]: boolean }>({});
  const [showModelAnswers, setShowModelAnswers] = useState<{ [questionId: string]: boolean }>({});

  // Evaluation state
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [evaluation, setEvaluation] = useState<AITestEvaluationResult | null>(null);

  const handleGeneratePaper = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim()) return;

    setIsLoading(true);
    setEvaluation(null);
    setStudentAnswers({});
    try {
      const paper = await apiService.generateTestPaper({
        subject: selectedSubject,
        topic,
        grade,
        targetExam,
        difficulty,
        questionCount,
        durationMinutes,
      });

      setCurrentPaper(paper);
      triggerConfetti();
      addToast(`New Exam Paper Generated! 📝`, `${paper.title} (${paper.totalMarks} Marks)`);
    } catch (err) {
      addToast("Failed to generate test paper", undefined, "error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAnswerChange = (questionId: string, val: string) => {
    setStudentAnswers((prev) => ({
      ...prev,
      [questionId]: val,
    }));
  };

  const toggleHint = (qId: string) => {
    setShowHints((prev) => ({ ...prev, [qId]: !prev[qId] }));
  };

  const toggleModelAnswer = (qId: string) => {
    setShowModelAnswers((prev) => ({ ...prev, [qId]: !prev[qId] }));
  };

  const handleSubmitForEvaluation = async () => {
    if (!currentPaper) return;

    const allQuestions = currentPaper.sections.flatMap((s) => s.questions);
    setIsEvaluating(true);
    try {
      const evalResult = await apiService.evaluateTestPaper({
        paperTitle: currentPaper.title,
        subject: currentPaper.subject,
        questions: allQuestions,
        studentAnswers,
      });

      setEvaluation(evalResult);
      triggerConfetti();
      addToast(`Paper Evaluated by Gemini! 🏆`, `Score: ${evalResult.totalScoreAwarded}/${evalResult.maxScore} (${evalResult.percentage}%)`);
    } catch (err) {
      addToast("Evaluation failed", undefined, "error");
    } finally {
      setIsEvaluating(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 border border-blue-500/20 p-6 sm:p-7 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-300 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-blue-300 animate-pulse" />
              <span>Google Gemini AI Test Paper & Question Architect</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white">
              Create New Test Papers & Questions with Gemini
            </h2>
            <p className="text-xs sm:text-sm text-indigo-200/90 leading-relaxed">
              Generate authentic examination papers with balanced Section A (MCQs), Section B (Short Conceptual), and Section C (Derivations & Numericals) with full step-marking rubrics.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <div className="text-right hidden sm:block">
              <span className="text-[10px] text-blue-200 uppercase font-bold block">AI Engine</span>
              <span className="text-xs font-bold text-white">Google Gemini</span>
            </div>
            <div className="p-3 rounded-2xl bg-white/10 border border-white/10">
              <Zap className="w-6 h-6 text-amber-300" />
            </div>
          </div>
        </div>
      </div>

      {/* Generator Form */}
      <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 sm:p-6 shadow-xs space-y-4">
        <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <FileText className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
          <span>Configure Exam Paper Specifications</span>
        </h3>

        <form onSubmit={handleGeneratePaper} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                Subject
              </label>
              <select
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-250 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                {subjects.map((s) => (
                  <option key={s.id} value={s.name}>
                    {s.name}
                  </option>
                ))}
                <option value="Physics">Physics</option>
                <option value="Chemistry">Chemistry</option>
                <option value="Mathematics">Mathematics</option>
                <option value="Biology">Biology</option>
                <option value="English">English</option>
                <option value="Social Science">Social Science</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                Class / Grade
              </label>
              <input
                type="text"
                value={grade}
                onChange={(e) => setGrade(e.target.value)}
                placeholder="e.g. Class 12, Class 10"
                className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-250 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                Target Exam Pattern
              </label>
              <select
                value={targetExam}
                onChange={(e) => setTargetExam(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-250 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="Board Examination">CBSE / State Board Exam</option>
                <option value="IIT JEE Main & Advanced">IIT JEE Main & Advanced</option>
                <option value="NEET UG">NEET UG</option>
                <option value="CUET Examination">CUET UG</option>
                <option value="School Midterm / Final">School Term / Unit Test</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                Gemini AI Engine
              </label>
              <select
                value={selectedModel}
                onChange={(e) => setSelectedModel(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 font-semibold focus:outline-none"
              >
                <option value="gemini-3.8-flash">⚡ Gemini 3.8 Flash (Ultra-Fast)</option>
                <option value="gemini-3.1-pro-preview">🧠 Gemini 3.1 Pro (Deep STEM)</option>
                <option value="gemini-3.1-flash-lite">🚀 Gemini 3.1 Flash-Lite (Instant)</option>
                <option value="gemini-flash-latest">🌐 Gemini Flash Latest (Adaptive)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                Chapter / Topic Syllabus *
              </label>
              <input
                type="text"
                required
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="e.g. Electromagnetic Waves & Ray Optics, Integration, Chemical Kinetics"
                className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-250 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                  Questions
                </label>
                <select
                  value={questionCount}
                  onChange={(e) => setQuestionCount(Number(e.target.value))}
                  className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-250 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none"
                >
                  <option value={5}>5 Questions</option>
                  <option value={8}>8 Questions</option>
                  <option value={12}>12 Questions</option>
                  <option value={15}>15 Questions</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                  Duration
                </label>
                <select
                  value={durationMinutes}
                  onChange={(e) => setDurationMinutes(Number(e.target.value))}
                  className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-250 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none"
                >
                  <option value={30}>30 Mins</option>
                  <option value={45}>45 Mins</option>
                  <option value={60}>60 Mins</option>
                  <option value={90}>90 Mins</option>
                </select>
              </div>
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              disabled={!topic.trim() || isLoading}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 disabled:opacity-50 text-white font-bold text-xs sm:text-sm flex items-center gap-2 shadow-md shadow-indigo-600/30 transition-all active:scale-95"
            >
              <Sparkles className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`} />
              <span>{isLoading ? "Gemini Generating Test Paper..." : "Generate Test Paper with Gemini"}</span>
            </button>
          </div>
        </form>
      </div>

      {/* Generated Paper View */}
      {currentPaper && (
        <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-md space-y-6 animate-in fade-in">
          {/* Header of paper */}
          <div className="text-center border-b border-slate-200 dark:border-slate-800 pb-5 space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 text-xs font-bold border border-indigo-200/60">
              <Award className="w-3.5 h-3.5" />
              <span>{currentPaper.targetExam} Practice Paper</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              {currentPaper.title}
            </h3>
            <div className="flex items-center justify-center gap-4 text-xs font-semibold text-slate-600 dark:text-slate-400 flex-wrap">
              <span>Class: {currentPaper.grade}</span>
              <span>•</span>
              <span>Subject: {currentPaper.subject}</span>
              <span>•</span>
              <span className="text-amber-600 dark:text-amber-400 font-bold">
                Total Marks: {currentPaper.totalMarks}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1 text-indigo-600 dark:text-indigo-400 font-bold">
                <Clock className="w-3.5 h-3.5" />
                Time Allowed: {currentPaper.durationMinutes} Mins
              </span>
            </div>

            {/* Instructions */}
            {currentPaper.instructions && currentPaper.instructions.length > 0 && (
              <div className="mt-3 p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 text-left text-xs text-slate-600 dark:text-slate-300">
                <p className="font-bold text-slate-900 dark:text-white mb-1">General Instructions:</p>
                <ul className="list-disc list-inside space-y-0.5 text-[11px]">
                  {currentPaper.instructions.map((inst, i) => (
                    <li key={i}>{inst}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Evaluation Banner if evaluated */}
          {evaluation && (
            <div className="rounded-2xl bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 border border-emerald-500/30 p-5 text-white space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Trophy className="w-6 h-6 text-amber-300" />
                  <h4 className="text-lg font-black">Gemini AI Evaluation Report</h4>
                </div>
                <div className="px-3 py-1 rounded-xl bg-white/20 text-xs font-extrabold">
                  Grade {evaluation.grade} • {evaluation.percentage}%
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3 text-center">
                <div className="p-2.5 rounded-xl bg-white/10">
                  <span className="text-[10px] text-emerald-200 block uppercase font-bold">Score Awarded</span>
                  <span className="text-xl font-black">{evaluation.totalScoreAwarded} / {evaluation.maxScore}</span>
                </div>
                <div className="p-2.5 rounded-xl bg-white/10">
                  <span className="text-[10px] text-emerald-200 block uppercase font-bold">Percentage</span>
                  <span className="text-xl font-black">{evaluation.percentage}%</span>
                </div>
                <div className="p-2.5 rounded-xl bg-white/10">
                  <span className="text-[10px] text-emerald-200 block uppercase font-bold">Evaluation</span>
                  <span className="text-base font-bold text-emerald-300">Step Marking</span>
                </div>
              </div>

              <p className="text-xs text-emerald-100/90 leading-relaxed bg-black/20 p-3 rounded-xl border border-white/5">
                <strong>Examiner Feedback:</strong> {evaluation.overallFeedback}
              </p>
            </div>
          )}

          {/* Questions Sections */}
          <div className="space-y-8">
            {currentPaper.sections.map((sec, sIdx) => (
              <div key={sIdx} className="space-y-4">
                <div className="flex items-center justify-between border-b border-indigo-100 dark:border-slate-800 pb-2">
                  <div>
                    <h4 className="text-base font-bold text-slate-900 dark:text-white">
                      {sec.sectionName}
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {sec.description}
                    </p>
                  </div>
                  <span className="text-xs font-bold px-2.5 py-1 rounded-lg bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300">
                    {sec.totalMarks} Marks
                  </span>
                </div>

                <div className="space-y-5">
                  {sec.questions.map((q, qIdx) => {
                    const qEval = evaluation?.questionEvaluations.find((ev) => ev.questionId === q.id);
                    return (
                      <div
                        key={q.id || qIdx}
                        className="rounded-2xl p-4 sm:p-5 bg-slate-50/70 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 space-y-3"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-start gap-2.5">
                            <span className="w-6 h-6 rounded-lg bg-indigo-600 text-white font-bold text-xs flex items-center justify-center shrink-0">
                              {q.number || qIdx + 1}
                            </span>
                            <div>
                              <p className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-white leading-relaxed">
                                {q.question}
                              </p>
                              {q.stepMarking && (
                                <span className="inline-block mt-1 text-[11px] font-medium text-slate-500 dark:text-slate-400">
                                  Marking scheme: {q.stepMarking}
                                </span>
                              )}
                            </div>
                          </div>

                          <span className="text-xs font-bold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/60 px-2 py-0.5 rounded-md shrink-0">
                            {q.marks} {q.marks === 1 ? "Mark" : "Marks"}
                          </span>
                        </div>

                        {/* MCQ Options */}
                        {q.options && q.options.length > 0 && (
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                            {q.options.map((opt, optIdx) => {
                              const isSelected = studentAnswers[q.id] === opt;
                              return (
                                <button
                                  key={optIdx}
                                  type="button"
                                  onClick={() => handleAnswerChange(q.id, opt)}
                                  className={`p-2.5 text-left rounded-xl text-xs font-medium border transition-all ${
                                    isSelected
                                      ? "bg-indigo-50 dark:bg-indigo-950/80 border-indigo-500 text-indigo-900 dark:text-indigo-200"
                                      : "bg-white dark:bg-slate-800 border-slate-250 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-slate-400"
                                  }`}
                                >
                                  <span className="font-bold mr-1.5">{String.fromCharCode(65 + optIdx)}.</span>
                                  {opt}
                                </button>
                              );
                            })}
                          </div>
                        )}

                        {/* Text Answer Input for Short/Long answers */}
                        {(!q.options || q.options.length === 0) && (
                          <div className="space-y-1 pt-1">
                            <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 uppercase">
                              Your Solution / Derivation Working:
                            </label>
                            <textarea
                              rows={q.marks > 2 ? 4 : 2}
                              value={studentAnswers[q.id] || ""}
                              onChange={(e) => handleAnswerChange(q.id, e.target.value)}
                              placeholder="Write your steps, formulas, and final answer here..."
                              className="w-full px-3 py-2 text-xs rounded-xl bg-white dark:bg-slate-800 border border-slate-250 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                          </div>
                        )}

                        {/* Action buttons: Hints & Model Answer */}
                        <div className="flex items-center justify-between pt-1 text-xs border-t border-slate-200/60 dark:border-slate-750">
                          <div className="flex items-center gap-2">
                            {q.hint && (
                              <button
                                type="button"
                                onClick={() => toggleHint(q.id)}
                                className="text-[11px] font-semibold text-amber-600 dark:text-amber-400 hover:underline flex items-center gap-1"
                              >
                                <HelpCircle className="w-3 h-3" />
                                <span>{showHints[q.id] ? "Hide Hint" : "Show Hint"}</span>
                              </button>
                            )}

                            {q.modelAnswer && (
                              <button
                                type="button"
                                onClick={() => toggleModelAnswer(q.id)}
                                className="text-[11px] font-semibold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
                              >
                                <BookOpen className="w-3 h-3" />
                                <span>{showModelAnswers[q.id] ? "Hide Model Answer" : "View Model Answer & Steps"}</span>
                              </button>
                            )}
                          </div>

                          {qEval && (
                            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                              Marks Awarded: {qEval.marksAwarded} / {qEval.maxMarks}
                            </span>
                          )}
                        </div>

                        {/* Hint box */}
                        {showHints[q.id] && q.hint && (
                          <div className="p-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/40 text-xs text-amber-800 dark:text-amber-300">
                            💡 <strong>Hint:</strong> {q.hint}
                          </div>
                        )}

                        {/* Model answer box */}
                        {showModelAnswers[q.id] && q.modelAnswer && (
                          <div className="p-3 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800/40 text-xs text-slate-700 dark:text-slate-200 space-y-1">
                            <p className="font-bold text-indigo-700 dark:text-indigo-300">
                              Ideal Model Solution & Step Marking:
                            </p>
                            <p className="whitespace-pre-wrap leading-relaxed">{q.modelAnswer}</p>
                            {q.explanation && (
                              <p className="text-[11px] text-slate-500 dark:text-slate-400 pt-1 italic">
                                Note: {q.explanation}
                              </p>
                            )}
                          </div>
                        )}

                        {/* Evaluation step feedback */}
                        {qEval && (
                          <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/40 text-xs text-emerald-900 dark:text-emerald-200 space-y-1">
                            <p className="font-bold">Step Marking Feedback ({qEval.marksAwarded}/{qEval.maxMarks} Marks):</p>
                            <p>{qEval.stepFeedback}</p>
                            {qEval.suggestions && (
                              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                                💡 Tip: {qEval.suggestions}
                              </p>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          {/* Submission and Evaluation bar */}
          <div className="pt-6 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Submit your answers to Gemini for AI Step-by-Step evaluation with partial marking.
            </p>

            <button
              onClick={handleSubmitForEvaluation}
              disabled={isEvaluating}
              className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md shadow-emerald-600/30 transition-all active:scale-95"
            >
              <CheckCircle2 className={`w-4 h-4 ${isEvaluating ? "animate-spin" : ""}`} />
              <span>{isEvaluating ? "Gemini Evaluating Paper..." : "Submit to Gemini for Step Evaluation"}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
