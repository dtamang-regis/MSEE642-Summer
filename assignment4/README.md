# Hiking Club Web Application

A full-stack web application for a hiking club organization, built with React, Express.js, and SQLite. This application was developed as part of a university penetration testing project to demonstrate a realistic web application that can be security tested with tools like OWASP ZAP.

## 📋 Table of Contents

- [Project Description](#project-description)
- [Features](#features)
- [Technology Stack](#technology-stack)
- [Project Structure](#project-structure)
- [Installation](#installation)
- [Running Locally](#running-locally)
- [API Documentation](#api-documentation)
- [Database Schema](#database-schema)
- [Security Considerations](#security-considerations)
- [Future Improvements](#future-improvements)
- [Screenshots](#screenshots)
- [License](#license)

## 🎯 Project Description

The Hiking Club web application is a comprehensive platform designed to manage hiking events, member registrations, and club communications. Following a previous security incident, this application was rebuilt with security best practices in mind, making it suitable for penetration testing exercises and security assessments.

The application includes user authentication, role-based access control, event management, and contact form functionality - all common features that can be tested for security vulnerabilities.

## ✨ Features

### User Features
- **User Registration**: New users can create accounts with username, email, and password
- **User Login**: Secure authentication with JWT tokens
- **Member Dashboard**: Personalized dashboard showing user profile and registered events
- **Event Browsing**: View all hiking events with filtering by difficulty level
- **Event Registration**: Register for upcoming hiking events
- **Contact Form**: Submit inquiries to club administrators

### Admin Features
- **User Management**: View all users, update roles, and delete accounts
- **Event Management**: Create, update, and delete hiking events
- **Message Management**: View and manage contact form submissions
- **Dashboard Statistics**: Overview of users, events, and messages

### Public Pages
- **Home Page**: Welcome page with featured events and call-to-action
- **About Page**: Club history, mission, leadership team, and safety guidelines
- **Events Page**: Public listing of all hiking events with details

## 🛠 Technology Stack

### Frontend
- **React 18** - UI library
- **Vite** - Build tool and development server
- **React Router DOM** - Client-side routing
- **CSS3** - Styling with inline styles

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **SQLite** - Database
- **JWT** - Authentication tokens
- **bcryptjs** - Password hashing
- **express-validator** - Input validation
- **cors** - Cross-origin resource sharing

## 📁 Project Structure

```
assignment4/
├── backend/
│   ├── config/
│   │   └── database.js          # SQLite database configuration
│   ├── controllers/
│   │   ├── authController.js    # Authentication logic
│   │   ├── eventController.js   # Event management logic
│   │   ├── contactController.js # Contact form logic
│   │   └── userController.js    # User management logic
│   ├── middleware/
│   │   ├── authMiddleware.js    # JWT authentication middleware
│   │   └── errorMiddleware.js   # Error handling middleware
│   ├── routes/
│   │   ├── authRoutes.js        # Authentication endpoints
│   │   ├── eventRoutes.js       # Event endpoints
│   │   ├── contactRoutes.js     # Contact form endpoints
│   │   └── userRoutes.js        # User endpoints
│   ├── server.js                # Express server entry point
│   └── package.json             # Backend dependencies
├── frontend/
│   ├── public/
│   │   └── vite.svg             # Vite logo
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx       # Navigation component
│   │   │   └── Footer.jsx       # Footer component
│   │   ├── pages/
│   │   │   ├── Home.jsx         # Home page
│   │   │   ├── About.jsx        # About page
│   │   │   ├── Register.jsx     # User registration
│   │   │   ├── Login.jsx        # User login
│   │   │   ├── Dashboard.jsx    # Member dashboard
│   │   │   ├── Events.jsx       # Hiking events page
│   │   │   ├── Contact.jsx      # Contact us page
│   │   │   └── Admin.jsx        # Admin page
│   │   ├── services/
│   │   │   └── api.js           # API service for backend calls
│   │   ├── App.jsx              # Main app component
│   │   ├── main.jsx             # React entry point
│   │   └── index.css            # Global styles
│   ├── index.html               # HTML template
│   ├── vite.config.js           # Vite configuration
│   └── package.json             # Frontend dependencies
├── README.md                    # This file
└── INSTALLATION.md              # Detailed installation guide
```

## 🚀 Installation

### Prerequisites
- Node.js (v16 or higher)
- npm (comes with Node.js)

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file:
```
PORT=5000
JWT_SECRET=your-secret-key-change-this-in-production
NODE_ENV=development
```

4. Start the backend server:
```bash
npm run dev
```

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

For detailed installation instructions, see [INSTALLATION.md](INSTALLATION.md).

## 💻 Running Locally

1. **Start the backend** (in one terminal):
```bash
cd backend
npm run dev
```
The backend will run on `http://localhost:5000`

2. **Start the frontend** (in another terminal):
```bash
cd frontend
npm run dev
```
The frontend will run on `http://localhost:3000`

3. **Access the application**:
Open your browser and navigate to `http://localhost:3000`

## 📚 API Documentation

### Authentication Endpoints

- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user
- `GET /api/auth/me` - Get current user

### Event Endpoints

- `GET /api/events` - Get all events (optional filter by difficulty)
- `GET /api/events/:id` - Get specific event
- `POST /api/events` - Create event (admin only)
- `PUT /api/events/:id` - Update event (admin only)
- `DELETE /api/events/:id` - Delete event (admin only)
- `POST /api/events/:id/register` - Register for event
- `DELETE /api/events/:id/register` - Cancel registration

### Contact Endpoints

- `POST /api/contact` - Submit contact message
- `GET /api/contact/messages` - Get all messages (admin only)
- `PUT /api/contact/messages/:id/read` - Mark message as read (admin only)

### User Endpoints

- `GET /api/users` - Get all users (admin only)
- `GET /api/users/:id` - Get specific user
- `PUT /api/users/:id/role` - Update user role (admin only)
- `DELETE /api/users/:id` - Delete user (admin only)

For detailed API documentation, see [PART2_Documentation.md](PART2_Documentation.md).

## 🗄 Database Schema

### Users Table
- `id` - Primary key
- `username` - Unique username
- `email` - Unique email address
- `password` - Hashed password
- `full_name` - User's full name
- `role` - User role (member/admin)
- `created_at` - Account creation timestamp
- `updated_at` - Last update timestamp

### Events Table
- `id` - Primary key
- `title` - Event title
- `description` - Event description
- `event_date` - Event date
- `location` - Event location
- `difficulty` - Difficulty level (easy/moderate/hard)
- `max_participants` - Maximum participants (optional)
- `current_participants` - Current participant count
- `created_by` - User ID who created the event
- `created_at` - Creation timestamp

### Contact Messages Table
- `id` - Primary key
- `name` - Sender name
- `email` - Sender email
- `subject` - Message subject
- `message` - Message content
- `created_at` - Submission timestamp
- `is_read` - Read status flag

### Event Registrations Table
- `id` - Primary key
- `event_id` - Event ID
- `user_id` - User ID
- `registered_at` - Registration timestamp

## 🔒 Security Considerations

This application includes several security features:

- **Password Hashing**: Uses bcryptjs for secure password storage
- **JWT Authentication**: Token-based authentication with expiration
- **Input Validation**: Server-side validation using express-validator
- **Role-Based Access Control**: Admin-only routes protected by middleware
- **CORS Configuration**: Cross-origin resource sharing properly configured
- **SQL Injection Prevention**: Uses parameterized queries with SQLite

**Note**: This application is intended for educational purposes and penetration testing exercises. Before deploying to production, additional security measures should be implemented including HTTPS, rate limiting, CSRF protection, and security headers.

## 🚧 Future Improvements

### Security Enhancements
- Implement rate limiting to prevent brute force attacks
- Add CSRF protection for forms
- Implement security headers (Helmet.js)
- Add email verification for registration
- Implement password reset functionality
- Add two-factor authentication
- Implement session timeout
- Add logging and monitoring

### Feature Enhancements
- Event image uploads
- User profile pictures
- Event reviews and ratings
- Social sharing features
- Calendar integration
- Email notifications for events
- Mobile-responsive design improvements
- Dark mode support
- Multi-language support

### Technical Improvements
- Migrate from SQLite to PostgreSQL or MySQL for production
- Implement caching with Redis
- Add automated testing (unit, integration, E2E)
- Implement CI/CD pipeline
- Add Docker containerization
- Implement API documentation with Swagger/OpenAPI
- Add performance monitoring
- Implement backup and recovery procedures

## � Screenshots

### Home Page
![Home Page]: ![alt text](<images/Screenshot 2026-06-28 at 7.01.59 PM.png>)
*Figure 1: The Hiking Club home page running locally.*

### User Registration Page
![Registration Page]: ![alt text](<images/Screenshot 2026-06-28 at 7.07.07 PM.png>)
*Figure 2: User registration form.*

### User Login Page
![Login Page]: ![alt text](<images/Screenshot 2026-06-28 at 7.07.42 PM.png>)
*Figure 3: User login page.*

### Events Page
![Events Page]: ![alt text](<images/Screenshot 2026-06-28 at 7.08.38 PM.png>)
*Figure 4: List of hiking events.*

### Member Dashboard
![Dashboard]: ![alt text](<images/Screenshot 2026-06-28 at 7.12.34 PM.png>)
*Figure 5: Member dashboard after login.*

### Contact Page
![Contact Page]: ![alt text](<images/Screenshot 2026-06-28 at 7.09.41 PM.png>)
*Figure 6: Contact form for users to send messages.*

### Architecture Diagram
![Architecture Diagram]: ![alt text](<images/Screenshot 2026-06-28 at 7.21.43 PM.png>)
*Figure 5* Architecture Diagram

> **Note:** The above images are placeholders and should be replaced with actual screenshots taken from the application running locally before submission.

## �📄 License

This project is created for educational purposes as part of a university assignment on penetration testing.

## 📧 Contact

For questions about this project, please refer to the assignment documentation or contact the course instructor.

---

**Note**: This application is designed for educational purposes and penetration testing exercises. It should not be deployed to production without implementing additional security measures and professional review.
