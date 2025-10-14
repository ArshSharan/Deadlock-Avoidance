# Setup Guide - College Fest Resource Allocation System

This guide will help you set up and run the project on your local machine.

---

## Prerequisites

Before you begin, ensure you have the following installed:

### Required Software
- **Python 3.8 or higher** - [Download Python](https://www.python.org/downloads/)
- **Node.js 16 or higher** - [Download Node.js](https://nodejs.org/)
- **npm** (comes with Node.js) or **yarn**
- **Git** (optional, for cloning)

### Verify Installation
Open a terminal/command prompt and run:

```bash
python --version    # Should show Python 3.8+
node --version      # Should show Node 16+
npm --version       # Should show npm 7+
```

---

## Installation Steps

### Step 1: Clone or Download the Repository

**Option A: Using Git**
```bash
git clone <repository-url>
cd Deadlock-Avoidance
```

**Option B: Download ZIP**
- Download the project ZIP file
- Extract to a folder
- Open terminal in that folder

---

### Step 2: Backend Setup (Python/Flask)

1. **Navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Create a virtual environment (recommended):**
   
   **Windows:**
   ```bash
   python -m venv venv
   venv\Scripts\activate
   ```
   
   **macOS/Linux:**
   ```bash
   python3 -m venv venv
   source venv/bin/activate
   ```

3. **Install Python dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

4. **Verify installation:**
   ```bash
   python app.py
   ```
   
   You should see:
   ```
   ============================================================
   College Fest Resource Allocation System
      Banker's Algorithm Backend Server
   ============================================================
   Server starting on http://localhost:5000
   ...
   ```

5. **Keep this terminal running** (backend server)

---

### Step 3: Frontend Setup (React)

1. **Open a NEW terminal** (keep backend running)

2. **Navigate to frontend directory:**
   ```bash
   cd frontend
   ```

3. **Install Node.js dependencies:**
   ```bash
   npm install
   ```
   
   This may take 2-5 minutes depending on your internet speed.

4. **Start the React development server:**
   ```bash
   npm start
   ```
   
   The browser should automatically open to `http://localhost:3000`

---

## Verification

If everything is set up correctly:

1. **Backend** runs on `http://localhost:5000`
2. **Frontend** runs on `http://localhost:3000`
3. Browser opens automatically showing the application
4. You should see the main interface with resource allocation controls

---

## Quick Test

1. Click **"Load"** button to load the Basic scenario
2. Select a club from the dropdown
3. Enter resource request values (e.g., 1, 1, 0)
4. Click **"Check Safety & Allocate"**
5. You should see a result showing safe/unsafe state

---

## Troubleshooting

### Backend Issues

**Problem: "Module not found" error**
```bash
# Solution: Reinstall dependencies
pip install -r requirements.txt --force-reinstall
```

**Problem: "Port 5000 already in use"**
```bash
# Solution: Kill the process or change port in app.py
# Windows: netstat -ano | findstr :5000
# macOS/Linux: lsof -ti:5000 | xargs kill -9
```

**Problem: "Python not found"**
```bash
# Try using python3 instead of python
python3 --version
python3 -m venv venv
```

---

### Frontend Issues

**Problem: "npm command not found"**
- Install Node.js from [nodejs.org](https://nodejs.org/)
- Restart terminal after installation

**Problem: "Port 3000 already in use"**
- The app will prompt to use another port (e.g., 3001)
- Type 'Y' to accept

**Problem: "Module not found" or dependency errors**
```bash
# Solution: Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

**Problem: Tailwind CSS not working**
```bash
# Ensure postcss.config.js and tailwind.config.js exist
# Restart the dev server
npm start
```

---

### Connection Issues

**Problem: "Network Error" or "Backend not responding"**

1. Verify backend is running on port 5000
2. Check backend terminal for errors
3. Try accessing `http://localhost:5000/api/health` in browser
4. Ensure no firewall is blocking the connection

---

## Restarting the Application

### To Stop:
- Press `Ctrl + C` in both terminal windows

### To Start Again:

**Terminal 1 (Backend):**
```bash
cd backend
# Activate venv if using one
python app.py
```

**Terminal 2 (Frontend):**
```bash
cd frontend
npm start
```

---

## Building for Production

### Frontend Build:
```bash
cd frontend
npm run build
```

This creates an optimized production build in `frontend/build/`

### Deployment:
- Backend: Deploy Flask app using Gunicorn, uWSGI, or similar
- Frontend: Serve the `build/` folder using Nginx, Apache, or static hosting

---

## Project Structure

```
Deadlock-Avoidance/
├── backend/
│   ├── app.py                    # Flask server
│   ├── bankers_algorithm.py      # Core algorithm
│   └── requirements.txt          # Python dependencies
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/           # React components
│   │   ├── services/             # API services
│   │   ├── App.js               # Main app
│   │   └── index.js             # Entry point
│   ├── package.json             # Node dependencies
│   └── tailwind.config.js       # Tailwind config
├── README.md
└── SETUP_GUIDE.md (this file)
```

---

## Getting Help

If you encounter issues not covered here:

1. Check the main README.md for additional information
2. Review error messages carefully
3. Ensure all prerequisites are correctly installed
4. Try the troubleshooting steps above

---

## Next Steps

Once everything is running:

1. Explore the different scenarios (Basic, Complex, Unsafe)
2. Try creating custom resource allocations
3. Observe how the Banker's Algorithm prevents deadlocks
4. Export logs to see the allocation history

---

**The Kernel Crew - Arsh Sharan & Keshav Gujrathi**
