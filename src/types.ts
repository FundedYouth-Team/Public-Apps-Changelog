export type UpdateType = "major" | "minor" | "patch" | "security";

export interface ChangelogItem {
  id: string;
  appId: string;
  appName: string;
  title: string;
  description: string; // supports markdown
  date: string; // ISO date
  version: string;
  type: UpdateType;
  author: {
    name: string;
    avatarUrl: string;
    role: string;
  };
  tags: string[];
}

export interface AppInfo {
  id: string;
  name: string;
  description: string;
  icon: string; // Lucide icon name
  color: string; // Tailwind hex or class prefix (e.g. 'orange', 'emerald', 'sky')
  status: "active" | "maintenance" | "beta";
  currentVersion: string;
}

export interface Subscription {
  email: string;
  appIds: string[]; // empty means "all"
  types: UpdateType[];
  frequency: "instant" | "daily" | "weekly";
}
