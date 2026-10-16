# CRM Lead Capture & Webhook Integration System

## Overview
This codebase includes an enterprise-grade, resilient lead capture pipeline that connects:
1. **Contact & Property Inquiry Forms** (Name, Phone, Email, City, Message/Inquiry Type)
2. **Affiliate & Partner Signups** (Triggered automatically on Google OAuth or Mobile OTP registration with tag `Affiliate_Partner`)
3. **High-Intent CTA Buttons** ("Request Callback", "Download Brochure", "Apply for Affiliate")

All leads are:
- Validated (10-digit Indian standard phone `^[6-9]\d{9}$` and RFC email)
- Enriched with metadata (`sourceUrl`, `timestamp`, `utm_source`, `utm_medium`, `utm_campaign`, `utm_term`, `ipAddress`, `userAgent`)
- Guarded by a hidden honeypot anti-spam field and IP rate limiting
- Saved to the local fail-safe database table (`leads`) with status (`PENDING`, `SYNCED`, `FAILED`)
- Dispatched to external CRM webhooks/APIs with **exponential backoff retry logic** (up to 3 retries)

---

## Where to Paste Your CRM Webhook URL

### Step 1: Obtain your Webhook URL from your CRM

- **Zapier**:
  1. Create a Zap -> Choose Trigger: **Webhooks by Zapier** -> Event: **Catch Hook**.
  2. Copy the generated webhook URL (e.g., `https://hooks.zapier.com/hooks/catch/1234567/abcdef/`).
  3. Set Action: **Zoho CRM (Create Lead)**, **HubSpot (Create Contact)**, **Google Sheets**, or any CRM.

- **Make.com (Integromat)**:
  1. Add module: **Custom Webhook** -> Click "Add" -> Copy the Webhook URL (e.g., `https://hook.eu1.make.com/xxxxxxxxxxx`).
  2. Route to your desired CRM module (LeadSquared, Salesforce, HubSpot).

- **Zoho CRM**:
  - Go to **Setup** -> **Developer Space** -> **Webhooks** or use the Zoho CRM REST API v2 (`https://www.zohoapis.com/crm/v2/Leads`).

- **HubSpot**:
  - Use HubSpot Workflows with Webhook trigger, or point to the Contacts API (`https://api.hubapi.com/crm/v3/objects/contacts`).

- **LeadSquared**:
  - Point to `https://api-in21.leadsquared.com/v2/LeadManagement.svc/Lead.Capture`.

---

### Step 2: Configure Environment Variables in `.env`

Add the following variables to your `.env` (or `.env.local`) file:

```env
# Choose: "webhook", "zoho", "hubspot", "leadsquared"
CRM_PROVIDER="webhook"

# Paste your webhook URL here:
CRM_API_ENDPOINT="https://hooks.zapier.com/hooks/catch/1234567/abcdef/"

# Optional API Key or Bearer Token (if required by your endpoint)
CRM_API_KEY=""
CRM_BEARER_TOKEN=""
```

---

### Step 3: Test Webhook Handshake in UI

1. Open the Admin Console at `/admin` (or click **Command Center** -> **CRM Pipeline**).
2. Click the **CRM Webhook & Leads Sync Hub** sub-tab.
3. Click **Send Test Lead** to verify that your target webhook responds with HTTP 200 OK.
4. Any lead that failed due to temporary network issues can be re-synced with 1 click using the **Retry** button.

---

## API Endpoints

- **`POST /api/crm/lead-capture`**:
  Main ingestion route for website inquiries, high-intent buttons, and signups.
  Validates phone and email, saves to local DB, and dispatches to CRM.

- **`GET /api/crm/lead-capture`**:
  Returns CRM provider configuration status and lead sync counts.

- **`GET /api/crm/leads`**:
  Admin endpoint to fetch leads filtered by sync status (`SYNCED`, `FAILED`, `PENDING`).

- **`POST /api/crm/leads`**:
  Admin endpoint to manually retry syncing a specific lead (`{ leadId }`).

- **`POST /api/crm/test-connection`**:
  Pings the configured CRM endpoint with a verification test lead to verify connectivity and latency.
