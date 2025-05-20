import mongoose from 'mongoose';
import User from '@/models/User';
import connectDB from '@/lib/mongodb';

// Admin user details
const adminUser = {
  firstName: 'Admin',
  lastName: 'User',
  email: 'admin@autoelite.com',
  password: 'adminPassword123', // This will be hashed by the pre-save hook
  role: 'admin'
};

const createAdminUser = async () => {
  try {
    // Connect to MongoDB
    await connectDB();
    console.log('Connected to MongoDB');
    
    // Check if admin user already exists
    const existingAdmin = await User.findOne({ email: adminUser.email });
    
    if (existingAdmin) {
      console.log('Admin user already exists.');
      return;
    }
    
    // Create new admin user
    const newAdmin = new User(adminUser);
    await newAdmin.save();
    
    console.log('Admin user created successfully!');
    console.log('Email:', adminUser.email);
    console.log('Password:', adminUser.password);
    console.log('(Please change this password after first login)');
    
  } catch (error) {
    console.error('Error creating admin user:', error);
  } finally {
    // Close the MongoDB connection
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
};

// Run the function
createAdminUser(); 