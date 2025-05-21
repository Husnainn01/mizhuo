import { redirect } from 'next/navigation';

// Simple redirect to the (main) route
export default function RootPage() {
  redirect('/');
}
