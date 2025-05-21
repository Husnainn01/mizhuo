'use client';
import Image from "next/image";
import Link from "next/link";
import { FaCar, FaHandshake, FaUsers, FaHistory, FaArrowDown, FaRegStar } from "react-icons/fa";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

const milestones = [
  {
    year: "2003",
    title: "Founded",
    icon: <FaHistory className="h-6 w-6 text-blue-600" />,
    desc: "Mizhuo Limited is founded by passionate car enthusiasts."
  },
  {
    year: "2008",
    title: "First 1,000 Cars Sold",
    icon: <FaCar className="h-6 w-6 text-green-600" />,
    desc: "Reached our first major sales milestone."
  },
  {
    year: "2015",
    title: "Expansion",
    icon: <FaRegStar className="h-6 w-6 text-yellow-500" />,
    desc: "Opened new locations and expanded our team."
  },
  {
    year: "2024",
    title: "Trusted Nationwide",
    icon: <FaHandshake className="h-6 w-6 text-purple-600" />,
    desc: "Recognized as a trusted name in the automotive industry."
  }
];

const stats = [
  { label: "Years in Business", value: 21, icon: <FaHistory className="h-6 w-6 text-blue-600" /> },
  { label: "Cars Sold", value: 12000, icon: <FaCar className="h-6 w-6 text-green-600" /> },
  { label: "Happy Customers", value: 11000, icon: <FaUsers className="h-6 w-6 text-yellow-500" /> }
];

function AnimatedCounter({ value }: { value: number }) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    let start = 0;
    const end = value;
    if (start === end) return;
    const incrementTime = 2000 / end;
    const timer = setInterval(() => {
      start += Math.ceil(end / 100);
      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(start);
      }
    }, incrementTime);
    return () => clearInterval(timer);
  }, [value]);
  return <span>{count.toLocaleString()}</span>;
}

export default function AboutPage() {
  // For scroll indicator animation
  const [showScroll, setShowScroll] = useState(true);
  useEffect(() => {
    const onScroll = () => setShowScroll(window.scrollY < 100);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <main className="flex-grow">
      {/* Hero Section */}
      <section className="relative w-full h-[350px] md:h-[450px] overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="/about-hero.jpg"
            alt="Mizhuo Limited Showroom"
            fill
            className="object-cover"
            priority
          />
          {/* Animated Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-900/60 via-blue-600/40 to-purple-700/40 animate-gradient-move" />
        </div>
        <div className="relative z-10 container mx-auto h-full flex flex-col items-center justify-center">
          <div className="text-center text-white mt-10">
            <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }} className="text-4xl md:text-5xl font-bold mb-4 drop-shadow-lg">
              About Us
            </motion.h1>
            <motion.p initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.7 }} className="text-lg md:text-xl max-w-2xl mx-auto mb-6 drop-shadow">
              Your trusted partner in finding the perfect vehicle since 2003
            </motion.p>
            <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.4, duration: 0.5 }}>
              <Link href="/cars" className="inline-block bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-700 hover:to-purple-800 text-white px-8 py-3 rounded-full font-semibold text-lg shadow-lg transition-transform transform hover:scale-105">
                Browse Cars
              </Link>
            </motion.div>
          </div>
          {/* Scroll Down Indicator */}
          {showScroll && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1, duration: 0.7 }} className="absolute bottom-6 left-1/2 -translate-x-1/2">
              <FaArrowDown className="h-8 w-8 text-white animate-bounce" />
            </motion.div>
          )}
        </div>
      </section>

      {/* Our Story Timeline */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Journey</h2>
              <div className="w-20 h-1 bg-gradient-to-r from-blue-600 to-purple-500 mx-auto mb-6"></div>
              <p className="text-lg text-gray-700">
                From humble beginnings to a nationwide presence, here are our key milestones.
              </p>
            </div>
            <div className="flex flex-col md:flex-row gap-8 items-center justify-center">
              {milestones.map((m, i) => (
                <motion.div
                  key={m.year}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.2, duration: 0.7 }}
                  className="flex flex-col items-center bg-gradient-to-b from-blue-50 to-white rounded-xl shadow-md px-6 py-8 w-64 mb-6 md:mb-0"
                >
                  <div className="mb-3">{m.icon}</div>
                  <div className="text-2xl font-bold text-blue-700 mb-1">{m.year}</div>
                  <div className="text-lg font-semibold mb-2">{m.title}</div>
                  <div className="text-gray-600 text-center">{m.desc}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Company Stats */}
      <section className="py-12 bg-gradient-to-r from-blue-50 via-purple-50 to-blue-100">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
              {stats.map((stat, i) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.2, duration: 0.7 }}
                  className="bg-white rounded-xl shadow-lg py-8 px-4 flex flex-col items-center hover:scale-105 transition-transform"
                >
                  <div className="mb-3">{stat.icon}</div>
                  <div className="text-3xl font-bold text-blue-700 mb-1">
                    <AnimatedCounter value={stat.value} />
                  </div>
                  <div className="text-lg text-gray-700">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Values */}
      <section className="py-16 bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Mission & Values</h2>
              <div className="w-20 h-1 bg-gradient-to-r from-blue-600 to-purple-500 mx-auto mb-6"></div>
              <p className="text-lg text-gray-700">
                Guided by strong principles, we strive to exceed expectations and create lasting relationships with our customers.
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              <motion.div whileHover={{ scale: 1.07 }} className="bg-white p-8 rounded-lg shadow-md text-center transition-transform">
                <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-blue-100 text-blue-600 mb-4">
                  <FaCar className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Quality Selection</h3>
                <p className="text-gray-700">
                  We meticulously select each vehicle in our inventory, ensuring they meet our stringent standards for quality, performance, and value.
                </p>
              </motion.div>
              <motion.div whileHover={{ scale: 1.07 }} className="bg-white p-8 rounded-lg shadow-md text-center transition-transform">
                <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-blue-100 text-blue-600 mb-4">
                  <FaHandshake className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Integrity</h3>
                <p className="text-gray-700">
                  Transparency and honesty are at the core of every interaction. We believe in building trust through ethical business practices.
                </p>
              </motion.div>
              <motion.div whileHover={{ scale: 1.07 }} className="bg-white p-8 rounded-lg shadow-md text-center transition-transform">
                <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-blue-100 text-blue-600 mb-4">
                  <FaUsers className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Customer Focus</h3>
                <p className="text-gray-700">
                  Your satisfaction is our priority. We're dedicated to understanding your needs and helping you find the perfect vehicle.
                </p>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="container mx-auto px-4 text-center">
          <motion.h2 initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }} className="text-3xl font-bold text-white mb-6 drop-shadow-lg">Ready to Find Your Perfect Vehicle?</motion.h2>
          <motion.p initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2, duration: 0.7 }} className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Visit our showroom or browse our inventory online to discover the perfect car for your needs.
          </motion.p>
          <motion.div whileHover={{ scale: 1.08 }} className="inline-block">
            <Link 
              href="/cars" 
              className="bg-white text-blue-600 hover:bg-blue-50 px-8 py-4 rounded-full font-medium text-lg transition-colors shadow-lg"
            >
              Browse Inventory
            </Link>
          </motion.div>
          <motion.div whileHover={{ scale: 1.08 }} className="inline-block ml-4">
            <Link 
              href="/contact" 
              className="bg-transparent border-2 border-white text-white hover:bg-white/10 px-8 py-4 rounded-full font-medium text-lg transition-colors shadow-lg"
            >
              Contact Us
            </Link>
          </motion.div>
        </div>
      </section>
    </main>
  );
}

// Tailwind animation for gradient
// Add to your global CSS if not present:
// @layer utilities {
//   .animate-gradient-move {
//     background-size: 200% 200%;
//     animation: gradient-move 6s ease-in-out infinite;
//   }
//   @keyframes gradient-move {
//     0% { background-position: 0% 50%; }
//     50% { background-position: 100% 50%; }
//     100% { background-position: 0% 50%; }
//   }
// } 