import { Suspense } from 'react';
import ClientCarsContent from '@/components/cars/ClientCarsContent';

export default function CarsPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ClientCarsContent />
    </Suspense>
  );
} 