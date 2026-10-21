/**
 * Google Identity Services (GIS) & OAuth 2.0 Helper for Prosify
 * 
 * Provides client-side Google OAuth authentication, account selection prompt,
 * redirect OAuth URL generation, and JWT credential handling.
 */

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: {
            client_id: string;
            callback: (response: { credential: string }) => void;
            auto_select?: boolean;
            prompt_parent_id?: string;
          }) => void;
          prompt: (notification?: (notification: {
            isNotDisplayed: () => boolean;
            isSkippedMoment: () => boolean;
            isDismissedMoment: () => boolean;
            getNotDisplayedReason: () => string;
            getSkippedReason: () => string;
            getDismissedReason: () => string;
          }) => void) => void;
          renderButton: (
            parent: HTMLElement,
            options: {
              type?: 'standard' | 'icon';
              theme?: 'outline' | 'filled_blue' | 'filled_black';
              size?: 'large' | 'medium' | 'small';
              text?: 'signin_with' | 'signup_with' | 'continue_with';
              shape?: 'rectangular' | 'pill' | 'circle' | 'square';
              logo_alignment?: 'left' | 'center';
              width?: number;
            }
          ) => void;
        };
        oauth2: {
          initTokenClient: (config: {
            client_id: string;
            scope: string;
            callback: (tokenResponse: { access_token: string }) => void;
            prompt?: string;
          }) => {
            requestAccessToken: (overrideConfig?: { prompt?: string }) => void;
          };
        };
      };
    };
  }
}

/**
 * Validated Google Client ID (from NEXT_PUBLIC_GOOGLE_CLIENT_ID or production credential)
 * Avoids any empty or placeholder strings to prevent Error 401: invalid_client
 */
export const GOOGLE_CLIENT_ID: string =
  (typeof process !== 'undefined' &&
    process.env?.NEXT_PUBLIC_GOOGLE_CLIENT_ID &&
    process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID.trim()) ||
  '930588727231-3nqopkonmvjrlrne8o89hovs1imkg5hv.apps.googleusercontent.com';

/**
 * Dynamically load Google Identity Services SDK script
 */
export function loadGoogleScript(): Promise<boolean> {
  return new Promise((resolve) => {
    if (typeof window === 'undefined') return resolve(false);

    if (window.google?.accounts?.id) {
      return resolve(true);
    }

    const existingScript = document.getElementById('google-gsi-client');
    if (existingScript) {
      existingScript.addEventListener('load', () => resolve(true));
      return;
    }

    const script = document.createElement('script');
    script.id = 'google-gsi-client';
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    script.onload = () => resolve(true);
    script.onerror = () => {
      console.warn('[GIS] Google Identity Services script failed to load');
      resolve(false);
    };
    document.head.appendChild(script);
  });
}

/**
 * Decode payload from Google JWT ID Token (client-side safe decode)
 */
export function parseJwt(token: string): {
  sub?: string;
  email?: string;
  name?: string;
  picture?: string;
  email_verified?: boolean;
} | null {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (err) {
    console.error('[GIS] Failed to parse Google JWT ID token:', err);
    return null;
  }
}

/**
 * Generates direct Google OAuth 2.0 Authorization URL for redirect flow.
 * Directs user to Google's consent screen and returns them to /api/auth/callback/google
 */
export function getGoogleOAuthUrl(state = '/', redirectUri?: string): string {
  const origin = typeof window !== 'undefined' && window.location.origin ? window.location.origin : 'https://www.prosify.in';
  const callbackUri = redirectUri || `${origin}/api/auth/callback/google`;
  const rootUrl = 'https://accounts.google.com/o/oauth2/v2/auth';
  const params = new URLSearchParams({
    client_id: GOOGLE_CLIENT_ID,
    redirect_uri: callbackUri,
    response_type: 'code',
    scope: 'openid email profile',
    access_type: 'offline',
    prompt: 'select_account',
    state: state || '/',
  });
  return `${rootUrl}?${params.toString()}`;
}

/**
 * Trigger Google Account Selection Prompt
 */
export async function triggerGoogleAccountPicker(options: {
  onSuccess: (data: { credential?: string; email: string; name?: string; picture?: string; googleId?: string }) => void;
  onError?: (error: string) => void;
  clientId?: string;
}): Promise<void> {
  const resolvedClientId =
    options.clientId && options.clientId.trim() ? options.clientId.trim() : GOOGLE_CLIENT_ID;

  if (!resolvedClientId) {
    if (options.onError) {
      options.onError('Missing Google Client ID');
    }
    return;
  }

  const scriptLoaded = await loadGoogleScript();

  if (scriptLoaded && window.google?.accounts?.id) {
    try {
      window.google.accounts.id.initialize({
        client_id: resolvedClientId,
        callback: (response) => {
          if (response.credential) {
            const decoded = parseJwt(response.credential);
            options.onSuccess({
              credential: response.credential,
              email: decoded?.email || '',
              name: decoded?.name,
              picture: decoded?.picture,
              googleId: decoded?.sub,
            });
          }
        },
        auto_select: false,
      });

      // Prompt account picker
      window.google.accounts.id.prompt((notification) => {
        if (notification.isNotDisplayed?.() || notification.isSkippedMoment?.()) {
          console.warn('[GIS] Prompt dismissed or skipped, notifying fallback handler');
          if (options.onError) {
            options.onError(
              notification.isNotDisplayed?.()
                ? `Prompt not displayed: ${notification.getNotDisplayedReason?.() || 'origin/cookie constraint'}`
                : `Prompt skipped: ${notification.getSkippedReason?.() || 'user dismissal'}`
            );
          }
        }
      });
      return;
    } catch (err) {
      console.warn('[GIS] initialize/prompt error:', err);
    }
  }

  // Graceful fallback for environments with blocked 3rd party cookies or missing client id
  if (options.onError) {
    options.onError('Google prompt initializing fallback');
  }
}
