import {
  GITHUB_ONLY_LABELS,
  JIRA_PROJECT,
  JIRA_STATUS_IDS,
  STATUS_LABELS,
} from "./config.ts";
import type { GithubIssue } from "./github.ts";
import type { JiraIssue } from "./jira.ts";

export type Status = keyof typeof JIRA_STATUS_IDS;

export type SyncState = { title: string; labels: string[]; status: Status };

export type SyncLink = {
  issue: number;
  base?: SyncState & { bodyHash: string };
};

const STATUS_BY_JIRA_ID = new Map(
  Object.entries(JIRA_STATUS_IDS).map(([status, id]) => [id as string, status as Status]),
);

const KEY_PATTERN = new RegExp(`\\b${JIRA_PROJECT}-\\d+\\b`, "gi");
const BODY_MARKER = new RegExp(`<!-- jira-sync: (${JIRA_PROJECT}-\\d+) -->`);
const LEGACY_BODY_LINK = new RegExp(`Link to Jira:\\s*\\S*/browse/(${JIRA_PROJECT}-\\d+)`);
const CLOSING_REFERENCE = /\b(?:close[sd]?|fix(?:e[sd])?|resolve[sd]?)\s*:?\s+#(\d+)\b/gi;

export function jiraState(issue: JiraIssue): SyncState {
  const status = STATUS_BY_JIRA_ID.get(issue.fields.status.id);
  if (!status) {
    throw new Error(
      `${issue.key} has unknown status "${issue.fields.status.name}" (${issue.fields.status.id})`,
    );
  }
  return { title: issue.fields.summary.trim(), labels: sorted(issue.fields.labels), status };
}

export function githubState(issue: GithubIssue): SyncState {
  const names = issue.labels.map((label) => label.name);
  return {
    title: issue.title.trim(),
    labels: sorted(names.filter((name) => !GITHUB_ONLY_LABELS.has(name))),
    status:
      issue.state === "closed"
        ? "done"
        : names.includes("in-review")
          ? "in-review"
          : names.includes("in-progress")
            ? "in-progress"
            : "todo",
  };
}

// 3-way merge against the last synced state. A field changed on one side wins;
// when both sides changed it, Jira wins. Labels merge as sets.
// Without a base (first sync) Jira wins, except labels, which are combined.
export function merge(jira: SyncState, github: SyncState, base?: SyncState): SyncState {
  if (!base) {
    return { ...jira, labels: sorted([...jira.labels, ...github.labels]) };
  }
  const pick = <T>(jiraValue: T, githubValue: T, baseValue: T) =>
    jiraValue === baseValue ? githubValue : jiraValue;
  const removed = base.labels.filter(
    (label) => !jira.labels.includes(label) || !github.labels.includes(label),
  );
  return {
    title: pick(jira.title, github.title, base.title),
    status: pick(jira.status, github.status, base.status),
    labels: sorted([...base.labels, ...jira.labels, ...github.labels]).filter(
      (label) => !removed.includes(label),
    ),
  };
}

export function githubLabels(state: SyncState, current: string[]): string[] {
  const keep = current.filter(
    (name) => GITHUB_ONLY_LABELS.has(name) && !isStatusLabel(name),
  );
  const status = STATUS_LABELS.find((name) => name === state.status);
  return sorted([...state.labels, ...keep, ...(status ? [status] : [])]);
}

export function keysIn(text: string | null | undefined): string[] {
  return sorted((text ?? "").match(KEY_PATTERN)?.map((key) => key.toUpperCase()) ?? []);
}

export function keyFromBody(body: string | null | undefined): string | undefined {
  return (body?.match(BODY_MARKER) ?? body?.match(LEGACY_BODY_LINK))?.[1];
}

// Like GitHub, ignore keywords inside code blocks, inline code and HTML comments.
export function closingIssueNumbers(body: string | null | undefined): number[] {
  const text = (body ?? "")
    .replace(/```[\s\S]*?```/g, "")
    .replace(/`[^`\n]*`/g, "")
    .replace(/<!--[\s\S]*?-->/g, "");
  return [...text.matchAll(CLOSING_REFERENCE)].map((match) => Number(match[1]));
}

export function sameItems(a: string[], b: string[]): boolean {
  return sorted(a).join("\n") === sorted(b).join("\n");
}

function isStatusLabel(name: string): boolean {
  return (STATUS_LABELS as readonly string[]).includes(name);
}

function sorted(values: string[]): string[] {
  return [...new Set(values)].sort();
}
