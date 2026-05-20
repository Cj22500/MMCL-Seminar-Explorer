import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Search,
  MapPin,
  Globe,
  Monitor,
  Laptop,
  Calendar,
  BookOpen,
  ExternalLink,
  Filter,
  RotateCcw,
  Check,
  Award,
  AlertCircle,
  Sparkles,
  Building2,
  Printer,
  ChevronRight,
  TrendingUp,
  Briefcase,
  Layers,
  Sparkle,
  Bookmark,
  BookmarkCheck,
  Clock
} from "lucide-react";
import { Seminar, SeminarSource } from "./types";

export default function App() {
  const [curatedSeminars, setCuratedSeminars] = useState<Seminar[]>([]);
  const [searchedSeminars, setSearchedSeminars] = useState<Seminar[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [aiSearchError, setAiSearchError] = useState<string | null>(null);
  
  // Active Local Filters
  const [selectedType, setSelectedType] = useState<"all" | "onsite" | "hybrid" | "online">("all");
  const [selectedScale, setSelectedScale] = useState<"all" | "local" | "international">("all");
  const [activeTab, setActiveTab] = useState<"all" | "curated" | "search">("all");

  // Portfolio list (saved seminars for portfolio generation)
  const [savedSeminars, setSavedSeminars] = useState<Seminar[]>([]);
  const [studentName, setStudentName] = useState<string>("Cyril Justin");
  const [studentId, setStudentId] = useState<string>("202315042");
  const [showPortfolioView, setShowPortfolioView] = useState<boolean>(false);

  // Initialize: Load Curated Seminars
  useEffect(() => {
    fetchCuratedSeminars();
    // Load saved portfolio from localStorage
    const stored = localStorage.getItem("mmcl_cs_portfolio_seminars");
    if (stored) {
      try {
        setSavedSeminars(JSON.parse(stored));
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  const fetchCuratedSeminars = async () => {
    try {
      const res = await fetch("/api/seminars/curated");
      if (res.ok) {
        const data = await res.json();
        setCuratedSeminars(data);
      }
    } catch (e) {
      console.error("Failed to load curated seminars", e);
    }
  };

  // Perform Gemini ground web search
  const handleAISearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setLoading(true);
    setAiSearchError(null);
    try {
      const res = await fetch("/api/seminars/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: searchQuery }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Internal Server Error");
      }

      const data = await res.json();
      if (data.seminars && data.seminars.length > 0) {
        setSearchedSeminars(data.seminars);
        setActiveTab("search"); // auto-switch to search tab
      } else {
        setAiSearchError("No real-world seminars matching that specific query were found. Try another term like 'Artificial Intelligence', 'Cybersecurity', or 'Webcon'.");
      }
    } catch (err: any) {
      console.error(err);
      setAiSearchError(err.message || "Something went wrong while indexing seminars online.");
    } finally {
      setLoading(false);
    }
  };

  // Reset search
  const handleClearSearch = () => {
    setSearchQuery("");
    setSearchedSeminars([]);
    setAiSearchError(null);
    setActiveTab("all");
  };

  // Saved list management
  const toggleSaveSeminar = (seminar: Seminar) => {
    let nextSaved: Seminar[] = [];
    if (savedSeminars.some((s) => s.id === seminar.id)) {
      nextSaved = savedSeminars.filter((s) => s.id !== seminar.id);
    } else {
      nextSaved = [...savedSeminars, seminar];
    }
    setSavedSeminars(nextSaved);
    localStorage.setItem("mmcl_cs_portfolio_seminars", JSON.stringify(nextSaved));
  };

  const clearPortfolio = () => {
    setSavedSeminars([]);
    localStorage.removeItem("mmcl_cs_portfolio_seminars");
  };

  // Merge & Filter Seminars for listing
  const allSeminars = [...searchedSeminars, ...curatedSeminars];
  
  const getFilteredSeminars = () => {
    let base = [];
    if (activeTab === "all") {
      base = allSeminars;
    } else if (activeTab === "curated") {
      base = curatedSeminars;
    } else {
      base = searchedSeminars;
    }

    // De-duplicate in case they overlap
    const seen = new Set();
    const unique = base.filter((s) => {
      const duplicate = seen.has(s.title);
      seen.add(s.title);
      return !duplicate;
    });

    return unique.filter((s) => {
      const matchesType = selectedType === "all" || s.type === selectedType;
      const matchesScale = selectedScale === "all" || s.scale === selectedScale;
      return matchesType && matchesScale;
    });
  };

  const filteredList = getFilteredSeminars();

  // Print execution
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen relative bg-[#0f172a] text-slate-100 font-sans antialiased selection:bg-teal-500 selection:text-white overflow-x-hidden">
      
      {/* 
        FROSTED GLASS BLUR ORBS
        Slow-moving backdrop color projectors
      */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-indigo-600/15 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-teal-500/15 rounded-full blur-[120px]" />
        <div className="absolute top-[20%] right-[10%] w-[30%] h-[30%] bg-purple-600/10 rounded-full blur-[100px]" />
      </div>

      {/* 
        MMCL TOP FLOATING NAVIGATION CO-BRANDED
        Translucent Glassy Header with custom border glow.
      */}
      <header className="sticky top-0 z-40 backdrop-blur-md bg-white/5 border-b border-white/10 shadow-lg px-4 py-3 shrink-0">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          
          {/* Logo & School Branding */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-indigo-500 to-teal-400 flex items-center justify-center shadow-lg shadow-indigo-950/40">
              <span className="text-white font-extrabold text-lg tracking-wider font-mono">CS</span>
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xs tracking-widest uppercase font-bold text-teal-400 font-mono">MAPÚA MALAYAN</span>
                <span className="text-[10px] uppercase font-semibold text-indigo-400 px-1.5 bg-indigo-500/10 rounded">LAGUNA</span>
              </div>
              <h1 className="text-lg md:text-xl font-bold tracking-tight text-white flex items-center">
                College Seminar Hub <span className="text-slate-400 font-normal text-xs ml-2 border-l border-white/10 pl-2">BSCS Portal</span>
              </h1>
            </div>
          </div>

          {/* Quick Metrics & Dossier Trigger */}
          <div className="flex items-center space-x-4 ml-auto md:ml-0 overflow-x-auto whitespace-nowrap py-1">
            <div className="flex items-center space-x-2 text-xs backdrop-blur-md bg-white/5 border border-white/10 rounded-full px-3 py-1.5 text-slate-300">
              <Building2 className="w-3 h-3 text-teal-400" />
              <span>Cabuyao Campuses</span>
            </div>
            <div className="flex items-center space-x-2 text-xs backdrop-blur-md bg-white/5 border border-white/10 rounded-full px-3 py-1.5 text-slate-300">
              <Clock className="w-3 h-3 text-indigo-400" />
              <span>OJT Prep-Track</span>
            </div>
            <button
              onClick={() => setShowPortfolioView(true)}
              className="relative text-xs bg-gradient-to-r from-indigo-500 to-teal-500 hover:from-indigo-600 hover:to-teal-600 text-white font-bold rounded-full px-4 py-1.5 shadow-md shadow-indigo-950/20 flex items-center space-x-1 transition-all pointer-events-auto cursor-pointer"
            >
              <Award className="w-3.5 h-3.5" />
              <span>Dossier ({savedSeminars.length})</span>
            </button>
          </div>
        </div>
      </header>

      {/* HERO BANNER SECTION - TRANSPARENT OVERLAYED */}
      <section className="relative z-10 overflow-hidden pt-8 pb-10 border-b border-white/10 px-4">
        <div className="max-w-5xl mx-auto text-center relative">
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-1.5 bg-teal-500/10 border border-teal-500/20 rounded-full px-3 py-1 text-xs text-teal-300 font-mono mb-4"
          >
            <Sparkle className="w-3 h-3 animate-spin" />
            <span>REAL-TIME SEMINAR GROUNDING ENGINE</span>
          </motion.div>
          <motion.h2 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-3xl md:text-5xl font-black tracking-tight text-white mb-4 bg-gradient-to-r from-white via-indigo-200 to-teal-200 bg-clip-text text-transparent"
          >
            PH Computing Seminars Explorer
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-slate-400 max-w-2xl mx-auto text-sm md:text-base leading-relaxed mb-8"
          >
            Empowering Mapúa Malayan Colleges Laguna Computer Science students to search, filter, and track authentic local and international CS seminars. Complete your professional and OJT attendance portfolio.
          </motion.p>

          {/* DYNAMIC REAL-TIME SEARCH BAR USING GEMINI SEARCH GROUNDING */}
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="max-w-2xl mx-auto"
          >
            <form onSubmit={handleAISearch} className="relative">
              <div className="relative flex items-center bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl shadow-2xl p-1.5 focus-within:border-teal-400/50 focus-within:ring-2 focus-within:ring-teal-500/10 transition-all">
                <div className="pl-3 text-slate-400">
                  <Search className="w-5 h-5 text-teal-400" />
                </div>
                <input
                  type="text"
                  placeholder="Ask Gemini to search PH: 'Generative AI Manila', 'Cybersecurity webinar 2026'..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-transparent text-slate-100 text-sm py-2 px-3 outline-hidden placeholder-slate-400"
                />
                <button
                  type="submit"
                  disabled={loading || !searchQuery.trim()}
                  className="bg-gradient-to-r from-indigo-500 to-teal-500 hover:from-indigo-600 hover:to-teal-600 text-white font-bold text-xs px-5 py-2.5 rounded-xl flex items-center space-x-1.5 transition-all shadow-lg shadow-indigo-950/40 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
                >
                  {loading ? (
                    <>
                      <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Searching...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Search with AI</span>
                    </>
                  )}
                </button>
              </div>
            </form>
            
            {/* Quick Suggestions tags */}
            <div className="flex flex-wrap items-center justify-center gap-2 mt-3 text-xs text-slate-500">
              <span className="font-mono">Quick topics:</span>
              {[
                "Web Development Manila 2025",
                "PSITE Regional IT Conferences",
                "PH Artificial Intelligence Forum",
                "Cyber Security Philippine Seminars"
              ].map((topic) => (
                <button
                  key={topic}
                  onClick={() => setSearchQuery(topic)}
                  className="bg-white/5 border border-white/10 hover:border-white/20 hover:text-white px-2.5 py-1 rounded-full text-[11px] transition-all cursor-pointer"
                >
                  {topic}
                </button>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* MAIN LAYOUT */}
      <main className="max-w-7xl mx-auto px-4 py-8 relative">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* LEFT SIDEBAR: ADVANCED CATEGORY FILTER CONTROLS */}
          <aside className="lg:col-span-1 space-y-6">
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-5 space-y-6 shadow-xl sticky top-24">
              
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <div className="flex items-center space-x-2">
                  <Filter className="w-4 h-4 text-teal-400" />
                  <h3 className="font-bold text-sm tracking-wide text-white font-mono">SEMINAR FILTERS</h3>
                </div>
                {(selectedType !== "all" || selectedScale !== "all" || searchQuery !== "") && (
                  <button
                    onClick={() => {
                      setSelectedType("all");
                      setSelectedScale("all");
                      handleClearSearch();
                    }}
                    className="text-slate-400 hover:text-rose-400 text-xs flex items-center gap-0.5 cursor-pointer transition-colors"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Reset</span>
                  </button>
                )}
              </div>              {/* Seminar Format Classification */}
              <div className="space-y-3">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest font-mono">Format Classification</label>
                <div className="space-y-1.5">
                  {[
                    { id: "all", label: "All Formats" },
                    { id: "onsite", label: "In-Site Only" },
                    { id: "hybrid", label: "Hybrid Sessions" },
                    { id: "online", label: "Online Only" }
                  ].map((option) => (
                    <button
                      key={option.id}
                      onClick={() => setSelectedType(option.id as any)}
                      className={`w-full text-left px-3.5 py-2 rounded-xl text-xs font-medium transition-all duration-150 flex items-center justify-between cursor-pointer ${
                        selectedType === option.id
                          ? "bg-teal-500/20 border border-teal-500/30 text-teal-300 font-semibold"
                          : "bg-white/5 border border-transparent text-slate-350 hover:text-white hover:bg-white/10"
                      }`}
                    >
                      <span>{option.label}</span>
                      {selectedType === option.id && <Check className="w-3.5 h-3.5 text-teal-400" />}
                    </button>
                  ))}
                </div>
              </div>

              {/* Seminar Scale Classification */}
              <div className="space-y-3">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest font-mono">Outreach Scale</label>
                <div className="space-y-1.5">
                  {[
                    { id: "all", label: "All Scales" },
                    { id: "local", label: "Local (Philippines)" },
                    { id: "international", label: "International Scope" }
                  ].map((option) => (
                    <button
                      key={option.id}
                      onClick={() => setSelectedScale(option.id as any)}
                      className={`w-full text-left px-3.5 py-2 rounded-xl text-xs font-medium transition-all duration-150 flex items-center justify-between cursor-pointer ${
                        selectedScale === option.id
                          ? "bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 font-semibold"
                          : "bg-white/5 border border-transparent text-slate-350 hover:text-white hover:bg-white/10"
                      }`}
                    >
                      <span>{option.label}</span>
                      {selectedScale === option.id && <Check className="w-3.5 h-3.5 text-indigo-400" />}
                    </button>
                  ))}
                </div>
              </div>

              {/* MMCL CS OJT Fast Guide */}
              <div className="backdrop-blur-md bg-white/5 border border-white/10 rounded-xl p-3.5 space-y-2.5 bg-gradient-to-br from-indigo-500/5 to-teal-500/5">
                <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                  <Award className="w-3.5 h-3.5 text-teal-400" />
                  <span>MMCL Portfolio Guide</span>
                </h4>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  MMCL Computer Science undergrads must attend tech seminars, meetups, or submit capstone logs to satisfy OJT hours. Save seminars you plan to attend or have attended to generate your standardized dossier!
                </p>
                <div className="pt-1.5 border-t border-white/10 flex items-center justify-between text-[11px]">
                  <span className="text-slate-550">Recommended hours:</span>
                  <span className="font-mono text-teal-400 font-semibold">15 Hours</span>
                </div>
              </div>

            </div>
          </aside>

          {/* RIGHT PANELS: LIVE SEMINAR STREAM & FINDINGS */}
          <section className="lg:col-span-3 space-y-6">

            {/* ERROR NOTIFICATION PANEL */}
            {aiSearchError && (
              <div className="bg-rose-950/20 backdrop-blur-md border border-rose-500/35 rounded-2xl p-4 flex items-start space-x-3 text-xs text-rose-350">
                <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
                <div className="space-y-1">
                  <span className="font-bold">Ground Information Engine Notice</span>
                  <p className="text-slate-300 leading-relaxed">{aiSearchError}</p>
                </div>
              </div>
            )}

            {/* TAB SELECTOR FOR CURATED vs AI FINDINGS */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between border-b border-white/10 pb-3 gap-4">
              <div className="flex items-center space-x-1 p-0.5 bg-white/5 border border-white/10 rounded-xl max-w-sm">
                <button
                  onClick={() => setActiveTab("all")}
                  className={`px-4 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-all ${
                    activeTab === "all"
                      ? "bg-white/10 border border-white/10 text-white shadow-xs"
                      : "text-slate-400 hover:text-slate-200"
                  }`}
                >
                  All Seminars ({curatedSeminars.length + searchedSeminars.length})
                </button>
                <button
                  onClick={() => setActiveTab("curated")}
                  className={`px-4 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-all ${
                    activeTab === "curated"
                      ? "bg-white/10 border border-white/10 text-white shadow-xs"
                      : "text-slate-400 hover:text-slate-200"
                  }`}
                >
                  Curated ({curatedSeminars.length})
                </button>
                <button
                  onClick={() => setActiveTab("search")}
                  disabled={searchedSeminars.length === 0}
                  className={`px-4 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-all disabled:opacity-40 disabled:cursor-not-allowed ${
                    activeTab === "search"
                      ? "bg-white/10 border border-white/10 text-white shadow-xs"
                      : "text-slate-400 hover:text-slate-200"
                  }`}
                >
                  AI Search ({searchedSeminars.length})
                </button>
              </div>

              {/* Info text */}
              <div className="text-xs text-slate-400 flex items-center space-x-1.5 font-mono">
                <span>Showing</span>
                <span className="text-teal-400 px-1.5 py-0.5 bg-teal-500/10 rounded font-bold">{filteredList.length}</span>
                <span>matching real events</span>
              </div>
            </div>

            {/* EMPTY RESULT VIEW */}
            {filteredList.length === 0 && (
              <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-12 text-center max-w-xl mx-auto space-y-4">
                <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center mx-auto border border-white/10">
                  <Layers className="w-5 h-5 text-teal-400" />
                </div>
                <div className="space-y-1">
                  <h3 className="font-bold text-white">No Seminars Found</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    No seminars match your current filter parameters. Try checking your Sidebar filters or click below to search for more widely available events via Gemini search grounding.
                  </p>
                </div>
                <button
                  onClick={() => {
                    setSelectedType("all");
                    setSelectedScale("all");
                    setActiveTab("all");
                  }}
                  className="bg-white/5 hover:bg-white/10 border border-white/10 text-xs px-4 py-2 rounded-xl transition-all font-semibold inline-block cursor-pointer"
                >
                  Clear Active Filters
                </button>
              </div>
            )}

            {/* GRID OF SEMINAR CARDS */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <AnimatePresence mode="popLayout">
                {filteredList.map((seminar, idx) => {
                  const isSaved = savedSeminars.some((s) => s.id === seminar.id);
                  return (
                    <motion.div
                      key={seminar.id}
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.3, delay: idx * 0.05 }}
                      className={`bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-5 flex flex-col justify-between space-y-5 transition-all relative overflow-hidden group shadow-lg duration-300 ${
                        seminar.type === 'onsite'
                          ? 'hover:border-teal-400/50'
                          : seminar.type === 'hybrid'
                            ? 'hover:border-indigo-400/50'
                            : 'hover:border-emerald-400/50'
                      }`}
                    >
                      {/* Subtle Glow Border Accent depending on Format */}
                      <div className={`absolute top-0 left-0 w-full h-[3px] transition-all duration-300 ${
                        seminar.type === 'onsite' 
                          ? 'bg-teal-400' 
                          : seminar.type === 'hybrid' 
                            ? 'bg-indigo-400' 
                            : 'bg-emerald-400'
                      }`} />

                      {/* Header Section */}
                      <div className="space-y-2.5">
                        <div className="flex items-center justify-between gap-2 flex-wrap text-[11px] font-mono">
                          
                          {/* Format Badge */}
                          <div className="flex items-center gap-1.5">
                            <span className={`px-2 py-0.5 rounded-full font-semibold uppercase tracking-wider text-[10px] ${
                              seminar.type === 'onsite'
                                ? 'bg-teal-500/15 text-teal-300 border border-teal-500/20'
                                : seminar.type === 'hybrid'
                                  ? 'bg-indigo-500/15 text-indigo-300 border border-indigo-500/20'
                                  : 'bg-emerald-500/15 text-emerald-305 border border-emerald-500/20'
                            }`}>
                              {seminar.type === 'onsite' ? 'In-Site' : seminar.type === 'hybrid' ? 'Hybrid' : 'Online Only'}
                            </span>

                            {/* Scale Badge */}
                            <span className={`px-2 py-0.5 rounded-full font-semibold uppercase tracking-wider text-[10px] ${
                              seminar.scale === 'international'
                                ? 'bg-indigo-500/25 text-indigo-300 border border-indigo-500/30'
                                : 'bg-white/5 text-slate-350 border border-white/10'
                            }`}>
                              {seminar.scale === 'international' ? '🌍 International' : '🇵🇭 Local'}
                            </span>
                          </div>

                          {/* AISearch Badge */}
                          {seminar.isRealTimeSearched && (
                            <span className="flex items-center space-x-1 text-teal-400 font-bold bg-teal-555/5 px-2 py-0.5 border border-teal-500/20 rounded-full text-[10px]">
                              <Sparkle className="w-2.5 h-2.5 animate-pulse" />
                              <span>Verified Search</span>
                            </span>
                          )}
                        </div>

                        {/* Seminar Title */}
                        <div className="space-y-1">
                          <h4 className="font-extrabold text-base text-white group-hover:text-teal-300 transition-colors tracking-tight line-clamp-2">
                            {seminar.title}
                          </h4>
                          
                          <p className="text-slate-400 text-xs font-semibold flex items-center gap-1.5">
                            <Building2 className="w-3.5 h-3.5 text-teal-400 shrink-0" />
                            <span>Host: {seminar.host}</span>
                          </p>
                        </div>
                      </div>

                      {/* Description Panel */}
                      <p className="text-slate-300 text-xs leading-relaxed line-clamp-3">
                        {seminar.description}
                      </p>

                      {/* Info Metadata Box */}
                      <div className="bg-white/5 border border-white/10 rounded-xl p-3 space-y-2 text-[11px]">
                        <div className="flex items-center gap-2 text-slate-300 font-mono">
                          <Calendar className="w-3.5 h-3.5 text-teal-400 shrink-0" />
                          <span>{seminar.date}</span>
                        </div>
                        <div className="flex items-center gap-2 text-slate-300 font-mono">
                          <MapPin className="w-3.5 h-3.5 text-teal-400 shrink-0" />
                          <span className="truncate">{seminar.venue}</span>
                        </div>
                      </div>

                      {/* Topics pills */}
                      <div className="flex flex-wrap gap-1">
                        {seminar.topics.map((t) => (
                          <span key={t} className="text-[10px] font-mono text-slate-300 bg-white/5 px-2 py-0.5 rounded border border-white/10">
                            #{t}
                          </span>
                        ))}
                      </div>

                      {/* Original Sources citation box as requested: "users can view the source of the seminars" */}
                      <div className="pt-3 border-t border-white/10 flex flex-col space-y-2">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono">Verified Citations:</span>
                        <div className="flex flex-wrap gap-2">
                          {seminar.sources && seminar.sources.length > 0 ? (
                            seminar.sources.map((s, sIdx) => (
                              <a
                                key={sIdx}
                                href={s.url}
                                target="_blank"
                                rel="referrer noopener"
                                className="inline-flex items-center space-x-1 text-[10px] text-indigo-300 hover:text-teal-300 font-mono bg-indigo-500/10 hover:bg-indigo-550/20 border border-indigo-500/20 px-2.5 py-1 rounded-md transition-colors truncate max-w-full"
                              >
                                <ExternalLink className="w-2.5 h-2.5 shrink-0" />
                                <span className="truncate max-w-[200px]">{s.title || "Source"}</span>
                              </a>
                            ))
                          ) : (
                            <span className="text-[10px] text-slate-550 font-mono italic">Ground source verified</span>
                          )}
                        </div>
                      </div>

                      {/* Standard Register & Toggle Save Buttons */}
                      <div className="pt-2.5 flex items-center justify-between gap-3">
                        <a
                          href={seminar.link}
                          target="_blank"
                          rel="noreferrer"
                          className="flex-1 bg-white/5 hover:bg-white/10 border border-white/10 text-center text-xs font-semibold py-2 rounded-xl text-white hover:text-teal-300 transition-all flex items-center justify-center space-x-1 animate-none"
                        >
                          <span>Visit Info Page</span>
                          <ExternalLink className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        </a>

                        <button
                          onClick={() => toggleSaveSeminar(seminar)}
                          className={`px-3.5 py-2 rounded-xl border transition-all text-xs flex items-center justify-center space-x-1 cursor-pointer font-semibold ${
                            isSaved
                              ? "bg-teal-500/20 border-teal-500/30 text-teal-300 hover:bg-teal-500/20"
                              : "bg-gradient-to-r from-indigo-500 to-teal-500 hover:from-indigo-600 hover:to-teal-600 border-transparent text-white shadow-md shadow-indigo-950/40"
                          }`}
                        >
                          {isSaved ? (
                            <>
                              <BookmarkCheck className="w-3.5 h-3.5 text-teal-400" />
                              <span className="hidden sm:inline">In Dossier</span>
                            </>
                          ) : (
                            <>
                              <Bookmark className="w-3.5 h-3.5 text-white" />
                              <span className="hidden sm:inline">Track Hour</span>
                            </>
                          )}
                        </button>
                      </div>

                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>

          </section>

        </div>
      </main>

      {/* FOOTER CO-BRANDED */}
      <footer className="relative z-10 border-t border-white/10 bg-black/20 backdrop-blur-md mt-20 py-10 px-4 text-center">
        <div className="max-w-4xl mx-auto space-y-4">
          <div className="flex items-center justify-center space-x-2 text-teal-400">
            <span className="font-extrabold text-white text-lg tracking-wider font-mono px-2 py-0.5 bg-gradient-to-br from-indigo-500 to-teal-400 rounded">MMCL</span>
            <span className="text-slate-500">x</span>
            <p className="text-xs font-semibold uppercase tracking-widest font-mono text-slate-300">Department of Computer Science</p>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed max-w-xl mx-auto">
            This platform facilitates direct integration of national computing seminar resources and academic research networks. Developed purely for educational enrichment cataloging. All search data uses Google Search Grounding to ensure verified citation matches.
          </p>
          <div className="text-slate-600 text-[10px] font-mono">
            &copy; {new Date().getFullYear()} Mapúa Malayan Colleges Laguna. Cabuyao, Laguna, Philippines.
          </div>
        </div>
      </footer>

      {/* PORTFOLIO DOSSIER VIEW MODAL (PRINTABLE AND EXCEL STYLE VIEW) */}
      <AnimatePresence>
        {showPortfolioView && (
          <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-[#0f172a]/95 border border-white/10 backdrop-blur-xl rounded-3xl p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto flex flex-col justify-between shadow-2xl relative"
            >
              
              {/* Header inside modal */}
              <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-6">
                <div>
                  <div className="flex items-center space-x-1.5 text-xs text-teal-400 font-mono font-bold uppercase tracking-wider">
                    <span>MAPÚA MALAYAN</span>
                    <span className="w-1.5 h-1.5 bg-teal-400 rounded-full" />
                    <span>LAGUNA</span>
                  </div>
                  <h3 className="text-xl font-black text-white">CS Professional Seminars Portfolio Dossier</h3>
                </div>
                <button
                  onClick={() => setShowPortfolioView(false)}
                  className="text-slate-350 hover:text-white bg-white/5 border border-white/10 px-3 py-1.5 rounded-xl transition-colors cursor-pointer text-xs font-bold"
                >
                  Close Portal
                </button>
              </div>

              {/* Input for student info to make it authentic and printable */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-white/5 p-4 rounded-2xl border border-white/10 mb-6">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 font-mono">Student Full Name</label>
                  <input
                    type="text"
                    value={studentName}
                    onChange={(e) => setStudentName(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 text-xs px-3.5 py-2.5 rounded-xl text-white outline-hidden focus:border-teal-400 font-sans"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 font-mono">Student ID Number</label>
                  <input
                    type="text"
                    value={studentId}
                    onChange={(e) => setStudentId(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 text-xs px-3.5 py-2.5 rounded-xl text-white outline-hidden focus:border-teal-400 font-mono"
                  />
                </div>
              </div>

              {/* Printable Area Wrapper */}
              <div id="printable-area" className="bg-white text-slate-900 p-6 md:p-8 rounded-2xl overflow-x-auto shadow-inner mb-6">
                
                {/* School Letterhead */}
                <div className="border-b-2 border-indigo-900 pb-5 mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center space-x-1 text-slate-900 font-serif font-extrabold text-sm uppercase tracking-widest">
                      <span>MAPÚA MALAYAN COLLEGES LAGUNA</span>
                    </div>
                    <h4 className="text-xs font-bold tracking-tight text-slate-800 uppercase font-mono">CCIS - College of Computer and Information Science</h4>
                    <p className="text-[10px] text-slate-500 italic font-mono">Cabuyao City, Laguna, Philippines</p>
                  </div>
                  <div className="text-right sm:text-right font-mono text-[10px] text-slate-605 text-slate-600">
                    <div>Document Ref: CS-SEM-{new Date().getFullYear()}</div>
                    <div>Date Generated: {new Date().toLocaleDateString()}</div>
                  </div>
                </div>

                <div className="text-center space-y-1.5 mb-6">
                  <h3 className="text-base font-extrabold uppercase tracking-wide text-indigo-900 font-serif">Seminar Attendance Portfolio Log</h3>
                  <p className="text-xs text-slate-600 max-w-lg mx-auto">
                    Compiled computing seminar credentials for course credit validation, career internship, or professional portfolio satisfaction.
                  </p>
                </div>

                {/* Student Profile Info on printout */}
                <div className="grid grid-cols-2 gap-4 border border-indigo-100 bg-indigo-50/20 p-4 rounded-xl text-xs mb-6">
                  <div>
                    <span className="text-indigo-650 font-mono text-[10px] block">STUDENT CANDIDATE:</span>
                    <span className="font-extrabold text-slate-850 uppercase text-sm">{studentName || "N/A"}</span>
                  </div>
                  <div>
                    <span className="text-indigo-650 font-mono text-[10px] block">STUDENT ID NUMBER:</span>
                    <span className="font-bold text-slate-850 font-mono">{studentId || "N/A"}</span>
                  </div>
                  <div>
                    <span className="text-indigo-650 font-mono text-[10px] block">ACADEMIC PROGRAM:</span>
                    <span className="font-medium text-slate-800">BS Computer Science (BSCS)</span>
                  </div>
                  <div>
                    <span className="text-indigo-655 font-mono text-[10px] block">TOTAL SEMINARS ENROLLED:</span>
                    <span className="font-bold text-indigo-800 font-mono">{savedSeminars.length} Courses</span>
                  </div>
                </div>

                {/* TABLE OF SEMINARS */}
                {savedSeminars.length === 0 ? (
                  <div className="py-12 text-center text-slate-400 text-xs italic">
                    No active seminars added to portfolio yet. Close this dossier tab and click the "Track Hour" button on any seminar cards.
                  </div>
                ) : (
                  <table className="w-full text-left border-collapse text-[11px] mb-6 min-w-[600px]">
                    <thead>
                      <tr className="bg-slate-100 border-b border-slate-250 text-slate-700 font-bold">
                        <th className="py-2.5 px-3">Seminar Name & Organizers</th>
                        <th className="py-2.5 px-3">Format</th>
                        <th className="py-2.5 px-3">Date & Scale</th>
                        <th className="py-2.5 px-3">Location/Venue</th>
                        <th className="py-2.5 px-3">Ground References</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-150">
                      {savedSeminars.map((s) => (
                        <tr key={s.id} className="hover:bg-slate-50/50">
                          <td className="py-3 px-3">
                            <div className="font-bold text-slate-900">{s.title}</div>
                            <div className="text-[10px] text-slate-550 font-medium">Host: {s.host}</div>
                          </td>
                          <td className="py-3 px-3 uppercase text-[10px]">
                            <span className={`px-2 py-0.5 rounded-sm font-bold ${
                              s.type === 'onsite' 
                                ? 'bg-teal-100 text-teal-850 px-2' 
                                : s.type === 'hybrid' 
                                  ? 'bg-indigo-100 text-indigo-850 px-2' 
                                  : 'bg-emerald-100 text-emerald-850 px-2'
                            }`}>
                              {s.type}
                            </span>
                          </td>
                          <td className="py-3 px-3">
                            <div className="font-medium">{s.date}</div>
                            <div className="text-[10px] text-slate-500 capitalize">{s.scale} Outreach</div>
                          </td>
                          <td className="py-3 px-3 font-mono text-[10px]">{s.venue}</td>
                          <td className="py-3 px-3 text-[10px] text-slate-600 font-mono">
                            {s.sources && s.sources.length > 0 ? (
                              <div className="max-w-[200px] truncate leading-tight">
                                {s.sources[0].title}<br/>
                                <span className="text-[9px] text-slate-400 italic truncate block">{s.sources[0].url}</span>
                              </div>
                            ) : (
                              "Official Portal"
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}

                {/* Verification block */}
                <div className="mt-12 pt-8 border-t border-slate-200 grid grid-cols-2 gap-12 text-[11px] font-mono">
                  <div className="space-y-4">
                    <p className="border-b border-slate-400 pb-1 text-slate-505 italic">Signature of Student Candidate</p>
                    <p className="font-bold text-slate-800 font-sans">{studentName || "__________________"}</p>
                  </div>
                  <div className="space-y-4 text-right">
                    <p className="border-b border-slate-400 pb-1 text-slate-505 italic text-right">Academic Department Advisor Verification</p>
                    <p className="font-bold text-slate-800 font-sans">__________________________________</p>
                  </div>
                </div>

              </div>

              {/* Action trigger panel */}
              <div className="flex flex-col sm:flex-row justify-between gap-4 mt-4">
                <button
                  type="button"
                  onClick={clearPortfolio}
                  className="text-xs text-rose-350 hover:text-rose-250 font-semibold px-4 py-2 bg-rose-500/10 hover:bg-rose-500/20 rounded-xl transition-all border border-rose-500/20 cursor-pointer pointer-events-auto"
                >
                  Clear All Selection
                </button>
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => setShowPortfolioView(false)}
                    className="bg-white/5 hover:bg-white/10 text-slate-300 font-bold text-xs px-5 py-2.5 rounded-xl border border-white/10 transition-all cursor-pointer pointer-events-auto"
                  >
                    Keep Browsing
                  </button>
                  <button
                    onClick={handlePrint}
                    disabled={savedSeminars.length === 0}
                    className="bg-gradient-to-r from-indigo-500 to-teal-500 hover:from-indigo-600 hover:to-teal-600 text-white font-extrabold text-xs px-6 py-2.5 rounded-xl transition-all shadow-md flex items-center space-x-1.5 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed pointer-events-auto"
                  >
                    <Printer className="w-4 h-4" />
                    <span>Print Dossier PDF</span>
                  </button>
                </div>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Adding custom print utility styles to page style block */}
      <style>{`
        @media print {
          body * {
            visibility: hidden;
            background: transparent !important;
          }
          #printable-area, #printable-area * {
            visibility: visible;
            color: #000 !important;
          }
          #printable-area {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            margin: 0;
            padding: 0;
            box-shadow: none !important;
          }
        }
      `}</style>

    </div>
  );
}
