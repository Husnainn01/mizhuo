import { Suspense } from 'react';
import HomeContent from '@/components/home/HomeContent';
import InfoBar from "@/components/InfoBar";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import ScrollToTop from "@/components/ui/ScrollToTop";

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

// Display home content directly with layout instead of redirecting
export default function RootPage() {
  return (
    <div className="flex flex-col min-h-screen w-full bg-white">
      <Suspense fallback={<div className="w-full h-10 bg-gray-800"></div>}>
        <InfoBar />
      </Suspense>
      <Suspense fallback={<div className="w-full h-16 bg-white"></div>}>
        <Navigation />
      </Suspense>
      <main className="flex-grow w-full">
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
          <HomeContent />
        </Suspense>
      </main>
      <Suspense fallback={<div className="w-full h-64 bg-gray-900"></div>}>
        <Footer />
      </Suspense>
      <ScrollToTop />
    </div>
  );
}
