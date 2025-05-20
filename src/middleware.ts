import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Add debugging
function logMiddleware(message: string, ...args: unknown[]): void {
  console.log(`[Middleware] ${message}`, ...args);
}

// Simple token validation function compatible with Edge Runtime
const validateToken = (token: string): TokenPayload | null => {
  try {
    // In Edge Runtime, we can't use jwt.verify
    // Instead, we'll do basic validation and extract the payload
    const parts = token.split('.');
    if (parts.length !== 3) {
      logMiddleware('Invalid token format');
      return null;
    }
    
    // Base64 decode the payload (middle part)
    const payload = JSON.parse(Buffer.from(parts[1], 'base64').toString()) as TokenPayload;
    logMiddleware('Token payload extracted:', payload);
    
    // Check if token is expired
    const now = Math.floor(Date.now() / 1000);
    if (payload.exp && payload.exp < now) {
      logMiddleware('Token expired');
      return null;
    }
    
    return payload;
  } catch {
    logMiddleware('Token validation failed');
    return null;
  }
};

interface TokenPayload {
  exp?: number;
  role?: string;
  permissions?: string[];
}

// Get access level based on role and permissions
const getAccessLevel = (role: string, permissions: string[] = []): 'admin' | 'editor' | 'viewer' | 'none' => {
  if (role === 'admin') return 'admin';
  if (role === 'editor') return 'editor';
  if (role === 'viewer') return 'viewer';
  
  // Check permissions for custom roles
  if (permissions.includes('create:car') || permissions.includes('update:car')) {
    return 'editor';
  }
  
  if (permissions.includes('read:car')) {
    return 'viewer';
  }
  
  return 'none';
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
    
    // If token is invalid, redirect to login
    if (!payload) {
      logMiddleware('Invalid token, redirecting to login');
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }
    
    // Check role and permissions
    const role = payload.role || 'user';
    const permissions = payload.permissions || [];
    const accessLevel = getAccessLevel(role, permissions);
    logMiddleware(`User access level: ${accessLevel}`);
    
    // Restricted paths that require specific access levels
    const adminOnlyPaths = ['/admin/users'];
    const editorPaths = ['/admin/cars/add', '/admin/cars/edit', '/admin/attributes/*/add', '/admin/attributes/*/edit'];
    
    // Check for admin-only paths
    if (adminOnlyPaths.some(p => path.startsWith(p)) && accessLevel !== 'admin') {
      logMiddleware('Access denied for admin-only path');
      return NextResponse.redirect(new URL('/admin/dashboard', request.url));
    }
    
    // Check for editor paths
    if (editorPaths.some(p => {
      // Handle wildcard paths
      if (p.includes('*')) {
        const regex = new RegExp(p.replace('*', '.*'));
        return regex.test(path);
      }
      return path.startsWith(p);
    }) && accessLevel !== 'admin' && accessLevel !== 'editor') {
      logMiddleware('Access denied for editor path');
      return NextResponse.redirect(new URL('/admin/dashboard', request.url));
    }
    
    logMiddleware('Access granted for path: ' + path);
  }
  
  // If it's the login path and we have a valid token, redirect to dashboard
  if (isPublicPath && token) {
    const payload = validateToken(token);
    
    if (payload) {
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