-- Production Database Schema for Bukid ni Manang Resort
-- Optimized for live hosting

-- Create database with proper encoding and collation
CREATE DATABASE IF NOT EXISTS bukid_ni_manang_prod
CHARACTER SET = utf8mb4
COLLATE = utf8mb4_unicode_ci;

USE bukid_ni_manang_prod;

-- Users table - for authentication and user management
CREATE TABLE users (
    id CHAR(36) PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    firstName VARCHAR(100) NOT NULL,
    lastName VARCHAR(100) NOT NULL,
    role ENUM('admin', 'user') NOT NULL DEFAULT 'user',
    password VARCHAR(255) NOT NULL,
    phoneNumber VARCHAR(20),
    isVerified BOOLEAN DEFAULT FALSE,
    lastLogin TIMESTAMP NULL,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_users_email (email),
    INDEX idx_users_role (role)
) ENGINE=InnoDB;

-- Rooms table - for accommodation management
CREATE TABLE rooms (
    id CHAR(36) PRIMARY KEY,
    roomNumber VARCHAR(10) NOT NULL UNIQUE,
    name VARCHAR(100) NOT NULL,
    type VARCHAR(50) NOT NULL,
    capacity INT NOT NULL,
    basePrice DECIMAL(10,2) NOT NULL,
    status ENUM('available', 'occupied', 'maintenance', 'reserved') DEFAULT 'available',
    description TEXT,
    amenities JSON,
    images JSON,
    bedConfiguration JSON,
    viewType ENUM('mountain', 'garden', 'pool'),
    isActive BOOLEAN DEFAULT TRUE,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_rooms_status (status),
    INDEX idx_rooms_type (type),
    INDEX idx_rooms_active (isActive)
) ENGINE=InnoDB;

-- Bookings table - for reservation management
CREATE TABLE bookings (
    id CHAR(36) PRIMARY KEY,
    userId CHAR(36) NOT NULL,
    roomId CHAR(36) NOT NULL,
    checkIn DATE NOT NULL,
    checkOut DATE NOT NULL,
    status ENUM('pending', 'confirmed', 'cancelled', 'completed', 'no_show') DEFAULT 'pending',
    totalAmount DECIMAL(10,2) NOT NULL,
    numberOfGuests INT NOT NULL,
    specialRequests TEXT,
    guestDetails JSON,
    priceBreakdown JSON,
    cancelDetails JSON,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (userId) REFERENCES users(id) ON DELETE RESTRICT,
    FOREIGN KEY (roomId) REFERENCES rooms(id) ON DELETE RESTRICT,
    INDEX idx_bookings_dates (checkIn, checkOut),
    INDEX idx_bookings_status (status)
) ENGINE=InnoDB;

-- Payments table - for payment processing
CREATE TABLE payments (
    id CHAR(36) PRIMARY KEY,
    bookingId CHAR(36) NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    paymentMethod ENUM('gcash', 'bank_transfer', 'cash', 'card') NOT NULL,
    status ENUM('pending', 'completed', 'failed', 'refunded') DEFAULT 'pending',
    transactionRef VARCHAR(100),
    paymentDate TIMESTAMP NULL,
    refundAmount DECIMAL(10,2) DEFAULT 0.00,
    metadata JSON,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (bookingId) REFERENCES bookings(id) ON DELETE RESTRICT,
    INDEX idx_payments_status (status),
    INDEX idx_payments_method (paymentMethod)
) ENGINE=InnoDB;

-- Reviews table - for guest reviews and ratings
CREATE TABLE reviews (
    id CHAR(36) PRIMARY KEY,
    bookingId CHAR(36) NOT NULL,
    userId CHAR(36) NOT NULL,
    rating TINYINT NOT NULL CHECK (rating BETWEEN 1 AND 5),
    review TEXT,
    images JSON,
    isPublished BOOLEAN DEFAULT FALSE,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (bookingId) REFERENCES bookings(id) ON DELETE CASCADE,
    FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_reviews_rating (rating)
) ENGINE=InnoDB;

-- Settings table - for resort configuration
CREATE TABLE settings (
    id CHAR(36) PRIMARY KEY,
    settingKey VARCHAR(50) NOT NULL UNIQUE,
    settingValue JSON NOT NULL,
    category ENUM('booking', 'payment', 'notification', 'general') NOT NULL,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_settings_category (category)
) ENGINE=InnoDB;

-- Insert essential settings
INSERT INTO settings (id, settingKey, settingValue, category) VALUES
(UUID(), 'resort_info', '{
    "name": "Bukid ni Manang Farm & Resort",
    "address": "Calbayog City, Samar",
    "phone": "0917 100 9766",
    "email": "reservations@bukidnimanang.com",
    "checkInTime": "14:00",
    "checkOutTime": "12:00"
}', 'general'),
(UUID(), 'booking_rules', '{
    "minAdvanceBookingDays": 1,
    "maxAdvanceBookingDays": 90,
    "depositPercentRequired": 50,
    "cancellationPolicyHours": 24
}', 'booking'),
(UUID(), 'payment_settings', '{
    "gcashNumber": "0917 100 9766",
    "bankDetails": {
        "bankName": "BDO",
        "accountName": "Bukid ni Manang Resort",
        "accountNumber": "XXXXXXXXXXXX"
    }
}', 'payment');

-- Insert default admin account
INSERT INTO users (id, email, firstName, lastName, role, password, isVerified) VALUES (
    UUID(),
    'admin@bukidnimanang.com',
    'Admin',
    'User',
    'admin',
    '$2b$10$3IXK7OeKES6A4Nv3nBJmreQXMaSkBRtkc3Hu3xPDqbGNoSqcP.sXm', -- Password: Admin@123
    TRUE
);

-- Create maintenance triggers
DELIMITER //

CREATE TRIGGER before_booking_insert
BEFORE INSERT ON bookings
FOR EACH ROW
BEGIN
    IF NEW.checkOut <= NEW.checkIn THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Check-out date must be after check-in date';
    END IF;
END //

CREATE TRIGGER before_booking_update
BEFORE UPDATE ON bookings
FOR EACH ROW
BEGIN
    IF NEW.status = 'cancelled' AND OLD.status = 'completed' THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Cannot cancel a completed booking';
    END IF;
END //

DELIMITER ;

-- Create views for common queries
CREATE VIEW available_rooms AS
SELECT r.*
FROM rooms r
WHERE r.status = 'available'
AND r.isActive = TRUE;

CREATE VIEW upcoming_bookings AS
SELECT 
    b.id,
    b.checkIn,
    b.checkOut,
    b.status,
    r.name AS roomName,
    u.email AS guestEmail,
    CONCAT(u.firstName, ' ', u.lastName) AS guestName
FROM bookings b
JOIN rooms r ON b.roomId = r.id
JOIN users u ON b.userId = u.id
WHERE b.checkIn >= CURDATE()
AND b.status NOT IN ('cancelled', 'completed');

-- Create indexes for performance
CREATE INDEX idx_bookings_upcoming ON bookings (checkIn, status) 
WHERE checkIn >= CURDATE() AND status NOT IN ('cancelled', 'completed');

CREATE INDEX idx_payments_recent ON payments (createdAt, status) 
WHERE createdAt >= DATE_SUB(CURDATE(), INTERVAL 30 DAY);