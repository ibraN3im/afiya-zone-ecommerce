import express from 'express';
import jwt from 'jsonwebtoken';
import Order from '../models/Order.js';
import User from '../models/User.js';
import Notification from '../models/Notification.js';


const router = express.Router();

// Middleware to verify token
const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({ message: 'No token, authorization denied' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Token is not valid' });
  }
};

// Create new order
router.post('/', auth, async (req, res) => {
  try {
    const { items, shippingAddress, paymentMethod, subtotal, shipping, tax, total, notes } = req.body;

    // Generate order number
    const orderNumber = `AFZ-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

    const order = new Order({
      user: req.userId,
      orderNumber,
      items,
      shippingAddress,
      paymentMethod,
      subtotal,
      shipping,
      tax,
      total,
      notes,
      createdBy: req.userId  // Set the user who created the order
    });

    await order.save();

    // Add order to user's orders
    await User.findByIdAndUpdate(req.userId, {
      $push: { orders: order._id }
    });

    // Create notification for customer
    const customerNotification = new Notification({
      user: req.userId,
      type: 'order_created',
      title: 'Order Created',
      message: `Your order ${order.orderNumber} has been created successfully.`,
      orderId: order._id,
      orderNumber: order.orderNumber,
      status: order.status
    });
    await customerNotification.save();

    // Create notifications for all admins about new order
    const admins = await User.find({ role: 'admin' }).select('_id');
    const adminNotifications = admins.map(admin => ({
      user: admin._id,
      type: 'new_order_admin',
      title: 'New Order',
      message: `New order ${order.orderNumber} has been placed.`,
      orderId: order._id,
      orderNumber: order.orderNumber,
      status: order.status
    }));
    if (adminNotifications.length > 0) {
      await Notification.insertMany(adminNotifications);
    }

    res.status(201).json({
      success: true,
      message: 'Order created successfully',
      orderNumber: order.orderNumber,
      orderId: order._id,
      order: order
    });
  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error creating order',
      error: process.env.NODE_ENV === 'development' ? error.toString() : undefined
    });
  }
});

// Get user's orders
router.get('/my-orders', auth, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.userId })
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (error) {
    console.error('Get orders error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get single order by ID
router.get('/:id', auth, async (req, res) => {
  try {
    const order = await Order.findOne({
      _id: req.params.id,
      user: req.userId
    });

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.json(order);
  } catch (error) {
    console.error('Get order error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;