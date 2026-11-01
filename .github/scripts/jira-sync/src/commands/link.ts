import { JIRA_PROJECT, JIRA_STATUS_IDS } from "../config.ts";
import * as github from "../github.ts";
import * as jira from "../jira.ts";
import { keyFromBody } from "../model.ts";

export async function linkOne(
  key: string,
  number: number,
  { apply }: { apply: boolean },
): Promise<void> {
  const [ticket, issue] = await Promise.all([jira.getIssue(key), github.getIssue(number)]);
  if (!ticket || !issue || issue.pull_request) {
    throw new Error(`${ticket ? `#${number} isn't an issue` : `${key} not found`}`);
  }
  const current = jira.readLink(ticket)?.issue;
  console.log(`${key} → #${number}${current ? ` (was #${current})` : ""}`);
  if (apply) {
    await jira.saveLink(key, { issue: number }, {
      title: issue.title,
      url: issue.html_url,
      closed: issue.state === "closed",
    });
  }
}

// One-off: connect tickets to the GitHub issues that already exist for them.
export async function link({ apply }: { apply: boolean }): Promise<void> {
  const tickets = await jira.searchIssues(`project = ${JIRA_PROJECT} ORDER BY key ASC`);
  const issues = (await github.listIssues("state=all")).filter((issue) => !issue.pull_request);

  const linked = new Set(tickets.flatMap((ticket) => jira.readLink(ticket)?.issue ?? []));
  const byKey = new Map<string, github.GithubIssue[]>();
  for (const issue of issues) {
    const key = keyFromBody(issue.body);
    if (key) {
      byKey.set(key, [...(byKey.get(key) ?? []), issue]);
    }
  }
  const unkeyed = issues.filter((issue) => !keyFromBody(issue.body) && !linked.has(issue.number));

  const notFound: string[] = [];
  for (const ticket of tickets) {
    if (jira.readLink(ticket)) {
      continue;
    }
    const byBody = (byKey.get(ticket.key) ?? []).sort((a, b) => a.number - b.number);
    const byTitle = unkeyed.filter((issue) => sameTitle(issue.title, ticket.fields.summary));
    const match = byBody[0] ?? (byTitle.length === 1 ? byTitle[0] : undefined);

    if (!match) {
      const done = ticket.fields.status.id === JIRA_STATUS_IDS.done;
      notFound.push(
        `${ticket.key} "${ticket.fields.summary}"${done ? "" : " (open: the sync will create its GitHub issue)"}` +
          (byTitle.length > 1 ? ` (same title as #${byTitle.map((i) => i.number).join(", #")})` : ""),
      );
      continue;
    }

    const how = byBody[0] ? "body link" : "same title";
    const extra = byBody.slice(1).map((issue) => `#${issue.number}`);
    console.log(
      `${ticket.key} → #${match.number} (${how})${extra.length ? `, duplicates: ${extra.join(", ")}` : ""}`,
    );
    linked.add(match.number);
    if (unkeyed.includes(match)) {
      unkeyed.splice(unkeyed.indexOf(match), 1);
    }
    if (apply) {
      await jira.saveLink(ticket.key, { issue: match.number }, {
        title: match.title,
        url: match.html_url,
        closed: match.state === "closed",
      });
    }
  }

  if (notFound.length) {
    console.log(`\nTickets without a GitHub issue (${notFound.length}):\n  ${notFound.join("\n  ")}`);
  }
  const orphans = issues.filter((issue) => !linked.has(issue.number) && !keyFromBody(issue.body));
  if (orphans.length) {
    console.log(
      `\nGitHub issues without a ticket (${orphans.length}):\n  ` +
        orphans.map((issue) => `#${issue.number} [${issue.state}] "${issue.title}"`).join("\n  "),
    );
  }
}

function sameTitle(a: string, b: string): boolean {
  const normalize = (title: string) => title.trim().toLowerCase().replace(/\s+/g, " ");
  return normalize(a) === normalize(b);
}
