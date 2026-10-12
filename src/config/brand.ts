/**
 * Centralized Brand Configuration for Prosify
 * All UI components, metadata, portals, and templates consume this configuration.
 */

export const brandConfig = {
  name: "Prosify",
  shortName: "Prosify",
  adminName: "Prosify Admin",
  partnerPortalName: "Prosify Partner Network",
  developerPortalName: "Prosify Developer Portal",
  tagline: "Your trusted real-estate marketplace.",
  companyLegalName: "Prosify Technologies Private Limited",
  reraRegistration: "MahaRERA Reg: A51900018924",
  domains: {
    public: process.env.PUBLIC_APP_URL || "https://www.prosify.in",
    admin: process.env.ADMIN_APP_URL || "https://admin.prosify.in",
    partner: process.env.PARTNER_APP_URL || "https://partner.prosify.in",
    developer: process.env.DEVELOPER_APP_URL || "https://developer.prosify.in",
  },
  colors: {
    primary: "#D4A017",
    accent: "#F4C430",
    dark: "#171717",
    background: "#F8F8F6",
    white: "#FFFFFF",
  },
  contact: {
    email: "advisory@prosify.in",
    supportEmail: "support@prosify.in",
    phone: "+91 98200 11223",
    whatsapp: "+91 93263 03244",
    address: "Prosify Chambers, Senapati Bapat Marg, Lower Parel, Mumbai, Maharashtra 400013",
  },
  auth: {
    defaultAdminEmail: "admin@prosify.in",
    defaultAdminPassword: "prosify@123#",
    isDevEnv: process.env.NODE_ENV !== "production",
  },
} as const;

export const BRAND_NAME = brandConfig.name;
