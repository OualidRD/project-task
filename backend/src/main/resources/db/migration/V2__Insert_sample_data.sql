-- V2: Sample data (simplified - actual demo data is in V3)
-- This file kept for migration history but real demo data is loaded in V3__Add_demo_data.sql

INSERT INTO users (email, password_hash, full_name, created_at, updated_at)
VALUES ('test@example.com', '$2a$10$BnPxV7SK2Fq3uYHukXDpUe76ZwemHN2imSekAl39lUCM0wdXU1sQy', 'Test User', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
ON CONFLICT (email) DO NOTHING;
