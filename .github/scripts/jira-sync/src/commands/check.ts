import * as github from "../github.ts";
import * as jira from "../jira.ts";

export async function check(): Promise<void> {
  const [me, project] = await Promise.all([jira.getMyself(), jira.getProject()]);
  console.log(`Jira: signed in as ${me.displayName}, project ${project.key} "${project.name}"`);

  const repo = await github.getRepo();
  const canWrite = repo.permissions?.push ?? repo.permissions?.triage ?? "unknown";
  console.log(`GitHub: ${repo.full_name}, write access: ${canWrite}`);
}
