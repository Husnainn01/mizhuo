'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AdminPanelLayout from '@/components/admin/AdminPanelLayout';
import SortableImageGallery from '@/components/admin/SortableImageGallery';
import Link from 'next/link';

export default function AddCarListing() {
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    make: '',
    model: '',
    year: new Date().getFullYear(),
    price: '',
    priceCurrency: 'USD',
    description: '',
    mileage: '',
    mileageUnit: 'km',
    fuelType: '',
    vehicleTransmission: '',
    color: '',
    bodyType: '',
    vehicleSeatingCapacity: '',
    driveType: '',
    vin: '',
    stockNumber: '',
    offerType: 'In Stock',
    section: 'recent',
    isFeatured: false,
    carFeature: [] as string[],
    images: [] as string[]
  });
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]);
  const [featuresInput, setFeaturesInput] = useState('');
  const [images, setImages] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [mainImageIndex, setMainImageIndex] = useState(0);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [uploadProgress, setUploadProgress] = useState(0);
  const [statusMessage, setStatusMessage] = useState('');
  
  const router = useRouter();
  
  // Add new state variables for dynamic attributes
  const [bodyTypeOptions, setBodyTypeOptions] = useState<{name: string, value: string}[]>([]);
  const [fuelTypeOptions, setFuelTypeOptions] = useState<{name: string, value: string}[]>([]);
  const [transmissionOptions, setTransmissionOptions] = useState<{name: string, value: string}[]>([]);
  const [driveTypeOptions, setDriveTypeOptions] = useState<{name: string, value: string}[]>([]);
  const [featureOptions, setFeatureOptions] = useState<{name: string, value: string}[]>([]);
  
  // Common car features for quick selection
  const commonFeatures = [
    'Air Conditioning', 'Bluetooth', 'Cruise Control', 'Navigation System',
    'Leather Seats', 'Sunroof', 'Backup Camera', 'Parking Sensors',
    'Heated Seats', 'Power Windows', 'Alloy Wheels', 'Keyless Entry'
  ];
  
  // Body types
  const bodyTypes = [
    'Sedan', 'SUV', 'Coupe', 'Convertible', 'Hatchback', 'Wagon',
    'Van', 'Minivan', 'Pickup Truck', 'Crossover'
  ];
  
  // Fuel types
  const fuelTypes = [
    'Gasoline', 'Diesel', 'Electric', 'Hybrid', 'Plug-in Hybrid', 
    'Flex-Fuel', 'Natural Gas', 'Hydrogen'
  ];
  
  // Transmission types
  const transmissionTypes = [
    'Automatic', 'Manual', 'CVT', 'Semi-Automatic', 'Dual-Clutch'
  ];
  
  useEffect(() => {
    // Check if user is authenticated via session API
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/auth/session/edge', {
          method: 'GET',
          credentials: 'include'
        });
        
        if (!response.ok) {
          throw new Error('Authentication failed');
        }
        
        const data = await response.json();
        
        if (!data.success || !data.user || data.user.role !== 'admin') {
          throw new Error('Admin access required');
        }
        
        setIsLoading(false);
      } catch (error) {
        console.error('Auth check failed:', error);
        // Redirect to login
        router.push('/admin/login');
      }
    };
    
    checkAuth();
  }, [router]);
  
  // Add new useEffect to fetch attributes
  useEffect(() => {
    // Only fetch attributes if authenticated
    if (!isLoading) {
      const fetchAttributes = async () => {
        try {
          // Fetch all attribute types
          const attributeTypes = ['body', 'fuel', 'transmission', 'drive', 'feature'];
          
          for (const type of attributeTypes) {
            const response = await fetch(`/api/admin/attributes?type=${type}`, {
              method: 'GET',
              credentials: 'include'
            });
            
            if (!response.ok) {
              console.error(`Failed to fetch ${type} attributes`);
              continue;
            }
            
            const data = await response.json();
            
            if (!data.success) {
              console.error(`Error fetching ${type} attributes:`, data.error);
              continue;
            }
            
            // Filter out inactive attributes
            const activeAttributes = data.attributes
              .filter((attr: any) => attr.isActive)
              .map((attr: any) => ({
                name: attr.name,
                value: attr.value
              }));
            
            // Set the appropriate state based on type
            switch (type) {
              case 'body':
                setBodyTypeOptions(activeAttributes);
                break;
              case 'fuel':
                setFuelTypeOptions(activeAttributes);
                break;
              case 'transmission':
                setTransmissionOptions(activeAttributes);
                break;
              case 'drive':
                setDriveTypeOptions(activeAttributes);
                break;
              case 'feature':
                setFeatureOptions(activeAttributes);
                break;
            }
          }
        } catch (error) {
          console.error('Error fetching attributes:', error);
        }
      };
      
      fetchAttributes();
    }
  }, [isLoading]);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  
  const handleFeatureToggle = (feature: string) => {
    setSelectedFeatures((prev) => {
      if (prev.includes(feature)) {
        return prev.filter(f => f !== feature);
      } else {
        return [...prev, feature];
      }
    });
  };
  
  const handleAddFeature = () => {
    if (featuresInput.trim()) {
      setSelectedFeatures((prev) => {
        if (prev.includes(featuresInput)) {
          return prev;
        }
        return [...prev, featuresInput.trim()];
      });
      setFeaturesInput('');
    }
  };
  
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const fileArray = Array.from(e.target.files);
      
      // Create new array with existing and new files
      const newImages = [...images, ...fileArray];
      setImages(newImages);
      
      // Create preview URLs and append to existing previews
      const newPreviewUrls = fileArray.map(file => URL.createObjectURL(file));
      setPreviewUrls(prevUrls => [...prevUrls, ...newPreviewUrls]);
    }
  };
  
  const removeImage = (index: number) => {
    // Adjust main image index if needed
    if (mainImageIndex === index) {
      // If removing the main image, set the first image as main
      setMainImageIndex(images.length > 1 ? 0 : 0);
    } else if (mainImageIndex > index) {
      // If removing an image before the main image, decrement main image index
      setMainImageIndex(mainImageIndex - 1);
    }
    
    // Remove the image and its preview
    setImages(prevImages => prevImages.filter((_, i) => i !== index));
    
    // Revoke the object URL to free memory
    URL.revokeObjectURL(previewUrls[index]);
    setPreviewUrls(prevUrls => prevUrls.filter((_, i) => i !== index));
  };
  
  const handleImagesReordered = (reorderedImages: {id: string, url: string}[]) => {
    // Map back from sortable format to original arrays
    const originalIndices = reorderedImages.map(img => parseInt(img.id.split('-')[1]));
    
    // Reorder the actual images array
    const newImages = originalIndices.map(idx => images[idx]);
    setImages(newImages);
    
    // Reorder the preview URLs
    const newPreviewUrls = originalIndices.map(idx => previewUrls[idx]);
    setPreviewUrls(newPreviewUrls);
  };
  
  const validateForm = () => {
    const errors: Record<string, string> = {};
    
    if (!formData.title) errors.title = 'Title is required';
    if (!formData.make) errors.make = 'Make is required';
    if (!formData.model) errors.model = 'Model is required';
    if (!formData.price) errors.price = 'Price is required';
    if (images.length === 0) errors.images = 'At least one image is required';
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };
  
  // Convert images to base64 strings for API submission
  const convertImagesToBase64 = async () => {
    const base64Promises = images.map(file => {
      return new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = error => reject(error);
      });
    });
    
    return Promise.all(base64Promises);
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    setStatusMessage('Preparing car listing data...');
    setUploadProgress(10);
    
    try {
      // Convert images to base64 for uploading
      setStatusMessage('Processing images...');
      setUploadProgress(20);
      const base64Images = await convertImagesToBase64();
      
      setStatusMessage('Uploading to server...');
      setUploadProgress(40);
      
      // Prepare form data for API submission
      const carListingData = {
        ...formData,
        carFeature: selectedFeatures,
        imageFiles: base64Images, // These will be uploaded to Cloudinary by the API
        mainImageIndex: mainImageIndex // Send the main image index to the server
      };
      
      // Submit to API
      const response = await fetch('/api/admin/cars/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(carListingData),
        credentials: 'include'
      });
      
      setUploadProgress(90);
      
      const responseData = await response.json();
      
      if (!response.ok) {
        throw new Error(responseData.error || 'Failed to add car listing');
      }
      
      // Handle success with potential warning
      if (responseData.warning) {
        setStatusMessage(`Car listing added successfully, but ${responseData.warning.toLowerCase()}`);
      } else {
        setStatusMessage('Car listing added successfully!');
      }
      
      setUploadProgress(100);
      
      // Redirect to car listings page after successful submission
      setTimeout(() => {
        router.push('/admin/cars');
      }, 1500);
    } catch (error: any) {
      console.error('Error submitting form:', error);
      setStatusMessage(`Error: ${error.message || 'Failed to add car listing'}`);
      setUploadProgress(0);
      setIsSubmitting(false);
    }
  };
  
  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-700 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Prepare images for the sortable gallery
  const sortableImages = images.length ? images.map((_, index) => ({
    id: `image-${index}`,
    url: previewUrls[index]
  })) : [];

  return (
    <AdminPanelLayout>
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Add New Car Listing</h1>
          <Link
            href="/admin/cars"
            className="py-2 px-4 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-md transition-colors flex items-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
            Back to Listings
          </Link>
        </div>
        
        {/* Progress bar for form submission */}
        {isSubmitting && (
          <div className="mb-6">
            <div className="bg-gray-100 rounded-full h-4 mb-2">
              <div 
                className="bg-blue-600 h-4 rounded-full transition-all duration-300"
                style={{ width: `${uploadProgress}%` }}
              ></div>
            </div>
            <p className="text-sm text-gray-700">{statusMessage}</p>
          </div>
        )}
        
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <form onSubmit={handleSubmit}>
            <div className="p-6 space-y-6">
              {/* Basic Information */}
              <div>
                <h2 className="text-lg font-semibold mb-4 text-gray-800 border-b pb-2">Basic Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                      Title <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="title"
                      name="title"
                      value={formData.title}
                      onChange={handleChange}
                      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        formErrors.title ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="e.g. BMW X5 2021 Premium"
                    />
                    {formErrors.title && (
                      <p className="mt-1 text-sm text-red-500">{formErrors.title}</p>
                    )}
                  </div>
                  
                  <div>
                    <label htmlFor="make" className="block text-sm font-medium text-gray-700 mb-1">
                      Make <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="make"
                      name="make"
                      value={formData.make}
                      onChange={handleChange}
                      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        formErrors.make ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="e.g. BMW"
                    />
                    {formErrors.make && (
                      <p className="mt-1 text-sm text-red-500">{formErrors.make}</p>
                    )}
                  </div>
                  
                  <div>
                    <label htmlFor="model" className="block text-sm font-medium text-gray-700 mb-1">
                      Model <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="model"
                      name="model"
                      value={formData.model}
                      onChange={handleChange}
                      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        formErrors.model ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="e.g. X5"
                    />
                    {formErrors.model && (
                      <p className="mt-1 text-sm text-red-500">{formErrors.model}</p>
                    )}
                  </div>
                  
                  <div>
                    <label htmlFor="year" className="block text-sm font-medium text-gray-700 mb-1">
                      Year
                    </label>
                    <input
                      type="number"
                      id="year"
                      name="year"
                      value={formData.year}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="e.g. 2021"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
                      Price <span className="text-red-500">*</span>
                    </label>
                    <div className="flex">
                      <select
                        id="priceCurrency"
                        name="priceCurrency"
                        value={formData.priceCurrency}
                        onChange={handleChange}
                        className="px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="USD">$</option>
                        <option value="EUR">€</option>
                        <option value="GBP">£</option>
                      </select>
                      <input
                        type="number"
                        id="price"
                        name="price"
                        value={formData.price}
                        onChange={handleChange}
                        className={`flex-1 px-3 py-2 border-y border-r border-gray-300 rounded-r-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                          formErrors.price ? 'border-red-500' : ''
                        }`}
                        placeholder="e.g. 65000"
                      />
                    </div>
                    {formErrors.price && (
                      <p className="mt-1 text-sm text-red-500">{formErrors.price}</p>
                    )}
                  </div>
                  
                  <div>
                    <label htmlFor="stockNumber" className="block text-sm font-medium text-gray-700 mb-1">
                      Stock Number
                    </label>
                    <input
                      type="text"
                      id="stockNumber"
                      name="stockNumber"
                      value={formData.stockNumber}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="e.g. ST12345"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="offerType" className="block text-sm font-medium text-gray-700 mb-1">
                      Status
                    </label>
                    <select
                      id="offerType"
                      name="offerType"
                      value={formData.offerType}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="In Stock">In Stock</option>
                      <option value="Sold">Sold</option>
                    </select>
                  </div>
                  
                  <div className="space-y-3">
                    <label className="block text-sm font-medium text-gray-700">
                      Category & Visibility
                    </label>
                    
                    <div className="flex items-center">
                      <label htmlFor="section" className="text-sm font-medium text-gray-700 mr-2 w-24">
                        Section:
                      </label>
                      <select
                        id="section"
                        name="section"
                        value={formData.section}
                        onChange={handleChange}
                        className="flex-grow px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="recent">Recent</option>
                        <option value="popular">Popular</option>
                      </select>
                    </div>
                    
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="isFeatured"
                        name="isFeatured"
                        checked={formData.isFeatured}
                        onChange={(e) => {
                          setFormData({
                            ...formData,
                            isFeatured: e.target.checked,
                          });
                        }}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <label htmlFor="isFeatured" className="ml-2 block text-sm text-gray-700">
                        Featured (show in featured section)
                      </label>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Vehicle Details */}
              <div>
                <h2 className="text-lg font-semibold mb-4 text-gray-800 border-b pb-2">Vehicle Details</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label htmlFor="bodyType" className="block text-sm font-medium text-gray-700 mb-1">
                      Body Type
                    </label>
                    <select
                      id="bodyType"
                      name="bodyType"
                      value={formData.bodyType}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select Body Type</option>
                      {bodyTypeOptions.map((type) => (
                        <option key={type.value} value={type.value}>{type.name}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label htmlFor="color" className="block text-sm font-medium text-gray-700 mb-1">
                      Color
                    </label>
                    <input
                      type="text"
                      id="color"
                      name="color"
                      value={formData.color}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="e.g. Black"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="fuelType" className="block text-sm font-medium text-gray-700 mb-1">
                      Fuel Type
                    </label>
                    <select
                      id="fuelType"
                      name="fuelType"
                      value={formData.fuelType}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select Fuel Type</option>
                      {fuelTypeOptions.map((type) => (
                        <option key={type.value} value={type.value}>{type.name}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label htmlFor="vehicleTransmission" className="block text-sm font-medium text-gray-700 mb-1">
                      Transmission
                    </label>
                    <select
                      id="vehicleTransmission"
                      name="vehicleTransmission"
                      value={formData.vehicleTransmission}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select Transmission</option>
                      {transmissionOptions.map((type) => (
                        <option key={type.value} value={type.value}>{type.name}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label htmlFor="mileage" className="block text-sm font-medium text-gray-700 mb-1">
                      Mileage
                    </label>
                    <div className="flex">
                      <input
                        type="number"
                        id="mileage"
                        name="mileage"
                        value={formData.mileage}
                        onChange={handleChange}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="e.g. 15000"
                      />
                      <select
                        id="mileageUnit"
                        name="mileageUnit"
                        value={formData.mileageUnit}
                        onChange={handleChange}
                        className="px-3 py-2 border border-gray-300 rounded-r-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="km">km</option>
                        <option value="mi">mi</option>
                      </select>
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="vehicleSeatingCapacity" className="block text-sm font-medium text-gray-700 mb-1">
                      Seating Capacity
                    </label>
                    <input
                      type="number"
                      id="vehicleSeatingCapacity"
                      name="vehicleSeatingCapacity"
                      value={formData.vehicleSeatingCapacity}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="e.g. 5"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="driveType" className="block text-sm font-medium text-gray-700 mb-1">
                      Drive Type
                    </label>
                    <select
                      id="driveType"
                      name="driveType"
                      value={formData.driveType}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select Drive Type</option>
                      {driveTypeOptions.map((type) => (
                        <option key={type.value} value={type.value}>{type.name}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label htmlFor="vin" className="block text-sm font-medium text-gray-700 mb-1">
                      VIN
                    </label>
                    <input
                      type="text"
                      id="vin"
                      name="vin"
                      value={formData.vin}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Vehicle Identification Number"
                    />
                  </div>
                </div>
              </div>
              
              {/* Description */}
              <div>
                <h2 className="text-lg font-semibold mb-4 text-gray-800 border-b pb-2">Description</h2>
                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows={5}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter a detailed description of the vehicle..."
                  ></textarea>
                </div>
              </div>
              
              {/* Features */}
              <div>
                <h2 className="text-lg font-semibold mb-4 text-gray-800 border-b pb-2">Features</h2>
                <div className="space-y-4">
                  <div className="flex flex-wrap gap-2">
                    {featureOptions.map((feature) => (
                      <button
                        key={feature.value}
                        type="button"
                        onClick={() => handleFeatureToggle(feature.value)}
                        className={`px-3 py-1.5 text-sm rounded-full ${
                          selectedFeatures.includes(feature.value)
                            ? 'bg-blue-100 text-blue-800 border border-blue-300'
                            : 'bg-gray-100 text-gray-800 border border-gray-200 hover:bg-gray-200'
                        }`}
                      >
                        {feature.name}
                      </button>
                    ))}
                  </div>
                  
                  <div className="flex">
                    <input
                      type="text"
                      value={featuresInput}
                      onChange={(e) => setFeaturesInput(e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Add custom feature..."
                    />
                    <button
                      type="button"
                      onClick={handleAddFeature}
                      className="px-4 py-2 bg-blue-600 text-white rounded-r-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      Add
                    </button>
                  </div>
                  
                  {selectedFeatures.length > 0 && (
                    <div className="mt-4">
                      <h3 className="text-sm font-medium text-gray-700 mb-2">Selected Features:</h3>
                      <div className="flex flex-wrap gap-2">
                        {selectedFeatures.map((feature) => (
                          <div
                            key={feature}
                            className="flex items-center bg-blue-50 text-blue-700 px-3 py-1 rounded-full"
                          >
                            <span className="text-sm">{feature}</span>
                            <button
                              type="button"
                              onClick={() => handleFeatureToggle(feature)}
                              className="ml-1.5 text-blue-400 hover:text-blue-600"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                              </svg>
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Images */}
              <div>
                <h2 className="text-lg font-semibold mb-4 text-gray-800 border-b pb-2">
                  Images <span className="text-red-500">*</span>
                </h2>
                
                <div className="space-y-4">
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                    <input
                      type="file"
                      id="images"
                      multiple
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                    <label
                      htmlFor="images"
                      className="cursor-pointer flex flex-col items-center justify-center"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-12 w-12 text-gray-400 mb-2"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                      <p className="text-gray-800 font-medium">Click to upload images</p>
                      <p className="text-gray-500 text-sm mt-1">PNG, JPG, WEBP up to 10MB</p>
                    </label>
                  </div>
                  
                  {formErrors.images && (
                    <p className="text-sm text-red-500">{formErrors.images}</p>
                  )}
                  
                  {sortableImages.length > 0 && (
                    <div>
                      <p className="text-sm text-gray-600 mb-2">
                        <span className="font-medium">Pro Tip:</span> Drag images to reorder. Click the star icon to set the main image.
                      </p>
                      <SortableImageGallery 
                        images={sortableImages}
                        onImagesReordered={handleImagesReordered}
                        onRemoveImage={removeImage}
                        mainImageIndex={mainImageIndex}
                        onSetMainImage={setMainImageIndex}
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            {/* Submit button */}
            <div className="border-t p-6 flex justify-end">
              <button
                type="submit"
                disabled={isSubmitting}
                className={`py-2 px-6 rounded-md ${
                  isSubmitting
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-blue-600 hover:bg-blue-700'
                } text-white font-medium flex items-center`}
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </>
                ) : (
                  'Add Car Listing'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </AdminPanelLayout>
  );
} 