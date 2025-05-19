'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function AuctionPage() {
  // State for active day (for mobile view)
  const [activeDay, setActiveDay] = useState<keyof typeof auctionSchedule>('Monday');
  
  // Auction schedule data organized by day
  const auctionSchedule = {
    'Monday': [
      'AUCNET', 'GNN OSAKA', 'GAO', 'Honda Fukuoka', 'Honda Hokkaido', 
      'Honda Kansai', 'Honda Nagoya', 'Honda Sendai', 'Honda Tokyo', 'JU Tokyo'
    ],
    'Tuesday': [
      'ARAI Sendai', 'Isuzu Kobe', 'CAA Gifu', 'CAA Touhoku', 'GE Tokyo',
      'JU Mie', 'JU Nagano', 'JU Saitama', 'JU Shizuoka', 'JU Yamaguchi',
      'NPS Osaka', 'NPS Tokio', 'ORIX Kobe', 'ORIX Sendai', 'SAA Sapporo',
      'TAA Hiroshima', 'TAA Kinki', 'TAA Kyushu', 'TAA kyushu', 'TAA Minamikyushu',
      'TAA Shikoku', 'USS Yokohama', 'ZIP Tokyo', 'USS R NAGOYA'
    ],
    'Wednesday': [
      'BAYAUC', 'CAA Chubu', 'BCN', 'FAA Shizuoka', 'GE Tokyo',
      'JU Mie', 'HERO', 'IAA Osaka', 'Isuzu Makuhari', 'JAA',
      'JU Ibaraki', 'JU Ishikawa', 'KAA', 'KCAA Ebino', 'LAA Shikoku',
      'ORIX Atsugi', 'USS Fujioka', 'USS Fukuoka', 'USS Kobe', 'USS Sapporo',
      'USS Tohoku'
    ],
    'Thursday': [
      'ARAI Oyama', 'GE Kobe', 'GAO! TENDER Gulliver', 'HAA Osaka (Hanaten)', 'GE Tokyo',
      'JU Aichi', 'JU Fukushima', 'JU Gunma', 'JU Hiroshima', 'JU Kanagawa',
      'JU Sapporo', 'JU Toyama', 'KCAA Fukuoka', 'LAA Kansai', 'NAA Nagoya',
      'NAA Osaka', 'ORIX Fukuoka', 'ORIX Nagoya', 'SAA Hamamatsu', 'USS Niigata',
      'TAA Hokkaido', 'TAA Kantou', 'USS R Tokyo', 'USS Tokyo', 'ZIP Osaka'
    ],
    'Friday': [
      'ARAI Bayside', 'JAA Tsukuba', 'Isuzu Kobe', 'JU Chiba', 'GE Tokyo',
      'JU Miyagi', 'JU Niigata', 'JU Okayama LAA', 'JU Okinawa', 'JU Tochigi',
      'KCAA Yamaguchi', 'KUA Katayamazu', 'NAA Tokyo', 'USS Hokuriku', 'USS Nagoya',
      'USS Osaka', 'USS Saitama', 'White Wing', 'TAA Chubu'
    ],
    'Saturday': [
      'ARAI Oyama', 'JU Gifu', 'HAA Kobe', 'JU Nara', 'NAA Nagoya Nyu',
      'NA Osaka', 'NAA Tokyo Nyuusatsu', 'TAA Yokohama', 'USS Gunma', 
      'USS Kyushu', 'USS Okayama', 'USS Ryuutsu', 'USS Shizuoka'
    ],
    'One Price': [
      'AS Members', 'Apple Stock', 'AS Oneprice', 'BAYAUC Oneprice', 'CAA Chubu Oneprice',
      'CAA Tohoku Oneprice', 'CAA ZIP Tokyo One Price', 'GAO Stock', 'HAA Kobe One Price',
      'Hero Oneprice', 'Ippatsu Stock', 'JAA Kasai Oneprice', 'JAA Tsukuba Oneprice',
      'Korea Oneprice One', 'Kyouyuu Stock', 'Syoudan Stock', 'USS Stock'
    ]
  };

  const days = Object.keys(auctionSchedule) as Array<keyof typeof auctionSchedule>;

  return (
    <div>
      {/* Auction Schedule Section - Redesigned */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-6">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-blue-800 mb-4">Weekly Auction Schedule</h2>
            <p className="text-gray-600 max-w-2xl mx-auto text-lg">
              Our comprehensive weekly schedule connects you with premium auction houses across Japan
            </p>
          </motion.div>
          
          {/* Mobile Day Selector (visible on small screens) */}
          <div className="md:hidden mb-8">
            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
              <select 
                value={activeDay} 
                onChange={(e) => setActiveDay(e.target.value as keyof typeof auctionSchedule)}
                className="w-full p-4 bg-blue-50 border border-blue-200 rounded-lg text-blue-800 font-medium focus:ring-2 focus:ring-blue-500 focus:border-blue-500 mb-6 text-lg"
              >
                {days.map(day => (
                  <option key={day} value={day}>{day}</option>
                ))}
              </select>
              
              <div className="mt-6">
                <h3 className="text-2xl font-bold mb-5 text-blue-800 flex items-center">
                  <svg className="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  {activeDay}
                </h3>
                <div className="flex flex-wrap gap-3">
                  {auctionSchedule[activeDay].map((auctionHouse, index) => (
                    <motion.span 
                      key={`mobile-${activeDay}-${auctionHouse}`}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.2, delay: index * 0.02 }}
                      className="inline-flex items-center px-4 py-2.5 rounded-lg text-sm font-medium bg-blue-100 text-blue-800 hover:bg-blue-200 cursor-pointer transition-colors border border-blue-200"
                    >
                      {auctionHouse}
                    </motion.span>
                  ))}
                </div>
              </div>
            </div>
          </div>
          
          {/* Desktop Schedule (hidden on small screens) */}
          <div className="hidden md:block">
            {/* Day selector tabs */}
            <div className="flex flex-wrap mb-6 gap-2 justify-center">
              {days.map((day, idx) => (
                <motion.button
                  key={`tab-${day}`}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: idx * 0.05 }}
                  onClick={() => setActiveDay(day)}
                  className={`px-5 py-3 rounded-lg font-medium transition-colors ${
                    activeDay === day 
                      ? 'bg-blue-600 text-white shadow-md' 
                      : 'bg-white text-blue-800 hover:bg-blue-50 border border-gray-200'
                  }`}
                >
                  {day}
                </motion.button>
              ))}
            </div>
            
            {/* Selected day content */}
            <motion.div
              key={`content-${activeDay}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden"
            >
              <div className="bg-blue-700 text-white px-6 py-4 flex items-center justify-between">
                <h3 className="text-2xl font-bold flex items-center">
                  <svg className="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  {activeDay} Auctions
                </h3>
                <span className="bg-blue-800 text-sm rounded-full px-3 py-1.5">
                  {auctionSchedule[activeDay].length} Houses
                </span>
              </div>
              
              <div className="p-8">
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {auctionSchedule[activeDay].map((auctionHouse, index) => (
                    <motion.div
                      key={`desktop-${activeDay}-${auctionHouse}`}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.25, delay: index * 0.03 }}
                      className="bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-lg p-4 cursor-pointer transition-all hover:shadow-md"
                    >
                      <div className="flex items-center">
                        <span className="w-3 h-3 rounded-full bg-blue-500 mr-3 flex-shrink-0"></span>
                        <span className="text-blue-800 font-medium">{auctionHouse}</span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
          
          {/* Legend/Help section */}
          <div className="mt-10 bg-white rounded-lg p-6 border border-gray-200 shadow-sm max-w-3xl mx-auto">
            <h4 className="text-lg font-semibold text-blue-800 mb-3 flex items-center">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Auction Information
            </h4>
            <p className="text-gray-600">
              Click on any auction house to view available vehicles and bidding details. Our auctions operate in Japanese Standard Time (JST). Contact our representatives for assistance with specific auction houses.
            </p>
          </div>
        </div>
      </section>
      
      {/* Auction Information Section */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold text-black mb-6">About Our Auction Service</h2>
            
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
              <h3 className="text-xl font-bold text-blue-800 mb-4">What is a Car Auction?</h3>
              <p className="text-gray-700 mb-4">
                Car auctions are events where vehicles are sold to the highest bidder. These auctions offer a wide variety of vehicles, from nearly new to used cars, luxury models, and even rare collectibles. They provide an opportunity to purchase vehicles at competitive prices, often below market value.
              </p>
              <p className="text-gray-700">
                Our platform connects you with major auction houses across Japan, giving you access to thousands of quality vehicles each week.
              </p>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
              <h3 className="text-xl font-bold text-blue-800 mb-4">How to Participate</h3>
              <ol className="list-decimal pl-5 space-y-3 text-gray-700">
                <li><strong>Register an account</strong> - Create your profile and verify your identity.</li>
                <li><strong>Browse the schedule</strong> - Find auctions that interest you based on day and auction house.</li>
                <li><strong>Preview vehicles</strong> - Review available inventory before the auction date.</li>
                <li><strong>Place bids</strong> - Participate online or through our representatives.</li>
                <li><strong>Complete purchase</strong> - If you win, finalize payment and arrange delivery or pickup.</li>
              </ol>
            </div>
            
            <div className="text-center">
              <Link 
                href="/auction/register" 
                className="inline-flex items-center bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-md font-medium transition-colors"
              >
                Register for Auctions
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </section>
      
      {/* FAQ Section */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold text-black mb-8 text-center">Frequently Asked Questions</h2>
          
          <div className="max-w-3xl mx-auto">
            <div className="space-y-6">
              <div className="bg-blue-50 rounded-lg p-6">
                <h3 className="text-lg font-bold text-blue-800 mb-2">How do I know which auction houses have the cars I'm looking for?</h3>
                <p className="text-gray-700">
                  Each auction house specializes in different types of vehicles. Our representatives can guide you toward the most suitable auction houses based on your preferences.
                </p>
              </div>
              
              <div className="bg-blue-50 rounded-lg p-6">
                <h3 className="text-lg font-bold text-blue-800 mb-2">Can I inspect vehicles before bidding?</h3>
                <p className="text-gray-700">
                  Yes, we provide detailed inspection reports and images for each vehicle. For select auctions, in-person inspections can be arranged with advance notice.
                </p>
              </div>
              
              <div className="bg-blue-50 rounded-lg p-6">
                <h3 className="text-lg font-bold text-blue-800 mb-2">What happens if I win a bid?</h3>
                <p className="text-gray-700">
                  Our team will contact you to confirm the purchase and guide you through the payment process. We also offer comprehensive shipping and logistics services to deliver your vehicle to your desired location.
                </p>
              </div>
              
              <div className="bg-blue-50 rounded-lg p-6">
                <h3 className="text-lg font-bold text-blue-800 mb-2">How do I make payment for auction vehicles?</h3>
                <p className="text-gray-700">
                  We accept bank transfers, credit cards, and other secure payment methods. All transactions are handled through our secure payment portal, ensuring the safety of your financial information.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
} 