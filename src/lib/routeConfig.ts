// Add these exports to force dynamic rendering for all API routes
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

// Disable static generation for all API routes that use cookies or session
export const fetchCache = 'force-no-store';
export const revalidate = 0; 