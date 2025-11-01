-- Production Data for Bukid ni Manang Resort
USE bukid_ni_manang_prod;

-- Initialize Room Types with Real Rooms
INSERT INTO rooms (id, roomNumber, name, type, capacity, basePrice, status, description, amenities, images, bedConfiguration, viewType) VALUES
(UUID(), '101', 'Deluxe Mountain View Room', 'deluxe', 4, 3500.00, 'available',
    'Spacious room with stunning mountain views, perfect for families or small groups',
    JSON_OBJECT(
        'aircon', true,
        'wifi', true,
        'tv', '55" Smart TV',
        'bathroom', 'Private with hot and cold shower',
        'minibar', true,
        'coffeeMaker', true,
        'amenities', JSON_ARRAY(
            'Air Conditioning',
            'Starlink WiFi',
            '55" Smart TV',
            'Hot & Cold Shower',
            'Mini Refrigerator',
            'Coffee Maker',
            'Free Access to All Amenities'
        )
    ),
    JSON_ARRAY(
        '/images/rooms/deluxe/mountain-view-1.jpg',
        '/images/rooms/deluxe/mountain-view-2.jpg',
        '/images/rooms/deluxe/bathroom.jpg'
    ),
    JSON_OBJECT(
        'type', 'double',
        'count', 2,
        'extraBed', JSON_OBJECT('available', true, 'price', 500.00)
    ),
    'mountain'
),
(UUID(), '102', 'Garden View Suite', 'suite', 3, 4500.00, 'available',
    'Premium suite with private garden view balcony and enhanced amenities',
    JSON_OBJECT(
        'aircon', true,
        'wifi', true,
        'tv', '65" Smart TV',
        'bathroom', 'Private with bathtub and rain shower',
        'minibar', true,
        'coffeeMaker', true,
        'amenities', JSON_ARRAY(
            'Air Conditioning',
            'Starlink WiFi',
            '65" Smart TV',
            'Bathtub with Rain Shower',
            'Mini Refrigerator',
            'Premium Coffee Maker',
            'Private Balcony',
            'Free Access to All Amenities'
        )
    ),
    JSON_ARRAY(
        '/images/rooms/suite/garden-view-1.jpg',
        '/images/rooms/suite/garden-view-2.jpg',
        '/images/rooms/suite/balcony.jpg'
    ),
    JSON_OBJECT(
        'type', 'king',
        'count', 1,
        'sofa', 'pull-out bed',
        'extraBed', JSON_OBJECT('available', true, 'price', 500.00)
    ),
    'garden'
),
(UUID(), '201', 'Family Pool View Room', 'family', 6, 5500.00, 'available',
    'Large family room overlooking the pool area, ideal for extended family stays',
    JSON_OBJECT(
        'aircon', true,
        'wifi', true,
        'tv', '65" Smart TV',
        'bathroom', 'Two private bathrooms with hot and cold shower',
        'minibar', true,
        'coffeeMaker', true,
        'amenities', JSON_ARRAY(
            'Dual Air Conditioning',
            'Starlink WiFi',
            '65" Smart TV',
            'Two Full Bathrooms',
            'Mini Refrigerator',
            'Coffee Maker',
            'Pool View Balcony',
            'Free Access to All Amenities'
        )
    ),
    JSON_ARRAY(
        '/images/rooms/family/pool-view-1.jpg',
        '/images/rooms/family/pool-view-2.jpg',
        '/images/rooms/family/living-area.jpg'
    ),
    JSON_OBJECT(
        'type', JSON_ARRAY('queen', 'twin'),
        'count', JSON_OBJECT('queen', 1, 'twin', 2),
        'extraBed', JSON_OBJECT('available', true, 'price', 500.00)
    ),
    'pool'
);

-- Insert Resort Settings
INSERT INTO settings (id, settingKey, settingValue, category) VALUES
(UUID(), 'resort_policies', JSON_OBJECT(
    'checkIn', '14:00',
    'checkOut', '12:00',
    'cancellation', JSON_OBJECT(
        'freeCancellation', 24,
        'partialRefund', 48,
        'noRefund', 0
    ),
    'deposit', JSON_OBJECT(
        'required', true,
        'percentage', 50
    ),
    'childrenPolicy', JSON_OBJECT(
        'freeUnder', 7,
        'maxChildrenPerRoom', 2
    ),
    'petPolicy', JSON_OBJECT(
        'allowed', true,
        'maxWeight', 15,
        'feePerPet', 500
    )
), 'general'),
(UUID(), 'amenities', JSON_OBJECT(
    'pool', JSON_OBJECT(
        'name', 'Swimming Pool',
        'openingHours', '6:00-22:00',
        'features', JSON_ARRAY('Infinity Pool', 'Kiddie Pool', 'Pool Bar')
    ),
    'restaurant', JSON_OBJECT(
        'name', 'Farm to Table Restaurant',
        'openingHours', '6:00-22:00',
        'cuisine', 'Local and International'
    ),
    'activities', JSON_ARRAY(
        'Farm Tours',
        'Cooking Classes',
        'Yoga Sessions',
        'Bird Watching',
        'Mountain Biking'
    ),
    'services', JSON_ARRAY(
        'Room Service',
        'Laundry',
        'Airport Transfer',
        'Tour Arrangements',
        'Massage Services'
    )
), 'general'),
(UUID(), 'payment_methods', JSON_OBJECT(
    'gcash', JSON_OBJECT(
        'name', 'GCash',
        'number', '0917 100 9766',
        'accountName', 'Bukid ni Manang Resort',
        'instructions', 'Please send receipt to reservations@bukidnimanang.com'
    ),
    'bankTransfer', JSON_OBJECT(
        'banks', JSON_ARRAY(
            JSON_OBJECT(
                'name', 'BDO',
                'accountNumber', '1234567890',
                'accountName', 'Bukid ni Manang Resort'
            ),
            JSON_OBJECT(
                'name', 'BPI',
                'accountNumber', '0987654321',
                'accountName', 'Bukid ni Manang Resort'
            )
        )
    ),
    'cards', JSON_ARRAY('Visa', 'Mastercard')
), 'payment'),
(UUID(), 'contact_info', JSON_OBJECT(
    'primary', JSON_OBJECT(
        'phone', '0917 100 9766',
        'email', 'reservations@bukidnimanang.com'
    ),
    'location', JSON_OBJECT(
        'address', 'Calbayog City, Samar',
        'coordinates', JSON_OBJECT(
            'latitude', 12.067,
            'longitude', 124.6097
        ),
        'landmarks', JSON_ARRAY(
            'Near Calbayog Airport',
            '15 minutes from City Center'
        )
    ),
    'socialMedia', JSON_OBJECT(
        'facebook', 'https://facebook.com/bukidnimanang',
        'instagram', '@bukidnimanang'
    )
), 'general'),
(UUID(), 'special_rates', JSON_OBJECT(
    'peakSeason', JSON_ARRAY(
        JSON_OBJECT(
            'period', 'December 15 - January 15',
            'increase', 20
        ),
        JSON_OBJECT(
            'period', 'Holy Week',
            'increase', 15
        )
    ),
    'offSeason', JSON_ARRAY(
        JSON_OBJECT(
            'period', 'June 1 - September 30',
            'discount', 10
        )
    ),
    'groupDiscounts', JSON_OBJECT(
        'rooms3Plus', 10,
        'rooms5Plus', 15
    ),
    'longStay', JSON_OBJECT(
        'days7Plus', 10,
        'days30Plus', 20
    )
), 'booking');

-- Create necessary admin and staff accounts
INSERT INTO users (id, email, firstName, lastName, role, password, phoneNumber, isVerified) VALUES
(UUID(), 'manager@bukidnimanang.com', 'Resort', 'Manager', 'admin', '$2b$10$3IXK7OeKES6A4Nv3nBJmreQXMaSkBRtkc3Hu3xPDqbGNoSqcP.sXm', '09171009766', TRUE),
(UUID(), 'reservations@bukidnimanang.com', 'Front', 'Desk', 'admin', '$2b$10$3IXK7OeKES6A4Nv3nBJmreQXMaSkBRtkc3Hu3xPDqbGNoSqcP.sXm', '09171009767', TRUE);