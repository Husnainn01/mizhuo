import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import connectDB from '@/lib/mongodb';
import User from '@/lib/server/models/User';
import { USER_ROLES, PERMISSIONS } from '@/models/UserConstants';
import { adminMiddleware, permissionMiddleware } from '@/lib/auth';

// Schema for user creation validation
const userCreateSchema = z.object({
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  role: z.enum(USER_ROLES as [string, ...string[]]),
  permissions: z.array(z.string()).optional()
});

// Schema for user update validation
const userUpdateSchema = z.object({
  firstName: z.string().min(2, 'First name must be at least 2 characters').optional(),
  lastName: z.string().min(2, 'Last name must be at least 2 characters').optional(),
  email: z.string().email('Invalid email address').optional(),
  password: z.string().min(8, 'Password must be at least 8 characters').optional(),
  role: z.enum(USER_ROLES as [string, ...string[]]).optional(),
  permissions: z.array(z.string()).optional()
});

// GET: Fetch all users (admin only)
export async function GET(request: NextRequest) {
  try {
    // Check if user is authenticated and has admin role
    const authError = await adminMiddleware(request);
    if (authError) {
      return authError;
    }

    // Connect to database
    await connectDB();
    
    // Get query parameters
    const searchParams = request.nextUrl.searchParams;
    const role = searchParams.get('role');
    
    // Build query
    const query: any = {};
    if (role) {
      query.role = role;
    }
    
    // Fetch users (exclude password field)
    const users = await User.find(query).select('-password').sort({ createdAt: -1 });
    
    return NextResponse.json({
      success: true,
      users
    });
  } catch (error: any) {
    console.error('Error fetching users:', error);
    return NextResponse.json(
      { error: 'Server error', message: error.message },
      { status: 500 }
    );
  }
}

// POST: Create a new user (admin only)
export async function POST(request: NextRequest) {
  try {
    // Check if user is authenticated and has admin role
    const authError = await adminMiddleware(request);
    if (authError) {
      return authError;
    }

    // Connect to database
    await connectDB();
    
    // Parse request body
    const data = await request.json();
    
    // Validate data
    const validation = userCreateSchema.safeParse(data);
    if (!validation.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: validation.error.format() },
        { status: 400 }
      );
    }
    
    const { firstName, lastName, email, password, role, permissions } = validation.data;
    
    // Check if user with this email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 409 }
      );
    }
    
    // Create the user
    const user = new User({
      firstName,
      lastName,
      email,
      password,
      role,
      permissions: permissions || [] // Will be populated with default role permissions by pre-save hook
    });
    
    await user.save();
    
    // Return success response (don't include password)
    return NextResponse.json({
      success: true,
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
        permissions: user.permissions
      }
    }, { status: 201 });
  } catch (error: any) {
    console.error('Error creating user:', error);
    return NextResponse.json(
      { error: 'Server error', message: error.message },
      { status: 500 }
    );
  }
} 