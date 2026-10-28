import { JIRA_PROJECT } from "../config.ts";
import * as github from "../github.ts";
import * as jira from "../jira.ts";

// One-off move to the label names shared by Jira and GitHub.
const GITHUB_RENAMES: Record<string, string> = {
  "type: feat": "feat",
  "type: fix": "fix",
  "type: chore": "chore",
  "type: refactor": "refactor",
  "scope: mobile": "mobile",
  "scope: backend": "backend",
  "scope: ops": "ops",
  "scope: database": "database",
};
const GITHUB_SPLITS: Record<string, string[]> = {
  "scope: fullstack": ["mobile", "backend"],
};
const GITHUB_NEW_LABELS: github.GithubLabel[] = [
  { name: "in-progress", color: "fbca04", description: "Jira status: W toku" },
  { name: "in-review", color: "8250df", description: "Jira status: W trakcie weryfikacji" },
];
const JIRA_RENAMES: Record<string, string> = {
  dev: "feat",
  frontend: "mobile",
  docker: "ops",
};

export async function migrateLabels({ apply }: { apply: boolean }): Promise<void> {
  const existing = new Set((await github.listLabels()).map((label) => label.name));

  for (const [from, to] of Object.entries(GITHUB_RENAMES)) {
    if (!existing.has(from)) {
      continue;
    }
    if (!existing.has(to)) {
      console.log(`GitHub: rename "${from}" → "${to}"`);
      if (apply) {
        await github.renameLabel(from, to);
      }
      existing.add(to);
      continue;
    }
    await moveLabel(from, [to], apply);
  }

  for (const [from, to] of Object.entries(GITHUB_SPLITS)) {
    if (existing.has(from)) {
      await moveLabel(from, to, apply);
    }
  }

  for (const label of GITHUB_NEW_LABELS) {
    if (!existing.has(label.name)) {
      console.log(`GitHub: create "${label.name}"`);
      if (apply) {
        await github.createLabel(label);
      }
    }
  }

  for (const [from, to] of Object.entries(JIRA_RENAMES)) {
    const issues = await jira.searchIssues(
      `project = ${JIRA_PROJECT} AND labels = "${from}" ORDER BY key ASC`,
      ["labels"],
    );
    if (issues.length === 0) {
      continue;
    }
    console.log(`Jira: "${from}" → "${to}" on ${issues.map((issue) => issue.key).join(", ")}`);
    if (apply) {
      for (const issue of issues) {
        await jira.updateIssue(issue.key, { removeLabels: [from], addLabels: [to] });
      }
    }
  }
}

async function moveLabel(from: string, to: string[], apply: boolean): Promise<void> {
  const items = await github.listIssues(`state=all&labels=${encodeURIComponent(from)}`);
  const numbers = items.map((item) => `#${item.number}`).join(", ") || "nothing";
  console.log(`GitHub: "${from}" → [${to.join(", ")}] on ${numbers}, then delete "${from}"`);
  if (!apply) {
    return;
  }
  for (const item of items) {
    await github.addLabels(item.number, to);
  }
  await github.deleteLabel(from);
}
