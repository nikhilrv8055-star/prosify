# Role-Based Access Control (RBAC) Admin Panel

Complete implementation of Role-Based Access Control (RBAC) in the Prosify Admin Panel (`/admin`). The Main Super Administrator can create custom staff and admin accounts with unique Login IDs, emails, passwords, and custom role permissions. When staff log in with their credentials, they receive strictly limited access to only the modules assigned by the Main Admin, with all unauthorized modules hidden from the navigation accordion and protected with route guards.

---

### Features & Architecture Implemented

1. **Server-Side Persistent Admin Staff Database (`lib/data/serverAdminStaffDb.ts`)**:
   - Manages admin staff records stored persistently in `data/admin_staff.json`.
   - Root Super Admin account preserved (`admin` / `prosify@123#`) with full governance access (`['*']`).
   - Supports preset operational roles:
     - **Super Administrator (`SUPER_ADMIN`)**: Unrestricted access to all 17+ groups and settings.
     - **Property & Project Manager (`PROPERTY_MANAGER`)**: Restricted to Specifications, Properties, Projects, Packages, and Dashboard.
     - **CRM & Sales Director (`CRM_SALES_MANAGER`)**: Restricted to Leads, CRM Pipeline, Support Tickets, Reports, and Dashboard.
     - **Vendors & Agents Director (`VENDOR_AGENT_MANAGER`)**: Restricted to Vendors, Agents, Channel Partners, and Registered Users.
     - **Affiliate Program Manager (`AFFILIATE_MANAGER`)**: Restricted to the Affiliate Program (Settings, Members, Conversions, Payouts, Creatives) and Dashboard.
     - **Content & CMS Editor (`CONTENT_CMS_MANAGER`)**: Restricted to Home Page CMS, Footer CMS, Blog, FAQ, Advertisements, and Festival Themes.
     - **Finance & Payouts Officer (`FINANCE_MANAGER`)**: Restricted to Payment Logs, Gateways, Payouts, and Commissions.
     - **Custom Access Staff (`CUSTOM`)**: Granular checkbox-based permissions configured individually per module.

2. **Secure REST API Endpoints**:
   - `POST /api/admin/staff/login`: Validates Login ID or email and password; returns session token, user details, assigned role, and permitted module IDs (`allowedGroups`).
   - `GET /api/admin/staff`: Fetches staff accounts with credentials, role titles, status, and permissions.
   - `POST /api/admin/staff`: Creates a new admin account with full validation and password assignment.
   - `PATCH /api/admin/staff`: Updates permissions, passwords, and active/suspended status.
   - `DELETE /api/admin/staff`: Deletes delegated staff accounts (root super admin is permanently protected).

3. **Admin Panel UI & Permission Guarding**:
   - **Login Authentication Gate (`AdminAuthGate.tsx`)**: Accepts any staff member's Login ID and Password, verifies credentials via backend API, and saves role scope in session storage.
   - **Dynamic Accordion Navigation (`AdminSidebarAccordion.tsx`)**: Automatically filters the 17+ navigation groups, showing only the groups granted to that staff member. Shows an assigned role scope badge with module count.
   - **Route-Level Permission Guard (`app/admin/page.tsx`)**: If a restricted staff member navigates directly to an unauthorized tab, an "Access Restricted" screen appears explaining that their role lacks permission, with a 1-click button to jump directly to their authorized workspace.
   - **Header Navbar (`AdminNavbar.tsx`)**: Displays the logged-in staff member's real name and role title. Locks down the role switcher dropdown for delegated staff so non-super-admins cannot elevate their own permissions.
   - **Admin Management View (`AdminManagementView.tsx`)**: Allows the Main Super Administrator to:
     - View all registered staff accounts with their assigned modules and status.
     - Click "Create New Admin User" with instant password generator, preset role selection, and interactive group permissions.
     - Edit permissions or reset passwords for existing staff.
     - 1-click "Copy Credentials Package" to share Login ID, password, and portal URL with staff.
