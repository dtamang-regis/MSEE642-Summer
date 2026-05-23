# SQL Injection Educational Demo

## Overview

This is a simple educational web application that demonstrates SQL Injection (OWASP A05: Injection) for learning purposes. The goal is to teach students how SQL injection works by comparing a vulnerable implementation and a secure implementation.

## Tech Stack

- **Backend:** Python with Flask
- **Database:** SQLite
- **Frontend:** Simple HTML/CSS (no frameworks)

## Features

### 1. Home Page
- Simple UI with 2 options:
  - "Vulnerable Login Demo"
  - "Secure Login Demo"

### 2. Vulnerable Login Page
- A login form with username and password fields
- Backend simulates a SQL query using string concatenation (INTENTIONALLY VULNERABLE)
- Demonstrates SQL injection such as: `' OR '1'='1`
- If attack succeeds, it logs in without valid credentials

### 3. Secure Login Page
- Same login form UI
- Backend uses parameterized queries (prepared statements)
- This version prevents SQL injection attacks

### 4. Database
- Simple users table with sample users:
  - admin / admin123
  - user / user123

### 5. Educational Output
- Shows messages like:
  - "Vulnerable query executed"
  - "Secure query executed safely"
- Explanation text on each page describing why one is insecure and the other is safe

### 6. Example Payloads
- `' OR '1'='1`
- `' UNION SELECT * FROM users --`

## Installation

1. Install Python dependencies:
```bash
pip install -r requirements.txt
```

2. Run the application:
```bash
python app.py
```

3. Open your browser and navigate to:
```
http://localhost:5001
```

## How to Use

1. Start on the home page
2. Try the **Vulnerable Login Demo**:
   - Enter username: `admin` and password: `admin123` (valid credentials)
   - Try the SQL injection payload: `' OR '1'='1` in the password field
   - Observe how the vulnerable query allows bypassing authentication
3. Try the **Secure Login Demo**:
   - Enter valid credentials to see successful login
   - Try the same SQL injection payload
   - Observe how parameterized queries prevent the attack

## Important Notes

- This is for **educational purposes only**
- The vulnerable implementation is intentionally insecure to demonstrate the attack
- Never use string concatenation for SQL queries in production
- Always use parameterized queries or prepared statements
- The database is generated automatically on first run

## Security Best Practices

- **Always use parameterized queries** to prevent SQL injection
- **Never trust user input** - validate and sanitize all inputs
- **Use the principle of least privilege** for database connections
- **Implement proper error handling** - don't expose database errors to users
- **Use ORM frameworks** when possible (they handle SQL injection prevention)

## OWASP Top 10

This demo covers **A05:2021 – Security Misconfiguration and Injection** from the OWASP Top 10.


## Screenshots

### 1. Home Page
Shows the main landing page with options to select vulnerable or secure demo.

![alt text](<images/Screenshot 2026-05-23 at 1.20.48 PM.png>)

---

### 2. Vulnerable Login Demo
This shows the vulnerable version where SQL injection can bypass authentication.

![alt text](<images/Screenshot 2026-05-23 at 1.30.22 PM.png>)

---

### 3. SQL Injection Attack Example
Demonstrates the payload `' OR '1'='1` successfully bypassing login in the vulnerable version.

![alt text](<images/Screenshot 2026-05-23 at 1.31.27 PM.png>)

---

### 4. Secure Login Demo
This shows the secure version where parameterized queries prevent the attack.

![alt text](<images/Screenshot 2026-05-23 at 1.34.56 PM.png>)
