import { JIRA_STATUS_IDS } from "./config.ts";
import * as github from "./github.ts";
import type { GithubIssue, GithubIssuePatch } from "./github.ts";
import * as jira from "./jira.ts";
import type { JiraIssue } from "./jira.ts";
import {
  githubLabels,
  githubState,
  jiraState,
  keyFromBody,
  merge,
  sameItems,
  type SyncLink,
  type SyncState,
} from "./model.ts";
import { githubBody, hashBody } from "./render.ts";

export type SyncOptions = { apply: boolean; createMissing: boolean };

let githubIndex: Promise<Map<string, number[]>> | undefined;

// Jira key → GitHub issues whose body points at it (sync marker or the old automation's link).
export function findGithubIssues(key: string): Promise<number[]> {
  githubIndex ??= github.listIssues("state=all").then((issues) => {
    const index = new Map<string, number[]>();
    for (const issue of issues) {
      const issueKey = issue.pull_request ? undefined : keyFromBody(issue.body);
      if (issueKey) {
        index.set(issueKey, [...(index.get(issueKey) ?? []), issue.number]);
      }
    }
    return index;
  });
  return githubIndex.then((index) => index.get(key) ?? []);
}

export async function syncIssue(issue: JiraIssue, options: SyncOptions): Promise<void> {
  const jiraNow = jiraState(issue);
  const body = githubBody(issue.key, issue.renderedFields?.description);
  const bodyHash = hashBody(body);
  const link = jira.readLink(issue) ?? (await linkExisting(issue.key));

  if (!link) {
    if (!options.createMissing || jiraNow.status === "done") {
      return;
    }
    const labels = githubLabels(jiraNow, []);
    console.log(`${issue.key}: create GitHub issue "${jiraNow.title}" [${labels.join(", ")}]`);
    if (options.apply) {
      const created = await github.createIssue({ title: jiraNow.title, body, labels });
      await jira.saveLink(
        issue.key,
        { issue: created.number, base: { ...jiraNow, bodyHash } },
        githubLinkInfo(created),
      );
      console.log(`${issue.key}: created #${created.number}`);
    }
    return;
  }

  const githubIssue = await github.getIssue(link.issue);
  if (!githubIssue || githubIssue.pull_request) {
    console.warn(`${issue.key}: GitHub #${link.issue} no longer exists, skipping`);
    return;
  }

  const githubNow = githubState(githubIssue);
  const merged = merge(jiraNow, githubNow, link.base);
  const jiraChanges = describeJiraChanges(jiraNow, merged);
  const githubPatch = buildGithubPatch(githubIssue, merged, {
    body,
    bodyChanged: link.base?.bodyHash !== bodyHash,
  });
  const nextLink: SyncLink = { issue: link.issue, base: { ...merged, bodyHash } };
  const linkChanged = JSON.stringify(link) !== JSON.stringify(nextLink);

  const summary = [
    jiraChanges.length ? `Jira ${jiraChanges.join(", ")}` : "",
    Object.keys(githubPatch).length ? `GitHub ${describeGithubPatch(githubPatch)}` : "",
  ].filter(Boolean);
  if (summary.length) {
    console.log(`${issue.key} ↔ #${link.issue}: ${summary.join(" | ")}`);
  }

  if (!options.apply) {
    return;
  }

  await jira.updateIssue(issue.key, {
    summary: merged.title !== jiraNow.title ? merged.title : undefined,
    addLabels: merged.labels.filter((label) => !jiraNow.labels.includes(label)),
    removeLabels: jiraNow.labels.filter((label) => !merged.labels.includes(label)),
  });
  if (merged.status !== jiraNow.status) {
    await jira.transitionIssue(issue.key, JIRA_STATUS_IDS[merged.status]);
  }
  const updated = Object.keys(githubPatch).length
    ? await github.updateIssue(link.issue, githubPatch)
    : githubIssue;
  if (linkChanged) {
    await jira.saveLink(issue.key, nextLink, githubLinkInfo(updated));
  }
}

async function linkExisting(key: string): Promise<SyncLink | undefined> {
  const numbers = await findGithubIssues(key);
  if (numbers.length === 0) {
    return undefined;
  }
  const issue = Math.min(...numbers);
  if (numbers.length > 1) {
    console.warn(`${key}: several GitHub issues point here (#${numbers.join(", #")}), using #${issue}`);
  }
  console.log(`${key}: link to existing GitHub #${issue}`);
  return { issue };
}

function buildGithubPatch(
  issue: GithubIssue,
  state: SyncState,
  { body, bodyChanged }: { body: string; bodyChanged: boolean },
): GithubIssuePatch {
  const patch: GithubIssuePatch = {};
  if (state.title !== issue.title) {
    patch.title = state.title;
  }
  const current = issue.labels.map((label) => label.name);
  const labels = githubLabels(state, current);
  if (!sameItems(labels, current)) {
    patch.labels = labels;
  }
  const open = state.status !== "done";
  if (open !== (issue.state === "open")) {
    patch.state = open ? "open" : "closed";
    patch.state_reason = open ? "reopened" : "completed";
  }
  if (bodyChanged && issue.body !== body) {
    patch.body = body;
  }
  return patch;
}

function describeJiraChanges(current: SyncState, next: SyncState): string[] {
  return [
    ...(next.title !== current.title ? [`title "${next.title}"`] : []),
    ...next.labels.filter((label) => !current.labels.includes(label)).map((label) => `+${label}`),
    ...current.labels.filter((label) => !next.labels.includes(label)).map((label) => `-${label}`),
    ...(next.status !== current.status ? [`status ${current.status} → ${next.status}`] : []),
  ];
}

function describeGithubPatch(patch: GithubIssuePatch): string {
  return [
    ...(patch.title !== undefined ? [`title "${patch.title}"`] : []),
    ...(patch.labels ? [`labels [${patch.labels.join(", ")}]`] : []),
    ...(patch.state ? [patch.state === "open" ? "reopen" : "close"] : []),
    ...(patch.body !== undefined ? ["description"] : []),
  ].join(", ");
}

function githubLinkInfo(issue: GithubIssue) {
  return { title: issue.title, url: issue.html_url, closed: issue.state === "closed" };
}
