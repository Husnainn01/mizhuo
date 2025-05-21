'use client';

import HeroSection from "@/components/HeroSection";
import FeaturedCarsSection from "@/components/FeaturedCarsSection";
import ServicesSection from "@/components/ServicesSection";
import HowToBuySection from "@/components/HowToBuySection";
import CallToActionSection from "@/components/CallToActionSection";

export default function HomeContent() {
  return (
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
  );
} 