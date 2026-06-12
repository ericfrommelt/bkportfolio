import { defineMiddleware } from "astro:middleware";

const PROTECTED_PREFIX = "/work02";
const REALM = "Protected Area";

export const onRequest = defineMiddleware(async (context, next) => {
  if (!context.url.pathname.startsWith(PROTECTED_PREFIX)) {
    return next();
  }

  const expected = (process.env.PRIVATE_PASSWORD ?? "").trim();
  if (!expected) {
    return new Response("Server misconfiguration: PRIVATE_PASSWORD not set", {
      status: 500,
    });
  }

  const auth = context.request.headers.get("authorization");
  if (auth) {
    const [scheme, encoded] = auth.split(" ");
    if (scheme === "Basic" && encoded) {
      const decoded = atob(encoded);
      const idx = decoded.indexOf(":");
      const pass = (idx >= 0 ? decoded.slice(idx + 1) : decoded).trim();
      if (pass === expected) {
        return next();
      }
    }
  }

  return new Response("Authentication required", {
    status: 401,
    headers: { "WWW-Authenticate": `Basic realm="${REALM}"` },
  });
});
