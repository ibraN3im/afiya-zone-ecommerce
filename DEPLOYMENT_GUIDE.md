# Afiya Zone - Full Stack E-commerce Platform

## 🌟 Overview
Afiya Zone is a modern full-stack e-commerce platform for natural health products, built with React + Vite frontend and Node.js + Express + MongoDB backend.

## 🏗️ Architecture
- **Frontend**: React 18, TypeScript, Vite, TailwindCSS, Radix UI
- **Backend**: Node.js, Express, MongoDB Atlas
- **Authentication**: JWT tokens
- **API**: RESTful API

---

## 📋 Prerequisites

### Required Software
- Node.js (v18 or higher)
- npm or yarn
- Git

### MongoDB Atlas Account
1. Create a free account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a new cluster (Free tier M0 available)
3. Create a database user
4. Get your connection string

---

## 🚀 Setup Instructions

### 1️⃣ Backend Setup

#### Step 1: Navigate to server directory
```bash
cd server
```

#### Step 2: Install dependencies
```bash
npm install
```

#### Step 3: Configure environment variables
Create a `.env` file in the `server` folder:

```bash
# Copy the example file
cp .env.example .env
```

Edit `.env` and add your MongoDB Atlas connection string:

```env
MONGODB_URI=mongodb+srv://YOUR_USERNAME:YOUR_PASSWORD@YOUR_CLUSTER.mongodb.net/afiyazone?retryWrites=true&w=majority
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
PORT=5000
NODE_ENV=development
```

**Important**: Replace:
- `YOUR_USERNAME` with your MongoDB Atlas username
- `YOUR_PASSWORD` with your MongoDB Atlas password
- `YOUR_CLUSTER` with your cluster name
- `JWT_SECRET` with a random secure string

#### Step 4: Seed the database with sample products
```bash
node seedProducts.js
```

#### Step 5: Start the backend server
```bash
npm run dev
```

Backend will run on `http://localhost:5000`

---

### 2️⃣ Frontend Setup

#### Step 1: Navigate to root directory (from server folder)
```bash
cd ..
```

#### Step 2: Install dependencies
```bash
npm install
```

#### Step 3: Configure environment variables
The `.env.local` file is already created with the local API URL:

```env
VITE_API_URL=http://localhost:5000/api
```

#### Step 4: Start the frontend development server
```bash
npm run dev
```

Frontend will run on `http://localhost:3000`

---

## 🧪 Testing the Application

1. Open `http://localhost:3000` in your browser
2. Try registering a new user
3. Browse products
4. Add items to cart
5. Complete checkout process

---

## 📦 Production Build

### Build Frontend
```bash
npm run build
```

This creates optimized files in the `build` folder.

### Build Backend
The backend doesn't need building, but ensure:
1. All environment variables are set correctly
2. `NODE_ENV=production` in production

---

## 🌐 Free Hosting Options

### Option 1: **Render** (Recommended - Easy & Free) ⭐

#### For Backend:
1. **Create account** at [Render.com](https://render.com)
2. Click **"New +"** → **"Web Service"**
3. Connect your GitHub repository
4. Configure:
   - **Name**: afiya-zone-backend
   - **Root Directory**: server
   - **Environment**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
5. Add Environment Variables:
   - `MONGODB_URI`: Your MongoDB Atlas connection string
   - `JWT_SECRET`: Your secret key
   - `NODE_ENV`: production
6. Click **"Create Web Service"**

Your backend will be available at: `https://afiya-zone-backend.onrender.com`

#### For Frontend:
1. Click **"New +"** → **"Static Site"**
2. Connect your GitHub repository
3. Configure:
   - **Name**: afiya-zone
   - **Root Directory**: (leave blank)
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: build
4. Add Environment Variable:
   - `VITE_API_URL`: `https://afiya-zone-backend.onrender.com/api`
5. Click **"Create Static Site"**

Your frontend will be available at: `https://afiya-zone.onrender.com`

**Pros**:
- ✅ Very easy setup
- ✅ Auto-deploy from GitHub
- ✅ Free SSL certificate
- ✅ Good for fullstack apps

**Cons**:
- ⚠️ Free tier apps sleep after 15 min of inactivity (takes 30s to wake up)

---

### Option 2: **Vercel** (Frontend) + **Railway** (Backend)

#### Frontend on Vercel:
1. **Create account** at [Vercel.com](https://vercel.com)
2. Click **"Add New Project"**
3. Import your GitHub repository
4. Configure:
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: build
5. Add Environment Variable:
   - `VITE_API_URL`: Your backend URL
6. Click **"Deploy"**

#### Backend on Railway:
1. **Create account** at [Railway.app](https://railway.app)
2. Click **"New Project"** → **"Deploy from GitHub repo"**
3. Select your repository
4. Configure:
   - **Root Directory**: server
   - **Start Command**: `npm start`
5. Add Environment Variables (same as above)
6. Deploy

**Pros**:
- ✅ Vercel: Lightning fast, excellent DX
- ✅ Railway: Great for Node.js apps
- ✅ Free SSL

**Cons**:
- ⚠️ Railway free tier has limits

---

### Option 3: **Netlify** (Frontend) + **Render** (Backend)

#### Frontend on Netlify:
1. **Create account** at [Netlify.com](https://netlify.com)
2. Drag and drop your `build` folder OR connect GitHub
3. Configure build settings:
   - **Build Command**: `npm run build`
   - **Publish Directory**: build
4. Add Environment Variables in Site Settings

**Pros**:
- ✅ Super easy deployment
- ✅ Excellent for static sites
- ✅ Great CDN

---

### Option 4: **Cyclic** (Fullstack in one place)

1. **Create account** at [Cyclic.sh](https://cyclic.sh)
2. Connect GitHub repository
3. It auto-detects and deploys both frontend and backend

**Pros**:
- ✅ Both frontend and backend in one place
- ✅ Simple setup

**Cons**:
- ⚠️ Less customization

---

## 📊 Hosting Comparison Table

| Platform | Type | Free Tier | SSL | Auto-Deploy | Best For |
|----------|------|-----------|-----|-------------|----------|
| **Render** | Fullstack | Yes | Yes | Yes | Complete apps ⭐ |
| **Vercel** | Frontend | Yes | Yes | Yes | React/Vite apps |
| **Netlify** | Frontend | Yes | Yes | Yes | Static sites |
| **Railway** | Backend | Yes | Yes | Yes | Node.js APIs |
| **Cyclic** | Fullstack | Yes | Yes | Yes | Quick deploy |

---

## 🔧 Environment Variables Summary

### Backend (.env)
```env
MONGODB_URI=mongodb+srv://...
JWT_SECRET=your_secret_key
PORT=5000
NODE_ENV=production
```

### Frontend (.env.production)
```env
VITE_API_URL=https://your-backend-url.com/api
```

---

## 📝 Deployment Checklist

- [ ] MongoDB Atlas cluster created and configured
- [ ] Database seeded with products
- [ ] Backend environment variables set
- [ ] Backend deployed and running
- [ ] Frontend environment variables updated with backend URL
- [ ] Frontend built successfully
- [ ] Frontend deployed and accessible
- [ ] Test registration and login
- [ ] Test product browsing
- [ ] Test cart and checkout

---

## 🛠️ API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get user profile (requires auth)

### Products
- `GET /api/products` - Get all products (with filters)
- `GET /api/products/:id` - Get single product
- `POST /api/products` - Create product (admin)
- `PUT /api/products/:id` - Update product (admin)

### Orders
- `POST /api/orders` - Create new order (requires auth)
- `GET /api/orders/my-orders` - Get user's orders (requires auth)
- `GET /api/orders/:id` - Get single order (requires auth)

---

## 🔐 Security Notes

1. **Never commit** `.env` files to Git
2. Use strong, random JWT_SECRET
3. Use strong MongoDB Atlas passwords
4. Enable MongoDB Atlas IP whitelist in production
5. Use HTTPS in production (hosting platforms provide this)

---

## 📞 Support

For issues or questions:
1. Check the console for error messages
2. Verify MongoDB connection string
3. Ensure all environment variables are set correctly
4. Check that both frontend and backend are running

---

## 📄 License

This project is open source and available under the MIT License.

---

## 🎉 Congratulations!

You now have a fully functional full-stack e-commerce platform with MongoDB Atlas integration, ready to deploy to free hosting platforms!

**Recommended Setup for Beginners**:
1. Use **Render** for both frontend and backend
2. Simple, reliable, and truly free
3. Auto-deploys from GitHub
4. Takes about 10-15 minutes to set up

Happy coding! 🚀
