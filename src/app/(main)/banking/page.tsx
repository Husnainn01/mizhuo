'use client';
import React, { useState } from 'react';
import { FaUniversity, FaRegCopy, FaInfoCircle } from 'react-icons/fa';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

const bankingDetails = [
  { label: 'Account Title', value: 'MG Trading Limited' },
  { label: 'Account Number', value: '0062400' },
  { label: 'Bank Name', value: 'Mitsubishi Tokyo UFJ Bank' },
  { label: 'Branch Code', value: '663' },
  { label: 'Branch Name', value: 'Rokubancho Branch' },
  { label: 'Branch Address', value: 'Aichi ken, Nagoya Shi, Naka-ku Kanayama 1-14-18, Japan' },
  { label: 'Swift Code', value: 'BOTKJPJT' },
];

export default function BankingPage() {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const handleCopy = (value: string, idx: number) => {
    navigator.clipboard.writeText(value);
    setCopiedIndex(idx);
    setTimeout(() => setCopiedIndex(null), 1200);
  };

  return (
    <main className="flex-grow min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-0">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-700 to-purple-600 py-14 shadow-lg">
        <div className="container mx-auto px-4 flex flex-col items-center justify-center">
          <div className="flex items-center mb-4">
            <FaUniversity className="h-10 w-10 text-white drop-shadow-lg mr-3" />
            <h1 className="text-4xl md:text-5xl font-extrabold text-white drop-shadow-lg">Banking Details</h1>
          </div>
          <p className="text-blue-100 text-lg max-w-xl text-center">Securely transfer funds to our official account. Please double-check all details before making any payments.</p>
        </div>
      </div>
      {/* Card */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-2xl shadow-lg border border-blue-200 p-8 md:p-10">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              {bankingDetails.map((item, idx) => (
                <div key={item.label} className="flex flex-col gap-1">
                  <span className="text-sm text-blue-600 font-medium">{item.label}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-gray-900 text-base font-semibold break-words">{item.value}</span>
                    <button
                      type="button"
                      aria-label={`Copy ${item.label}`}
                      onClick={() => handleCopy(item.value, idx)}
                      className="ml-1 p-1 rounded hover:bg-blue-100 transition-colors flex items-center"
                    >
                      <span className="inline-block w-12 text-xs text-left">
                        {copiedIndex === idx ? (
                          <span className="text-green-600 font-semibold">Copied!</span>
                        ) : (
                          <FaRegCopy className="h-5 w-5 text-blue-500" />
                        )}
                      </span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex items-start bg-blue-100/60 border-l-4 border-blue-400 rounded-lg p-4 text-blue-800 text-base mt-8">
              <FaInfoCircle className="h-5 w-5 mt-1 mr-3 text-blue-500" />
              <div>
                <strong>Note:</strong> Please double-check all banking details before making any payments. If you have any questions, contact our support team.
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
} 