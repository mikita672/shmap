import { createHash } from "node:crypto";

import TurndownService from "turndown";

import { JIRA_SITE } from "./config.ts";

const turndown = new TurndownService({
  headingStyle: "atx",
  codeBlockStyle: "fenced",
  bulletListMarker: "-",
});
turndown.keep(["table"]);
// Ticket links become plain keys; the repository autolink turns them into links.
turndown.addRule("ticket", {
  filter: (node) => node.nodeName === "SPAN" && node.hasAttribute("data-jira-key"),
  replacement: (_content, node) => node.getAttribute("data-jira-key") ?? "",
});
turndown.addRule("jiraIcon", {
  filter: (node) => node.nodeName === "IMG" && node.classList.contains("icon"),
  replacement: () => "",
});
turndown.addRule("strikethrough", {
  filter: ["del", "s"],
  replacement: (content) => `~~${content}~~`,
});

export function githubBody(key: string, descriptionHtml: string | null | undefined): string {
  const description = descriptionHtml
    ? turndown
        .turndown(descriptionHtml.replace(/(href|src)="\//g, `$1="${JIRA_SITE}/`))
        .replace(/\b([A-Z][A-Z0-9]+-\d+) ([,.;:])/g, "$1$2")
        .trim()
    : "";
  const footer = [
    `<sub>Synced from Jira [${key}](${JIRA_SITE}/browse/${key}). Edit the description there.</sub>`,
    `<!-- jira-sync: ${key} -->`,
  ].join("\n");
  return description ? `${description}\n\n---\n${footer}` : footer;
}

export function hashBody(body: string): string {
  return createHash("sha256").update(body).digest("hex").slice(0, 16);
}
