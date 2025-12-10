import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/database.js';
import authRoutes from './routes/auth.js';
import productRoutes from './routes/products.js';
import orderRoutes from './routes/orders.js';
import adminRoutes from './routes/admin.js';

import TeamMember from './models/TeamMember.js';
import Notification from './models/Notification.js';
import jwt from 'jsonwebtoken';
import notificationRoutes from './routes/notifications.js';
import messageRoutes from './routes/messages.js';

// Load environment variables
dotenv.config();

// Initialize Express
const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/messages', messageRoutes);



// Root route
app.get('/', (req, res) => {
  res.json({
    message: 'Afiya Zone API Server',
    status: 'Running',
    version: '1.0.0',
    endpoints: {
      health: '/api/health',
      auth: {
        register: 'POST /api/auth/register',
        login: 'POST /api/auth/login',
        profile: 'GET /api/auth/profile',
        users: 'GET /api/auth/users'
      },
      products: {
        getAll: 'GET /api/products',
        getById: 'GET /api/products/:id',
        create: 'POST /api/products'
      },
      orders: {
        create: 'POST /api/orders',
        myOrders: 'GET /api/orders/my-orders',
        getById: 'GET /api/orders/:id'
      }
    },
    documentation: 'See START_GUIDE.md for more information'
  });
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    message: 'Afiya Zone API is running',
    timestamp: new Date().toISOString()
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Public API endpoint for team members
app.get('/api/team', async (req, res) => {
  try {
    const teamMembers = await TeamMember.find({ isActive: true }).sort({ order: 1, createdAt: -1 });
    res.json({
      count: teamMembers.length,
      teamMembers: teamMembers.map(member => ({
        id: member._id,
        name: member.name,
        position: member.position,
        bio: member.bio,
        image: member.image,
        email: member.email,
        phone: member.phone,
        department: member.department,
        order: member.order,
        isActive: member.isActive
      }))
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching team members', error: error.message });
  }
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    message: 'Route not found',
    requestedUrl: req.originalUrl,
    availableRoutes: {
      root: 'GET /',
      health: 'GET /api/health',
      auth: '/api/auth/*',
      products: '/api/products/*',
      orders: '/api/orders/*'
    },
    hint: 'All API routes start with /api prefix'
  });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📍 Environment: ${process.env.NODE_ENV || 'development'}`);
});