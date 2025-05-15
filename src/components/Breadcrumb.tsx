'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useMemo } from 'react';

interface BreadcrumbProps {
  customItems?: {
    label: string;
    href: string;
  }[];
  showHome?: boolean;
  homeLabel?: string;
  currentPageLabel?: string;
  className?: string;
}

const Breadcrumb = ({
  customItems,
  showHome = true,
  homeLabel = 'Home',
  currentPageLabel,
  className = ''
}: BreadcrumbProps) => {
  const pathname = usePathname();

  // Generate breadcrumb items based on the current path
  const items = useMemo(() => {
    if (customItems) return customItems;

    // Prepare the breadcrumbs array
    const breadcrumbs = [];
    
    // Add home item if requested
    if (showHome) {
      breadcrumbs.push({
        label: homeLabel,
        href: '/'
      });
    }

    // Split the pathname and create breadcrumb items
    const pathSegments = pathname.split('/').filter(segment => segment !== '');
    
    let currentPath = '';
    
    pathSegments.forEach((segment, index) => {
      currentPath += `/${segment}`;
      
      // If this is the last segment and a custom label is provided
      if (index === pathSegments.length - 1 && currentPageLabel) {
        breadcrumbs.push({
          label: currentPageLabel,
          href: currentPath
        });
      } else {
        // Format the segment to be more readable
        const label = segment
          // Handle URL parameters like [id]
          .replace(/^\[(.+)\]$/, '$1')
          // Convert kebab-case to Title Case
          .split('-')
          .map(word => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' ');
        
        breadcrumbs.push({
          label,
          href: currentPath
        });
      }
    });
    
    return breadcrumbs;
  }, [pathname, customItems, showHome, homeLabel, currentPageLabel]);

  if (items.length <= 1) return null;

  return (
    <nav 
      aria-label="Breadcrumb" 
      className={`py-3 mb-4 ${className}`}
    >
      <div className="bg-gradient-to-r from-blue-50/50 to-white p-3 rounded-md border border-blue-100/50 shadow-sm">
        <ol className="flex flex-wrap items-center text-sm">
          {items.map((item, index) => {
            const isLast = index === items.length - 1;
            const isFirst = index === 0;
            
            return (
              <li key={item.href} className="flex items-center">
                {index > 0 && (
                  <span className="mx-2 text-blue-300">
                    <svg 
                      xmlns="http://www.w3.org/2000/svg" 
                      className="h-3 w-3" 
                      fill="none" 
                      viewBox="0 0 24 24" 
                      stroke="currentColor"
                    >
                      <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        strokeWidth={2} 
                        d="M9 5l7 7-7 7" 
                      />
                    </svg>
                  </span>
                )}
                
                {isLast ? (
                  <span className="font-medium text-red-600 bg-red-50 px-2 py-1 rounded-md">
                    {item.label}
                  </span>
                ) : (
                  <Link 
                    href={item.href}
                    className={`hover:text-blue-600 transition-colors ${
                      isFirst ? 'flex items-center' : ''
                    }`}
                  >
                    {isFirst && (
                      <svg 
                        xmlns="http://www.w3.org/2000/svg" 
                        className="h-4 w-4 mr-1" 
                        fill="none" 
                        viewBox="0 0 24 24" 
                        stroke="currentColor"
                      >
                        <path 
                          strokeLinecap="round" 
                          strokeLinejoin="round" 
                          strokeWidth={2} 
                          d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" 
                        />
                      </svg>
                    )}
                    <span className="hover:underline">{item.label}</span>
                  </Link>
                )}
              </li>
            );
          })}
        </ol>
      </div>
    </nav>
  );
};

export default Breadcrumb; 