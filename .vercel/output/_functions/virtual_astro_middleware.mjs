import { d as defineMiddleware, s as sequence } from './chunks/sequence_Dkms2kb1.mjs';
import 'piccolore';
import 'clsx';

const PROTECTED_PREFIX = "/work02";
const REALM = "Protected Area";
const onRequest$1 = defineMiddleware(async (context, next) => {
  if (!context.url.pathname.startsWith(PROTECTED_PREFIX)) {
    return next();
  }
  const fromMeta = "letmein";
  typeof process !== "undefined" ? process.env?.PRIVATE_PASSWORD : void 0;
  const expected = (fromMeta).trim();
  if (!expected) {
    return new Response("Server misconfiguration: PRIVATE_PASSWORD not set", {
      status: 500
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
    headers: { "WWW-Authenticate": `Basic realm="${REALM}"` }
  });
});

const onRequest = sequence(
	
	onRequest$1
	
);

export { onRequest };
