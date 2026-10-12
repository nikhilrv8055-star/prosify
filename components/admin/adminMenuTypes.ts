export type AdminMenuKey =
  | 'dashboard'
  // Property Specifications
  | 'spec-settings'
  | 'spec-categories'
  | 'spec-amenities'
  | 'spec-countries'
  | 'spec-states'
  | 'spec-cities'
  // Property Management
  | 'prop-settings'
  | 'prop-add'
  | 'prop-manage'
  | 'prop-featured'
  | 'prop-pricing-all'
  | 'prop-pricing-pending'
  | 'prop-pricing-accepted'
  | 'prop-pricing-rejected'
  | 'prop-messages'
  // Project Management
  | 'proj-settings'
  | 'proj-add'
  | 'proj-manage'
  | 'proj-agents'
  // Package Management
  | 'pkg-settings'
  | 'pkg-packages'
  | 'pkg-menu-builder'
  // Payment Log
  | 'payment-logs'
  // Users Management
  | 'users-registered'
  | 'users-add'
  | 'users-subscribers'
  // Vendors Management
  | 'vendors-settings'
  | 'vendors-registered'
  | 'vendors-add'
  // Agents Management & Panel
  | 'agents-management'
  | 'agents-add'
  | 'agents-cloud-sync'
  // Support Tickets
  | 'tickets-settings'
  | 'tickets-all'
  | 'tickets-pending'
  | 'tickets-open'
  | 'tickets-closed'
  // Home Page CMS
  | 'home-hero'
  | 'home-about'
  | 'home-why-us'
  | 'home-brand'
  | 'home-property'
  | 'home-featured-property'
  | 'home-counter'
  | 'home-city'
  | 'home-testimonial'
  | 'home-vendor'
  | 'home-subscribe'
  | 'home-sections-visibility'
  // Footer CMS
  | 'footer-logo'
  | 'footer-content'
  | 'footer-quick-links'
  | 'footer-custom-pages'
  // Blog Management
  | 'blog-categories'
  | 'blog-posts'
  // FAQ Management
  | 'faq-manage'
  // Advertisements (Photo Ads)
  | 'ads-settings'
  | 'ads-photo-ads'
  | 'ads-announcements'
  // Festival & Seasonal Themes (Indian Celebrations)
  | 'festival-themes'
  | 'festival-banner-ads'
  | 'festival-effects'
  | 'festival-calendar'
  // Basic Settings
  | 'settings-general'
  | 'settings-contact'
  | 'settings-email'
  | 'settings-mail-from'
  | 'settings-mail-to'
  | 'settings-mail-templates'
  | 'settings-breadcrumb'
  | 'settings-page-headings'
  | 'settings-plugins'
  | 'settings-seo'
  | 'settings-maintenance'
  | 'settings-cookie'
  | 'settings-social'
  | 'settings-mobile-app'
  // Payment Gateways
  | 'gateway-online'
  | 'gateway-offline'
  // Admin Management
  | 'admin-roles'
  | 'admin-users'
  | 'admin-languages'
  // Affiliate Program
  | 'affiliate-settings'
  | 'affiliate-members'
  | 'affiliate-conversions'
  | 'affiliate-payouts'
  | 'affiliate-creatives'
  // Other Portals & Sync
  | 'portal-access'
  | 'developer-api'
  | 'crm-pipeline'
  | 'reports-tab';
