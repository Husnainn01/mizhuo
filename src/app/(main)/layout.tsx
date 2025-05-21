import { Suspense } from "react";
import { Inter } from "next/font/google";
import InfoBar from "@/components/InfoBar";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import ScrollToTop from "@/components/ui/ScrollToTop";

// Using Inter font but not applying it directly for more flexibility
const inter = Inter({ subsets: ["latin"] });

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen w-full bg-white">
      <Suspense fallback={<div className="w-full h-10 bg-gray-800"></div>}>
        <InfoBar />
      </Suspense>
      <Suspense fallback={<div className="w-full h-16 bg-white"></div>}>
        <Navigation />
      </Suspense>
      <main className="flex-grow w-full">
        {children}
      </main>
      <Suspense fallback={<div className="w-full h-64 bg-gray-900"></div>}>
        <Footer />
      </Suspense>
      <ScrollToTop />
    </div>
  );
}