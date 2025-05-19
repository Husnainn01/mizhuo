'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";

const Navigation = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();

  // This ensures the component only renders fully on the client
  useEffect(() => {
    setMounted(true);
  }, []);

  const menuItems = [
    { name: 'Home', path: '/' },
    {
      name: 'Vehicles',
      items: [
        { name: 'All Cars', path: '/cars' },
        // { name: 'Auction', path: '/auction' },
      ]
    },
    {
      name: 'Auction', path: '/auction',
      // items: [
      //   { name: 'Auction', path: '/auction' },
      // ]
    },
    {
      name: 'Banking', path: '/banking',
    },
    {
      name: 'Resources',
      items: [
        { name: 'How to Buy', path: '/how-to-buy' },
        { name: 'FAQ', path: '/faq' },
      ]
    },
    {
      name: 'Company',
      items: [
        { name: 'About Us', path: '/about' },
        { name: 'Contact', path: '/contact' },
      ]
    }
  ];

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  // Simple placeholder during SSR to avoid hydration issues
  if (!mounted) {
    return (
      <nav className="bg-gradient-to-r from-blue-50 via-white to-blue-50 border-b border-black/10 shadow-sm w-full sticky top-0 z-50">
        <div className="container mx-auto px-4 w-full">
          <div className="flex justify-between items-center h-20">
            <div>AutoElite</div>
            <div className="hidden md:block">Navigation Links</div>
            <div className="hidden md:block">Auth Buttons</div>
            <div className="md:hidden">Menu</div>
          </div>
        </div>
      </nav>
    );
  }

  return (
    <nav className="bg-gradient-to-r from-blue-50 via-white to-blue-50 border-b border-black/10 shadow-sm w-full sticky top-0 z-50">
      <div className="container mx-auto px-4 w-full">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <div className="bg-red-600 text-white px-3 py-2 rounded-md">
              <span className="text-2xl font-bold">AutoElite</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {menuItems.map((item) => (
              item.path ? (
                <Link
                  key={item.path}
                  href={item.path}
                  className={`font-medium px-4 py-2 rounded-md transition-colors ${
                    pathname === item.path
                      ? 'bg-red-600 text-white'
                      : 'text-black hover:bg-blue-50 hover:text-blue-600'
                  }`}
                >
                  {item.name}
                </Link>
              ) : (
                <DropdownMenu key={item.name}>
                  <DropdownMenuTrigger className="flex items-center px-4 py-2 rounded-md font-medium text-black hover:bg-blue-50 hover:text-blue-600 transition-colors focus:outline-none">
                    {item.name}
                    <ChevronDown className="ml-1 h-4 w-4" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start" className="w-48">
                    {item.items?.map((subItem) => (
                      <DropdownMenuItem key={subItem.path} asChild>
                        <Link
                          href={subItem.path}
                          className={`w-full ${
                            pathname === subItem.path
                              ? 'bg-blue-50 text-blue-600'
                              : 'text-gray-700 hover:text-blue-600'
                          }`}
                        >
                          {subItem.name}
                        </Link>
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              )
            ))}
          </div>

          {/* Auth Buttons - Desktop */}
          <div className="hidden md:flex items-center space-x-3">
            <Link
              href="/auth/login"
              className="text-black hover:text-blue-600 font-medium border border-transparent hover:border-blue-200 px-4 py-2 rounded-md transition-colors"
            >
              Login
            </Link>
            <Link
              href="/auth/register"
              className="bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded-md font-medium transition-colors shadow-sm"
            >
              Register
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              type="button"
              className="text-black hover:text-red-600 bg-gray-100 p-2 rounded-md"
              onClick={toggleMobileMenu}
              aria-label="Toggle menu"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {isMobileMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white px-4 pt-2 pb-4 border-t border-black/10 shadow-md">
          <div className="flex flex-col space-y-2">
            {menuItems.map((item) => (
              <div key={item.name}>
                {item.path ? (
                  <Link
                    href={item.path}
                    className={`block font-medium py-3 px-4 rounded-md transition-colors ${
                      pathname === item.path
                        ? 'bg-red-600 text-white'
                        : 'text-black hover:bg-blue-50 hover:text-blue-600'
                    }`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
                ) : (
                  <>
                    <div className="font-medium text-gray-500 px-4 py-2">
                      {item.name}
                    </div>
                    <div className="pl-4 space-y-1">
                      {item.items?.map((subItem) => (
                        <Link
                          key={subItem.path}
                          href={subItem.path}
                          className={`block py-2 px-4 rounded-md ${
                            pathname === subItem.path
                              ? 'bg-blue-50 text-blue-600'
                              : 'text-gray-600 hover:bg-blue-50 hover:text-blue-600'
                          }`}
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          {subItem.name}
                        </Link>
                      ))}
                    </div>
                  </>
                )}
              </div>
            ))}
            <hr className="border-black/10 my-2" />
            <div className="flex flex-col space-y-2 mt-2">
              <Link
                href="/auth/login"
                className="text-black hover:text-blue-600 font-medium border border-gray-200 px-4 py-3 rounded-md text-center transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Login
              </Link>
              <Link
                href="/auth/register"
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-3 rounded-md font-medium transition-colors text-center"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Register
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navigation; 