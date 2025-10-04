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
import { useState } from "react";
import { Card } from "@/lib/ui/card";
import { Input } from "@/lib/ui/input";
import { Textarea } from "@/lib/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/lib/ui/select";
import { MessageSquare } from "lucide-react";

export default function Home() {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState("");
  return (
  <div className="min-h-screen bg-lavender">
      <Navbar />
      <Hero />
      <CTAButtons
        onSelectPath={(path: "student" | "volunteer" | "donate") => {
          if (path === "student") return router.push("/PathwayMap");
          if (path === "volunteer") return router.push("/PathwayMap?path=volunteer");
          if (path === "donate") return router.push("/donate");
        }}
      />
      <Programs />
      <TrustIndicators />
      <LiveStream />
      {/* Filtered Q&A Form (copied from InteractiveFeatures) */}
      <section className="py-20 px-4 bg-white">
        <div className="container mx-auto max-w-6xl">
          <Card className="mt-8 p-8 bg-white">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-pink rounded-full flex items-center justify-center">
                <MessageSquare className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-2xl">Quick Questions?</h3>
                <p className="text-sm text-gray-600">We&apos;ll route your question to the right team for faster responses</p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm">Question Category</label>
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="student">Student Programs</SelectItem>
                    <SelectItem value="volunteer">Volunteering</SelectItem>
                    <SelectItem value="donation">Donations & Support</SelectItem>
                    <SelectItem value="technical">Technical Support</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm">Your Email</label>
                <Input type="email" placeholder="you@example.com" />
              </div>

              <div className="md:col-span-2 space-y-2">
                <label className="text-sm">Your Question</label>
                <Textarea 
                  placeholder="Tell us what you'd like to know..."
                  rows={4}
                />
              </div>

              <div className="md:col-span-2">
                <Button className="w-full bg-pink text-white hover:bg-[#f690b0]">
                  Submit Question
                </Button>
                <p className="text-xs text-gray-500 mt-2 text-center">
                  ⚡ Average response time: 2 hours
                </p>
              </div>
            </div>
          </Card>
        </div>
      </section>
      <Footer />
      <ChatBot />
    </div>
  );
}
