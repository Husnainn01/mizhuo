import { Suspense } from "react";
import ClientHomeContent from "@/components/home/ClientHomeContent";

export default function Home() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ClientHomeContent />
    </Suspense>
  );
}
