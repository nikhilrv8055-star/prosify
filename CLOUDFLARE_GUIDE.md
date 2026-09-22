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
