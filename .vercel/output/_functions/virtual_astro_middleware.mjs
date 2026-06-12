import { d as defineMiddleware, s as sequence } from './chunks/sequence_Dkms2kb1.mjs';
import 'piccolore';
import 'clsx';

const PROTECTED_PREFIX = "/work02";
const USER = "guest";
const REALM = "Protected Area";
const onRequest$1 = defineMiddleware(async (context, next) => {
  if (!context.url.pathname.startsWith(PROTECTED_PREFIX)) {
    return next();
  }
  const expected = "test";
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
    headers: { "WWW-Authenticate": `Basic realm="${REALM}"` }
  });
});

const onRequest = sequence(
	
	onRequest$1
	
);

export { onRequest };
