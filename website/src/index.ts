import profileTemplate from "./profile.html";

const PROFILE_PATH = /^\/u\/([A-Za-z0-9_.-]{3,30})\/?$/;
const CARD_TIMEOUT_MS = 2500;

type ProfileCard = {
  username: string;
  firstName: string | null;
  lastName: string | null;
  avatarUrl: string | null;
};

type CardResult =
  | { status: "found"; card: ProfileCard }
  | { status: "not-found" }
  | { status: "unavailable" };

export default {
  async fetch(request, env): Promise<Response> {
    const url = new URL(request.url);
    const match = url.pathname.match(PROFILE_PATH);
    if (!match) {
      return env.ASSETS.fetch(request);
    }

    const result = await fetchProfileCard(env, match[1]);
    if (result.status === "not-found") {
      return env.ASSETS.fetch(request);
    }

    return renderProfile(
      url.origin,
      match[1],
      result.status === "found" ? result.card : null,
    );
  },
} satisfies ExportedHandler<Env>;

async function fetchProfileCard(
  env: Env,
  username: string,
): Promise<CardResult> {
  try {
    const response = await fetch(
      `${env.API_BASE_URL}/api/v1/public/profiles/${username}`,
      { signal: AbortSignal.timeout(CARD_TIMEOUT_MS) },
    );

    if (response.ok) {
      return { status: "found", card: await response.json<ProfileCard>() };
    }

    if (response.status === 404) {
      const error = await response.json<{ code?: string }>();
      if (error.code === "USER_NOT_FOUND") {
        return { status: "not-found" };
      }
    }

    console.warn(`Profile card request failed with ${response.status}`);
    return { status: "unavailable" };
  } catch (error) {
    console.warn("Profile card request failed", error);
    return { status: "unavailable" };
  }
}

function renderProfile(
  origin: string,
  username: string,
  card: ProfileCard | null,
): Response {
  const handle = `@${card?.username ?? username}`;
  const name = [card?.firstName, card?.lastName]
    .filter(Boolean)
    .join(" ")
    .trim();
  const title = name ? `${name} (${handle}) on Shmap` : `${handle} on Shmap`;
  const avatarUrl = card?.avatarUrl;

  const page = new Response(profileTemplate, {
    headers: { "Content-Type": "text/html; charset=utf-8" },
  });

  return new HTMLRewriter()
    .on("title", {
      element(element) {
        element.setInnerContent(title);
      },
    })
    .on('meta[property="og:title"]', {
      element(element) {
        element.setAttribute("content", title);
      },
    })
    .on('meta[property="og:url"]', {
      element(element) {
        element.setAttribute("content", `${origin}/u/${username}`);
      },
    })
    .on('meta[property="og:image"]', {
      element(element) {
        if (avatarUrl) {
          element.setAttribute("content", avatarUrl);
        } else {
          element.remove();
        }
      },
    })
    .on("#name", {
      element(element) {
        element.setInnerContent(name || handle);
      },
    })
    .on("#username", {
      element(element) {
        if (name) {
          element.setInnerContent(handle);
        } else {
          element.remove();
        }
      },
    })
    .on(".avatar svg", {
      element(element) {
        if (avatarUrl) {
          element.remove();
        }
      },
    })
    .on("#avatar-image", {
      element(element) {
        if (avatarUrl) {
          element.setAttribute("src", avatarUrl);
          element.removeAttribute("hidden");
        } else {
          element.remove();
        }
      },
    })
    .on("#open-link", {
      element(element) {
        element.setAttribute("href", `shmap://u/${username}`);
      },
    })
    .transform(page);
}
