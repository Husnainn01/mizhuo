'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import { ChevronDownIcon } from '@heroicons/react/24/outline';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

interface FAQItem {
  question: string;
  answer: string;
}

const faqs: FAQItem[] = [
  {
    question: "What types of cars do you offer?",
    answer: "We offer a wide range of premium vehicles, including luxury sedans, SUVs, sports cars, and electric vehicles. Our inventory includes both new and certified pre-owned vehicles from top manufacturers."
  },
  {
    question: "How can I schedule a test drive?",
    answer: "You can schedule a test drive by contacting us through our website, calling us directly, or visiting our showroom. We'll arrange a convenient time for you to experience your chosen vehicle."
  },
  {
    question: "Do you offer financing options?",
    answer: "Yes, we offer various financing options to suit your needs. Our financial experts will work with you to find the best rates and terms. We also accept trade-ins to help reduce your purchase cost."
  },
  {
    question: "What is your warranty coverage?",
    answer: "Our new vehicles come with manufacturer warranties, and certified pre-owned vehicles include extended warranty coverage. We also offer additional warranty options for extra peace of mind."
  },
  {
    question: "How does the buying process work?",
    answer: "Our buying process is simple: Browse our inventory, select your vehicle, arrange financing if needed, and complete the paperwork. We'll handle all the details to make your purchase smooth and enjoyable."
  },
  {
    question: "Do you offer vehicle delivery?",
    answer: "Yes, we offer vehicle delivery services. Once your purchase is complete, we can arrange to have your vehicle delivered to your specified location, making the process convenient for you."
  },
  {
    question: "What documents do I need to buy a car?",
    answer: "You'll need a valid driver's license, proof of insurance, proof of income, and proof of residence. For financing, additional documents may be required. Contact us for a complete list based on your situation."
  },
  {
    question: "Can I get a vehicle history report?",
    answer: "Yes, we provide detailed vehicle history reports for all our pre-owned vehicles. These reports include accident history, service records, and ownership details for complete transparency."
  }
];

const FAQAccordion = ({ item, isOpen, onToggle }: { 
  item: FAQItem; 
  isOpen: boolean; 
  onToggle: () => void;
}) => {
  return (
    <motion.div 
      initial={false}
      className="border-b border-gray-200 last:border-0"
    >
      <button
        className="flex justify-between items-center w-full py-6 text-left"
        onClick={onToggle}
      >
        <span className="text-lg font-semibold text-gray-900">{item.question}</span>
        <ChevronDownIcon 
          className={`w-5 h-5 text-gray-500 transition-transform duration-300 ${
            isOpen ? 'transform rotate-180' : ''
          }`}
        />
      </button>
      <motion.div
        initial={{ height: 0, opacity: 0 }}
        animate={{
          height: isOpen ? 'auto' : 0,
          opacity: isOpen ? 1 : 0
        }}
        transition={{ duration: 0.3 }}
        className="overflow-hidden"
      >
        <p className="pb-6 text-gray-600 leading-relaxed">
          {item.answer}
        </p>
      </motion.div>
    </motion.div>
  );
};

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 py-16 px-4">
      <motion.div 
        className="max-w-3xl mx-auto"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div 
          className="text-center mb-12"
          variants={itemVariants}
        >
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
            Frequently Asked Questions
          </h1>
          <p className="text-gray-600 text-lg">
            Find answers to common questions about our services and car buying process.
          </p>
        </motion.div>

        <motion.div 
          className="bg-white rounded-2xl shadow-lg p-6 md:p-8"
          variants={itemVariants}
        >
          {faqs.map((faq, index) => (
            <FAQAccordion
              key={index}
              item={faq}
              isOpen={openIndex === index}
              onToggle={() => setOpenIndex(openIndex === index ? null : index)}
            />
          ))}
        </motion.div>

        <motion.div 
          className="mt-12 text-center"
          variants={itemVariants}
        >
          <p className="text-gray-600 mb-4">
            Still have questions? We're here to help!
          </p>
          <a
            href="/contact"
            className="inline-block bg-gradient-to-r from-blue-600 to-blue-800 text-white px-8 py-3 rounded-lg font-medium transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
          >
            Contact Us
          </a>
        </motion.div>
      </motion.div>
    </div>
  );
} 