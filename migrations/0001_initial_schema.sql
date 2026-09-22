-- ==============================================================================
-- Cloudflare D1 Database Schema - Prosify Real Estate Marketplace
-- Migration: 0001_initial_schema.sql
-- ==============================================================================

-- Developers Table
CREATE TABLE IF NOT EXISTS developers (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  logo TEXT,
  experience_years INTEGER DEFAULT 0,
  total_projects INTEGER DEFAULT 0,
  ongoing_projects INTEGER DEFAULT 0,
  rating REAL DEFAULT 4.5,
  city TEXT NOT NULL,
  contact_email TEXT,
  contact_phone TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Projects Table
CREATE TABLE IF NOT EXISTS projects (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  developer_id TEXT NOT NULL,
  developer_name TEXT NOT NULL,
  location TEXT NOT NULL,
  city TEXT NOT NULL,
  rera_number TEXT,
  possession_date TEXT,
  starting_price REAL DEFAULT 0,
  status TEXT DEFAULT 'UNDER_CONSTRUCTION',
  banner_image TEXT,
  brochure_url TEXT,
  total_units INTEGER DEFAULT 0,
  available_units INTEGER DEFAULT 0,
  amenities TEXT, -- JSON string array
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (developer_id) REFERENCES developers(id) ON DELETE CASCADE
);

-- Properties Table
CREATE TABLE IF NOT EXISTS properties (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  type TEXT NOT NULL, -- BUY, RENT, COMMERCIAL, PG
  category TEXT DEFAULT 'APARTMENT', -- APARTMENT, VILLA, PENTHOUSE, PLOT
  price REAL NOT NULL,
  currency TEXT DEFAULT 'INR',
  bedrooms INTEGER DEFAULT 1,
  bathrooms INTEGER DEFAULT 1,
  carpet_area_sqft REAL,
  builtup_area_sqft REAL,
  location TEXT NOT NULL,
  address TEXT,
  city TEXT NOT NULL,
  state TEXT,
  pincode TEXT,
  latitude REAL,
  longitude REAL,
  project_id TEXT,
  developer_id TEXT,
  status TEXT DEFAULT 'AVAILABLE', -- AVAILABLE, UNDER_OFFER, SOLD, RENTED
  images TEXT, -- JSON string array of URLs
  amenities TEXT, -- JSON string array
  featured INTEGER DEFAULT 0,
  verified INTEGER DEFAULT 1,
  exclusive INTEGER DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE SET NULL,
  FOREIGN KEY (developer_id) REFERENCES developers(id) ON DELETE SET NULL
);

-- Units / Inventory Table
CREATE TABLE IF NOT EXISTS units (
  id TEXT PRIMARY KEY,
  property_id TEXT,
  project_id TEXT,
  unit_number TEXT NOT NULL,
  tower TEXT,
  floor INTEGER,
  type TEXT, -- 2BHK, 3BHK, etc.
  super_area REAL,
  carpet_area REAL,
  base_price REAL NOT NULL,
  facing TEXT,
  status TEXT DEFAULT 'AVAILABLE', -- AVAILABLE, HOLD, BLOCKED, BOOKED
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Channel Partners Table
CREATE TABLE IF NOT EXISTS channel_partners (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  company_name TEXT,
  email TEXT UNIQUE NOT NULL,
  phone TEXT NOT NULL,
  rera_reg_number TEXT,
  tier TEXT DEFAULT 'SILVER', -- SILVER, GOLD, PLATINUM
  commission_rate REAL DEFAULT 2.0,
  active_leads_count INTEGER DEFAULT 0,
  total_deal_volume REAL DEFAULT 0,
  total_commission_paid REAL DEFAULT 0,
  status TEXT DEFAULT 'ACTIVE', -- ACTIVE, PENDING, SUSPENDED
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Leads Table
CREATE TABLE IF NOT EXISTS leads (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT,
  property_id TEXT,
  project_id TEXT,
  budget REAL,
  source TEXT DEFAULT 'WEBSITE',
  status TEXT DEFAULT 'NEW', -- NEW, CONTACTED, SITE_VISIT_SCHEDULED, NEGOTIATION, WON, LOST
  partner_id TEXT,
  notes TEXT,
  assigned_agent TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (partner_id) REFERENCES channel_partners(id) ON DELETE SET NULL
);

-- Site Visits Table
CREATE TABLE IF NOT EXISTS site_visits (
  id TEXT PRIMARY KEY,
  lead_id TEXT NOT NULL,
  property_id TEXT,
  project_id TEXT,
  scheduled_at DATETIME NOT NULL,
  status TEXT DEFAULT 'SCHEDULED', -- SCHEDULED, COMPLETED, RESCHEDULED, CANCELLED
  partner_id TEXT,
  notes TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (lead_id) REFERENCES leads(id) ON DELETE CASCADE
);

-- Bookings Table
CREATE TABLE IF NOT EXISTS bookings (
  id TEXT PRIMARY KEY,
  lead_id TEXT,
  property_id TEXT,
  unit_number TEXT,
  buyer_name TEXT NOT NULL,
  total_amount REAL NOT NULL,
  booking_token_amount REAL NOT NULL,
  partner_id TEXT,
  commission_amount REAL DEFAULT 0,
  status TEXT DEFAULT 'CONFIRMED', -- CONFIRMED, CANCELLED, COMPLETED
  booking_date DATETIME DEFAULT CURRENT_TIMESTAMP,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Commissions Table
CREATE TABLE IF NOT EXISTS commissions (
  id TEXT PRIMARY KEY,
  booking_id TEXT NOT NULL,
  partner_id TEXT NOT NULL,
  amount REAL NOT NULL,
  status TEXT DEFAULT 'PENDING', -- PENDING, APPROVED, PAID
  paid_at DATETIME,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (partner_id) REFERENCES channel_partners(id) ON DELETE CASCADE
);

-- Notifications Table
CREATE TABLE IF NOT EXISTS admin_notifications (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  type TEXT DEFAULT 'INFO',
  is_read INTEGER DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Audit Logs Table
CREATE TABLE IF NOT EXISTS audit_logs (
  id TEXT PRIMARY KEY,
  user_name TEXT NOT NULL,
  action TEXT NOT NULL,
  entity TEXT NOT NULL,
  details TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Developer Sync Sources Table
CREATE TABLE IF NOT EXISTS sync_sources (
  id TEXT PRIMARY KEY,
  developer_id TEXT NOT NULL,
  source_type TEXT NOT NULL, -- SALESFORCE, ZOHO, CSV, JSON_FEED
  api_endpoint TEXT,
  sync_frequency TEXT DEFAULT 'HOURLY',
  last_sync_status TEXT DEFAULT 'IDLE',
  last_sync_at DATETIME,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for lightning fast Cloudflare Edge Queries
CREATE INDEX IF NOT EXISTS idx_properties_type ON properties(type);
CREATE INDEX IF NOT EXISTS idx_properties_city ON properties(city);
CREATE INDEX IF NOT EXISTS idx_properties_price ON properties(price);
CREATE INDEX IF NOT EXISTS idx_properties_status ON properties(status);
CREATE INDEX IF NOT EXISTS idx_projects_city ON projects(city);
CREATE INDEX IF NOT EXISTS idx_leads_status ON leads(status);
CREATE INDEX IF NOT EXISTS idx_leads_partner ON leads(partner_id);
