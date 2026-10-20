# Cloudflare Deployment & Setup Guide for Prosify Real Estate

Is guide ki madad se aap Prosify Real Estate portal ko **Cloudflare** par complete stack ke sath deploy kar sakte hain:
- **Hosting & Compute**: Cloudflare Workers / Pages (Edge SSR powered by `@opennextjs/cloudflare`)
- **Database**: **Cloudflare D1** (Serverless Distributed SQLite Edge Database)
- **Media & File Storage**: **Cloudflare R2** (Zero egress fees for property brochures and images)
- **Edge Cache**: **Cloudflare KV** (Lightning fast session and cache store)
- **Global CDN**: Automatic SSL, HTTP/3, and DDoS protection across 300+ global edge locations.

---

## 📁 Pre-configured Files in Project

Humne aapke project me Cloudflare ka pura structure already setup kar diya hai:
1. `wrangler.jsonc` — Cloudflare Worker configuration, D1 database binding (`DB`), KV binding, and R2 bucket bindings.
2. `open-next.config.ts` — OpenNext adapter configuration for Next.js App Router on Cloudflare Edge.
3. `migrations/0001_initial_schema.sql` — Complete database schema (Properties, Projects, Developers, Units, Leads, Channel Partners, Bookings, Commissions, Notifications, Audit Logs).
4. `migrations/0002_seed_data.sql` — Initial luxury real estate data, builders, and sample leads.
5. `lib/db/d1.ts` — Cloudflare D1 adapter with unified query execution and graceful local fallback.
6. `/app/api/admin/d1-status` — API endpoint to check live D1 database connectivity.

---

## 🚀 Step-by-Step Deployment Instructions

### Step 1: Login to Cloudflare via CLI
Apne terminal me command run karein:
```bash
npx wrangler login
```
*Yeh aapke browser me Cloudflare authorization page open karega. Login karke "Allow" par click karein.*

---

### Step 2: Create Cloudflare D1 Database
Terminal me run karein:
```bash
npm run d1:create
```
*(Ya directly: `npx wrangler d1 create prosify_production`)*

Terminal me output aayega:
```jsonc
[[d1_databases]]
binding = "DB"
database_name = "prosify_production"
database_id = "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
```
👉 Is `database_id` ko copy karke `wrangler.jsonc` file me `REPLACE_WITH_YOUR_D1_DATABASE_ID` ki jagah paste karein.

---

### Step 3: Run Database Migrations & Seed Data
Live Cloudflare D1 database me tables create karne aur initial data daalne ke liye:

1. **Tables create karein (Migration):**
   ```bash
   npm run d1:migrate:remote
   ```

2. **Luxury Properties aur Builder data load karein (Seed):**
   ```bash
   npm run d1:seed:remote
   ```

*(Local testing ke liye aap `npm run d1:migrate:local` aur `npm run d1:seed:local` bhi chala sakte hain).*

---

### Step 4: Create Cloudflare R2 Storage Buckets (Optional for Media)
Brochures aur high-res images ke liye R2 buckets create karein:
```bash
npm run r2:create
```
Yeh do buckets banayega:
- `prosify-uploads` (Media files and property floor plans)
- `prosify-cache` (Next.js Edge Incremental Cache)

---

### Step 5: Build and Deploy to Cloudflare
Bas ek single command run karein:
```bash
npm run deploy:cloudflare
```
OpenNext Next.js app ko build karega aur Wrangler use Cloudflare Edge network par deploy kar dega!
Deploy complete hone par aapko live URL milega:
`https://prosify-real-estate.<your-subdomain>.workers.dev`

---

### Step 6: Connect Custom Domain (Optional)
Agar aap apna domain (jaise `prosify.in` ya `admin.prosify.in`) lagana chahte hain:
1. Cloudflare Dashboard me jayein.
2. **Workers & Pages** -> **prosify-real-estate** par click karein.
3. **Settings** -> **Domains & Routes** me jayein.
4. **Add Custom Domain** par click karke apna domain enter karein. Cloudflare automatically SSL certificates configure kar dega.

---

## 🔍 Verification & Health Check
Deploy hone ke baad aap database connectivity check kar sakte hain:
- Admin status URL: `https://your-app.workers.dev/api/admin/d1-status`
- Response me `connected: true` aur `provider: "Cloudflare D1"` dikhega.

---

## ⚡ Cloudflare Extra Settings (Mandatory for Multi-Browser Real-Time Sync)

Agar aap Cloudflare use kar rahe hain aur Admin se logo ya settings change karne ke baad **dusre browser ya mobile me purani website hi dikh rahi hai**, to Cloudflare ka **Edge Caching** dynamic API responses ko store kar raha hota hai. Iske solution ke liye yeh 3 settings Cloudflare Dashboard me configure karein:

### Setting 1: Cache Bypass Rule for Dynamic APIs & Admin/Agent/Vendor Panels
Cloudflare dashboard me Edge Cache ko dynamic routes ke liye bypass karna zaroori hai:
1. Cloudflare Dashboard kholiye -> Apna Domain select karein (`prosify.in`).
2. Left menu me **Caching** -> **Cache Rules** par click karein.
3. **Create Rule** button dabayein:
   - **Rule Name**: `Bypass Cache for Admin, Auth & API Routes`
   - **When incoming requests match (Expression Editor)**:
     ```text
     (http.request.uri.path starts_with "/api/") or 
     (http.request.uri.path starts_with "/admin") or 
     (http.request.uri.path starts_with "/agent") or 
     (http.request.uri.path starts_with "/vendor")
     ```
   - **Cache Eligibility**: Select karein **Bypass cache**
   - **Browser Cache TTL**: Select karein **Bypass cache** (Respect origin headers)
4. **Deploy** par click karein. Ab har browser aur device par Admin panel aur Auth instantly live sync hoga.

---

### Setting 2: One-Click Cloudflare Cache Purge (Jab naya logo ya branding upload ho)
Jab bhi aap Admin Panel se logo ya major branding update karte hain aur turant har jagah reflect karwana chahte hain:
1. Cloudflare Dashboard me **Caching** -> **Configuration** par jayein.
2. **Purge Cache** section me:
   - **Purge Everything** button dabayein, ya
   - **Custom Purge** me URL dalein:
     - `https://yourdomain.com/api/admin/settings`
     - `https://yourdomain.com/api/brand/logo*`
3. CLI se bhi purge kar sakte hain:
   ```bash
   npx wrangler pages deployment purge
   ```

---

### Setting 3: WAF (Web Application Firewall) Allow Rule for Agent & Vendor Login
Agent aur Vendor portal par fast logins aur credentials validation ke waqt Cloudflare bot detection challenge page na dikhaye, iske liye:
1. Cloudflare Dashboard -> **Security** -> **WAF** -> **Custom Rules** par jayein.
2. **Create Rule** dabayein:
   - **Rule Name**: `Allow Portal Authentication API`
   - **Field**: `URI Path` -> **contains** -> `/api/auth/`
   - **Action**: `Skip` -> Check karein *All remaining WAF rules*.
3. Click **Deploy**.

---

### Setting 4: Development Mode Toggle (Testing ke waqt)
Agar aap local ya staging par test kar rahe hain:
- Cloudflare Dashboard -> **Overview** ya **Caching** -> **Development Mode** toggle **ON** kar dein.
- Yeh 3 ghante tak Cloudflare edge caching ko poori tarah pause kar deta hai, jisse aap live multi-browser testing bina kisi cache issue ke kar sakte hain.

