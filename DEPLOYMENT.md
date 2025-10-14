# Deployment Guide

This guide explains how to deploy the College Fest Resource Allocation System using Vercel (frontend) and Render (backend).

---

## Architecture

- **Frontend (React)**: Deployed on Vercel
- **Backend (Flask)**: Deployed on Render
- **Communication**: Frontend makes API calls to backend via HTTPS

---

## Prerequisites

1. **GitHub Account**: Push your code to GitHub
2. **Vercel Account**: Sign up at [vercel.com](https://vercel.com)
3. **Render Account**: Sign up at [render.com](https://render.com)

---

## Part 1: Deploy Backend on Render

### Step 1: Prepare Backend

The backend is already configured with:
- `requirements.txt` (includes gunicorn)
- `Procfile` (for Render)
- `render.yaml` (optional configuration)

### Step 2: Push to GitHub

```bash
git add .
git commit -m "Prepare for deployment"
git push origin main
```

### Step 3: Deploy on Render

1. **Go to Render Dashboard**: [dashboard.render.com](https://dashboard.render.com)

2. **Create New Web Service**:
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Select your repository

3. **Configure Service**:
   - **Name**: `bankers-algorithm-backend` (or your choice)
   - **Region**: Choose closest to your users
   - **Branch**: `main`
   - **Root Directory**: `backend`
   - **Runtime**: `Python 3`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `gunicorn app:app`

4. **Environment Variables**:
   - `PYTHON_VERSION`: `3.9.0`
   - `FLASK_ENV`: `production`

5. **Create Web Service**: Click "Create Web Service"

6. **Wait for Deployment**: Takes 2-5 minutes

7. **Copy Backend URL**: You'll get a URL like:
   ```
   https://bankers-algorithm-backend.onrender.com
   ```

### Step 4: Test Backend

Visit: `https://your-backend-url.onrender.com/api/health`

You should see:
```json
{
  "status": "healthy",
  "message": "Banker's Algorithm API is running",
  "timestamp": "..."
}
```

---

## Part 2: Deploy Frontend on Vercel

### Step 1: Update Frontend API URL

1. **Create `.env.production` file** in `frontend/` folder:

```bash
REACT_APP_API_URL=https://your-backend-url.onrender.com/api
```

Replace `your-backend-url` with your actual Render URL.

2. **Update CORS on Backend** (if needed):

Edit `backend/app.py`:
```python
from flask_cors import CORS

app = Flask(__name__)
CORS(app, origins=['https://your-vercel-app.vercel.app'])
```

Or allow all origins (less secure):
```python
CORS(app, origins='*')
```

### Step 2: Deploy on Vercel

#### Option A: Using Vercel CLI (Recommended)

1. **Install Vercel CLI**:
```bash
npm install -g vercel
```

2. **Navigate to frontend**:
```bash
cd frontend
```

3. **Deploy**:
```bash
vercel
```

4. **Follow prompts**:
   - Set up and deploy? `Y`
   - Which scope? (Choose your account)
   - Link to existing project? `N`
   - Project name? (Press enter or type name)
   - In which directory is your code? `./`
   - Override settings? `N`

5. **Deploy to production**:
```bash
vercel --prod
```

#### Option B: Using Vercel Dashboard

1. **Go to Vercel Dashboard**: [vercel.com/dashboard](https://vercel.com/dashboard)

2. **Import Project**:
   - Click "Add New..." → "Project"
   - Import your GitHub repository

3. **Configure Project**:
   - **Framework Preset**: `Create React App`
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `build`

4. **Environment Variables**:
   - Add: `REACT_APP_API_URL` = `https://your-backend-url.onrender.com/api`

5. **Deploy**: Click "Deploy"

6. **Wait for Deployment**: Takes 1-3 minutes

7. **Get Frontend URL**: You'll get a URL like:
   ```
   https://your-app.vercel.app
   ```

### Step 3: Update Backend CORS

Go back to Render and update `backend/app.py` to allow your Vercel domain:

```python
CORS(app, origins=['https://your-app.vercel.app'])
```

Commit and push changes. Render will auto-deploy.

---

## Part 3: Verify Deployment

### Test Complete Flow

1. **Visit Frontend**: `https://your-app.vercel.app`

2. **Check Console**: Open browser DevTools → Console
   - Should see no CORS errors
   - API calls should succeed

3. **Test Features**:
   - Load a scenario
   - Make a resource request
   - Check if results display
   - Verify logs work

4. **Test API Directly**: 
   - Visit: `https://your-backend-url.onrender.com/api/health`
   - Should return healthy status

---

## Troubleshooting

### CORS Errors

**Problem**: "Access to fetch at '...' from origin '...' has been blocked by CORS policy"

**Solution**:
1. Update `backend/app.py`:
```python
CORS(app, origins=['https://your-vercel-app.vercel.app'], supports_credentials=True)
```

2. Or allow all (development only):
```python
CORS(app, origins='*')
```

### Backend Not Responding

**Problem**: Frontend can't reach backend

**Solutions**:
1. Check backend is running on Render
2. Verify `REACT_APP_API_URL` in Vercel environment variables
3. Check Render logs for errors
4. Ensure backend URL is correct (include `/api`)

### Build Failures

**Frontend Build Fails**:
- Check `package.json` is in `frontend/` folder
- Verify all dependencies are listed
- Check build logs on Vercel

**Backend Build Fails**:
- Check `requirements.txt` is correct
- Verify Python version compatibility
- Check Render logs for specific errors

### Environment Variables Not Working

**Solution**:
1. Vercel: Add variables in Project Settings → Environment Variables
2. Redeploy after adding variables
3. Check variable names match exactly (including `REACT_APP_` prefix)

---

## Custom Domain (Optional)

### For Vercel (Frontend)

1. Go to Project Settings → Domains
2. Add your custom domain
3. Follow DNS configuration instructions

### For Render (Backend)

1. Go to Service Settings → Custom Domain
2. Add your custom domain
3. Update DNS records as instructed

---

## Continuous Deployment

Both Vercel and Render support automatic deployments:

1. **Push to GitHub**: 
```bash
git add .
git commit -m "Update feature"
git push origin main
```

2. **Auto-Deploy**:
   - Vercel: Automatically deploys on push
   - Render: Automatically deploys on push

---

## Monitoring

### Vercel

- **Analytics**: Project → Analytics
- **Logs**: Project → Deployments → View Function Logs

### Render

- **Logs**: Service → Logs tab
- **Metrics**: Service → Metrics tab
- **Events**: Service → Events tab

---

## Cost

### Vercel (Frontend)
- **Free Tier**: 
  - 100 GB bandwidth/month
  - Unlimited projects
  - Automatic HTTPS
  - Perfect for this project

### Render (Backend)
- **Free Tier**:
  - 750 hours/month (enough for 1 service)
  - Spins down after 15 min inactivity
  - Spins up on request (may take 30-60 seconds)
  - 512 MB RAM
  - Good for demo/development

- **Paid Tier** ($7/month):
  - Always on
  - No spin down
  - Better for production

---

## Alternative: Deploy Both on Vercel

You can deploy both frontend and backend on Vercel, but it requires converting Flask to serverless functions.

**Not recommended** because:
- More complex setup
- Flask not ideal for serverless
- Render's free tier is better for Flask

---

## Summary

**Deployment Steps**:
1. Deploy backend on Render
2. Get backend URL
3. Add backend URL to frontend `.env.production`
4. Deploy frontend on Vercel
5. Update backend CORS with Vercel URL
6. Test everything

**URLs You'll Have**:
- Frontend: `https://your-app.vercel.app`
- Backend: `https://your-backend.onrender.com`

**Total Cost**: $0 (using free tiers)

---

## Support

If you encounter issues:
1. Check deployment logs (Vercel/Render dashboards)
2. Verify environment variables
3. Test backend API directly
4. Check browser console for errors

---

**The Kernel Crew - Arsh Sharan & Keshav Gujrathi**
