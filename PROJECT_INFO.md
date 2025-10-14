# Project Information

## College Fest Resource Allocation System
**Deadlock Avoidance using Banker's Algorithm**

---

## Team

**The Kernel Crew**
- Arsh Sharan
- Keshav Gujrathi

---

## Project Files

### Documentation (4 files)
1. **README.md** - Main project overview and quick start
2. **ALGORITHM_EXPLANATION.md** - Detailed explanation of Banker's Algorithm
3. **SETUP_GUIDE.md** - Local development setup instructions
4. **DEPLOYMENT.md** - Deployment guide for Vercel and Render

### Backend (Python/Flask)
Located in `backend/` folder:
- **app.py** - Flask server with REST API endpoints
- **bankers_algorithm.py** - Core Banker's Algorithm implementation
- **requirements.txt** - Python dependencies
- **Procfile** - Render deployment configuration
- **render.yaml** - Render service configuration

### Frontend (React)
Located in `frontend/` folder:
- **src/components/** - 8 React components
- **src/services/api.js** - API service layer
- **src/App.js** - Main application
- **package.json** - Node dependencies
- **tailwind.config.js** - Tailwind CSS configuration
- **.env.example** - Environment variable template
- **.env.production** - Production environment variables

### Configuration
- **vercel.json** - Vercel deployment configuration
- **.gitignore** - Git ignore rules
- **LICENSE** - MIT License

---

## Technology Stack

### Frontend
- React 18.2.0
- Tailwind CSS 3.3.3
- Framer Motion 10.16.4
- Axios 1.5.0
- Lucide React 0.284.0

### Backend
- Python 3.8+
- Flask 2.3.3
- Flask-CORS 4.0.0
- Gunicorn 21.2.0 (for production)

---

## Local Development

### Backend
```bash
cd backend
pip install -r requirements.txt
python app.py
```
Runs on: http://localhost:5000

### Frontend
```bash
cd frontend
npm install
npm start
```
Runs on: http://localhost:3000

---

## Deployment

### Backend (Render)
1. Push code to GitHub
2. Create new Web Service on Render
3. Connect GitHub repository
4. Set root directory to `backend`
5. Deploy

### Frontend (Vercel)
1. Update `.env.production` with backend URL
2. Deploy using Vercel CLI or Dashboard
3. Set root directory to `frontend`
4. Deploy

**See DEPLOYMENT.md for detailed instructions**

---

## Features

- Real-time resource allocation simulation
- Visual representation of safe/unsafe states
- Interactive UI with smooth animations
- Request logging and CSV export
- Pre-configured scenarios (Basic, Complex, Unsafe)
- Matrix visualization (Allocation, Max Need, Need)
- Safe sequence display
- Educational OS concept demonstration

---

## API Endpoints

- **POST /api/run-bankers** - Run Banker's Algorithm
- **POST /api/check-safety** - Check system safety
- **GET /api/logs** - Get allocation logs
- **GET /api/logs/export** - Export logs as CSV
- **POST /api/reset** - Reset system
- **POST /api/simulate** - Load demo scenario
- **GET /api/health** - Health check

---

## Project Structure

```
Deadlock-Avoidance/
├── backend/
│   ├── app.py
│   ├── bankers_algorithm.py
│   ├── requirements.txt
│   ├── Procfile
│   └── render.yaml
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── services/
│   │   ├── App.js
│   │   └── index.js
│   ├── package.json
│   ├── .env.example
│   └── .env.production
├── README.md
├── ALGORITHM_EXPLANATION.md
├── SETUP_GUIDE.md
├── DEPLOYMENT.md
├── vercel.json
└── LICENSE
```

---

## Quick Links

- **GitHub Repository**: [Your repo URL]
- **Live Demo (Frontend)**: [Your Vercel URL]
- **API Backend**: [Your Render URL]

---

## License

MIT License - See LICENSE file for details

---

**The Kernel Crew - Arsh Sharan & Keshav Gujrathi**
