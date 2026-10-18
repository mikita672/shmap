import profileTemplate from "./profile.html";

export default {
  async fetch(): Promise<Response> {
    return new Response(profileTemplate, {
      headers: { "Content-Type": "text/html; charset=utf-8" },
    });
  },
} satisfies ExportedHandler<Env>;
