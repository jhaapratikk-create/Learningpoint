import React from "react";

export const SkeletonLoader: React.FC<{
  type?: "card" | "text" | "list" | "chat";
  count?: number;
}> = ({ type = "card", count = 1 }) => {
  return (
    <div className="space-y-3 w-full animate-pulse">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="w-full">
          {type === "card" && (
            <div className="bg-slate-200 dark:bg-slate-800 rounded-2xl p-5 border border-slate-300/40 dark:border-slate-700/40 space-y-3">
              <div className="flex items-center justify-between">
                <div className="h-4 bg-slate-300 dark:bg-slate-700 rounded-md w-1/3" />
                <div className="h-6 w-6 bg-slate-300 dark:bg-slate-700 rounded-full" />
              </div>
              <div className="h-3 bg-slate-300 dark:bg-slate-700 rounded-md w-2/3" />
              <div className="h-2 bg-slate-300 dark:bg-slate-700 rounded-full w-full mt-4" />
            </div>
          )}

          {type === "text" && (
            <div className="space-y-2">
              <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded-md w-3/4" />
              <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded-md w-full" />
              <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded-md w-5/6" />
            </div>
          )}

          {type === "list" && (
            <div className="flex items-center gap-3 p-3 bg-slate-100 dark:bg-slate-800/60 rounded-xl">
              <div className="w-10 h-10 bg-slate-300 dark:bg-slate-700 rounded-lg shrink-0" />
              <div className="flex-1 space-y-2">
                <div className="h-3.5 bg-slate-300 dark:bg-slate-700 rounded w-1/2" />
                <div className="h-2.5 bg-slate-300 dark:bg-slate-700 rounded w-1/4" />
              </div>
            </div>
          )}

          {type === "chat" && (
            <div className="flex gap-3 items-start my-3">
              <div className="w-8 h-8 rounded-full bg-slate-300 dark:bg-slate-700 shrink-0" />
              <div className="space-y-2 flex-1 bg-slate-100 dark:bg-slate-800 p-4 rounded-2xl">
                <div className="h-3 bg-slate-300 dark:bg-slate-700 rounded w-2/3" />
                <div className="h-3 bg-slate-300 dark:bg-slate-700 rounded w-full" />
                <div className="h-3 bg-slate-300 dark:bg-slate-700 rounded w-4/5" />
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};
