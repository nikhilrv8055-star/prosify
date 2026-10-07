-- ==============================================================================
-- Cloudflare D1 Database Seed Data - Prosify Real Estate Marketplace
-- Migration: 0002_seed_data.sql
-- ==============================================================================

-- 1. Insert Developers
INSERT OR IGNORE INTO developers (id, name, slug, logo, experience_years, total_projects, ongoing_projects, rating, city, contact_email, contact_phone)
VALUES 
('dev-godrej', 'Godrej Properties', 'godrej-properties', 'https://images.unsplash.com/photo-1541888946425-d0fbb18f15f7?w=120&auto=format&fit=crop&q=80', 34, 142, 28, 4.9, 'Mumbai', 'corporate@godrejproperties.com', '+91 22 6169 8500'),
('dev-lodha', 'Lodha Luxury', 'lodha-luxury', 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=120&auto=format&fit=crop&q=80', 44, 180, 35, 4.8, 'Mumbai', 'concierge@lodhagroup.com', '+91 22 2302 4400'),
('dev-oberoi', 'Oberoi Realty', 'oberoi-realty', 'https://images.unsplash.com/photo-1577495508048-b635879837f1?w=120&auto=format&fit=crop&q=80', 41, 62, 12, 4.9, 'Mumbai', 'sales@oberoirealty.com', '+91 22 6863 0600'),
('dev-prestige', 'Prestige Group', 'prestige-group', 'https://images.unsplash.com/photo-1554469384-e58fac16e23a?w=120&auto=format&fit=crop&q=80', 38, 285, 48, 4.7, 'Bengaluru', 'properties@prestigeconstructions.com', '+91 80 2559 1080');

-- 2. Insert Projects
INSERT OR IGNORE INTO projects (id, name, slug, developer_id, developer_name, location, city, rera_number, possession_date, starting_price, status, banner_image, total_units, available_units, amenities)
VALUES
('proj-godrej-skyline', 'Godrej Skyline Reserve', 'godrej-skyline-reserve', 'dev-godrej', 'Godrej Properties', 'Bandra West, Marine Vista', 'Mumbai', 'P51800049281', 'Dec 2026', 42000000, 'UNDER_CONSTRUCTION', 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&auto=format&fit=crop&q=80', 120, 18, '["Infinity Sky Pool", "Private Helipad Access", "Concierge Butler Service", "Temperature Controlled Cellar", "EV Superchargers"]'),
('proj-lodha-palacio', 'Lodha Altamount Grandeur', 'lodha-altamount-grandeur', 'dev-lodha', 'Lodha Luxury', 'Altamount Road, Billionaires Row', 'Mumbai', 'P51900028194', 'Ready to Move', 145000000, 'READY_TO_MOVE', 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1200&auto=format&fit=crop&q=80', 45, 4, '["Private Elevator Foyer", "Armani/Casa Furnished Lounge", "Cigar Room", "Heated Lap Pool", "Automated Valet Parking"]'),
('proj-oberoi-elysian', 'Oberoi Sky City Elysian', 'oberoi-sky-city-elysian', 'dev-oberoi', 'Oberoi Realty', 'Borivali East, Western Corridor', 'Mumbai', 'P51800027799', 'Jun 2025', 28500000, 'UNDER_CONSTRUCTION', 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1200&auto=format&fit=crop&q=80', 240, 42, '["25-Acre Integrated Township", "Direct Metro Access", "Squash & Tennis Courts", "Clubhouse with Spa", "Multi-tier Landscaped Greens"]'),
('proj-prestige-golf', 'Prestige Golfshire Signature', 'prestige-golfshire-signature', 'dev-prestige', 'Prestige Group', 'Nandi Hills Foothills', 'Bengaluru', 'PRM/KA/RERA/1250/303/PR/170915/000212', 'Ready to Move', 85000000, 'READY_TO_MOVE', 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=1200&auto=format&fit=crop&q=80', 60, 9, '["18-Hole Championship Golf Course", "JW Marriott Managed Spa", "Private Lake Frontage", "Falcon Helipad"]');

-- 3. Insert Core Properties
INSERT OR IGNORE INTO properties (id, title, slug, description, type, category, price, currency, bedrooms, bathrooms, carpet_area_sqft, builtup_area_sqft, location, address, city, state, pincode, latitude, longitude, project_id, developer_id, status, images, amenities, featured, verified, exclusive)
VALUES
('prop-101', 'Godrej Horizon Sea-Facing 4BHK Penthouse', 'godrej-horizon-sea-facing-4bhk-penthouse', 'High-floor ultra luxury duplex penthouse with 270-degree Arabian Sea panorama, double-height living room and private lap terrace.', 'BUY', 'PENTHOUSE', 89000000, 'INR', 4, 5, 3450, 4200, 'Worli Sea Face', 'Tower A, Floor 44, Worli Promenade', 'Mumbai', 'Maharashtra', '400018', 18.9986, 72.8152, 'proj-godrej-skyline', 'dev-godrej', 'AVAILABLE', '["https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&auto=format&fit=crop&q=80", "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&auto=format&fit=crop&q=80"]', '["Sea View", "Private Pool", "High Speed Lifts", "Servant Quarters", "3 Car Parks", "Italian Marble Flooring"]', 1, 1, 1),
('prop-102', 'Lodha Altamount Bespoke Sky Villa', 'lodha-altamount-bespoke-sky-villa', 'One residence per floor bespoke architectural masterpiece with bulletproof glass facade, curated art galleries and dedicated butler service.', 'BUY', 'VILLA', 185000000, 'INR', 5, 6, 6200, 7800, 'Altamount Road', 'Altamount Heights, Billionaires Row', 'Mumbai', 'Maharashtra', '400026', 18.9696, 72.8094, 'proj-lodha-palacio', 'dev-lodha', 'AVAILABLE', '["https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1200&auto=format&fit=crop&q=80", "https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?w=1200&auto=format&fit=crop&q=80"]', '["Concierge", "Helipad Access", "Smart Automation", "Armani Interiors", "4 Covered Parks"]', 1, 1, 1),
('prop-103', 'Oberoi Sky View Designer 3BHK Residence', 'oberoi-sky-view-designer-3bhk-residence', 'Vastu-compliant east-facing luxury 3-bedroom apartment with sprawling balcony, modular European kitchen and panoramic skyline sights.', 'RENT', 'APARTMENT', 180000, 'INR', 3, 3, 1680, 2100, 'Bandra Kurla Complex (BKC)', 'BKC Avenue 4, Near Diamond Bourse', 'Mumbai', 'Maharashtra', '400051', 19.0657, 72.8687, 'proj-oberoi-elysian', 'dev-oberoi', 'AVAILABLE', '["https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1200&auto=format&fit=crop&q=80", "https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=1200&auto=format&fit=crop&q=80"]', '["Fully Furnished", "Clubhouse", "Gymnasium", "2 Covered Parks", "Power Backup"]', 0, 1, 0),
('prop-104', 'Prestige Golfshire Fairway 4BHK Villa', 'prestige-golfshire-fairway-4bhk-villa', 'Private lake and golf front standalone independent Spanish villa with heated outdoor jacuzzi, landscaped gardens and double-car garage.', 'BUY', 'VILLA', 95000000, 'INR', 4, 5, 5400, 6800, 'Nandi Hills', 'Fairway Lane 7, Prestige Golfshire', 'Bengaluru', 'Karnataka', '562110', 13.3702, 77.6835, 'proj-prestige-golf', 'dev-prestige', 'AVAILABLE', '["https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=1200&auto=format&fit=crop&q=80", "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=1200&auto=format&fit=crop&q=80"]', '["Golf Course Access", "Private Lawn", "Lake View", "Solar Powered", "Jacuzzi"]', 1, 1, 1);

-- 4. Insert Channel Partners
INSERT OR IGNORE INTO channel_partners (id, name, company_name, email, phone, rera_reg_number, tier, commission_rate, active_leads_count, total_deal_volume, total_commission_paid, status)
VALUES
('cp-1', 'Rajesh K. Singhania', 'Apex Premier Estates', 'rajesh@apexestates.in', '+91 98201 12345', 'A51900018274', 'PLATINUM', 2.5, 14, 185000000, 4625000, 'ACTIVE'),
('cp-2', 'Priya S. Nambiar', 'MetroSquare Advisory', 'priya@metrosquare.co', '+91 98450 67890', 'A51800029381', 'GOLD', 2.2, 9, 92000000, 2024000, 'ACTIVE'),
('cp-3', 'Vikramaditya Mehta', 'South Bombay Realty Group', 'vikram@soborealty.com', '+91 98210 54321', 'A51900038492', 'PLATINUM', 2.5, 21, 340000000, 8500000, 'ACTIVE');

-- 5. Insert Sample CRM Leads
INSERT OR IGNORE INTO leads (id, name, phone, email, property_id, project_id, budget, source, status, partner_id, notes, assigned_agent)
VALUES
('lead-1', 'Dr. Arvind Swaminathan', '+91 98199 87654', 'arvind.swami@apollohospitals.org', 'prop-101', 'proj-godrej-skyline', 90000000, 'GOOGLE_SEARCH', 'SITE_VISIT_SCHEDULED', 'cp-1', 'Interested in high-floor 4BHK with Arabian sea facing balcony. Weekend visit confirmed.', 'Kunal Sharma (Senior VP)'),
('lead-2', 'Meera Singhal', '+91 98200 44332', 'meera.s@techventures.vc', 'prop-102', 'proj-lodha-palacio', 180000000, 'DIRECT_REFERRAL', 'NEGOTIATION', 'cp-3', 'Looking for single floor floorplate. Financial pre-approval completed with HDFC Wealth.', 'Ananya Deshmukh (Director)');

-- 6. Insert Admin Notifications
INSERT OR IGNORE INTO admin_notifications (id, title, description, type, is_read)
VALUES
('notif-1', 'Cloudflare D1 Online', 'Edge Database connection successfully verified on Cloudflare Edge runtime.', 'SUCCESS', 0),
('notif-2', 'High-Ticket HNI Lead Received', 'Dr. Arvind Swaminathan expressed interest in Godrej Horizon 4BHK Penthouse.', 'LEAD', 0),
('notif-3', 'Quarterly RERA Compliance Synchronized', 'All MahaRERA filings verified up to date for ongoing projects.', 'SYSTEM', 0);
