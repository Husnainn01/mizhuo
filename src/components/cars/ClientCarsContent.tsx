'use client';

import SearchFilters from '@/components/cars/SearchFilters';
import CarGrid from '@/components/cars/CarGrid';
import PageTemplate from '@/components/PageTemplate';
import { motion } from 'framer-motion';

export default function ClientCarsContent() {
  // Animation variants
  const pageVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.5
      }
    }
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={pageVariants}
    >
      <PageTemplate
        title="Car Inventory"
        subtitle="Browse our selection of premium vehicles"
        breadcrumbTitle="Car Inventory"
      >
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Search and Filters Section */}
          <motion.div 
            className="w-full lg:w-1/4"
            variants={itemVariants}
          >
            <SearchFilters />
          </motion.div>
          
          {/* Car Listings */}
          <motion.div 
            className="w-full lg:w-3/4"
            variants={itemVariants}
          >
            <CarGrid />
          </motion.div>
        </div>
      </PageTemplate>
    </motion.div>
  );
} 