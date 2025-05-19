'use client';

import Link from "next/link";
import { motion } from "framer-motion";

export default function CallToActionSection() {
  return (
    <section className="relative py-24 overflow-hidden">
      {/* Background with gradient and pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-blue-700 to-blue-900">
        <div className="absolute inset-0 bg-grid-white/[0.05] bg-[length:16px_16px]" />
          </div>
      
      {/* Decorative circles */}
      <div className="absolute top-0 left-0 w-72 h-72 bg-blue-500 rounded-full filter blur-3xl opacity-20 -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-400 rounded-full filter blur-3xl opacity-20 translate-x-1/2 translate-y-1/2" />

      <div className="container relative mx-auto px-4">
        <motion.div 
          className="max-w-4xl mx-auto text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <motion.h2 
            className="text-4xl md:text-5xl font-bold mb-6 text-white"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Ready to Find Your Perfect Car?
          </motion.h2>
          
          <motion.p 
            className="text-xl text-blue-100 mb-12 leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            Experience luxury and performance like never before. Our expert team is ready to help you discover your dream vehicle from our premium collection.
          </motion.p>

          <motion.div 
            className="flex flex-col sm:flex-row gap-6 justify-center items-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
            <Link 
              href="/cars" 
                className="group relative inline-flex items-center justify-center bg-white px-8 py-4 rounded-xl text-blue-600 font-bold text-lg shadow-lg transition-all duration-300 hover:shadow-xl hover:bg-blue-50"
              >
                <span className="relative z-10">Browse Inventory</span>
                <div className="absolute inset-0 -z-10 bg-gradient-to-r from-blue-100 to-white rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute inset-0 -z-20 bg-gradient-to-r from-blue-200 to-blue-100 rounded-xl opacity-0 group-hover:opacity-50 blur-xl transition-opacity duration-300" />
              </Link>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
            <Link 
              href="/contact" 
                className="group relative inline-flex items-center justify-center px-8 py-4 rounded-xl text-white font-bold text-lg transition-all duration-300"
            >
                <span className="relative z-10">Contact Us</span>
                <div className="absolute inset-0 border-2 border-white rounded-xl group-hover:border-opacity-50 transition-all duration-300" />
                <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 rounded-xl transition-opacity duration-300" />
            </Link>
            </motion.div>
          </motion.div>
        </motion.div>
        
        {/* Decorative elements */}
        <div className="absolute top-1/2 left-0 w-32 h-32 bg-gradient-to-r from-blue-400 to-transparent opacity-20 blur-2xl -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute top-1/2 right-0 w-32 h-32 bg-gradient-to-l from-blue-400 to-transparent opacity-20 blur-2xl translate-x-1/2 -translate-y-1/2" />
      </div>
    </section>
  );
} 