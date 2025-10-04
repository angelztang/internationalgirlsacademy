-- Migration 004: Fix user_id to use UUID type for Supabase Auth integration
-- Drop all existing tables and recreate with proper UUID types

-- Drop all tables in reverse dependency order
DROP TABLE IF EXISTS user_modules CASCADE;
DROP TABLE IF EXISTS user_items CASCADE;
DROP TABLE IF EXISTS event_registration CASCADE;
DROP TABLE IF EXISTS availabilities CASCADE;
DROP TABLE IF EXISTS events CASCADE;
DROP TABLE IF EXISTS modules CASCADE;
DROP TABLE IF EXISTS items CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- Create users table with UUID primary key (matches Supabase Auth)
CREATE TABLE users (
    user_id UUID PRIMARY KEY,  -- Changed from INT4 to UUID
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    experience_points INT DEFAULT 0,
    user_type VARCHAR(50) NOT NULL CHECK (user_type IN ('student', 'volunteer', 'organizer')),
    gender VARCHAR(50),
    email VARCHAR(255) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create items table (shop items)
CREATE TABLE items (
    item_id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    cost INT NOT NULL CHECK (cost >= 0),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create modules table (educational modules/pathways)
CREATE TABLE modules (
    module_id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    experience_value INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create events table
CREATE TABLE events (
    event_id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    start_time TIMESTAMP NOT NULL,
    end_time TIMESTAMP NOT NULL,
    location VARCHAR(255),
    max_participants INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create user_items junction table (user purchases from shop)
CREATE TABLE user_items (
    user_id UUID NOT NULL,  -- Changed from INT4 to UUID
    item_id INT NOT NULL,
    purchased_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    equipped BOOLEAN DEFAULT FALSE,
    PRIMARY KEY (user_id, item_id),
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (item_id) REFERENCES items(item_id) ON DELETE CASCADE
);

-- Create user_modules junction table (user progress in modules)
CREATE TABLE user_modules (
    user_id UUID NOT NULL,  -- Changed from INT4 to UUID
    module_id INT NOT NULL,
    progress DECIMAL(5,2) DEFAULT 0.00 CHECK (progress >= 0 AND progress <= 100),
    enrolled_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP,
    PRIMARY KEY (user_id, module_id),
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (module_id) REFERENCES modules(module_id) ON DELETE CASCADE
);

-- Create event_registration junction table
CREATE TABLE event_registration (
    registration_id SERIAL PRIMARY KEY,
    user_id UUID NOT NULL,  -- Changed from INT4 to UUID
    event_id INT NOT NULL,
    registered_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(50) DEFAULT 'registered' CHECK (status IN ('registered', 'attended', 'cancelled')),
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (event_id) REFERENCES events(event_id) ON DELETE CASCADE,
    UNIQUE (user_id, event_id)
);

-- Create availabilities table (volunteer/organizer availability)
CREATE TABLE availabilities (
    availability_id SERIAL PRIMARY KEY,
    user_id UUID NOT NULL,  -- Changed from INT4 to UUID
    time_start TIMESTAMP NOT NULL,
    time_end TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    CHECK (time_end > time_start)
);

-- Create indexes for better query performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_type ON users(user_type);
CREATE INDEX idx_user_items_user ON user_items(user_id);
CREATE INDEX idx_user_items_item ON user_items(item_id);
CREATE INDEX idx_user_modules_user ON user_modules(user_id);
CREATE INDEX idx_user_modules_module ON user_modules(module_id);
CREATE INDEX idx_event_registration_user ON event_registration(user_id);
CREATE INDEX idx_event_registration_event ON event_registration(event_id);
CREATE INDEX idx_availabilities_user ON availabilities(user_id);
CREATE INDEX idx_events_start_time ON events(start_time);

-- Add trigger to update updated_at timestamp automatically
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_events_updated_at BEFORE UPDATE ON events
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-
-- Grant permissions (adjust based on your Supabase setup)
-- GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
-- GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO authenticated;
