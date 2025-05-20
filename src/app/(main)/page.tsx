'use client';

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import InfoBar from "@/components/InfoBar";
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

export default function Home() {
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
    <>
      <InfoBar />
      <main className="flex min-h-screen flex-col relative">
        {/* Hero Section */}
        <section className="relative w-full h-[600px]">
          {/* Background Image with Overlay */}
          <div className="absolute inset-0 z-0">
            <Image
              src="/hero-car.jpg"
              alt="Luxury Car"
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-black/40" />
          </div>

          {/* Content Container */}
          <div className="relative z-10 container mx-auto h-full">
            <div className="w-full h-full flex items-center">
              <div className="flex flex-col w-full px-4">
                <div className="flex flex-col lg:flex-row w-full gap-8">
                  {/* Car Search Form - Left */}
                  <div className="w-full lg:w-5/12 bg-white rounded-md shadow-lg overflow-hidden">
                    <div className="bg-blue-600 py-2 px-4">
                      <p className="text-white text-sm font-medium text-center">Find Your Perfect Vehicle</p>
                    </div>
                    <div className="p-4 bg-white">
                      <div className="space-y-3">
                        {/* Make Selector */}
                        <div>
                          <label htmlFor="make" className="block text-xs font-medium text-gray-700 mb-1">Make</label>
                          <div className="relative">
                            <select 
                              id="make"
                              value={make}
                              onChange={(e) => {
                                setMake(e.target.value);
                                setModel(""); // Reset model when make changes
                              }}
                              className="w-full py-2 px-3 bg-white border border-gray-200 rounded-md text-sm appearance-none pr-8 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent shadow-sm transition-all"
                              disabled={isLoading}
                            >
                              <option value="">Select Make</option>
                              {makes.map((makeName) => (
                                <option key={makeName} value={makeName}>{makeName}</option>
                              ))}
                            </select>
                            <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none text-blue-600">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                              </svg>
                            </div>
                          </div>
                        </div>
                        
                        {/* Model Selector */}
                        <div>
                          <label htmlFor="model" className="block text-xs font-medium text-gray-700 mb-1">Model</label>
                          <div className="relative">
                            <select 
                              id="model"
                              value={model}
                              onChange={(e) => setModel(e.target.value)}
                              className="w-full py-2 px-3 bg-white border border-gray-200 rounded-md text-sm appearance-none pr-8 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent shadow-sm transition-all"
                              disabled={!make || isLoading}
                            >
                              <option value="">Select Model</option>
                              {models.map((modelName) => (
                                <option key={modelName} value={modelName}>{modelName}</option>
                              ))}
                            </select>
                            <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none text-blue-600">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                              </svg>
                            </div>
                          </div>
                        </div>
                        
                        {/* Body Type Selector */}
                        <div>
                          <label htmlFor="bodyType" className="block text-xs font-medium text-gray-700 mb-1">Body Type</label>
                          <div className="relative">
                            <select 
                              id="bodyType"
                              value={bodyType}
                              onChange={(e) => setBodyType(e.target.value)}
                              className="w-full py-2 px-3 bg-white border border-gray-200 rounded-md text-sm appearance-none pr-8 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent shadow-sm transition-all"
                              disabled={isLoading}
                            >
                              <option value="">Select Body Type</option>
                              {bodyTypes.map((type) => (
                                <option key={type.value} value={type.value}>{type.name}</option>
                              ))}
                            </select>
                            <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none text-blue-600">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                              </svg>
                            </div>
                          </div>
                        </div>
                        
                        {/* Price Range */}
                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-1">Price Range</label>
                          <div className="grid grid-cols-2 gap-2">
                            <div className="relative">
                              <select 
                                value={minPrice}
                                onChange={(e) => setMinPrice(e.target.value)}
                                className="w-full py-2 px-3 bg-white border border-gray-200 rounded-md text-sm appearance-none pr-8 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent shadow-sm transition-all"
                              >
                                <option value="">Min Price</option>
                                {priceOptions.map((option) => (
                                  <option key={`min-${option.value}`} value={option.value}>
                                    {option.label}
                                  </option>
                                ))}
                              </select>
                              <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none text-blue-600">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                              </div>
                            </div>
                            <div className="relative">
                              <select 
                                value={maxPrice}
                                onChange={(e) => setMaxPrice(e.target.value)}
                                className="w-full py-2 px-3 bg-white border border-gray-200 rounded-md text-sm appearance-none pr-8 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent shadow-sm transition-all"
                              >
                                <option value="">Max Price</option>
                                {priceOptions.map((option) => (
                                  <option key={`max-${option.value}`} value={option.value}>
                                    {option.label}
                                  </option>
                                ))}
                              </select>
                              <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none text-blue-600">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        {/* Year Range */}
                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-1">Year Range</label>
                          <div className="grid grid-cols-2 gap-2">
                            <div className="relative">
                              <select 
                                value={minYear}
                                onChange={(e) => setMinYear(e.target.value)}
                                className="w-full py-2 px-3 bg-white border border-gray-200 rounded-md text-sm appearance-none pr-8 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent shadow-sm transition-all"
                              >
                                <option value="">Min Year</option>
                                {yearOptions.map((option) => (
                                  <option key={`min-${option.value}`} value={option.value}>
                                    {option.label}
                                  </option>
                                ))}
                              </select>
                              <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none text-blue-600">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                              </div>
                            </div>
                            <div className="relative">
                              <select 
                                value={maxYear}
                                onChange={(e) => setMaxYear(e.target.value)}
                                className="w-full py-2 px-3 bg-white border border-gray-200 rounded-md text-sm appearance-none pr-8 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent shadow-sm transition-all"
                              >
                                <option value="">Max Year</option>
                                {yearOptions.map((option) => (
                                  <option key={`max-${option.value}`} value={option.value}>
                                    {option.label}
                                  </option>
                                ))}
                              </select>
                              <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none text-blue-600">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        {/* Additional Filters */}
                        <div className="pt-1">
                          <button className="w-full flex items-center justify-center text-blue-600 hover:text-blue-800 font-medium py-1 text-xs group transition-colors">
                            <span className="border-b border-dashed border-blue-400 group-hover:border-blue-600">Additional Filters</span>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 ml-1" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>
                    
                    {/* Search Button */}
                    <button 
                      onClick={handleSearch}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 font-medium text-sm transition-all flex items-center justify-center"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                        </svg>
                        Find Your Car
                    </button>
                  </div>
                  
                  {/* Promotional Content - Right */}
                  <div className="w-full lg:w-7/12 flex items-center mt-8 lg:mt-0">
                    <div className="text-white">
                      <h1 className="text-4xl md:text-5xl font-bold mb-3 drop-shadow-lg">
                        Find Your <span className="text-blue-300">Perfect</span> Drive
                      </h1>
                      <h2 className="text-3xl md:text-4xl font-bold mb-4 drop-shadow-lg">
                        Premium Selection
                      </h2>
                      <p className="text-lg mb-6 max-w-xl text-blue-50 drop-shadow-md">
                        Browse our extensive collection of quality vehicles and drive away with your dream car today.
                      </p>
                      <div className="flex flex-wrap gap-3">
                        <Link 
                          href="/cars" 
                          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-md font-medium transition-colors flex items-center text-sm"
                        >
                          Browse Cars
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-2" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
                            <path d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H10a1 1 0 001-1v-5h-1V7a1 1 0 00-1-1H5.05a2.5 2.5 0 014.9 0H9a1 1 0 00-1-1V4a1 1 0 00-1-1H3zM17 15h-1.05a2.5 2.5 0 00-4.9 0H9v-5h6a1 1 0 001-1V7a1 1 0 00-1-1h-1.05a2.5 2.5 0 00-4.9 0H9a1 1 0 00-1 1v1H7a1 1 0 00-1 1v6h1.05a2.5 2.5 0 014.9 0H17a1 1 0 001-1v-1a1 1 0 00-1-1z" />
                          </svg>
                        </Link>
                        <Link 
                          href="/contact" 
                          className="bg-transparent border-2 border-white hover:bg-white/10 text-white px-5 py-2 rounded-md font-medium transition-colors flex items-center text-sm"
                        >
                          Contact Us
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-2" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                          </svg>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Cars Section */}
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
            
            {/* Featured Cars Grid - Will be replaced with dynamic data */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
              {isLoadingFeatured ? (
                // Loading skeleton
                Array.from({ length: 12 }).map((_, index) => (
                  <div key={index} className="bg-white rounded-md shadow-sm overflow-hidden hover:shadow-md transition-shadow border border-black/10 animate-pulse">
                    <div className="relative h-40 bg-gray-200" />
                    <div className="p-3">
                      <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
                      <div className="h-3 bg-gray-200 rounded w-1/2 mb-1" />
                      <div className="flex justify-between items-center">
                        <div className="h-4 bg-gray-200 rounded w-1/3" />
                        <div className="h-3 bg-gray-200 rounded w-1/4" />
                      </div>
                    </div>
                  </div>
                ))
              ) : featuredCars.length > 0 ? (
                featuredCars.map((car) => (
                  <div key={car._id} className="bg-white rounded-md shadow-sm overflow-hidden hover:shadow-md transition-shadow border border-black/10">
                  <div className="relative h-40">
                      <Image
                        src={car.image || '/placeholder-car.jpg'}
                        alt={car.title}
                        fill
                        className="object-cover"
                      />
                    <div className="absolute top-2 left-2">
                      <span className="bg-red-600 text-white text-xs font-bold px-2 py-1 rounded">Featured</span>
                    </div>
                  </div>
                  <div className="p-3">
                      <h3 className="text-sm font-bold truncate text-black">{car.title}</h3>
                      <p className="text-black/70 text-xs mb-1">{car.year} • {car.bodyType} • {car.transmission}</p>
                    <div className="flex justify-between items-center">
                        <span className="text-red-600 font-bold">${car.price.toLocaleString()}</span>
                        <Link href={`/cars/${car._id}`} className="text-xs text-blue-600 hover:underline">
                        Details
                      </Link>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-full text-center py-8">
                  <p className="text-gray-500">No featured cars available at the moment.</p>
                </div>
              )}
            </div>
            
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

        {/* Why Choose Us Section */}
        <section className="py-20 bg-gradient-to-b from-blue-50 to-white relative overflow-hidden">
          {/* Background decoration elements */}
          <div className="absolute top-0 left-0 w-64 h-64 bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
          <div className="absolute top-0 right-0 w-64 h-64 bg-red-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
          <div className="absolute bottom-0 left-1/2 w-64 h-64 bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
          
          <div className="container mx-auto px-4 relative z-10">
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl font-bold mb-4 text-black">Why Choose <span className="text-red-600">Us</span></h2>
              <div className="w-24 h-1 bg-red-600 mx-auto"></div>
              <p className="mt-6 text-gray-600 max-w-2xl mx-auto">
                We pride ourselves on offering exceptional service and premium vehicles to ensure your complete satisfaction.
              </p>
            </motion.div>
            
            <motion.div 
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-10"
            >
              <motion.div 
                variants={itemVariants} 
                className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow p-8 group"
                whileHover={{ y: -10, transition: { duration: 0.3 } }}
              >
                <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-red-100 transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-4 text-center text-black group-hover:text-red-600 transition-colors">24/7 Support</h3>
                <p className="text-gray-600 text-center">
                  Our customer service team is available around the clock to assist you with any questions or concerns you may have.
                </p>
                <motion.div 
                  className="w-0 h-1 bg-red-600 mx-auto mt-6 group-hover:w-16 transition-all duration-300"
                  whileHover={{ width: "4rem" }}
                ></motion.div>
              </motion.div>
              
              <motion.div 
                variants={itemVariants} 
                className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow p-8 group"
                whileHover={{ y: -10, transition: { duration: 0.3 } }}
              >
                <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-blue-100 transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-4 text-center text-black group-hover:text-blue-600 transition-colors">Quality Guarantee</h3>
                <p className="text-gray-600 text-center">
                  Every vehicle in our inventory undergoes a rigorous inspection process before it's listed for sale, ensuring top quality.
                </p>
                <motion.div 
                  className="w-0 h-1 bg-blue-600 mx-auto mt-6 group-hover:w-16 transition-all duration-300"
                  whileHover={{ width: "4rem" }}
                ></motion.div>
              </motion.div>
              
              <motion.div 
                variants={itemVariants} 
                className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow p-8 group"
                whileHover={{ y: -10, transition: { duration: 0.3 } }}
              >
                <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-red-100 transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-4 text-center text-black group-hover:text-red-600 transition-colors">Competitive Pricing</h3>
                <p className="text-gray-600 text-center">
                  We offer the best value for your money with our transparent pricing policy and flexible financing options.
                </p>
                <motion.div 
                  className="w-0 h-1 bg-red-600 mx-auto mt-6 group-hover:w-16 transition-all duration-300"
                  whileHover={{ width: "4rem" }}
                ></motion.div>
              </motion.div>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5, duration: 0.7 }}
              className="mt-16 text-center"
            >
              <Link 
                href="/about" 
                className="inline-flex items-center bg-white text-blue-600 hover:text-blue-800 font-semibold py-3 px-6 rounded-md shadow hover:shadow-md transition-all border border-blue-100"
              >
                Learn More About Us
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </Link>
            </motion.div>
          </div>
        </section>

        {/* How to Buy Process Section - Replacing the previous section */}
        <section className="py-20 bg-gradient-to-r from-blue-700 to-blue-600 relative overflow-hidden">
          {/* Background decorations */}
          <div className="absolute -right-20 top-20 w-40 h-40 rounded-full bg-white opacity-5"></div>
          <div className="absolute left-10 bottom-10 w-20 h-20 rounded-full bg-white opacity-5"></div>
          <div className="absolute right-1/3 bottom-0 w-64 h-64 rounded-full bg-blue-500 opacity-20"></div>
          
          <div className="container mx-auto px-4 relative z-10">
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl font-bold mb-4 text-white">How to Buy Your Perfect Car</h2>
              <div className="w-24 h-1 bg-white mx-auto"></div>
              <p className="mt-6 text-blue-100 max-w-2xl mx-auto">
                Our simple 4-step process makes finding and purchasing your dream car easy and hassle-free.
              </p>
            </motion.div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
              {/* Connecting Line (visible on lg screens only) */}
              <div className="absolute top-1/2 left-0 w-full h-1 bg-blue-400 hidden lg:block"></div>
              
              {/* Step 1 */}
              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="relative"
              >
                <motion.div 
                  className="bg-white rounded-xl p-8 text-center h-full z-10 relative shadow-lg cursor-pointer"
                  whileHover={{ 
                    y: -15, 
                    boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
                    backgroundColor: "#f8fafc"
                  }}
                  onClick={() => window.location.href = '/cars'}
                >
                  <motion.div 
                    className="lg:absolute lg:-top-6 lg:left-1/2 lg:transform lg:-translate-x-1/2 bg-red-600 text-white w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4 lg:mb-0 shadow-lg z-20"
                    whileHover={{ scale: 1.2 }}
                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                  >
                    1
                  </motion.div>
                  <div className="pt-4">
                    <h3 className="text-xl font-bold text-gray-800 mt-4 mb-4">Browse Inventory</h3>
                    <p className="text-gray-600">
                      Search our extensive collection of vehicles or use our advanced filters to find exactly what you're looking for.
                    </p>
                  </div>
                  <motion.div 
                    className="mt-6 flex justify-center"
                    whileHover={{ rotate: 15, scale: 1.1 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <svg className="w-16 h-16 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 21h7a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v11m0 5l4.879-4.879m0 0a3 3 0 104.243-4.242 3 3 0 00-4.243 4.242z" />
                    </svg>
                  </motion.div>
                  <div className="mt-4 text-blue-600 font-medium flex justify-center items-center group">
                    <span className="group-hover:mr-2 transition-all">View Cars</span>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-0 group-hover:w-5 transition-all overflow-hidden" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </div>
                </motion.div>
              </motion.div>
              
              {/* Step 2 */}
              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="relative"
              >
                <motion.div 
                  className="bg-white rounded-xl p-8 text-center h-full z-10 relative shadow-lg cursor-pointer"
                  whileHover={{ 
                    y: -15, 
                    boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
                    backgroundColor: "#f8fafc"
                  }}
                  onClick={() => window.location.href = '/contact'}
                >
                  <motion.div 
                    className="lg:absolute lg:-top-6 lg:left-1/2 lg:transform lg:-translate-x-1/2 bg-red-600 text-white w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4 lg:mb-0 shadow-lg z-20"
                    whileHover={{ scale: 1.2 }}
                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                  >
                    2
                  </motion.div>
                  <div className="pt-4">
                    <h3 className="text-xl font-bold text-gray-800 mt-4 mb-4">Schedule Test Drive</h3>
                    <p className="text-gray-600">
                      Book an appointment to test drive your selected vehicles at a time that works for you.
                    </p>
                  </div>
                  <motion.div 
                    className="mt-6 flex justify-center"
                    whileHover={{ rotate: 15, scale: 1.1 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <svg className="w-16 h-16 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </motion.div>
                  <div className="mt-4 text-blue-600 font-medium flex justify-center items-center group">
                    <span className="group-hover:mr-2 transition-all">Book Now</span>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-0 group-hover:w-5 transition-all overflow-hidden" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </div>
                </motion.div>
              </motion.div>
              
              {/* Step 3 */}
              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.5 }}
                className="relative"
              >
                <motion.div 
                  className="bg-white rounded-xl p-8 text-center h-full z-10 relative shadow-lg cursor-pointer"
                  whileHover={{ 
                    y: -15, 
                    boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
                    backgroundColor: "#f8fafc"
                  }}
                  onClick={() => window.location.href = '/financing'}
                >
                  <motion.div 
                    className="lg:absolute lg:-top-6 lg:left-1/2 lg:transform lg:-translate-x-1/2 bg-red-600 text-white w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4 lg:mb-0 shadow-lg z-20"
                    whileHover={{ scale: 1.2 }}
                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                  >
                    3
                  </motion.div>
                  <div className="pt-4">
                    <h3 className="text-xl font-bold text-gray-800 mt-4 mb-4">Financing Options</h3>
                    <p className="text-gray-600">
                      Discuss financing choices with our team to find a payment plan that suits your budget.
                    </p>
                  </div>
                  <motion.div 
                    className="mt-6 flex justify-center"
                    whileHover={{ rotate: 15, scale: 1.1 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <svg className="w-16 h-16 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </motion.div>
                  <div className="mt-4 text-blue-600 font-medium flex justify-center items-center group">
                    <span className="group-hover:mr-2 transition-all">Learn More</span>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-0 group-hover:w-5 transition-all overflow-hidden" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </div>
                </motion.div>
              </motion.div>
              
              {/* Step 4 */}
              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.7 }}
                className="relative"
              >
                <motion.div 
                  className="bg-white rounded-xl p-8 text-center h-full z-10 relative shadow-lg cursor-pointer"
                  whileHover={{ 
                    y: -15, 
                    boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
                    backgroundColor: "#f8fafc"
                  }}
                  onClick={() => window.location.href = '/about'}
                >
                  <motion.div 
                    className="lg:absolute lg:-top-6 lg:left-1/2 lg:transform lg:-translate-x-1/2 bg-red-600 text-white w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4 lg:mb-0 shadow-lg z-20"
                    whileHover={{ scale: 1.2 }}
                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                  >
                    4
                  </motion.div>
                  <div className="pt-4">
                    <h3 className="text-xl font-bold text-gray-800 mt-4 mb-4">Drive Home Happy</h3>
                    <p className="text-gray-600">
                      Complete the paperwork, get your keys, and enjoy your new vehicle with our continued support.
                    </p>
                  </div>
                  <motion.div 
                    className="mt-6 flex justify-center"
                    whileHover={{ rotate: 15, scale: 1.1 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <svg className="w-16 h-16 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </motion.div>
                  <div className="mt-4 text-blue-600 font-medium flex justify-center items-center group">
                    <span className="group-hover:mr-2 transition-all">Our Guarantee</span>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-0 group-hover:w-5 transition-all overflow-hidden" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </div>
                </motion.div>
              </motion.div>
            </div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.9 }}
              className="text-center mt-16"
            >
              <Link 
                href="/contact" 
                className="inline-flex items-center bg-white text-blue-600 hover:bg-blue-50 px-8 py-4 rounded-md font-bold text-lg transition-colors"
              >
                Start Your Journey
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </Link>
            </motion.div>
          </div>
        </section>
      </main>

      {/* Back to Top Button - Positioned outside main content */}
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
    </>
  );
}
