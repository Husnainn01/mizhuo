'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import CarCard from './CarCard';

// Define Car interface based on the schema
interface Car {
  _id: string;
  title: string;
  make: string;
  model: string;
  year: number;
  price: number;
  mileage: string;
  fuelType: string;
  vehicleTransmission: string;
  carFeature: string[];
  bodyType: string;
  itemCondition: string;
  images: string[];
  image: string;
  [key: string]: string | number | string[] | boolean; // More specific index signature
}

// Define Pagination interface
interface Pagination {
  total: number;
  page: number;
  limit: number;
  pages: number;
}

const CarGrid = () => {
  const [cars, setCars] = useState<Car[]>([]);
  const [pagination, setPagination] = useState<Pagination>({
    total: 0,
    page: 1,
    limit: 12,
    pages: 0
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  
  const searchParams = useSearchParams();
  const router = useRouter();
  
  // Get current page from URL or default to 1
  const currentPage = searchParams.get('page') ? parseInt(searchParams.get('page') as string) : 1;
  const currentSort = searchParams.get('sort') || 'newest';
  
  // Build query string from search params
  const getQueryString = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', page.toString());
    return params.toString();
  };
  
  // Navigate to page
  const goToPage = (page: number) => {
    router.push(`/cars?${getQueryString(page)}`);
  };
  
  // Fetch cars data
  useEffect(() => {
    const fetchCars = async () => {
      setIsLoading(true);
      try {
        // Build the API URL with all the current search parameters
        const apiUrl = `/api/cars?${searchParams.toString()}`;
        
        const response = await fetch(apiUrl);
        
        if (!response.ok) {
          throw new Error('Failed to fetch cars');
        }
        
        const data = await response.json();
        
        if (!data.success) {
          throw new Error(data.error || 'Failed to fetch cars');
        }
        
        setCars(data.cars);
        setPagination(data.pagination);
      } catch (err: unknown) {
        const error = err as Error;
        setError(error.message);
        console.error('Error fetching cars:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchCars();
  }, [searchParams]);
  
  // Handle sort change
  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newParams = new URLSearchParams(searchParams.toString());
    newParams.set('sort', e.target.value);
    newParams.set('page', '1'); // Reset to page 1 when sorting changes
    router.push(`/cars?${newParams.toString()}`);
  };
  
  // Generate pagination pages
  const renderPaginationItems = () => {
    const pages = [];
    const maxPagesToShow = 5;
    
    let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
    let endPage = startPage + maxPagesToShow - 1;
    
    if (endPage > pagination.pages) {
      endPage = pagination.pages;
      startPage = Math.max(1, endPage - maxPagesToShow + 1);
    }
    
    // Previous button
    pages.push(
      <button 
        key="prev" 
        onClick={() => goToPage(Math.max(1, currentPage - 1))}
        disabled={currentPage === 1}
        className="px-3 py-1 rounded border border-black/10 text-black/70 hover:bg-blue-50 disabled:opacity-50 disabled:hover:bg-transparent"
      >
        &laquo;
      </button>
    );
    
    // Page numbers
    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => goToPage(i)}
          className={`px-3 py-1 rounded border ${
            i === currentPage
              ? 'border-red-600 bg-red-600 text-white'
              : 'border-black/10 text-black/70 hover:bg-blue-50'
          }`}
        >
          {i}
        </button>
      );
    }
    
    // Next button
    pages.push(
      <button 
        key="next" 
        onClick={() => goToPage(Math.min(pagination.pages, currentPage + 1))}
        disabled={currentPage === pagination.pages || pagination.pages === 0}
        className="px-3 py-1 rounded border border-black/10 text-black/70 hover:bg-blue-50 disabled:opacity-50 disabled:hover:bg-transparent"
      >
        &raquo;
      </button>
    );
    
    return pages;
  };
  
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, index) => (
          <div key={index} className="border border-gray-200 rounded-lg p-4 h-72 animate-pulse">
            <div className="w-full h-40 bg-gray-200 rounded-md mb-4"></div>
            <div className="h-5 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
          </div>
        ))}
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-md text-red-600">
        <p>Error loading cars: {error}</p>
        <p className="mt-2">Please try again later.</p>
      </div>
    );
  }
  
  if (cars.length === 0) {
    return (
      <div className="p-6 bg-blue-50 border border-blue-200 rounded-md text-blue-700 text-center">
        <p className="text-lg font-medium">No cars match your search criteria.</p>
        <p className="mt-2">Try adjusting your filters or search for something else.</p>
      </div>
    );
  }
  
  return (
    <div>
      {/* Car Results Count & Sort */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <p className="text-black/70">
            <span className="font-bold">{pagination.total}</span> vehicles found
          </p>
        </div>
        <div className="flex items-center gap-2">
          <label htmlFor="sort" className="text-sm text-black/70">Sort by:</label>
          <select 
            id="sort" 
            value={currentSort}
            onChange={handleSortChange}
            className="border border-black/10 rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
          </select>
        </div>
      </div>
      
      {/* Car Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {cars.map((car, index) => (
          <CarCard 
            key={car._id} 
            index={index}
            car={{
              id: car._id,
              make: car.make || '',
              model: car.model || '',
              year: car.year || 0,
              price: car.price || 0,
              mileage: car.mileage || '0',
              fuelType: car.fuelType || '',
              transmission: car.vehicleTransmission || '',
              image: car.image || car.images?.[0] || '/images/car-placeholder.svg',
              features: car.carFeature || [],
              bodyType: car.bodyType || '',
              condition: car.itemCondition || 'Used'
            }} 
          />
        ))}
      </div>
      
      {/* Pagination */}
      {pagination.pages > 1 && (
        <div className="mt-8 flex justify-center">
          <nav className="flex items-center space-x-1">
            {renderPaginationItems()}
          </nav>
        </div>
      )}
    </div>
  );
};

export default CarGrid; 