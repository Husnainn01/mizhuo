import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import InfoBar from "@/components/InfoBar";
import ScrollToTop from "@/components/ScrollToTop";

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <InfoBar />
      <div className="flex flex-col min-h-screen w-full bg-white">
        <Navigation />
        <main className="flex-grow w-full">
          {children}
        </main>
        <Footer />
      </div>
      <ScrollToTop />
    </>
  );
} 