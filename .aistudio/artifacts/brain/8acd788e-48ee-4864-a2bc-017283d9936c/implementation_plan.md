# Remove Software Services Button from Header Navigation

Clean up the top header navigation bar by removing the standalone "Software Services" action button and hover tooltip adjacent to "All Services", restoring a minimal, unencumbered top bar layout while preserving full service offerings in the main menu drawer.

---

### User Review & Critical Decisions

> [!IMPORTANT]
> The clarification question was skipped by the user, so we are proceeding with the standard and cleanest solution: removing the dedicated "Software Services" trigger and tooltip from the primary desktop top navigation bar right next to the "All Services" menu.

- **Confirmed Decision 1: Remove Header Button**: The standalone "Software Services" button and its hover tooltip in the top navigation bar (`Navbar`) will be removed, streamlining the header to focus on primary real estate discovery and the "All Services" master trigger.
- **Confirmed Decision 2: Keep Full Capabilities in All Services Drawer**: The Software Development Services card and modal trigger remain preserved inside the "All Services" drawer/menu (`RightMenuDrawer`) and mobile view, ensuring clients interested in PropTech enterprise software can still easily discover and contact the tech development desk without cluttering the top bar.

---

### 1. Overview & Core Concept

- **What It Does**: Streamlines the desktop header navigation bar by removing the secondary "Software Services" button located next to the "All Services" hamburger button.
- **Target Audience / Persona**: Discerning real estate buyers and investors seeking a clean, uncluttered browsing experience without duplicate service entry points in the header.
- **Key Value**: Provides a more balanced, elegant navigation bar with clear visual hierarchy, keeping direct property tools (Compare, All Services) prominent without extraneous button noise.

---

### 2. User Experience & Visual Design

- **Key User Flows**:
  1. *Navigation Flow*: When browsing the website on desktop, visitors see a refined top bar with the Prosify logo, search/location controls, Property Compare, and the "All Services" button.
  2. *Services Access Flow*: Visitors clicking "All Services" still have complete access to all advisory, financing, legal, and software development solutions in the organized slide-out drawer.
- **Visual Identity & Theme**:
  - Maintains strict 3-zone header discipline:
    - Left: Official Prosify brand logo in prominent scale.
    - Center: Clean search input and city selector.
    - Right: Comparison counter badge and "All Services" master menu trigger.
  - Spacing & Rhythm: Eliminates visual crowding on screens between 1024px and 1280px widths.

---

### 3. Key Product Decisions & Trade-Offs

- **Decision 1: Remove Top Navbar Trigger Only**:
  - *Chosen Approach*: Remove the button element and hover popover card from the top navbar flex row, leaving the underlying `SoftwareDevelopmentModal` available if opened from other entry points.
  - *Why*: Direct response to the user's explicit request ("remove software service button") while preventing broken link dependencies in other sections.
  - *Alternatives Considered*: Complete deletion of all software development references across the whole codebase (which would break the comprehensive service catalog in the All Services drawer).

---

### 4. Technical Architecture & Component Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                     TOP NAVIGATION BAR                          │
└─────────────────────────────────────────────────────────────────┘
                               │
            ┌──────────────────┴──────────────────┐
            ▼                                     ▼
 ┌──────────────────────┐              ┌──────────────────────┐
 │  PROSIFY LOGO & BRAND│              │    RIGHT ACTIONS     │
 │  (Scale Verified)    │              │                      │
 └──────────────────────┘              │ • Property Compare   │
                                       │ • "All Services"     │
                                       │   [Software Services │
                                       │    Button REMOVED]   │
                                       └──────────┬───────────┘
                                                  │
                                                  ▼
                                       ┌──────────────────────┐
                                       │  ALL SERVICES DRAWER │
                                       │  (Advisory & Tech)   │
                                       └──────────────────────┘
```

#### Component Mapping:
- **Header Actions**: Cleaned up in the desktop action cluster to retain only Property Compare and All Services.
- **State Handling**: Ensure no unused variable warnings or dangling hover states in the navbar component.

---

### Verification & Testing Plan

1. **Header Layout Verification**:
   - Verify that the top bar displays cleanly on desktop without the Software Services button or hover tooltip.
   - Confirm the "All Services" button sits cleanly on the right with proper spacing and interaction.
2. **Mobile & Drawer Verification**:
   - Verify that the All Services drawer still opens and functions smoothly.
3. **Compilation & Lint Verification**:
   - Run `lint_applet` and check dev server response to ensure zero errors and clean build output.
