import { readFile } from "node:fs/promises";

import { GITHUB_REPO, JIRA_STATUS_IDS } from "../config.ts";
import * as github from "../github.ts";
import type { GithubIssue } from "../github.ts";
import * as jira from "../jira.ts";
import { closingIssueNumbers, jiraState, keyFromBody, keysIn, type Status } from "../model.ts";
import { syncIssue } from "../sync.ts";

type PullRequest = {
  number: number;
  title: string;
  body: string | null;
  draft: boolean;
  merged: boolean;
  head: { ref: string; repo: { full_name: string } | null };
};

type Options = { apply: boolean; eventName?: string; eventPath?: string };

export async function handleEvent({ apply, eventName, eventPath }: Options): Promise<void> {
  const name = eventName ?? process.env.GITHUB_EVENT_NAME;
  const path = eventPath ?? process.env.GITHUB_EVENT_PATH;
  if (!name || !path) {
    throw new Error("Pass --event-name and --event-path, or run inside GitHub Actions.");
  }
  const payload = JSON.parse(await readFile(path, "utf8"));

  if (name === "issues") {
    await handleIssue(payload.action, payload.issue, apply);
  } else if (name === "pull_request") {
    await handlePullRequest(payload.action, payload.pull_request, apply);
  } else {
    console.log(`Nothing to do for ${name} events`);
  }
}

async function handleIssue(action: string, issue: GithubIssue, apply: boolean): Promise<void> {
  const key = keyFromBody(issue.body);
  if (issue.pull_request || !key) {
    console.log(`#${issue.number} isn't linked to a Jira ticket`);
    return;
  }
  const ticket = await jira.getIssue(key);
  const linkedTo = ticket && jira.readLink(ticket)?.issue;
  if (!ticket || (linkedTo !== undefined && linkedTo !== issue.number)) {
    console.log(`#${issue.number} points at ${key}, but ${key} is ${ticket ? `linked to #${linkedTo}` : "gone"}`);
    return;
  }
  console.log(`#${issue.number} ${action} → checking ${key}`);
  await syncIssue(ticket, { apply, createMissing: false });
}

async function handlePullRequest(
  action: string,
  pullRequest: PullRequest,
  apply: boolean,
): Promise<void> {
  if (pullRequest.head.repo?.full_name !== GITHUB_REPO) {
    console.log(`PR #${pullRequest.number} comes from a fork, skipping`);
    return;
  }
  const status = statusForPullRequest(action, pullRequest);
  const keys = await ticketsOf(pullRequest);
  if (!status || keys.length === 0) {
    console.log(`PR #${pullRequest.number} ${action}: no ticket status to change`);
    return;
  }

  for (const key of keys) {
    const ticket = await jira.getIssue(key);
    if (!ticket) {
      console.warn(`${key} (from PR #${pullRequest.number}) not found`);
      continue;
    }
    if (jiraState(ticket).status !== status) {
      console.log(`${key}: status → ${status} (PR #${pullRequest.number} ${action})`);
      if (apply) {
        await jira.transitionIssue(key, JIRA_STATUS_IDS[status]);
      }
    }
    const fresh = apply ? await jira.getIssue(key) : ticket;
    if (fresh) {
      await syncIssue(fresh, { apply, createMissing: false });
    }
  }

  const titleHasKey = keysIn(pullRequest.title).length > 0 || keysIn(pullRequest.head.ref).length > 0;
  if (action === "opened" && !titleHasKey) {
    const title = `${keys.join(" ")} ${pullRequest.title}`;
    console.log(`PR #${pullRequest.number}: title → "${title}"`);
    if (apply) {
      await github.updatePullRequestTitle(pullRequest.number, title);
    }
  }
}

function statusForPullRequest(action: string, pullRequest: PullRequest): Status | undefined {
  switch (action) {
    case "opened":
    case "reopened":
    case "ready_for_review":
      return pullRequest.draft ? "in-progress" : "in-review";
    case "converted_to_draft":
      return "in-progress";
    case "closed":
      return pullRequest.merged ? "done" : undefined;
    default:
      return undefined;
  }
}

// Tickets named in the title or branch, plus tickets of issues the PR closes ("Closes #12").
async function ticketsOf(pullRequest: PullRequest): Promise<string[]> {
  const keys = new Set([...keysIn(pullRequest.title), ...keysIn(pullRequest.head.ref)]);
  for (const number of closingIssueNumbers(pullRequest.body)) {
    const key = keyFromBody((await github.getIssue(number))?.body);
    if (key) {
      keys.add(key);
    }
  }
  return [...keys].sort();
}
