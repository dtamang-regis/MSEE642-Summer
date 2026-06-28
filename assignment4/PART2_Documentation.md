# Part 2 – Build the Hiking Club Web Application

## 1. Project Folder Structure

```
hiking-club-app/
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
│   ├── models/
│   │   ├── User.js              # User model
│   │   ├── Event.js             # Event model
│   │   └── ContactMessage.js    # Contact message model
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
├── README.md                    # Project documentation
└── INSTALLATION.md              # Installation instructions
```

---

## 2. Database Schema

### Users Table

```sql
CREATE TABLE users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    role VARCHAR(20) DEFAULT 'member', -- 'member' or 'admin'
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

**Description:** Stores user account information including credentials and role-based access control.

### Events Table

```sql
CREATE TABLE events (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,
    event_date DATE NOT NULL,
    location VARCHAR(200) NOT NULL,
    difficulty VARCHAR(20) NOT NULL, -- 'easy', 'moderate', 'hard'
    max_participants INTEGER,
    current_participants INTEGER DEFAULT 0,
    created_by INTEGER NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (created_by) REFERENCES users(id)
);
```

**Description:** Stores hiking event details including scheduling, location, and participant limits.

### Contact Messages Table

```sql
CREATE TABLE contact_messages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    subject VARCHAR(200 NOT NULL,
    message TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    is_read BOOLEAN DEFAULT 0
);
```

**Description:** Stores contact form submissions from website visitors.

---

## 3. Application Features

### Home Page
- Welcome message and club overview
- Featured upcoming hiking events
- Quick links to registration and events
- Call-to-action for joining the club

### About Page
- Club history and mission statement
- Information about hiking trails and locations
- Club leadership and team members
- Safety guidelines and best practices

### User Registration
- Registration form with username, email, password, and full name
- Client-side validation for email format and password strength
- Server-side validation for unique username and email
- Password hashing using bcrypt before storage

### User Login
- Login form with username/email and password
- JWT token generation upon successful authentication
- Session management using localStorage
- Protected routes for authenticated users

### Member Dashboard
- Personal user profile information
- List of registered hiking events
- Event registration and cancellation
- Upcoming events calendar view

### Hiking Events Page
- Display all available hiking events
- Event filtering by difficulty level
- Event details modal with full information
- Registration button for logged-in users

### Contact Us Page
- Contact form with name, email, subject, and message fields
- Form validation before submission
- Success message after submission
- Admin notification of new messages

### Admin Page
- User management (view all users, change roles)
- Event management (create, edit, delete events)
- View all contact messages
- Dashboard with statistics (total users, events, messages)

---

## 4. Backend API Endpoints

### Authentication Endpoints

#### POST /api/auth/register
- **Description:** Register a new user account
- **Request Body:** `{ username, email, password, full_name }`
- **Response:** `{ success: true, message: "User registered successfully", user: {...} }`
- **Validation:** Username and email must be unique, password minimum 6 characters

#### POST /api/auth/login
- **Description:** Authenticate user and generate JWT token
- **Request Body:** `{ username, password }`
- **Response:** `{ success: true, token: "jwt_token", user: {...} }`
- **Validation:** Valid credentials required

#### POST /api/auth/logout
- **Description:** Logout user (client-side token removal)
- **Request Headers:** `Authorization: Bearer <token>`
- **Response:** `{ success: true, message: "Logged out successfully" }`

#### GET /api/auth/me
- **Description:** Get current authenticated user information
- **Request Headers:** `Authorization: Bearer <token>`
- **Response:** `{ success: true, user: {...} }`

### Event Endpoints

#### GET /api/events
- **Description:** Get all hiking events
- **Query Params:** `?difficulty=easy|moderate|hard` (optional filter)
- **Response:** `{ success: true, events: [...] }`

#### GET /api/events/:id
- **Description:** Get specific event details
- **Response:** `{ success: true, event: {...} }`

#### POST /api/events
- **Description:** Create a new hiking event (admin only)
- **Request Headers:** `Authorization: Bearer <token>`
- **Request Body:** `{ title, description, event_date, location, difficulty, max_participants }`
- **Response:** `{ success: true, message: "Event created", event: {...} }`

#### PUT /api/events/:id
- **Description:** Update an existing event (admin only)
- **Request Headers:** `Authorization: Bearer <token>`
- **Request Body:** `{ title, description, event_date, location, difficulty, max_participants }`
- **Response:** `{ success: true, message: "Event updated", event: {...} }`

#### DELETE /api/events/:id
- **Description:** Delete an event (admin only)
- **Request Headers:** `Authorization: Bearer <token>`
- **Response:** `{ success: true, message: "Event deleted" }`

#### POST /api/events/:id/register
- **Description:** Register user for an event
- **Request Headers:** `Authorization: Bearer <token>`
- **Response:** `{ success: true, message: "Registered for event" }`

#### DELETE /api/events/:id/register
- **Description:** Cancel event registration
- **Request Headers:** `Authorization: Bearer <token>`
- **Response:** `{ success: true, message: "Registration cancelled" }`

### Contact Form Endpoints

#### POST /api/contact
- **Description:** Submit a contact message
- **Request Body:** `{ name, email, subject, message }`
- **Response:** `{ success: true, message: "Message sent successfully" }`
- **Validation:** All fields required, valid email format

#### GET /api/contact/messages
- **Description:** Get all contact messages (admin only)
- **Request Headers:** `Authorization: Bearer <token>`
- **Response:** `{ success: true, messages: [...] }`

#### PUT /api/contact/messages/:id/read
- **Description:** Mark message as read (admin only)
- **Request Headers:** `Authorization: Bearer <token>`
- **Response:** `{ success: true, message: "Message marked as read" }`

### User Endpoints

#### GET /api/users
- **Description:** Get all users (admin only)
- **Request Headers:** `Authorization: Bearer <token>`
- **Response:** `{ success: true, users: [...] }`

#### GET /api/users/:id
- **Description:** Get specific user profile
- **Request Headers:** `Authorization: Bearer <token>`
- **Response:** `{ success: true, user: {...} }`

#### PUT /api/users/:id/role
- **Description:** Update user role (admin only)
- **Request Headers:** `Authorization: Bearer <token>`
- **Request Body:** `{ role: "member" | "admin" }`
- **Response:** `{ success: true, message: "User role updated", user: {...} }`

#### DELETE /api/users/:id
- **Description:** Delete user account (admin only)
- **Request Headers:** `Authorization: Bearer <token>`
- **Response:** `{ success: true, message: "User deleted" }`

---

## 5. Screenshots

### Home Page
![Home Page](images/home-page.png)
*Figure 1: The Hiking Club home page running locally.*

### User Registration Page
![Registration Page](images/register-page.png)
*Figure 2: User registration form.*

### User Login Page
![Login Page](images/login-page.png)
*Figure 3: User login page.*

### Events Page
![Events Page](images/events-page.png)
*Figure 4: List of hiking events.*

### Member Dashboard
![Dashboard](images/dashboard-page.png)
*Figure 5: Member dashboard after login.*

### Contact Page
![Contact Page](images/contact-page.png)
*Figure 6: Contact form for users to send messages.*

### Admin Page
![Admin Page](images/admin-page.png)
*Figure 7: Administrative dashboard for managing users and events.*

> **Note:** The above images are placeholders and should be replaced with actual screenshots taken from the application running locally before submission.
