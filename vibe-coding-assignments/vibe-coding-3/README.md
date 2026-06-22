# OWASP A07:2026 — Authentication Failures Educational Demo

**⚠️ EDUCATIONAL PURPOSES ONLY**

This application intentionally contains insecure authentication code to demonstrate common vulnerabilities. Never use the vulnerable patterns in any production system.

---

## Overview

### Why Authentication Failures Were Chosen

Authentication Failures (OWASP A07:2026) represent one of the most pervasive and damaging vulnerability categories in modern web applications. According to OWASP, this category includes weaknesses in authentication and session management that allow attackers to impersonate legitimate users, gain unauthorized access, or escalate privileges.

Authentication is the first line of defense for virtually every application that handles user data. When it fails, the consequences can be catastrophic: full account takeovers, mass data breaches, financial fraud, and complete compromise of entire systems.

This vulnerability category was chosen because:

1. **It is extremely common** — Authentication failures appear in 94% of tested applications.
2. **It is well-understood but still misimplemented** — Despite being known for decades, weak password storage, missing rate limiting, and account enumeration remain rampant.
3. **The contrast is dramatic** — The difference between a vulnerable and secure implementation is stark and easy to demonstrate side by side.
4. **Real-world impact is severe** — Major breaches at companies like LinkedIn, Adobe, and RockYou were directly caused by improper authentication implementations.

### Why This Educational Tool Was Created

This application was created to move beyond abstract explanations and give students a hands-on, interactive experience with authentication security. Rather than reading about why plain-text passwords are dangerous, students can *see* a brute-force attack crack a password in milliseconds. Rather than being told to use bcrypt, they can watch an account lockout mechanism block an attack in real time. The tool bridges the gap between theory and practice — the most effective way to internalize security concepts.

---

## Description of the Program

### Features and Functionality

#### Landing Page (`/`)
- Explains OWASP A07:2026 Authentication Failures in plain language
- Describes common attack methods (brute force, credential stuffing, password spraying)
- Live statistics showing activity across both demo systems
- Navigation guide for the demo

#### Vulnerable Authentication Demo (`/vulnerable`)
- **Login form** with no security controls whatsoever
- **Demo Users panel** exposing all usernames and their plain-text passwords
- **Automated attack buttons:**
  - *Simulate Weak Password Login* — logs in with a known weak password
  - *Simulate Password Guessing* — tries common passwords
  - *Simulate Common Password Attack* — tries "admin" as password
- **Login Attempt Log** — real-time feed of all attempts with attack annotations
- Educational explanation panels describing each vulnerability

#### Secure Authentication Demo (`/secure`)
- **Login form** with password complexity requirements shown
- **Rate Limiting** — blocks IPs after 5 requests per minute
- **Account Lockout** — locks accounts for 5 minutes after 5 failed attempts
- **bcrypt password hashing** — passwords stored as secure hashes
- **Generic error messages** — prevents username enumeration
- **Login Attempt Log** — shows blocked/failed attempts
- Educational explanation panels describing each security measure

#### Comparison Page (`/compare`)
- Side-by-side statistics: vulnerable vs secure system
- Feature comparison table
- Code snippets showing insecure vs secure implementation
- Security recommendations
- Reset Demo button to clear all attempt logs and lockouts

---

## Vulnerability Explanation

### What Are Authentication Failures?

Authentication Failures (previously called "Broken Authentication") occur when an application does not properly verify the identity of users. OWASP A07:2026 includes:

- Allowing weak or well-known passwords
- Using weak credential recovery mechanisms
- Storing passwords in plain text or with weak hashing (MD5, SHA1)
- Missing or ineffective multi-factor authentication
- No protection against automated attacks (brute force, credential stuffing)
- Exposing session tokens in URLs
- Not invalidating sessions on logout or after a period of inactivity

### Common Attack Methods

| Attack | Description | Demo |
|--------|-------------|------|
| **Brute Force** | Trying every possible password combination until one works | ✅ Simulated |
| **Dictionary Attack** | Trying common passwords from a wordlist | ✅ Simulated |
| **Credential Stuffing** | Using credentials leaked from other breaches | Conceptual |
| **Password Spraying** | Trying one common password against many accounts | Conceptual |
| **Username Enumeration** | Exploiting error messages to discover valid usernames | ✅ Demonstrated |

### Real-World Impact

Authentication failures have led to some of the largest data breaches in history:

- **Financial fraud** through account takeover
- **Identity theft** from exposed personal data
- **Ransomware deployment** through compromised admin accounts
- **Data exfiltration** of millions of user records
- **Reputational damage** and legal liability for organizations

---

## Recent Real-World Example

### LinkedIn — 2012 (Discovered/Exposed 2016)

In 2012, LinkedIn suffered a breach where approximately **117 million user accounts** were compromised. The passwords were hashed using unsalted SHA-1 — a fast cryptographic hash function that is completely inappropriate for password storage.

**What went wrong:**
- LinkedIn used SHA-1 without salts, making hashes trivially crackable with rainbow tables
- No rate limiting on authentication attempts
- The breach went undetected for **4 years**

**What should have happened:**
- Passwords should have been hashed with a slow, salted algorithm (bcrypt, Argon2, scrypt)
- Salting prevents rainbow table attacks even if the hash algorithm is weak
- Intrusion detection should have caught the breach

**Impact:** 117 million credentials were eventually sold on the dark web for approximately 5 Bitcoin (~$2,200 at the time). The credentials were used in credential-stuffing attacks against other platforms for years afterward.

This is directly relevant to what this demo teaches: if LinkedIn had stored passwords as bcrypt hashes with proper salting (as shown in our Secure Demo), the leaked hashes would have been computationally infeasible to crack.

---

## Problems Encountered During Development

### Problem 1: Database Initialization

**Challenge:** The application needed to automatically initialize the SQLite database with sample users for both vulnerable and secure implementations on first run, but without overwriting existing data on subsequent runs.

**Solution:** Implemented an `init_db()` function that checks if the database file exists before creating it. If it doesn't exist, it creates the tables and inserts sample users. This ensures the database is only initialized once.

**Lesson:** Always include database initialization logic that checks for existing data to prevent accidental data loss during development.

### Problem 2: Rate Limiting Implementation

**Challenge:** Implementing rate limiting without using external libraries or Redis, while ensuring it works correctly across multiple requests.

**Solution:** Used an in-memory dictionary (`rate_limits`) to track request timestamps per IP address. The implementation cleans up timestamps older than 60 seconds before checking the count, ensuring accurate rate limiting.

**Lesson:** In-memory rate limiting is sufficient for educational demos, but production applications should use Redis or similar for distributed systems.

### Problem 3: Account Lockout State Management

**Challenge:** Managing account lockout state across requests without a persistent storage mechanism for lockout information.

**Solution:** Used an in-memory dictionary (`account_lockouts`) to store lockout expiration timestamps. The lockout check automatically removes expired lockouts, ensuring accounts are unlocked after the timeout period.

**Lesson:** For production applications, account lockout state should be persisted in the database to survive server restarts.

### Problem 4: Generic Error Messages

**Challenge:** Implementing truly generic error messages that don't reveal whether a username exists, while still providing useful feedback to legitimate users.

**Solution:** The secure implementation always returns "Invalid credentials" regardless of whether the username exists or the password is incorrect. This prevents username enumeration attacks.

**Lesson:** Generic error messages are a simple but effective security measure that prevents information leakage.

---

## Installation Instructions

### Prerequisites

- Python 3.7 or higher
- pip (Python package manager)

### Steps

1. **Navigate to the project directory:**
   ```bash
   cd vibe-coding-assignments/vibe-coding-3
   ```

2. **Create a virtual environment (recommended):**
   ```bash
   python -m venv venv
   ```

3. **Activate the virtual environment:**
   - On macOS/Linux:
     ```bash
     source venv/bin/activate
     ```
   - On Windows:
     ```bash
     venv\Scripts\activate
     ```

4. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

5. **Verify installation:**
   ```bash
   python -c "import flask, bcrypt; print('Dependencies installed successfully')"
   ```

---

## Running the Application

1. **Ensure you're in the project directory with the virtual environment activated**

2. **Run the Flask application:**
   ```bash
   python app.py
   ```

3. **Open your web browser and navigate to:**
   ```
   http://localhost:5002
   ```

4. **Explore the demo:**
   - Start at the landing page to learn about authentication failures
   - Try the vulnerable demo to see how attacks succeed
   - Try the secure demo to see how attacks are blocked
   - Visit the comparison page to see side-by-side code and statistics

5. **To stop the application:**
   - Press `Ctrl+C` in the terminal

---

## Screenshots

The following screenshots should be captured to document the application:

1. **Landing Page** 
![alt text](<images/Screenshot 2026-06-22 at 12.36.49 AM.png>)
![alt text](<images/Screenshot 2026-06-22 at 12.37.05 AM.png>)
![alt text](<images/Screenshot 2026-06-22 at 12.37.15 AM.png>)
   - Shows the main landing page with educational content
   - Displays live activity statistics
   - Shows navigation to vulnerable and secure demos

2. **Vulnerable Login Page** 
![alt text](<images/Screenshot 2026-06-22 at 12.40.54 AM.png>)
![alt text](<images/Screenshot 2026-06-22 at 12.41.08 AM.png>)
![alt text](<images/Screenshot 2026-06-22 at 12.41.18 AM.png>)
   - Demonstrates the vulnerable login form
   - Shows demo users with plain-text passwords
   - Displays automated attack buttons
   - Shows login attempt log with successful attacks

3. **Secure Login Page** 
![alt text](<images/Screenshot 2026-06-22 at 12.42.35 AM.png>)
![alt text](<images/Screenshot 2026-06-22 at 12.42.44 AM.png>)
![alt text](<images/Screenshot 2026-06-22 at 12.42.53 AM.png>)
   - Demonstrates the secure login form
   - Shows password requirements
   - Displays active security controls
   - Shows login attempt log with blocked attempts

4. **Comparison Page** 
![alt text](<images/Screenshot 2026-06-22 at 12.43.56 AM.png>)
![alt text](<images/Screenshot 2026-06-22 at 12.44.03 AM.png>)
![alt text](<images/Screenshot 2026-06-22 at 12.44.10 AM.png>)
![alt text](<images/Screenshot 2026-06-22 at 12.44.17 AM.png>)
![alt text](<images/Screenshot 2026-06-22 at 12.44.24 AM.png>)
   - Shows side-by-side statistics
   - Displays feature comparison table
   - Shows code comparison snippets
   - Displays security recommendations


## Security Lessons Learned

### 1. Password Hashing is Non-Negotiable

**Lesson:** Never store passwords in plain text. Always use a slow, salted hashing algorithm like bcrypt, Argon2, or scrypt.

**Why:** Plain text passwords are immediately exposed if the database is compromised. Fast hashes like MD5 and SHA-1 can be cracked with rainbow tables or brute force. bcrypt is designed to be slow, making brute force attacks computationally infeasible.

### 2. Rate Limiting is Essential

**Lesson:** Implement rate limiting on authentication endpoints to prevent automated attacks.

**Why:** Without rate limiting, attackers can make unlimited login attempts, enabling brute force and credential stuffing attacks. A simple rate limit (e.g., 5 requests per minute) dramatically slows down these attacks.

### 3. Account Lockout Prevents Brute Force

**Lesson:** Lock accounts after a reasonable number of failed attempts (e.g., 5 attempts) for a temporary period (e.g., 5-30 minutes).

**Why:** Account lockout makes brute force attacks impractical by requiring attackers to wait between attempts, dramatically increasing the time required to crack a password.

### 4. Generic Error Messages Prevent Enumeration

**Lesson:** Use generic error messages like "Invalid credentials" instead of specific messages like "Username not found" or "Incorrect password."

**Why:** Specific error messages enable username enumeration attacks, where attackers can determine which usernames exist in the system and focus their attacks on valid accounts.

### 5. Password Complexity Requirements Matter

**Lesson:** Enforce minimum password length and complexity requirements (uppercase, lowercase, numbers, special characters).

**Why:** Weak passwords like "123456" or "password" can be cracked instantly. Complexity requirements force users to create stronger passwords that resist brute force attacks.

### 6. Parameterized Queries Prevent SQL Injection

**Lesson:** Always use parameterized queries or prepared statements when interacting with databases.

**Why:** String concatenation in SQL queries enables SQL injection attacks, which can bypass authentication entirely or expose sensitive data.

### 7. Multi-Factor Authentication Adds Critical Security

**Lesson:** Implement multi-factor authentication (MFA) for sensitive accounts and administrative access.

**Why:** Even if a password is compromised, MFA prevents attackers from accessing the account without the second factor (e.g., SMS code, authenticator app, hardware token).

### 8. Monitoring and Logging are Vital

**Lesson:** Log authentication attempts and monitor for suspicious patterns that may indicate attacks.

**Why:** Without monitoring, attacks can go undetected for long periods (as in the LinkedIn breach). Early detection allows for rapid response and mitigation.

---

## Tech Stack

- **Backend:** Flask (Python)
- **Database:** SQLite
- **Password Hashing:** bcrypt
- **Frontend:** HTML, CSS, JavaScript
- **Styling:** Custom CSS with modern gradient design

---

## Folder Structure

```
vibe-coding-3/
├── app.py                      # Flask application with vulnerable and secure endpoints
├── requirements.txt            # Python dependencies
├── database.db                 # SQLite database (auto-generated)
├── templates/                  # HTML templates
│   ├── index.html             # Landing page
│   ├── vulnerable_login.html  # Vulnerable authentication demo
│   ├── secure_login.html      # Secure authentication demo
│   └── compare.html           # Comparison page
├── static/                     # Static assets
│   ├── style.css              # Application styling
│   └── script.js              # JavaScript functionality
├── images/                     # Screenshot placeholders
│   ├── landing-page-placeholder.txt
│   ├── vulnerable-login-placeholder.txt
│   ├── secure-login-placeholder.txt
│   ├── comparison-page-placeholder.txt
└── README.md                   
```

---

## Important Notes

- This application is **strictly for educational purposes** only.
- The vulnerable code is intentionally insecure to demonstrate common vulnerabilities.
- Never use the vulnerable patterns shown in this demo in any production system.
- Always follow security best practices when implementing authentication in real applications.
- The demo uses in-memory storage for rate limiting and lockouts, which is lost on server restart. Production applications should use persistent storage.

---

## License

This educational demo is provided for academic purposes. Please use responsibly and only for learning about authentication security.

---

## Contact

For questions or feedback about this educational demo, please contact your course instructor.
