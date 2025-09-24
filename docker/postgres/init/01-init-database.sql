-- Initialize SPPG SaaS Platform Database
-- This script runs automatically when PostgreSQL container starts for the first time

-- Create extensions needed for the application
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";
CREATE EXTENSION IF NOT EXISTS "btree_gin";

-- Create additional user for application with limited privileges
CREATE USER sppg_app WITH PASSWORD 'sppg_app_2025';

-- Grant necessary permissions to application user
GRANT CONNECT ON DATABASE sppg_saas_platform TO sppg_app;
GRANT USAGE ON SCHEMA public TO sppg_app;
GRANT CREATE ON SCHEMA public TO sppg_app;

-- Set default privileges for future tables
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO sppg_app;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT USAGE, SELECT ON SEQUENCES TO sppg_app;

-- Create logging table for audit purposes
CREATE TABLE IF NOT EXISTS audit_log (
    id SERIAL PRIMARY KEY,
    table_name VARCHAR(100) NOT NULL,
    operation VARCHAR(10) NOT NULL,
    old_data JSONB,
    new_data JSONB,
    user_id VARCHAR(100),
    sppg_id VARCHAR(100),
    timestamp TIMESTAMP DEFAULT NOW()
);

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_audit_log_timestamp ON audit_log(timestamp);
CREATE INDEX IF NOT EXISTS idx_audit_log_table_operation ON audit_log(table_name, operation);
CREATE INDEX IF NOT EXISTS idx_audit_log_sppg_id ON audit_log(sppg_id);

-- Grant permissions on audit table
GRANT SELECT, INSERT ON audit_log TO sppg_app;
GRANT USAGE, SELECT ON SEQUENCE audit_log_id_seq TO sppg_app;

-- Display setup completion message
DO $$
BEGIN
    RAISE NOTICE 'SPPG SaaS Platform database initialization completed successfully!';
    RAISE NOTICE 'Database: sppg_saas_platform';
    RAISE NOTICE 'Admin User: sppg_admin';
    RAISE NOTICE 'App User: sppg_app';
    RAISE NOTICE 'Extensions installed: uuid-ossp, pg_trgm, btree_gin';
END $$;