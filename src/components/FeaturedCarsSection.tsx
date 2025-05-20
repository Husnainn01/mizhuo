'use client';

import { useState, useEffect } from 'react';
import Link from "next/link";
import CarCard from './CarCard';

interface Car {
  _id: string;
  title: string;
  make: string;
  model: string;
  year: number;
  price: number;
  priceCurrency: string;
  image: string;
  mileage?: number;
  mileageUnit?: string;
  vehicleTransmission?: string;
  bodyType?: string;
  offerType: string;
}

export default function FeaturedCarsSection() {
  const [featuredCars, setFeaturedCars] = useState<Car[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFeaturedCars = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/api/cars/featured?limit=12&showAll=true');
        
        if (!response.ok) {
          throw new Error('Failed to fetch featured cars');
        }
        
        const data = await response.json();
        
        if (data.success) {
          setFeaturedCars(data.cars);
        } else {
          throw new Error(data.error || 'Failed to fetch featured cars');
        }
      } catch (err: unknown) {
        console.error('Error fetching featured cars:', err);
        setError(err instanceof Error ? err.message : 'An error occurred while fetching featured cars');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchFeaturedCars();
  }, []);

  return (
    <section className="py-10 bg-white">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold text-black">Featured Vehicles</h2>
          <Link 
            href="/cars" 
            className="text-blue-600 hover:text-blue-800 font-medium flex items-center"
          >
            View All 
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
            </svg>
          </Link>
        </div>
        
        {/* Loading state */}
        {isLoading && (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-700"></div>
          </div>
        )}
        
        {/* Error state */}
        {error && !isLoading && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
            <p>{error}</p>
          </div>
        )}
        
        {/* No cars found */}
        {!isLoading && !error && featuredCars.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No featured vehicles available at the moment.</p>
          </div>
        )}
        
        {/* Featured Cars Grid with real data */}
        {!isLoading && !error && featuredCars.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
            {featuredCars.map((car) => (
              <CarCard key={car._id} car={car} />
            ))}
          </div>
        )}
        
        <div className="text-center mt-8">
          <Link 
            href="/cars" 
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-md font-medium transition-colors text-sm"
          >
            Browse All Vehicles
          </Link>
        </div>
      </div>
    </section>
  );
} 