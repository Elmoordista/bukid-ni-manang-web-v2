# CHAPTER 4: METHODOLOGY, RESULTS, AND DISCUSSION

## 4.1 Introduction

The development of the Bukid ni Manang Booking System followed the System Development Lifecycle (SDLC), a structured framework comprising Planning, Analysis, Design, Implementation, Testing, and Maintenance phases. This approach ensured a systematic process to create a web-based booking system with email notifications to streamline accommodation bookings, reduce guest wait times, and enhance service quality at Bukid ni Manang Resort. This chapter details the application of each SDLC phase, requirements analysis, system design, implementation, testing, and results, demonstrating the system's alignment with the resort's operational needs.

## 4.2 Methodology

### 4.2.1 System Development Lifecycle (SDLC)

The SDLC guided the project through the following phases:

1. **Planning**: The researchers devised a strategy to develop a web-based booking system with email notifications, addressing inefficiencies in the resort's manual booking process. Objectives included improving guest experience, reducing wait times, and ensuring operational efficiency.

2. **Analysis**: Through discussions with resort staff and guest feedback, inefficiencies were identified, such as delays in booking confirmations and manual record-keeping. User needs included secure registration, accommodation browsing, and automated notifications.

3. **Design**: The system architecture was conceptualized using Data Flow Diagrams (DFD), Functional Decomposition Diagrams (FDD), and Entity Relationship Diagrams (ERD) to outline structure and functionality. Core features included user registration, booking management, payment processing, and admin dashboards.

4. **Implementation**: The system was developed using modern tools and frameworks, with iterative debugging to ensure functionality and reliability.

5. **Testing**: Unit, integration, and usability testing verified system performance, with issues resolved based on feedback.

6. **Maintenance**: Post-deployment, the system was monitored for bugs, updated regularly, and optimized to meet ongoing needs.

### 4.2.2 Requirements Analysis

The requirements analysis focused on identifying user needs and expectations through stakeholder interviews and guest feedback. The system was designed to:

- Facilitate efficient booking scheduling
- Reduce guest wait times
- Enhance convenience with secure registration and email notifications
- Ensure data security and usability

Key functionalities included user registration, accommodation browsing, booking management, payment processing, and admin controls, all tailored to improve guest satisfaction and resort operations.

### 4.2.3 Requirements Documentation

The requirements documentation detailed the software, hardware, and operational needs for the system. It outlined:

- **Functional Requirements**: Core operations for users and admins (e.g., registration, booking, notifications)
- **Non-Functional Requirements**: Accessibility, security, reliability, scalability, performance, reusability, and flexibility
- **Integration Steps**: How the system was incorporated into the resort's workflow

#### Table 4: Functional Requirements of Web-App Booking System

| Functionality | Description |
|--------------|-------------|
| Registration | Allows users to save information (full name, email, password, phone number) to access the system. Output: Registration success. |
| Email Notification | Verifies user accounts and sends booking confirmations and payment receipts via email. |
| Login/Logout | Enables user access to book accommodations. Inputs: Email, password. Output: User interface. |
| Book Accommodation | Allows selection of accommodations, dates, and guest count. Inputs: Date, guest count, special requests, accommodation type (e.g., Twin Bed, Event Venue Package). Output: Approved booking request. |
| Manage Guest and Accommodation Records | Admins can access/edit guest records, check availability, update bookings, and manage accommodations. |
| View Dashboard | Admins view daily guest numbers, booking summaries, and revenue reports. |

#### Table 5: Non-Functional Requirements

| Requirement | Description |
|------------|-------------|
| Portability | Operates across devices (mobile, desktop) and browsers (Chrome, Firefox). |
| Security | Protects data with JWT authentication, encrypted credentials, and safeguards against unauthorized access. |
| Maintainability | Supports easy updates, troubleshooting, and enhancements. |
| Reliability | Ensures error-free operation for registration, booking, and payment functions. |
| Scalability | Handles increased users/bookings without performance issues. |
| Performance | Minimizes response times for user interactions (e.g., registration, booking). |
| Reusability | Components (e.g., registration module) can be repurposed for future projects. |
| Flexibility | Adapts to changing needs (e.g., new accommodations, modified booking options). |

## 4.3 System Design

### 4.3.1 System Architecture

**Figure 2: System Architecture** (Placeholder - Diagram Not Provided)
The architecture illustrates interactions among guests, admins, accommodations, the system, and the database. Guests register to access the system, browse accommodations, and make bookings. Admins manage bookings, guest records, and availability, sending notifications via email. The database stores data and generates reports, ensuring efficient coordination.

### 4.3.2 Process Model

The process model provided a user-centered framework, defining tasks for designing and implementing features like registration, booking, and notifications. Milestones ensured timely completion, with work products (e.g., UI, APIs) tested for accessibility, reliability, and security.

### 4.3.3 Context Diagram

**Figure 3: Context Diagram** (Placeholder - Diagram Not Provided)
The context diagram depicts interactions among Guests, Admins, and External Services (Stripe, SendGrid). Guests submit booking requests/inquiries, receiving confirmations. Admins review requests and update statuses, with external services handling payments and emails.

### 4.3.4 Data Flow Diagram (DFD)

**Figure 4: DFD** (Placeholder - Diagram Not Provided)
The DFD shows data flow among Guests, Admins, and External Services. Guests submit bookings (D1: Bookings) or inquiries (D2: Inquiries), receiving confirmations via SendGrid. Admins manage records (D3: Accommodations, D1: Bookings), with payments processed via Stripe (D4: Payments).

### 4.3.5 Functional Decomposition Diagram (FDD)

**Figure 5: FDD** (Placeholder - Diagram Not Provided)
The FDD outlines core functions:

- **Admin**: View dashboard, manage bookings, guest/accommodation records, generate walk-in bookings
- **Accommodation**: View schedules, update booking system, access guest records
- **Guest**: Register, login, book/reschedule/cancel accommodations, view details

### 4.3.6 Entity Relationship Diagram (ERD)

**Figure 6: ERD** (Placeholder - Diagram Not Provided)
The ERD illustrates relationships among Users, Accommodations, Amenities, Bookings, and Payments, using foreign keys (e.g., user_id, accommodation_id) for efficient data management.

### 4.3.7 Data Dictionary

The data dictionary defines the database structure for accurate storage and retrieval.

#### Table 6: tbl_Users

| Field Name | Data Type | Key | Length | Description | FK Reference Table |
|------------|-----------|-----|---------|-------------|-------------------|
| user_id | int | PK | | User ID | |
| email | Varchar | Not null | 45 | User Email Address | |
| password_hash | Varchar | Not null | 45 | User Password Hash | |
| first_name | Varchar | Not null | 45 | User First Name | |
| last_name | Varchar | Not null | 45 | User Last Name | |
| phone_number | Varchar | Not null | 45 | User Phone Number | |
| created_at | Timestamp | | | Created At | |
| updated_at | Timestamp | | | Updated At | |

#### Table 7: tbl_Accommodations

| Field Name | Data Type | Key | Length | Description | FK Reference Table |
|------------|-----------|-----|---------|-------------|-------------------|
| accommodation_id | int | PK | | Accommodation ID | |
| name | Varchar | Not null | 45 | Accommodation Name | |
| type | Varchar | Not null | 45 | Accommodation Type | |
| description | Varchar | Not null | 45 | Accommodation Description | |
| base_price | Decimal | Not null | | Base Price | |
| max_guests | int | Not null | | Max Guests | |
| bed_count | int | Not null | | Bed Count | |
| bed_type | Varchar | Not null | 45 | Bed Type | |
| created_at | Timestamp | | | Created At | |
| updated_at | Timestamp | | | Updated At | |

#### Table 8: tbl_Amenities

| Field Name | Data Type | Key | Length | Description | FK Reference Table |
|------------|-----------|-----|---------|-------------|-------------------|
| amenity_id | int | PK | | Amenity ID | |
| name | Varchar | Not null | 45 | Amenity Name (e.g., PLDT WIFI) | |
| icon | Varchar | | 45 | Amenity Icon | |
| description | Varchar | | 45 | Amenity Description | |

#### Table 9: tbl_Bookings

| Field Name | Data Type | Key | Length | Description | FK Reference Table |
|------------|-----------|-----|---------|-------------|-------------------|
| booking_id | int | PK | | Booking ID | |
| user_id | int | FK | | User ID | Users |
| accommodation_id | int | FK | | Accommodation ID | Accommodations |
| check_in_date | Date | Not null | | Check-in Date | |
| check_out_date | Date | Not null | | Check-out Date | |
| guest_count | int | Not null | | Guest Count | |
| total_amount | Decimal | Not null | | Total Amount | |
| status | Varchar | Not null | 45 | Status | |
| stripe_payment_intent_id | Varchar | | 45 | Stripe Payment Intent ID | |
| created_at | Timestamp | | | Created At | |
| updated_at | Timestamp | | | Updated At | |

#### Table 10: tbl_Payments

| Field Name | Data Type | Key | Length | Description | FK Reference Table |
|------------|-----------|-----|---------|-------------|-------------------|
| payment_id | int | PK | | Payment ID | |
| booking_id | int | FK | | Booking ID | Bookings |
| amount | Decimal | Not null | | Amount | |
| currency | Varchar | Not null | 45 | Currency | |
| status | Varchar | Not null | 45 | Status | |
| stripe_payment_intent_id | Varchar | Not null | 45 | Stripe Payment Intent ID | |
| payment_method | Varchar | Not null | 45 | Payment Method | |
| paid_at | Timestamp | | | Paid At | |
| created_at | Timestamp | | | Created At | |

## 4.4 Implementation

### 4.4.1 Software Specification

- **Operating System**:
  - Server: Ubuntu 22.04 LTS (Linux)
  - Client: Cross-platform (Windows 10/11, macOS, iOS, Android)
- **Web Server**: Nginx 1.24 for HTTP requests and load balancing
- **Database**: PostgreSQL 16 for relational data (Users, Accommodations, Bookings, Payments, Amenities)
- **Programming Languages and Frameworks**:
  - Front-End: React.js 18 with TypeScript
  - Back-End: Node.js 20 with Express.js
- **External Services**:
  - Stripe API (v3) for payment processing
  - SendGrid API for email notifications
- **Version Control**: Git with GitHub
- **Containerization**: Docker
- **Testing Tools**: Jest (unit testing), Cypress (end-to-end testing), Postman (API testing)
- **IDE**: Visual Studio Code

### 4.4.2 Hardware Specification

- **Server**:
  - Processor: Quad-core CPU (e.g., Intel Xeon or AMD EPYC, 3.0 GHz+)
  - RAM: 16 GB (minimum), 32 GB (recommended)
  - Storage: 500 GB SSD (NVMe preferred)
  - Network: 1 Gbps Ethernet
- **Client**:
  - Processor: Dual-core CPU (e.g., Intel Core i5)
  - RAM: 4 GB (minimum), 8 GB (recommended)
  - Storage: 256 GB SSD or HDD
  - Display: 1280x720 resolution (minimum)
  - Internet: Stable broadband (10 Mbps+)
- **Cloud Hosting**: AWS (EC2 for compute, RDS for PostgreSQL, S3 for static assets)

### 4.4.3 Program Specification

The system fulfills functional requirements across:

1. **User Management**: Registration, JWT-based authentication, session/profile management
2. **Room Management**: Browse accommodations (e.g., Twin Bed, Event Venue Package), check availability, display pricing
3. **Booking System**: Select accommodations/dates, validate bookings, send confirmations
4. **Payment Processing**: Stripe integration for payments and receipt generation
5. **Admin Panel**: Manage accommodations, bookings, revenue reports, and users
6. **Notification System**: SendGrid for booking confirmations and receipts

### 4.4.4 Programming Environment

- **Front-End**:
  - React.js 18 with TypeScript, Material-UI, Redux Toolkit, Axios, React Router, Styled Components
  - Features: Responsive design, real-time availability, interactive booking/payment forms
- **Back-End**:
  - Node.js 20 with Express.js, Prisma ORM, JWT authentication, RESTful APIs (/users, /accommodations, /bookings, /payments, /admin), Stripe/SendGrid integrations, Winston logging

### 4.4.5 Deployment Diagram

- **Structure**:
  - Guest Devices (Browser/Mobile App) → HTTPS → Nginx (Load Balancer) → HTTP → Node.js/Express (Web Server) → TCP → PostgreSQL (Database) → HTTPS → External Services (Stripe, SendGrid)
- **Hosting**: AWS (EC2, RDS, S3) for scalability

### 4.4.6 Implementation Plan

1. **Setup** (2 weeks): Configure environment, cloud infrastructure, CI/CD pipeline
2. **Back-End** (4 weeks): Develop database schema, APIs, integrations
3. **Front-End** (4 weeks): Build UI, integrate APIs, payment forms
4. **Testing** (3 weeks): Conduct unit, integration, and usability testing
5. **Deployment** (2 weeks): Deploy to AWS, configure monitoring
6. **Maintenance**: Monitor performance, apply updates, maintain backups

## 4.5 Unit Testing

Unit testing ensured compliance with functional and non-functional requirements, targeting 90% code coverage and response times <200ms.

### 4.5.1 Testing Strategy

1. **User Management**: Tested registration, authentication, session/profile management (Jest, Cypress)
   - Example: Verified POST /users/register for successful registration
2. **Room Management**: Tested accommodation listing, availability, pricing (Jest, Postman)
   - Example: Ensured /accommodations returns valid accommodation_id list
3. **Booking System**: Tested room/date selection, booking creation, confirmations (Jest, Cypress)
   - Example: Validated booking workflow with correct inputs
4. **Payment Processing**: Tested Stripe integration, payment storage, receipt generation (Jest, Postman)
   - Example: Confirmed /payments processes payments correctly
5. **Admin Panel**: Tested room/booking management, revenue reports (Jest, Cypress)
   - Example: Verified /admin/revenue for accurate totals
6. **Notification System**: Tested email sending/content (Jest with SendGrid mocks)
   - Example: Ensured booking confirmation emails are sent

### 4.5.2 Test Environment

- Local Dockerized testing
- GitHub Actions for CI/CD
- AWS staging server

## 4.6 Implementation Results

The system met its objectives, enhancing resort operations and guest experience:

1. **Secure Registration/Login**: Provides a secure interface with email verification, storing hashed passwords in tbl_Users, and sending confirmations via SendGrid.
2. **Email Notifications**: Sends booking confirmations and payment receipts via SendGrid, ensuring effective communication.
3. **Admin Module**: Enables management of bookings, guest records, accommodations, and revenue reports with secure JWT-based access.

## 4.7 Discussion

The Bukid ni Manang Booking System successfully addressed the resort's operational challenges by streamlining booking processes, reducing wait times, and improving guest satisfaction. The SDLC approach ensured systematic development, with rigorous testing confirming reliability, security, and usability. The system's scalability and maintainability support future growth, while its user-centered design enhances accessibility across devices and browsers. Feedback from testing phases was incorporated to resolve errors, ensuring a seamless experience for guests and staff.