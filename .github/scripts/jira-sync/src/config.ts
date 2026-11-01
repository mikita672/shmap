export const JIRA_SITE = process.env.JIRA_SITE ?? "https://mdzvtt.atlassian.net";
export const JIRA_PROJECT = process.env.JIRA_PROJECT ?? "SCRUM";
const JIRA_CLOUD_ID =
  process.env.JIRA_CLOUD_ID ?? "cf12578f-739a-4cb1-9028-a4ccc7bf1b39";

// Scoped API tokens only work through Atlassian's API gateway.
export const JIRA_API_URL =
  process.env.JIRA_API_URL ?? `https://api.atlassian.com/ex/jira/${JIRA_CLOUD_ID}`;

export const GITHUB_REPO = process.env.GITHUB_REPOSITORY ?? "mikita672/shmap";

export const SYNC_PROPERTY = "shmap-github-sync";

export const JIRA_STATUS_IDS = {
  todo: "10000",
  "in-progress": "10001",
  "in-review": "10002",
  done: "10003",
} as const;

export const STATUS_LABELS = ["in-progress", "in-review"] as const;

export const GITHUB_ONLY_LABELS = new Set<string>(["eas-build", ...STATUS_LABELS]);

export function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing ${name}. Set it in .env locally or as a secret in Actions.`);
  }
  return value;
}
