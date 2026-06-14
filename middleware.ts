export const config = {
  matcher: ['/((?!api/|.*\\.).*)'],
};

export default function middleware(request: Request): Response | void {
  const cookieHeader = request.headers.get('Cookie') ?? '';
  const hasGroup = cookieHeader.split(';').some(c => c.trim().startsWith('ab_group='));

  if (hasGroup) return;

  const group = Math.random() < 0.5 ? 'A' : 'B';
  return new Response(null, {
    status: 302,
    headers: {
      Location: request.url,
      'Set-Cookie': `ab_group=${group}; Path=/; Max-Age=2592000; SameSite=Lax`,
    },
  });
}
