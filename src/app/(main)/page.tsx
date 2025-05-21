import { Suspense } from 'react';
import HomeContent from '@/components/home/HomeContent';

// Server component that imports client components
export default function Home() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <HomeContent />
    </Suspense>
  );
}
