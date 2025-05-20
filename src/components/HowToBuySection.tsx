'use client';

import Link from "next/link";
import { motion } from "framer-motion";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15
    }
  }
};

// Item animation variants
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

export default function HowToBuySection(): React.ReactElement {
  return (
    <section className="py-20 bg-gradient-to-b from-white to-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
            How to Buy Your Dream Car
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg">
            At AutoElite, we&apos;ve made the car buying process simple and straightforward. Follow these easy steps to drive home in your perfect vehicle.
          </p>
        </div>
        
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {/* Step 1 */}
          <motion.div 
            variants={itemVariants}
            className="group bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-24 h-24 bg-blue-50 rounded-bl-full transform translate-x-8 -translate-y-8 group-hover:bg-blue-100 transition-colors duration-300"></div>
            <div className="relative z-10">
              <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold mb-4 group-hover:scale-110 transition-transform duration-300">
                1
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-800">Check Our Inventory</h3>
              <p className="text-gray-600">
                Browse our extensive collection of premium vehicles online. Use our smart filters to find your perfect match.
              </p>
            </div>
          </motion.div>

          {/* Step 2 */}
          <motion.div 
            variants={itemVariants}
            className="group bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-24 h-24 bg-blue-50 rounded-bl-full transform translate-x-8 -translate-y-8 group-hover:bg-blue-100 transition-colors duration-300"></div>
            <div className="relative z-10">
              <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold mb-4 group-hover:scale-110 transition-transform duration-300">
                2
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-800">Select Your Car</h3>
              <p className="text-gray-600">
                Choose your dream vehicle with detailed specifications and high-quality photos to make an informed decision.
              </p>
            </div>
          </motion.div>

          {/* Step 3 */}
          <motion.div 
            variants={itemVariants}
            className="group bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-24 h-24 bg-blue-50 rounded-bl-full transform translate-x-8 -translate-y-8 group-hover:bg-blue-100 transition-colors duration-300"></div>
            <div className="relative z-10">
              <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold mb-4 group-hover:scale-110 transition-transform duration-300">
                3
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-800">Contact Us</h3>
              <p className="text-gray-600">
                Reach out to our team through multiple channels. We&apos;ll handle all payment and documentation details.
              </p>
            </div>
          </motion.div>

          {/* Step 4 */}
          <motion.div 
            variants={itemVariants}
            className="group bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-24 h-24 bg-blue-50 rounded-bl-full transform translate-x-8 -translate-y-8 group-hover:bg-blue-100 transition-colors duration-300"></div>
            <div className="relative z-10">
              <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold mb-4 group-hover:scale-110 transition-transform duration-300">
                4
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-800">We Ship Your Car</h3>
              <p className="text-gray-600">
                Enjoy stress-free delivery as we handle all logistics and ensure your car arrives safely at your location.
              </p>
            </div>
          </motion.div>
        </motion.div>
        
        {/* CTA Button */}
        <div className="text-center mt-16">
          <Link 
            href="/cars" 
            className="inline-block bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900 text-white px-8 py-4 rounded-lg font-medium transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
          >
            Start Your Car Buying Journey
          </Link>
        </div>
      </div>
    </section>
  );
} 