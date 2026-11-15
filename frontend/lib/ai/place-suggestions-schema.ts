import { z } from "zod";

export const PlaceSuggestionsReplySchema = z.object({
  suggestions: z
    .array(
      z.object({
        candidateId: z
          .string()
          .describe("The id of one candidate from the list, for example c12"),
        reason: z
          .string()
          .describe("One short English sentence on why this place fits the group"),
      }),
    )
    .describe("Up to 8 picks from the candidate list, best first"),
});

export type PlaceSuggestionsReply = z.infer<typeof PlaceSuggestionsReplySchema>;
