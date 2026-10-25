/**
 * GitHub OAuth step 1 — redirect the CMS login popup to GitHub.
 *
 * Decap CMS reaches this endpoint because `public/admin/config.yml` sets
 * `backend.auth_endpoint: /auth`. The whole flow needs this Function plus
 * `/callback` and a GitHub OAuth app whose authorization callback URL is
 * `https://<domain>/callback`.
 */
const FALLBACK_CLIENT_ID = "Ov23liuBf0DK6It6qYJ9";

/** Public origin of the deployment (`request.url` may be internal behind a proxy). */
function originOf(request, env) {
  return env.SITE_ORIGIN || new URL(request.url).origin;
}

export function onRequestGet({ request, env }) {
  const origin = originOf(request, env);
  const url = new URL(request.url);
  const state = url.searchParams.get("state") || crypto.randomUUID();
  const scope = url.searchParams.get("scope") || "repo";

  const github = new URL("https://github.com/login/oauth/authorize");
  github.searchParams.set(
    "client_id",
    env.GITHUB_CLIENT_ID || FALLBACK_CLIENT_ID
  );
  github.searchParams.set("redirect_uri", `${origin}/callback`);
  github.searchParams.set("scope", scope);
  github.searchParams.set("state", state);
  return Response.redirect(github.toString(), 302);
}
