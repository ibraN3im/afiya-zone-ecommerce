import express from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import Product from '../models/Product.js';
import Order from '../models/Order.js';
import TeamMember from '../models/TeamMember.js';
import Notification from '../models/Notification.js';
import Message from '../models/Message.js';


const router = express.Router();

// Admin authentication middleware
const adminAuth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({ message: 'No token, authorization denied' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId).select('-password');

    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

    if (user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Admin only.' });
    }

    req.userId = decoded.userId;
    req.user = user;
    next();
  } catch (error) {
    console.error('Admin auth error:', error);

    // Provide more specific error messages
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token expired. Please login again.' });
    } else if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: 'Invalid token. Please login again.' });
    } else {
      return res.status(401).json({ message: 'Token is not valid' });
    }
  }
};

// ==================== USER MANAGEMENT ====================

// Get all users
router.get('/users', adminAuth, async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.json({
      count: users.length,
      users: users.map(user => ({
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone,
        role: user.role,
        newsletter: user.newsletter,
        createdAt: user.createdAt
      }))
    });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create new admin user
router.post('/users/admin', adminAuth, async (req, res) => {
  try {
    const { firstName, lastName, email, password, phone } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create admin user
    const user = new User({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      phone,
      role: 'admin'
    });

    await user.save();

    res.status(201).json({
      id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phone: user.phone,
      role: user.role,
      createdAt: user.createdAt
    });
  } catch (error) {
    console.error('Create admin user error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update user
router.put('/users/:id', adminAuth, async (req, res) => {
  try {
    const { firstName, lastName, phone, role, newsletter, password } = req.body;

    // Prepare update data
    const updateData = { firstName, lastName, phone, role, newsletter };

    // If password is provided, hash it before saving
    if (password) {
      const salt = await bcrypt.genSalt(10);
      updateData.password = await bcrypt.hash(password, salt);
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phone: user.phone,
      role: user.role,
      newsletter: user.newsletter,
      createdAt: user.createdAt
    });
  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete user
router.delete('/users/:id', adminAuth, async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ message: 'User deleted successfully', id: req.params.id });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// ==================== TEAM MANAGEMENT ====================

// Get all team members
router.get('/team', adminAuth, async (req, res) => {
  try {
    const teamMembers = await TeamMember.find().sort({ order: 1, createdAt: -1 });
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
        isActive: member.isActive,
        createdAt: member.createdAt
      }))
    });
  } catch (error) {
    console.error('Get team members error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create new team member
router.post('/team', adminAuth, async (req, res) => {
  try {
    const { name, position, bio, image, email, phone, department, order } = req.body;

    const teamMember = new TeamMember({
      name,
      position,
      bio,
      image,
      email,
      phone,
      department,
      order: order || 0
    });

    await teamMember.save();

    res.status(201).json({
      id: teamMember._id,
      name: teamMember.name,
      position: teamMember.position,
      bio: teamMember.bio,
      image: teamMember.image,
      email: teamMember.email,
      phone: teamMember.phone,
      department: teamMember.department,
      order: teamMember.order,
      isActive: teamMember.isActive,
      createdAt: teamMember.createdAt
    });
  } catch (error) {
    console.error('Create team member error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update team member
router.put('/team/:id', adminAuth, async (req, res) => {
  try {
    const { name, position, bio, image, email, phone, department, order, isActive } = req.body;

    const teamMember = await TeamMember.findByIdAndUpdate(
      req.params.id,
      { name, position, bio, image, email, phone, department, order, isActive },
      { new: true, runValidators: true }
    );

    if (!teamMember) {
      return res.status(404).json({ message: 'Team member not found' });
    }

    res.json({
      id: teamMember._id,
      name: teamMember.name,
      position: teamMember.position,
      bio: teamMember.bio,
      image: teamMember.image,
      email: teamMember.email,
      phone: teamMember.phone,
      department: teamMember.department,
      order: teamMember.order,
      isActive: teamMember.isActive,
      createdAt: teamMember.createdAt
    });
  } catch (error) {
    console.error('Update team member error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete team member
router.delete('/team/:id', adminAuth, async (req, res) => {
  try {
    const teamMember = await TeamMember.findByIdAndDelete(req.params.id);

    if (!teamMember) {
      return res.status(404).json({ message: 'Team member not found' });
    }

    res.json({ message: 'Team member deleted successfully', id: req.params.id });
  } catch (error) {
    console.error('Delete team member error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// ==================== PRODUCT MANAGEMENT ====================

// Get all products (admin view)
router.get('/products', adminAuth, async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.json({
      count: products.length,
      products
    });
  } catch (error) {
    console.error('Get products error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create product
router.post('/products', adminAuth, async (req, res) => {
  try {
    const product = new Product(req.body);
    await product.save();
    res.status(201).json(product);
  } catch (error) {
    console.error('Create product error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update product
router.put('/products/:id', adminAuth, async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json(product);
  } catch (error) {
    console.error('Update product error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete product
router.delete('/products/:id', adminAuth, async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json({ message: 'Product deleted successfully', id: req.params.id });
  } catch (error) {
    console.error('Delete product error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// ==================== ORDER MANAGEMENT ====================

// Get all orders
router.get('/orders', adminAuth, async (req, res) => {
  try {
    const orders = await Order.find()
      .populate('user', 'firstName lastName email')
      .populate('createdBy', 'firstName lastName email')
      .populate('updatedBy', 'firstName lastName email')
      .sort({ createdAt: -1 });

    res.json({
      count: orders.length,
      orders
    });
  } catch (error) {
    console.error('Get orders error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Search orders by order number
router.get('/orders/search/:orderNumber', adminAuth, async (req, res) => {
  try {
    const { orderNumber } = req.params;

    // Search for orders that contain the provided order number
    const orders = await Order.find({
      orderNumber: { $regex: orderNumber, $options: 'i' } // Case insensitive search
    })
      .populate('user', 'firstName lastName email')
      .populate('createdBy', 'firstName lastName email')
      .populate('updatedBy', 'firstName lastName email')
      .sort({ createdAt: -1 });

    res.json({
      count: orders.length,
      orders
    });
  } catch (error) {
    console.error('Search orders error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update order status
router.put('/orders/:id', adminAuth, async (req, res) => {
  try {
    const { status } = req.body;

    // Get the old order to compare status
    const oldOrder = await Order.findById(req.params.id);

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      {
        status,
        updatedBy: req.user._id  // Track which admin updated the order
      },
      { new: true, runValidators: true }
    ).populate('user', 'firstName lastName email')
      .populate('createdBy', 'firstName lastName email')
      .populate('updatedBy', 'firstName lastName email');

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Create notification for customer if status changed
    if (oldOrder && oldOrder.status !== status) {
      const statusMessages = {
        pending: 'قيد الانتظار',
        processing: 'قيد المعالجة',
        shipped: 'تم الشحن',
        delivered: 'تم التوصيل',
        cancelled: 'ملغي'
      };

      const customerNotification = new Notification({
        user: order.user._id,
        type: 'order_status_changed',
        title: 'Order Status Updated',
        message: `Your order ${order.orderNumber} status has been updated to ${statusMessages[status] || status}.`,
        orderId: order._id,
        orderNumber: order.orderNumber,
        status: status
      });
      await customerNotification.save();
    }

    res.json(order);
  } catch (error) {
    console.error('Update order error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete order
router.delete('/orders/:id', adminAuth, async (req, res) => {
  try {
    const order = await Order.findByIdAndDelete(req.params.id);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.json({ message: 'Order deleted successfully', id: req.params.id });
  } catch (error) {
    console.error('Delete order error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// ==================== STATISTICS ====================

// Get dashboard statistics
router.get('/statistics', adminAuth, async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalProducts = await Product.countDocuments();
    const totalOrders = await Order.countDocuments();

    const orders = await Order.find();
    const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);

    const pendingOrders = await Order.countDocuments({ status: 'pending' });
    const processingOrders = await Order.countDocuments({ status: 'processing' });
    const shippedOrders = await Order.countDocuments({ status: 'shipped' });
    const deliveredOrders = await Order.countDocuments({ status: 'delivered' });

    res.json({
      totalUsers,
      totalProducts,
      totalOrders,
      totalRevenue,
      ordersByStatus: {
        pending: pendingOrders,
        processing: processingOrders,
        shipped: shippedOrders,
        delivered: deliveredOrders
      }
    });
  } catch (error) {
    console.error('Get statistics error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// ==================== MESSAGES ====================
// Get all contact messages
router.get('/messages', adminAuth, async (req, res) => {
  try {
    const messages = await Message.find().sort({ createdAt: -1 });

    res.json({
      count: messages.length,
      messages: messages.map(msg => ({
        id: msg._id,
        name: msg.name,
        email: msg.email,
        phone: msg.phone,
        subject: msg.subject,
        message: msg.message,
        status: msg.status,
        createdAt: msg.createdAt,
      }))
    });
  } catch (error) {
    console.error('Get messages error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
