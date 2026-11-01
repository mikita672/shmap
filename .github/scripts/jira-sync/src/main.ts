import { check } from "./commands/check.ts";
import { handleEvent } from "./commands/event.ts";
import { link, linkOne } from "./commands/link.ts";
import { migrateLabels } from "./commands/migrate-labels.ts";
import { poll, syncOne } from "./commands/poll.ts";

const USAGE = `Usage: npm run sync -- <command> [--apply]

  check                    test the Jira and GitHub tokens
  migrate-labels           one-off: rename labels to the shared names
  link [<KEY> <number>]    connect tickets to existing GitHub issues (or one pair)
  sync <KEY>               sync one ticket
  poll [--full] [--no-create]
                           sync tickets changed in the last hour (--full: all tickets)
  event [--event-name <name> --event-path <file>]
                           handle a GitHub issues / pull_request event

Without --apply nothing is written; the planned changes are printed.`;

const [command, ...rest] = process.argv.slice(2).filter(Boolean);
const flags = new Set(rest.filter((arg) => arg.startsWith("--")));
const option = (name: string) => {
  const index = rest.indexOf(name);
  return index === -1 ? undefined : rest[index + 1];
};
const apply = flags.has("--apply");

if (!apply && command && command !== "check") {
  console.log("Dry run: nothing will be changed (add --apply to write).\n");
}

try {
  switch (command) {
    case "check":
      await check();
      break;
    case "migrate-labels":
      await migrateLabels({ apply });
      break;
    case "link": {
      const [key, number] = rest.filter((arg) => !arg.startsWith("--"));
      if (key && Number(number) > 0) {
        await linkOne(key.toUpperCase(), Number(number), { apply });
      } else {
        await link({ apply });
      }
      break;
    }
    case "sync": {
      const key = rest.find((arg) => !arg.startsWith("--"));
      if (!key) {
        throw new Error("sync needs a ticket key, e.g. sync SCRUM-110");
      }
      await syncOne(key.toUpperCase(), { apply });
      break;
    }
    case "poll":
      await poll({ apply, full: flags.has("--full"), create: !flags.has("--no-create") });
      break;
    case "event":
      await handleEvent({
        apply,
        eventName: option("--event-name"),
        eventPath: option("--event-path"),
      });
      break;
    default:
      console.log(USAGE);
      process.exitCode = command ? 1 : 0;
  }
} catch (error) {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
}
