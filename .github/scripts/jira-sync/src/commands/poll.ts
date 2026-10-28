import { JIRA_PROJECT } from "../config.ts";
import * as jira from "../jira.ts";
import { syncIssue } from "../sync.ts";

const RECENT_WINDOW = "-60m";

export async function poll({
  apply,
  full,
  create,
}: {
  apply: boolean;
  full: boolean;
  create: boolean;
}): Promise<void> {
  const jql = full
    ? `project = ${JIRA_PROJECT} ORDER BY key ASC`
    : `project = ${JIRA_PROJECT} AND updated >= ${RECENT_WINDOW} ORDER BY updated ASC`;
  const tickets = await jira.searchIssues(jql, ["updated"]);
  console.log(`${tickets.length} ticket(s) to check${full ? "" : ` (updated in the last ${RECENT_WINDOW.slice(1)})`}`);

  const failures: string[] = [];
  for (const { key } of tickets) {
    try {
      const issue = await jira.getIssue(key);
      if (issue) {
        await syncIssue(issue, { apply, createMissing: create });
      }
    } catch (error) {
      failures.push(key);
      console.error(`${key}: ${error instanceof Error ? error.message : error}`);
    }
  }
  if (failures.length) {
    throw new Error(`Sync failed for ${failures.join(", ")}`);
  }
}

export async function syncOne(key: string, { apply }: { apply: boolean }): Promise<void> {
  const issue = await jira.getIssue(key);
  if (!issue) {
    throw new Error(`${key} not found`);
  }
  await syncIssue(issue, { apply, createMissing: false });
  console.log(`${key} checked`);
}
