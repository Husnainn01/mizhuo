import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Add debugging
function logMiddleware(message: string, ...args: any[]) {
  console.log(`[Middleware] ${message}`, ...args);
}

// Simple token validation function compatible with Edge Runtime
const validateToken = (token: string): any => {
  try {
    // In Edge Runtime, we can't use jwt.verify
    // Instead, we'll do basic validation and extract the payload
    const parts = token.split('.');
    if (parts.length !== 3) {
      logMiddleware('Invalid token format');
      return null;
    }
    
    // Base64 decode the payload (middle part)
    const payload = JSON.parse(Buffer.from(parts[1], 'base64').toString());
    logMiddleware('Token payload extracted:', payload);
    
    // Check if token is expired
    const now = Math.floor(Date.now() / 1000);
    if (payload.exp && payload.exp < now) {
      logMiddleware('Token expired');
      return null;
    }
    
    return payload;
  } catch (error) {
    logMiddleware('Token validation failed:', error);
    return null;
  }
};

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
  // Get the pathname of the request
  const path = request.nextUrl.pathname;
  logMiddleware(`Processing path: ${path}`);
  
  // Public paths that don't require authentication
  const isPublicPath = path === '/admin/login';
  
  // Check if the path is an admin path
  const isAdminPath = path.startsWith('/admin') && !isPublicPath;
  
  // Debug all cookies
  const allCookies = request.cookies.getAll();
  logMiddleware('All cookies:', allCookies);
  
  // Check if we have a token in cookies
  const token = request.cookies.get('auth_token')?.value;
  logMiddleware(`Auth token present: ${!!token}`);
  
  if (token) {
    logMiddleware(`Token value (first 20 chars): ${token.substring(0, 20)}...`);
  }
  
  // If it's an admin path but no token is present, redirect to login
  if (isAdminPath) {
    if (!token) {
      logMiddleware('No token found for admin path, redirecting to login');
      // Redirect to login
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }
    
    // Validate the token using Edge-compatible approach
    const payload = validateToken(token);
    
    // If token is invalid or not an admin, redirect to login
    if (!payload || payload.role !== 'admin') {
      logMiddleware('Invalid token or not admin, redirecting to login');
      // Redirect to login
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }
    
    logMiddleware('Valid admin token, allowing access to: ' + path);
  }
  
  // If it's the login path and we have a valid token, redirect to dashboard
  if (isPublicPath && token) {
    const payload = validateToken(token);
    
    if (payload && payload.role === 'admin') {
      logMiddleware('Already logged in, redirecting from login to dashboard');
      // Redirect to dashboard
      return NextResponse.redirect(new URL('/admin/dashboard', request.url));
    } else {
      logMiddleware('Token invalid on login page, allowing login page access');
    }
  }
  
  // Continue with the request
  logMiddleware('Continuing with request for: ' + path);
  return NextResponse.next();
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: ['/admin/:path*']
}; 