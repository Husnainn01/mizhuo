import { Suspense } from 'react';
import HomeContent from '@/components/home/HomeContent';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

// Server component that imports client components
export default function Home() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <HomeContent />
    </Suspense>
  );
}
