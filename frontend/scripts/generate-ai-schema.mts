import { mkdirSync, writeFileSync } from "node:fs";
import { z } from "zod";
import { PlaceSuggestionsReplySchema } from "../lib/ai/place-suggestions-schema.ts";

const target = new URL(
  "../../backend/src/main/resources/ai/place-suggestions.schema.json",
  import.meta.url,
);

mkdirSync(new URL(".", target), { recursive: true });
writeFileSync(
  target,
  JSON.stringify(z.toJSONSchema(PlaceSuggestionsReplySchema), null, 2) + "\n",
);
console.log(`Wrote ${target.pathname}`);
