import { defineMiddleware } from "astro:middleware";

const PROTECTED_PREFIX = "/work02";
const USER = "guest";
const REALM = "Protected Area";

export const onRequest = defineMiddleware(async (context, next) => {
  if (!context.url.pathname.startsWith(PROTECTED_PREFIX)) {
    return next();
  }

  const expected = import.meta.env.PRIVATE_PASSWORD ?? process.env.PRIVATE_PASSWORD;
  if (!expected) {
    return new Response("Server misconfiguration: PRIVATE_PASSWORD not set", {
      status: 500,
    });
  }

  const auth = context.request.headers.get("authorization");
  if (auth) {
    const [scheme, encoded] = auth.split(" ");
    if (scheme === "Basic" && encoded) {
      const [user, pass] = atob(encoded).split(":");
      if (user === USER && pass === expected) {
        return next();
      }
    }
  }

  return new Response("Authentication required", {
    status: 401,
    headers: { "WWW-Authenticate": `Basic realm="${REALM}"` },
  });
});
