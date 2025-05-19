'use client';

import { motion } from 'framer-motion';

export default function HowToBuyHero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-blue-50 to-white py-20 lg:py-32">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -right-10 top-0 h-64 w-64 rounded-full bg-blue-100/50 blur-3xl"></div>
        <div className="absolute -left-10 bottom-0 h-64 w-64 rounded-full bg-red-100/50 blur-3xl"></div>
      </div>

      <div className="container relative mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center"
        >
          <h1 className="mb-6 text-4xl font-bold leading-tight text-gray-900 md:text-5xl lg:text-6xl">
            Your Journey to the{' '}
            <span className="bg-gradient-to-r from-blue-600 to-red-600 bg-clip-text text-transparent">
              Perfect Car
            </span>
          </h1>
          <p className="mx-auto mb-8 max-w-2xl text-lg text-gray-600 md:text-xl">
            We've simplified the car buying process to make your experience smooth and enjoyable. 
            Follow our step-by-step guide to find and purchase your dream car with confidence.
          </p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
          >
            <a
              href="#buying-steps"
              className="inline-flex items-center justify-center rounded-full bg-blue-600 px-8 py-4 text-lg font-medium text-white shadow-lg transition-all duration-300 hover:bg-blue-700 hover:shadow-xl"
            >
              View Buying Steps
              <svg
                className="ml-2 h-5 w-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M19 9l-7 7-7-7"
                ></path>
              </svg>
            </a>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
} 