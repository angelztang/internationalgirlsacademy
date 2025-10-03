'use client';

import Hero from "@/components/LandingPage/Hero";
import { CTAButtons } from "@/components/LandingPage/CTAButtons";
import Programs from "@/components/LandingPage/Programs";
import TrustIndicators from "@/components/LandingPage/TrustIndicators";
import { LiveStream } from "@/components/LandingPage/LiveChat";
import Footer from "@/components/LandingPage/Footer";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from pink-50 to-pink-100">
      <Hero />
      <CTAButtons onSelectPath={function (path: "student" | "volunteer" | "donate"): void {
        throw new Error("Function not implemented.");
      } } />
      <Programs />
      <TrustIndicators />
      <LiveStream />
      <Footer />
    </div>
  )
}