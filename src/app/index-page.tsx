import { Suspense } from "react";
import MainLayout from "./main-layout";
import HomeContent from "@/components/home/HomeContent";

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export default function IndexPage() {
  return (
    <MainLayout>
      <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
        <HomeContent />
      </Suspense>
    </MainLayout>
  );
} 