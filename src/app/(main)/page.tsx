import { Suspense } from "react";
import ClientHomeContent from "@/components/home/ClientHomeContent";

export default function Home() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <ClientHomeContent />
    </Suspense>
  );
}
