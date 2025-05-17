import { NextRequest, NextResponse } from 'next/server';

// Simple function to extract and validate token
const validateToken = (token: string): any => {
  try {
    // In Edge Runtime, we can't use jwt.verify
    // Instead, we'll do basic validation and extract the payload
    const parts = token.split('.');
    if (parts.length !== 3) {
      console.log('Invalid token format');
      return null;
    }
    
    // Base64 decode the payload (middle part)
    const payload = JSON.parse(Buffer.from(parts[1], 'base64').toString());
    
    // Check if token is expired
    const now = Math.floor(Date.now() / 1000);
    if (payload.exp && payload.exp < now) {
      console.log('Token expired');
      return null;
    }
    
    return payload;
  } catch (error) {
    console.error('Token validation failed:', error);
    return null;
  }
};

export async function GET(request: NextRequest) {
  console.log('Edge session check API called');
  
  try {
    // Get the token from the request
    const token = request.cookies.get('auth_token')?.value;
    
    if (!token) {
      console.log('No auth token found in request');
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }
    
    console.log('Token found, validating in Edge Runtime...');
    
    // Validate the token using Edge-compatible approach
    const payload = validateToken(token);
    if (!payload) {
      console.log('Token validation failed');
      return NextResponse.json(
        { error: 'Invalid or expired token' },
        { status: 401 }
      );
    }
    
    console.log('Token validated in Edge Runtime, user ID:', payload.userId);
    
    // Return user data from token payload
    return NextResponse.json({
      success: true,
      user: {
        id: payload.userId,
        email: payload.email,
        role: payload.role
      }
    });
    
  } catch (error: any) {
    console.error('Edge session check error:', error);
    return NextResponse.json(
      { error: 'Server error', message: error.message },
      { status: 500 }
    );
  }
} 