import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "AutoElite - Premium Car Dealership",
  description: "Find your perfect vehicle at AutoElite, your trusted car dealership with a wide selection of premium cars.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body suppressHydrationWarning className={`${inter.className} bg-white`}>
        <div className="flex flex-col min-h-screen w-full">
          <Navigation />
          <main className="flex-grow w-full">
            {children}
          </main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
