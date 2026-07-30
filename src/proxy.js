import { NextResponse } from 'next/server';

const ALLOWED_HOSTS = [
  'matias-funrun.my.id',
  'www.matias-funrun.my.id',
  'localhost',
  'localhost:3000',
  '127.0.0.1',
  '127.0.0.1:3000'
];

export function middleware(request) {
  // 1. Host Header Validation
  const host = request.headers.get('host');
  if (host && !ALLOWED_HOSTS.includes(host)) {
    return new NextResponse('Forbidden', { status: 403 });
  }

  // 2. Admin route protection
  const { pathname } = request.nextUrl;
  if (pathname.startsWith('/admin') && pathname !== '/admin/login') {
    const sessionCookie = request.cookies.get('admin_session');
    
    if (!sessionCookie) {
      const loginUrl = new URL('/admin/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

// Fallback for new proxy export convention
export const proxy = middleware;

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'],
};
