export interface Service {
  id: string;
  user_id: string;
  name: string;
  description?: string;
  url: string;
  api_url?: string;
  logo_domain?: string;
  type: 'atlassian' | 'downdetector';
  category: string;
  icon?: string;
  status: "operational" | "degraded" | "outage" | "unknown";
  latency?: number;
  last_checked?: string;
  created_at: string;
}

export interface UserSettings {
  id: string;
  user_id: string;
  wallpaper_url?: string;
  refresh_interval: number;
  created_at: string;
  updated_at: string;
}

export type ServiceStatus = "operational" | "degraded" | "outage" | "unknown";

export const STATUS_CONFIG: Record<
  ServiceStatus,
  { label: string; color: string; bgColor: string }
> = {
  operational: {
    label: "Operational",
    color: "text-emerald-400",
    bgColor: "bg-emerald-500",
  },
  degraded: {
    label: "Degraded",
    color: "text-amber-400",
    bgColor: "bg-amber-500",
  },
  outage: {
    label: "Outage",
    color: "text-red-400",
    bgColor: "bg-red-500",
  },
  unknown: {
    label: "Unknown",
    color: "text-slate-400",
    bgColor: "bg-slate-500",
  },
};

export const DEFAULT_SERVICES = [
  {
    name: "GitHub",
    url: "https://www.githubstatus.com/api/v2/status.json",
    category: "Development",
    icon: "github",
  },
  {
    name: "Vercel",
    url: "https://www.vercel-status.com/api/v2/status.json",
    category: "Development",
    icon: "cloud",
  },
  {
    name: "AWS",
    url: "https://health.aws.amazon.com",
    category: "Cloud",
    icon: "server",
  },
  {
    name: "Cloudflare",
    url: "https://www.cloudflarestatus.com/api/v2/status.json",
    category: "Network",
    icon: "shield",
  },
  {
    name: "Discord",
    url: "https://discordstatus.com/api/v2/status.json",
    category: "Communication",
    icon: "message-circle",
  },
  {
    name: "Slack",
    url: "https://status.slack.com/api/v2.0.0/current",
    category: "Communication",
    icon: "hash",
  },
];
