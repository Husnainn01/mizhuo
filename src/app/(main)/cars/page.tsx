import { Suspense } from 'react';
import ClientCarsContent from '@/components/cars/ClientCarsContent';

// export const dynamic = 'force-dynamic';
// export const runtime = 'nodejs';

export default function CarsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <ClientCarsContent />
    </Suspense>
  );
} 