import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import User from '../src/models/User.js';

dotenv.config();

const createAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB connected');

    // 1. Get credentials from environment variables
    const adminEmail = process.env.ADMIN_EMAIL;
    const adminPassword = process.env.ADMIN_PASSWORD;

    // Optional: Add a check to ensure variables are loaded
    if (!adminEmail || !adminPassword) {
      console.error('Error: ADMIN_EMAIL or ADMIN_PASSWORD is not defined in .env');
      process.exit(1);
    }

    // 2. Check for existence using the env variable
    const adminExists = await User.findOne({ email: adminEmail });
    
    if (adminExists) {
      console.log(`Admin with email ${adminEmail} already exists!`);
      process.exit(0);
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(adminPassword, salt);

    const admin = new User({
      username: 'admin',
      email: adminEmail,
      password: hashedPassword,
      role: 'admin',
      bio: 'Platform Administrator'
    });

    await admin.save();
    console.log('--- Admin Account Created ---');
    console.log(`Email: ${adminEmail}`);
    console.log(`Password: ${adminPassword}`);
    console.log('⚠️  PLEASE CHANGE THIS PASSWORD AFTER FIRST LOGIN!');
    
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

createAdmin();