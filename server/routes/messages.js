import express from 'express';
import Message from '../models/Message.js';

const router = express.Router();

// Public: create new message
router.post('/', async (req, res) => {
  try {
    const { name, email, phone, subject, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ message: 'Name, email and message are required' });
    }

    const newMessage = await Message.create({
      name,
      email,
      phone,
      subject,
      message,
    });

    res.status(201).json({ success: true, message: 'Message received', data: newMessage });
  } catch (error) {
    console.error('Create message error:', error);
    res.status(500).json({ message: 'Server error creating message' });
  }
});

export default router;



