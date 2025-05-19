'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useDebounce } from '@/hooks/useDebounce';

interface AttributeOption {
  name: string;
  value: string;
}

const SearchFilters = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // Expand/collapse section states
  const [isOpen, setIsOpen] = useState({
    make: true,
    price: true,
    year: true,
    bodyType: true,
    fuelType: true,
    features: false, // Collapsed by default as it can be long
  });

  // Filter state
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [selectedMake, setSelectedMake] = useState(searchParams.get('make') || '');
  const [selectedModels, setSelectedModels] = useState<string[]>([]);
  const [minPrice, setMinPrice] = useState(searchParams.get('minPrice') || '');
  const [maxPrice, setMaxPrice] = useState(searchParams.get('maxPrice') || '');
  const [minYear, setMinYear] = useState(searchParams.get('minYear') || '');
  const [maxYear, setMaxYear] = useState(searchParams.get('maxYear') || '');
  const [selectedBodyTypes, setSelectedBodyTypes] = useState<string[]>([]);
  const [selectedFuelTypes, setSelectedFuelTypes] = useState<string[]>([]);
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]);
  
  // Options from API
  const [makes, setMakes] = useState<string[]>([]);
  const [models, setModels] = useState<string[]>([]);
  const [years, setYears] = useState<number[]>([]);
  const [bodyTypes, setBodyTypes] = useState<AttributeOption[]>([]);
  const [fuelTypes, setFuelTypes] = useState<AttributeOption[]>([]);
  const [features, setFeatures] = useState<AttributeOption[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Debounced search term to avoid too many API calls
  const debouncedSearch = useDebounce(search, 500);
  
  // Parse existing filter values from URL on mount
  useEffect(() => {
    if (searchParams) {
      // Parse multi-select parameters that could be arrays
      const bodyTypeParam = searchParams.getAll('bodyType');
      const fuelTypeParam = searchParams.getAll('fuelType');
      const featureParam = searchParams.getAll('feature');
      const modelParam = searchParams.getAll('model');
      
      if (bodyTypeParam.length) setSelectedBodyTypes(bodyTypeParam);
      if (fuelTypeParam.length) setSelectedFuelTypes(fuelTypeParam);
      if (featureParam.length) setSelectedFeatures(featureParam);
      if (modelParam.length) setSelectedModels(modelParam);
    }
  }, [searchParams]);
  
  // Fetch filter options on component mount
  useEffect(() => {
    const fetchFilterOptions = async () => {
      setIsLoading(true);
      try {
        // Fetch makes
        const makesResponse = await fetch('/api/attributes?type=makes');
        if (makesResponse.ok) {
          const makesData = await makesResponse.json();
          if (makesData.success) {
            setMakes(makesData.attributes);
          }
        }
        
        // Fetch years
        const yearsResponse = await fetch('/api/attributes?type=years');
        if (yearsResponse.ok) {
          const yearsData = await yearsResponse.json();
          if (yearsData.success) {
            setYears(yearsData.attributes);
          }
        }
        
        // Fetch body types
        const bodyTypesResponse = await fetch('/api/attributes?type=body');
        if (bodyTypesResponse.ok) {
          const bodyTypesData = await bodyTypesResponse.json();
          if (bodyTypesData.success) {
            setBodyTypes(bodyTypesData.attributes);
          }
        }
        
        // Fetch fuel types
        const fuelTypesResponse = await fetch('/api/attributes?type=fuel');
        if (fuelTypesResponse.ok) {
          const fuelTypesData = await fuelTypesResponse.json();
          if (fuelTypesData.success) {
            setFuelTypes(fuelTypesData.attributes);
          }
        }
        
        // Fetch features
        const featuresResponse = await fetch('/api/attributes?type=feature');
        if (featuresResponse.ok) {
          const featuresData = await featuresResponse.json();
          if (featuresData.success) {
            setFeatures(featuresData.attributes);
          }
        }
      } catch (error) {
        console.error('Error fetching filter options:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchFilterOptions();
  }, []);
  
  // Fetch models when make is selected
  useEffect(() => {
    if (selectedMake) {
      const fetchModels = async () => {
        try {
          const response = await fetch(`/api/attributes?type=models&make=${selectedMake}`);
          if (response.ok) {
            const data = await response.json();
            if (data.success) {
              setModels(data.attributes);
            }
          }
        } catch (error) {
          console.error('Error fetching models:', error);
        }
      };
      
      fetchModels();
    } else {
      // Clear models if no make is selected
      setModels([]);
      setSelectedModels([]);
    }
  }, [selectedMake]);
  
  // Update URL when search term changes
  useEffect(() => {
    if (debouncedSearch !== searchParams.get('search')) {
      applyFilters();
    }
  }, [debouncedSearch]);
  
  // Toggle section expansion/collapse
  const toggleSection = (section: keyof typeof isOpen) => {
    setIsOpen(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };
  
  // Handle checkbox change for array filters
  const handleCheckboxChange = (
    value: string, 
    selectedValues: string[], 
    setSelectedValues: React.Dispatch<React.SetStateAction<string[]>>
  ) => {
    if (selectedValues.includes(value)) {
      setSelectedValues(selectedValues.filter(v => v !== value));
    } else {
      setSelectedValues([...selectedValues, value]);
    }
  };
  
  // Apply filters to URL
  const applyFilters = () => {
    const params = new URLSearchParams();
    
    // Add single value filters
    if (search) params.set('search', search);
    if (selectedMake) params.set('make', selectedMake);
    if (minPrice) params.set('minPrice', minPrice);
    if (maxPrice) params.set('maxPrice', maxPrice);
    if (minYear) params.set('minYear', minYear);
    if (maxYear) params.set('maxYear', maxYear);
    
    // Add multi-value filters
    selectedModels.forEach(model => params.append('model', model));
    selectedBodyTypes.forEach(type => params.append('bodyType', type));
    selectedFuelTypes.forEach(type => params.append('fuelType', type));
    selectedFeatures.forEach(feature => params.append('feature', feature));
    
    // Reset to page 1 when filters change
    params.set('page', '1');
    
    // Keep the sort parameter if it exists
    const sort = searchParams.get('sort');
    if (sort) params.set('sort', sort);
    
    // Update URL
    router.push(`/cars?${params.toString()}`);
  };
  
  // Clear all filters
  const clearFilters = () => {
    setSearch('');
    setSelectedMake('');
    setSelectedModels([]);
    setMinPrice('');
    setMaxPrice('');
    setMinYear('');
    setMaxYear('');
    setSelectedBodyTypes([]);
    setSelectedFuelTypes([]);
    setSelectedFeatures([]);
    
    // Keep only the sort parameter if it exists
    const params = new URLSearchParams();
    const sort = searchParams.get('sort');
    if (sort) params.set('sort', sort);
    
    router.push(`/cars?${params.toString()}`);
  };

  return (
    <div className="bg-white p-4 rounded-md border border-black/10 sticky top-4">
      <h2 className="text-xl font-bold mb-4 text-black">Search Filters</h2>
      
      {/* Quick Search */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Quick search..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
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
          <div className="mt-2">
            <select 
              value={selectedMake} 
              onChange={(e) => setSelectedMake(e.target.value)}
              className="w-full p-2 border border-black/10 rounded text-sm"
            >
              <option value="">All Makes</option>
              {makes.map((make) => (
                <option key={make} value={make}>{make}</option>
              ))}
            </select>
            
            {/* Show models selector if make is selected */}
            {selectedMake && models.length > 0 && (
              <div className="mt-3">
                <p className="text-sm font-medium mb-1 text-black">Models</p>
                <div className="max-h-32 overflow-y-auto">
                  {models.map((model) => (
                    <label key={model} className="flex items-center space-x-2 text-black/80 text-sm py-1">
                      <input 
                        type="checkbox" 
                        checked={selectedModels.includes(model)}
                        onChange={() => handleCheckboxChange(model, selectedModels, setSelectedModels)}
                        className="rounded text-red-600 focus:ring-red-500" 
                      />
                      <span>{model}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}
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
            <div className="flex gap-2 mt-2">
              <input 
                type="number" 
                placeholder="Min" 
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                className="w-full px-2 py-1 text-sm border border-black/10 rounded" 
              />
              <input 
                type="number" 
                placeholder="Max" 
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
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
              <select 
                value={minYear}
                onChange={(e) => setMinYear(e.target.value)}
                className="w-full px-2 py-1 text-sm border border-black/10 rounded"
              >
                <option value="">From</option>
                {years.map(year => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
              <select 
                value={maxYear}
                onChange={(e) => setMaxYear(e.target.value)}
                className="w-full px-2 py-1 text-sm border border-black/10 rounded"
              >
                <option value="">To</option>
                {years.map(year => (
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
          <div className="mt-2 space-y-1 max-h-40 overflow-y-auto">
            {bodyTypes.map((type) => (
              <label key={type.value} className="flex items-center space-x-2 text-black/80 text-sm">
                <input 
                  type="checkbox"
                  checked={selectedBodyTypes.includes(type.value)}
                  onChange={() => handleCheckboxChange(type.value, selectedBodyTypes, setSelectedBodyTypes)}
                  className="rounded text-red-600 focus:ring-red-500" 
                />
                <span>{type.name}</span>
              </label>
            ))}
            {bodyTypes.length === 0 && !isLoading && (
              <p className="text-sm text-black/60 italic">No body types available</p>
            )}
          </div>
        )}
      </div>
      
      {/* Fuel Type Filter */}
      <div className="mb-4 border-b border-black/10 pb-4">
        <button 
          className="flex justify-between items-center w-full text-left font-medium text-black"
          onClick={() => toggleSection('fuelType')}
        >
          Fuel Type
          <svg 
            className={`w-5 h-5 transition-transform ${isOpen.fuelType ? 'transform rotate-180' : ''}`} 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24" 
            xmlns="http://www.w3.org/2000/svg"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        {isOpen.fuelType && (
          <div className="mt-2 space-y-1">
            {fuelTypes.map((type) => (
              <label key={type.value} className="flex items-center space-x-2 text-black/80 text-sm">
                <input 
                  type="checkbox"
                  checked={selectedFuelTypes.includes(type.value)}
                  onChange={() => handleCheckboxChange(type.value, selectedFuelTypes, setSelectedFuelTypes)}
                  className="rounded text-red-600 focus:ring-red-500" 
                />
                <span>{type.name}</span>
              </label>
            ))}
            {fuelTypes.length === 0 && !isLoading && (
              <p className="text-sm text-black/60 italic">No fuel types available</p>
            )}
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
          <div className="mt-2 space-y-1 max-h-40 overflow-y-auto">
            {features.map((feature) => (
              <label key={feature.value} className="flex items-center space-x-2 text-black/80 text-sm">
                <input 
                  type="checkbox"
                  checked={selectedFeatures.includes(feature.value)}
                  onChange={() => handleCheckboxChange(feature.value, selectedFeatures, setSelectedFeatures)}
                  className="rounded text-red-600 focus:ring-red-500" 
                />
                <span>{feature.name}</span>
              </label>
            ))}
            {features.length === 0 && !isLoading && (
              <p className="text-sm text-black/60 italic">No features available</p>
            )}
          </div>
        )}
      </div>
      
      {isLoading ? (
        <div className="py-2 text-center text-black/60 text-sm animate-pulse">
          Loading filters...
        </div>
      ) : (
        <>
          {/* Apply Filters Button */}
          <button 
            className="w-full bg-red-600 hover:bg-red-700 text-white py-2 rounded-md font-medium transition-colors"
            onClick={applyFilters}
          >
            Apply Filters
          </button>
          
          {/* Clear Filters Link */}
          <button 
            className="w-full text-blue-600 hover:text-blue-800 text-sm mt-2 transition-colors"
            onClick={clearFilters}
          >
            Clear All Filters
          </button>
        </>
      )}
    </div>
  );
};

export default SearchFilters; 