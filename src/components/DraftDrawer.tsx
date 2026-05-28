import React, { useState, useEffect } from "react";
import { X, Sparkles, Cpu, Check, Loader2, Play, Info, AlertTriangle } from "lucide-react";
import { AppInfo, ChangelogItem, UpdateType } from "../types";

export interface DraftDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  apps: AppInfo[];
  onPublishSuccess: (newItem: ChangelogItem) => void;
}

const LOADING_STEPS = [
  "Firing up the FundedYouth AI engine...",
  "Analyzing raw developer commits...",
  "Sprinkling co-founder motivational sparkles...",
  "Formatting responsive markdown block...",
  "Almost ready to ship...",
];

export default function DraftDrawer({ isOpen, onClose, apps, onPublishSuccess }: DraftDrawerProps) {
  const [selectedAppId, setSelectedAppId] = useState(apps[0]?.id || "");
  const [title, setTitle] = useState("");
  const [version, setVersion] = useState("v1.0.0");
  const [type, setType] = useState<UpdateType>("minor");
  const [authorName, setAuthorName] = useState("Ryan");
  const [authorRole, setAuthorRole] = useState("Ecosystem Lead");
  const [rawBullets, setRawBullets] = useState("");
  const [aiTone, setAiTone] = useState<"standard" | "super-hype">("super-hype");
  const [draftContent, setDraftContent] = useState("");
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [loadingStepIdx, setLoadingStepIdx] = useState(0);
  const [aiError, setAiError] = useState<string | null>(null);
  const [isPublishing, setIsPublishing] = useState(false);
  const [isDraftModified, setIsDraftModified] = useState(false);

  useEffect(() => {
    if (selectedAppId) {
      const app = apps.find((a) => a.id === selectedAppId);
      if (app) {
        // Recommend next version e.g. v2.8.4 -> v2.8.5
        const parts = app.currentVersion.replace(/[^\d\.]/g, "").split(".");
        if (parts.length === 3) {
          const patch = parseInt(parts[2], 10) + 1;
          setVersion(`v${parts[0]}.${parts[1]}.${patch}`);
        } else {
          setVersion("v1.0.1");
        }
      }
    }
  }, [selectedAppId, apps]);

  useEffect(() => {
    let interval: any;
    if (isAiLoading) {
      setLoadingStepIdx(0);
      interval = setInterval(() => {
        setLoadingStepIdx((prev) => (prev + 1) % LOADING_STEPS.length);
      }, 1600);
    }
    return () => clearInterval(interval);
  }, [isAiLoading]);

  if (!isOpen) return null;

  const selectedApp = apps.find((a) => a.id === selectedAppId);

  const handleAiDraft = async () => {
    if (!rawBullets.trim()) {
      setAiError("Please type at least some raw updates or messy notes to draft!");
      return;
    }

    setIsAiLoading(true);
    setAiError(null);
    try {
      const res = await fetch("/api/ai/hype", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          rawBullets,
          appName: selectedApp?.name || "Ecosystem Hub",
          version,
          tone: aiTone,
        }),
      });

      if (!res.ok) {
        throw new Error("We encountered an API breakdown while drafting. Please try again.");
      }

      const data = await res.json();
      setDraftContent(data.markdown);
      setIsDraftModified(true);
    } catch (err: any) {
      setAiError(err.message || "Something went wrong during generation.");
    } finally {
      setIsAiLoading(false);
    }
  };

  const handlePublish = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) {
      alert("Please give this release note a concise title!");
      return;
    }
    if (!draftContent) {
      alert("Please either translate your bullets via the AI Hype Wizard or manually write content in the draft box first!");
      return;
    }

    setIsPublishing(true);
    try {
      const cleanTags = [selectedAppId, type, "released"];

      const res = await fetch("/api/changes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          appId: selectedAppId,
          appName: selectedApp?.name || "App",
          title,
          description: draftContent,
          version,
          type,
          authorName,
          authorRole,
          tags: cleanTags,
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to save changes to backend database.");
      }

      const newItem = await res.json();
      onPublishSuccess(newItem);
      onClose();
    } catch (err: any) {
      alert("Error publishing changes: " + err.message);
    } finally {
      setIsPublishing(false);
    }
  };

  return (
    <div id="draft-drawer" className="fixed inset-0 z-50 flex justify-end bg-slate-950/80 backdrop-blur-xs">
      <div className="relative w-full max-w-2xl bg-slate-900 text-white shadow-2xl h-full flex flex-col border-l border-slate-700/50 transition-all duration-300 animate-in slide-in-from-right">
        
        {/* Drawer Header */}
        <div className="p-6 border-b border-slate-800 flex items-center justify-between bg-slate-950/40">
          <div className="flex items-center gap-2">
            <div className="h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-mono text-xs text-slate-400 uppercase tracking-widest">Writers Block Buster</span>
            <span className="bg-slate-850 text-slate-300 border border-slate-700 text-[10px] px-2 py-0.5 rounded-full font-bold">
              FundedYouth AI
            </span>
          </div>
          <button id="close-drawer-btn" onClick={onClose} className="text-slate-400 hover:text-white transition">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form area */}
        <form onSubmit={handlePublish} className="flex-1 overflow-y-auto p-6 space-y-6">
          
          <div className="bg-slate-950/50 rounded-2xl p-4 border border-slate-800/80">
            <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wide flex items-center gap-1.5 mb-2">
              <Info className="h-4 w-4 text-slate-300" /> Release Meta
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed mb-4">
              Enter basic metadata. We will use this metadata context combined with the AI co-pilot to craft high-impact announcements.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-bold text-slate-400 uppercase mb-1">SELECT APPLICATION</label>
                <select
                  id="draft-app-select"
                  value={selectedAppId}
                  onChange={(e) => setSelectedAppId(e.target.value)}
                  className="w-full bg-slate-850 border border-slate-700 text-slate-200 rounded-xl px-3 py-1.5 text-xs focus:outline-none focus:border-slate-500"
                >
                  {apps.map((app) => (
                    <option key={app.id} value={app.id}>
                      {app.name} ({app.currentVersion})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-400 uppercase mb-1">RELEASE VERSION</label>
                <input
                  id="draft-version-input"
                  type="text"
                  required
                  placeholder="v1.2.5"
                  value={version}
                  onChange={(e) => setVersion(e.target.value)}
                  className="w-full bg-slate-850 border border-slate-700 text-slate-200 rounded-xl px-3 py-1.5 text-xs font-mono focus:outline-none focus:border-slate-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-400 uppercase mb-1">SENDER NAME</label>
                <input
                  id="draft-author-name"
                  type="text"
                  required
                  value={authorName}
                  onChange={(e) => setAuthorName(e.target.value)}
                  className="w-full bg-slate-850 border border-slate-700 text-slate-200 rounded-xl px-3 py-1.5 text-xs focus:outline-none focus:border-slate-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-400 uppercase mb-1">SEVERITY TYPE</label>
                <div className="flex gap-1.5">
                  {(["major", "minor", "security"] as const).map((t) => (
                    <button
                      type="button"
                      key={t}
                      id={`severity-btn-${t}`}
                      onClick={() => setType(t)}
                      className={`flex-1 rounded-lg py-1.5 text-[10px] uppercase font-bold transition ${
                        type === t
                          ? t === "major"
                            ? "bg-orange-600 text-white"
                            : t === "security"
                            ? "bg-rose-600 text-white"
                            : "bg-slate-700 text-white"
                          : "bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-slate-200"
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Raw Bullets input */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
              Step 1: Write Raw Bullet Points or messy notes
            </label>
            <textarea
              id="draft-raw-bullets"
              rows={4}
              value={rawBullets}
              onChange={(e) => setRawBullets(e.target.value)}
              placeholder="e.g.&#10;- Fixed layout overlap on mobile dashboards&#10;- Optimized load speeds from 300ms to 40ms&#10;- Added responsive dark mode style settings"
              className="w-full bg-slate-850 border border-slate-800 text-slate-100 rounded-2xl p-3 text-xs placeholder-slate-500 focus:outline-none focus:border-slate-500 font-mono leading-relaxed"
            />
            <div className="flex items-center justify-between pt-1">
              <span className="text-[10px] text-slate-500">
                You can write quick shorthand; the AI handles spelling, structures, and excitement.
              </span>
              <div className="flex items-center gap-1">
                <span className="text-[10px] text-slate-400 font-bold uppercase mr-1">Vibe Filter:</span>
                <button
                  type="button"
                  id="tone-geek-btn"
                  onClick={() => setAiTone("standard")}
                  className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    aiTone === "standard" ? "bg-slate-800 text-slate-300 border border-slate-700" : "text-slate-500 hover:text-slate-300"
                  }`}
                >
                  Approachable Nerd
                </button>
                <button
                  type="button"
                  id="tone-hype-btn"
                  onClick={() => setAiTone("super-hype")}
                  className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    aiTone === "super-hype" ? "bg-amber-900/60 text-amber-300 border border-amber-800" : "text-slate-500 hover:text-slate-300"
                  }`}
                >
                  🚀 Launch Hype
                </button>
              </div>
            </div>
          </div>

          {/* AI Trigger button */}
          <button
            type="button"
            id="draft-ai-hype-btn"
            disabled={isAiLoading || !rawBullets.trim()}
            onClick={handleAiDraft}
            className={`w-full rounded-2xl py-3 text-xs font-bold transition flex items-center justify-center gap-2 ${
              isAiLoading
                ? "bg-slate-850 text-slate-500 cursor-not-allowed"
                : rawBullets.trim()
                ? "bg-linear-to-r from-slate-750 via-slate-800 to-slate-900 hover:from-slate-700 hover:to-slate-850 text-white shadow-xl shadow-slate-950/50 touch-manipulation"
                : "bg-slate-800 text-slate-500 cursor-not-allowed"
            }`}
          >
            {isAiLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin text-slate-400" />
                <span>{LOADING_STEPS[loadingStepIdx]}</span>
              </>
            ) : (
              <>
                <Cpu className="h-4 w-4 text-amber-300 animate-pulse" />
                <span>Translate with FundedYouth AI Hype Wizard!</span>
              </>
            )}
          </button>

          {aiError && (
            <div className="rounded-xl border border-rose-900 bg-rose-950/20 p-3 text-xs text-rose-300 flex items-start gap-2">
              <AlertTriangle className="h-4 w-4 text-rose-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-bold">Offline Generation Engaged</p>
                <p className="opacity-80">Local templates were applied to craft your draft.</p>
              </div>
            </div>
          )}

          {/* Draft editor preview */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1">
              Step 2: Review & Edit the Hype Draft
              {isDraftModified && <span className="text-[10px] bg-emerald-950 border border-emerald-800 text-emerald-400 px-1.5 rounded-full">Polished by AI</span>}
            </label>
            <textarea
              id="draft-content-preview"
              rows={8}
              value={draftContent}
              onChange={(e) => {
                setDraftContent(e.target.value);
                setIsDraftModified(false);
              }}
              placeholder="Your polished release note content goes here. You can edit this directly before publishing."
              className="w-full bg-slate-950 border border-slate-800 text-slate-100 rounded-2xl p-3 text-xs font-sans focus:outline-none focus:border-slate-500 leading-relaxed"
            />
          </div>

          <div className="space-y-2.5">
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
              Step 3: Craft a Punchy Headline
            </label>
            <input
              id="draft-title-input"
              type="text"
              required
              placeholder="e.g. ⚡ Ultra-Speed Caches & Gamified Badge Drops!"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-slate-850 border border-slate-800 text-slate-100 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-slate-500 font-semibold"
            />
          </div>

        </form>

        {/* Action Footer */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between gap-4">
          <button
            type="button"
            id="draft-cancel-btn"
            onClick={onClose}
            className="px-4 py-2 text-xs text-slate-400 hover:text-white transition font-bold"
          >
            Reset Form
          </button>
          
          <button
            type="submit"
            id="draft-submit-btn"
            disabled={isPublishing || !title || !draftContent}
            onClick={handlePublish}
            className={`px-6 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
              isPublishing || !title || !draftContent
                ? "bg-slate-850 text-slate-500 cursor-not-allowed"
                : "bg-emerald-600 hover:bg-emerald-500 text-white shadow-xl shadow-emerald-950/20"
            }`}
          >
            {isPublishing ? (
              <>
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                <span>Spreading the Word...</span>
              </>
            ) : (
              <>
                <Check className="h-4 w-4" />
                <span>Ship Changes Live!</span>
              </>
            )}
          </button>
        </div>

      </div>
    </div>
  );
}
