'use client';
import React, { useEffect, useState } from 'react';
import { FaClock, FaEnvelope } from 'react-icons/fa';

const COMPANY_NAME = "AutoElite: Japanese Used Cars for Sale";
const EMAIL = "csd@mizhuolimitedlimited.com";

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
    <div className="w-full bg-gray-800 text-gray-100 text-sm py-2 px-2 flex items-center justify-center shadow-sm">
      <div className="flex flex-col md:flex-row items-center gap-3 md:gap-6 text-center">
        <span className="font-semibold text-white text-base flex items-center gap-2">
          {COMPANY_NAME}
        </span>
        <span className="flex items-center gap-2 text-blue-200">
          <FaEnvelope className="inline-block text-blue-300" />
          <a href={`mailto:${EMAIL}`} className="hover:underline">{EMAIL}</a>
        </span>
        <span className="flex items-center gap-1 text-blue-200">
          <FaClock className="inline-block text-blue-300" /> Japan Time: {japanTime}
        </span>
      </div>
    </div>
  );
};

export default InfoBar; 