import React, { useState, useMemo, useEffect } from "react";
import {
  Youtube,
  Instagram,
  Search,
  ExternalLink,
  Play,
  Sparkles,
  Clock,
  Star,
  Bookmark,
  BookmarkCheck,
  Filter,
  GraduationCap,
  BookOpen,
  X,
  Share2,
  CheckCircle2,
  TrendingUp,
  Flame,
  HelpCircle,
  Zap,
  Layers,
  ArrowRight,
  Heart,
  Compass,
  ListFilter,
  Check,
  RotateCcw,
  BookMarked,
  MessageCircle,
  Lightbulb,
  Copy,
  Tv,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useStudy } from "../../context/StudyContext";
import { ScholarVideoItem, VideoContentType, VideoPlatform } from "../../types";
import {
  SCHOLAR_ALL_VIDEOS,
  normalizeSearchKeywords,
  getConceptYouTubeUrl,
  getConceptShortsUrl,
  getConceptReelsUrl,
  getYouTubeLongSearchUrl,
  getYouTubeShortsSearchUrl,
  getInstagramReelsSearchUrl,
} from "../../data/scholarVideosData";

interface ScholarVideosHubProps {
  initialTab?: "long" | "short" | "saved";
}

export const ScholarVideosHub: React.FC<ScholarVideosHubProps> = ({
  initialTab = "long",
}) => {
  const { user } = useAuth();
  const { addToast, setCurrentView } = useStudy();

  const [activeTab, setActiveTab] = useState<"long" | "short" | "saved">(initialTab);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSubject, setSelectedSubject] = useState<string>("All");
  const [selectedClass, setSelectedClass] = useState<string>("All");
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>("All");
  const [selectedPlatform, setSelectedPlatform] = useState<string>("All");
  const [activeModalVideo, setActiveModalVideo] = useState<ScholarVideoItem | null>(null);
  const [activeModalFormat, setActiveModalFormat] = useState<"lecture" | "short" | "reel">("lecture");

  // Persistence for Saved / Bookmarked videos and Likes
  const [savedVideoIds, setSavedVideoIds] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem("scholar_saved_videos");
      return stored ? JSON.parse(stored) : ["vid_math_quad_eq", "short_sci_photosynthesis"];
    } catch {
      return ["vid_math_quad_eq", "short_sci_photosynthesis"];
    }
  });

  const [likedVideoIds, setLikedVideoIds] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem("scholar_liked_videos");
      return stored ? JSON.parse(stored) : ["short_math_pythagoras_trick"];
    } catch {
      return ["short_math_pythagoras_trick"];
    }
  });

  // Practice Quiz Interactive State inside video modal
  const [selectedQuizOption, setSelectedQuizOption] = useState<number | null>(null);
  const [isQuizSubmitted, setIsQuizSubmitted] = useState<boolean>(false);

  useEffect(() => {
    try {
      localStorage.setItem("scholar_saved_videos", JSON.stringify(savedVideoIds));
    } catch {
      // ignore
    }
  }, [savedVideoIds]);

  useEffect(() => {
    try {
      localStorage.setItem("scholar_liked_videos", JSON.stringify(likedVideoIds));
    } catch {
      // ignore
    }
  }, [likedVideoIds]);

  const subjectsList = [
    "All",
    "Mathematics",
    "Science",
    "Physics",
    "Chemistry",
    "Biology",
    "Social Science",
    "English",
    "Computer Science",
  ];

  const classList = [
    "All",
    "Class 10",
    "Class 12",
    "Class 11",
    "Class 9",
    "Class 8",
    "Class 7",
    "Class 6",
    "Competitive Exams",
  ];

  // Quick concept popular pills
  const POPULAR_CONCEPTS = [
    "Quadratic Equations",
    "Photosynthesis in 45s",
    "Pythagoras Theorem",
    "Fleming's Left Hand Rule",
    "SN1 vs SN2",
    "Kirchhoff's Laws",
    "Power Rule Derivative",
    "Mitochondria ATP",
    "Trigonometry",
    "Active & Passive Voice",
    "Nationalism in India",
    "Python Functions",
  ];

  const toggleSave = (videoId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setSavedVideoIds((prev) => {
      const exists = prev.includes(videoId);
      const next = exists ? prev.filter((id) => id !== videoId) : [...prev, videoId];
      addToast(
        exists ? "Removed from Saved Videos" : "Saved to your Scholar Video Library! 🔖",
        "info"
      );
      return next;
    });
  };

  const toggleLike = (videoId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setLikedVideoIds((prev) => {
      const exists = prev.includes(videoId);
      const next = exists ? prev.filter((id) => id !== videoId) : [...prev, videoId];
      addToast(exists ? "Removed like" : "Added to Liked Videos ❤️", "info");
      return next;
    });
  };

  const handleOpenLink = (url: string, platformName: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    window.open(url, "_blank", "noopener,noreferrer");
    addToast(`Opening on ${platformName} ↗`, "success");
  };

  const handleCopyLink = (url: string, title: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (navigator.clipboard) {
      navigator.clipboard.writeText(url);
      addToast(`Copied link for "${title}"! 📋`, "success");
    } else {
      addToast(`Link: ${url}`, "info");
    }
  };

  const handleDirectSearch = (platform: "youtube_long" | "youtube_shorts" | "instagram") => {
    const term = searchQuery.trim() || "Class 10 12 high yield concepts";
    let url = "";
    if (platform === "youtube_long") {
      url = getYouTubeLongSearchUrl(term, user?.grade, selectedSubject !== "All" ? selectedSubject : undefined);
    } else if (platform === "youtube_shorts") {
      url = getYouTubeShortsSearchUrl(term, user?.grade, selectedSubject !== "All" ? selectedSubject : undefined);
    } else {
      url = getInstagramReelsSearchUrl(term, user?.grade, selectedSubject !== "All" ? selectedSubject : undefined);
    }
    window.open(url, "_blank", "noopener,noreferrer");
    addToast(`Searching external platform for "${term}"...`, "info");
  };

  // Filter and search logic with smart intent recognition
  const filteredVideos = useMemo(() => {
    const searchData = normalizeSearchKeywords(searchQuery);

    return SCHOLAR_ALL_VIDEOS.filter((video) => {
      // Tab filter
      if (activeTab === "saved") {
        if (!savedVideoIds.includes(video.id)) return false;
      } else if (activeTab === "long") {
        if (video.type !== "long") return false;
      } else if (activeTab === "short") {
        if (video.type !== "short") return false;
      }

      // Subject filter
      if (selectedSubject !== "All" && video.subject !== selectedSubject) {
        return false;
      }

      // Class / Grade filter
      if (selectedClass !== "All" && video.classGrade !== selectedClass) {
        return false;
      }

      // Platform filter
      if (selectedPlatform !== "All") {
        if (selectedPlatform.toLowerCase() !== video.platform.toLowerCase()) {
          return false;
        }
      }

      // Search Query filter (matches title, concept, chapter, description, tags)
      if (searchQuery.trim()) {
        const q = searchData.normalized;
        const matchesText =
          video.title.toLowerCase().includes(q) ||
          video.concept.toLowerCase().includes(q) ||
          video.chapter.toLowerCase().includes(q) ||
          video.subject.toLowerCase().includes(q) ||
          video.description.toLowerCase().includes(q) ||
          video.tags.some((t) => t.toLowerCase().includes(q));

        if (!matchesText) return false;
      }

      return true;
    });
  }, [
    activeTab,
    searchQuery,
    selectedSubject,
    selectedClass,
    selectedPlatform,
    savedVideoIds,
  ]);

  const openVideoModal = (video: ScholarVideoItem) => {
    setActiveModalVideo(video);
    setActiveModalFormat(video.type === "short" ? "short" : "lecture");
    setSelectedQuizOption(null);
    setIsQuizSubmitted(false);
  };

  return (
    <div className="space-y-6 pb-20">
      {/* 1. Header Banner & Search Box */}
      <div className="relative rounded-3xl bg-gradient-to-br from-indigo-900 via-slate-900 to-purple-950 p-6 sm:p-8 text-white shadow-xl overflow-hidden">
        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-xs font-semibold text-indigo-200">
            <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-spin" />
            <span>Scholar Educational Hub • Video Lectures, YouTube Shorts & Instagram Reels</span>
          </div>

          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-white leading-tight">
            Learn Any Concept in Full Lectures, Shorts & Reels
          </h1>

          <p className="text-sm sm:text-base text-indigo-100/90 leading-relaxed">
            Instant access to full video lectures, 30–60s YouTube Shorts, and Instagram Reels with key formulas, high-yield bullet notes, and interactive practice tests for every concept.
          </p>

          {/* Search Bar with Instant Keyword Intent Detection */}
          <div className="pt-2 flex flex-col sm:flex-row items-stretch gap-2.5">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search topics (e.g., 'Trigonometry', 'Photosynthesis', 'Quadratic Equations', 'SN1 vs SN2')..."
                className="w-full pl-11 pr-4 py-3 rounded-2xl bg-white/15 backdrop-blur-md border border-white/20 text-white placeholder-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 focus:bg-white/20 transition-all shadow-inner"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full text-slate-300 hover:text-white hover:bg-white/10"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Quick External Platform Search Dropdown/Buttons */}
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => handleDirectSearch("youtube_long")}
                className="flex-1 sm:flex-none px-3.5 py-3 rounded-2xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs sm:text-sm shadow-md transition-all active:scale-95 flex items-center justify-center gap-1.5 whitespace-nowrap"
                title="Search on YouTube"
              >
                <Youtube className="w-4 h-4 text-white" />
                <span>YouTube ↗</span>
              </button>
              <button
                onClick={() => handleDirectSearch("youtube_shorts")}
                className="flex-1 sm:flex-none px-3.5 py-3 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs sm:text-sm shadow-md transition-all active:scale-95 flex items-center justify-center gap-1.5 whitespace-nowrap"
                title="Search on YouTube Shorts"
              >
                <Flame className="w-4 h-4 text-white" />
                <span>Shorts ↗</span>
              </button>
              <button
                onClick={() => handleDirectSearch("instagram")}
                className="flex-1 sm:flex-none px-3.5 py-3 rounded-2xl bg-gradient-to-r from-pink-600 to-purple-600 hover:opacity-90 text-white font-bold text-xs sm:text-sm shadow-md transition-all active:scale-95 flex items-center justify-center gap-1.5 whitespace-nowrap"
                title="Explore on Instagram Reels"
              >
                <Instagram className="w-4 h-4 text-white" />
                <span>Reels ↗</span>
              </button>
            </div>
          </div>

          {/* Quick Popular Concept Pills */}
          <div className="pt-1 flex items-center gap-1.5 flex-wrap">
            <span className="text-[11px] font-semibold text-indigo-200 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" /> Quick Concepts:
            </span>
            {POPULAR_CONCEPTS.map((concept, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setSearchQuery(concept);
                  if (concept.includes("45s") || concept.includes("Rule") || concept.includes("ATP") || concept.includes("Theorem")) {
                    setActiveTab("short");
                  } else {
                    setActiveTab("long");
                  }
                }}
                className="px-2.5 py-1 rounded-xl bg-white/10 hover:bg-white/20 text-white text-[11px] font-medium border border-white/10 transition-colors"
              >
                {concept}
              </button>
            ))}
          </div>
        </div>

        {/* Decorative background glow */}
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-radial from-white/15 to-transparent pointer-events-none" />
        <Youtube className="absolute -right-8 -bottom-8 w-56 h-56 text-white/5 rotate-12 pointer-events-none" />
      </div>

      {/* 2. Main Tabs Switcher: Long Videos vs Shorts/Reels vs Saved */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white dark:bg-slate-900 p-2 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
        <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800/80 p-1 rounded-xl flex-wrap">
          <button
            onClick={() => setActiveTab("long")}
            className={`flex-1 sm:flex-none px-4 py-2 rounded-lg text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all ${
              activeTab === "long"
                ? "bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            <Youtube className="w-4 h-4 text-red-600" />
            <span>Full Lectures ({SCHOLAR_ALL_VIDEOS.filter(v => v.type === "long").length})</span>
          </button>

          <button
            onClick={() => setActiveTab("short")}
            className={`flex-1 sm:flex-none px-4 py-2 rounded-lg text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all ${
              activeTab === "short"
                ? "bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            <Flame className="w-4 h-4 text-amber-500 animate-pulse" />
            <span>Shorts & Reels ({SCHOLAR_ALL_VIDEOS.filter(v => v.type === "short").length})</span>
          </button>

          <button
            onClick={() => setActiveTab("saved")}
            className={`flex-1 sm:flex-none px-4 py-2 rounded-lg text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all ${
              activeTab === "saved"
                ? "bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            <Bookmark className="w-4 h-4 text-indigo-500" />
            <span>Saved ({savedVideoIds.length})</span>
          </button>
        </div>

        {/* Platform selection filter pill */}
        <div className="flex items-center gap-1 px-2">
          <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 mr-1 hidden md:inline">
            Platform:
          </span>
          {["All", "YouTube", "Instagram"].map((plat) => (
            <button
              key={plat}
              onClick={() => setSelectedPlatform(plat)}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                selectedPlatform === plat
                  ? "bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800"
                  : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
              }`}
            >
              {plat}
            </button>
          ))}
        </div>
      </div>

      {/* 3. Filter Bar (Subject & Class filters) */}
      <div className="space-y-3">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          {/* Subject Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full">
            {subjectsList.map((subj) => (
              <button
                key={subj}
                onClick={() => setSelectedSubject(subj)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                  selectedSubject === subj
                    ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-xs"
                    : "bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800"
                }`}
              >
                {subj}
              </button>
            ))}
          </div>

          {/* Class Grade Select */}
          <div className="flex items-center gap-2 shrink-0">
            <span className="text-xs font-semibold text-slate-500 shrink-0">Class:</span>
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="px-3 py-1.5 text-xs rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
            >
              {classList.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* 4. Video Grid Results */}
      {filteredVideos.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredVideos.map((video) => {
            const isSaved = savedVideoIds.includes(video.id);
            const isLiked = likedVideoIds.includes(video.id);
            const youtubeLectureUrl = getConceptYouTubeUrl(video);
            const shortsUrl = getConceptShortsUrl(video);
            const reelsUrl = getConceptReelsUrl(video);

            return (
              <div
                key={video.id}
                className="group flex flex-col justify-between rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-indigo-400 dark:hover:border-indigo-600 shadow-xs hover:shadow-md transition-all overflow-hidden"
              >
                {/* Thumbnail Container */}
                <div
                  className="relative aspect-video w-full bg-slate-900 overflow-hidden cursor-pointer"
                  onClick={() => openVideoModal(video)}
                >
                  <img
                    src={video.thumbnailUrl}
                    alt={video.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                  {/* Duration Badge */}
                  <div className="absolute bottom-2.5 right-2.5 px-2 py-0.5 rounded-md bg-black/80 text-white text-[11px] font-mono font-bold flex items-center gap-1 backdrop-blur-xs">
                    <Clock className="w-3 h-3 text-indigo-400" />
                    <span>{video.duration}</span>
                  </div>

                  {/* Platform & Type Tag */}
                  <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5 flex-wrap">
                    <span
                      className={`px-2 py-0.5 rounded-md text-[10px] font-bold text-white backdrop-blur-xs flex items-center gap-1 ${
                        video.platform === "youtube" ? "bg-red-600/90" : "bg-gradient-to-r from-pink-600 to-purple-600"
                      }`}
                    >
                      {video.platform === "youtube" ? <Youtube className="w-3 h-3" /> : <Instagram className="w-3 h-3" />}
                      <span>{video.type === "long" ? "Lecture" : "Short / Reel"}</span>
                    </span>
                    <span className="px-2 py-0.5 rounded-md bg-slate-900/90 text-white text-[10px] font-bold backdrop-blur-xs">
                      {video.classGrade}
                    </span>
                  </div>

                  {/* Top Right Save & Like Actions */}
                  <div className="absolute top-2.5 right-2.5 flex items-center gap-1">
                    <button
                      onClick={(e) => toggleLike(video.id, e)}
                      className="p-1.5 rounded-full bg-black/60 hover:bg-black/80 text-white backdrop-blur-xs transition-colors"
                      title="Like Video"
                    >
                      <Heart
                        className={`w-4 h-4 ${isLiked ? "text-rose-500 fill-rose-500" : "text-white"}`}
                      />
                    </button>
                    <button
                      onClick={(e) => toggleSave(video.id, e)}
                      className="p-1.5 rounded-full bg-black/60 hover:bg-black/80 text-white backdrop-blur-xs transition-colors"
                      title="Save Video"
                    >
                      {isSaved ? (
                        <BookmarkCheck className="w-4 h-4 text-amber-400 fill-amber-400" />
                      ) : (
                        <Bookmark className="w-4 h-4 text-white" />
                      )}
                    </button>
                  </div>

                  {/* Center Play Button Overlay */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-12 h-12 rounded-full bg-indigo-600 text-white flex items-center justify-center shadow-lg shadow-indigo-600/50 group-hover:scale-110 transition-transform">
                      <Play className="w-5 h-5 fill-white translate-x-0.5" />
                    </div>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-3">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
                      <span className="font-semibold text-indigo-600 dark:text-indigo-400 truncate max-w-[150px]">
                        {video.channel}
                      </span>
                      <div className="flex items-center gap-1">
                        <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                        <span>{video.rating || 4.9}</span>
                        <span>•</span>
                        <span>{video.views} views</span>
                      </div>
                    </div>

                    <h3
                      onClick={() => openVideoModal(video)}
                      className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors line-clamp-2 cursor-pointer"
                    >
                      {video.title}
                    </h3>

                    <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed">
                      {video.description}
                    </p>

                    {/* Concept & Subject Tag */}
                    <div className="pt-1 flex items-center gap-1.5 flex-wrap">
                      <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md">
                        📌 {video.concept}
                      </span>
                      <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">
                        {video.subject}
                      </span>
                    </div>
                  </div>

                  {/* Multi-Format Direct Links Row: Lecture, Shorts, Reels & Quiz */}
                  <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-2">
                    <div className="grid grid-cols-2 gap-1.5">
                      {/* YouTube Shorts Link */}
                      <button
                        onClick={(e) => handleOpenLink(shortsUrl, "YouTube Shorts", e)}
                        className="flex items-center justify-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-red-50 dark:bg-red-950/40 hover:bg-red-100 dark:hover:bg-red-900/50 text-red-700 dark:text-red-300 font-bold text-xs transition-all active:scale-95 border border-red-200/60 dark:border-red-900/50"
                        title="Watch 30-60s YouTube Short"
                      >
                        <Flame className="w-3.5 h-3.5 text-red-600" />
                        <span>Shorts ⚡</span>
                        <ExternalLink className="w-2.5 h-2.5 opacity-60" />
                      </button>

                      {/* Instagram Reel Link */}
                      <button
                        onClick={(e) => handleOpenLink(reelsUrl, "Instagram Reels", e)}
                        className="flex items-center justify-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-pink-50 dark:bg-pink-950/40 hover:bg-pink-100 dark:hover:bg-pink-900/50 text-pink-700 dark:text-pink-300 font-bold text-xs transition-all active:scale-95 border border-pink-200/60 dark:border-pink-900/50"
                        title="Watch Instagram Educational Reel"
                      >
                        <Instagram className="w-3.5 h-3.5 text-pink-600" />
                        <span>Reel 📸</span>
                        <ExternalLink className="w-2.5 h-2.5 opacity-60" />
                      </button>
                    </div>

                    <div className="flex items-center gap-2">
                      {/* Full Lecture Link */}
                      <button
                        onClick={(e) => handleOpenLink(youtubeLectureUrl, "YouTube Lecture", e)}
                        className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold shadow-xs transition-all active:scale-95"
                      >
                        <Youtube className="w-4 h-4" />
                        <span>Full Lecture</span>
                        <ExternalLink className="w-3 h-3 opacity-80" />
                      </button>

                      {/* Concept Sheet & Quiz */}
                      <button
                        onClick={() => openVideoModal(video)}
                        className="px-3 py-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300 text-xs font-bold transition-all flex items-center gap-1"
                        title="View Learning Breakdown & Practice Quiz"
                      >
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Quiz</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Empty / Fallback State */
        <div className="p-8 sm:p-12 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 mx-auto flex items-center justify-center">
            <Search className="w-8 h-8" />
          </div>
          <div className="space-y-1 max-w-md mx-auto">
            <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
              {activeTab === "saved"
                ? "No Saved Videos in your Library yet"
                : `No local videos found matching "${searchQuery}"`}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {activeTab === "saved"
                ? "Click the bookmark icon on any lecture or short to save it for quick review."
                : "You can search YouTube or Instagram directly with 1-click for this exact concept:"}
            </p>
          </div>

          <div className="flex items-center justify-center gap-3 pt-2 flex-wrap">
            <button
              onClick={() => handleDirectSearch("youtube_long")}
              className="px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold flex items-center gap-2 shadow-md transition-all active:scale-95"
            >
              <Youtube className="w-4 h-4" />
              <span>Search YouTube Lectures ↗</span>
            </button>
            <button
              onClick={() => handleDirectSearch("youtube_shorts")}
              className="px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold flex items-center gap-2 shadow-md transition-all active:scale-95"
            >
              <Flame className="w-4 h-4" />
              <span>Search YouTube Shorts ↗</span>
            </button>
            <button
              onClick={() => handleDirectSearch("instagram")}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-pink-600 to-purple-600 text-white text-xs font-bold flex items-center gap-2 shadow-md transition-all active:scale-95"
            >
              <Instagram className="w-4 h-4" />
              <span>Explore Instagram Reels ↗</span>
            </button>
            <button
              onClick={() => {
                setSearchQuery("");
                setSelectedSubject("All");
                setSelectedClass("All");
              }}
              className="px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold hover:bg-slate-200 transition-colors"
            >
              Reset Filters
            </button>
          </div>
        </div>
      )}

      {/* 5. Interactive Concept Learning Modal with Multi-Format Switcher */}
      {activeModalVideo && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
          <div className="relative w-full max-w-4xl bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
            {/* Modal Header */}
            <div className="p-4 sm:p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/80 dark:bg-slate-850/80 shrink-0">
              <div className="flex items-center gap-3">
                <div
                  className={`p-2 rounded-xl text-white ${
                    activeModalFormat === "reel"
                      ? "bg-gradient-to-tr from-pink-600 to-purple-600"
                      : activeModalFormat === "short"
                      ? "bg-rose-600"
                      : "bg-red-600"
                  }`}
                >
                  {activeModalFormat === "reel" ? (
                    <Instagram className="w-5 h-5" />
                  ) : activeModalFormat === "short" ? (
                    <Flame className="w-5 h-5" />
                  ) : (
                    <Youtube className="w-5 h-5" />
                  )}
                </div>
                <div>
                  <h3 className="font-extrabold text-sm sm:text-base text-slate-900 dark:text-white line-clamp-1">
                    {activeModalVideo.title}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {activeModalVideo.concept} • {activeModalVideo.classGrade} • {activeModalVideo.subject}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() =>
                    handleCopyLink(
                      activeModalFormat === "short"
                        ? getConceptShortsUrl(activeModalVideo)
                        : activeModalFormat === "reel"
                        ? getConceptReelsUrl(activeModalVideo)
                        : getConceptYouTubeUrl(activeModalVideo),
                      activeModalVideo.title
                    )
                  }
                  className="p-2 rounded-xl text-slate-500 hover:text-indigo-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                  title="Copy Link"
                >
                  <Copy className="w-5 h-5" />
                </button>
                <button
                  onClick={() => toggleSave(activeModalVideo.id)}
                  className="p-2 rounded-xl text-slate-500 hover:text-indigo-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                  title="Bookmark"
                >
                  {savedVideoIds.includes(activeModalVideo.id) ? (
                    <BookmarkCheck className="w-5 h-5 text-amber-500 fill-amber-500" />
                  ) : (
                    <Bookmark className="w-5 h-5" />
                  )}
                </button>
                <button
                  onClick={() => setActiveModalVideo(null)}
                  className="p-2 rounded-xl text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Modal Format Switcher: Full Lecture vs YouTube Shorts vs Instagram Reels */}
            <div className="px-4 sm:px-6 py-2.5 bg-slate-100/80 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between gap-2 flex-wrap">
              <span className="text-xs font-bold text-slate-600 dark:text-slate-300 flex items-center gap-1.5">
                <Tv className="w-3.5 h-3.5 text-indigo-500" /> Concept Format:
              </span>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setActiveModalFormat("lecture")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
                    activeModalFormat === "lecture"
                      ? "bg-red-600 text-white shadow-xs"
                      : "bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-200"
                  }`}
                >
                  <Youtube className="w-3.5 h-3.5" />
                  <span>Full Lecture (YouTube)</span>
                </button>

                <button
                  onClick={() => setActiveModalFormat("short")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
                    activeModalFormat === "short"
                      ? "bg-rose-600 text-white shadow-xs"
                      : "bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-200"
                  }`}
                >
                  <Flame className="w-3.5 h-3.5" />
                  <span>Shorts (30–60s)</span>
                </button>

                <button
                  onClick={() => setActiveModalFormat("reel")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
                    activeModalFormat === "reel"
                      ? "bg-gradient-to-r from-pink-600 to-purple-600 text-white shadow-xs"
                      : "bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-200"
                  }`}
                >
                  <Instagram className="w-3.5 h-3.5" />
                  <span>Reels (Instagram)</span>
                </button>
              </div>
            </div>

            {/* Modal Content Scrollable Area */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
              {/* Video Player or Direct Link Preview according to active format */}
              <div className="relative aspect-video w-full rounded-2xl overflow-hidden bg-black shadow-lg">
                {activeModalFormat === "lecture" && activeModalVideo.youtubeId ? (
                  <iframe
                    src={`https://www.youtube-nocookie.com/embed/${activeModalVideo.youtubeId}?autoplay=1&rel=0`}
                    title={activeModalVideo.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                    className="w-full h-full border-0"
                  />
                ) : activeModalFormat === "short" ? (
                  <div className="w-full h-full relative flex flex-col items-center justify-center p-6 text-center bg-gradient-to-br from-rose-950 via-slate-950 to-slate-900 text-white space-y-3">
                    <Flame className="w-12 h-12 text-rose-500 animate-bounce" />
                    <h4 className="text-base sm:text-lg font-bold">YouTube Shorts • 30–60s Concept Booster</h4>
                    <p className="text-xs text-slate-300 max-w-sm">
                      Quick trick and summary for <span className="font-bold text-rose-300">"{activeModalVideo.concept}"</span>. Click below to open official YouTube Shorts.
                    </p>
                    <button
                      onClick={() => handleOpenLink(getConceptShortsUrl(activeModalVideo), "YouTube Shorts")}
                      className="px-5 py-2.5 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-lg transition-transform active:scale-95 flex items-center gap-2"
                    >
                      <Flame className="w-4 h-4" />
                      <span>Open YouTube Shorts ↗</span>
                    </button>
                  </div>
                ) : (
                  <div className="w-full h-full relative flex flex-col items-center justify-center p-6 text-center space-y-3 bg-gradient-to-br from-purple-950 via-pink-950 to-slate-950 text-white">
                    <Instagram className="w-12 h-12 text-pink-500 animate-pulse" />
                    <h4 className="font-bold text-base sm:text-lg">Instagram Educational Reel</h4>
                    <p className="text-xs text-slate-300 max-w-sm">
                      High-yield visual animation and audio reel for <span className="font-bold text-pink-300">"{activeModalVideo.concept}"</span> on Instagram.
                    </p>
                    <button
                      onClick={() => handleOpenLink(getConceptReelsUrl(activeModalVideo), "Instagram Reels")}
                      className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-pink-600 to-purple-600 hover:opacity-90 text-white font-bold text-xs shadow-lg transition-transform active:scale-95 flex items-center gap-2"
                    >
                      <Instagram className="w-4 h-4" />
                      <span>Open Reel on Instagram ↗</span>
                    </button>
                  </div>
                )}
              </div>

              {/* All 3 Format Direct Links Toolbar */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                <div className="space-y-0.5">
                  <p className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                    <span>Watch & Learn Links for "{activeModalVideo.concept}"</span>
                  </p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    Channel: <span className="font-semibold">{activeModalVideo.channel}</span> • {activeModalVideo.views} views
                  </p>
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                  {/* YouTube Lecture */}
                  <button
                    onClick={() => handleOpenLink(getConceptYouTubeUrl(activeModalVideo), "YouTube Lecture")}
                    className="px-3 py-1.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-xs transition-all active:scale-95"
                  >
                    <Youtube className="w-3.5 h-3.5" />
                    <span>Full Lecture ↗</span>
                  </button>

                  {/* YouTube Shorts */}
                  <button
                    onClick={() => handleOpenLink(getConceptShortsUrl(activeModalVideo), "YouTube Shorts")}
                    className="px-3 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-xs transition-all active:scale-95"
                  >
                    <Flame className="w-3.5 h-3.5" />
                    <span>Shorts ⚡</span>
                  </button>

                  {/* Instagram Reels */}
                  <button
                    onClick={() => handleOpenLink(getConceptReelsUrl(activeModalVideo), "Instagram Reels")}
                    className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-pink-600 to-purple-600 text-white text-xs font-bold flex items-center gap-1.5 shadow-xs transition-all active:scale-95"
                  >
                    <Instagram className="w-3.5 h-3.5" />
                    <span>Reel 📸</span>
                  </button>
                </div>
              </div>

              {/* Learning Flow Step 1: Quick Concept Explanation */}
              <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-indigo-600 dark:text-indigo-400">
                  <Lightbulb className="w-4 h-4" />
                  <span>Step 1: Quick Concept Explanation</span>
                </div>
                <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                  {activeModalVideo.quickExplanation}
                </p>
              </div>

              {/* Learning Flow Step 2: Key Points & High-Yield Takeaways */}
              <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3">
                <div className="flex items-center gap-2 text-xs font-bold text-emerald-600 dark:text-emerald-400">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Step 2: Key High-Yield Exam Points</span>
                </div>
                <ul className="space-y-2 text-xs text-slate-700 dark:text-slate-300">
                  {activeModalVideo.keyPoints.map((point, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Learning Flow Step 3: Core Formula / Definition */}
              <div className="p-4 sm:p-5 rounded-2xl bg-amber-50/60 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50 space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-amber-800 dark:text-amber-300">
                  <Sparkles className="w-4 h-4" />
                  <span>Step 3: Core Formula or Standard Definition</span>
                </div>
                <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-amber-200/80 dark:border-amber-900/80 font-mono text-xs sm:text-sm text-amber-950 dark:text-amber-200 font-bold overflow-x-auto">
                  {activeModalVideo.formulaOrDefinition}
                </div>
              </div>

              {/* Learning Flow Step 4: Interactive Practice Question (Mini-Quiz) */}
              <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs font-bold text-indigo-600 dark:text-indigo-400">
                    <HelpCircle className="w-4 h-4" />
                    <span>Step 4: Check Your Understanding (Instant Practice Question)</span>
                  </div>
                  <span className="text-[11px] font-semibold text-slate-500">1 MCQ</span>
                </div>

                <p className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-white">
                  {activeModalVideo.practiceQuestion.question}
                </p>

                <div className="space-y-2 pt-1">
                  {activeModalVideo.practiceQuestion.options.map((option, idx) => {
                    const isSelected = selectedQuizOption === idx;
                    const isCorrect = activeModalVideo.practiceQuestion.correctIndex === idx;

                    let btnClass = "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 hover:border-indigo-400";
                    if (isQuizSubmitted) {
                      if (isCorrect) {
                        btnClass = "bg-emerald-50 dark:bg-emerald-950/60 border-emerald-500 text-emerald-900 dark:text-emerald-200 font-bold";
                      } else if (isSelected) {
                        btnClass = "bg-rose-50 dark:bg-rose-950/60 border-rose-500 text-rose-900 dark:text-rose-200";
                      }
                    } else if (isSelected) {
                      btnClass = "bg-indigo-50 dark:bg-indigo-950/60 border-indigo-500 text-indigo-900 dark:text-indigo-200 ring-2 ring-indigo-500/20";
                    }

                    return (
                      <button
                        key={idx}
                        disabled={isQuizSubmitted}
                        onClick={() => setSelectedQuizOption(idx)}
                        className={`w-full p-3 rounded-xl border text-left text-xs sm:text-sm transition-all flex items-center justify-between gap-3 ${btnClass}`}
                      >
                        <div className="flex items-center gap-2.5">
                          <span className="w-5 h-5 rounded-full bg-slate-100 dark:bg-slate-800 text-[11px] font-bold flex items-center justify-center shrink-0">
                            {String.fromCharCode(65 + idx)}
                          </span>
                          <span>{option}</span>
                        </div>
                        {isQuizSubmitted && isCorrect && (
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Submit / Reset Answer Button */}
                <div className="pt-2 flex items-center justify-between">
                  {!isQuizSubmitted ? (
                    <button
                      disabled={selectedQuizOption === null}
                      onClick={() => setIsQuizSubmitted(true)}
                      className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-bold text-xs shadow-sm transition-all"
                    >
                      Check Answer
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        setSelectedQuizOption(null);
                        setIsQuizSubmitted(false);
                      }}
                      className="px-3 py-1.5 rounded-xl bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 font-semibold text-xs flex items-center gap-1.5 transition-colors"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Try Again</span>
                    </button>
                  )}
                </div>

                {/* Explanation Reveal */}
                {isQuizSubmitted && (
                  <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900 text-xs text-emerald-900 dark:text-emerald-200 space-y-1 animate-in fade-in">
                    <p className="font-bold flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                      Explanation:
                    </p>
                    <p className="leading-relaxed">{activeModalVideo.practiceQuestion.explanation}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-900 flex items-center justify-between gap-3 shrink-0">
              <div className="flex items-center gap-3">
                <button
                  onClick={() =>
                    handleCopyLink(
                      activeModalFormat === "short"
                        ? getConceptShortsUrl(activeModalVideo)
                        : activeModalFormat === "reel"
                        ? getConceptReelsUrl(activeModalVideo)
                        : getConceptYouTubeUrl(activeModalVideo),
                      activeModalVideo.title
                    )
                  }
                  className="text-xs font-bold text-slate-600 dark:text-slate-300 hover:text-indigo-600 flex items-center gap-1"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy Link</span>
                </button>
              </div>

              <button
                onClick={() => setActiveModalVideo(null)}
                className="px-5 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs transition-colors"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
