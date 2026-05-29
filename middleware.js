export const config = {
  matcher: '/:path*',
};

export default function middleware(req) {
  const basicAuth = req.headers.get('authorization');

  if (basicAuth) {
    const [scheme, encoded] = basicAuth.split(' ');
    if (scheme === 'Basic' && encoded) {
      const decoded = atob(encoded);
      const colonIdx = decoded.indexOf(':');
      const user = decoded.substring(0, colonIdx);
      const pass = decoded.substring(colonIdx + 1);

      const validUser = process.env.BASIC_AUTH_USER ?? 'snackmap';
      const validPass = process.env.BASIC_AUTH_PASS ?? 'ops2025';

      if (user === validUser && pass === validPass) {
        return;
      }
    }
  }

  return new Response('認証が必要です', {
    status: 401,
    headers: {
      'WWW-Authenticate': 'Basic realm="Snack Map Ops"',
    },
  });
}
