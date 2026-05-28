import React, { useState } from "react";
import { X, Mail, Rss, Link2, Copy, Check, Bell, Sparkles, Webhook } from "lucide-react";
import { AppInfo } from "../types";

export interface SubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  apps: AppInfo[];
}

export default function SubscriptionModal({ isOpen, onClose, apps }: SubscriptionModalProps) {
  const [email, setEmail] = useState("");
  const [selectedApps, setSelectedApps] = useState<string[]>([]);
  const [frequency, setFrequency] = useState<"instant" | "daily" | "weekly">("instant");
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [copiedFeed, setCopiedFeed] = useState<"rss" | "json" | "webhook" | null>(null);
  const [customWebhook, setCustomWebhook] = useState("");
  const [webhookRegistered, setWebhookRegistered] = useState(false);

  if (!isOpen) return null;

  // Base URL generation
  const getBaseUrl = () => {
    return window.location.origin;
  };

  const handleCopy = (type: "rss" | "json" | "webhook", text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedFeed(type);
    setTimeout(() => setCopiedFeed(null), 2000);
  };

  const handleSubscribeEmail = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setIsSubscribed(true);
    setTimeout(() => {
      // simulate automated email registration
    }, 1000);
  };

  const toggleAppSelection = (id: string) => {
    if (selectedApps.includes(id)) {
      setSelectedApps(selectedApps.filter((a) => a !== id));
    } else {
      setSelectedApps([...selectedApps, id]);
    }
  };

  const rssUrl = `${getBaseUrl()}/api/feed.xml`;
  const jsonUrl = `${getBaseUrl()}/api/feed.json`;

  return (
    <div id="subscription-modal" className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-xs">
      <div className="relative w-full max-w-2xl overflow-hidden rounded-3xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xl transition-all duration-300 animate-in fade-in zoom-in-95">
        
        {/* Banner with youth community vibes */}
        <div className="bg-linear-to-br from-slate-800 via-slate-900 to-slate-950 px-6 py-8 text-white relative">
          <button 
            id="close-sub-btn"
            onClick={onClose}
            className="absolute top-4 right-4 rounded-full bg-white/10 p-2 text-white/80 hover:bg-white/25 hover:text-white transition"
          >
            <X className="h-4 w-4" />
          </button>
          
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-amber-400 p-2 text-slate-950 font-bold shadow-lg animate-bounce">
              <Sparkles className="h-5 w-5" />
            </div>
            <span className="text-xs font-semibold uppercase tracking-wider text-amber-300">FundedYouth Ecosystem</span>
          </div>
          <h2 className="mt-2 text-2xl font-bold tracking-tight">Stay Hype. Get the Feeds.</h2>
          <p className="mt-1 text-sm text-slate-300">
            Choose how you follow ecosystem developments. Hook your favorite tool or get cool alerts before everyone else.
          </p>
        </div>

        {/* Modal Content tabs */}
        <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-slate-100 dark:divide-slate-800 max-h-[85vh] overflow-y-auto">

          {/* Email Subscription Setup */}
          <div className="p-6">
            <div className="flex items-center gap-2 text-slate-800 dark:text-slate-200 font-bold mb-4">
              <Mail className="h-5 w-10 flex-shrink-0" />
              <h3 className="text-md font-semibold text-slate-800 dark:text-slate-200">Email Notification Crew</h3>
            </div>

            {isSubscribed ? (
              <div className="rounded-2xl border border-emerald-100 dark:border-emerald-900/50 bg-emerald-50/50 dark:bg-emerald-950/20 p-5 text-center transition">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400">
                  <Bell className="h-6 w-6 animate-pulse" />
                </div>
                <h4 className="mt-3 font-semibold text-slate-800 dark:text-slate-200">You are on the list!</h4>
                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  We have registered <strong className="text-slate-700 dark:text-slate-300">{email}</strong> to receive {frequency} developer notifications for {selectedApps.length === 0 ? "all hubs" : `${selectedApps.length} specified tools`}.
                </p>
                <button
                  id="reset-sub-btn"
                  onClick={() => {
                    setIsSubscribed(false);
                    setEmail("");
                    setSelectedApps([]);
                  }}
                  className="mt-4 text-xs font-semibold text-slate-800 dark:text-slate-300 underline hover:text-slate-950 dark:hover:text-white"
                >
                  Edit subscription preferences
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubscribeEmail} className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">YOUR EMAIL ADDRESS</label>
                  <input
                    id="sub-email-input"
                    type="email"
                    required
                    placeholder="you@cohort.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-sm text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:border-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1.5">
                    SELECT CHANNELS (Leave empty for all alerts)
                  </label>
                  <div className="grid grid-cols-2 gap-1.5 max-h-[140px] overflow-y-auto pr-1">
                    {apps.map((app) => (
                      <button
                        type="button"
                        key={app.id}
                        id={`sub-app-btn-${app.id}`}
                        onClick={() => toggleAppSelection(app.id)}
                        className={`flex items-center justify-between rounded-lg border px-2.5 py-1.5 text-left text-xs transition ${
                          selectedApps.includes(app.id)
                            ? "border-slate-800 dark:border-slate-500 bg-slate-50/80 dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-semibold"
                            : "border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
                        }`}
                      >
                        <span className="truncate">{app.name}</span>
                        {selectedApps.includes(app.id) && <Check className="h-3 w-3 text-slate-900 ml-1 flex-shrink-0" />}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1 animate-none">SEND FREQUENCY</label>
                  <div className="grid grid-cols-3 gap-1">
                    {(["instant", "daily", "weekly"] as const).map((freq) => (
                      <button
                        type="button"
                        key={freq}
                        id={`freq-btn-${freq}`}
                        onClick={() => setFrequency(freq)}
                        className={`rounded-lg py-1.5 text-center text-xs capitalize transition ${
                          frequency === freq
                            ? "bg-slate-900 dark:bg-slate-200 text-white dark:text-slate-900 font-medium"
                            : "border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
                        }`}
                      >
                        {freq}
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  type="submit"
                  id="sub-email-submit"
                  className="w-full rounded-xl bg-slate-900 py-2.5 text-sm font-semibold text-white shadow-md hover:bg-slate-800 focus:outline-none transition"
                >
                  Activate Notifications
                </button>
              </form>
            )}
          </div>

          {/* Developer Feed Feeds & RSS */}
          <div className="p-6 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 text-slate-800 dark:text-slate-200 font-bold mb-4">
                <Rss className="h-5 w-5" />
                <h3 className="text-md font-semibold text-slate-800 dark:text-slate-200">RSS & Developer Feeds</h3>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mb-4 leading-relaxed">
                Connect our feeds to your Slack channel, Discord RSS bot, or favorite client-side aggregator to keep your developer workspace automatically synchronized.
              </p>

              {/* RSS Feed Card */}
              <div className="space-y-3.5">
                <div className="rounded-2xl border border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 p-3 flex flex-col gap-1.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="rounded-md bg-orange-100 dark:bg-orange-950/40 p-1 text-orange-600 dark:text-orange-400">
                        <Rss className="h-3.5 w-3.5" />
                      </div>
                      <span className="text-xs font-bold text-slate-700 dark:text-slate-200">RSS / XML Format (Feed.xml)</span>
                    </div>
                    <button
                      id="copy-rss-btn"
                      onClick={() => handleCopy("rss", rssUrl)}
                      className="rounded-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 p-1 text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-white transition"
                      title="Copy URL"
                    >
                      {copiedFeed === "rss" ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
                    </button>
                  </div>
                  <code className="text-[10px] text-slate-500 dark:text-slate-400 select-all font-mono break-all bg-white dark:bg-slate-900 rounded-lg p-1.5 border border-slate-200/50 dark:border-slate-700">
                    {rssUrl}
                  </code>
                </div>

                {/* JSON Feed Card */}
                <div className="rounded-2xl border border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 p-3 flex flex-col gap-1.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="rounded-md bg-cyan-100 dark:bg-cyan-950/40 p-1 text-cyan-700 dark:text-cyan-400">
                        <Link2 className="h-3.5 w-3.5" />
                      </div>
                      <span className="text-xs font-bold text-slate-700 dark:text-slate-200">JSON Feed Format (Feed.json)</span>
                    </div>
                    <button
                      id="copy-json-btn"
                      onClick={() => handleCopy("json", jsonUrl)}
                      className="rounded-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 p-1 text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-white transition"
                      title="Copy URL"
                    >
                      {copiedFeed === "json" ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
                    </button>
                  </div>
                  <code className="text-[10px] text-slate-500 dark:text-slate-400 select-all font-mono break-all bg-white dark:bg-slate-900 rounded-lg p-1.5 border border-slate-200/50 dark:border-slate-700">
                    {jsonUrl}
                  </code>
                </div>

                {/* Simulated Webhook Setup */}
                <div className="rounded-2xl border border-slate-100 dark:border-slate-700 bg-slate-50/60 dark:bg-slate-800/40 p-3 space-y-2">
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                    <Webhook className="h-3.5 w-3.5" /> Custom Push Webhooks
                  </span>
                  
                  {webhookRegistered ? (
                    <div className="rounded-lg bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-900/50 p-2 text-[11px] text-emerald-800 dark:text-emerald-300 flex items-center justify-between">
                      <span>🎉 Webhook URL saved successfully!</span>
                      <button
                        id="unreg-webhook"
                        onClick={() => {
                          setWebhookRegistered(false);
                          setCustomWebhook("");
                        }}
                        className="text-[10px] font-bold text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 underline"
                      >
                        Reset
                      </button>
                    </div>
                  ) : (
                    <div className="flex gap-1.5">
                      <input
                        id="webhook-input"
                        type="url"
                        placeholder="https://yourdiscord.com/api/webhooks/..."
                        value={customWebhook}
                        onChange={(e) => setCustomWebhook(e.target.value)}
                        className="flex-1 text-[11px] rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 px-2 py-1 focus:outline-none focus:border-slate-500"
                      />
                      <button
                        id="register-webhook-btn"
                        onClick={() => {
                          if (customWebhook) setWebhookRegistered(true);
                        }}
                        className="bg-slate-900 text-white rounded-lg px-2.5 py-1 text-xs font-semibold hover:bg-slate-800 transition"
                      >
                        Connect
                      </button>
                    </div>
                  )}
                  <p className="text-[10px] text-slate-400 dark:text-slate-500">
                    Automatically triggers a standard JSON payload whenever a release is published.
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 mt-4 text-center">
              <span className="text-[10px] text-slate-400 dark:text-slate-500">
                FundedYouth updates are fully W3C RSS 2.0 and JSON Feed 1.1 compliant.
              </span>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
