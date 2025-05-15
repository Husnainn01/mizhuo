import CarCard from './CarCard';

// Mock car data
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
    image: '/cars/car1.jpg',
    features: ['Bluetooth', 'Backup Camera', 'Navigation'],
    bodyType: 'Sedan',
    condition: 'New'
  },
  {
    id: 2,
    make: 'Honda',
    model: 'Accord',
    year: 2022,
    price: 30900,
    mileage: 12050,
    fuelType: 'Gasoline',
    transmission: 'Automatic',
    image: '/cars/car2.jpg',
    features: ['Bluetooth', 'Backup Camera', 'Heated Seats'],
    bodyType: 'Sedan',
    condition: 'Used'
  },
  {
    id: 3,
    make: 'Ford',
    model: 'F-150',
    year: 2023,
    price: 45750,
    mileage: 0,
    fuelType: 'Gasoline',
    transmission: 'Automatic',
    image: '/cars/car3.jpg',
    features: ['Bluetooth', 'Navigation', 'Backup Camera'],
    bodyType: 'Truck',
    condition: 'New'
  },
  {
    id: 4,
    make: 'BMW',
    model: '3 Series',
    year: 2022,
    price: 48250,
    mileage: 8500,
    fuelType: 'Gasoline',
    transmission: 'Automatic',
    image: '/cars/car4.jpg',
    features: ['Leather Seats', 'Sunroof', 'Navigation'],
    bodyType: 'Sedan',
    condition: 'Used'
  },
  {
    id: 5,
    make: 'Mercedes-Benz',
    model: 'GLC',
    year: 2023,
    price: 58795,
    mileage: 0,
    fuelType: 'Gasoline',
    transmission: 'Automatic',
    image: '/cars/car5.jpg',
    features: ['Leather Seats', 'Sunroof', 'Navigation'],
    bodyType: 'SUV',
    condition: 'New'
  },
  {
    id: 6,
    make: 'Tesla',
    model: 'Model 3',
    year: 2023,
    price: 49900,
    mileage: 120,
    fuelType: 'Electric',
    transmission: 'Automatic',
    image: '/cars/car6.jpg',
    features: ['Autopilot', 'Navigation', 'Heated Seats'],
    bodyType: 'Sedan',
    condition: 'Used'
  },
  {
    id: 7,
    make: 'Chevrolet',
    model: 'Tahoe',
    year: 2022,
    price: 54200,
    mileage: 15680,
    fuelType: 'Gasoline',
    transmission: 'Automatic',
    image: '/cars/car7.jpg',
    features: ['Third Row Seating', 'Backup Camera', 'Heated Seats'],
    bodyType: 'SUV',
    condition: 'Used'
  },
  {
    id: 8,
    make: 'Audi',
    model: 'Q5',
    year: 2023,
    price: 55300,
    mileage: 0,
    fuelType: 'Gasoline',
    transmission: 'Automatic',
    image: '/cars/car8.jpg',
    features: ['Leather Seats', 'Sunroof', 'Navigation'],
    bodyType: 'SUV',
    condition: 'New'
  },
  {
    id: 9,
    make: 'Nissan',
    model: 'Altima',
    year: 2022,
    price: 28500,
    mileage: 18750,
    fuelType: 'Gasoline',
    transmission: 'Automatic',
    image: '/cars/car9.jpg',
    features: ['Bluetooth', 'Backup Camera', 'Apple CarPlay'],
    bodyType: 'Sedan',
    condition: 'Used'
  },
];

const CarGrid = () => {
  return (
    <div>
      {/* Grid for larger screens, list for mobile */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {cars.map((car) => (
          <CarCard key={car.id} car={car} />
        ))}
      </div>
      
      {/* Pagination */}
      <div className="mt-8 flex justify-center">
        <nav className="flex items-center space-x-1">
          <button className="px-3 py-1 rounded border border-black/10 text-black/70 hover:bg-blue-50">
            &laquo;
          </button>
          <button className="px-3 py-1 rounded border border-red-600 bg-red-600 text-white">
            1
          </button>
          <button className="px-3 py-1 rounded border border-black/10 text-black/70 hover:bg-blue-50">
            2
          </button>
          <button className="px-3 py-1 rounded border border-black/10 text-black/70 hover:bg-blue-50">
            3
          </button>
          <button className="px-3 py-1 rounded border border-black/10 text-black/70 hover:bg-blue-50">
            &raquo;
          </button>
        </nav>
      </div>
    </div>
  );
};

export default CarGrid; 