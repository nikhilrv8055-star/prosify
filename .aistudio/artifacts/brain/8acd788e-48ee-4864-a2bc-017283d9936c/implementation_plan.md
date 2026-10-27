# Prosify Real-Time Admin-to-Website Synchronization & Platform Architecture

A complete, production-grade bidirectional synchronization system that connects the Prosify Admin Management Suite to the public customer-facing website (`/`, `/properties`, `/projects`, `/developers`, `/affiliate`, and `/contact`). Any modification made in Admin—including property additions and price adjustments, project updates, developer partner listings, homepage CMS headlines and section toggles, brand logos, contact numbers, and festival themes—persists in server-side storage and updates the public website live without requiring manual browser cache clearing.

---

### User Review & Critical Decisions

> [!IMPORTANT]
> The platform operates on a single unified truth model: data edited in Admin is saved directly to persistent server-backed stores (`data/*.json` and Next.js server API routes). Changes are broadcast instantly to active client windows via cross-tab sync and live polling/revalidation.

- **Confirmed Decision 1: Unified Server-Side Persistence**: Admin edits will write directly through robust REST API routes (`/api/admin/properties`, `/api/admin/projects`, `/api/admin/settings`, `/api/cms/homepage`) to persistent storage files in the `data/` directory. All public visitors on mobile, desktop, or incognito sessions will see the exact updated listings and settings.
- **Confirmed Decision 2: Instant Public Reflection**: Client pages using `useLiveStore` and `useBrandSettings` will automatically rehydrate on window focus, cross-tab broadcast events, and regular interval revalidation. Edits made in the Admin tab will reflect on the public tab within milliseconds.
- **Confirmed Decision 3: Safety Reset Capability**: An administrative "Reset to Curated Defaults" action will be provided in the Admin Settings tab, allowing administrators to restore the verified pan-India properties and developer seeds whenever needed.

---

### 1. Overview & Core Concept

- **What It Does**: Bridges the administrative management portal with public customer-facing pages. When an administrator adds a new property, updates a pricing figure, marks a home as "Featured", customizes the homepage hero headline, updates contact numbers, or modifies the brand logo, those changes are immediately reflected on the live website. Homebuyers browsing the portal see up-to-the-minute inventory, real-time pricing, and active festival themes.
- **Target Audience / Persona**:
  - *Prosify Administrators & Operations Teams*: Real estate asset managers who need rapid inventory management, lead tracking, and content publishing without touching code.
  - *Homebuyers & Investors*: Discerning buyers searching for Grade-A residential and commercial real estate across Mumbai MMR, Pune, Bengaluru, Delhi NCR, and Hyderabad.
  - *Affiliate & Growth Partners*: Channel partners tracking referral links, real-time conversion payouts, and commission wallets.
- **Key Value**: Eliminates the disconnect between admin inputs and public UI. Delivers an authoritative, responsive enterprise portal with zero static placeholders, full CRUD synchronization, and instant visual updates.

---

### 2. User Experience & Visual Design

- **Key User Flows**:
  1. *Admin Property Mutation Flow*: Admin opens `/admin` -> navigates to **Properties** -> edits property price from ₹1.25 Cr to ₹1.18 Cr and marks as "Featured" -> clicks **Save Changes**. The server API writes to the persistent store. Home page hero and `/properties` listing instantly display the updated price tag and featured badge.
  2. *Homepage CMS Customization Flow*: Admin opens **Home Page CMS** in `/admin` -> edits the Hero headline to *"Luxury Waterfront Residences in South Mumbai"* -> clicks **Save Changes Live**. Public visitors on `/` see the new headline and updated subtext immediately.
  3. *Brand & Contact Sync Flow*: Admin updates the support phone number or changes the logo in **Basic Settings** -> public navbar, footer, and WhatsApp redirection links immediately update to the new contact details.
  4. *Customer Lead & Site Visit Flow*: Homebuyer submits an enquiry modal on a luxury property -> submission is captured via `/api/leads` -> Admin Command Center and Leads CRM increment the counter and display the lead with contact details and property context.

- **Visual Identity & Theme**:
  - *Aesthetic Direction*: Dark luxury architectural aesthetic tailored for high-ticket Indian real estate.
  - *Color Palette & Mood*:
    - Deep Neutral Canvas: `#0A0D14` (Obsidian Onyx) and `#111622` (Deep Navy Charcoal).
    - Structural Surfaces: `#171F2E` with hairline borders (`rgba(255, 255, 255, 0.08)` or subtle gold `rgba(212, 175, 55, 0.2)`).
    - Accent Budget (10%): Warm Metallic Gold (`#D4AF37`) and Emerald Trust Green (`#10B981`) for verified badges.
  - *Typography & Hierarchy*:
    - Display Headings: Refined geometric sans (`Plus Jakarta Sans`) with tight letter spacing.
    - Tabular Figures: `tabular-nums` for all price figures, carpet areas, and affiliate balances.
  - *Top Bar Contract*: Strict 3-zone layout:
    - Zone 1: Clean Prosify wordmark and official logo.
    - Zone 2: 4 single-line links (`Properties`, `Projects`, `Developers`, `Affiliate`).
    - Zone 3: Primary CTA (`Post Requirement` / `Contact Desk`).

---

### 3. Key Product Decisions & Trade-Offs

- **Decision 1: File-System Backed Unified Server Database (`data/*.json`)**:
  - *Chosen Approach*: Implement structured JSON storage for properties, projects, developers, CMS copy, and brand settings with atomic writes and in-memory read cache.
  - *Why*: Provides reliable persistence across server reboots, container restarts, and browser sessions without requiring an external database cluster setup.
  - *Alternatives Considered*: Pure browser `localStorage` (fails across different users/devices and breaks SSR); external SQL requiring external connection credentials (adds connection latency and potential failure points in preview environment).

- **Decision 2: Dual Event-Driven & Polling Rehydration (`useLiveStore`)**:
  - *Chosen Approach*: Public client components listen to `BroadcastChannel`, `storage` events, window focus (`visibilitychange`), and a lightweight SWR revalidation hook.
  - *Why*: Guarantees that public tabs update both instantly in the same browser session and accurately on subsequent visits from external users.

- **Decision 3: Complete Working Handlers with Zero Dead Buttons**:
  - *Chosen Approach*: Audit and wire all search filters, category tabs, modal forms, affiliate copy-link triggers, compare property selectors, and contact submission buttons.
  - *Why*: Ensures strict compliance with "sabkuchh working hona chahiye", eliminating dead clicks and mock stubs.

---

### 4. Technical Architecture & Data Strategy

```
┌────────────────────────────────────────────────────────────────────────┐
│                        PROSIFY ARCHITECTURE                            │
└────────────────────────────────────────────────────────────────────────┘

    ┌───────────────────────────┐         ┌──────────────────────────┐
    │     ADMIN SUITE UI        │         │  CUSTOMER PUBLIC WEBSITE │
    │  (/admin - 17 Modules)    │         │ (/, /properties, etc.)   │
    │                           │         │                          │
    │ • Properties & Projects   │         │ • Hero & Search Engine   │
    │ • Developers & Inventory  │         │ • Property Grid & Cards  │
    │ • Homepage CMS & Settings │         │ • Trusted Partners Rail  │
    │ • Affiliate & Leads CRM   │         │ • Dynamic Festival Theme │
    └─────────────┬─────────────┘         └────────────▲─────────────┘
                  │                                    │
                  │ POST / PUT / DELETE                │ GET / Revalidate
                  ▼                                    │
    ┌───────────────────────────┐                      │
    │    NEXT.JS API LAYER      │                      │
    │                           │                      │
    │ • /api/admin/properties   │                      │
    │ • /api/admin/projects     │                      │
    │ • /api/admin/settings     │                      │
    │ • /api/cms/homepage       │──────────────────────┘
    │ • /api/leads & visits     │
    └─────────────┬─────────────┘
                  │
                  ▼
    ┌──────────────────────────────────────────────────┐
    │          PERSISTENT SERVER DATABASE              │
    │             (/data/*.json Engine)                │
    │                                                  │
    │ • data/properties.json                           │
    │ • data/projects.json                             │
    │ • data/developers.json                           │
    │ • data/homepage_cms.json                         │
    │ • data/brand_settings.json                       │
    │ • data/unified_affiliates.json                   │
    └──────────────────────────────────────────────────┘
```

#### Component & State Flow:
1. **`lib/data/serverStore.ts`**: Server-side singleton reading and writing to `data/properties.json`, `data/projects.json`, `data/developers.json`, and `data/homepage_cms.json`.
2. **`app/api/properties/route.ts` & `app/api/admin/properties/route.ts`**: Full CRUD endpoints for creating, editing, publishing, and deleting properties.
3. **`app/api/cms/homepage/route.ts`**: Fetches and saves live section titles, subtitles, and enable/disable states for the public home page.
4. **`app/api/brand/settings/route.ts`**: Fetches and saves global brand configurations (company name, logo URL, WhatsApp support phone, contact email).
5. **`lib/data/useLiveStore.ts`**: Client-side hook combining server fetch with local storage fallback and real-time cross-tab synchronization.
6. **`components/marketplace/Navbar.tsx` & `Footer.tsx`**: Consume brand settings dynamically, displaying the active logo and contact information.
7. **`app/page.tsx`**: Renders sections dynamically based on `homepage_cms.json` settings, displaying live featured properties and project listings.

---

### Verification & Testing Plan

1. **Admin Property Edit Test**:
   - Update property title and price in Admin. Verify immediate reflection on `/properties` and the home page.
   - Add a new property with cover photo. Verify it appears on `/properties` with functional detail view at `/properties/[slug]`.
2. **Homepage CMS Test**:
   - Modify Hero headline and toggle off one section in Admin CMS. Verify homepage layout updates dynamically.
3. **Brand Settings & WhatsApp Test**:
   - Update WhatsApp contact number in Basic Settings. Verify WhatsApp floating button and header links navigate to the new link.
4. **Public Lead Capture Test**:
   - Submit a test inquiry on the public website. Verify it appears in Admin Command Center and Leads CRM.
5. **Build & Lint Verification**:
   - Run `compile_applet` and `lint_applet` to confirm zero compilation or TypeScript errors.
