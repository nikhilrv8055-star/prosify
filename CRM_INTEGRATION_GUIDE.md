# CRM Lead Capture & Webhook Integration Guide

This guide explains how to connect your external CRM (such as **Zoho CRM**, **HubSpot**, **LeadSquared**, **Zapier**, **Make.com**, **n8n**, or any custom webhook-compatible endpoint) to the website.

---

## 1. Quick Setup: Where to Paste Your CRM Webhook URL

Open your `.env` file (or your hosting environment variables in Cloudflare / Vercel / Railway / Docker) and configure the following variables:

```bash
# 1. Choose your CRM provider: "webhook" | "zoho" | "hubspot" | "leadsquared"
CRM_PROVIDER="webhook"

# 2. Paste your target CRM Webhook URL or REST API Endpoint here:
CRM_API_ENDPOINT="https://your-crm-webhook-url.com/leads"

# 3. Optional: Add your Bearer Token or API Key for authorization
CRM_API_KEY="your_api_key_or_bearer_token"

# 4. Optional: Webhook HMAC secret for signature verification
CRM_WEBHOOK_SECRET="your_optional_webhook_secret"
```

> **Note on Fail-Safe Mode:** If `CRM_API_ENDPOINT` is left blank, the website continues to function smoothly in **Local Fail-Safe Mode**. All leads and signups are safely persisted in the local database (`leads` table) with `crmSyncStatus: "PENDING"`, so **no lead is ever lost**. Once you paste your CRM URL, pending leads can be synced with one click from the Admin Portal!

---

## 2. Supported CRM Providers & Formatting

### Option A: Generic Webhook (Zapier, Make, n8n, Custom Webhook)
- Set: `CRM_PROVIDER="webhook"`
- Set: `CRM_API_ENDPOINT="https://hooks.zapier.com/hooks/catch/..."`
- The system automatically dispatches standardized enterprise JSON:
```json
{
  "event": "lead.captured",
  "leadId": "lead-1713298401",
  "timestamp": "2026-10-16T07:30:00.000Z",
  "leadTag": "Contact_Page_Inquiry",
  "contact": {
    "fullName": "Amit Sharma",
    "email": "amit.sharma@example.com",
    "phone": "+91 9820144556",
    "city": "Mumbai"
  },
  "inquiry": {
    "inquiryType": "General Advisory & Search",
    "message": "Looking for 3 BHK under 2.5 Cr in Kandivali East",
    "highIntentAction": null,
    "propertyTitle": null,
    "dealValue": null
  },
  "attribution": {
    "source": "WEBSITE",
    "sourceUrl": "https://prosify.in/contact",
    "utmSource": "google",
    "utmMedium": "cpc",
    "utmCampaign": "mumbai_luxury_homes",
    "ipAddress": "103.21.244.2"
  }
}
```

---

### Option B: Zoho CRM
- Set: `CRM_PROVIDER="zoho"`
- Set: `CRM_API_ENDPOINT="https://www.zohoapis.in/crm/v2/Leads"`
- Set: `CRM_API_KEY="Zoho-oauthtoken YOUR_ZOHO_OAUTH_TOKEN"`
- The system automatically maps payload to Zoho's `Last_Name`, `Phone`, `Email`, `City`, `Lead_Source`, `Description`, and `UTM_*` fields.

---

### Option C: HubSpot
- Set: `CRM_PROVIDER="hubspot"`
- Set: `CRM_API_ENDPOINT="https://api.hubapi.com/crm/v3/objects/contacts"`
- Set: `CRM_API_KEY="pat-na1-YOUR_HUBSPOT_TOKEN"`
- The system automatically structures payload as `{ properties: { firstname, lastname, phone, email, city, message, utm_source } }`.

---

### Option D: LeadSquared
- Set: `CRM_PROVIDER="leadsquared"`
- Set: `CRM_API_ENDPOINT="https://api-in21.leadsquared.com/v2/LeadManagement.svc/Lead.Capture"`
- Set: `CRM_API_KEY="accessKey=YOUR_KEY&secretKey=YOUR_SECRET"`

---

## 3. Automated Capture Points & Event Triggers Across the Site

The integration automatically triggers on 3 key site events:

1. **Contact & Inquiry Forms (`/contact`, Project pages):**
   - Inputs validated: 10-digit Indian standard mobile number (`/^[6-9]\d{9}$/`), email format.
   - Metadata captured: Full Name, WhatsApp phone, City, Message, Inquiry Category.
   - Automatically captured: Current URL, Timestamp, UTM parameters (`utm_source`, `utm_medium`, `utm_campaign`), and IP address.
   - Anti-spam: Rate limiting (12 req/min/IP) and invisible honeypot trap to block bots.

2. **Affiliate & Partner Signups (`/affiliate`):**
   - Triggered immediately when a partner registers via Google OAuth or Mobile OTP.
   - Payload: Name, Phone, Email, Unique Affiliate ID (e.g. `AFF-ENI-1526`), Registration Date, and Lead Tag `Affiliate_Partner`.

3. **High-Intent CTA Buttons (`<CrmLeadModal />`):**
   - "Request Callback"
   - "Download Brochure" (automatically delivers brochure PDF upon verified submission)
   - "Apply for Affiliate"

---

## 4. Resilience & Exponential Backoff Retry Logic

When a lead is submitted:
1. It is **immediately saved in the local database (`leads` table)** with `crmSyncStatus: "PENDING"`.
2. The background dispatcher attempts to POST the lead to your external CRM endpoint.
3. If the CRM is slow or returns an error, the dispatcher runs an **exponential backoff retry loop (3 attempts)**:
   - Attempt 1: Immediate
   - Attempt 2: After 500ms
   - Attempt 3: After 1,000ms
4. If acknowledged (HTTP 200/201/204), lead is updated to `crmSyncStatus: "SYNCED"`.
5. If the endpoint is down, it is marked `crmSyncStatus: "FAILED"` with the exact error message recorded. You can view all logs and retry with 1 click from the Admin Portal!

---

## 5. How to Test Your Integration

### Via the Admin Portal (Easiest):
1. Navigate to `/admin` &rarr; click **Integrations** tab.
2. Select **CRM Webhook Outbound Dispatcher**.
3. Click the **"Send Test Lead Probe"** button.
4. You will see the live HTTP status, latency, request payload, and CRM response payload in real-time.

### Via cURL:
```bash
curl -X POST http://localhost:3000/api/crm/lead-capture \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Pooja Mehta",
    "phone": "9820144556",
    "email": "pooja.mehta@example.com",
    "city": "Mumbai",
    "inquiryType": "Pre-Launch Developer Discounts",
    "message": "Interested in 2 BHK in Lodha Woods",
    "sourceUrl": "https://prosify.in/projects/lodha-woods",
    "utmSource": "google_ads",
    "utmCampaign": "mumbai_residential"
  }'
```
Response:
```json
{
  "success": true,
  "message": "Thank you! Our representative will contact you shortly.",
  "leadId": "lead-1713299102",
  "leadScore": 65,
  "qualification": "QUALIFIED",
  "crmSyncStatus": "SYNCED",
  "crmConfigured": true,
  "attempts": 1
}
```
