import React, { useMemo } from "react";
import katex from "katex";

interface MathFormulaProps {
  expression: string;
  block?: boolean;
  className?: string;
}

/**
 * MathFormula renders math expressions into KaTeX formatted output.
 * Strips raw dollar signs ($$), handles inline/block styles, and provides
 * safe rendering so students never see broken LaTeX or stray symbols.
 */
export const MathFormula: React.FC<MathFormulaProps> = ({
  expression,
  block = false,
  className = "",
}) => {
  const html = useMemo(() => {
    if (!expression) return "";

    // Clean surrounding math delimiters if present
    let raw = expression.trim();
    if (raw.startsWith("$$") && raw.endsWith("$$")) {
      raw = raw.slice(2, -2).trim();
    } else if (raw.startsWith("$") && raw.endsWith("$")) {
      raw = raw.slice(1, -1).trim();
    } else if (raw.startsWith("\\[") && raw.endsWith("\\]")) {
      raw = raw.slice(2, -2).trim();
    } else if (raw.startsWith("\\(") && raw.endsWith("\\)")) {
      raw = raw.slice(2, -2).trim();
    }

    try {
      return katex.renderToString(raw, {
        displayMode: block,
        throwOnError: false,
        strict: false,
      });
    } catch {
      // Fallback clean text
      return "";
    }
  }, [expression, block]);

  if (!expression) return null;

  if (html) {
    return (
      <span
        className={`math-rendered inline-block ${block ? "my-2 overflow-x-auto max-w-full text-center block" : ""} ${className}`}
        dangerouslySetInnerHTML={{ __html: html }}
      />
    );
  }

  // Fallback if KaTeX cannot parse
  return (
    <span
      className={`font-mono text-xs sm:text-sm px-1.5 py-0.5 rounded bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 font-semibold ${className}`}
    >
      {expression.replace(/\$+/g, "")}
    </span>
  );
};
