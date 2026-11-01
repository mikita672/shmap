import { GITHUB_REPO, requireEnv } from "./config.ts";
import { HttpError, request } from "./http.ts";

export type GithubIssue = {
  number: number;
  title: string;
  body: string | null;
  state: "open" | "closed";
  labels: { name: string }[];
  html_url: string;
  pull_request?: unknown;
};

export type GithubIssuePatch = {
  title?: string;
  body?: string;
  state?: "open" | "closed";
  state_reason?: "completed" | "reopened";
  labels?: string[];
};

export type GithubLabel = { name: string; color: string; description: string | null };

const API_URL = "https://api.github.com";
const REPO_PATH = `/repos/${GITHUB_REPO}`;

function headers(): Record<string, string> {
  return {
    Authorization: `Bearer ${requireEnv("GITHUB_TOKEN")}`,
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
    "User-Agent": "shmap-jira-sync",
  };
}

async function github<T>(method: string, path: string, body?: unknown): Promise<T> {
  const { data } = await request<T>(`${API_URL}${path}`, {
    method,
    headers: headers(),
    body,
  });
  return data;
}

async function paginate<T>(path: string): Promise<T[]> {
  const items: T[] = [];
  let url: string | undefined = `${API_URL}${path}`;
  while (url) {
    const page: { data: T[]; headers: Headers } = await request<T[]>(url, {
      method: "GET",
      headers: headers(),
    });
    items.push(...page.data);
    url = page.headers.get("link")?.match(/<([^>]+)>;\s*rel="next"/)?.[1];
  }
  return items;
}

const label = (name: string) => encodeURIComponent(name);

export function getRepo() {
  return github<{ full_name: string; permissions?: Record<string, boolean> }>(
    "GET",
    REPO_PATH,
  );
}

export async function getIssue(number: number): Promise<GithubIssue | undefined> {
  try {
    return await github<GithubIssue>("GET", `${REPO_PATH}/issues/${number}`);
  } catch (error) {
    if (error instanceof HttpError && (error.status === 404 || error.status === 410)) {
      return undefined;
    }
    throw error;
  }
}

// Includes pull requests, like GitHub's issues API.
export function listIssues(query: string): Promise<GithubIssue[]> {
  return paginate<GithubIssue>(`${REPO_PATH}/issues?per_page=100&${query}`);
}

export function createIssue(input: { title: string; body: string; labels: string[] }) {
  return github<GithubIssue>("POST", `${REPO_PATH}/issues`, input);
}

export function updateIssue(number: number, patch: GithubIssuePatch) {
  return github<GithubIssue>("PATCH", `${REPO_PATH}/issues/${number}`, patch);
}

export function addLabels(number: number, labels: string[]) {
  return github<unknown>("POST", `${REPO_PATH}/issues/${number}/labels`, { labels });
}

export function updatePullRequestTitle(number: number, title: string) {
  return github<unknown>("PATCH", `${REPO_PATH}/pulls/${number}`, { title });
}

export function listLabels(): Promise<GithubLabel[]> {
  return paginate<GithubLabel>(`${REPO_PATH}/labels?per_page=100`);
}

export function createLabel(input: GithubLabel) {
  return github<GithubLabel>("POST", `${REPO_PATH}/labels`, input);
}

export function renameLabel(name: string, newName: string) {
  return github<GithubLabel>("PATCH", `${REPO_PATH}/labels/${label(name)}`, {
    new_name: newName,
  });
}

export function deleteLabel(name: string) {
  return github<void>("DELETE", `${REPO_PATH}/labels/${label(name)}`);
}
