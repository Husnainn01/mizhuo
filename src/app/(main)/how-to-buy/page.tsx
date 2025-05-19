'use client';

import { motion } from 'framer-motion';
import PageTemplate from '@/components/PageTemplate';
import Link from 'next/link';
import Image from 'next/image';

// Animation variants
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
  hidden: { y: 50, opacity: 0 },
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

export default function HowToBuyPage() {
  return (
    <PageTemplate
      showBreadcrumb={true}
      customBreadcrumbs={[
        { label: 'Home', href: '/' },
        { label: 'How to Buy', href: '/how-to-buy' }
      ]}
    >
      {/* Hero Section */}
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

      {/* Buying Steps Section */}
      <section id="buying-steps" className="bg-white py-20">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-4xl text-center">
            <h2 className="mb-6 text-3xl font-bold text-gray-900 md:text-4xl">
              How to Buy Your Dream Car in{' '}
              <span className="text-blue-600">Simple Steps</span>
            </h2>
            <p className="mb-16 text-lg text-gray-600">
              We've made the buying process as smooth and straightforward as possible. Follow these steps to find and purchase your perfect vehicle.
            </p>
          </div>

          <motion.div 
            className="mx-auto max-w-5xl"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
          >
            {/* Step 1 */}
            <motion.div 
              variants={itemVariants}
              className="mb-20 flex flex-col items-center md:flex-row"
            >
              <div className="mb-8 flex h-16 w-16 items-center justify-center rounded-full bg-blue-600 text-2xl font-bold text-white md:mb-0 md:mr-8">
                1
              </div>
              <div className="flex-1">
                <h3 className="mb-4 text-2xl font-bold text-gray-900">Browse Our Inventory</h3>
                <p className="mb-6 text-gray-600">
                  Start by exploring our extensive collection of premium vehicles online. You can browse through our catalog
                  to see high-quality images and detailed information about each vehicle. Use our filters to narrow down your
                  search based on make, model, year, price range, and other specifications to find cars that match your preferences.
                </p>
                <Link 
                  href="/cars" 
                  className="group inline-flex items-center text-blue-600 transition hover:text-blue-800"
                >
                  Browse Cars
                  <svg 
                    className="ml-2 h-5 w-5 transform transition-transform group-hover:translate-x-1" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                  </svg>
                </Link>
              </div>
            </motion.div>

            {/* Step 2 */}
            <motion.div 
              variants={itemVariants}
              className="mb-20 flex flex-col items-center md:flex-row"
            >
              <div className="mb-8 flex h-16 w-16 items-center justify-center rounded-full bg-blue-600 text-2xl font-bold text-white md:mb-0 md:mr-8">
                2
              </div>
              <div className="flex-1">
                <h3 className="mb-4 text-2xl font-bold text-gray-900">Contact Our Team</h3>
                <p className="mb-6 text-gray-600">
                  Once you've found a vehicle that interests you, reach out to our sales team. You can contact us through the website's 
                  contact form, email, phone, or live chat. Our team will answer all your questions about the vehicle, provide additional 
                  information, and guide you through the next steps of the purchasing process.
                </p>
                <Link 
                  href="/contact" 
                  className="group inline-flex items-center text-blue-600 transition hover:text-blue-800"
                >
                  Contact Us
                  <svg 
                    className="ml-2 h-5 w-5 transform transition-transform group-hover:translate-x-1" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                  </svg>
                </Link>
              </div>
            </motion.div>

            {/* Step 3 */}
            <motion.div 
              variants={itemVariants}
              className="mb-20 flex flex-col items-center md:flex-row"
            >
              <div className="mb-8 flex h-16 w-16 items-center justify-center rounded-full bg-blue-600 text-2xl font-bold text-white md:mb-0 md:mr-8">
                3
              </div>
              <div className="flex-1">
                <h3 className="mb-4 text-2xl font-bold text-gray-900">Complete Payment</h3>
                <p className="mb-6 text-gray-600">
                  We offer multiple secure payment options for your convenience. Our team will guide you through the payment process
                  and help you complete all the necessary paperwork. We handle all documentation including title transfer, 
                  registration, and any export documents required for international shipping, making the process hassle-free.
                </p>
              </div>
            </motion.div>

            {/* Step 4 */}
            <motion.div 
              variants={itemVariants}
              className="mb-10 flex flex-col items-center md:flex-row"
            >
              <div className="mb-8 flex h-16 w-16 items-center justify-center rounded-full bg-blue-600 text-2xl font-bold text-white md:mb-0 md:mr-8">
                4
              </div>
              <div className="flex-1">
                <h3 className="mb-4 text-2xl font-bold text-gray-900">Delivery & Shipping</h3>
                <p className="mb-6 text-gray-600">
                  Once payment is confirmed, we'll arrange for the delivery of your vehicle. We handle all logistics for both domestic and 
                  international shipping, ensuring your car reaches you safely and on time. Our team will keep you updated throughout 
                  the shipping process and provide you with tracking information when available.
                </p>
              </div>
            </motion.div>

            {/* Step 5 */}
            <motion.div 
              variants={itemVariants}
              className="flex flex-col items-center md:flex-row"
            >
              <div className="mb-8 flex h-16 w-16 items-center justify-center rounded-full bg-blue-600 text-2xl font-bold text-white md:mb-0 md:mr-8">
                5
              </div>
              <div className="flex-1">
                <h3 className="mb-4 text-2xl font-bold text-gray-900">Enjoy Your New Car</h3>
                <p className="mb-6 text-gray-600">
                  Receive your car and enjoy your new purchase! Our relationship doesn't end with delivery - we're here to support you
                  with any questions or concerns you may have after receiving your vehicle. We value long-term customer relationships
                  and are committed to ensuring your complete satisfaction with your purchase.
                </p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="bg-gray-50 py-20">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold text-gray-900 md:text-4xl">
              Frequently Asked Questions
            </h2>
            <p className="mx-auto max-w-2xl text-lg text-gray-600">
              Find answers to common questions about our car buying process.
            </p>
          </div>

          <div className="mx-auto max-w-3xl">
            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
              className="space-y-6"
            >
              {/* FAQ Item 1 */}
              <motion.div variants={itemVariants}>
                <details className="group rounded-lg border border-gray-200 bg-white p-6">
                  <summary className="flex cursor-pointer items-center justify-between">
                    <h3 className="text-lg font-medium text-gray-900">Do you ship internationally?</h3>
                    <span className="ml-6 flex h-7 w-7 items-center justify-center rounded-full border border-gray-200 bg-gray-100 text-gray-600 group-open:rotate-180">
                      <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                      </svg>
                    </span>
                  </summary>
                  <div className="mt-3 text-gray-600">
                    <p>Yes, we ship to most countries worldwide. Our team handles all the necessary export documentation and shipping arrangements. Shipping costs and delivery times vary depending on the destination. Contact our team for a specific quote for your location.</p>
                  </div>
                </details>
              </motion.div>

              {/* FAQ Item 2 */}
              <motion.div variants={itemVariants}>
                <details className="group rounded-lg border border-gray-200 bg-white p-6">
                  <summary className="flex cursor-pointer items-center justify-between">
                    <h3 className="text-lg font-medium text-gray-900">What payment methods do you accept?</h3>
                    <span className="ml-6 flex h-7 w-7 items-center justify-center rounded-full border border-gray-200 bg-gray-100 text-gray-600 group-open:rotate-180">
                      <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                      </svg>
                    </span>
                  </summary>
                  <div className="mt-3 text-gray-600">
                    <p>We accept bank transfers, credit cards, and other secure payment methods. For international purchases, we typically recommend bank wire transfers. Our sales team will guide you through the payment process and help you choose the most convenient option for your situation.</p>
                  </div>
                </details>
              </motion.div>

              {/* FAQ Item 3 */}
              <motion.div variants={itemVariants}>
                <details className="group rounded-lg border border-gray-200 bg-white p-6">
                  <summary className="flex cursor-pointer items-center justify-between">
                    <h3 className="text-lg font-medium text-gray-900">Can I get additional information about a specific car?</h3>
                    <span className="ml-6 flex h-7 w-7 items-center justify-center rounded-full border border-gray-200 bg-gray-100 text-gray-600 group-open:rotate-180">
                      <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                      </svg>
                    </span>
                  </summary>
                  <div className="mt-3 text-gray-600">
                    <p>Absolutely! We're happy to provide additional information, photos, or videos of any vehicle in our inventory. Simply contact our sales team with the specific car you're interested in, and we'll gather all the details you need to make an informed decision.</p>
                  </div>
                </details>
              </motion.div>

              {/* FAQ Item 4 */}
              <motion.div variants={itemVariants}>
                <details className="group rounded-lg border border-gray-200 bg-white p-6">
                  <summary className="flex cursor-pointer items-center justify-between">
                    <h3 className="text-lg font-medium text-gray-900">Do you offer financing options?</h3>
                    <span className="ml-6 flex h-7 w-7 items-center justify-center rounded-full border border-gray-200 bg-gray-100 text-gray-600 group-open:rotate-180">
                      <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                      </svg>
                    </span>
                  </summary>
                  <div className="mt-3 text-gray-600">
                    <p>We don't directly offer financing, but we can recommend trusted financial partners who specialize in auto loans. These partners often have competitive rates and flexible terms. Our team can help facilitate the connection and provide any documentation needed for the loan application process.</p>
                  </div>
                </details>
              </motion.div>

              {/* FAQ Item 5 */}
              <motion.div variants={itemVariants}>
                <details className="group rounded-lg border border-gray-200 bg-white p-6">
                  <summary className="flex cursor-pointer items-center justify-between">
                    <h3 className="text-lg font-medium text-gray-900">What documentation will I receive with my purchase?</h3>
                    <span className="ml-6 flex h-7 w-7 items-center justify-center rounded-full border border-gray-200 bg-gray-100 text-gray-600 group-open:rotate-180">
                      <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                      </svg>
                    </span>
                  </summary>
                  <div className="mt-3 text-gray-600">
                    <p>With your purchase, you'll receive the vehicle title, purchase agreement, and any service records available for the vehicle. For international purchases, we also provide all necessary export documentation, including the export certificate and shipping documents.</p>
                  </div>
                </details>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-blue-700 to-blue-900 py-24">
        {/* Background Pattern */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute h-full w-full">
            {/* Animated circles */}
            <motion.div
              initial={{ opacity: 0.3 }}
              animate={{ opacity: [0.3, 0.5, 0.3] }}
              transition={{ duration: 4, repeat: Infinity }}
              className="absolute -left-10 -top-10 h-40 w-40 rounded-full bg-white/10 blur-2xl"
            />
            <motion.div
              initial={{ opacity: 0.3 }}
              animate={{ opacity: [0.3, 0.5, 0.3] }}
              transition={{ duration: 4, delay: 1, repeat: Infinity }}
              className="absolute right-1/4 top-1/3 h-48 w-48 rounded-full bg-white/10 blur-2xl"
            />
            <motion.div
              initial={{ opacity: 0.3 }}
              animate={{ opacity: [0.3, 0.5, 0.3] }}
              transition={{ duration: 4, delay: 2, repeat: Infinity }}
              className="absolute -bottom-20 right-0 h-40 w-40 rounded-full bg-white/10 blur-2xl"
            />
          </div>
          {/* Grid pattern */}
          <div 
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage: 'linear-gradient(90deg, white 1px, transparent 1px), linear-gradient(white 1px, transparent 1px)',
              backgroundSize: '40px 40px'
            }}
          />
        </div>

        <div className="container relative mx-auto px-4">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h2 className="relative mb-6 text-4xl font-bold text-white md:text-5xl">
              Ready to Find Your{' '}
              <span className="relative">
                Dream Car?
                <motion.svg
                  width="100%"
                  height="8"
                  viewBox="0 0 100 8"
                  className="absolute -bottom-2 left-0 w-full"
                  initial={{ pathLength: 0 }}
                  whileInView={{ pathLength: 1 }}
                  viewport={{ once: true }}
                >
                  <motion.path
                    d="M0 4C20 4 25 4 45 4C65 4 70 4 100 4"
                    stroke="#FF6B6B"
                    strokeWidth="4"
                    fill="none"
                    className="wavy-line"
                  />
                </motion.svg>
              </span>
            </h2>
            <p className="mx-auto mb-12 max-w-2xl text-lg text-white/90">
              Your perfect vehicle is just a few clicks away. Browse our extensive inventory 
              or reach out to our expert team for personalized assistance.
            </p>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, duration: 0.8 }}
              className="flex flex-col items-center justify-center space-y-4 sm:flex-row sm:space-x-6 sm:space-y-0"
            >
              <Link 
                href="/cars" 
                className="group relative inline-flex items-center justify-center overflow-hidden rounded-xl bg-white px-8 py-4 text-lg font-semibold text-blue-600 transition duration-300 ease-out hover:scale-105"
              >
                <span className="absolute inset-0 h-full w-full bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                <span className="relative flex items-center transition-colors duration-300 group-hover:text-white">
                  Browse Inventory
                  <svg
                    className="ml-2 h-5 w-5 transform transition-transform duration-300 group-hover:translate-x-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </span>
              </Link>
              
              <Link 
                href="/contact" 
                className="group relative inline-flex items-center justify-center overflow-hidden rounded-xl border-2 border-white px-8 py-4 text-lg font-semibold text-white transition duration-300 ease-out hover:scale-105"
              >
                <span className="absolute inset-0 h-full w-full bg-white opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                <span className="relative flex items-center transition-colors duration-300 group-hover:text-blue-600">
                  Contact Us
                  <svg
                    className="ml-2 h-5 w-5 transform transition-transform duration-300 group-hover:translate-x-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </span>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </PageTemplate>
  );
} 