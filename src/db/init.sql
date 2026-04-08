-- Create schools table
CREATE TABLE IF NOT EXISTS schools (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    address VARCHAR(500) NOT NULL,
    latitude FLOAT NOT NULL,
    longitude FLOAT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create index on coordinates for faster queries
CREATE INDEX IF NOT EXISTS idx_school_coordinates ON schools(latitude, longitude);

-- Create index on name for searching
CREATE INDEX IF NOT EXISTS idx_school_name ON schools(name);
