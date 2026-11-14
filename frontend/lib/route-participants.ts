import type { ProfileResponse, UserSummaryResponse } from "@/lib/types/api";

export interface ParticipantCandidate {
  id: number;
  name: string;
  subtitle: string;
  avatarUrl: string | null;
}

function toCandidate(user: UserSummaryResponse): ParticipantCandidate {
  return {
    id: user.id,
    name: `${user.firstName} ${user.lastName}`.trim() || user.username,
    subtitle: `@${user.username}`,
    avatarUrl: user.avatarUrl,
  };
}

export function getParticipantCandidates(
  me: ProfileResponse,
  members: UserSummaryResponse[],
  listed: UserSummaryResponse[],
): ParticipantCandidate[] {
  const memberIds = new Set([me.id, ...members.map((member) => member.id)]);
  const leavers = listed
    .filter((user) => !memberIds.has(user.id))
    .map((user) => ({ ...toCandidate(user), subtitle: "Left the chat" }));

  return [
    {
      id: me.id,
      name: "You",
      subtitle: `@${me.username}`,
      avatarUrl: me.avatarUrl,
    },
    ...members.map(toCandidate),
    ...leavers,
  ];
}
