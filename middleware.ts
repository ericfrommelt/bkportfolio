// middleware.ts
export const config = {
  matcher: '/work02/:path*', // the directory to protect
};

export default function middleware(request: Request) {
  const auth = request.headers.get('authorization');
  const USER = 'guest';
  const PASS = process.env.PRIVATE_PASSWORD;

  if (auth) {
    const [scheme, encoded] = auth.split(' ');
    if (scheme === 'Basic' && encoded) {
      const [user, pass] = atob(encoded).split(':');
      if (user === USER && pass === PASS) {
        return; // allow request through
      }
    }
  }

  return new Response('Authentication required', {
    status: 401,
    headers: { 'WWW-Authenticate': 'Basic realm="Protected Area"' },
  });
}