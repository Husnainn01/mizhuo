import { Metadata } from 'next';
import SearchFilters from '@/components/cars/SearchFilters';
import CarGrid from '@/components/cars/CarGrid';
import PageTemplate from '@/components/PageTemplate';

export const metadata: Metadata = {
  title: 'Browse Our Cars | AutoElite',
  description: 'Explore our extensive inventory of premium vehicles. Filter by make, model, price, and more to find your perfect car.',
};

export default function CarsPage() {
  return (
    <PageTemplate
      title="Car Inventory"
      subtitle="Browse our selection of premium vehicles"
      breadcrumbTitle="Car Inventory"
    >
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Search and Filters Section */}
        <div className="w-full lg:w-1/4">
          <SearchFilters />
        </div>
        
        {/* Car Listings */}
        <div className="w-full lg:w-3/4">
          <div className="flex justify-between items-center mb-6">
            <div>
              <p className="text-black/70"><span className="font-bold">120</span> vehicles found</p>
            </div>
            <div className="flex items-center gap-2">
              <label htmlFor="sort" className="text-sm text-black/70">Sort by:</label>
              <select 
                id="sort" 
                className="border border-black/10 rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
              </select>
            </div>
          </div>
          
          <CarGrid />
        </div>
      </div>
    </PageTemplate>
  );
} 