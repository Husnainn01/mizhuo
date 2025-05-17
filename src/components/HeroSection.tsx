'use client';

import Image from "next/image";
import Link from "next/link";

export default function HeroSection() {
  return (
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
                <div className="bg-gradient-to-r from-blue-600 to-blue-700 py-2 px-4">
                  <p className="text-white text-sm font-medium text-center">Find Your Perfect Vehicle</p>
                </div>
                <div className="p-4 bg-gradient-to-b from-gray-50 to-white">
                  <div className="space-y-3">
                    {/* Make Selector */}
                    <div>
                      <label htmlFor="make" className="block text-xs font-medium text-gray-700 mb-1">Make</label>
                      <div className="relative">
                        <select 
                          id="make"
                          className="w-full py-2 px-3 bg-white border border-gray-200 rounded-md text-sm appearance-none pr-8 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent shadow-sm transition-all"
                        >
                          <option value="">Select Make</option>
                          <option value="toyota">Toyota</option>
                          <option value="honda">Honda</option>
                          <option value="ford">Ford</option>
                          <option value="bmw">BMW</option>
                          <option value="mercedes">Mercedes-Benz</option>
                          <option value="audi">Audi</option>
                          <option value="tesla">Tesla</option>
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
                          className="w-full py-2 px-3 bg-white border border-gray-200 rounded-md text-sm appearance-none pr-8 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent shadow-sm transition-all"
                        >
                          <option value="">Select Model</option>
                          <option value="camry">Camry</option>
                          <option value="corolla">Corolla</option>
                          <option value="rav4">RAV4</option>
                          <option value="highlander">Highlander</option>
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
                          className="w-full py-2 px-3 bg-white border border-gray-200 rounded-md text-sm appearance-none pr-8 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent shadow-sm transition-all"
                        >
                          <option value="">Select Body Type</option>
                          <option value="sedan">Sedan</option>
                          <option value="suv">SUV</option>
                          <option value="truck">Truck</option>
                          <option value="coupe">Coupe</option>
                          <option value="convertible">Convertible</option>
                          <option value="hatchback">Hatchback</option>
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
                            className="w-full py-2 px-3 bg-white border border-gray-200 rounded-md text-sm appearance-none pr-8 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent shadow-sm transition-all"
                          >
                            <option value="">Min Price</option>
                            <option value="10000">$10,000</option>
                            <option value="20000">$20,000</option>
                            <option value="30000">$30,000</option>
                            <option value="50000">$50,000</option>
                            <option value="75000">$75,000</option>
                          </select>
                          <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none text-blue-600">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                          </div>
                        </div>
                        <div className="relative">
                          <select 
                            className="w-full py-2 px-3 bg-white border border-gray-200 rounded-md text-sm appearance-none pr-8 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent shadow-sm transition-all"
                          >
                            <option value="">Max Price</option>
                            <option value="20000">$20,000</option>
                            <option value="30000">$30,000</option>
                            <option value="50000">$50,000</option>
                            <option value="75000">$75,000</option>
                            <option value="100000">$100,000</option>
                            <option value="200000">$200,000+</option>
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
                            className="w-full py-2 px-3 bg-white border border-gray-200 rounded-md text-sm appearance-none pr-8 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent shadow-sm transition-all"
                          >
                            <option value="">Min Year</option>
                            <option value="2018">2018</option>
                            <option value="2019">2019</option>
                            <option value="2020">2020</option>
                            <option value="2021">2021</option>
                            <option value="2022">2022</option>
                            <option value="2023">2023</option>
                          </select>
                          <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none text-blue-600">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                          </div>
                        </div>
                        <div className="relative">
                          <select 
                            className="w-full py-2 px-3 bg-white border border-gray-200 rounded-md text-sm appearance-none pr-8 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent shadow-sm transition-all"
                          >
                            <option value="">Max Year</option>
                            <option value="2023">2023</option>
                            <option value="2022">2022</option>
                            <option value="2021">2021</option>
                            <option value="2020">2020</option>
                            <option value="2019">2019</option>
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
                  className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white py-3 font-medium text-sm transition-all flex items-center justify-center relative overflow-hidden group shadow-md"
                >
                  <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-blue-400 to-blue-500 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></div>
                  <span className="relative flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                    </svg>
                    Find Your Car
                  </span>
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
  );
} 