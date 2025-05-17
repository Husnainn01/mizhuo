import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || '07f9a791f63910f006f45c1c4570fed662f0b6e5ff888100bb678c0d3a08541b';
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
 * Set JWT token in HTTP-only cookie for API routes
 */
export const setAuthCookie = (token: string): NextResponse => {
  const response = NextResponse.json({ success: true });
  
  response.cookies.set({
    name: 'auth_token',
    value: token,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: '/',
  });
  
  return response;
};

/**
 * Clear the auth cookie for API routes
 */
export const clearAuthCookie = (): NextResponse => {
  const response = NextResponse.json({ success: true, message: 'Logged out successfully' });
  response.cookies.delete('auth_token');
  return response;
};

/**
 * Verify JWT token
 * Safe to use in Edge runtime
 */
export const verifyToken = (token: string): TokenPayload | null => {
  try {
    return jwt.verify(token, JWT_SECRET) as TokenPayload;
  } catch (error) {
    return null;
  }
};

/**
 * Get token from request
 */
export const getTokenFromRequest = (request: NextRequest): string | undefined => {
  return request.cookies.get('auth_token')?.value;
};

/**
 * Authentication middleware for API routes
 */
export const authMiddleware = async (request: NextRequest) => {
  const token = getTokenFromRequest(request);
  
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
  const token = getTokenFromRequest(request);
  
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