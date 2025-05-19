'use client';

import Link from 'next/link';
import Image from 'next/image';

interface CarCardProps {
  car: {
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
    stockNumber?: string;
    isFeatured?: boolean;
    section?: string;
  };
  isFeatured?: boolean;
}

const CarCard: React.FC<CarCardProps> = ({ car, isFeatured = false }) => {
  // Format price with currency
  const formatPrice = (price: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency || 'USD',
      minimumFractionDigits: 0
    }).format(price);
  };

  // Get car details for the subtitle
  const getCarSubtitle = () => {
    const details = [];
    
    if (car.year) details.push(car.year.toString());
    if (car.bodyType) details.push(car.bodyType);
    if (car.vehicleTransmission) details.push(car.vehicleTransmission);
    
    return details.join(' • ');
  };
  
  // Image fallback
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    e.currentTarget.src = '/images/car-placeholder.svg'; // Using SVG fallback
  };

  // Get badge color based on offer type
  const getStatusBadgeColor = () => {
    switch (car.offerType) {
      case 'In Stock':
        return 'bg-green-600';
      case 'Sold':
        return 'bg-red-600';
      default:
        return 'bg-blue-600';
    }
  };

  return (
    <div className="bg-white rounded-md shadow-sm overflow-hidden hover:shadow-md transition-shadow border border-black/10">
      <div className="relative h-40">
        {/* Vehicle Image */}
        {car.image ? (
          // Next Image component for optimized loading
          <div className="relative h-full w-full">
            <Image
              src={car.image}
              alt={car.title}
              fill
              sizes="(max-width: 768px) 50vw, 33vw"
              className="object-cover"
              onError={handleImageError}
            />
          </div>
        ) : (
          <div className="bg-black/5 h-full w-full flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        )}
        
        {/* Status badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {/* Availability Status badge */}
          <span className={`${getStatusBadgeColor()} text-white text-xs font-bold px-2 py-1 rounded`}>
            {car.offerType}
          </span>
          
          {/* Featured badge */}
          {car.isFeatured && (
            <span className="bg-yellow-500 text-white text-xs font-bold px-2 py-1 rounded">
              Featured
            </span>
          )}
          
          {/* Popular badge */}
          {car.section === 'popular' && (
            <span className="bg-purple-600 text-white text-xs font-bold px-2 py-1 rounded">
              Popular
            </span>
          )}
        </div>
        
        {/* "Sold" overlay - keep this for better visual indication */}
        {car.offerType === 'Sold' && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <span className="bg-red-600 text-white px-4 py-2 font-bold rounded transform rotate-12">
              SOLD
            </span>
          </div>
        )}
      </div>
      
      <div className="p-3">
        <h3 className="text-sm font-bold truncate text-black">{car.title}</h3>
        <p className="text-black/70 text-xs mb-1">{getCarSubtitle()}</p>
        
        {/* Add stock number display */}
        {car.stockNumber && (
          <p className="text-gray-500 text-xs mb-1">Stock #: {car.stockNumber}</p>
        )}
        
        <div className="flex justify-between items-center">
          <span className="text-red-600 font-bold">{formatPrice(car.price, car.priceCurrency)}</span>
          <Link href={`/cars/${car._id}`} className="text-xs text-blue-600 hover:underline">
            Details
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CarCard; 