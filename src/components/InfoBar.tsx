'use client';
import React, { useEffect, useState } from 'react';
import { FaClock } from 'react-icons/fa';

const COMPANY_NAME = "AutoElite: Japanese Used Cars for Sale";
const TOTAL_CARS = 461614; // Example static value
const CARS_ADDED_TODAY = 15209; // Example static value

function getJapanTime() {
  const now = new Date();
  // Japan is UTC+9
  const japanTime = new Date(now.getTime() + (9 * 60 * 60 * 1000 - now.getTimezoneOffset() * 60000));
  return japanTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
}

const InfoBar: React.FC = () => {
  const [japanTime, setJapanTime] = useState(getJapanTime());

  useEffect(() => {
    const interval = setInterval(() => {
      setJapanTime(getJapanTime());
    }, 60000); // update every minute
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full bg-gray-800 text-gray-100 text-sm py-1 px-2 flex flex-wrap items-center justify-between shadow-sm">
      <div className="flex items-center gap-4 flex-wrap">
        <span className="font-semibold text-white">{COMPANY_NAME}</span>
        <span>Total Cars In Stock: <span className="font-bold">{TOTAL_CARS.toLocaleString()}</span></span>
        <span>Cars Added Today: <span className="font-bold">{CARS_ADDED_TODAY.toLocaleString()}</span></span>
        <span className="flex items-center gap-1"><FaClock className="inline-block text-gray-300" /> Japan Time: {japanTime}</span>
      </div>
    </div>
  );
};

export default InfoBar; 