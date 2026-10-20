# Implementation Plan: Universal Admin Persistence, Credentials Sync, Cloudflare Caching & Agent Tools

Fix the issue where admin changes (branding, uploaded logo, site settings) and newly provisioned agent/vendor credentials only persist in local storage or fail to reflect across multiple browsers. Add Cloudflare edge cache bypass recommendations, an interactive deal commission calculator, and a live CRM lead data sync log tab in the Agent Dashboard.

---

## User Review Required

> [!IMPORTANT]
> **Universal Multi-Browser Persistence vs. Local Storage:**
> Currently, several admin views write directly to browser `localStorage` or send large Base64 data strings without synchronous disk persistence. We will introduce a unified server-side persistence layer with an atomic filesystem storage backend (`/data/system_settings.json` and `/data/unified_users.json`) coupled with dedicated logo upload handling (`/api/admin/upload-logo` and `/api/brand/logo`) that serves fresh headers with cache-busting.

- **Cloudflare Caching Behavior:** Dynamic API endpoints (`/api/*`, `/admin/*`, `/agent/*`, `/vendor/*`) require Cloudflare Edge Cache Bypass so that updates are immediately visible on all devices and browsers without stale cache.
- **Agent Dashboard Enhancements:** The interactive commission calculator and CRM sync logs will be integrated into the primary `/agent/dashboard` route and made accessible via clean, high-density tabs following our dark glassmorphic design system.

---

## Proposed Changes

### 1. Universal Multi-Browser Admin Persistence & Logo Management

#### [Backend] Dedicated Logo Upload & Stream Engine
- **`app/api/admin/upload-logo/route.ts`**:
  - Accept `multipart/form-data` image uploads (PNG, JPG, SVG, WebP) up to 5MB.
  - Write uploaded logo to persistent disk storage (`data/uploads/website_logo.png` and `/public/uploads/logo.png`).
  - Update `system_settings.json` with a permanent public URL and timestamped cache-buster query: `/api/brand/logo?v=${Date.now()}`.
- **`app/api/brand/logo/route.ts`**:
  - Public route that streams the latest uploaded logo file with proper MIME types (`image/png`, `image/jpeg`, etc.).
  - Set `Cache-Control: public, max-age=0, must-revalidate` so browsers and CDNs always check for freshness or respect version query parameters.
- **`app/api/admin/settings/route.ts`**:
  - Set explicit HTTP response headers: `Cache-Control: no-store, no-cache, must-revalidate, proxy-revalidate`.
  - Ensure any setting updated by admin (site name, logo URL, contact info, WhatsApp) persists synchronously to disk and memory.

#### [Frontend] Universal Logo & Brand State Hook
- **`lib/data/useBrandSettings.ts`**:
  - Fetch `/api/admin/settings` with `cache: 'no-store'`.
  - Provide immediate live synchronization without relying solely on single-browser `localStorage`.
- **`components/brand/ProsifyLogo.tsx`**:
  - Dynamically render the universal logo using `/api/brand/logo` fallback and custom URL with graceful error handling and skeleton loading.
- **`components/admin/views/BasicSettingsView.tsx`**:
  - Connect file upload directly to `/api/admin/upload-logo` with instant multi-browser preview and status indicators.

---

### 2. Universal Agent & Vendor Credentials Synchronization

#### [Backend] Unified Credentials Storage & Auth Matcher
- **`lib/auth/serverUserDb.ts`**:
  - Unify credential storage so that creating or modifying a user in `AgentsManagementView`, `VendorsManagementView`, or `UserProvisioningSuite` writes directly to `data/unified_users.json`.
  - Ensure password updates, status changes (`ACTIVE` / `SUSPENDED`), and custom User IDs (`AGT-XXXX`, `VEN-XXXX`) are indexed and matched case-insensitively across:
    1. Assigned ID (`secureId` / `assignedCode`)
    2. Username (`agent@prosify.in`)
    3. Registered Email
    4. 10-digit mobile phone number
- **`app/api/admin/cloud-sync/route.ts` & `app/api/admin/portal-users/route.ts`**:
  - Ensure POST/PATCH/DELETE synchronously updates `serverUserDb` and writes to disk.
- **`app/api/auth/agent/login/route.ts` & `app/api/auth/vendor/login/route.ts`**:
  - Support instant cloud-authoritative password verification against `serverUserDb` so any newly configured password works immediately from any browser or incognito window.

---

### 3. Cloudflare Configuration & Cache Bypass Guide

#### [Documentation & Config]
- **`CLOUDFLARE_GUIDE.md`**:
  - Add explicit, copy-paste Cloudflare Dashboard rules:
    1. **Cache Rules**: Rule for `*prosify.in/api/*` and `*prosify.in/admin/*` -> **Cache Level: Bypass**.
    2. **Browser Cache TTL**: Respect origin headers (`no-store, no-cache`).
    3. **Cloudflare Purge Instructions**: CLI command (`npx wrangler pages deployment purge`) and Dashboard steps to purge cache after branding updates.
    4. **Web Application Firewall (WAF)**: Whitelist rules for `/api/auth/*` to prevent false-positive challenge pages on agent/vendor logins.

---

### 4. Interactive Deal Commission Calculator Component

#### [Component] `components/agent/AgentCommissionCalculator.tsx`
- **Interactive Inputs**:
  - Property Value slider + manual numeric input (e.g. ₹50 Lakh to ₹25 Crore with quick presets: ₹75L, ₹1.5 Cr, ₹3.5 Cr, ₹8 Cr).
  - Agent Tier Selector:
    - **Silver** (2.0% base commission)
    - **Gold** (2.5% premium commission + milestone incentive)
    - **Platinum** (3.0% elite tier + quarterly bonus)
    - **Diamond / MahaRERA Lead Partner** (3.5% maximum commission slab)
  - Co-broker / Channel Partner Split toggle (100% solo, 50-50 split, or custom team cut).
  - MahaRERA TDS deduction preview (5% Section 194H TDS calculator and net payable amount).
- **Earnings Metrics**:
  - Gross Commission Receivable
  - Statutory TDS Deduction (5%)
  - Net Bank Disbursable Amount
  - Milestone Progress Indicator (how much deal volume needed to reach next tier)
- **Export / Copy Quote**: 1-click button to copy formatted deal commission summary to clipboard.

---

### 5. Live CRM Sync Log Tab in Agent Dashboard

#### [Component & Tab] `components/agent/AgentCrmSyncLogTab.tsx`
- **Integration in `app/agent/dashboard/page.tsx`**:
  - Add two new tabs to the Agent Dashboard header navigation:
    - **"Commission Calculator"** (`calculator`)
    - **"CRM Sync & Webhooks"** (`crm_sync`)
- **Live Sync Log Features**:
  - Connect to `/api/crm/sync-status` to display real-time lead dispatch events.
  - High-density tabular status view:
    - Timestamp (formatted with tabular figures `font-mono`)
    - Lead Name & Mobile (masked for privacy)
    - Target Property & Budget
    - Dispatch Target (Webhook URL / Central CRM Endpoint)
    - Status Badge: `SYNCED (200 OK)`, `PENDING (Queued)`, `FAILED (Timeout/Error)`
    - Response Payload / Error Message collapsible inspector
  - Interactive Actions:
    - "Test CRM Ping" to verify webhook connectivity in real time.
    - "Retry Sync" for any failed lead with instant status update.
    - Refresh button with live polling indicator.

---

## Verification Plan

### Automated Build Verification
- Execute `compile_applet` to ensure TypeScript compilation, route exports, and Tailwind styling succeed without errors.

### Functional Verification
1. **Multi-Browser Logo Test**:
   - Upload new logo in Admin -> Basic Settings -> Website Logo & Branding.
   - Verify `/api/admin/settings` returns the new logo URL.
   - Verify logo renders on public Navbar, Footer, and Admin header without manual localStorage seeding.
2. **Multi-Browser Agent/Vendor Login Test**:
   - Provision an Agent (`AGT-9124`) and Vendor (`VND-7821`) with custom passwords in Admin.
   - Open a simulated fresh session (clear cookies/localStorage) and execute login POST to `/api/auth/agent/login` and `/api/auth/vendor/login`.
   - Verify authentication succeeds and returns valid session tokens.
3. **Commission Calculator Test**:
   - In Agent Dashboard -> Commission Calculator tab, adjust property value and toggle between Silver, Gold, Platinum, and Diamond tiers.
   - Verify calculations reflect exact percentages, TDS deduction, and net pay.
4. **CRM Sync Log Test**:
   - In Agent Dashboard -> CRM Sync tab, verify existing lead sync logs load from `/api/crm/sync-status`.
   - Trigger a Test Ping and verify the log appears in the table with webhook response status.
