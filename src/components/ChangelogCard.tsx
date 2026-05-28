import { useState } from "react";
import { Sparkles, Calendar } from "lucide-react";
import { ChangelogItem, AppInfo } from "../types";

export interface ChangelogCardProps {
  key?: string | number;
  item: ChangelogItem;
  app: AppInfo | undefined;
}

// Simple and highly customizable internal markdown parser to guarantee speed & safety
function QuickMarkdown({ content }: { content: string }) {
  const lines = content.split("\n");
  
  return (
    <div className="space-y-3.5 text-sm md:text-md text-slate-700 dark:text-slate-300 leading-relaxed font-sans">
      {lines.map((line, idx) => {
        const trimmed = line.trim();

        // 1. Headers ### or ## or #
        if (trimmed.startsWith("###")) {
          return (
            <h4 key={idx} className="text-sm font-bold text-slate-900 dark:text-slate-100 tracking-tight mt-4 uppercase border-b border-dashed border-slate-200 dark:border-slate-700 pb-1 flex items-center gap-1.5 font-mono">
              <span className="h-1.5 w-1.5 rounded-full bg-slate-600 dark:bg-slate-400" />
              {trimmed.replace(/^###\s*/, "")}
            </h4>
          );
        }
        if (trimmed.startsWith("##") || trimmed.startsWith("#")) {
          return (
            <h3 key={idx} className="text-md font-bold text-slate-950 dark:text-slate-100 mt-5 mb-2 font-sans tracking-tight">
              {trimmed.replace(/^#+\s*/, "")}
            </h3>
          );
        }

        // 2. Bullet list
        if (trimmed.startsWith("*") || trimmed.startsWith("-")) {
          const contentText = trimmed.replace(/^[\*\-]\s*/, "");
          // simple bolding parser
          return (
            <div key={idx} className="flex items-start gap-2.5 pl-2 my-1">
              <span className="text-slate-600 dark:text-slate-400 font-bold mt-1 text-xs">•</span>
              <p className="flex-1 text-slate-600 dark:text-slate-300 font-sans" dangerouslySetInnerHTML={{ __html: parseBold(contentText) }} />
            </div>
          );
        }

        // 3. Regular block / paragraph
        if (trimmed === "") {
          return <div key={idx} className="h-1" />;
        }

        return (
          <p key={idx} className="text-slate-600 dark:text-slate-300 pl-1" dangerouslySetInnerHTML={{ __html: parseBold(line) }} />
        );
      })}
    </div>
  );
}

// Utility to replace **bold** with <strong>bold</strong>
function parseBold(text: string): string {
  let res = text;
  const regex = /\*\*(.*?)\*\*/g;
  res = res.replace(regex, `<strong class="font-bold text-slate-900 dark:text-slate-100">$1</strong>`);

  // also style code blocks e.g. `code`
  const codeRegex = /`(.*?)`/g;
  res = res.replace(codeRegex, `<code class="bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs px-1.5 py-0.5 rounded-md text-slate-800 dark:text-slate-200 font-mono font-semibold">$1</code>`);
  return res;
}

export default function ChangelogCard({ item, app }: ChangelogCardProps) {
  // Default to the hype edition; readers can switch to the technical log.
  const [isGenZTranslated, setIsGenZTranslated] = useState(true);

  // Type details mapper
  const getTypeMeta = (type: string) => {
    switch (type) {
      case "major":
        return { label: "🚀 Rocket Launch", bg: "bg-orange-100 text-orange-700 border-orange-200" };
      case "security":
        return { label: "🔒 Security Shield", bg: "bg-rose-100 text-rose-700 border-rose-200" };
      case "patch":
        return { label: "🩹 Patch Fix", bg: "bg-slate-100 text-slate-650 border-slate-200" };
      default:
        return { label: "✨ Polish & Dust", bg: "bg-slate-100 text-slate-800 border-slate-200" };
    }
  };

  const typeMeta = getTypeMeta(item.type);

  // Format dynamic dates
  const formatDate = (isoString: string) => {
    const d = new Date(isoString);
    return d.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  // Fun alternative explanation translation ("Founder slang")
  const getVibeTranslation = () => {
    return `### ⚡ TL;DR: The Hype Edition (No Cap)
* **What just happened**: We leveled up the **${item.appName}** engine with high-speed rendering and zero latency!
* **Main upgrade**: The pipeline is now absolutely **goated** with a 45ms download footprint.
* **Why it matters**: Zero buffers, pure productivity. No more loading screens during late-night build sessions! 

#shipit #cookin #growth`;
  };

  return (
    <div id={`changelog-card-${item.id}`} className="group relative border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-xl p-6 md:p-7 transition-all duration-200 hover:border-slate-800 dark:hover:border-slate-600 hover:shadow-xs">
      
      {/* Absolute indicator line with app color theme */}
      <div className={`absolute left-0 top-0 bottom-0 w-1 rounded-l-xl bg-gradient-to-b ${app?.color || "from-slate-400 to-slate-500"}`} />

      {/* Header element */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
        
        {/* App Title & Version badges */}
        <div className="flex items-center gap-2">
          <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 text-xs font-semibold rounded-md ${app?.color ? `bg-linear-to-r ${app.color} text-white` : "bg-slate-950 text-white"}`}>
            {item.appName}
          </span>
          <span className="font-mono text-xs text-slate-800 dark:text-slate-300 font-medium bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded px-1.5 py-0.5">
            {item.version}
          </span>
          <span className={`text-[10px] uppercase font-bold tracking-wider border px-2 py-0.5 rounded ${typeMeta.bg} border-slate-100`}>
            {typeMeta.label}
          </span>
        </div>

        {/* Date and Timeline indicator */}
        <div className="flex items-center gap-1 text-xs text-slate-400 dark:text-slate-500 font-mono">
          <Calendar className="h-3.5 w-3.5 text-slate-400" />
          <span>{formatDate(item.date)}</span>
        </div>
      </div>

      {/* Bold Announcement Header */}
      <h3 className="text-lg md:text-xl font-bold text-slate-900 dark:text-slate-100 tracking-tight leading-tight transition duration-150">
        {item.title}
      </h3>

      {/* Metadata Contributor card row */}
      <div className="flex items-center gap-2 mt-2 mb-4 text-xs text-slate-500 dark:text-slate-400">
        <img
          src={item.author.avatarUrl}
          alt={item.author.name}
          className="h-5 w-5 rounded-full ring-1 ring-slate-100 dark:ring-slate-700"
        />
        <span>Posted by <strong className="text-slate-700 dark:text-slate-300 font-semibold">{item.author.name}</strong></span>
        <span className="text-slate-300 dark:text-slate-600">•</span>
        <span className="bg-slate-100/80 dark:bg-slate-800 text-slate-600 dark:text-slate-300 px-1.5 py-0.5 rounded font-mono text-[10px]">{item.author.role}</span>
      </div>

      {/* Main Core Content body */}
      <div className="bg-slate-50/40 dark:bg-slate-800/40 rounded-xl p-4 md:p-5 border border-slate-100 dark:border-slate-800 mt-1">
        {isGenZTranslated ? (
          <div className="space-y-3 font-sans text-slate-700 dark:text-slate-300 leading-relaxed transition-all duration-200">
            <span className="bg-amber-50/80 border border-amber-200 text-amber-800 text-[10px] px-2.5 py-0.5 rounded font-semibold inline-flex items-center gap-1">
              <Sparkles className="h-3 w-3 text-amber-500 animate-spin" /> Vibe Slang Edition
            </span>
            <QuickMarkdown content={getVibeTranslation()} />
          </div>
        ) : (
          <QuickMarkdown content={item.description} />
        )}
      </div>

      {/* Action panel footer */}
      <div className="flex items-center justify-end mt-5 pt-3.5 border-t border-slate-100 dark:border-slate-800">

        {/* Slang toggle */}
        <button
          id={`translate-vibe-btn-${item.id}`}
          onClick={() => setIsGenZTranslated(!isGenZTranslated)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-white"
          title="Toggle between the hype edition and the technical log"
        >
          <Sparkles className="h-3.5 w-3.5 text-amber-500" />
          <span>{isGenZTranslated ? "Technical Log" : "Hype Translation"}</span>
        </button>
      </div>

    </div>
  );
}
