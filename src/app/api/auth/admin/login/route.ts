import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import { generateToken } from '@/lib/auth';

// Schema for admin login validation
const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export async function POST(request: NextRequest) {
  console.log('Admin login attempt received');
  
  try {
    // Connect to the database
    await connectDB();
    console.log('Connected to database');
    
    // Parse and validate the request body
    const body = await request.json();
    console.log('Request body parsed', { email: body.email });
    
    const validation = loginSchema.safeParse(body);
    if (!validation.success) {
      console.log('Validation failed', validation.error.format());
      return NextResponse.json(
        { error: 'Validation failed', details: validation.error.format() },
        { status: 400 }
      );
    }
    
    const { email, password } = validation.data;
    
    // Find the user by email
    const user = await User.findOne({ email });
    
    // Check if user exists and is an admin
    if (!user) {
      console.log('User not found:', email);
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }
    
    if (user.role !== 'admin') {
      console.log('Non-admin user attempted login:', email);
      return NextResponse.json(
        { error: 'Admin access required' },
        { status: 403 }
      );
    }
    
    // Verify password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      console.log('Invalid password for user:', email);
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }
    
    console.log('Authentication successful for user:', email);
    
    // Generate JWT token
    const token = generateToken(user._id.toString(), user.email, user.role);
    
    // Create response object
    const response = NextResponse.json({
      success: true,
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
      }
    });
    
    // Set cookie manually
    response.cookies.set({
      name: 'auth_token',
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/',
      sameSite: 'lax',
    });
    
    console.log('Authentication cookie set, returning response');
    return response;
    
  } catch (error: any) {
    console.error('Admin login error:', error);
    return NextResponse.json(
      { error: 'Server error', message: error.message },
      { status: 500 }
    );
  }
} 