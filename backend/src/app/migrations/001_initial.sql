
-- User Table
CREATE TABLE "User" (
    id SERIAL PRIMARY KEY,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    password VARCHAR(255) NOT NULL,
    experience_points NUMERIC DEFAULT 0,
    user_type VARCHAR(3) NOT NULL,
    gender VARCHAR(50)  -- you could also use ENUM if you want stricter control
);

-- Availability Table
CREATE TABLE Availability (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL,
    time_start TIMESTAMP NOT NULL,
    time_end TIMESTAMP NOT NULL,
    CONSTRAINT fk_availability_user FOREIGN KEY (user_id)
        REFERENCES "User"(id) ON DELETE CASCADE
);

-- Module Table
CREATE TABLE Module (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL,
    module_progress NUMERIC DEFAULT 0,
    CONSTRAINT fk_module_user FOREIGN KEY (user_id)
        REFERENCES "User"(id) ON DELETE CASCADE
);
