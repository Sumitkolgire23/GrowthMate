import { NextResponse, type NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('growthmate_session')?.value;

  const url = request.nextUrl.clone();
  const path = url.pathname;

  // Protected pages list
  const isProtectedRoute = 
    path.startsWith('/dashboard') ||
    path.startsWith('/quests') ||
    path.startsWith('/skill-tree') ||
    path.startsWith('/progress') ||
    path.startsWith('/settings') ||
    path.startsWith('/assessment');

  if (isProtectedRoute && !token) {
    url.pathname = '/login';
    return NextResponse.redirect(url);
  }

  // Redirect to dashboard if logged in and trying to access auth pages
  if ((path.startsWith('/login') || path.startsWith('/signup')) && token) {
    url.pathname = '/dashboard';
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
