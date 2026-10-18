import profileTemplate from "./profile.html";

const PROFILE_PATH = /^\/u\/([A-Za-z0-9_.-]{3,30})\/?$/;

export default {
  async fetch(request, env): Promise<Response> {
    const match = new URL(request.url).pathname.match(PROFILE_PATH);
    if (!match) {
      return env.ASSETS.fetch(request);
    }

    return renderProfile(match[1]);
  },
} satisfies ExportedHandler<Env>;

function renderProfile(username: string): Response {
  const page = new Response(profileTemplate, {
    headers: { "Content-Type": "text/html; charset=utf-8" },
  });

  return new HTMLRewriter()
    .on("title", {
      element(element) {
        element.setInnerContent(`@${username} on Shmap`);
      },
    })
    .on("#name", {
      element(element) {
        element.setInnerContent(`@${username}`);
      },
    })
    .on("#username", {
      element(element) {
        element.remove();
      },
    })
    .on("#open-link", {
      element(element) {
        element.setAttribute("href", `shmap://u/${username}`);
      },
    })
    .transform(page);
}
