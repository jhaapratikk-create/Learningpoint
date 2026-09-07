import React, { useState, useMemo } from "react";
import {
  Youtube,
  Search,
  ExternalLink,
  Play,
  Sparkles,
  Clock,
  Eye,
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
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useStudy } from "../../context/StudyContext";
import { ConceptVideoLecture } from "../../types";
import { INITIAL_CONCEPT_VIDEOS, getYouTubeSearchUrl } from "../../data/videoLecturesData";

export const ConceptVideosView: React.FC = () => {
  const { user } = useAuth();
  const { addToast, setCurrentView } = useStudy();

  const [videos, setVideos] = useState<ConceptVideoLecture[]>(INITIAL_CONCEPT_VIDEOS);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSubject, setSelectedSubject] = useState<string>("All");
  const [selectedGrade, setSelectedGrade] = useState<string>("All");
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>("All");
  const [activeVideoModal, setActiveVideoModal] = useState<ConceptVideoLecture | null>(null);
  const [bookmarkedIds, setBookmarkedIds] = useState<string[]>([]);
  const [customConceptInput, setCustomConceptInput] = useState("");

  const subjectsList = ["All", "Physics", "Chemistry", "Mathematics", "Biology", "Computer Science", "Commerce & Economics"];
  const gradesList = ["All", "Class 12 / JEE", "Class 11 / JEE / NEET", "Class 12 / NEET UG", "Class 10", "Foundation"];

  // Toggle bookmark
  const toggleBookmark = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setBookmarkedIds((prev) => {
      const isBookmarked = prev.includes(id);
      const next = isBookmarked ? prev.filter((item) => item !== id) : [...prev, id];
      addToast(
        isBookmarked ? "Removed lecture from bookmarks" : "Saved lecture to your Concept Library!",
        "info"
      );
      return next;
    });
  };

  // Direct YouTube opener helper
  const handleOpenDirectYouTube = (video: ConceptVideoLecture, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    window.open(video.youtubeUrl, "_blank", "noopener,noreferrer");
    addToast(`Opening "${video.concept}" directly on YouTube...`, "success");
  };

  // Direct Search YouTube for any custom concept
  const handleDirectConceptSearch = (conceptText: string) => {
    if (!conceptText.trim()) return;
    const url = getYouTubeSearchUrl(conceptText, user?.grade || "");
    window.open(url, "_blank", "noopener,noreferrer");
    addToast(`Opening YouTube lectures for "${conceptText}"...`, "success");
  };

  // Filtered videos list
  const filteredVideos = useMemo(() => {
    return videos.filter((vid) => {
      const matchesSearch =
        vid.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        vid.concept.toLowerCase().includes(searchQuery.toLowerCase()) ||
        vid.channel.toLowerCase().includes(searchQuery.toLowerCase()) ||
        vid.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesSubject = selectedSubject === "All" || vid.subject.toLowerCase().includes(selectedSubject.toLowerCase());
      const matchesGrade = selectedGrade === "All" || vid.grade.includes(selectedGrade);
      const matchesDiff = selectedDifficulty === "All" || vid.difficulty === selectedDifficulty;

      return matchesSearch && matchesSubject && matchesGrade && matchesDiff;
    });
  }, [videos, searchQuery, selectedSubject, selectedGrade, selectedDifficulty]);

  // Weak concepts from user profile to recommend
  const weakTopics = user?.weakTopics || ["Rotational Dynamics", "Electrochemistry Nernst Equation", "Integration by Parts"];

  return (
    <div className="space-y-6 pb-16">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-red-600 via-rose-600 to-pink-600 p-6 sm:p-8 text-white shadow-xl shadow-rose-900/10">
        <div className="relative z-10 space-y-4 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-white text-xs font-bold border border-white/20">
            <Youtube className="w-4 h-4 text-white" />
            <span>High-Yield Concept Video Lectures</span>
          </div>

          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Master Any Concept on YouTube
            </h1>
            <p className="text-xs sm:text-sm text-rose-100 mt-1 leading-relaxed">
              Every topic is paired with curated, expert lectures. Click any lecture link to open directly in YouTube, or explore step-by-step topic breakdowns.
            </p>
          </div>

          {/* Quick Concept Search Bar */}
          <div className="flex flex-col sm:flex-row items-stretch gap-2 pt-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-rose-300" />
              <input
                type="text"
                value={customConceptInput}
                onChange={(e) => setCustomConceptInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleDirectConceptSearch(customConceptInput);
                }}
                placeholder="Type ANY concept (e.g. Rotational Torque, SN1 Mechanism, Integration)..."
                className="w-full pl-10 pr-4 py-3 text-xs sm:text-sm rounded-2xl bg-white/15 hover:bg-white/20 focus:bg-white text-white placeholder:text-rose-200 focus:text-slate-900 focus:placeholder:text-slate-400 border border-white/25 focus:outline-none focus:ring-2 focus:ring-white transition-all backdrop-blur-md"
              />
            </div>
            <button
              onClick={() => handleDirectConceptSearch(customConceptInput)}
              className="px-5 py-3 rounded-2xl bg-white hover:bg-rose-50 text-rose-700 font-bold text-xs sm:text-sm shadow-md transition-all active:scale-95 flex items-center justify-center gap-2 whitespace-nowrap"
            >
              <Youtube className="w-4 h-4 text-red-600" />
              <span>Direct YouTube Search</span>
              <ExternalLink className="w-3.5 h-3.5 text-rose-500" />
            </button>
          </div>
        </div>

        {/* Decorative Background Elements */}
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-radial from-white/15 to-transparent pointer-events-none" />
        <Youtube className="absolute -right-8 -bottom-8 w-56 h-56 text-white/10 rotate-12 pointer-events-none" />
      </div>

      {/* Weak Concept Quick Action Bar (Personalized for the user) */}
      <div className="p-4 sm:p-5 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/50 space-y-3">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2 text-amber-900 dark:text-amber-200 text-xs sm:text-sm font-bold">
            <Flame className="w-4 h-4 text-amber-600 dark:text-amber-400 animate-pulse" />
            <span>Targeted Weak Concepts for {user?.name || "Student"}</span>
          </div>
          <span className="text-[11px] font-semibold text-amber-700 dark:text-amber-300">
            Click to open specific concept lecture directly in YouTube
          </span>
        </div>

        <div className="flex flex-wrap gap-2">
          {weakTopics.map((topic, i) => (
            <button
              key={i}
              onClick={() => handleDirectConceptSearch(topic)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-amber-200 dark:border-amber-800/80 hover:border-red-400 dark:hover:border-red-500 text-slate-800 dark:text-slate-200 text-xs font-semibold shadow-xs hover:text-red-600 dark:hover:text-red-400 transition-all group"
            >
              <Youtube className="w-3.5 h-3.5 text-red-600 group-hover:scale-110 transition-transform" />
              <span>{topic}</span>
              <ExternalLink className="w-3 h-3 text-slate-400 group-hover:text-red-500" />
            </button>
          ))}
          <button
            onClick={() => handleDirectConceptSearch(`${user?.aim || "Exam"} High Yield Problems`)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold shadow-xs transition-all"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>{user?.aim?.split("(")[0] || "Exam"} High Yield Lectures</span>
            <ExternalLink className="w-3 h-3 text-red-200" />
          </button>
        </div>
      </div>

      {/* Filter and In-Page Search */}
      <div className="space-y-3">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          {/* Subject Pills */}
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

          {/* In-Page Video Filter */}
          <div className="relative min-w-[240px]">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Filter listed lectures..."
              className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-red-500"
            />
          </div>
        </div>
      </div>

      {/* Video Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredVideos.map((video) => {
          const isSaved = bookmarkedIds.includes(video.id);

          return (
            <div
              key={video.id}
              className="group flex flex-col justify-between rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800/90 hover:border-red-300 dark:hover:border-red-900/60 shadow-xs hover:shadow-md transition-all overflow-hidden"
            >
              {/* Thumbnail Container */}
              <div className="relative aspect-video w-full bg-slate-900 overflow-hidden cursor-pointer" onClick={() => handleOpenDirectYouTube(video)}>
                <img
                  src={video.thumbnailUrl}
                  alt={video.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                {/* Duration Badge */}
                <div className="absolute bottom-2.5 right-2.5 px-2 py-0.5 rounded-md bg-black/80 text-white text-[11px] font-mono font-bold flex items-center gap-1 backdrop-blur-xs">
                  <Clock className="w-3 h-3 text-red-400" />
                  <span>{video.duration}</span>
                </div>

                {/* Big Center Play Icon with YouTube Glow */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-12 h-12 rounded-full bg-red-600 text-white flex items-center justify-center shadow-lg shadow-red-600/50 group-hover:scale-110 transition-transform">
                    <Play className="w-5 h-5 fill-white translate-x-0.5" />
                  </div>
                </div>

                {/* Subject & Difficulty Pills */}
                <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5 flex-wrap">
                  <span className="px-2 py-0.5 rounded-md bg-slate-900/90 text-white text-[10px] font-bold backdrop-blur-xs">
                    {video.subject}
                  </span>
                  <span className="px-2 py-0.5 rounded-md bg-rose-500/90 text-white text-[10px] font-bold backdrop-blur-xs">
                    {video.difficulty}
                  </span>
                </div>

                {/* Bookmark Button */}
                <button
                  onClick={(e) => toggleBookmark(video.id, e)}
                  className="absolute top-2.5 right-2.5 p-1.5 rounded-full bg-black/60 hover:bg-black/80 text-white backdrop-blur-xs transition-colors"
                  title="Bookmark Lecture"
                >
                  {isSaved ? (
                    <BookmarkCheck className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                  ) : (
                    <Bookmark className="w-4 h-4 text-white" />
                  )}
                </button>
              </div>

              {/* Card Body */}
              <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
                    <span className="font-semibold text-red-600 dark:text-red-400">{video.channel}</span>
                    <div className="flex items-center gap-1">
                      <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                      <span>{video.rating}</span>
                      <span>•</span>
                      <span>{video.views} views</span>
                    </div>
                  </div>

                  <h3
                    onClick={() => handleOpenDirectYouTube(video)}
                    className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors line-clamp-2 cursor-pointer"
                  >
                    {video.title}
                  </h3>

                  <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                    {video.description}
                  </p>

                  {/* Concept Tag */}
                  <div className="pt-1 flex items-center gap-1.5 flex-wrap">
                    <span className="text-[11px] font-bold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md">
                      📌 {video.concept}
                    </span>
                    <span className="text-[10px] text-slate-400 font-medium">{video.chapter}</span>
                  </div>
                </div>

                {/* Action Buttons: Direct YouTube Link + In-App Watch */}
                <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center gap-2">
                  {/* DIRECT YOUTUBE LINK BUTTON */}
                  <a
                    href={video.youtubeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="flex-1 inline-flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold shadow-xs transition-all active:scale-95"
                  >
                    <Youtube className="w-4 h-4 text-white" />
                    <span>Open in YouTube</span>
                    <ExternalLink className="w-3 h-3 text-red-200" />
                  </a>

                  {/* Inline Preview Modal Button */}
                  <button
                    onClick={() => setActiveVideoModal(video)}
                    className="px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold transition-all"
                    title="Watch In-App"
                  >
                    <Play className="w-3.5 h-3.5 text-slate-500" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* If No search results, provide instant search on YouTube */}
      {filteredVideos.length === 0 && (
        <div className="p-10 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center space-y-3">
          <Youtube className="w-12 h-12 text-red-500 mx-auto" />
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            No local catalog match for "{searchQuery}"
          </h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            You can search YouTube directly for this concept with one click to find top rated full lectures:
          </p>
          <button
            onClick={() => handleDirectConceptSearch(searchQuery)}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold shadow-md transition-all active:scale-95"
          >
            <Youtube className="w-4 h-4" />
            <span>Search "{searchQuery}" on YouTube</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* In-App Video Modal */}
      {activeVideoModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="relative w-full max-w-4xl bg-slate-900 rounded-2xl border border-slate-800 shadow-2xl overflow-hidden flex flex-col">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-4 border-b border-slate-800 text-white">
              <div className="flex items-center gap-2">
                <Youtube className="w-5 h-5 text-red-500" />
                <span className="font-bold text-sm truncate max-w-md sm:max-w-xl">
                  {activeVideoModal.title}
                </span>
              </div>
              <button
                onClick={() => setActiveVideoModal(null)}
                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Embedded iFrame */}
            <div className="relative aspect-video w-full bg-black">
              <iframe
                src={`https://www.youtube-nocookie.com/embed/${activeVideoModal.youtubeId}?autoplay=1&rel=0`}
                title={activeVideoModal.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                className="w-full h-full border-0"
              />
            </div>

            {/* Modal Footer with Direct YouTube button */}
            <div className="p-4 bg-slate-950 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-slate-400">
              <div>
                <p className="font-bold text-white text-sm">{activeVideoModal.concept}</p>
                <p className="text-slate-400 text-xs">Instructor / Channel: {activeVideoModal.channel}</p>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <a
                  href={activeVideoModal.youtubeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold transition-all"
                >
                  <Youtube className="w-4 h-4" />
                  <span>Open Full Video on YouTube</span>
                  <ExternalLink className="w-3.5 h-3.5 text-red-200" />
                </a>
                <button
                  onClick={() => setActiveVideoModal(null)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
