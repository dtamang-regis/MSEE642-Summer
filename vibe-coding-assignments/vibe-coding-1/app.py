from flask import Flask, render_template, request, redirect, url_for, flash
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
                password TEXT NOT NULL
            )
        ''')
        
        # Insert sample users
        conn.execute('INSERT INTO users (username, password) VALUES (?, ?)', ('admin', 'admin123'))
        conn.execute('INSERT INTO users (username, password) VALUES (?, ?)', ('user', 'user123'))
        conn.commit()
        conn.close()
        print("Database initialized with sample users")

# Initialize database on startup
init_db()

@app.route('/')
def index():
    """Home page with demo options"""
    return render_template('index.html')

@app.route('/vulnerable-login', methods=['GET', 'POST'])
def vulnerable_login():
    """Vulnerable login using string concatenation (SQL Injection vulnerable)"""
    message = None
    query_info = None
    success = False
    
    if request.method == 'POST':
        username = request.form.get('username', '')
        password = request.form.get('password', '')
        
        conn = get_db_connection()
        
        # VULNERABLE CODE: Using string concatenation
        # This is intentionally vulnerable to demonstrate SQL injection
        query = f"SELECT * FROM users WHERE username = '{username}' AND password = '{password}'"
        query_info = f"Vulnerable query executed: {query}"
        
        try:
            cursor = conn.execute(query)
            user = cursor.fetchone()
            
            if user:
                message = "⚠️ LOGIN SUCCESSFUL (via SQL Injection vulnerability!)"
                success = True
            else:
                message = "❌ Login failed"
            
            conn.close()
        except Exception as e:
            message = f"Error: {str(e)}"
            conn.close()
    
    return render_template('vulnerable_login.html', 
                         message=message, 
                         query_info=query_info,
                         success=success)

@app.route('/secure-login', methods=['GET', 'POST'])
def secure_login():
    """Secure login using parameterized queries"""
    message = None
    query_info = None
    success = False
    
    if request.method == 'POST':
        username = request.form.get('username', '')
        password = request.form.get('password', '')
        
        conn = get_db_connection()
        
        # SECURE CODE: Using parameterized queries
        # This prevents SQL injection attacks
        query = "SELECT * FROM users WHERE username = ? AND password = ?"
        query_info = f"Secure query executed with parameterized statement"
        
        try:
            cursor = conn.execute(query, (username, password))
            user = cursor.fetchone()
            
            if user:
                message = "✅ LOGIN SUCCESSFUL (valid credentials)"
                success = True
            else:
                message = "❌ Login failed (invalid credentials)"
            
            conn.close()
        except Exception as e:
            message = f"Error: {str(e)}"
            conn.close()
    
    return render_template('secure_login.html', 
                         message=message, 
                         query_info=query_info,
                         success=success)

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5001)
