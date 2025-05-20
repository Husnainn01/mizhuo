import { Suspense } from 'react';
import ClientCarsContent from '@/components/cars/ClientCarsContent';

export default function CarsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <ClientCarsContent />
    </Suspense>
  );
} 