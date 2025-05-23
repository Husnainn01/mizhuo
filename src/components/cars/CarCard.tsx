'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { motion } from 'framer-motion';

interface Car {
  id: number | string;
  make: string;
  model: string;
  year: number;
  price: number;
  mileage: number | string;
  fuelType: string;
  transmission: string;
  image: string;
  features: string[];
  bodyType: string;
  condition: string;
}

interface CarCardProps {
  car: Car;
  index?: number;
}

const CarCard = ({ car, index = 0 }: CarCardProps) => {
  const [isFavorite, setIsFavorite] = useState(false);
  
  const toggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsFavorite(!isFavorite);
  };
  
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(price);
  };
  
  const formatMileage = (mileage: number | string) => {
    if (typeof mileage === 'string') {
      // If it's already a string, just check if it's a valid number
      if (!isNaN(parseFloat(mileage))) {
        return new Intl.NumberFormat('en-US', {
          maximumFractionDigits: 0
        }).format(parseFloat(mileage));
      }
      return mileage; // Return as is if it's not a valid number
    }
    
    return new Intl.NumberFormat('en-US', {
      maximumFractionDigits: 0
    }).format(mileage);
  };
  
  // Placeholder image is used when the actual image isn't available
  const placeholderImage = '/cars/placeholder.jpg';

  // Animation variants
  const cardVariants = {
    hidden: { 
      opacity: 0,
      y: 20
    },
    visible: { 
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4,
        delay: index * 0.05 // Stagger based on index
      }
    },
    hover: {
      y: -5,
      boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
      transition: {
        duration: 0.2
      }
    }
  };

  return (
    <motion.div 
      className="bg-white rounded-md overflow-hidden border border-black/10"
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      whileHover="hover"
    >
      <Link href={`/cars/${car.id}`}>
        <div className="relative">
          {/* Car Image */}
          <div className="relative h-48 w-full">
            <Image
              src={car.image || placeholderImage}
              alt={`${car.year} ${car.make} ${car.model}`}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </div>
          
          {/* Favorite Button */}
          <motion.button 
            onClick={toggleFavorite}
            className="absolute top-2 right-2 bg-white p-1.5 rounded-full shadow"
            aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className={`h-5 w-5 ${isFavorite ? 'text-red-600' : 'text-black/40'}`} 
              fill={isFavorite ? 'currentColor' : 'none'} 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" 
              />
            </svg>
          </motion.button>
          
          {/* Condition Tag */}
          <div className="absolute top-2 left-2">
            <span className={`text-xs font-bold px-2 py-1 rounded ${car.condition === 'New' ? 'bg-blue-600 text-white' : 'bg-red-600 text-white'}`}>
              {car.condition}
            </span>
          </div>
        </div>
        
        {/* Car Details */}
        <div className="p-4">
          <div className="mb-2">
            <h3 className="text-lg font-bold text-black">{car.make} {car.model}</h3>
            <p className="text-black/70 text-sm">{car.year} • {car.bodyType} • {car.transmission}</p>
          </div>
          
          {/* Price and Mileage */}
          <div className="flex justify-between items-center mb-3">
            <span className="text-xl font-bold text-red-600">{formatPrice(car.price)}</span>
            <span className="text-sm text-black/70">{formatMileage(car.mileage)} mi</span>
          </div>
          
          {/* Features */}
          <div className="flex flex-wrap gap-1 mb-3">
            {car.features.slice(0, 3).map((feature, index) => (
              <span key={index} className="text-xs bg-blue-50 text-blue-600 px-2 py-0.5 rounded">
                {feature}
              </span>
            ))}
          </div>
          
          {/* View Details Button */}
          <motion.button 
            className="w-full bg-black hover:bg-black/80 text-white py-2 rounded text-sm font-medium"
            whileHover={{ backgroundColor: 'rgba(0, 0, 0, 0.8)' }}
            whileTap={{ scale: 0.98 }}
          >
            View Details
          </motion.button>
        </div>
      </Link>
    </motion.div>
  );
};

export default CarCard; 