import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import User from '@/models/User';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const JWT_EXPIRY = '7d'; // token valid for 7 days

// Interface for token payload
interface TokenPayload {
  userId: string;
  email: string;
  role: string;
}

/**
 * Generate a JWT token for a user
 */
export const generateToken = (userId: string, email: string, role: string): string => {
  return jwt.sign(
    { userId, email, role },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRY }
  );
};

/**
 * Set JWT token in HTTP-only cookie
 */
export const setAuthCookie = (token: string): void => {
  const cookieStore = cookies();
  cookieStore.set({
    name: 'auth_token',
    value: token,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: '/',
  });
};

/**
 * Clear the auth cookie
 */
export const clearAuthCookie = (): void => {
  const cookieStore = cookies();
  cookieStore.delete('auth_token');
};

/**
 * Verify JWT token from cookie
 */
export const verifyToken = (token: string): TokenPayload | null => {
  try {
    return jwt.verify(token, JWT_SECRET) as TokenPayload;
  } catch (error) {
    return null;
  }
};

/**
 * Get current user from token
 */
export const getCurrentUser = async (): Promise<any | null> => {
  const cookieStore = cookies();
  const token = cookieStore.get('auth_token')?.value;
  
  if (!token) return null;
  
  const decoded = verifyToken(token);
  if (!decoded) return null;
  
  try {
    const user = await User.findById(decoded.userId).select('-password');
    return user;
  } catch (error) {
    return null;
  }
};

/**
 * Authentication middleware for API routes
 */
export const authMiddleware = async (request: NextRequest) => {
  const token = request.cookies.get('auth_token')?.value;
  
  if (!token) {
    return NextResponse.json(
      { error: 'Authentication required' },
      { status: 401 }
    );
  }
  
  const decoded = verifyToken(token);
  if (!decoded) {
    return NextResponse.json(
      { error: 'Invalid or expired token' },
      { status: 401 }
    );
  }
  
  return null; // No error, proceed
};

/**
 * Admin role middleware for API routes
 */
export const adminMiddleware = async (request: NextRequest) => {
  const token = request.cookies.get('auth_token')?.value;
  
  if (!token) {
    return NextResponse.json(
      { error: 'Authentication required' },
      { status: 401 }
    );
  }
  
  const decoded = verifyToken(token);
  if (!decoded) {
    return NextResponse.json(
      { error: 'Invalid or expired token' },
      { status: 401 }
    );
  }
  
  if (decoded.role !== 'admin') {
    return NextResponse.json(
      { error: 'Admin access required' },
      { status: 403 }
    );
  }
  
  return null; // No error, proceed
}; 