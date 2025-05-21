import { Metadata } from 'next';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export const metadata: Metadata = {
  title: 'How to Buy | AutoElite',
  description: 'Learn how to buy your dream car from AutoElite. Simple steps to guide you through our car buying process.',
};

export default function HowToBuyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
} 