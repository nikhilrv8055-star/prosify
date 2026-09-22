import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const host = request.headers.get('host') || '';
  const url = request.nextUrl.clone();

  // Check if accessing via admin domain or subdomain
  const isAdminHost =
    host === 'admin.example.com' ||
    host.startsWith('admin.') ||
    url.searchParams.get('subdomain') === 'admin' ||
    url.searchParams.get('domain') === 'admin.example.com';

  // If request is directed to admin domain
  if (isAdminHost) {
    // When accessing root on admin.example.com, route directly to the admin application
    if (url.pathname === '/') {
      url.pathname = '/admin';
      return NextResponse.rewrite(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
