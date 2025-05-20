'use client';

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import ServicesSection from "@/components/ServicesSection";
import HowToBuySection from "@/components/HowToBuySection";
import CallToActionSection from "@/components/CallToActionSection";
import FeaturedCarsSection from "@/components/FeaturedCarsSection";
import HeroSection from "@/components/HeroSection";
import InfoBar from "@/components/InfoBar";

// Animation variants for staggered children
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.3
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

export default function Home() {
  const [showScrollTop, setShowScrollTop] = useState(false);
  
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      if (scrollY > 500) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <>
      <InfoBar />
      <div className="flex flex-col min-h-screen w-full bg-white">
        <Navigation />
        <main className="flex-grow w-full">
          <div className="flex min-h-screen flex-col relative">
            {/* Hero Section */}
            <HeroSection />

            {/* Featured Cars Section */}
            <FeaturedCarsSection />
            
            {/* Services Section */}
            <ServicesSection />
            
            {/* How to Buy Section */}
            <HowToBuySection />
            
            {/* Call to Action Section */}
            <CallToActionSection />
          </div>
        </main>
        <Footer />
      </div>

      {/* Back to Top Button */}
      <motion.button
        onClick={scrollToTop}
        className="fixed bottom-6 right-6 z-[9999] bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white p-3 rounded-full shadow-lg transition-all hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-blue-400 group"
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ 
          opacity: showScrollTop ? 1 : 0,
          scale: showScrollTop ? 1 : 0.5,
          y: showScrollTop ? 0 : 20
        }}
        transition={{ duration: 0.3 }}
        aria-label="Scroll to top"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 transform group-hover:-translate-y-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
        </svg>
        <span className="absolute w-full text-center text-xs font-medium -bottom-6 left-0 opacity-0 group-hover:opacity-100 transition-opacity">TOP</span>
      </motion.button>
    </>
  );
}
