import React, { useState, useEffect } from "react";
import {
  Clock,
  CheckCircle2,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  BookOpen,
  Sparkles,
  Trophy,
  RotateCcw,
  Youtube,
  ExternalLink,
  Printer,
  X,
  FileText,
  HelpCircle,
  Calculator,
  Layers,
  Award,
  Send,
} from "lucide-react";
import { SubjectivePaper, SubjectiveQuestion, SubjectiveSubmission, SubjectiveQuestionEvaluation } from "../../types";
import { useStudy } from "../../context/StudyContext";
import { getYouTubeSearchUrl } from "../../data/videoLecturesData";
import { ConfirmDialog } from "../common/ConfirmDialog";

interface SubjectiveTestRunnerProps {
  paper: SubjectivePaper;
  onClose: () => void;
}

const MATH_SYMBOLS = ["Δ", "∫", "d/dx", "θ", "λ", "√", "→", "⇌", "Ω", "π", "μ", "±", "²", "³", "ε₀", "≈", "∞", "Σ"];

export const SubjectiveTestRunner: React.FC<SubjectiveTestRunnerProps> = ({ paper, onClose }) => {
  const { addToast, triggerConfetti } = useStudy();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<{ [questionId: string]: string }>({});
  const [timeLeftSeconds, setTimeLeftSeconds] = useState(paper.timeLimitMinutes * 60);
  const [isSubmitConfirmOpen, setIsSubmitConfirmOpen] = useState(false);
  const [isExitConfirmOpen, setIsExitConfirmOpen] = useState(false);
  const [isEvaluated, setIsEvaluated] = useState(false);
  const [submission, setSubmission] = useState<SubjectiveSubmission | null>(null);
  const [activeStepTab, setActiveStepTab] = useState<"free" | "steps">("free");

  const currentQ = paper.questions[currentIndex];
  const totalQuestions = paper.questions.length;

  // Timer countdown
  useEffect(() => {
    if (isEvaluated) return;
    const timer = setInterval(() => {
      setTimeLeftSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [isEvaluated]);

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  const handleInsertSymbol = (sym: string) => {
    const prev = answers[currentQ.id] || "";
    setAnswers((old) => ({
      ...old,
      [currentQ.id]: prev + (prev && !prev.endsWith(" ") ? " " : "") + sym + " ",
    }));
  };

  const handleAddStepTemplate = () => {
    const template = `1. Given / Formula:\n   \n2. Calculation & Working Steps:\n   \n3. Final Answer & Conclusion (with SI Units):\n   `;
    setAnswers((old) => ({
      ...old,
      [currentQ.id]: (old[currentQ.id] ? old[currentQ.id] + "\n\n" : "") + template,
    }));
  };

  const evaluateAnswers = () => {
    const evaluations: { [qId: string]: SubjectiveQuestionEvaluation } = {};
    let totalScore = 0;

    paper.questions.forEach((q) => {
      const userAns = (answers[q.id] || "").trim();
      const lowerAns = userAns.toLowerCase();

      // Check keyword coverage
      const matchedKeywords: string[] = [];
      const missingPoints: string[] = [];

      q.keyKeywords.forEach((kw) => {
        const kwParts = kw.toLowerCase().split(" ");
        const hasMatch = kwParts.some((part) => part.length > 3 && lowerAns.includes(part));
        if (hasMatch) {
          matchedKeywords.push(kw);
        } else {
          missingPoints.push(kw);
        }
      });

      // Step-based scoring
      const stepBreakdown = q.markingScheme.map((schemeStep) => {
        const stepKeywords = schemeStep.step.toLowerCase().split(" ").filter((w) => w.length > 4);
        const matchesInStep = stepKeywords.filter((k) => lowerAns.includes(k)).length;
        const ratio = userAns.length === 0 ? 0 : Math.min(1, 0.4 + (matchesInStep / Math.max(1, stepKeywords.length)) * 0.7);
        const marksAwarded = Number((schemeStep.marks * (userAns.length > 15 ? ratio : 0)).toFixed(1));
        return {
          step: schemeStep.step,
          maxMarks: schemeStep.marks,
          marksAwarded,
        };
      });

      const qScore = Math.min(
        q.marks,
        Number(stepBreakdown.reduce((acc, curr) => acc + curr.marksAwarded, 0).toFixed(1))
      );
      totalScore += qScore;

      let feedback = "";
      if (userAns.length < 10) {
        feedback = "Answer was left blank or very brief. Review the model answer and marking steps.";
      } else if (qScore >= q.marks * 0.8) {
        feedback = "Strong conceptual formulation! Steps, equations, and reasoning align with official marking guidelines.";
      } else {
        feedback = `Partial credit awarded. Make sure to explicitly write intermediate formula substitutions and specify key terminology: ${missingPoints.slice(0, 2).join(", ")}.`;
      }

      evaluations[q.id] = {
        score: qScore,
        maxMarks: q.marks,
        feedback,
        matchedKeywords,
        missingPoints,
        stepBreakdown,
      };
    });

    const finalMarksAwarded: { [qId: string]: number } = {};
    Object.keys(evaluations).forEach((k) => {
      finalMarksAwarded[k] = evaluations[k].score;
    });

    const percentage = Math.round((totalScore / paper.totalMarks) * 100);
    const timeSpent = paper.timeLimitMinutes * 60 - timeLeftSeconds;

    const newSub: SubjectiveSubmission = {
      id: `sub_${Date.now()}`,
      paperId: paper.id,
      paperTitle: paper.title,
      subject: paper.subject,
      studentAnswers: answers,
      marksAwarded: finalMarksAwarded,
      totalScore: Number(totalScore.toFixed(1)),
      maxScore: paper.totalMarks,
      percentage,
      evaluations,
      submittedAt: new Date().toISOString(),
      timeSpentSeconds: timeSpent,
      overallAiSummary:
        percentage >= 80
          ? "Exceptional subjective performance! Your step-by-step mathematical reasoning and scientific rigor are board-topper quality."
          : percentage >= 60
          ? "Good grasp of the foundational theories. Focus on writing structured step headers (Given, Formula, Calculation, Units) to gain full step marks."
          : "Needs targeted conceptual revision. Review the step-by-step model solutions and watch the recommended YouTube lectures for derivations.",
    };

    setSubmission(newSub);
    setIsEvaluated(true);
    triggerConfetti();
    addToast(`🎉 Subjective paper evaluated! Score: ${newSub.totalScore}/${newSub.maxScore} (${newSub.percentage}%)`, "success");
  };

  const handleSubmit = () => {
    setIsSubmitConfirmOpen(false);
    evaluateAnswers();
  };

  const handleUpdateMark = (qId: string, delta: number) => {
    if (!submission) return;
    const currentScore = submission.marksAwarded[qId] || 0;
    const maxQMarks = paper.questions.find((q) => q.id === qId)?.marks || 5;
    const newScore = Math.max(0, Math.min(maxQMarks, Number((currentScore + delta).toFixed(1))));

    setSubmission((prev) => {
      if (!prev) return prev;
      const updatedMarks = { ...prev.marksAwarded, [qId]: newScore };
      const newTotal = Number(Object.values(updatedMarks).reduce((a, b) => a + b, 0).toFixed(1));
      const newPct = Math.round((newTotal / prev.maxScore) * 100);
      return {
        ...prev,
        marksAwarded: updatedMarks,
        totalScore: newTotal,
        percentage: newPct,
      };
    });
  };

  const answeredCount = Object.keys(answers).filter((k) => (answers[k] || "").trim().length > 0).length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in overflow-hidden">
      <div className="relative w-full max-w-5xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col h-[94vh] max-h-[94vh] overflow-hidden">
        {/* Top Header Bar */}
        <div className="px-4 sm:px-6 py-3.5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between gap-3 shrink-0 bg-slate-50/60 dark:bg-slate-900/60">
          <div className="space-y-0.5 min-w-0">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-900">
                {paper.subject} • {paper.classGrade}
              </span>
              <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400">
                {isEvaluated ? "Evaluated Answer Sheet" : `Total Marks: ${paper.totalMarks}`}
              </span>
            </div>
            <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white truncate">
              {paper.title}
            </h3>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            {!isEvaluated ? (
              <div
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-mono text-xs sm:text-sm font-bold border transition-colors ${
                  timeLeftSeconds < 300
                    ? "bg-rose-50 dark:bg-rose-950 border-rose-300 dark:border-rose-800 text-rose-600 animate-pulse"
                    : "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                }`}
              >
                <Clock className="w-4 h-4 text-indigo-600" />
                <span>{formatTime(timeLeftSeconds)}</span>
              </div>
            ) : (
              <div className="px-3.5 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 font-extrabold text-xs sm:text-sm flex items-center gap-1.5 border border-emerald-200 dark:border-emerald-900/40">
                <Trophy className="w-4 h-4 text-emerald-600" />
                <span>Score: {submission?.totalScore} / {submission?.maxScore} ({submission?.percentage}%)</span>
              </div>
            )}

            <button
              onClick={() => (isEvaluated ? onClose() : setIsExitConfirmOpen(true))}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
              title="Close Test"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Question Selector Quick Bar */}
        <div className="px-4 sm:px-6 py-2 border-b border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center justify-between gap-3 shrink-0 overflow-x-auto">
          <div className="flex items-center gap-1.5">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider hidden sm:inline mr-1">
              Questions:
            </span>
            {paper.questions.map((q, idx) => {
              const isAnswered = (answers[q.id] || "").trim().length > 0;
              const isCurrent = idx === currentIndex;
              const awarded = submission?.marksAwarded[q.id];

              return (
                <button
                  key={q.id}
                  onClick={() => setCurrentIndex(idx)}
                  className={`px-2.5 py-1 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center gap-1 ${
                    isCurrent
                      ? "bg-indigo-600 text-white shadow-sm ring-2 ring-indigo-500/30"
                      : isEvaluated
                      ? awarded && awarded >= q.marks * 0.7
                        ? "bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-200"
                        : "bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300 border border-rose-200"
                      : isAnswered
                      ? "bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200"
                      : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200"
                  }`}
                >
                  <span>Q{idx + 1}</span>
                  <span className="text-[10px] opacity-75">[{q.marks}m]</span>
                  {isAnswered && !isEvaluated && <CheckCircle2 className="w-3 h-3 text-indigo-600 dark:text-indigo-400" />}
                </button>
              );
            })}
          </div>

          <div className="text-xs font-bold text-slate-500 dark:text-slate-400 whitespace-nowrap shrink-0">
            {isEvaluated
              ? `Reviewing Q${currentIndex + 1} of ${totalQuestions}`
              : `${answeredCount} of ${totalQuestions} Answered`}
          </div>
        </div>

        {/* Scrollable Main Question & Answer Body */}
        <div className="flex-1 overflow-y-auto min-h-0 p-4 sm:p-6 space-y-5">
          {/* Question Banner */}
          <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-slate-200/60 dark:border-slate-700/60">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 rounded-lg bg-indigo-600 text-white font-extrabold text-xs">
                  Question {currentQ.questionNumber}
                </span>
                <span className="text-xs font-bold text-indigo-700 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-950/80 px-2.5 py-0.5 rounded-md border border-indigo-200/60 dark:border-indigo-900/40">
                  {currentQ.section}
                </span>
                <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
                  Topic: {currentQ.topic}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-black px-2 py-0.5 rounded-md bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-800">
                  {currentQ.marks} Marks
                </span>
                {currentQ.suggestedWordCount && (
                  <span className="text-[11px] text-slate-400 font-medium hidden sm:inline">
                    Word Limit: {currentQ.suggestedWordCount}
                  </span>
                )}
              </div>
            </div>

            {/* Question Text */}
            <h4 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white leading-relaxed whitespace-pre-line">
              {currentQ.question}
            </h4>

            {/* Hint & YouTube Assistance */}
            <div className="flex flex-wrap items-center justify-between gap-2 pt-2 text-xs">
              {currentQ.formulaeInvolved && currentQ.formulaeInvolved.length > 0 && (
                <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400">
                  <Calculator className="w-3.5 h-3.5 text-indigo-500" />
                  <span className="font-semibold">Key Relations:</span>
                  <span className="font-mono text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/40 px-2 py-0.5 rounded text-[11px]">
                    {currentQ.formulaeInvolved.join(" • ")}
                  </span>
                </div>
              )}

              {currentQ.youtubeSearchTopic && (
                <button
                  type="button"
                  onClick={() => {
                    const url = getYouTubeSearchUrl(currentQ.youtubeSearchTopic || currentQ.topic, paper.subject);
                    window.open(url, "_blank", "noopener,noreferrer");
                    addToast(`Opening YouTube lecture on "${currentQ.topic}"...`, "success");
                  }}
                  className="inline-flex items-center gap-1 text-red-600 hover:text-red-700 dark:text-red-400 font-bold hover:underline"
                >
                  <Youtube className="w-3.5 h-3.5" />
                  <span>Watch Concept Lecture on YouTube</span>
                  <ExternalLink className="w-2.5 h-2.5" />
                </button>
              )}
            </div>
          </div>

          {/* ACTIVE TEST MODE: Student Writing Workspace */}
          {!isEvaluated ? (
            <div className="space-y-4">
              {/* Equation / Math Quick Insert Bar */}
              <div className="flex flex-wrap items-center justify-between gap-2 p-2.5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                <div className="flex items-center gap-1 flex-wrap">
                  <span className="text-[11px] font-bold text-slate-400 mr-1 flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-indigo-500" /> Quick Symbols:
                  </span>
                  {MATH_SYMBOLS.map((sym) => (
                    <button
                      key={sym}
                      type="button"
                      onClick={() => handleInsertSymbol(sym)}
                      className="px-2 py-0.5 rounded-lg bg-slate-100 dark:bg-slate-700/80 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 text-slate-800 dark:text-slate-200 text-xs font-mono font-bold transition-colors"
                    >
                      {sym}
                    </button>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={handleAddStepTemplate}
                  className="px-3 py-1 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 hover:bg-indigo-100 text-indigo-700 dark:text-indigo-300 font-bold text-xs border border-indigo-200 dark:border-indigo-900/40 flex items-center gap-1 transition-all"
                >
                  <Layers className="w-3.5 h-3.5" />
                  <span>Insert 3-Step Answer Template</span>
                </button>
              </div>

              {/* Multiline Answer Textarea */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-300">
                  <label className="flex items-center gap-1.5">
                    <FileText className="w-4 h-4 text-indigo-600" />
                    <span>Your Step-by-Step Subjective Answer:</span>
                  </label>
                  <span className="text-slate-400 font-mono text-[11px]">
                    {(answers[currentQ.id] || "").trim().split(/\s+/).filter(Boolean).length} Words •{" "}
                    {(answers[currentQ.id] || "").length} Chars
                  </span>
                </div>

                <textarea
                  rows={8}
                  value={answers[currentQ.id] || ""}
                  onChange={(e) =>
                    setAnswers((prev) => ({
                      ...prev,
                      [currentQ.id]: e.target.value,
                    }))
                  }
                  placeholder={`Write your answer for Question ${currentQ.questionNumber}...\n- State the fundamental theorem/formula\n- Show full step-by-step substitution and calculations\n- Conclude with final statement and proper units`}
                  className="w-full p-4 text-xs sm:text-sm rounded-2xl bg-white dark:bg-slate-850 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white font-sans leading-relaxed focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all shadow-inner"
                />
              </div>
            </div>
          ) : (
            /* EVALUATED MODE: Model Answer & AI Rubric Side-by-Side */
            <div className="space-y-6">
              {/* Question Evaluation Summary Card */}
              {submission && submission.evaluations[currentQ.id] && (
                <div className="p-4 rounded-2xl bg-indigo-50/60 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/40 space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <span className="text-xs font-bold uppercase tracking-wider text-indigo-700 dark:text-indigo-300">
                        AI Scoring & Evaluation
                      </span>
                      <h4 className="text-lg font-black text-slate-900 dark:text-white mt-0.5">
                        Marks Awarded: {submission.marksAwarded[currentQ.id]} / {currentQ.marks}
                      </h4>
                    </div>

                    {/* Manual Score Overrider */}
                    <div className="flex items-center gap-2 bg-white dark:bg-slate-900 p-1.5 rounded-xl border border-slate-200 dark:border-slate-800">
                      <span className="text-xs font-bold text-slate-500 px-1">Adjust:</span>
                      <button
                        onClick={() => handleUpdateMark(currentQ.id, -0.5)}
                        className="w-7 h-7 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-rose-100 text-slate-700 dark:text-slate-300 font-black text-sm flex items-center justify-center transition-colors"
                      >
                        -
                      </button>
                      <span className="font-mono font-black text-sm text-indigo-600 dark:text-indigo-400 px-1">
                        {submission.marksAwarded[currentQ.id]}
                      </span>
                      <button
                        onClick={() => handleUpdateMark(currentQ.id, +0.5)}
                        className="w-7 h-7 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-emerald-100 text-slate-700 dark:text-slate-300 font-black text-sm flex items-center justify-center transition-colors"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                    💡 <strong>AI Feedback:</strong> {submission.evaluations[currentQ.id].feedback}
                  </p>

                  {/* Step Marking Checklist */}
                  <div className="pt-2 space-y-1.5">
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                      Official Step-Marking Breakdown:
                    </p>
                    <div className="space-y-1.5">
                      {submission.evaluations[currentQ.id].stepBreakdown.map((sb, idx) => (
                        <div
                          key={idx}
                          className="flex items-center justify-between gap-3 p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs"
                        >
                          <span className="text-slate-800 dark:text-slate-200 flex items-center gap-2">
                            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                            <span>{sb.step}</span>
                          </span>
                          <span className="font-mono font-bold text-indigo-600 dark:text-indigo-400 shrink-0">
                            {sb.marksAwarded} / {sb.maxMarks} Marks
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Side-by-Side Comparison: Student Answer vs Official Model Answer */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Student's Submitted Answer */}
                <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-850 border border-slate-200 dark:border-slate-700 space-y-2">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
                    <h5 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                      <FileText className="w-4 h-4 text-indigo-600" />
                      <span>Your Submitted Answer</span>
                    </h5>
                    <span className="text-[11px] text-slate-400 font-mono">
                      {(answers[currentQ.id] || "").trim().split(/\s+/).filter(Boolean).length} Words
                    </span>
                  </div>

                  <div className="text-xs sm:text-sm font-sans leading-relaxed text-slate-800 dark:text-slate-200 whitespace-pre-line min-h-[160px]">
                    {answers[currentQ.id] || <span className="text-slate-400 italic">No answer submitted for this question.</span>}
                  </div>
                </div>

                {/* Official Model Answer */}
                <div className="p-4 sm:p-5 rounded-2xl bg-emerald-50/40 dark:bg-emerald-950/20 border border-emerald-200/80 dark:border-emerald-900/50 space-y-2">
                  <div className="flex items-center justify-between pb-2 border-b border-emerald-100 dark:border-emerald-900/40">
                    <h5 className="text-xs font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-300 flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>Official Ideal Model Solution</span>
                    </h5>
                    <span className="px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-900 text-emerald-800 dark:text-emerald-200 text-[10px] font-bold">
                      Full Marks Solution
                    </span>
                  </div>

                  <div className="text-xs sm:text-sm font-sans leading-relaxed text-slate-800 dark:text-slate-200 whitespace-pre-line min-h-[160px] bg-white/80 dark:bg-slate-900/80 p-3 rounded-xl border border-emerald-100 dark:border-emerald-900/30">
                    {currentQ.modelAnswer}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ALWAYS-VISIBLE STICKY FOOTER NAVIGATION BAR */}
        <div className="px-4 sm:px-6 py-3.5 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center justify-between gap-3 shrink-0 shadow-lg z-20">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
              disabled={currentIndex === 0}
              className="px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-40 disabled:pointer-events-none transition-all flex items-center gap-1 border border-slate-200 dark:border-slate-700"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Previous</span>
            </button>

            <button
              type="button"
              onClick={() => setCurrentIndex((prev) => Math.min(totalQuestions - 1, prev + 1))}
              disabled={currentIndex === totalQuestions - 1}
              className="px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-40 disabled:pointer-events-none transition-all flex items-center gap-1 border border-slate-200 dark:border-slate-700"
            >
              <span>Next</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="flex items-center gap-2">
            {!isEvaluated ? (
              <>
                <button
                  type="button"
                  onClick={() => setIsSubmitConfirmOpen(true)}
                  className="px-5 sm:px-6 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs sm:text-sm shadow-lg shadow-indigo-600/30 transition-all flex items-center gap-2 active:scale-95"
                >
                  <Send className="w-4 h-4" />
                  <span>Submit Subjective Test & Evaluate</span>
                </button>
              </>
            ) : (
              <>
                <button
                  type="button"
                  onClick={() => {
                    setIsEvaluated(false);
                    setSubmission(null);
                  }}
                  className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold transition-all flex items-center gap-1.5"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Retake Test</span>
                </button>

                <button
                  type="button"
                  onClick={onClose}
                  className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs sm:text-sm font-bold shadow-md transition-all"
                >
                  Done Reviewing
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Submit Confirmation Dialog */}
      <ConfirmDialog
        isOpen={isSubmitConfirmOpen}
        onClose={() => setIsSubmitConfirmOpen(false)}
        onConfirm={handleSubmit}
        title="Submit Subjective Answer Sheet"
        message={`You have written answers for ${answeredCount} of ${totalQuestions} questions. Are you ready to submit your paper for AI step-by-step scoring and model answer comparison?`}
        confirmText="Yes, Submit for Evaluation"
        danger={false}
      />

      {/* Exit Confirmation Dialog */}
      <ConfirmDialog
        isOpen={isExitConfirmOpen}
        onClose={() => setIsExitConfirmOpen(false)}
        onConfirm={onClose}
        title="Exit Subjective Test"
        message="Are you sure you want to exit? Your unsaved written answers will be lost."
        confirmText="Exit Test"
      />
    </div>
  );
};
