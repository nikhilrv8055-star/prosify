-- ============================================================================
-- PROSIFY REAL ESTATE - AFFILIATE PROGRAM DATABASE SCHEMA (SUPABASE / POSTGRESQL)
-- Includes Row Level Security (RLS) policies, triggers, and balance synchronization.
-- ============================================================================

-- 1. Create Custom Types / Enums
CREATE TYPE affiliate_tier AS ENUM ('Bronze', 'Silver', 'Gold', 'Diamond');
CREATE TYPE affiliate_status AS ENUM ('ACTIVE', 'SUSPENDED');
CREATE TYPE commission_status AS ENUM ('PENDING', 'APPROVED', 'PROCESSED', 'REJECTED');
CREATE TYPE payout_status AS ENUM ('PENDING', 'APPROVED', 'PROCESSED', 'REJECTED');
CREATE TYPE payout_method AS ENUM ('UPI', 'NEFT', 'IMPS');

-- 2. Affiliates Profile Table
CREATE TABLE IF NOT EXISTS public.affiliates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(50),
    referral_code VARCHAR(100) UNIQUE NOT NULL,
    custom_slug VARCHAR(100) UNIQUE,
    tier affiliate_tier DEFAULT 'Bronze',
    commission_rate_percent NUMERIC(5, 2) DEFAULT 2.50,
    available_balance NUMERIC(12, 2) DEFAULT 0.00 CHECK (available_balance >= 0),
    pending_balance NUMERIC(12, 2) DEFAULT 0.00 CHECK (pending_balance >= 0),
    lifetime_earnings NUMERIC(12, 2) DEFAULT 0.00 CHECK (lifetime_earnings >= 0),
    total_clicks INTEGER DEFAULT 0 CHECK (total_clicks >= 0),
    total_conversions INTEGER DEFAULT 0 CHECK (total_conversions >= 0),
    status affiliate_status DEFAULT 'ACTIVE',
    bank_account_holder VARCHAR(255),
    bank_account_number VARCHAR(100),
    bank_ifsc VARCHAR(50),
    bank_name VARCHAR(255),
    upi_id VARCHAR(100),
    email_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexing for fast lookups
CREATE INDEX IF NOT EXISTS idx_affiliates_referral_code ON public.affiliates(referral_code);
CREATE INDEX IF NOT EXISTS idx_affiliates_user_id ON public.affiliates(user_id);
CREATE INDEX IF NOT EXISTS idx_affiliates_email ON public.affiliates(email);

-- 3. Referrals & Clicks Tracking Table
CREATE TABLE IF NOT EXISTS public.referrals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    affiliate_id UUID REFERENCES public.affiliates(id) ON DELETE CASCADE,
    referral_code VARCHAR(100) NOT NULL,
    ip_address INET,
    user_agent TEXT,
    landing_page TEXT DEFAULT '/',
    utm_source VARCHAR(100),
    utm_medium VARCHAR(100),
    utm_campaign VARCHAR(100),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_referrals_affiliate_id ON public.referrals(affiliate_id);
CREATE INDEX IF NOT EXISTS idx_referrals_referral_code ON public.referrals(referral_code);
CREATE INDEX IF NOT EXISTS idx_referrals_created_at ON public.referrals(created_at);

-- 4. Commissions Table (Post-Purchase Conversion Attribution)
CREATE TABLE IF NOT EXISTS public.commissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    affiliate_id UUID REFERENCES public.affiliates(id) ON DELETE CASCADE,
    referral_code VARCHAR(100) NOT NULL,
    order_id VARCHAR(100) NOT NULL,
    buyer_name VARCHAR(255),
    buyer_phone VARCHAR(50),
    deal_amount NUMERIC(14, 2) NOT NULL,
    commission_percent NUMERIC(5, 2) NOT NULL,
    commission_amount NUMERIC(12, 2) NOT NULL,
    description TEXT,
    status commission_status DEFAULT 'PENDING',
    rejection_reason TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    approved_at TIMESTAMPTZ,
    processed_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_commissions_affiliate_id ON public.commissions(affiliate_id);
CREATE INDEX IF NOT EXISTS idx_commissions_order_id ON public.commissions(order_id);
CREATE INDEX IF NOT EXISTS idx_commissions_status ON public.commissions(status);

-- 5. Withdrawal & Payout Requests Table
CREATE TABLE IF NOT EXISTS public.payout_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    affiliate_id UUID REFERENCES public.affiliates(id) ON DELETE CASCADE,
    amount NUMERIC(12, 2) NOT NULL CHECK (amount >= 1000.00),
    tds_amount NUMERIC(12, 2) DEFAULT 0.00,
    net_amount NUMERIC(12, 2) NOT NULL,
    payout_method payout_method DEFAULT 'UPI',
    payout_details TEXT NOT NULL,
    status payout_status DEFAULT 'PENDING',
    transaction_ref VARCHAR(255),
    rejection_note TEXT,
    requested_at TIMESTAMPTZ DEFAULT NOW(),
    processed_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_payout_requests_affiliate_id ON public.payout_requests(affiliate_id);
CREATE INDEX IF NOT EXISTS idx_payout_requests_status ON public.payout_requests(status);

-- ============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================================

-- Enable RLS on all tables
ALTER TABLE public.affiliates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.referrals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.commissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payout_requests ENABLE ROW LEVEL SECURITY;

-- 1. Affiliates RLS: Users can only see/update their own profile; Admins see all
CREATE POLICY "Affiliates can view own profile"
    ON public.affiliates FOR SELECT
    USING (auth.uid() = user_id OR auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Affiliates can update own banking details"
    ON public.affiliates FOR UPDATE
    USING (auth.uid() = user_id OR auth.jwt() ->> 'role' = 'admin')
    WITH CHECK (auth.uid() = user_id OR auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Admins have full access to affiliates"
    ON public.affiliates FOR ALL
    USING (auth.jwt() ->> 'role' = 'admin');

-- 2. Referrals RLS: Public insert allowed (visitor clicks); Affiliates see own; Admins see all
CREATE POLICY "Public can insert referral clicks"
    ON public.referrals FOR INSERT
    WITH CHECK (true);

CREATE POLICY "Affiliates can view own referral clicks"
    ON public.referrals FOR SELECT
    USING (
        affiliate_id IN (SELECT id FROM public.affiliates WHERE user_id = auth.uid())
        OR auth.jwt() ->> 'role' = 'admin'
    );

-- 3. Commissions RLS: Affiliates view own; Admins manage all
CREATE POLICY "Affiliates can view own commissions"
    ON public.commissions FOR SELECT
    USING (
        affiliate_id IN (SELECT id FROM public.affiliates WHERE user_id = auth.uid())
        OR auth.jwt() ->> 'role' = 'admin'
    );

CREATE POLICY "Admins manage commissions"
    ON public.commissions FOR ALL
    USING (auth.jwt() ->> 'role' = 'admin');

-- 4. Payout Requests RLS: Affiliates can create and view own requests; Admins manage all
CREATE POLICY "Affiliates can view own payout requests"
    ON public.payout_requests FOR SELECT
    USING (
        affiliate_id IN (SELECT id FROM public.affiliates WHERE user_id = auth.uid())
        OR auth.jwt() ->> 'role' = 'admin'
    );

CREATE POLICY "Affiliates can request payout"
    ON public.payout_requests FOR INSERT
    WITH CHECK (
        affiliate_id IN (SELECT id FROM public.affiliates WHERE user_id = auth.uid())
    );

CREATE POLICY "Admins manage payout requests"
    ON public.payout_requests FOR ALL
    USING (auth.jwt() ->> 'role' = 'admin');

-- ============================================================================
-- REAL-TIME BALANCE DEBIT TRIGGER FUNCTION
-- Automatically debits affiliate available balance when status is 'PROCESSED'
-- ============================================================================
CREATE OR REPLACE FUNCTION public.handle_payout_processed()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.status = 'PROCESSED' AND OLD.status != 'PROCESSED' THEN
        -- Debit the affiliate's balance in real-time
        UPDATE public.affiliates
        SET 
            available_balance = available_balance - NEW.amount,
            lifetime_earnings = lifetime_earnings + NEW.net_amount,
            updated_at = NOW()
        WHERE id = NEW.affiliate_id;

        NEW.processed_at = NOW();
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER trigger_payout_processed
    BEFORE UPDATE ON public.payout_requests
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_payout_processed();
