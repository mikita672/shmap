import {
  GITHUB_REPO,
  JIRA_API_URL,
  JIRA_PROJECT,
  SYNC_PROPERTY,
  requireEnv,
} from "./config.ts";
import { HttpError, request } from "./http.ts";
import type { SyncLink } from "./model.ts";

export type JiraIssue = {
  id: string;
  key: string;
  fields: {
    summary: string;
    status: { id: string; name: string };
    labels: string[];
  };
  renderedFields?: { description?: string | null };
  properties?: Record<string, unknown>;
};

const ISSUE_FIELDS = ["summary", "status", "labels", "description"];

function headers(): Record<string, string> {
  const credentials = `${requireEnv("JIRA_EMAIL")}:${requireEnv("JIRA_API_TOKEN")}`;
  return {
    Authorization: `Basic ${Buffer.from(credentials).toString("base64")}`,
    Accept: "application/json",
  };
}

async function jira<T>(method: string, path: string, body?: unknown): Promise<T> {
  const { data } = await request<T>(`${JIRA_API_URL}${path}`, {
    method,
    headers: headers(),
    body,
  });
  return data;
}

export function getMyself() {
  return jira<{ accountId: string; displayName: string }>("GET", "/rest/api/3/myself");
}

export function getProject() {
  return jira<{ key: string; name: string }>("GET", `/rest/api/3/project/${JIRA_PROJECT}`);
}

// Search results can lag behind recent edits, so sync code re-reads each issue with getIssue.
export async function searchIssues(
  jql: string,
  fields: string[] = ["summary", "status", "labels"],
): Promise<JiraIssue[]> {
  const issues: JiraIssue[] = [];
  let nextPageToken: string | undefined;
  do {
    const page = await jira<{ issues: JiraIssue[]; nextPageToken?: string | null }>(
      "POST",
      "/rest/api/3/search/jql",
      { jql, fields, properties: [SYNC_PROPERTY], maxResults: 100, nextPageToken },
    );
    issues.push(...page.issues);
    nextPageToken = page.nextPageToken ?? undefined;
  } while (nextPageToken);
  return issues;
}

export async function getIssue(key: string): Promise<JiraIssue | undefined> {
  const query = new URLSearchParams({
    fields: ISSUE_FIELDS.join(","),
    expand: "renderedFields",
    properties: SYNC_PROPERTY,
  });
  try {
    return await jira<JiraIssue>("GET", `/rest/api/3/issue/${key}?${query}`);
  } catch (error) {
    if (error instanceof HttpError && error.status === 404) {
      return undefined;
    }
    throw error;
  }
}

export function readLink(issue: JiraIssue): SyncLink | undefined {
  const value = issue.properties?.[SYNC_PROPERTY] as SyncLink | undefined;
  return typeof value?.issue === "number" ? value : undefined;
}

export async function updateIssue(
  key: string,
  change: { summary?: string; addLabels?: string[]; removeLabels?: string[] },
): Promise<void> {
  const labels = [
    ...(change.removeLabels ?? []).map((label) => ({ remove: label })),
    ...(change.addLabels ?? []).map((label) => ({ add: label })),
  ];
  if (change.summary === undefined && labels.length === 0) {
    return;
  }
  await jira<void>("PUT", `/rest/api/3/issue/${key}`, {
    fields: change.summary === undefined ? {} : { summary: change.summary },
    update: labels.length === 0 ? {} : { labels },
  });
}

export async function transitionIssue(key: string, statusId: string): Promise<void> {
  const { transitions } = await jira<{
    transitions: { id: string; to: { id: string } }[];
  }>("GET", `/rest/api/3/issue/${key}/transitions`);
  const transition = transitions.find((candidate) => candidate.to.id === statusId);
  if (!transition) {
    throw new Error(`${key} has no transition to status ${statusId}`);
  }
  await jira<void>("POST", `/rest/api/3/issue/${key}/transitions`, {
    transition: { id: transition.id },
  });
}

export async function saveLink(
  key: string,
  link: SyncLink,
  github: { title: string; url: string; closed: boolean },
): Promise<void> {
  await jira<void>("PUT", `/rest/api/3/issue/${key}/properties/${SYNC_PROPERTY}`, link);
  await jira<void>("POST", `/rest/api/3/issue/${key}/remotelink`, {
    globalId: `github-issue:${GITHUB_REPO}#${link.issue}`,
    application: { type: "com.github", name: "GitHub" },
    object: {
      url: github.url,
      title: `GitHub #${link.issue}`,
      summary: github.title,
      icon: { url16x16: "https://github.com/favicon.ico", title: "GitHub" },
      status: { resolved: github.closed },
    },
  });
}
