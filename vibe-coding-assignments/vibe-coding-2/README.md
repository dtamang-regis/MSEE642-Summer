# Broken Access Control Educational Demo

## Overview

This is a comprehensive educational web application that demonstrates Broken Access Control (OWASP A01:2025) for learning purposes. The goal is to teach students how access control vulnerabilities work by comparing a vulnerable implementation with a secure implementation.

## Vibe Coding Tool Used

This project was developed using Vibe Coding 2 (Week 5) for the MSEE642 cybersecurity course. The tool assisted in generating the Flask backend, HTML templates, and CSS styling following best practices for educational cybersecurity demonstrations.

## Program Description

This educational application demonstrates three critical Broken Access Control vulnerabilities:

1. **Unauthorized Admin Access**: Regular users can access admin panels by typing URLs directly
2. **IDOR (Insecure Direct Object Reference)**: Users can view other users' profiles by changing IDs in URLs
3. **Missing Role-Based Access Control**: Admin-only actions are visible and executable by all users

The application provides two parallel implementations:
- **Vulnerable Demo**: Intentionally insecure implementation demonstrating the vulnerabilities
- **Secure Demo**: Properly secured implementation with role-based access control and IDOR prevention

## Tech Stack

- **Backend:** Python with Flask
- **Database:** SQLite
- **Frontend:** HTML/CSS (no frameworks, following the same pattern as Vibe Coding 1)

## OWASP A01: Broken Access Control Explanation

Broken Access Control is ranked as **A01:2025** in the OWASP Top 10, making it the most critical web application security risk. It occurs when users can access resources or perform actions outside their intended permissions.

### Common Vulnerabilities:

- **Horizontal Privilege Escalation**: Users can access other users' data (IDOR)
- **Vertical Privilege Escalation**: Regular users can access admin functions
- **Missing Authentication**: Sensitive endpoints lack proper authorization checks
- **Insecure Direct Object References**: Accessing resources by predictable IDs without ownership verification

### Impact:

- Unauthorized access to sensitive data
- Privilege escalation attacks
- Data breaches
- Compliance violations (GDPR, HIPAA, etc.)
- Financial and reputational damage

## Real-World Broken Access Control Incident

### Facebook View As Privacy Vulnerability (2018)

**Description:** A critical vulnerability in Facebook's "View As" feature allowed attackers to steal access tokens for over 50 million user accounts.

**Root Cause:** Broken access control in the video uploader component. The "View As" feature, which lets users see their profile as others would see it, had an access control flaw that allowed attackers to generate access tokens.

**Impact:**
- 50 million user accounts affected
- Forced logout of 90 million users as a precaution
- $5 billion FTC fine
- Massive reputational damage
- Stock price drop

**Lesson:** Even features designed for privacy testing can have access control flaws that lead to massive security breaches. Proper authorization checks must be implemented on all endpoints, not just the obvious ones.

## Vulnerable Scenarios

### 1. Unauthorized Admin Access

**Vulnerability:** The vulnerable implementation does not check user roles before granting access to the admin panel. Any logged-in user can access `/vulnerable/admin` by typing the URL directly.

**Vulnerable Code:**
```python
@app.route('/vulnerable/admin')
def vulnerable_admin():
    if 'vulnerable_user_id' not in session:
        return redirect(url_for('vulnerable_login'))
    # NO ROLE CHECK HERE!
    return render_template('vulnerable_admin.html', ...)
```

**Attack Scenario:**
1. Attacker logs in as regular user (`user` / `user123`)
2. Attacker navigates directly to `/vulnerable/admin`
3. Admin panel is displayed without any authorization check
4. Attacker can view and potentially execute admin functions

### 2. IDOR (Insecure Direct Object Reference)

**Vulnerability:** The vulnerable profile endpoint does not verify that the requested user_id belongs to the current user. Users can view any profile by changing the ID in the URL.

**Vulnerable Code:**
```python
@app.route('/vulnerable/profile/<int:user_id>')
def vulnerable_profile(user_id):
    # NO CHECK if user_id belongs to current user!
    profile_user = conn.execute('SELECT * FROM users WHERE id = ?', 
                               (user_id,)).fetchone()
    return render_template('vulnerable_profile.html', ...)
```

**Attack Scenario:**
1. Attacker logs in as regular user (`user` / `user123`)
2. Attacker navigates to `/vulnerable/profile/1` (admin's profile)
3. Admin's profile data is displayed to the regular user
4. Attacker can enumerate through IDs to view all users' data

### 3. Missing Role-Based Access Control

**Vulnerability:** Admin-only actions are visible and executable by all users in the dashboard. The frontend shows admin actions to everyone, and the backend doesn't enforce role checks.

**Vulnerable Code:**
```python
@app.route('/vulnerable/dashboard')
def vulnerable_dashboard():
    # Admin actions shown to all users
    show_admin_actions = True  # Always true!
    return render_template('vulnerable_dashboard.html', 
                         show_admin_actions=True)
```

**Attack Scenario:**
1. Regular user logs in and sees admin actions on dashboard
2. Regular user can click admin actions and execute them
3. No server-side verification prevents unauthorized actions

## Secure Implementations

### 1. Role-Based Access Control (RBAC)

**Fix:** Implement proper role checks on all sensitive endpoints. Only users with the admin role can access admin panels.

**Secure Code:**
```python
@app.route('/secure/admin')
def secure_admin():
    if 'secure_user_id' not in session:
        return redirect(url_for('secure_login'))
    
    # ROLE CHECK HERE!
    if session.get('secure_role') != 'admin':
        return render_template('secure_403.html'), 403
    
    return render_template('secure_admin.html', ...)
```

**Security Benefit:** Regular users receive 403 Forbidden when attempting to access admin endpoints, preventing unauthorized access.

### 2. IDOR Prevention

**Fix:** Verify that the requested resource belongs to the current user before granting access.

**Secure Code:**
```python
@app.route('/secure/profile/<int:user_id>')
def secure_profile(user_id):
    current_user_id = session.get('secure_user_id')
    
    # CHECK if user_id belongs to current user!
    if current_user_id != user_id:
        return render_template('secure_403.html'), 403
    
    profile_user = conn.execute('SELECT * FROM users WHERE id = ?', 
                               (user_id,)).fetchone()
    return render_template('secure_profile.html', ...)
```

**Security Benefit:** Users can only access their own profiles. Attempting to access other users' profiles results in 403 Forbidden.

### 3. Proper Authorization Checks

**Fix:** Implement both frontend hiding and backend verification for role-based actions.

**Secure Code:**
```python
@app.route('/secure/dashboard')
def secure_dashboard():
    username = session.get('secure_username')
    role = session.get('secure_role')
    
    # Only show admin actions to admin role
    show_admin_actions = (role == 'admin')
    
    return render_template('secure_dashboard.html', 
                         username=username, 
                         role=role,
                         show_admin_actions=show_admin_actions)
```

**Security Benefit:** Admin actions are hidden from non-admin users on the frontend, and backend role checks prevent unauthorized access even if URLs are guessed.

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
http://localhost:5002
```

## How to Use

### Vulnerable Demo

1. Start on the home page and click "Try Vulnerable Demo"
2. Login as regular user (`user` / `user123`)
3. Try to access `/vulnerable/admin` directly - observe unauthorized access
4. Try to access `/vulnerable/profile/1` (admin's profile) - observe IDOR vulnerability
5. Notice admin actions are visible on the dashboard

### Secure Demo

1. Start on the home page and click "Try Secure Demo"
2. Login as regular user (`user` / `user123`)
3. Try to access `/secure/admin` directly - observe 403 Access Denied
4. Try to access `/secure/profile/1` (admin's profile) - observe 403 Access Denied
5. Notice admin actions are hidden from the dashboard
6. Login as admin (`admin` / `admin123`) to verify proper admin access

## Sample Credentials

- **Admin:** username: `admin` | password: `admin123`
- **User:** username: `user` | password: `user123`
- **User2:** username: `user2` | password: `user123`

## Challenges Encountered and Solutions

### Challenge 1: Session Management
**Problem:** Implementing secure session management that properly tracks user roles across requests.

**Solution:** Used Flask's session management with proper key configuration and stored user_id, username, and role in the session after successful authentication.

### Challenge 2: IDOR Prevention
**Problem:** Preventing users from accessing other users' resources while still allowing them to access their own.

**Solution:** Implemented ownership checks on all profile endpoints by comparing the requested user_id with the current_user_id from the session.

### Challenge 3: Role-Based Access Control
**Problem:** Ensuring that role checks are enforced on both frontend and backend.

**Solution:** Implemented dual-layer protection: frontend hiding of admin actions based on role, and backend role verification on all sensitive endpoints.

### Challenge 4: Educational Clarity
**Problem:** Making the vulnerabilities and fixes clear to students without oversimplifying.

**Solution:** Added detailed explanations on each page showing the vulnerable code, secure code, and why each approach is insecure or secure.

## Security Best Practices

- **Always implement role-based access control** on sensitive endpoints
- **Never trust user input** - verify ownership of requested resources
- **Use defense in depth** - implement both frontend and backend security
- **Return 403 Forbidden** for unauthorized access attempts
- **Log access denied events** for security monitoring
- **Implement the principle of least privilege** - users should only have access they need
- **Use indirect object references** (random tokens instead of sequential IDs) when possible
- **Regularly audit access control** implementations for vulnerabilities

## OWASP Top 10

This demo covers **A01:2025 – Broken Access Control** from the OWASP Top 10, which is the most critical web application security risk.

## Screenshots

### 1. Landing Page
Shows the main landing page with project overview, explanation of Broken Access Control, and buttons for Vulnerable Demo and Secure Demo.

![alt text](<images/Screenshot 2026-06-06 at 1.06.46 PM.png>)

---

### 2. Vulnerable Admin Access
This shows the vulnerable version where a regular user can access the admin panel by typing the URL directly.

![alt text](<images/Screenshot 2026-06-06 at 1.08.54 PM.png>)

---

### 3. Vulnerable Profile Access (IDOR)
Demonstrates the IDOR vulnerability where a regular user can view another user's profile by changing the ID in the URL.

![alt text](<images/Screenshot 2026-06-06 at 1.09.42 PM.png>)

---

### 4. Secure Admin Protection (403)
This shows the secure version where regular users receive 403 Access Denied when trying to access the admin panel.

![alt text](<images/Screenshot 2026-06-06 at 1.11.00 PM.png>)

---

### 5. Secure Profile Protection
This shows the secure version where users receive 403 Access Denied when trying to view other users' profiles.

![alt text](<images/Screenshot 2026-06-06 at 1.11.51 PM.png>)

---

## Important Notes

- This is for **educational purposes only**
- The vulnerable implementation is intentionally insecure to demonstrate the attack
- Never use vulnerable code patterns in production
- Always implement proper access control checks on all sensitive endpoints
- The database is generated automatically on first run

## Deliverable

This is a fully working educational application ready for college cybersecurity assignment submission. It demonstrates:
- Clear understanding of Broken Access Control vulnerabilities
- Practical implementation of secure access control
- Educational value through side-by-side vulnerable and secure demos
- Professional documentation following academic standards
- Screenshots page guiding students through required captures

The application mirrors the learning-focused design pattern used in the Vibe Coding 1 SQL Injection demo, ensuring consistency in educational quality and presentation.
