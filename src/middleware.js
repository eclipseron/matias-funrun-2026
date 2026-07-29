import { NextResponse } from 'next/server';

const ALLOWED_HOSTS = [
  'matias-funrun.my.id',
  'www.matias-funrun.my.id',
  'localhost',
  'localhost:3000',
];

export function middleware(request) {
  const host = request.headers.get('host');
  if (!ALLOWED_HOSTS.includes(host)) {
    return new NextResponse('Forbidden', { status: 403 });
  }

// Admin route protection (migrasi dari proxy.js)
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

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
