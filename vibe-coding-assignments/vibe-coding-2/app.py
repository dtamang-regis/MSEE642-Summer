from flask import Flask, render_template, request, redirect, url_for, flash, session
import sqlite3
import os

app = Flask(__name__)
app.secret_key = 'educational-demo-secret-key-12345'

# Database setup
DATABASE = 'database.db'

def get_db_connection():
    conn = sqlite3.connect(DATABASE)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    """Initialize the database with sample users"""
    if not os.path.exists(DATABASE):
        conn = get_db_connection()
        conn.execute('''
            CREATE TABLE users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                username TEXT NOT NULL UNIQUE,
                password TEXT NOT NULL,
                role TEXT NOT NULL DEFAULT 'user'
            )
        ''')
        
        # Insert sample users
        conn.execute('INSERT INTO users (username, password, role) VALUES (?, ?, ?)', 
                    ('admin', 'admin123', 'admin'))
        conn.execute('INSERT INTO users (username, password, role) VALUES (?, ?, ?)', 
                    ('user', 'user123', 'user'))
        conn.execute('INSERT INTO users (username, password, role) VALUES (?, ?, ?)', 
                    ('user2', 'user123', 'user'))
        conn.commit()
        conn.close()
        print("Database initialized with sample users")

# Initialize database on startup
init_db()

# ============ VULNERABLE DEMO ROUTES ============

@app.route('/vulnerable')
def vulnerable_index():
    """Vulnerable demo landing page"""
    return render_template('vulnerable_index.html')

@app.route('/vulnerable/login', methods=['GET', 'POST'])
def vulnerable_login():
    """Vulnerable login - no proper session management"""
    error = None
    if request.method == 'POST':
        username = request.form.get('username', '')
        password = request.form.get('password', '')
        
        conn = get_db_connection()
        # VULNERABLE: No proper password hashing or session management
        user = conn.execute('SELECT * FROM users WHERE username = ? AND password = ?', 
                          (username, password)).fetchone()
        conn.close()
        
        if user:
            # VULNERABLE: Storing user info in session without proper validation
            session['vulnerable_user_id'] = user['id']
            session['vulnerable_username'] = user['username']
            session['vulnerable_role'] = user['role']
            return redirect(url_for('vulnerable_dashboard'))
        else:
            error = 'Invalid credentials'
    
    return render_template('vulnerable_login.html', error=error)

@app.route('/vulnerable/dashboard')
def vulnerable_dashboard():
    """Vulnerable dashboard - shows all admin actions to everyone"""
    if 'vulnerable_user_id' not in session:
        return redirect(url_for('vulnerable_login'))
    
    username = session.get('vulnerable_username')
    role = session.get('vulnerable_role')
    
    # VULNERABLE: Admin actions visible to all users
    return render_template('vulnerable_dashboard.html', 
                         username=username, 
                         role=role,
                         show_admin_actions=True)  # Always show admin actions

@app.route('/vulnerable/admin')
def vulnerable_admin():
    """VULNERABLE: Admin panel accessible by anyone who knows the URL"""
    if 'vulnerable_user_id' not in session:
        return redirect(url_for('vulnerable_login'))
    
    # VULNERABLE: No role check - any logged-in user can access
    username = session.get('vulnerable_username')
    role = session.get('vulnerable_role')
    
    return render_template('vulnerable_admin.html', 
                         username=username, 
                         role=role)

@app.route('/vulnerable/profile/<int:user_id>')
def vulnerable_profile(user_id):
    """VULNERABLE: IDOR - can view any user's profile by changing ID in URL"""
    if 'vulnerable_user_id' not in session:
        return redirect(url_for('vulnerable_login'))
    
    # VULNERABLE: No check if user_id belongs to current user
    conn = get_db_connection()
    profile_user = conn.execute('SELECT * FROM users WHERE id = ?', (user_id,)).fetchone()
    conn.close()
    
    if profile_user:
        return render_template('vulnerable_profile.html', 
                             profile_user=profile_user,
                             current_user_id=session.get('vulnerable_user_id'),
                             is_idor=session.get('vulnerable_user_id') != user_id)
    else:
        return 'User not found', 404

@app.route('/vulnerable/logout')
def vulnerable_logout():
    """Logout for vulnerable demo"""
    session.clear()
    return redirect(url_for('vulnerable_index'))

# ============ SECURE DEMO ROUTES ============

@app.route('/secure')
def secure_index():
    """Secure demo landing page"""
    return render_template('secure_index.html')

@app.route('/secure/login', methods=['GET', 'POST'])
def secure_login():
    """Secure login with proper session management"""
    error = None
    if request.method == 'POST':
        username = request.form.get('username', '')
        password = request.form.get('password', '')
        
        conn = get_db_connection()
        user = conn.execute('SELECT * FROM users WHERE username = ? AND password = ?', 
                          (username, password)).fetchone()
        conn.close()
        
        if user:
            # SECURE: Proper session management
            session['secure_user_id'] = user['id']
            session['secure_username'] = user['username']
            session['secure_role'] = user['role']
            session.permanent = True
            return redirect(url_for('secure_dashboard'))
        else:
            error = 'Invalid credentials'
    
    return render_template('secure_login.html', error=error)

@app.route('/secure/dashboard')
def secure_dashboard():
    """Secure dashboard - admin actions only shown to admins"""
    if 'secure_user_id' not in session:
        return redirect(url_for('secure_login'))
    
    username = session.get('secure_username')
    role = session.get('secure_role')
    
    # SECURE: Only show admin actions to admin role
    show_admin_actions = (role == 'admin')
    
    return render_template('secure_dashboard.html', 
                         username=username, 
                         role=role,
                         show_admin_actions=show_admin_actions)

@app.route('/secure/admin')
def secure_admin():
    """SECURE: Admin panel protected by role check"""
    if 'secure_user_id' not in session:
        return redirect(url_for('secure_login'))
    
    # SECURE: Role check - only admins can access
    if session.get('secure_role') != 'admin':
        return render_template('secure_403.html'), 403
    
    username = session.get('secure_username')
    role = session.get('secure_role')
    
    return render_template('secure_admin.html', 
                         username=username, 
                         role=role)

@app.route('/secure/profile/<int:user_id>')
def secure_profile(user_id):
    """SECURE: Users can only view their own profile (IDOR fix)"""
    if 'secure_user_id' not in session:
        return redirect(url_for('secure_login'))
    
    current_user_id = session.get('secure_user_id')
    
    # SECURE: Check if user_id belongs to current user
    if current_user_id != user_id:
        return render_template('secure_403.html'), 403
    
    conn = get_db_connection()
    profile_user = conn.execute('SELECT * FROM users WHERE id = ?', (user_id,)).fetchone()
    conn.close()
    
    if profile_user:
        return render_template('secure_profile.html', 
                             profile_user=profile_user,
                             current_user_id=current_user_id,
                             is_idor=False)
    else:
        return 'User not found', 404

@app.route('/secure/logout')
def secure_logout():
    """Logout for secure demo"""
    session.clear()
    return redirect(url_for('secure_index'))

# ============ MAIN LANDING PAGE ============

@app.route('/')
def index():
    """Main landing page"""
    return render_template('index.html')

@app.route('/screenshots')
def screenshots():
    """Screenshots page listing required screenshots"""
    return render_template('screenshots.html')

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5002)
