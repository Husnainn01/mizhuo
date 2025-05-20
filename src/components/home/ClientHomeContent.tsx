'use client';

import Image from "next/image";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

// Animation variants for staggered children
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.3
    }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { 
      type: "spring", 
      stiffness: 100,
      damping: 12
    }
  }
};

export default function ClientHomeContent() {
  const [showScrollTop, setShowScrollTop] = useState(false);
  const router = useRouter();
  
  // Search form state
  const [make, setMake] = useState("");
  const [model, setModel] = useState("");
  const [bodyType, setBodyType] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [minYear, setMinYear] = useState("");
  const [maxYear, setMaxYear] = useState("");
  
  // API data
  const [makes, setMakes] = useState<string[]>([]);
  const [models, setModels] = useState<string[]>([]);
  const [bodyTypes, setBodyTypes] = useState<{name: string, value: string}[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [featuredCars, setFeaturedCars] = useState<any[]>([]);
  const [isLoadingFeatured, setIsLoadingFeatured] = useState(true);
  
  // Fetch featured cars
  useEffect(() => {
    const fetchFeaturedCars = async () => {
      try {
        const response = await fetch('/api/cars/featured?limit=12');
        if (!response.ok) throw new Error('Failed to fetch featured cars');
        const data = await response.json();
        if (data.success) {
          setFeaturedCars(data.cars || []);
        }
      } catch (error) {
        console.error('Error fetching featured cars:', error);
      } finally {
        setIsLoadingFeatured(false);
      }
    };
    
    fetchFeaturedCars();
  }, []);
  
  // Fetch makes from API
  useEffect(() => {
    const fetchMakes = async () => {
      try {
        const response = await fetch('/api/attributes?type=makes');
        if (!response.ok) throw new Error('Failed to fetch makes');
        const data = await response.json();
        if (data.success) {
          setMakes(data.attributes || []);
        }
      } catch (error) {
        console.error('Error fetching makes:', error);
      }
    };
    
    const fetchBodyTypes = async () => {
      try {
        const response = await fetch('/api/attributes?type=body');
        if (!response.ok) throw new Error('Failed to fetch body types');
        const data = await response.json();
        if (data.success) {
          setBodyTypes(data.attributes || []);
        }
      } catch (error) {
        console.error('Error fetching body types:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchMakes();
    fetchBodyTypes();
  }, []);
  
  // Fetch models based on selected make
  useEffect(() => {
    const fetchModels = async () => {
      if (!make) {
        setModels([]);
        return;
      }
      
      try {
        const response = await fetch(`/api/attributes?type=models&make=${make}`);
        if (!response.ok) throw new Error('Failed to fetch models');
        const data = await response.json();
        if (data.success) {
          setModels(data.attributes || []);
        }
      } catch (error) {
        console.error('Error fetching models:', error);
      }
    };
    
    fetchModels();
  }, [make]);
  
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      if (scrollY > 500) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };
  
  const handleSearch = () => {
    const searchParams = new URLSearchParams();
    
    if (make) searchParams.append("make", make);
    if (model) searchParams.append("model", model);
    if (bodyType) searchParams.append("bodyType", bodyType);
    if (minPrice) searchParams.append("minPrice", minPrice);
    if (maxPrice) searchParams.append("maxPrice", maxPrice);
    if (minYear) searchParams.append("minYear", minYear);
    if (maxYear) searchParams.append("maxYear", maxYear);
    
    // Navigate to cars page with search params
    router.push(`/cars?${searchParams.toString()}`);
  };
  
  // Generate price options
  const priceOptions = [
    { value: "5000", label: "$5,000" },
    { value: "10000", label: "$10,000" },
    { value: "15000", label: "$15,000" },
    { value: "20000", label: "$20,000" },
    { value: "25000", label: "$25,000" },
    { value: "30000", label: "$30,000" },
    { value: "40000", label: "$40,000" },
    { value: "50000", label: "$50,000" },
    { value: "75000", label: "$75,000" },
    { value: "100000", label: "$100,000" },
    { value: "150000", label: "$150,000" },
    { value: "200000", label: "$200,000+" }
  ];
  
  // Generate year options (from 1990 to current year)
  const currentYear = new Date().getFullYear();
  const yearOptions = Array.from({ length: currentYear - 1989 }, (_, i) => ({
    value: String(1990 + i),
    label: String(1990 + i)
  })).reverse();

  return (
    <main className="flex min-h-screen flex-col relative">
      {/* Hero Section */}
      <section className="relative w-full h-[600px]">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/hero-car.jpg"
            alt="Luxury Car"
            fill
            priority
            className="object-cover"
          />
          <div className="absolute inset-0 bg-black/50 z-10"></div>
        </div>
        
        {/* Content */}
        <div className="relative z-20 container mx-auto px-4 h-full flex items-center">
          <div className="max-w-3xl text-white">
            <h1 className="text-5xl font-bold mb-4">Find Your Perfect Car</h1>
            <p className="text-xl mb-8">Browse our collection of premium vehicles and drive away with your dream car today.</p>
            
            {/* Search Form */}
            <div className="bg-white rounded-lg p-6 shadow-lg">
              <h2 className="text-black text-xl font-semibold mb-4">Quick Search</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                {/* Make */}
                <div>
                  <label htmlFor="make" className="block text-gray-700 text-sm font-medium mb-1">Make</label>
                  <select
                    id="make"
                    value={make}
                    onChange={(e) => setMake(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    disabled={isLoading}
                  >
                    <option value="">Any Make</option>
                    {makes.map((makeOption) => (
                      <option key={makeOption} value={makeOption}>
                        {makeOption}
                      </option>
                    ))}
                  </select>
                </div>
                
                {/* Model */}
                <div>
                  <label htmlFor="model" className="block text-gray-700 text-sm font-medium mb-1">Model</label>
                  <select
                    id="model"
                    value={model}
                    onChange={(e) => setModel(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    disabled={!make || models.length === 0}
                  >
                    <option value="">Any Model</option>
                    {models.map((modelOption) => (
                      <option key={modelOption} value={modelOption}>
                        {modelOption}
                      </option>
                    ))}
                  </select>
                </div>
                
                {/* Body Type */}
                <div>
                  <label htmlFor="bodyType" className="block text-gray-700 text-sm font-medium mb-1">Body Type</label>
                  <select
                    id="bodyType"
                    value={bodyType}
                    onChange={(e) => setBodyType(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    disabled={isLoading}
                  >
                    <option value="">Any Type</option>
                    {bodyTypes.map((type) => (
                      <option key={type.value} value={type.value}>
                        {type.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                {/* Price Range */}
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label htmlFor="minPrice" className="block text-gray-700 text-sm font-medium mb-1">Min Price</label>
                    <select
                      id="minPrice"
                      value={minPrice}
                      onChange={(e) => setMinPrice(e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">No Min</option>
                      {priceOptions.map((option) => (
                        <option key={`min-${option.value}`} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label htmlFor="maxPrice" className="block text-gray-700 text-sm font-medium mb-1">Max Price</label>
                    <select
                      id="maxPrice"
                      value={maxPrice}
                      onChange={(e) => setMaxPrice(e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">No Max</option>
                      {priceOptions.map((option) => (
                        <option key={`max-${option.value}`} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                
                {/* Year Range */}
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label htmlFor="minYear" className="block text-gray-700 text-sm font-medium mb-1">Min Year</label>
                    <select
                      id="minYear"
                      value={minYear}
                      onChange={(e) => setMinYear(e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">No Min</option>
                      {yearOptions.map((option) => (
                        <option key={`min-${option.value}`} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label htmlFor="maxYear" className="block text-gray-700 text-sm font-medium mb-1">Max Year</label>
                    <select
                      id="maxYear"
                      value={maxYear}
                      onChange={(e) => setMaxYear(e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">No Max</option>
                      {yearOptions.map((option) => (
                        <option key={`max-${option.value}`} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
              
              <button
                onClick={handleSearch}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors"
              >
                Search Cars
              </button>
            </div>
          </div>
        </div>
      </section>
      
      {/* Back to Top Button */}
      <motion.button
        onClick={scrollToTop}
        className="fixed bottom-6 right-6 z-[9999] bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white p-3 rounded-full shadow-lg transition-all hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-blue-400 group"
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ 
          opacity: showScrollTop ? 1 : 0,
          scale: showScrollTop ? 1 : 0.5,
          y: showScrollTop ? 0 : 20
        }}
        transition={{ duration: 0.3 }}
        aria-label="Scroll to top"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 transform group-hover:-translate-y-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
        </svg>
        <span className="absolute w-full text-center text-xs font-medium -bottom-6 left-0 opacity-0 group-hover:opacity-100 transition-opacity">TOP</span>
      </motion.button>
    </main>
  );
} 