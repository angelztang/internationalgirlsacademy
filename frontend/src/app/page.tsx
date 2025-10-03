'use client';

import Link from 'next/link';
import Hero from "@/components/LandingPage/Hero";
import { CTAButtons } from "@/components/LandingPage/CTAButtons";
import Programs from "@/components/LandingPage/Programs";
import TrustIndicators from "@/components/LandingPage/TrustIndicators";
import Footer from "@/components/LandingPage/Footer";
import { Button } from '@/lib/ui/button';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from pink-50 to-pink-100">
      {/* Top-right Login button */}
      <div className="fixed top-4 right-4 z-50">
        <Link href="/login">
          <Button variant="ghost">Log in</Button>
        </Link>
      </div>

      <Hero />
      <CTAButtons onSelectPath={function (path: "student" | "volunteer" | "donate"): void {
        throw new Error("Function not implemented.");
      } } />
      <Programs />
      <TrustIndicators />
      <Footer />
    </div>
  )
}