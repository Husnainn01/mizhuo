'use client';

import Link from "next/link";
import { motion } from "framer-motion";

// Animation variants for staggered children
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2
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

export default function HowToBuySection() {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-3">How to Buy Your Dream Car</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            At AutoElite, we've made the car buying process simple and straightforward. Follow these easy steps to drive home in your perfect vehicle.
          </p>
        </div>
        
        <motion.div 
          className="relative"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {/* Timeline line */}
          <div className="hidden md:block absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-blue-100 z-0"></div>
          
          {/* Step 1 */}
          <motion.div variants={itemVariants} className="relative z-10 flex flex-col md:flex-row items-center mb-12">
            <div className="order-1 md:w-5/12 md:text-right md:pr-10">
              <h3 className="text-xl font-bold mb-2 text-blue-700">Browse Our Inventory</h3>
              <p className="text-gray-600">
                Explore our extensive collection of premium vehicles online or visit our showroom to see them in person.
              </p>
            </div>
            <div className="order-2 rounded-full w-12 h-12 bg-blue-600 flex items-center justify-center text-white font-bold my-4 md:my-0 z-10">1</div>
            <div className="order-3 md:w-5/12 md:pl-10">
              <div className="bg-blue-50 p-4 rounded-lg shadow-sm">
                <p className="text-sm text-blue-800">
                  "I found the exact model I was looking for within minutes using their easy search filters!"
                </p>
                <p className="text-xs text-blue-700 mt-2">- Sarah K.</p>
              </div>
            </div>
          </motion.div>
          
          {/* Step 2 */}
          <motion.div variants={itemVariants} className="relative z-10 flex flex-col md:flex-row-reverse items-center mb-12">
            <div className="order-1 md:w-5/12 md:text-left md:pl-10">
              <h3 className="text-xl font-bold mb-2 text-blue-700">Schedule a Test Drive</h3>
              <p className="text-gray-600">
                Experience your selected vehicle firsthand by booking a test drive online or by phone.
              </p>
            </div>
            <div className="order-2 rounded-full w-12 h-12 bg-blue-600 flex items-center justify-center text-white font-bold my-4 md:my-0 z-10">2</div>
            <div className="order-3 md:w-5/12 md:pr-10 md:text-right">
              <div className="bg-blue-50 p-4 rounded-lg shadow-sm">
                <p className="text-sm text-blue-800">
                  "The staff was accommodating and patient during my test drive, answering all my questions."
                </p>
                <p className="text-xs text-blue-700 mt-2">- Michael R.</p>
              </div>
            </div>
          </motion.div>
          
          {/* Step 3 */}
          <motion.div variants={itemVariants} className="relative z-10 flex flex-col md:flex-row items-center mb-12">
            <div className="order-1 md:w-5/12 md:text-right md:pr-10">
              <h3 className="text-xl font-bold mb-2 text-blue-700">Financing Options</h3>
              <p className="text-gray-600">
                Our finance experts will help you find the best payment plan that fits your budget and needs.
              </p>
            </div>
            <div className="order-2 rounded-full w-12 h-12 bg-blue-600 flex items-center justify-center text-white font-bold my-4 md:my-0 z-10">3</div>
            <div className="order-3 md:w-5/12 md:pl-10">
              <div className="bg-blue-50 p-4 rounded-lg shadow-sm">
                <p className="text-sm text-blue-800">
                  "The financing process was smooth and transparent. Got a great interest rate!"
                </p>
                <p className="text-xs text-blue-700 mt-2">- Jennifer T.</p>
              </div>
            </div>
          </motion.div>
          
          {/* Step 4 */}
          <motion.div variants={itemVariants} className="relative z-10 flex flex-col md:flex-row-reverse items-center mb-12">
            <div className="order-1 md:w-5/12 md:text-left md:pl-10">
              <h3 className="text-xl font-bold mb-2 text-blue-700">Complete Your Purchase</h3>
              <p className="text-gray-600">
                Finalize your purchase with our streamlined paperwork process and drive home in your new car.
              </p>
            </div>
            <div className="order-2 rounded-full w-12 h-12 bg-blue-600 flex items-center justify-center text-white font-bold my-4 md:my-0 z-10">4</div>
            <div className="order-3 md:w-5/12 md:pr-10 md:text-right">
              <div className="bg-blue-50 p-4 rounded-lg shadow-sm">
                <p className="text-sm text-blue-800">
                  "From initial contact to driving away, the whole process took just a few hours. So efficient!"
                </p>
                <p className="text-xs text-blue-700 mt-2">- Robert L.</p>
              </div>
            </div>
          </motion.div>
          
          {/* Step 5 */}
          <motion.div variants={itemVariants} className="relative z-10 flex flex-col md:flex-row items-center">
            <div className="order-1 md:w-5/12 md:text-right md:pr-10">
              <h3 className="text-xl font-bold mb-2 text-blue-700">After-Sales Support</h3>
              <p className="text-gray-600">
                Enjoy our comprehensive after-sales service including maintenance, warranty coverage, and more.
              </p>
            </div>
            <div className="order-2 rounded-full w-12 h-12 bg-blue-600 flex items-center justify-center text-white font-bold my-4 md:my-0 z-10">5</div>
            <div className="order-3 md:w-5/12 md:pl-10">
              <div className="bg-blue-50 p-4 rounded-lg shadow-sm">
                <p className="text-sm text-blue-800">
                  "The service department has been fantastic. Regular maintenance is quick and reasonably priced."
                </p>
                <p className="text-xs text-blue-700 mt-2">- Emily W.</p>
              </div>
            </div>
          </motion.div>
        </motion.div>
        
        {/* CTA Button */}
        <div className="text-center mt-12">
          <Link 
            href="/cars" 
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-md font-medium transition-colors"
          >
            Start Your Car Buying Journey
          </Link>
        </div>
      </div>
    </section>
  );
} 