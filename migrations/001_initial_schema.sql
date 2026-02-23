-- Lawnies2 Initial Schema
-- Run with: psql -U postgres -d lawnies2 -f migrations/001_initial_schema.sql

-- Enable UUID generation
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- operators: created by Stripe webhook after successful payment
CREATE TABLE IF NOT EXISTS operators (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  business_name VARCHAR(255) NOT NULL,
  phone VARCHAR(50) NOT NULL,
  slug VARCHAR(255) UNIQUE,
  stripe_customer_id VARCHAR(255),
  stripe_subscription_id VARCHAR(255),
  stripe_checkout_session_id VARCHAR(255),
  subscription_status VARCHAR(50) DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- pending_signups: temporary pre-payment record (24h expiry)
CREATE TABLE IF NOT EXISTS pending_signups (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  business_name VARCHAR(255) NOT NULL,
  phone VARCHAR(50) NOT NULL,
  stripe_checkout_session_id VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() + INTERVAL '24 hours'
);

-- system_settings: key/value store with encryption for sensitive values
CREATE TABLE IF NOT EXISTS system_settings (
  id SERIAL PRIMARY KEY,
  category VARCHAR(100) NOT NULL,
  key VARCHAR(100) NOT NULL,
  value TEXT,
  is_encrypted BOOLEAN DEFAULT FALSE,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_by UUID,
  UNIQUE(category, key)
);

-- onboarding_responses: survey answers from welcome page
CREATE TABLE IF NOT EXISTS onboarding_responses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  operator_id UUID REFERENCES operators(id) ON DELETE SET NULL,
  session_id VARCHAR(255),
  responses JSONB NOT NULL DEFAULT '{}',
  submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- users: super admin only (NextAuth)
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  email_verified TIMESTAMP WITH TIME ZONE,
  password_hash VARCHAR(255),
  name VARCHAR(255) NOT NULL,
  role VARCHAR(50) NOT NULL DEFAULT 'super_admin',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- sessions: NextAuth sessions (for database strategy if needed)
CREATE TABLE IF NOT EXISTS sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_token VARCHAR(255) UNIQUE NOT NULL,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  expires TIMESTAMP WITH TIME ZONE NOT NULL
);

-- accounts: NextAuth OAuth accounts
CREATE TABLE IF NOT EXISTS accounts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  type VARCHAR(255) NOT NULL,
  provider VARCHAR(255) NOT NULL,
  provider_account_id VARCHAR(255) NOT NULL,
  refresh_token TEXT,
  access_token TEXT,
  expires_at BIGINT,
  token_type VARCHAR(255),
  scope VARCHAR(255),
  id_token TEXT,
  UNIQUE(provider, provider_account_id)
);

-- verification_tokens: NextAuth email verification
CREATE TABLE IF NOT EXISTS verification_tokens (
  identifier VARCHAR(255) NOT NULL,
  token VARCHAR(255) NOT NULL,
  expires TIMESTAMP WITH TIME ZONE NOT NULL,
  UNIQUE(identifier, token)
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_operators_email ON operators(email);
CREATE INDEX IF NOT EXISTS idx_operators_stripe_customer ON operators(stripe_customer_id);
CREATE INDEX IF NOT EXISTS idx_operators_stripe_checkout ON operators(stripe_checkout_session_id);
CREATE INDEX IF NOT EXISTS idx_pending_signups_email ON pending_signups(email);
CREATE INDEX IF NOT EXISTS idx_pending_signups_expires ON pending_signups(expires_at);
CREATE INDEX IF NOT EXISTS idx_system_settings_category ON system_settings(category);
CREATE INDEX IF NOT EXISTS idx_onboarding_responses_operator ON onboarding_responses(operator_id);
CREATE INDEX IF NOT EXISTS idx_onboarding_responses_session ON onboarding_responses(session_id);
CREATE INDEX IF NOT EXISTS idx_sessions_token ON sessions(session_token);
CREATE INDEX IF NOT EXISTS idx_sessions_user ON sessions(user_id);
