import { NextResponse } from 'next/server';

export function proxy(request) {
  const { pathname } = request.nextUrl;

  // Protect admin routes except login and api endpoints
  if (pathname.startsWith('/admin') && pathname !== '/admin/login') {
    const sessionCookie = request.cookies.get('admin_session');

    if (!sessionCookie) {
      // Redirect to admin login if session cookie is not present
      const loginUrl = new URL('/admin/login', request.url);
      // Optional: keep the original path as redirect target
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  // Run middleware on all administration pages
  matcher: ['/admin/:path*'],
};
