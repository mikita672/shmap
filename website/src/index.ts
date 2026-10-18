import QRCode from "qrcode";

import profileTemplate from "./profile.html";

const PROFILE_PATH = /^\/u\/([A-Za-z0-9_.-]{3,30})\/?$/;
const CARD_TIMEOUT_MS = 2500;
const CARD_CACHE_TTL_BY_STATUS = { "200-299": 300, "404": 60, "500-599": 0 };
const PAGE_CACHE_CONTROL = "public, max-age=60";

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
      {
        signal: AbortSignal.timeout(CARD_TIMEOUT_MS),
        cf: {
          cacheEverything: true,
          cacheTtlByStatus: CARD_CACHE_TTL_BY_STATUS,
        },
      },
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

async function renderProfile(
  origin: string,
  username: string,
  card: ProfileCard | null,
): Promise<Response> {
  const profileUrl = `${origin}/u/${username}`;
  const qrSvg = await QRCode.toString(profileUrl, {
    type: "svg",
    margin: 0,
    color: { light: "#0000" },
  });
  const handle = `@${card?.username ?? username}`;
  const name = [card?.firstName, card?.lastName]
    .filter(Boolean)
    .join(" ")
    .trim();
  const title = name ? `${name} (${handle}) on Shmap` : `${handle} on Shmap`;
  const avatarUrl = card?.avatarUrl;

  const page = new Response(profileTemplate, {
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Cache-Control": PAGE_CACHE_CONTROL,
    },
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
        element.setAttribute("content", profileUrl);
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
    .on("#qr-code", {
      element(element) {
        element.setAttribute("aria-label", `QR code linking to ${profileUrl}`);
        element.setInnerContent(qrSvg, { html: true });
      },
    })
    .transform(page);
}
