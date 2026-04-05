-- Run this in your Supabase SQL editor
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS leads (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT NOT NULL,
  address TEXT,
  city TEXT,
  state TEXT DEFAULT 'FL',
  property_condition TEXT,
  timeframe TEXT,
  message TEXT,
  type TEXT DEFAULT 'lead',
  source_page TEXT,
  utm_source TEXT,
  utm_medium TEXT,
  utm_campaign TEXT,
  landing_page TEXT,
  referrer TEXT,
  status TEXT DEFAULT 'new',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_leads_status ON leads(status);
CREATE INDEX IF NOT EXISTS idx_leads_city ON leads(city);
CREATE INDEX IF NOT EXISTS idx_leads_created ON leads(created_at DESC);

ALTER TABLE leads ENABLE ROW LEVEL SECURITY;

-- Allow inserts from anon key (for the lead capture function)
CREATE POLICY "Allow anon inserts" ON leads
  FOR INSERT WITH CHECK (true);

-- Allow service role full access
CREATE POLICY "Service role full access" ON leads
  FOR ALL USING (auth.role() = 'service_role');

-- Allow anon to read own leads (for thank-you page confirmation)
CREATE POLICY "Allow anon select" ON leads
  FOR SELECT USING (true);
