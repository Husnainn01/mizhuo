import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import InfoBar from "@/components/InfoBar";
import { Inter } from "next/font/google";

// Using Inter font but not applying it directly for more flexibility
const inter = Inter({ subsets: ["latin"] });

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen w-full bg-white">
      <InfoBar />
      <Navigation />
      <main className="flex-grow w-full">
        {children}
      </main>
      <Footer />
    </div>
  );
}