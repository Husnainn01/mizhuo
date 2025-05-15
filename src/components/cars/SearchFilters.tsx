'use client';

import { useState } from 'react';

const SearchFilters = () => {
  const [isOpen, setIsOpen] = useState({
    make: true,
    price: true,
    year: true,
    bodyType: true,
    features: true,
  });

  const toggleSection = (section: keyof typeof isOpen) => {
    setIsOpen(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  // Mock data for filters
  const makes = ['Toyota', 'Honda', 'Ford', 'BMW', 'Mercedes-Benz', 'Audi', 'Nissan', 'Chevrolet'];
  const bodyTypes = ['Sedan', 'SUV', 'Truck', 'Coupe', 'Convertible', 'Wagon', 'Van', 'Hatchback'];
  const features = ['Bluetooth', 'Navigation', 'Leather Seats', 'Sunroof', 'Backup Camera', 'Third Row Seating', 'Heated Seats', 'Apple CarPlay'];

  return (
    <div className="bg-white p-4 rounded-md border border-black/10 sticky top-4">
      <h2 className="text-xl font-bold mb-4 text-black">Search Filters</h2>
      
      {/* Quick Search */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Quick search..."
          className="w-full px-3 py-2 border border-black/10 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      
      {/* Make Filter */}
      <div className="mb-4 border-b border-black/10 pb-4">
        <button 
          className="flex justify-between items-center w-full text-left font-medium text-black"
          onClick={() => toggleSection('make')}
        >
          Make
          <svg 
            className={`w-5 h-5 transition-transform ${isOpen.make ? 'transform rotate-180' : ''}`} 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24" 
            xmlns="http://www.w3.org/2000/svg"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        {isOpen.make && (
          <div className="mt-2 space-y-1">
            {makes.map((make) => (
              <label key={make} className="flex items-center space-x-2 text-black/80 text-sm">
                <input type="checkbox" className="rounded text-red-600 focus:ring-red-500" />
                <span>{make}</span>
              </label>
            ))}
          </div>
        )}
      </div>
      
      {/* Price Range Filter */}
      <div className="mb-4 border-b border-black/10 pb-4">
        <button 
          className="flex justify-between items-center w-full text-left font-medium text-black"
          onClick={() => toggleSection('price')}
        >
          Price Range
          <svg 
            className={`w-5 h-5 transition-transform ${isOpen.price ? 'transform rotate-180' : ''}`} 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24" 
            xmlns="http://www.w3.org/2000/svg"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        {isOpen.price && (
          <div className="mt-2">
            <div className="flex justify-between text-sm text-black/80 mb-1">
              <span>$0</span>
              <span>$100,000+</span>
            </div>
            <input 
              type="range" 
              min="0" 
              max="100000" 
              step="5000" 
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-red-600" 
            />
            <div className="flex gap-2 mt-2">
              <input 
                type="number" 
                placeholder="Min" 
                className="w-full px-2 py-1 text-sm border border-black/10 rounded" 
              />
              <input 
                type="number" 
                placeholder="Max" 
                className="w-full px-2 py-1 text-sm border border-black/10 rounded" 
              />
            </div>
          </div>
        )}
      </div>
      
      {/* Year Filter */}
      <div className="mb-4 border-b border-black/10 pb-4">
        <button 
          className="flex justify-between items-center w-full text-left font-medium text-black"
          onClick={() => toggleSection('year')}
        >
          Year
          <svg 
            className={`w-5 h-5 transition-transform ${isOpen.year ? 'transform rotate-180' : ''}`} 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24" 
            xmlns="http://www.w3.org/2000/svg"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        {isOpen.year && (
          <div className="mt-2">
            <div className="flex gap-2">
              <select className="w-full px-2 py-1 text-sm border border-black/10 rounded">
                <option value="">From</option>
                {Array.from({ length: 30 }, (_, i) => new Date().getFullYear() - i).map(year => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
              <select className="w-full px-2 py-1 text-sm border border-black/10 rounded">
                <option value="">To</option>
                {Array.from({ length: 30 }, (_, i) => new Date().getFullYear() - i).map(year => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
            </div>
          </div>
        )}
      </div>
      
      {/* Body Type Filter */}
      <div className="mb-4 border-b border-black/10 pb-4">
        <button 
          className="flex justify-between items-center w-full text-left font-medium text-black"
          onClick={() => toggleSection('bodyType')}
        >
          Body Type
          <svg 
            className={`w-5 h-5 transition-transform ${isOpen.bodyType ? 'transform rotate-180' : ''}`} 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24" 
            xmlns="http://www.w3.org/2000/svg"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        {isOpen.bodyType && (
          <div className="mt-2 space-y-1">
            {bodyTypes.map((type) => (
              <label key={type} className="flex items-center space-x-2 text-black/80 text-sm">
                <input type="checkbox" className="rounded text-red-600 focus:ring-red-500" />
                <span>{type}</span>
              </label>
            ))}
          </div>
        )}
      </div>
      
      {/* Features Filter */}
      <div className="mb-4">
        <button 
          className="flex justify-between items-center w-full text-left font-medium text-black"
          onClick={() => toggleSection('features')}
        >
          Features
          <svg 
            className={`w-5 h-5 transition-transform ${isOpen.features ? 'transform rotate-180' : ''}`} 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24" 
            xmlns="http://www.w3.org/2000/svg"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        {isOpen.features && (
          <div className="mt-2 space-y-1">
            {features.map((feature) => (
              <label key={feature} className="flex items-center space-x-2 text-black/80 text-sm">
                <input type="checkbox" className="rounded text-red-600 focus:ring-red-500" />
                <span>{feature}</span>
              </label>
            ))}
          </div>
        )}
      </div>
      
      {/* Apply Filters Button */}
      <button className="w-full bg-red-600 hover:bg-red-700 text-white py-2 rounded-md font-medium transition-colors">
        Apply Filters
      </button>
      
      {/* Clear Filters Link */}
      <button className="w-full text-blue-600 hover:text-blue-800 text-sm mt-2 transition-colors">
        Clear All Filters
      </button>
    </div>
  );
};

export default SearchFilters; 