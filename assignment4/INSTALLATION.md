# Installation Instructions

## Prerequisites

Before installing the Hiking Club application, ensure you have the following installed on your system:

- **Node.js** (v16 or higher) - Download from [https://nodejs.org/](https://nodejs.org/)
- **npm** (comes with Node.js) - Verify installation with `npm --version`
- **Git** (optional, for cloning) - Download from [https://git-scm.com/](https://git-scm.com/)

## Project Structure

The application is divided into two main parts:
- `backend/` - Express.js API server with SQLite database
- `frontend/` - React frontend built with Vite

## Backend Installation

1. **Navigate to the backend directory:**
   ```bash
   cd backend
   ```

2. **Install backend dependencies:**
   ```bash
   npm install
   ```

   This will install the following packages:
   - express - Web framework
   - sqlite3 - SQLite database driver
   - bcryptjs - Password hashing
   - jsonwebtoken - JWT authentication
   - cors - Cross-origin resource sharing
   - dotenv - Environment variable management
   - express-validator - Input validation
   - nodemon (dev) - Auto-restart during development

3. **Create environment file:**
   Create a `.env` file in the backend directory with the following content:
   ```
   PORT=5000
   JWT_SECRET=your-secret-key-change-this-in-production
   NODE_ENV=development
   ```

   **Important:** Change the `JWT_SECRET` to a secure random string in production.

4. **Start the backend server:**
   
   For development (with auto-restart):
   ```bash
   npm run dev
   ```
   
   For production:
   ```bash
   npm start
   ```

   The backend will start on `http://localhost:5000`

5. **Verify backend is running:**
   Visit `http://localhost:5000/api/health` in your browser or use curl:
   ```bash
   curl http://localhost:5000/api/health
   ```

   You should see: `{"success":true,"message":"Server is running"}`

## Frontend Installation

1. **Navigate to the frontend directory:**
   ```bash
   cd frontend
   ```

2. **Install frontend dependencies:**
   ```bash
   npm install
   ```

   This will install the following packages:
   - react - React library
   - react-dom - React DOM renderer
   - react-router-dom - Routing library
   - @vitejs/plugin-react - Vite React plugin
   - vite - Build tool and dev server

3. **Start the frontend development server:**
   ```bash
   npm run dev
   ```

   The frontend will start on `http://localhost:3000`

4. **Access the application:**
   Open your browser and navigate to `http://localhost:3000`

## Running Both Servers Simultaneously

For development, you may want to run both servers at the same time. You can do this by:

**Option 1: Using two terminal windows**
- Terminal 1: `cd backend && npm run dev`
- Terminal 2: `cd frontend && npm run dev`

**Option 2: Using a tool like concurrently**
1. Install concurrently in the root directory:
   ```bash
   npm install --save-dev concurrently
   ```
2. Add scripts to root package.json:
   ```json
   {
     "scripts": {
       "dev": "concurrently \"npm run dev --prefix backend\" \"npm run dev --prefix frontend\""
     }
   }
   ```
3. Run from root:
   ```bash
   npm run dev
   ```

## Database Setup

The SQLite database is automatically created on first run. You don't need to manually set up the database. The database file (`hiking_club.db`) will be created in the backend directory.

To seed initial data (optional), you can manually insert records using a SQLite client or create a seed script.

## Environment Variables

### Backend (.env)
```
PORT=5000
JWT_SECRET=your-secret-key-change-this-in-production
NODE_ENV=development
```

### Frontend
The frontend uses Vite's proxy configuration to forward API requests to the backend. This is configured in `vite.config.js`. No additional environment variables are needed for the frontend.

## Building for Production

### Backend
The backend is already production-ready. Ensure you:
1. Set `NODE_ENV=production` in your environment
2. Use a strong `JWT_SECRET`
3. Consider using a process manager like PM2:
   ```bash
   npm install -g pm2
   pm2 start backend/server.js --name hiking-club-api
   ```

### Frontend
Build the frontend for production:
```bash
cd frontend
npm run build
```

This creates a `dist/` folder with optimized static files. You can serve these files using any static file server (nginx, Apache, or Express static middleware).

## Troubleshooting

### Port Already in Use
If you see an error that port 5000 or 3000 is already in use:
- Change the port in `.env` (backend) or `vite.config.js` (frontend)
- Or kill the process using the port:
  ```bash
  # On macOS/Linux
  lsof -ti:5000 | xargs kill -9
  
  # On Windows
  netstat -ano | findstr :5000
  taskkill /PID <PID> /F
  ```

### CORS Errors
If you encounter CORS errors, ensure the backend CORS configuration allows requests from your frontend URL. The current configuration allows all origins for development.

### Database Lock Errors
If you encounter database lock errors, ensure only one backend instance is running. SQLite is a file-based database and doesn't handle concurrent writes well.

### Module Not Found Errors
If you see "module not found" errors:
1. Delete `node_modules` folder and `package-lock.json`
2. Run `npm install` again

## Default Admin User

To create an admin user, you can:
1. Register a new user through the UI
2. Manually update the user's role in the database to 'admin'
3. Or use the admin panel once logged in as an admin

## Security Considerations for Production

Before deploying to production:
1. Change the JWT_SECRET to a strong, random value
2. Enable HTTPS
3. Use environment-specific configurations
4. Implement rate limiting
5. Add input sanitization
6. Enable CORS only for trusted domains
7. Use a production-grade database (PostgreSQL, MySQL) instead of SQLite
8. Implement proper logging and monitoring
9. Set up regular backups
10. Review and update dependencies regularly
