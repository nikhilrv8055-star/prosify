-- ==============================================================================
-- Cloudflare D1 Database Schema - Prosify Multi-Panel & Affiliate Ecosystem
-- Migration: 0002_affiliate_panels.sql
-- ==============================================================================

-- 1. Users Table (Homebuyers, Investors & General App Users)
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  google_id TEXT UNIQUE,
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  phone TEXT,
  role TEXT DEFAULT 'CUSTOMER',
  profile_picture TEXT,
  referrer_id TEXT,
  account_balance REAL DEFAULT 0.00,
  commission_balance REAL DEFAULT 0.00,
  available_balance REAL DEFAULT 0.00,
  total_earned REAL DEFAULT 0.00,
  total_withdrawn REAL DEFAULT 0.00,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 2. Vendors Table (Developers, Builders & Material Providers)
CREATE TABLE IF NOT EXISTS vendors (
  id TEXT PRIMARY KEY, -- Format: VND-XXXXXX
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  phone TEXT,
  company_name TEXT,
  password_hash TEXT NOT NULL,
  status TEXT DEFAULT 'ACTIVE',
  account_balance REAL DEFAULT 0.00,
  commission_balance REAL DEFAULT 0.00,
  available_balance REAL DEFAULT 0.00,
  total_earned REAL DEFAULT 0.00,
  total_withdrawn REAL DEFAULT 0.00,
  created_by_admin TEXT DEFAULT 'ADMIN',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 3. Agents Table (Certified Real Estate Agents & Channel Partners)
CREATE TABLE IF NOT EXISTS agents (
  id TEXT PRIMARY KEY, -- Format: AGT-XXXXXX
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  phone TEXT,
  agency_name TEXT,
  rera_number TEXT,
  password_hash TEXT NOT NULL,
  status TEXT DEFAULT 'ACTIVE',
  account_balance REAL DEFAULT 0.00,
  commission_balance REAL DEFAULT 0.00,
  available_balance REAL DEFAULT 0.00,
  total_earned REAL DEFAULT 0.00,
  total_withdrawn REAL DEFAULT 0.00,
  created_by_admin TEXT DEFAULT 'ADMIN',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 4. Affiliate Accounts Table
CREATE TABLE IF NOT EXISTS affiliate_accounts (
  user_id TEXT PRIMARY KEY,
  referral_code TEXT UNIQUE NOT NULL,
  tier TEXT DEFAULT 'SILVER',
  commission_rate REAL DEFAULT 2.50,
  account_balance REAL DEFAULT 0.00,
  commission_balance REAL DEFAULT 0.00,
  available_balance REAL DEFAULT 0.00,
  total_earned REAL DEFAULT 0.00,
  total_withdrawn REAL DEFAULT 0.00,
  referral_count INTEGER DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 5. Commissions Table
CREATE TABLE IF NOT EXISTS commissions (
  id TEXT PRIMARY KEY,
  referrer_id TEXT NOT NULL,
  buyer_id TEXT,
  property_id TEXT,
  amount REAL DEFAULT 0.00,
  deal_value REAL DEFAULT 0.00,
  status TEXT DEFAULT 'earned',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (referrer_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 6. Withdrawal Requests Table
CREATE TABLE IF NOT EXISTS withdrawal_requests (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  user_type TEXT DEFAULT 'AFFILIATE',
  amount REAL NOT NULL,
  method TEXT NOT NULL, -- Bank Transfer, UPI, PayPal
  account_details TEXT NOT NULL,
  status TEXT DEFAULT 'pending', -- pending, approved, rejected
  requested_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  processed_at DATETIME,
  processed_by TEXT,
  admin_notes TEXT,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 7. Performance & Edge Indexes
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_google_id ON users(google_id);
CREATE INDEX IF NOT EXISTS idx_vendors_email ON vendors(email);
CREATE INDEX IF NOT EXISTS idx_agents_email ON agents(email);
CREATE INDEX IF NOT EXISTS idx_affiliate_referral_code ON affiliate_accounts(referral_code);
CREATE INDEX IF NOT EXISTS idx_commissions_referrer ON commissions(referrer_id);
CREATE INDEX IF NOT EXISTS idx_withdrawal_requests_user ON withdrawal_requests(user_id);
CREATE INDEX IF NOT EXISTS idx_withdrawal_requests_status ON withdrawal_requests(status);
