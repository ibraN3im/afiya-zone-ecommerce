import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import User from './models/User.js';

dotenv.config();

const createAdminUser = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: 'admin@afiyazone.com' });
    
    if (existingAdmin) {
      console.log('Admin user already exists');
      
      // Update role to admin if not already
      if (existingAdmin.role !== 'admin') {
        existingAdmin.role = 'admin';
        await existingAdmin.save();
        console.log('Updated existing user to admin role');
      }
    } else {
      // Create new admin user
      const hashedPassword = await bcrypt.hash('Admin@123', 10);
      
      const admin = new User({
        firstName: 'Admin',
        lastName: 'User',
        email: 'admin@afiyazone.com',
        password: hashedPassword,
        phone: '+1234567890',
        role: 'admin'
      });

      await admin.save();
      console.log('Admin user created successfully');
      console.log('Email: admin@afiyazone.com');
      console.log('Password: Admin@123');
    }

    mongoose.connection.close();
    console.log('Done!');
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

createAdminUser();
