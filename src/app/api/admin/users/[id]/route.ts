import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import connectDB from '@/lib/mongodb';
import User from '@/lib/server/models/User';
import { USER_ROLES, PERMISSIONS } from '@/models/UserConstants';
import { adminMiddleware, permissionMiddleware } from '@/lib/auth';

// Schema for user update validation
const userUpdateSchema = z.object({
  firstName: z.string().min(2, 'First name must be at least 2 characters').optional(),
  lastName: z.string().min(2, 'Last name must be at least 2 characters').optional(),
  email: z.string().email('Invalid email address').optional(),
  password: z.string().min(8, 'Password must be at least 8 characters').optional(),
  role: z.enum(USER_ROLES as [string, ...string[]]).optional(),
  permissions: z.array(z.string()).optional()
});

// GET: Fetch a specific user by ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check if user is authenticated and has admin role
    const authError = await adminMiddleware(request);
    if (authError) {
      return authError;
    }

    // Get user ID from the URL parameter
    const userId = params.id;
    
    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    // Connect to database
    await connectDB();
    
    // Find the user (exclude password)
    const user = await User.findById(userId).select('-password');
    
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      user
    });
  } catch (error: any) {
    console.error('Error fetching user:', error);
    return NextResponse.json(
      { error: 'Server error', message: error.message },
      { status: 500 }
    );
  }
}

// PUT: Update a user
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check if user is authenticated and has admin role
    const authError = await adminMiddleware(request);
    if (authError) {
      return authError;
    }

    // Get user ID from the URL parameter
    const userId = params.id;
    
    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    // Connect to database
    await connectDB();
    
    // Parse request body
    const data = await request.json();
    
    // Validate data
    const validation = userUpdateSchema.safeParse(data);
    if (!validation.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: validation.error.format() },
        { status: 400 }
      );
    }
    
    // Find the user
    const user = await User.findById(userId);
    
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }
    
    // Check if email is already taken by another user
    if (data.email && data.email !== user.email) {
      const existingUser = await User.findOne({ 
        email: data.email,
        _id: { $ne: userId }
      });
      
      if (existingUser) {
        return NextResponse.json(
          { error: 'Email is already in use by another account' },
          { status: 400 }
        );
      }
    }
    
    // Update allowed fields
    const allowedUpdates = ['firstName', 'lastName', 'email', 'password', 'role', 'permissions'];
    allowedUpdates.forEach(field => {
      if (data[field] !== undefined) {
        user[field] = data[field];
      }
    });
    
    await user.save();
    
    return NextResponse.json({
      success: true,
      message: 'User updated successfully',
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
        permissions: user.permissions
      }
    });
  } catch (error: any) {
    console.error('Error updating user:', error);
    return NextResponse.json(
      { error: 'Server error', message: error.message },
      { status: 500 }
    );
  }
}

// DELETE: Delete a user
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check if user is authenticated and has admin role
    const authError = await adminMiddleware(request);
    if (authError) {
      return authError;
    }

    // Get user ID from the URL parameter
    const userId = params.id;
    
    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    // Connect to database
    await connectDB();
    
    // Find and delete the user
    const user = await User.findByIdAndDelete(userId);
    
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      message: 'User deleted successfully'
    });
  } catch (error: any) {
    console.error('Error deleting user:', error);
    return NextResponse.json(
      { error: 'Server error', message: error.message },
      { status: 500 }
    );
  }
} 