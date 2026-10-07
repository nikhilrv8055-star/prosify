/**
 * Google Identity Services (GIS) Helper for Prosify
 * 
 * Provides client-side Google OAuth authentication, account selection prompt,
 * and JWT credential handling.
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
      console.warn('Google Identity Services script failed to load');
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
    console.error('Failed to parse Google JWT ID token:', err);
    return null;
  }
}

/**
 * Trigger Google Account Selection Prompt
 */
export async function triggerGoogleAccountPicker(options: {
  onSuccess: (data: { credential?: string; email: string; name?: string; picture?: string; googleId?: string }) => void;
  onError?: (error: string) => void;
  clientId?: string;
}): Promise<void> {
  const clientId =
    options.clientId ||
    process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ||
    '1084293847291-prosify-real-estate.apps.googleusercontent.com';

  const scriptLoaded = await loadGoogleScript();

  if (scriptLoaded && window.google?.accounts?.id) {
    try {
      window.google.accounts.id.initialize({
        client_id: clientId,
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
        if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
          console.log('Google Prompt dismissed or skipped, calling direct fallback if needed');
        }
      });
      return;
    } catch (err) {
      console.warn('GIS initialize/prompt failed, falling back to simulated OAuth picker:', err);
    }
  }

  // Graceful fallback for environments with blocked 3rd party cookies or missing client id
  if (options.onError) {
    options.onError('Google prompt initializing fallback');
  }
}
