import { NextRequest } from 'next/server';
import { clearAuthCookie } from '@/lib/auth';

export async function POST(request: NextRequest) {
  return clearAuthCookie();
} 