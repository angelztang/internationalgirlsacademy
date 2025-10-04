-- User Table
CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    password VARCHAR(255) NOT NULL,
    experience_points NUMERIC DEFAULT 0,
    user_type VARCHAR(3) NOT NULL,
    gender VARCHAR(50) -- could also use ENUM if you want stricter control
);

-- Items Table
CREATE TABLE items (
    item_id SERIAL PRIMARY KEY,
    name VARCHAR(100),
    cost INT,
    user_id INT,
    CONSTRAINT fk_item_user FOREIGN KEY (user_id) REFERENCES users (user_id) ON DELETE CASCADE
);

-- Events Table
CREATE TABLE events (
    event_id SERIAL PRIMARY KEY,
    start_time TIMESTAMP,
    end_time TIMESTAMP
);

-- Event Registration Table
CREATE TABLE event_registration (
    registration_id SERIAL PRIMARY KEY,
    user_id INT,
    event_id INT,
    CONSTRAINT fk_registration_user FOREIGN KEY (user_id) REFERENCES users (user_id) ON DELETE CASCADE,
    CONSTRAINT fk_registration_event FOREIGN KEY (event_id) REFERENCES events (event_id) ON DELETE CASCADE
);

-- Availability Table
CREATE TABLE availabilities (
    availability_id SERIAL PRIMARY KEY,
    user_id INT NOT NULL,
    time_start TIMESTAMP NOT NULL,
    time_end TIMESTAMP NOT NULL,
    CONSTRAINT fk_availability_user FOREIGN KEY (user_id) REFERENCES users (user_id) ON DELETE CASCADE
);

-- Modules Table
CREATE TABLE modules (
    module_id SERIAL PRIMARY KEY,
    user_id INT NOT NULL,
    module_progress NUMERIC DEFAULT 0,
    CONSTRAINT fk_module_user FOREIGN KEY (user_id) REFERENCES users (user_id) ON DELETE CASCADE
);