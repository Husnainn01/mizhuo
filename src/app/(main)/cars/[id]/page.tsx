// import Image from 'next/image';
import Link from 'next/link';
import { Metadata } from 'next';
import ContactForm from '@/components/cars/ContactForm';
import PageTemplate from '@/components/PageTemplate';
import CarImageGallery from '@/components/cars/CarImageGallery';
import connectDB from '@/lib/mongodb';
import CarListing from '@/models/Car';

export const metadata: Metadata = {
  title: 'Car Details | AutoElite',
  description: 'View detailed information about this vehicle including specifications, features, and pricing.',
};

// Fetch car from database
const getCar = async (id: string) => {
  try {
    await connectDB();
    const car = await CarListing.findById(id);
    return car ? JSON.parse(JSON.stringify(car)) : null;
  } catch (error) {
    console.error('Error fetching car details:', error);
    return null;
  }
};

export default async function CarDetailsPage({ params }: { params: { id: string } }) {
  // Await the params object to ensure it's resolved before use
  const resolvedParams = await Promise.resolve(params);
  const car = await getCar(resolvedParams.id);
  
  if (!car) {
    return (
      <PageTemplate
        showBreadcrumb={true}
        customBreadcrumbs={[
          { label: 'Home', href: '/' },
          { label: 'Cars', href: '/cars' },
          { label: 'Not Found', href: '#' }
        ]}
      >
        <div className="text-center py-16 px-4">
          <div className="mb-8">
            <div className="inline-block p-4 bg-red-50 rounded-full mb-6">
              <svg className="w-16 h-16 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
            <h1 className="text-3xl font-bold mb-4 text-black">Car Not Found</h1>
            <p className="text-black/70 mb-8 max-w-xl mx-auto">The car you are looking for does not exist or has been removed. Please check the URL or browse our available cars.</p>
          </div>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/cars" className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-md font-medium transition-colors shadow-sm">
              Browse Cars
            </Link>
            <Link href="/contact" className="bg-blue-50 text-blue-600 hover:bg-blue-100 px-6 py-3 rounded-md font-medium transition-colors border border-blue-200">
              Contact Support
            </Link>
          </div>
        </div>
      </PageTemplate>
    );
  }
  
  const customBreadcrumbs = [
    { label: 'Home', href: '/' },
    { label: 'Cars', href: '/cars' },
    { label: `${car.year} ${car.make} ${car.model}`, href: `/cars/${resolvedParams.id}` }
  ];
  
  // Prepare car specifications
  const specs = {
    'Stock Number': car.stockNumber || 'Not specified',
    'Make': car.make || 'Not specified',
    'Model': car.model || 'Not specified',
    'Year': car.year || 'Not specified',
    'Mileage': car.mileage ? `${car.mileage} ${car.mileageUnit || 'KM'}` : 'Not specified',
    'Condition': car.itemCondition || 'Used',
    'Availability': car.offerType || 'In Stock',
    'VIN': car.vin || 'Not specified',
    'Body Type': car.bodyType || 'Not specified',
    'Color': car.color || 'Not specified',
    // 'Drive Wheel': car.driveWheelConfiguration || 'Not specified',
    // 'Doors': car.numberOfDoors || 'Not specified',
    'Fuel Type': car.fuelType || 'Not specified',
    // 'Engine': car.vehicleEngine || 'Not specified',
    'Seating': car.vehicleSeatingCapacity || 'Not specified',
    'Transmission': car.vehicleTransmission || 'Not specified',
    // 'Cylinders': car.cylinders || 'Not specified',
    // 'Country': car.country || 'Not specified',
    // 'Category': car.category || 'Not specified'
  };
  
  // Ensure we have an array of images
  const images = car.images && car.images.length 
    ? car.images 
    : (car.image ? [car.image] : ['/images/car-placeholder.svg']);
  
  return (
    <PageTemplate
      customBreadcrumbs={customBreadcrumbs}
      showBreadcrumb={true}
    >
      {/* Car Title and Price */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-black">{car.year} {car.make} {car.model}</h1>
          <p className="text-black/70">{car.bodyType} • {car.vehicleTransmission} • {car.mileage} miles</p>
        </div>
        <div className="mt-4 md:mt-0">
          <span className="text-3xl font-bold text-red-600">${car.price?.toLocaleString() || 'Call for price'}</span>
        </div>
      </div>
      
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Car Details */}
        <div className="w-full lg:w-2/3">
          {/* Image Gallery */}
          <CarImageGallery 
            images={images} 
            alt={`${car.year} ${car.make} ${car.model}`} 
          />
          
          {/* Tabs for Details */}
          <div className="mb-8">
            <div className="border-b border-black/10">
              <div className="flex overflow-x-auto">
                <button className="px-4 py-2 border-b-2 border-red-600 font-medium text-red-600">Overview</button>
                {/* <button className="px-4 py-2 border-b-2 border-transparent font-medium text-black/70 hover:text-blue-600">Specifications</button>
                <button className="px-4 py-2 border-b-2 border-transparent font-medium text-black/70 hover:text-blue-600">Features</button> */}
              </div>
            </div>
            
            <div className="py-6">
              <h2 className="text-2xl font-bold text-black mb-4">Description</h2>
              <p className="text-black/80 mb-6">{car.description || 'No description available for this vehicle.'}</p>
              
              <h2 className="text-2xl font-bold text-black mb-4">Specifications</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                {Object.entries(specs).map(([key, value]) => (
                  <div key={key} className="flex justify-between p-3 bg-blue-50 rounded">
                    <span className="font-medium text-black">{key}</span>
                    <span className="text-black/80">{value}</span>
                  </div>
                ))}
              </div>
              
              <h2 className="text-2xl font-bold text-black mb-4">Features</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {(car.carFeature || []).map((feature: string) => (
                  <div key={feature} className="flex items-center gap-2">
                    <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-black/80">{feature}</span>
                  </div>
                ))}
                
                {/* If no features are specified, show a message */}
                {(!car.carFeature || car.carFeature.length === 0) && (
                  <div className="col-span-3 text-black/70 italic">No specific features listed for this vehicle.</div>
                )}
              </div>
            </div>
          </div>
        </div>
        
        {/* Contact Form */}
        <div className="w-full lg:w-1/3">
          <div className="bg-white p-6 rounded-md border border-black/10 sticky top-24">
            <h2 className="text-xl font-bold text-black mb-4">Interested in this car?</h2>
            <ContactForm carId={car._id} carName={`${car.year} ${car.make} ${car.model}`} />
          </div>
        </div>
      </div>
      
      {/* We'll replace the Similar Cars section with actual data in a future update */}
    </PageTemplate>
  );
} 