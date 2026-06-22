from flask import Flask, render_template, request, redirect, url_for, flash, session, jsonify
import sqlite3
import os
import bcrypt
import time
from datetime import datetime, timedelta
from collections import defaultdict

app = Flask(__name__)
app.secret_key = 'educational-demo-secret-key-auth-12345'

# Database setup
DATABASE = 'database.db'

# Rate limiting and lockout tracking
rate_limits = defaultdict(list)  # IP -> list of timestamps
account_lockouts = {}  # username -> lockout_until timestamp
login_attempts = defaultdict(list)  # Store login attempts for display

def get_db_connection():
    conn = sqlite3.connect(DATABASE)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    """Initialize the database with sample users for both vulnerable and secure implementations"""
    if not os.path.exists(DATABASE):
        conn = get_db_connection()
        
        # Vulnerable users table (plain text passwords)
        conn.execute('''
            CREATE TABLE vulnerable_users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                username TEXT NOT NULL UNIQUE,
                password TEXT NOT NULL
            )
        ''')
        
        # Secure users table (hashed passwords)
        conn.execute('''
            CREATE TABLE secure_users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                username TEXT NOT NULL UNIQUE,
                password_hash TEXT NOT NULL
            )
        ''')
        
        # Login attempts log
        conn.execute('''
            CREATE TABLE login_attempts (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                system TEXT NOT NULL,
                username TEXT,
                attempt_time TEXT NOT NULL,
                success BOOLEAN NOT NULL,
                ip_address TEXT,
                attack_type TEXT
            )
        ''')
        
        # Insert vulnerable users with weak passwords
        conn.execute('INSERT INTO vulnerable_users (username, password) VALUES (?, ?)', ('admin', '123456'))
        conn.execute('INSERT INTO vulnerable_users (username, password) VALUES (?, ?)', ('user', 'password'))
        conn.execute('INSERT INTO vulnerable_users (username, password) VALUES (?, ?)', ('john', 'qwerty'))
        
        # Insert secure users with strong hashed passwords
        conn.execute('INSERT INTO secure_users (username, password_hash) VALUES (?, ?)', 
                    ('admin', bcrypt.hashpw('Admin@Secure123'.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')))
        conn.execute('INSERT INTO secure_users (username, password_hash) VALUES (?, ?)', 
                    ('user', bcrypt.hashpw('User@Secure456'.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')))
        conn.execute('INSERT INTO secure_users (username, password_hash) VALUES (?, ?)', 
                    ('john', bcrypt.hashpw('John@Secure789'.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')))
        
        conn.commit()
        conn.close()
        print("Database initialized with sample users")

# Initialize database on startup
init_db()

def log_attempt(system, username, success, ip_address, attack_type=None):
    """Log login attempt to database"""
    conn = get_db_connection()
    conn.execute('''
        INSERT INTO login_attempts (system, username, attempt_time, success, ip_address, attack_type)
        VALUES (?, ?, ?, ?, ?, ?)
    ''', (system, username, datetime.now().isoformat(), success, ip_address, attack_type))
    conn.commit()
    conn.close()

def get_login_attempts(system, limit=20):
    """Get recent login attempts for a system"""
    conn = get_db_connection()
    cursor = conn.execute('''
        SELECT username, attempt_time, success, ip_address, attack_type
        FROM login_attempts
        WHERE system = ?
        ORDER BY attempt_time DESC
        LIMIT ?
    ''', (system, limit))
    attempts = cursor.fetchall()
    conn.close()
    return attempts

def check_rate_limit(ip_address):
    """Check if IP has exceeded rate limit (5 requests per minute)"""
    now = time.time()
    one_minute_ago = now - 60
    
    # Clean old requests
    rate_limits[ip_address] = [t for t in rate_limits[ip_address] if t > one_minute_ago]
    
    if len(rate_limits[ip_address]) >= 5:
        return False
    
    rate_limits[ip_address].append(now)
    return True

def check_account_lockout(username):
    """Check if account is locked out"""
    if username in account_lockouts:
        if datetime.now() < account_lockouts[username]:
            return True, account_lockouts[username]
        else:
            # Lockout expired
            del account_lockouts[username]
    return False, None

def increment_failed_attempts(username):
    """Track failed attempts and lock out account if needed"""
    if username not in login_attempts:
        login_attempts[username] = []
    
    now = datetime.now()
    # Clean attempts older than 5 minutes
    login_attempts[username] = [t for t in login_attempts[username] if now - t < timedelta(minutes=5)]
    
    login_attempts[username].append(now)
    
    if len(login_attempts[username]) >= 5:
        # Lock out for 5 minutes
        account_lockouts[username] = datetime.now() + timedelta(minutes=5)
        return True
    
    return False

@app.route('/')
def index():
    """Landing page with demo options"""
    vulnerable_attempts = get_login_attempts('vulnerable', 5)
    secure_attempts = get_login_attempts('secure', 5)
    
    return render_template('index.html', 
                         vulnerable_attempts=vulnerable_attempts,
                         secure_attempts=secure_attempts)

@app.route('/vulnerable', methods=['GET', 'POST'])
def vulnerable_login():
    """Vulnerable login with no security controls"""
    message = None
    success = False
    attack_info = None
    
    if request.method == 'POST':
        username = request.form.get('username', '')
        password = request.form.get('password', '')
        ip_address = request.remote_addr
        attack_type = request.form.get('attack_type', None)
        
        conn = get_db_connection()
        
        # VULNERABLE CODE: Plain text password comparison, no rate limiting, no lockout
        # This is intentionally vulnerable to demonstrate authentication failures
        query = f"SELECT * FROM vulnerable_users WHERE username = '{username}' AND password = '{password}'"
        
        try:
            cursor = conn.execute(query)
            user = cursor.fetchone()
            
            if user:
                message = f"⚠️ LOGIN SUCCESSFUL - Username: {username}, Password: {password} (stored in plain text!)"
                success = True
                log_attempt('vulnerable', username, True, ip_address, attack_type)
            else:
                message = f"❌ Login failed for username: {username}"
                log_attempt('vulnerable', username, False, ip_address, attack_type)
            
            conn.close()
        except Exception as e:
            message = f"Error: {str(e)}"
            conn.close()
        
        if attack_type:
            attack_info = f"Attack type: {attack_type}"
    
    attempts = get_login_attempts('vulnerable', 10)
    
    return render_template('vulnerable_login.html', 
                         message=message, 
                         success=success,
                         attack_info=attack_info,
                         attempts=attempts)

@app.route('/secure', methods=['GET', 'POST'])
def secure_login():
    """Secure login with proper authentication controls"""
    message = None
    success = False
    lockout_info = None
    rate_limit_info = None
    
    if request.method == 'POST':
        username = request.form.get('username', '')
        password = request.form.get('password', '')
        ip_address = request.remote_addr
        
        # Check rate limiting
        if not check_rate_limit(ip_address):
            message = "❌ Too many login attempts. Please wait 1 minute before trying again."
            rate_limit_info = "Rate limit exceeded (5 requests per minute)"
            log_attempt('secure', username, False, ip_address, 'rate_limit')
            attempts = get_login_attempts('secure', 10)
            return render_template('secure_login.html', 
                                 message=message,
                                 success=success,
                                 lockout_info=lockout_info,
                                 rate_limit_info=rate_limit_info,
                                 attempts=attempts)
        
        # Check account lockout
        is_locked, lockout_until = check_account_lockout(username)
        if is_locked:
            message = f"❌ Account locked. Try again after {lockout_until.strftime('%H:%M:%S')}"
            lockout_info = f"Account locked until {lockout_until.strftime('%H:%M:%S')}"
            log_attempt('secure', username, False, ip_address, 'account_lockout')
            attempts = get_login_attempts('secure', 10)
            return render_template('secure_login.html', 
                                 message=message,
                                 success=success,
                                 lockout_info=lockout_info,
                                 rate_limit_info=rate_limit_info,
                                 attempts=attempts)
        
        conn = get_db_connection()
        
        # SECURE CODE: Parameterized query with bcrypt password verification
        query = "SELECT * FROM secure_users WHERE username = ?"
        
        try:
            cursor = conn.execute(query, (username,))
            user = cursor.fetchone()
            
            if user:
                # Verify password using bcrypt
                if bcrypt.checkpw(password.encode('utf-8'), user['password_hash'].encode('utf-8')):
                    message = "✅ LOGIN SUCCESSFUL - Valid credentials with proper authentication"
                    success = True
                    log_attempt('secure', username, True, ip_address)
                    # Reset failed attempts on successful login
                    if username in login_attempts:
                        del login_attempts[username]
                else:
                    message = "❌ Invalid credentials"
                    is_locked = increment_failed_attempts(username)
                    if is_locked:
                        lockout_info = "Account locked for 5 minutes due to too many failed attempts"
                    log_attempt('secure', username, False, ip_address)
            else:
                # Generic error message to prevent username enumeration
                message = "❌ Invalid credentials"
                log_attempt('secure', None, False, ip_address)
            
            conn.close()
        except Exception as e:
            message = f"Error: {str(e)}"
            conn.close()
    
    attempts = get_login_attempts('secure', 10)
    
    return render_template('secure_login.html', 
                         message=message, 
                         success=success,
                         lockout_info=lockout_info,
                         rate_limit_info=rate_limit_info,
                         attempts=attempts)

@app.route('/compare')
def compare():
    """Comparison page showing side-by-side statistics"""
    vulnerable_attempts = get_login_attempts('vulnerable', 50)
    secure_attempts = get_login_attempts('secure', 50)
    
    vulnerable_success = sum(1 for a in vulnerable_attempts if a['success'])
    vulnerable_total = len(vulnerable_attempts)
    secure_success = sum(1 for a in secure_attempts if a['success'])
    secure_total = len(secure_attempts)
    
    return render_template('compare.html',
                         vulnerable_attempts=vulnerable_attempts,
                         secure_attempts=secure_attempts,
                         vulnerable_success=vulnerable_success,
                         vulnerable_total=vulnerable_total,
                         secure_success=secure_success,
                         secure_total=secure_total)

@app.route('/api/reset')
def reset_demo():
    """Reset all login attempts and lockouts"""
    conn = get_db_connection()
    conn.execute('DELETE FROM login_attempts')
    conn.commit()
    conn.close()
    
    rate_limits.clear()
    account_lockouts.clear()
    login_attempts.clear()
    
    return jsonify({'status': 'success', 'message': 'Demo reset successfully'})

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5002)
