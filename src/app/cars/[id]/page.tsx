import Image from 'next/image';
import Link from 'next/link';
import { Metadata } from 'next';
import ContactForm from '@/components/cars/ContactForm';
import PageTemplate from '@/components/PageTemplate';
import CarImageGallery from '@/components/cars/CarImageGallery';

export const metadata: Metadata = {
  title: 'Car Details | AutoElite',
  description: 'View detailed information about this vehicle including specifications, features, and pricing.',
};

// This would normally come from a database
const getCar = async (id: string) => {
  const cars = [
    {
      id: 1,
      make: 'Toyota',
      model: 'Camry',
      year: 2023,
      price: 32500,
      mileage: 15,
      fuelType: 'Gasoline',
      transmission: 'Automatic',
      images: [
        '/cars/car1.jpg',
        '/cars/car2.jpg',
        '/cars/car3.jpg',
        '/cars/car4.jpg',
        '/cars/car5.jpg'
      ],
      features: ['Bluetooth', 'Backup Camera', 'Navigation', 'Heated Seats', 'Sunroof', 'Leather Interior'],
      bodyType: 'Sedan',
      condition: 'New',
      description: 'Experience the perfect blend of comfort, style, and efficiency with the latest Toyota Camry. This elegant sedan offers exceptional fuel economy, advanced safety features, and a smooth driving experience. The spacious interior and modern technology make it ideal for both daily commutes and long journeys.',
      specs: {
        engine: '2.5L 4-Cylinder',
        horsepower: '203 hp',
        torque: '184 lb-ft',
        mpg: '28 city / 39 highway',
        drivetrain: 'Front-Wheel Drive',
        seats: 5,
        doors: 4,
        color: 'Silver'
      }
    }
  ];
  
  return cars.find(car => car.id === parseInt(id)) || null;
};

export default async function CarDetailsPage({ params }: { params: { id: string } }) {
  const car = await getCar(params.id);
  
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
    { label: `${car.year} ${car.make} ${car.model}`, href: `/cars/${params.id}` }
  ];
  
  return (
    <PageTemplate
      customBreadcrumbs={customBreadcrumbs}
      showBreadcrumb={true}
    >
      {/* Car Title and Price */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-black">{car.year} {car.make} {car.model}</h1>
          <p className="text-black/70">{car.bodyType} • {car.transmission} • {car.mileage} miles</p>
        </div>
        <div className="mt-4 md:mt-0">
          <span className="text-3xl font-bold text-red-600">${car.price.toLocaleString()}</span>
        </div>
      </div>
      
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Car Details */}
        <div className="w-full lg:w-2/3">
          {/* Image Gallery */}
          <CarImageGallery 
            images={car.images} 
            alt={`${car.year} ${car.make} ${car.model}`} 
          />
          
          {/* Tabs for Details */}
          <div className="mb-8">
            <div className="border-b border-black/10">
              <div className="flex overflow-x-auto">
                <button className="px-4 py-2 border-b-2 border-red-600 font-medium text-red-600">Overview</button>
                <button className="px-4 py-2 border-b-2 border-transparent font-medium text-black/70 hover:text-blue-600">Specifications</button>
                <button className="px-4 py-2 border-b-2 border-transparent font-medium text-black/70 hover:text-blue-600">Features</button>
              </div>
            </div>
            
            <div className="py-6">
              <h2 className="text-2xl font-bold text-black mb-4">Description</h2>
              <p className="text-black/80 mb-6">{car.description}</p>
              
              <h2 className="text-2xl font-bold text-black mb-4">Specifications</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                {Object.entries(car.specs).map(([key, value]) => (
                  <div key={key} className="flex justify-between p-3 bg-blue-50 rounded">
                    <span className="font-medium capitalize text-black">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                    <span className="text-black/80">{value}</span>
                  </div>
                ))}
              </div>
              
              <h2 className="text-2xl font-bold text-black mb-4">Features</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {car.features.map(feature => (
                  <div key={feature} className="flex items-center gap-2">
                    <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-black/80">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        
        {/* Contact Form */}
        <div className="w-full lg:w-1/3">
          <div className="bg-white p-6 rounded-md border border-black/10 sticky top-24">
            <h2 className="text-xl font-bold text-black mb-4">Interested in this car?</h2>
            <ContactForm carId={car.id} carName={`${car.year} ${car.make} ${car.model}`} />
          </div>
        </div>
      </div>
      
      {/* Similar Cars */}
      <div className="mt-12">
        <h2 className="text-2xl font-bold text-black mb-6">Similar Vehicles</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* This would be a component with actual similar cars */}
          {[1, 2, 3].map((item) => (
            <div key={item} className="bg-white rounded-md overflow-hidden border border-black/10 hover:shadow-md transition-shadow">
              <Link href={`/cars/${item}`}>
                <div className="relative h-48 w-full">
                  <div className="bg-black/5 h-full w-full" />
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-bold text-black">Similar Car {item}</h3>
                  <p className="text-black/70 text-sm">2023 • Sedan • Automatic</p>
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-xl font-bold text-red-600">$32,500</span>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </PageTemplate>
  );
} 