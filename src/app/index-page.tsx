import { Suspense } from "react";
import MainLayout from "./main-layout";
import HomeContent from "@/components/HomeContent";

export default function IndexPage() {
  return (
    <MainLayout>
      <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
        <HomeContent />
      </Suspense>
    </MainLayout>
  );
} 