"use client";

import { useRouter } from "next/navigation";
import Navbar from "@/components/LandingPage/Navbar";
import Hero from "@/components/LandingPage/Hero";
import { CTAButtons } from "@/components/LandingPage/CTAButtons";
import Programs from "@/components/LandingPage/Programs";
import TrustIndicators from "@/components/LandingPage/TrustIndicators";
import Footer from "@/components/LandingPage/Footer";
import { Button } from "@/lib/ui/button";
import { ChatBot } from "@/components/Busybot/ChatBot";
import { LiveStream } from "@/components/LandingPage/LiveChat";

export default function Home() {
  const router = useRouter();
  return (
  <div className="min-h-screen bg-lavender">
      <Navbar />
      <Hero />
      <CTAButtons
        onSelectPath={(path: "student" | "volunteer" | "donate") => {
          if (path === "student") return router.push("/PathwayMap");
          if (path === "volunteer") return router.push("/volunteerDashboard");
          if (path === "donate") return router.push("/donate");
        }}
      />
      <Programs />
      <TrustIndicators />
      <LiveStream />
      <Footer />
      <ChatBot />
    </div>
  );
}
