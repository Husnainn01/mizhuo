import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen w-full bg-white">
      <Navigation />
      <main className="flex-grow w-full">
        {children}
      </main>
      <Footer />
    </div>
  );
}