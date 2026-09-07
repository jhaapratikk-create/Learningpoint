import React, { useState, useEffect, useMemo } from "react";
import {
  Flame,
  Heart,
  Bookmark,
  BookmarkCheck,
  Share2,
  ExternalLink,
  Sparkles,
  ChevronDown,
  ChevronUp,
  RotateCcw,
  CheckCircle2,
  HelpCircle,
  Lightbulb,
  Youtube,
  Instagram,
  Search,
  X,
  SlidersHorizontal,
  Layers,
  Compass,
  Play,
  Grid,
  ListFilter,
  ArrowRight,
  Tv,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useStudy } from "../../context/StudyContext";
import { ScholarVideoItem } from "../../types";
import {
  SCHOLAR_ALL_VIDEOS,
  getConceptYouTubeUrl,
  getConceptShortsUrl,
  getConceptReelsUrl,
  getYouTubeShortsSearchUrl,
  getInstagramReelsSearchUrl,
  getYouTubeLongSearchUrl,
} from "../../data/scholarVideosData";

const POPULAR_CONCEPT_SEARCHES = [
  { label: "Photosynthesis 🌿", query: "Photosynthesis", subject: "Biology" },
  { label: "Pythagoras 📐", query: "Pythagoras", subject: "Mathematics" },
  { label: "Fleming's FBI Rule ⚡", query: "Fleming", subject: "Physics" },
  { label: "SN1 vs SN2 🧪", query: "SN1", subject: "Chemistry" },
  { label: "Power Rule 📈", query: "Derivative", subject: "Mathematics" },
  { label: "Mitochondria 🔋", query: "Mitochondria", subject: "Biology" },
  { label: "Trig Hand Trick ✋", query: "Trigonometry", subject: "Mathematics" },
  { label: "Active Voice ✍️", query: "Active Passive", subject: "English" },
  { label: "Salt March 🏛️", query: "Dandi", subject: "Social Science" },
  { label: "Python List Comp 💻", query: "Python", subject: "Computer Science" },
];

const SUBJECT_OPTIONS = [
  "All Subjects",
  "Mathematics",
  "Science",
  "Physics",
  "Chemistry",
  "Biology",
  "Social Science",
  "English",
  "Computer Science",
];

const GRADE_OPTIONS = [
  "All Grades",
  "Class 10",
  "Class 12",
  "Class 11",
  "Class 9",
];

export const ScholarShortsView: React.FC = () => {
  const { user } = useAuth();
  const { addToast, setCurrentView } = useStudy();

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("All Subjects");
  const [selectedGrade, setSelectedGrade] = useState("All Grades");
  const [selectedPlatform, setSelectedPlatform] = useState<"all" | "youtube" | "instagram">("all");
  const [showFilterDrawer, setShowFilterDrawer] = useState(false);
  const [showResultsList, setShowResultsList] = useState(false);

  // Viewer State
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isConceptDrawerOpen, setIsConceptDrawerOpen] = useState(false);
  const [selectedQuizOption, setSelectedQuizOption] = useState<number | null>(null);
  const [isQuizSubmitted, setIsQuizSubmitted] = useState(false);

  // Likes & Saved state
  const [likedIds, setLikedIds] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem("scholar_liked_videos");
      return stored ? JSON.parse(stored) : ["short_math_pythagoras_trick"];
    } catch {
      return ["short_math_pythagoras_trick"];
    }
  });

  const [savedIds, setSavedIds] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem("scholar_saved_videos");
      return stored ? JSON.parse(stored) : ["short_sci_photosynthesis"];
    } catch {
      return ["short_sci_photosynthesis"];
    }
  });

  // Base raw shorts
  const baseShorts = useMemo(() => {
    return SCHOLAR_ALL_VIDEOS.filter((v) => v.type === "short");
  }, []);

  // Filtered shorts based on live search query and filters
  const filteredShorts = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();

    return baseShorts.filter((item) => {
      // Subject match
      if (selectedSubject !== "All Subjects") {
        if (selectedSubject === "Science") {
          if (!["Science", "Physics", "Chemistry", "Biology"].includes(item.subject)) return false;
        } else if (item.subject.toLowerCase() !== selectedSubject.toLowerCase()) {
          return false;
        }
      }

      // Grade match
      if (selectedGrade !== "All Grades") {
        if (item.classGrade && !item.classGrade.toLowerCase().includes(selectedGrade.toLowerCase())) {
          return false;
        }
      }

      // Platform match
      if (selectedPlatform !== "all") {
        if (item.platform !== selectedPlatform) return false;
      }

      // Search Query match
      if (q) {
        const titleMatch = item.title.toLowerCase().includes(q);
        const conceptMatch = item.concept.toLowerCase().includes(q);
        const subjectMatch = item.subject.toLowerCase().includes(q);
        const chapterMatch = (item.chapter || "").toLowerCase().includes(q);
        const descMatch = (item.description || "").toLowerCase().includes(q);
        const channelMatch = (item.channel || "").toLowerCase().includes(q);
        const tagMatch = (item.tags || []).some((t) => t.toLowerCase().includes(q));

        return titleMatch || conceptMatch || subjectMatch || chapterMatch || descMatch || channelMatch || tagMatch;
      }

      return true;
    });
  }, [baseShorts, searchQuery, selectedSubject, selectedGrade, selectedPlatform]);

  // Adjust currentIndex if out of range when search results change
  useEffect(() => {
    if (currentIndex >= filteredShorts.length) {
      setCurrentIndex(0);
    }
    setSelectedQuizOption(null);
    setIsQuizSubmitted(false);
  }, [filteredShorts.length, searchQuery, selectedSubject, selectedGrade, selectedPlatform]);

  const currentShort: ScholarVideoItem | undefined = filteredShorts[currentIndex];

  const handleNext = () => {
    if (currentIndex < filteredShorts.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedQuizOption(null);
      setIsQuizSubmitted(false);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
      setSelectedQuizOption(null);
      setIsQuizSubmitted(false);
    }
  };

  const handleSelectShort = (index: number) => {
    setCurrentIndex(index);
    setSelectedQuizOption(null);
    setIsQuizSubmitted(false);
    setShowResultsList(false);
  };

  const handleClearFilters = () => {
    setSearchQuery("");
    setSelectedSubject("All Subjects");
    setSelectedGrade("All Grades");
    setSelectedPlatform("all");
    setCurrentIndex(0);
    addToast("Search filters reset", "info");
  };

  const toggleLike = () => {
    if (!currentShort) return;
    setLikedIds((prev) => {
      const exists = prev.includes(currentShort.id);
      const next = exists ? prev.filter((id) => id !== currentShort.id) : [...prev, currentShort.id];
      try {
        localStorage.setItem("scholar_liked_videos", JSON.stringify(next));
      } catch {}
      addToast(exists ? "Removed like" : "Liked short ❤️", "info");
      return next;
    });
  };

  const toggleSave = () => {
    if (!currentShort) return;
    setSavedIds((prev) => {
      const exists = prev.includes(currentShort.id);
      const next = exists ? prev.filter((id) => id !== currentShort.id) : [...prev, currentShort.id];
      try {
        localStorage.setItem("scholar_saved_videos", JSON.stringify(next));
      } catch {}
      addToast(exists ? "Removed from saved" : "Saved short to your library 🔖", "info");
      return next;
    });
  };

  const handleShare = (format: "shorts" | "reels" | "lecture" = "shorts") => {
    if (!currentShort) return;
    let url = getConceptShortsUrl(currentShort);
    if (format === "reels") url = getConceptReelsUrl(currentShort);
    if (format === "lecture") url = getConceptYouTubeUrl(currentShort);

    if (navigator.clipboard) {
      navigator.clipboard.writeText(url);
      addToast(`Copied ${format.toUpperCase()} link to clipboard! 📋`, "success");
    } else {
      addToast(`Link: ${url}`, "info");
    }
  };

  const handleOpenPlatform = (format: "shorts" | "reels" | "lecture") => {
    if (!currentShort) return;
    let url = getConceptShortsUrl(currentShort);
    let name = "YouTube Shorts";
    if (format === "reels") {
      url = getConceptReelsUrl(currentShort);
      name = "Instagram Reels";
    } else if (format === "lecture") {
      url = getConceptYouTubeUrl(currentShort);
      name = "YouTube Full Lecture";
    }
    window.open(url, "_blank", "noopener,noreferrer");
    addToast(`Opening on ${name} ↗`, "success");
  };

  // Real, live external search queries for ANY custom user search terms
  const handleExternalSearch = (platform: "shorts" | "reels" | "youtube") => {
    const q = searchQuery.trim() || (currentShort ? currentShort.concept : "cbse concept");
    let url = "";
    let label = "";

    if (platform === "shorts") {
      url = `https://www.youtube.com/results?search_query=${encodeURIComponent(q + " shorts concept trick")}`;
      label = "YouTube Shorts";
    } else if (platform === "reels") {
      const cleanTag = q.toLowerCase().replace(/[^a-z0-9]/g, "");
      url = cleanTag
        ? `https://www.instagram.com/explore/tags/${encodeURIComponent(cleanTag)}/`
        : `https://www.instagram.com/`;
      label = "Instagram Reels";
    } else {
      url = `https://www.youtube.com/results?search_query=${encodeURIComponent(q + " full lecture cbse class")}`;
      label = "YouTube Lectures";
    }

    window.open(url, "_blank", "noopener,noreferrer");
    addToast(`Searching "${q}" on ${label} ↗`, "success");
  };

  return (
    <div className="max-w-xl mx-auto space-y-4 pb-20">
      {/* 1. Top Header & Navigation */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-gradient-to-tr from-amber-500 to-rose-500 text-white shadow-md shadow-amber-500/20">
            <Flame className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white">
              Scholar Shorts & Reels
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              30–60s Concept Reels & Live Video Search
            </p>
          </div>
        </div>

        <button
          onClick={() => setCurrentView("scholar-videos")}
          className="px-3.5 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          All Videos Hub ↗
        </button>
      </div>

      {/* 2. REAL-TIME SEARCH BAR & FILTER SYSTEM */}
      <div className="p-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-2.5">
        <div className="relative flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search shorts (e.g., Photosynthesis, Pythagoras, SN1)..."
              className="w-full pl-9 pr-9 py-2 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-transparent focus:border-indigo-500 dark:focus:border-indigo-400 text-xs font-medium text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1"
                title="Clear search"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Filter toggle button */}
          <button
            onClick={() => setShowFilterDrawer(!showFilterDrawer)}
            className={`p-2 rounded-xl border text-xs font-bold flex items-center gap-1.5 transition-colors ${
              showFilterDrawer || selectedSubject !== "All Subjects" || selectedGrade !== "All Grades" || selectedPlatform !== "all"
                ? "bg-indigo-50 dark:bg-indigo-950/60 border-indigo-300 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300"
                : "bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200"
            }`}
            title="Filters"
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Filters</span>
          </button>

          {/* Browse all results drawer toggle */}
          <button
            onClick={() => setShowResultsList(!showResultsList)}
            className={`p-2 rounded-xl border text-xs font-bold flex items-center gap-1.5 transition-colors ${
              showResultsList
                ? "bg-amber-50 dark:bg-amber-950/60 border-amber-300 dark:border-amber-800 text-amber-800 dark:text-amber-300"
                : "bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200"
            }`}
            title="Browse Results Grid"
          >
            <Grid className="w-3.5 h-3.5" />
            <span className="font-mono text-[11px]">{filteredShorts.length}</span>
          </button>
        </div>

        {/* Quick Concept Tags Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar text-[11px]">
          <span className="text-slate-400 shrink-0 font-medium flex items-center gap-0.5">
            <Sparkles className="w-3 h-3 text-amber-500" /> Quick:
          </span>
          {POPULAR_CONCEPT_SEARCHES.map((item, idx) => (
            <button
              key={idx}
              onClick={() => {
                setSearchQuery(item.query);
                if (item.subject) setSelectedSubject(item.subject);
              }}
              className={`px-2.5 py-1 rounded-lg shrink-0 font-semibold transition-all ${
                searchQuery.toLowerCase() === item.query.toLowerCase()
                  ? "bg-indigo-600 text-white shadow-xs"
                  : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* Collapsible Filter Bar */}
        {showFilterDrawer && (
          <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-2 animate-in fade-in duration-150">
            <div className="grid grid-cols-3 gap-2">
              {/* Subject select */}
              <div>
                <label className="block text-[10px] font-bold text-slate-400 mb-1">Subject</label>
                <select
                  value={selectedSubject}
                  onChange={(e) => setSelectedSubject(e.target.value)}
                  className="w-full p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-800 dark:text-slate-200 focus:outline-none"
                >
                  {SUBJECT_OPTIONS.map((sub) => (
                    <option key={sub} value={sub}>
                      {sub}
                    </option>
                  ))}
                </select>
              </div>

              {/* Grade select */}
              <div>
                <label className="block text-[10px] font-bold text-slate-400 mb-1">Class / Grade</label>
                <select
                  value={selectedGrade}
                  onChange={(e) => setSelectedGrade(e.target.value)}
                  className="w-full p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-800 dark:text-slate-200 focus:outline-none"
                >
                  {GRADE_OPTIONS.map((gr) => (
                    <option key={gr} value={gr}>
                      {gr}
                    </option>
                  ))}
                </select>
              </div>

              {/* Platform select */}
              <div>
                <label className="block text-[10px] font-bold text-slate-400 mb-1">Platform</label>
                <select
                  value={selectedPlatform}
                  onChange={(e) => setSelectedPlatform(e.target.value as any)}
                  className="w-full p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-800 dark:text-slate-200 focus:outline-none"
                >
                  <option value="all">All (YouTube + Insta)</option>
                  <option value="youtube">YouTube Shorts Only</option>
                  <option value="instagram">Instagram Reels Only</option>
                </select>
              </div>
            </div>

            <div className="flex items-center justify-between pt-1 text-xs">
              <span className="text-slate-500 dark:text-slate-400 font-medium">
                Found {filteredShorts.length} matching shorts & reels
              </span>
              {(searchQuery || selectedSubject !== "All Subjects" || selectedGrade !== "All Grades" || selectedPlatform !== "all") && (
                <button
                  onClick={handleClearFilters}
                  className="text-indigo-600 dark:text-indigo-400 font-bold hover:underline"
                >
                  Reset all filters
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* 3. Search Results Drawer / Grid View */}
      {showResultsList && (
        <div className="p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl space-y-3 animate-in fade-in slide-in-from-top-2 duration-150">
          <div className="flex items-center justify-between">
            <h4 className="font-extrabold text-sm text-slate-900 dark:text-white flex items-center gap-2">
              <Layers className="w-4 h-4 text-indigo-500" />
              <span>Matching Shorts Playlist ({filteredShorts.length})</span>
            </h4>
            <button
              onClick={() => setShowResultsList(false)}
              className="text-xs font-bold text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              Close ✕
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-72 overflow-y-auto pr-1">
            {filteredShorts.map((short, idx) => (
              <button
                key={short.id}
                onClick={() => handleSelectShort(idx)}
                className={`p-2.5 rounded-2xl border text-left flex items-center gap-2.5 transition-all ${
                  currentIndex === idx
                    ? "bg-indigo-50 dark:bg-indigo-950/60 border-indigo-500 shadow-xs ring-1 ring-indigo-500"
                    : "bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 hover:bg-slate-100"
                }`}
              >
                <div className="relative w-12 h-16 rounded-lg overflow-hidden shrink-0 bg-slate-900">
                  <img
                    src={short.thumbnailUrl}
                    alt={short.title}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                    <Play className="w-4 h-4 text-white fill-white" />
                  </div>
                  <span className="absolute bottom-0.5 right-0.5 text-[8px] font-mono px-1 rounded bg-black/80 text-white font-bold">
                    {short.duration}
                  </span>
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1 mb-0.5">
                    <span
                      className={`text-[9px] font-bold px-1.5 py-0.2 rounded-full ${
                        short.platform === "youtube" ? "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300" : "bg-pink-100 text-pink-700 dark:bg-pink-950 dark:text-pink-300"
                      }`}
                    >
                      {short.platform === "youtube" ? "Shorts" : "Reel"}
                    </span>
                    <span className="text-[10px] text-slate-500 truncate">{short.subject}</span>
                  </div>
                  <p className="text-xs font-bold text-slate-900 dark:text-white line-clamp-2 leading-tight">
                    {short.title}
                  </p>
                  <p className="text-[10px] text-slate-400 mt-0.5 truncate">
                    @{short.channel} • {short.likes} likes
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* 4. REAL LIVE EXTERNAL SEARCH ACTIONS (When user is searching) */}
      {searchQuery && (
        <div className="p-3 rounded-2xl bg-gradient-to-r from-slate-900 to-indigo-950 text-white shadow-md flex items-center justify-between gap-2 flex-wrap">
          <div className="flex items-center gap-2">
            <Compass className="w-4 h-4 text-amber-400 shrink-0" />
            <span className="text-xs font-semibold">
              Live Search for <strong className="text-amber-300">"{searchQuery}"</strong>:
            </span>
          </div>

          <div className="flex items-center gap-1.5 flex-wrap">
            <button
              onClick={() => handleExternalSearch("shorts")}
              className="px-2.5 py-1 rounded-lg bg-red-600 hover:bg-red-700 text-white text-[11px] font-bold flex items-center gap-1"
              title="Search YouTube Shorts"
            >
              <Youtube className="w-3 h-3" />
              <span>YouTube Shorts ↗</span>
            </button>
            <button
              onClick={() => handleExternalSearch("reels")}
              className="px-2.5 py-1 rounded-lg bg-pink-600 hover:bg-pink-700 text-white text-[11px] font-bold flex items-center gap-1"
              title="Search Instagram Reels"
            >
              <Instagram className="w-3 h-3" />
              <span>Insta Reels ↗</span>
            </button>
            <button
              onClick={() => handleExternalSearch("youtube")}
              className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-white text-[11px] font-bold flex items-center gap-1"
              title="Search Full Lectures"
            >
              <Tv className="w-3 h-3 text-indigo-300" />
              <span>Lectures ↗</span>
            </button>
          </div>
        </div>
      )}

      {/* 5. IF NO MATCHES IN CURATED DATABASE */}
      {filteredShorts.length === 0 ? (
        <div className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center space-y-4">
          <div className="w-14 h-14 mx-auto rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400">
            <Search className="w-7 h-7" />
          </div>
          <div className="space-y-1">
            <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
              No local shorts found for "{searchQuery}"
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
              Don't worry! You can search directly across millions of live educational Shorts & Reels for this exact concept:
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-2 pt-2">
            <button
              onClick={() => handleExternalSearch("shorts")}
              className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md"
            >
              <Youtube className="w-4 h-4" />
              <span>Search YouTube Shorts for "{searchQuery}" ↗</span>
            </button>
            <button
              onClick={() => handleExternalSearch("reels")}
              className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-gradient-to-r from-pink-600 to-purple-600 hover:opacity-95 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md"
            >
              <Instagram className="w-4 h-4" />
              <span>Search Instagram Reels for "{searchQuery}" ↗</span>
            </button>
          </div>

          <button
            onClick={handleClearFilters}
            className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline pt-2 block mx-auto"
          >
            ← View All Curated Shorts
          </button>
        </div>
      ) : currentShort ? (
        <>
          {/* Direct Links Quick Bar for Current Short */}
          <div className="p-2.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex items-center justify-between gap-2">
            <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 flex items-center gap-1 truncate">
              <Sparkles className="w-3.5 h-3.5 text-amber-500 shrink-0" /> Links for:{" "}
              <strong className="text-slate-800 dark:text-slate-200 truncate">{currentShort.concept}</strong>
            </span>
            <div className="flex items-center gap-1.5 shrink-0">
              <button
                onClick={() => handleOpenPlatform("shorts")}
                className="px-2.5 py-1 rounded-lg bg-red-50 dark:bg-red-950/50 hover:bg-red-100 text-red-700 dark:text-red-300 text-xs font-bold flex items-center gap-1 border border-red-200/60"
                title="Watch YouTube Short"
              >
                <Flame className="w-3 h-3 text-red-600" />
                <span>Shorts ⚡</span>
              </button>
              <button
                onClick={() => handleOpenPlatform("reels")}
                className="px-2.5 py-1 rounded-lg bg-pink-50 dark:bg-pink-950/50 hover:bg-pink-100 text-pink-700 dark:text-pink-300 text-xs font-bold flex items-center gap-1 border border-pink-200/60"
                title="Watch Instagram Reel"
              >
                <Instagram className="w-3 h-3 text-pink-600" />
                <span>Reel 📸</span>
              </button>
              <button
                onClick={() => handleOpenPlatform("lecture")}
                className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-800 dark:text-slate-200 text-xs font-bold flex items-center gap-1"
                title="Watch Full Length Lecture"
              >
                <Youtube className="w-3 h-3 text-red-600" />
                <span>Lecture 📺</span>
              </button>
            </div>
          </div>

          {/* Vertical Reel Container Card */}
          <div className="relative rounded-3xl bg-slate-950 text-white overflow-hidden shadow-2xl border border-slate-800 aspect-[9/16] max-h-[640px] flex flex-col justify-between">
            {/* Background / Embedded Player */}
            <div className="absolute inset-0 z-0">
              {currentShort.youtubeId ? (
                <iframe
                  src={`https://www.youtube-nocookie.com/embed/${currentShort.youtubeId}?autoplay=1&rel=0`}
                  title={currentShort.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                  className="w-full h-full border-0 object-cover"
                />
              ) : (
                <div className="w-full h-full relative">
                  <img
                    src={currentShort.thumbnailUrl}
                    alt={currentShort.title}
                    className="w-full h-full object-cover opacity-60"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent flex flex-col items-center justify-center p-6 text-center space-y-2">
                    <Instagram className="w-14 h-14 text-pink-500 mb-1" />
                    <p className="font-bold text-base text-white">Instagram Educational Reel</p>
                    <p className="text-xs text-slate-300 max-w-xs">
                      Watch the official audio reel for "{currentShort.concept}" on Instagram.
                    </p>
                    <button
                      onClick={() => handleOpenPlatform("reels")}
                      className="mt-3 px-5 py-2.5 rounded-2xl bg-gradient-to-r from-pink-600 to-purple-600 hover:opacity-90 text-white font-bold text-xs shadow-lg flex items-center gap-2"
                    >
                      <Instagram className="w-4 h-4" />
                      <span>Open on Instagram Reels ↗</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Top Badges Overlay */}
            <div className="relative z-10 p-4 flex items-center justify-between bg-gradient-to-b from-black/80 to-transparent pointer-events-auto">
              <div className="flex items-center gap-2">
                <span
                  className={`px-2.5 py-1 rounded-full text-[10px] font-bold text-white flex items-center gap-1 ${
                    currentShort.platform === "youtube" ? "bg-red-600" : "bg-pink-600"
                  }`}
                >
                  {currentShort.platform === "youtube" ? <Youtube className="w-3 h-3" /> : <Instagram className="w-3 h-3" />}
                  <span>{currentShort.platform === "youtube" ? "Shorts" : "Reel"}</span>
                </span>

                <span className="px-2.5 py-1 rounded-full bg-white/20 backdrop-blur-md text-[10px] font-semibold text-white">
                  {currentShort.subject} • {currentShort.classGrade}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowResultsList(true)}
                  className="text-xs font-mono font-bold text-white/90 bg-black/60 hover:bg-black/80 px-2.5 py-1 rounded-lg backdrop-blur-md transition-colors flex items-center gap-1"
                  title="View matching playlist"
                >
                  <span>{currentIndex + 1} / {filteredShorts.length}</span>
                  <ChevronDown className="w-3 h-3" />
                </button>
              </div>
            </div>

            {/* Right Floating Actions (Like, Save, Share, Concept Drawer, Up/Down) */}
            <div className="relative z-10 p-4 self-end flex flex-col items-center gap-3.5 pointer-events-auto">
              {/* Like */}
              <button
                onClick={toggleLike}
                className="flex flex-col items-center gap-1 text-white group"
                title="Like"
              >
                <div className="p-3 rounded-full bg-black/60 hover:bg-black/80 backdrop-blur-md transition-transform group-hover:scale-110">
                  <Heart
                    className={`w-6 h-6 ${
                      likedIds.includes(currentShort.id) ? "text-rose-500 fill-rose-500" : "text-white"
                    }`}
                  />
                </div>
                <span className="text-[11px] font-bold">{currentShort.likes || "89K"}</span>
              </button>

              {/* Bookmark / Save */}
              <button
                onClick={toggleSave}
                className="flex flex-col items-center gap-1 text-white group"
                title="Save"
              >
                <div className="p-3 rounded-full bg-black/60 hover:bg-black/80 backdrop-blur-md transition-transform group-hover:scale-110">
                  {savedIds.includes(currentShort.id) ? (
                    <BookmarkCheck className="w-6 h-6 text-amber-400 fill-amber-400" />
                  ) : (
                    <Bookmark className="w-6 h-6 text-white" />
                  )}
                </div>
                <span className="text-[11px] font-bold">Save</span>
              </button>

              {/* Share */}
              <button
                onClick={() => handleShare("shorts")}
                className="flex flex-col items-center gap-1 text-white group"
                title="Share"
              >
                <div className="p-3 rounded-full bg-black/60 hover:bg-black/80 backdrop-blur-md transition-transform group-hover:scale-110">
                  <Share2 className="w-6 h-6 text-white" />
                </div>
                <span className="text-[11px] font-bold">Share</span>
              </button>

              {/* Concept Learning Drawer Toggle */}
              <button
                onClick={() => setIsConceptDrawerOpen(!isConceptDrawerOpen)}
                className="flex flex-col items-center gap-1 text-amber-300 group"
                title="Key Formula & Quiz"
              >
                <div className="p-3 rounded-full bg-amber-500/80 hover:bg-amber-500 text-slate-950 backdrop-blur-md shadow-lg shadow-amber-500/30 transition-transform group-hover:scale-110">
                  <Sparkles className="w-6 h-6" />
                </div>
                <span className="text-[10px] font-extrabold text-amber-300">Quiz & Key</span>
              </button>

              {/* Up & Down Arrows */}
              <div className="pt-2 flex flex-col gap-1.5">
                <button
                  disabled={currentIndex === 0}
                  onClick={handlePrev}
                  className="p-2 rounded-full bg-white/20 hover:bg-white/30 disabled:opacity-30 backdrop-blur-md text-white transition-colors"
                  title="Previous Short"
                >
                  <ChevronUp className="w-5 h-5" />
                </button>
                <button
                  disabled={currentIndex === filteredShorts.length - 1}
                  onClick={handleNext}
                  className="p-2 rounded-full bg-white/20 hover:bg-white/30 disabled:opacity-30 backdrop-blur-md text-white transition-colors"
                  title="Next Short"
                >
                  <ChevronDown className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Bottom Details Overlay */}
            <div className="relative z-10 p-4 bg-gradient-to-t from-black via-black/80 to-transparent space-y-2 pointer-events-auto">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-white/90">@{currentShort.channel}</span>
                <div className="flex items-center gap-2 ml-auto">
                  <button
                    onClick={() => handleOpenPlatform("shorts")}
                    className="text-[11px] font-semibold text-rose-300 hover:text-white flex items-center gap-0.5"
                  >
                    <span>Shorts ⚡</span>
                  </button>
                  <span>•</span>
                  <button
                    onClick={() => handleOpenPlatform("reels")}
                    className="text-[11px] font-semibold text-pink-300 hover:text-white flex items-center gap-0.5"
                  >
                    <span>Reels 📸</span>
                  </button>
                </div>
              </div>

              <h3 className="font-bold text-sm text-white line-clamp-2 leading-snug">
                {currentShort.title}
              </h3>

              <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
                {currentShort.quickExplanation}
              </p>

              <div className="flex items-center gap-2 pt-1">
                <button
                  onClick={() => setIsConceptDrawerOpen(true)}
                  className="flex-1 py-2 px-3 rounded-xl bg-white/20 hover:bg-white/30 text-white font-bold text-xs backdrop-blur-md flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Lightbulb className="w-3.5 h-3.5 text-amber-300" />
                  <span>Read Key Formula & Mini Quiz</span>
                </button>
              </div>
            </div>
          </div>

          {/* 6. Concept Drawer / Pop-up Sheet (Step 1-4) */}
          {isConceptDrawerOpen && (
            <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl space-y-4 animate-in fade-in slide-in-from-bottom-3 duration-200 text-slate-900 dark:text-slate-100">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-amber-500" />
                  <h4 className="font-extrabold text-sm sm:text-base text-slate-900 dark:text-white">
                    Concept Master Sheet: {currentShort.concept}
                  </h4>
                </div>
                <button
                  onClick={() => setIsConceptDrawerOpen(false)}
                  className="text-xs font-bold text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                >
                  Close ✕
                </button>
              </div>

              {/* Quick External Links Row */}
              <div className="flex items-center gap-2 flex-wrap pt-1 pb-1">
                <button
                  onClick={() => handleOpenPlatform("shorts")}
                  className="px-3 py-1.5 rounded-xl bg-red-600 text-white text-xs font-bold flex items-center gap-1.5 hover:bg-red-700 transition-colors"
                >
                  <Flame className="w-3.5 h-3.5" />
                  <span>YouTube Shorts ↗</span>
                </button>
                <button
                  onClick={() => handleOpenPlatform("reels")}
                  className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-pink-600 to-purple-600 text-white text-xs font-bold flex items-center gap-1.5 hover:opacity-90 transition-opacity"
                >
                  <Instagram className="w-3.5 h-3.5" />
                  <span>Instagram Reels ↗</span>
                </button>
                <button
                  onClick={() => handleOpenPlatform("lecture")}
                  className="px-3 py-1.5 rounded-xl bg-slate-800 text-white text-xs font-bold flex items-center gap-1.5 hover:bg-slate-700 transition-colors"
                >
                  <Youtube className="w-3.5 h-3.5" />
                  <span>Full Lecture ↗</span>
                </button>
              </div>

              {/* Formula / Definition */}
              <div className="p-3.5 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/50 space-y-1">
                <p className="text-xs font-bold text-amber-900 dark:text-amber-200">
                  ⚡ Core Formula or Rule:
                </p>
                <p className="font-mono text-xs sm:text-sm font-bold text-amber-950 dark:text-amber-100">
                  {currentShort.formulaOrDefinition}
                </p>
              </div>

              {/* Key Points */}
              <div className="space-y-1.5">
                <p className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  📌 High-Yield Takeaways:
                </p>
                <ul className="space-y-1.5 text-xs text-slate-600 dark:text-slate-400">
                  {currentShort.keyPoints.map((pt, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 mt-0.5 shrink-0" />
                      <span>{pt}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Mini Quiz */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-3">
                <p className="text-xs font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-1.5">
                  <HelpCircle className="w-4 h-4" />
                  <span>Quick Check: {currentShort.practiceQuestion.question}</span>
                </p>

                <div className="space-y-1.5">
                  {currentShort.practiceQuestion.options.map((opt, idx) => {
                    const isSelected = selectedQuizOption === idx;
                    const isCorrect = currentShort.practiceQuestion.correctIndex === idx;

                    let btnClass = "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200";
                    if (isQuizSubmitted) {
                      if (isCorrect) {
                        btnClass = "bg-emerald-50 dark:bg-emerald-950 border-emerald-500 text-emerald-900 dark:text-emerald-200 font-bold";
                      } else if (isSelected) {
                        btnClass = "bg-rose-50 dark:bg-rose-950 border-rose-500 text-rose-900 dark:text-rose-200";
                      }
                    } else if (isSelected) {
                      btnClass = "bg-indigo-50 dark:bg-indigo-950 border-indigo-500 text-indigo-900 dark:text-indigo-200";
                    }

                    return (
                      <button
                        key={idx}
                        disabled={isQuizSubmitted}
                        onClick={() => setSelectedQuizOption(idx)}
                        className={`w-full p-2.5 rounded-xl border text-left text-xs transition-all flex items-center justify-between gap-2 ${btnClass}`}
                      >
                        <span>{opt}</span>
                        {isQuizSubmitted && isCorrect && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
                      </button>
                    );
                  })}
                </div>

                <div className="flex items-center justify-between pt-1">
                  {!isQuizSubmitted ? (
                    <button
                      disabled={selectedQuizOption === null}
                      onClick={() => setIsQuizSubmitted(true)}
                      className="px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-bold text-xs"
                    >
                      Check Answer
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        setSelectedQuizOption(null);
                        setIsQuizSubmitted(false);
                      }}
                      className="px-3 py-1 rounded-xl bg-slate-200 dark:bg-slate-700 text-xs font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1"
                    >
                      <RotateCcw className="w-3 h-3" /> Reset
                    </button>
                  )}
                </div>

                {isQuizSubmitted && (
                  <p className="text-xs text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 p-2.5 rounded-xl border border-emerald-200 dark:border-emerald-800">
                    {currentShort.practiceQuestion.explanation}
                  </p>
                )}
              </div>
            </div>
          )}
        </>
      ) : null}
    </div>
  );
};
