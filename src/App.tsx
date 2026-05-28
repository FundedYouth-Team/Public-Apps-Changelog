import React, { useState, useEffect } from "react";
import { 
  Globe, 
  User, 
  ShieldAlert, 
  BookOpen, 
  GraduationCap, 
  Briefcase, 
  Search, 
  Bell, 
  Plus, 
  Activity, 
  Sparkles, 
  Code, 
  Filter, 
  Flame, 
  RefreshCw,
  MessageSquare,
  BadgeAlert,
  ArrowUpRight,
  Sun,
  Moon
} from "lucide-react";
import { ChangelogItem, AppInfo, UpdateType } from "./types";
import ChangelogCard from "./components/ChangelogCard";
import SubscriptionModal from "./components/SubscriptionModal";
import DraftDrawer from "./components/DraftDrawer";
import { useTheme } from "./hooks/useTheme";
import logoUrl from "./assets/logo-color-white-bg.png";

// Map string keys to Lucide icons dynamically for app categories
const ICON_MAP: Record<string, any> = {
  Globe,
  User,
  ShieldAlert,
  BookOpen,
  GraduationCap,
  Briefcase
};

// Helper to get matching clean design colors for each app
const getAppThemeColors = (appId: string | null) => {
  switch (appId) {
    case "public-site":
      return {
        text: "text-amber-700",
        icon: "text-orange-500",
        bg: "bg-orange-50/70",
        borderClass: "border-orange-500"
      };
    case "user-portal":
      return {
        text: "text-pink-700",
        icon: "text-pink-500",
        bg: "bg-pink-50/70",
        borderClass: "border-pink-500"
      };
    case "the-vault":
      return {
        text: "text-purple-700",
        icon: "text-purple-500",
        bg: "bg-purple-50/70",
        borderClass: "border-purple-500"
      };
    case "docs":
      return {
        text: "text-blue-700",
        icon: "text-blue-500",
        bg: "bg-blue-50/70",
        borderClass: "border-blue-500"
      };
    case "curriculum":
      return {
        text: "text-emerald-700",
        icon: "text-emerald-500",
        bg: "bg-emerald-50/70",
        borderClass: "border-emerald-500"
      };
    case "partner-network":
      return {
        text: "text-indigo-700",
        icon: "text-indigo-500",
        bg: "bg-indigo-50/70",
        borderClass: "border-indigo-500"
      };
    default:
      return {
        text: "text-slate-700",
        icon: "text-slate-400",
        bg: "bg-slate-50",
        borderClass: "border-slate-300"
      };
  }
};

export default function App() {
  const { isDark, toggleTheme } = useTheme();
  const [apps, setApps] = useState<AppInfo[]>([]);
  const [changelogs, setChangelogs] = useState<ChangelogItem[]>([]);
  const [selectedAppId, setSelectedAppId] = useState<string | null>(null); // null means "All"
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<UpdateType | "all">("all");
  const [isSubModalOpen, setIsSubModalOpen] = useState(false);
  const [isDraftDrawerOpen, setIsDraftDrawerOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [errorStatus, setErrorStatus] = useState<string | null>(null);
  
  // Confetti celebration notification whenever new update is posted
  const [celebrationMsg, setCelebrationMsg] = useState<string | null>(null);

  // Load the static changelog data file (apps + updates). Fully client-side — no backend.
  const fetchChanges = async () => {
    setIsLoading(true);
    setErrorStatus(null);
    try {
      const response = await fetch("/data/changelog.json", { cache: "no-cache" });
      if (!response.ok) {
        throw new Error("Failed to load changelog data file.");
      }
      const data = await response.json();
      setApps(Array.isArray(data.apps) ? data.apps : []);
      setChangelogs(Array.isArray(data.updates) ? data.updates : []);
    } catch (err: any) {
      setErrorStatus(err.message || "Something went wrong.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchChanges();
  }, []);

  // Handle post success trigger. On a static site this lives in the current
  // session only (not persisted) — add to public/data/changelog.json to make it permanent.
  const handlePublishSuccess = (newItem: ChangelogItem) => {
    setChangelogs((prev) => [newItem, ...prev]);
    setCelebrationMsg(`🚀 Update added to the ${newItem.appName} feed for this session!`);
    setTimeout(() => {
      setCelebrationMsg(null);
    }, 5000);
  };

  // Client-side search + filtering over the loaded JSON data
  const filteredChangelogs = changelogs.filter((cl) => {
    const matchApp = selectedAppId ? cl.appId === selectedAppId : true;
    const matchType = filterType === "all" ? true : cl.type === filterType;
    const q = searchQuery.toLowerCase().trim();
    const matchSearch =
      q === "" ||
      cl.title.toLowerCase().includes(q) ||
      cl.description.toLowerCase().includes(q) ||
      cl.appName.toLowerCase().includes(q) ||
      cl.version.toLowerCase().includes(q) ||
      cl.author.name.toLowerCase().includes(q) ||
      cl.tags.some((t) => t.toLowerCase().includes(q));

    return matchApp && matchType && matchSearch;
  });

  const selectedAppObj = apps.find((a) => a.id === selectedAppId);

  // Stats Counters
  const countByType = (type: UpdateType) => changelogs.filter((cl) => cl.type === type).length;
  const majorCount = countByType("major");
  const minorCount = countByType("minor");
  const patchCount = countByType("patch");
  const securityCount = countByType("security");

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-200 font-sans selection:bg-slate-800 selection:text-white pb-12 transition-colors duration-300">
      
      {/* Dynamic Celebration Toast */}
      {celebrationMsg && (
        <div className="fixed top-4 right-4 z-50 max-w-md rounded-xl bg-slate-900 dark:bg-slate-800 border border-slate-800 dark:border-slate-700 p-4 shadow-xl text-white flex items-start gap-3 animate-in fade-in duration-200">
          <div className="rounded-lg bg-slate-900 p-1.5 text-white">
            <Flame className="h-4 w-4 animate-pulse" />
          </div>
          <div>
            <h4 className="text-xs font-bold font-mono tracking-wider text-amber-400">CO-FOUNDER SHIP CONFIRMED</h4>
            <p className="text-xs text-slate-300 mt-0.5">{celebrationMsg}</p>
          </div>
        </div>
      )}

      {/* Main Container Layout */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        
        {/* Dynamic Telemetry Header Bar */}
        <header className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4.5 mb-6 flex flex-col md:flex-row items-center justify-between gap-4 shadow-xs">
          <div className="flex items-center gap-3">
            <div className="relative flex h-10 w-10 items-center justify-center rounded-lg bg-white overflow-hidden">
              <img src={logoUrl} alt="FundedYouth logo" className="h-full w-full object-contain" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base md:text-lg font-bold tracking-tight text-slate-900 dark:text-slate-100 uppercase">
                  FundedYouth <span className="text-slate-900 dark:text-slate-100 underline decoration-slate-300 dark:decoration-slate-600 underline-offset-4 decoration-2">Changelog</span>
                </h1>
                <span className="text-[9px] uppercase font-bold tracking-widest bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 px-2 py-0.5 rounded leading-none">
                  Telemetry Hub
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 font-medium leading-none">
                Ecosystem Software Updates & Community Release Log
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            {/* Dark mode toggle */}
            <button
              id="theme-toggle-btn"
              onClick={toggleTheme}
              aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
              title={isDark ? "Switch to light mode" : "Switch to dark mode"}
              className="flex items-center justify-center rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 h-9 w-9 shadow-xs transition-colors cursor-pointer"
            >
              {isDark ? <Sun className="h-4 w-4 text-amber-400" /> : <Moon className="h-4 w-4 text-slate-500" />}
            </button>

            {/* Direct Feed Subscriptions */}
            <button
              id="header-subscribe-btn"
              onClick={() => setIsSubModalOpen(true)}
              className="flex items-center gap-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-white text-xs font-semibold text-slate-700 dark:text-slate-200 py-2 px-3.5 shadow-xs transition-colors cursor-pointer"
            >
              <Bell className="h-3.5 w-3.5 text-slate-500 dark:text-slate-400" />
              <span>Subscribe to Feed</span>
            </button>

            {/* Launch change publisher (Contributor Mode) */}
            <button
              id="header-contribute-btn"
              onClick={() => setIsDraftDrawerOpen(true)}
              className="flex items-center gap-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-xs font-semibold text-white py-2 px-3.5 shadow-xs transition-colors cursor-pointer"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Draft App Change</span>
            </button>
          </div>
        </header>

        {/* Dashboard Content Grid splits into Sidebar & Stream */}
        <div id="main-content-layout" className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* LEFT SIDEBAR NAVIGATION PANEL (lg:col-span-3) - STICKY AND LOCKED ON DESKTOP */}
          <aside className="lg:col-span-3 lg:sticky lg:top-6 lg:max-h-[calc(100vh-3.5rem)] lg:overflow-y-auto space-y-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-xl shadow-xs self-start">
            
            {/* Apps directory navigator */}
            <div className="space-y-3.5">
              <h3 className="px-1 text-xs font-bold text-slate-400/90 dark:text-slate-500 uppercase tracking-wider mb-2 flex items-center justify-between">
                <span>The Ecosystem</span>
                <span className="font-mono bg-slate-100 dark:bg-slate-800 text-[10px] border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 rounded px-1.5 py-0.5 leading-none font-medium">
                  {apps.length} Apps
                </span>
              </h3>

              <div className="space-y-1">
                {/* "All" button */}
                <button
                  id="nav-all-apps"
                  onClick={() => setSelectedAppId(null)}
                  className={`w-full flex items-center justify-between rounded-r-lg py-2 text-left text-xs transition-all duration-150 cursor-pointer relative overflow-hidden ${
                    selectedAppId === null
                      ? "bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-100 font-semibold border-l-[3px] border-slate-700 dark:border-slate-400 pl-2 shadow-xs"
                      : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/60 font-medium pl-2.5 border-l-[3px] border-transparent"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Activity className={`h-3.5 w-3.5 ${selectedAppId === null ? "text-slate-700 dark:text-slate-300" : "text-slate-400"}`} />
                    <span>Everything</span>
                  </div>
                  <span className={`font-mono text-[9px] px-1.5 py-0.5 rounded pr-2 ${
                    selectedAppId === null ? "bg-white dark:bg-slate-700 shadow-xs text-slate-700 dark:text-slate-200" : "bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400"
                  }`}>
                    {changelogs.length}
                  </span>
                </button>

                {/* Individual dynamic app tabs */}
                {apps.map((app) => {
                  const LucideIcon = ICON_MAP[app.icon] || Globe;
                  const isSelected = selectedAppId === app.id;
                  const appUpdatesCount = changelogs.filter((cl) => cl.appId === app.id).length;
                  const themeColors = getAppThemeColors(app.id);

                  return (
                    <button
                      key={app.id}
                      id={`nav-app-${app.id}`}
                      onClick={() => setSelectedAppId(app.id)}
                      className={`w-full flex items-center justify-between rounded-r-lg py-2 text-left text-xs transition-all duration-150 cursor-pointer relative overflow-hidden ${
                        isSelected
                          ? `${themeColors.bg} ${themeColors.text} font-semibold border-l-[3px] ${themeColors.borderClass} pl-2 shadow-xs`
                          : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/60 font-medium pl-2.5 border-l-[3px] border-transparent"
                      }`}
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <LucideIcon className={`h-3.5 w-3.5 flex-shrink-0 ${themeColors.icon}`} />
                        <span className="truncate">{app.name}</span>
                      </div>
                      
                      <div className="flex items-center gap-1.5 flex-shrink-0 pr-2">
                        <span className="text-[9px] font-mono opacity-60 truncate max-w-[40px] hidden sm:inline">
                          {app.currentVersion}
                        </span>
                        <span className={`font-mono text-[9px] px-1.5 py-0.5 rounded ${
                          isSelected ? "bg-white shadow-xs text-slate-700" : "bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400"
                        }`}>
                          {appUpdatesCount}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Quick Metrics Widget */}
            <div className="border-t border-slate-100 dark:border-slate-800 pt-4 space-y-3">
              <span className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block pl-1">Cohort Stats Matrix</span>

              <div className="grid grid-cols-2 gap-2">
                <div className="bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700 rounded-lg p-2.5 flex flex-col items-center">
                  <span className="font-mono text-base font-bold text-slate-900 dark:text-slate-100">{changelogs.length}</span>
                  <span className="text-[9px] text-slate-500 dark:text-slate-400 font-medium">Updates</span>
                </div>
                <div className="bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700 rounded-lg p-2.5 flex flex-col items-center">
                  <span className="font-mono text-base font-bold text-slate-900 dark:text-slate-100">{apps.length}</span>
                  <span className="text-[9px] text-slate-500 dark:text-slate-400 font-medium">Ecosystem Apps</span>
                </div>
              </div>

              {/* Miniature horizontal bar for visual interest */}
              <div className="space-y-1.5 text-left pl-1">
                <span className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest block">Type Distribution</span>
                <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full flex overflow-hidden">
                  <div className="bg-orange-500 h-full" style={{ width: `${(majorCount/changelogs.length)*100 || 0}%` }} title="Major" />
                  <div className="bg-slate-800 h-full" style={{ width: `${(minorCount/changelogs.length)*100 || 0}%` }} title="Minor" />
                  <div className="bg-slate-500 h-full" style={{ width: `${(patchCount/changelogs.length)*100 || 0}%` }} title="Patch" />
                  <div className="bg-rose-500 h-full" style={{ width: `${(securityCount/changelogs.length)*100 || 0}%` }} title="Security" />
                </div>
                <div className="grid grid-cols-2 gap-1 text-[9px] text-slate-400 font-mono">
                  <span className="flex items-center gap-1"><span className="h-1.5 w-1.5 rounded-full bg-orange-500" />Major ({majorCount})</span>
                  <span className="flex items-center gap-1"><span className="h-1.5 w-1.5 rounded-full bg-slate-800" />Minor ({minorCount})</span>
                </div>
              </div>
            </div>

            {/* Subscribe Call-to-action card */}
            <div className="rounded-lg bg-gradient-to-br from-slate-900 to-slate-950 text-white p-4 border border-slate-950 relative overflow-hidden shadow-xs">
              <div className="absolute right-[-10px] top-[-10px] h-24 w-24 bg-slate-705/15 rounded-full blur-xl" />
              
              <div className="relative space-y-3">
                <div className="flex items-center gap-1.5">
                  <Activity className="h-3.5 w-3.5 text-slate-400" />
                  <span className="text-[10px] uppercase font-bold text-slate-305 tracking-wider font-mono">Real-Time Alerts</span>
                </div>
                
                <div>
                  <h4 className="text-xs font-semibold tracking-tight">Need Automated Alerts?</h4>
                  <p className="text-[10px] text-slate-300 mt-0.5 leading-relaxed">
                    Set up direct RSS XML feed integrations or custom webhook triggers.
                  </p>
                </div>

                <button
                  id="sidebar-subscribe-btn"
                  onClick={() => setIsSubModalOpen(true)}
                  className="w-full flex items-center justify-between rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-white px-3 py-2 cursor-pointer transition-colors"
                >
                  <span>Get Feeds Instantly</span>
                  <ArrowUpRight className="h-3.5 w-3.5 text-white" />
                </button>
              </div>
            </div>

          </aside>

          {/* CENTER TIMELINE FOCUS STREAM (lg:col-span-9) */}
          <main className="lg:col-span-9 space-y-5">
            
            {/* Context Header Section displaying Selected App details */}
            <section className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-xs relative overflow-hidden">
              <div className="absolute right-[-40px] top-[-40px] h-40 w-40 bg-slate-50 dark:bg-slate-800 rounded-full -z-10 blur-3xl opacity-60" />

              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-lg md:text-xl font-bold text-slate-900 dark:text-slate-100">
                      {selectedAppObj ? `${selectedAppObj.name} Feed` : "Latest Activity"}
                    </h2>
                    {selectedAppObj && (
                      <span className="font-mono text-xs text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded px-1.5 py-0.5 font-semibold">
                        {selectedAppObj.currentVersion}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed max-w-xl">
                    {selectedAppObj 
                      ? selectedAppObj.description 
                      : "Follow live code updates, lessons deployments, and template drops submitted by FundedYouth contributors."}
                  </p>
                </div>

                {/* Simple active/beta indicators */}
                <div className="flex items-center gap-2 self-start sm:self-center">
                  <span className="text-[10px] uppercase font-bold text-slate-400 font-mono tracking-widest">Status:</span>
                  <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-xs font-medium ${
                    selectedAppObj?.status === "beta" 
                      ? "bg-amber-50 text-amber-800 border border-amber-200" 
                      : "bg-emerald-50 text-emerald-800 border border-emerald-200"
                  }`}>
                    <span className={`h-1.5 w-1.5 rounded-full ${selectedAppObj?.status === "beta" ? "bg-amber-500" : "bg-emerald-500"}`} />
                    {selectedAppObj ? selectedAppObj.status : "Operational"}
                  </span>
                </div>
              </div>
            </section>

            {/* Inline search & filters tools panel */}
            <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-3 shadow-xs flex flex-col md:flex-row items-center justify-between gap-3">

              {/* Search input */}
              <div className="relative w-full md:max-w-xs">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
                <input
                  id="feed-search-input"
                  type="text"
                  placeholder="Search changes..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg pl-8.5 pr-4 py-1.5 text-xs text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-slate-500 focus:bg-white dark:focus:bg-slate-800 transition-all"
                />
              </div>

              {/* Categorization chips */}
              <div id="filter-chips-panel" className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0 pr-1">
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider flex items-center gap-1 mr-1 flex-shrink-0">
                  <Filter className="h-3 w-3" /> Filter:
                </span>

                {(["all", "major", "minor", "security"] as const).map((type) => {
                  const getLabel = () => {
                    switch (type) {
                      case "all": return "All Changes";
                      case "major": return "Rocket Launches";
                      case "minor": return "Polish";
                      case "security": return "Security";
                    }
                  };

                  const isChecked = filterType === type;
                  return (
                    <button
                      key={type}
                      id={`filter-chip-${type}`}
                      onClick={() => setFilterType(type)}
                      className={`px-3 py-1 rounded-lg text-xs font-semibold transition flex-shrink-0 cursor-pointer ${
                        isChecked
                          ? "bg-slate-900 dark:bg-slate-200 text-white dark:text-slate-900 shadow-xs"
                          : "bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700"
                      }`}
                    >
                      {getLabel()}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Error notifications */}
            {errorStatus && (
              <div className="rounded-3xl border border-rose-200 dark:border-rose-900/60 bg-rose-50/50 dark:bg-rose-950/20 p-6 text-center space-y-4">
                <BadgeAlert className="mx-auto h-12 w-12 text-rose-500" />
                <h3 className="text-md font-bold text-slate-900 dark:text-slate-100">Communication Breakdown</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed max-w-md mx-auto">
                  We lost touch with the backend server telemetry pipeline: <strong>{errorStatus}</strong>.
                </p>
                <button
                  id="retry-fetch-btn"
                  onClick={fetchChanges}
                  className="rounded-xl bg-rose-600 hover:bg-rose-700 text-xs font-bold text-white px-4 py-2 transition"
                >
                  Retry Telemetry Hook
                </button>
              </div>
            )}

            {/* Loading state placeholders */}
            {isLoading ? (
              <div className="space-y-6">
                {[1, 2, 3].map((n) => (
                  <div key={n} className="rounded-3xl border border-slate-150 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 space-y-4 animate-pulse">
                    <div className="flex justify-between items-center">
                      <div className="flex gap-2.5">
                        <div className="h-6 w-20 bg-slate-100 dark:bg-slate-800 rounded-full" />
                        <div className="h-6 w-12 bg-slate-100 dark:bg-slate-800 rounded-md" />
                      </div>
                      <div className="h-4 w-24 bg-slate-100 dark:bg-slate-800 rounded-md" />
                    </div>
                    <div className="h-5 w-2/3 bg-slate-100 dark:bg-slate-800 rounded-md" />
                    <div className="space-y-2">
                      <div className="h-3.5 w-full bg-slate-100 dark:bg-slate-800 rounded-md" />
                      <div className="h-3.5 w-full bg-slate-100 dark:bg-slate-800 rounded-md" />
                      <div className="h-3.5 w-4/5 bg-slate-100 dark:bg-slate-800 rounded-md" />
                    </div>
                    <div className="h-8 w-24 bg-slate-100 dark:bg-slate-800 rounded-full" />
                  </div>
                ))}
              </div>
            ) : filteredChangelogs.length === 0 ? (
              <div className="rounded-3xl border border-dashed border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 p-12 text-center space-y-4">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200">
                  <Activity className="h-7 w-7 stroke-[1.5]" />
                </div>
                <div>
                  <h3 className="text-md font-bold text-slate-900 dark:text-slate-100">No telemetry records match parameters</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-sm mx-auto leading-relaxed">
                    Try refining your text search query or adjusting type filters to view FundedYouth developer items.
                  </p>
                </div>
                <button
                  id="reset-filters-btn"
                  onClick={() => {
                    setSearchQuery("");
                    setFilterType("all");
                    setSelectedAppId(null);
                  }}
                  className="rounded-xl border border-slate-200 dark:border-slate-700 hover:border-slate-900 dark:hover:border-slate-400 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white text-xs font-bold px-4 py-2 bg-white dark:bg-slate-800 transition"
                >
                  Clear active search parameters
                </button>
              </div>
            ) : (
              // Changelog item cards list
              <div className="space-y-6">
                {filteredChangelogs.map((item) => {
                  const itemApp = apps.find((a) => a.id === item.appId);
                  return (
                    <ChangelogCard
                      key={item.id}
                      item={item}
                      app={itemApp}
                    />
                  );
                })}
              </div>
            )}

            {/* Quick help layout footer footer */}
            <div className="text-center text-[10px] text-slate-400 dark:text-slate-500 py-6 border-t border-slate-200 dark:border-slate-800 mt-12 space-y-1">
              <p>© May 2026 FundedYouth community. Engineered for high performance & entrepreneurial builders.</p>
              <p>W3C Feed standards and AI draft summarizations parsed using standard FundedYouth drafting configurations.</p>
            </div>

          </main>

        </div>
      </div>

      {/* Dynamic Subscriptions Portal Modal */}
      <SubscriptionModal
        isOpen={isSubModalOpen}
        onClose={() => setIsSubModalOpen(false)}
        apps={apps}
      />

      {/* Dynamic AI Release Draft Drawer */}
      <DraftDrawer
        isOpen={isDraftDrawerOpen}
        onClose={() => setIsDraftDrawerOpen(false)}
        apps={apps}
        onPublishSuccess={handlePublishSuccess}
      />

    </div>
  );
}
