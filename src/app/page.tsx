import { redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

// Simple redirect to the (main) route
export default function RootPage() {
  redirect('/');
}
