import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import { generateToken, setAuthCookie } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    // Connect to the database
    await connectDB();
    
    // Parse request body
    const body = await request.json();
    const { email, password } = body;
    
    // Validate input
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }
    
    // For demo purposes, allow login with demo credentials
    if (email === 'admin@example.com' && password === 'password') {
      // Generate JWT token
      const token = generateToken('demo-admin-id', email, 'admin');

      // Set the token in HTTP-only cookie
      const response = setAuthCookie(token);

      // Add user data to the response
      return NextResponse.json({
        success: true,
        user: {
          id: 'demo-admin-id',
          name: 'Admin User',
          email: email,
          role: 'admin'
        }
      }, { headers: response.headers });
    }
    
    // Find the user
    const user = await User.findOne({ email });
    
    // Check if user exists
    if (!user) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }
    
    // Check if user is an admin
    if (user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Not authorized as admin' },
        { status: 403 }
      );
    }
    
    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    
    if (!isPasswordValid) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }
    
    // Generate JWT token
    const token = generateToken(
      user._id.toString(),
      user.email,
      user.role
    );
    
    // Set HTTP-only cookie with the token
    const response = setAuthCookie(token);
    
    // Return success response
    return NextResponse.json(
      {
        success: true,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role
        }
      },
      { headers: response.headers }
    );
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Authentication failed' },
      { status: 500 }
    );
  }
} 