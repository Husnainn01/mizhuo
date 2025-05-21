'use client';

// This special wrapper helps Vercel properly handle client components in route groups
export default function ClientWrapper({ children }) {
  return <>{children}</>;
} 