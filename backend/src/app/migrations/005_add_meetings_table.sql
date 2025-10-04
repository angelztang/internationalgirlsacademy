-- Migration 005: Add meetings table for live and normal meetings
-- This table stores meeting information with Zoom integration

CREATE TABLE meetings (
    meeting_id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    meeting_type VARCHAR(50) NOT NULL CHECK (meeting_type IN ('live', 'normal')),
    start_time TIMESTAMP NOT NULL,
    end_time TIMESTAMP NOT NULL,
    max_participants INT,
    meeting_password VARCHAR(255),
    zoom_meeting_id VARCHAR(255),
    zoom_meeting_url VARCHAR(500),
    created_by UUID NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(50) DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'live', 'ended', 'cancelled')),
    FOREIGN KEY (created_by) REFERENCES users(user_id) ON DELETE CASCADE,
    CHECK (end_time > start_time)
);

-- Create indexes for better query performance
CREATE INDEX idx_meetings_created_by ON meetings(created_by);
CREATE INDEX idx_meetings_start_time ON meetings(start_time);
CREATE INDEX idx_meetings_meeting_type ON meetings(meeting_type);
CREATE INDEX idx_meetings_status ON meetings(status);
CREATE INDEX idx_meetings_zoom_id ON meetings(zoom_meeting_id);

-- Add trigger to update updated_at timestamp automatically
CREATE TRIGGER update_meetings_updated_at BEFORE UPDATE ON meetings
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
