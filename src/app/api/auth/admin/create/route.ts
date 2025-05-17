import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';

// Schema for admin user creation
const adminCreateSchema = z.object({
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  // Optional secret key for additional security
  secretKey: z.string().optional(),
});

export async function POST(request: NextRequest) {
  try {
    // Connect to the database
    await connectDB();
    
    // Parse and validate the request body
    const body = await request.json();
    
    const validation = adminCreateSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: validation.error.format() },
        { status: 400 }
      );
    }
    
    const { firstName, lastName, email, password, secretKey } = validation.data;
    
    // Verify secret key if required (you can implement this for production)
    const requiredSecretKey = process.env.ADMIN_SECRET_KEY || 'autoelite_admin_secret';
    if (requiredSecretKey && secretKey !== requiredSecretKey) {
      return NextResponse.json(
        { error: 'Invalid secret key' },
        { status: 403 }
      );
    }
    
    // Check if user with this email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 409 }
      );
    }
    
    // Create the admin user
    const adminUser = new User({
      firstName,
      lastName,
      email,
      password, // Will be hashed automatically by the pre-save hook
      role: 'admin'
    });
    
    await adminUser.save();
    
    // Return success response (don't include password)
    return NextResponse.json({
      success: true,
      user: {
        id: adminUser._id,
        firstName: adminUser.firstName,
        lastName: adminUser.lastName,
        email: adminUser.email,
        role: adminUser.role
      }
    });
    
  } catch (error: any) {
    console.error('Admin creation error:', error);
    return NextResponse.json(
      { error: 'Server error', message: error.message },
      { status: 500 }
    );
  }
} 