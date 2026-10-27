import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const VENDOR_COOKIE_NAME = 'prosify_vendor_session';
const AGENT_COOKIE_NAME = 'prosify_agent_session';

function decodeSession(cookieValue?: string): { role?: string; status?: string } | null {
  if (!cookieValue) return null;
  try {
    const json = Buffer.from(cookieValue, 'base64').toString('utf-8');
    return JSON.parse(json);
  } catch {
    return null;
  }
}

export function middleware(request: NextRequest) {
  const host = request.headers.get('host') || '';
  const url = request.nextUrl.clone();
  const pathname = url.pathname.toLowerCase();

  // 1. Case-insensitive normalization
  if (pathname === '/vendor' && url.pathname !== '/vendor') {
    url.pathname = '/vendor';
    return NextResponse.redirect(url);
  }
  if (pathname === '/agent' && url.pathname !== '/agent') {
    url.pathname = '/agent';
    return NextResponse.redirect(url);
  }
  if (pathname === '/admin' && url.pathname !== '/admin') {
    url.pathname = '/admin';
    return NextResponse.redirect(url);
  }

  // 2. Decode Session Cookies
  const vendorCookie = request.cookies.get(VENDOR_COOKIE_NAME)?.value;
  const agentCookie = request.cookies.get(AGENT_COOKIE_NAME)?.value;
  const vendorSession = decodeSession(vendorCookie);
  const agentSession = decodeSession(agentCookie);

  const isVendorAuth = vendorSession?.role === 'VENDOR' || vendorSession?.role === 'ADMIN';
  const isAgentAuth = agentSession?.role === 'AGENT' || agentSession?.role === 'ADMIN';

  // 3. Strict Vendor Portal Guards
  if (pathname.startsWith('/vendor')) {
    // If requesting login page
    if (pathname === '/vendor/login') {
      if (isVendorAuth) {
        url.pathname = '/vendor/dashboard';
        return NextResponse.redirect(url);
      }
      return NextResponse.next();
    }

    // Attempting /vendor or /vendor/dashboard or any subpath
    if (!isVendorAuth) {
      // If user is logged in as Agent, strictly deny vendor portal access
      if (isAgentAuth) {
        url.pathname = '/agent/dashboard';
        url.searchParams.set('denied', 'vendor_portal_cross_access_blocked');
        return NextResponse.redirect(url);
      }

      url.pathname = '/vendor/login';
      url.searchParams.set('redirect', pathname);
      return NextResponse.redirect(url);
    }

    // If authenticated vendor visits /vendor root, route to /vendor/dashboard
    if (pathname === '/vendor') {
      url.pathname = '/vendor/dashboard';
      return NextResponse.redirect(url);
    }
  }

  // 4. Strict Agent Portal Guards
  if (pathname.startsWith('/agent')) {
    // If requesting login page
    if (pathname === '/agent/login') {
      if (isAgentAuth) {
        url.pathname = '/agent/dashboard';
        return NextResponse.redirect(url);
      }
      return NextResponse.next();
    }

    // Attempting /agent or /agent/dashboard or any subpath
    if (!isAgentAuth) {
      // If user is logged in as Vendor, strictly deny agent portal access
      if (isVendorAuth) {
        url.pathname = '/vendor/dashboard';
        url.searchParams.set('denied', 'agent_portal_cross_access_blocked');
        return NextResponse.redirect(url);
      }

      url.pathname = '/agent/login';
      url.searchParams.set('redirect', pathname);
      return NextResponse.redirect(url);
    }

    // If authenticated agent visits /agent root, route to /agent/dashboard
    if (pathname === '/agent') {
      url.pathname = '/agent/dashboard';
      return NextResponse.redirect(url);
    }
  }

  // 5. Admin Domain Routing
  const isAdminHost =
    host === 'admin.example.com' ||
    host.startsWith('admin.') ||
    url.searchParams.get('subdomain') === 'admin' ||
    url.searchParams.get('domain') === 'admin.example.com';

  if (isAdminHost && url.pathname === '/') {
    url.pathname = '/admin';
    return NextResponse.rewrite(url);
  }

  // 6. Referral & Affiliate Attribution (30-day cookie)
  const refCode =
    url.searchParams.get('ref') ||
    url.searchParams.get('partner') ||
    url.searchParams.get('cp') ||
    url.searchParams.get('affiliate') ||
    url.searchParams.get('code');

  // 7. Security Headers & Cookie Attribution
  const response = NextResponse.next();
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-Frame-Options', 'SAMEORIGIN');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');

  if (refCode && refCode.trim().length > 0) {
    const cleanRef = refCode.trim().slice(0, 64);
    // Set 30-day cookie (30 days * 24 hours * 60 mins * 60 secs)
    response.cookies.set('prosify_ref', cleanRef, {
      maxAge: 30 * 24 * 60 * 60,
      path: '/',
      httpOnly: false, // accessible to client forms and server components
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
    });
    // Also set legacy partner cookie for backward compatibility
    response.cookies.set('prosify_partner_ref', cleanRef, {
      maxAge: 30 * 24 * 60 * 60,
      path: '/',
      httpOnly: false,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
    });
  }

  if (
    url.pathname.startsWith('/admin') ||
    url.pathname.startsWith('/vendor') ||
    url.pathname.startsWith('/agent') ||
    url.pathname.startsWith('/api/admin')
  ) {
    response.headers.set('X-Robots-Tag', 'noindex, nofollow, noarchive');
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - _not-found
     * - favicon.ico, sitemap.xml, robots.txt (metadata files)
     */
    '/((?!api|_next/static|_next/image|_not-found|favicon.ico|sitemap.xml|robots.txt).*)',
  ],
};
