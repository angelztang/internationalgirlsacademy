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
import { MessageSquare, Users, Calendar } from "lucide-react";

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
      {/* Interactive Features (Alumni, Events) */}
      <section className="py-20 px-4 bg-white">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Alumni + Mentorship Preview */}
            <Card className="p-8 bg-[#b4bbf8]/20">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-[#4455f0] rounded-full flex items-center justify-center">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-2xl">Alumni & Mentorship</h3>
              </div>
              
              <div className="space-y-4">
                <p className="text-gray-700">
                  Connect with our global network of successful alumni and experienced mentors ready to guide your journey.
                </p>
                
                <div className="bg-white rounded-lg p-4 space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-[#f7a1c0] rounded-full flex items-center justify-center text-white">
                      SJ
                    </div>
                    <div>
                      <h4 className="text-sm">Sarah Johnson</h4>
                      <p className="text-xs text-gray-600">Software Engineer at Google</p>
                    </div>
                  </div>
                  <p className="text-sm text-gray-700">
                    "IGA changed my life. Now I mentor 3 students and help them achieve their dreams."
                  </p>
                </div>

                <div className="bg-white rounded-lg p-4 space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-[#4455f0] rounded-full flex items-center justify-center text-white">
                      MK
                    </div>
                    <div>
                      <h4 className="text-sm">Maria Kim</h4>
                      <p className="text-xs text-gray-600">Entrepreneur & Founder</p>
                    </div>
                  </div>
                  <p className="text-sm text-gray-700">
                    "The mentorship I received helped me start my own business at 19."
                  </p>
                </div>

                <Button className="w-full bg-[#4455f0] text-white hover:bg-[#3344df]">
                  Browse Mentors
                </Button>
              </div>
            </Card>

            {/* Event Signup (Zephy Integration) */}
            <Card className="p-8 bg-[#f7a1c0]/20">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-[#4455f0] rounded-full flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-2xl">Upcoming Events</h3>
              </div>
              
              <div className="space-y-4">
                <div className="bg-white rounded-lg p-4 border-l-4 border-[#4455f0]">
                  <h4 className="mb-1">Weekly Circle Time</h4>
                  <p className="text-sm text-gray-600 mb-2">Every Tuesday, 4:00 PM EST</p>
                  <p className="text-sm text-gray-700 mb-3">
                    Join our youngest learners (ages 5-7) for stories, games, and fun activities!
                  </p>
                  <Button size="sm" className="w-full">Sign Up</Button>
                </div>

                <div className="bg-white rounded-lg p-4 border-l-4 border-[#f7a1c0]">
                  <h4 className="mb-1">Entrepreneurship Workshop</h4>
                  <p className="text-sm text-gray-600 mb-2">Saturday, Oct 12, 2:00 PM EST</p>
                  <p className="text-sm text-gray-700 mb-3">
                    Learn how to pitch your business idea and connect with investors.
                  </p>
                  <Button size="sm" className="w-full">Sign Up</Button>
                </div>

                <div className="bg-white rounded-lg p-4 border-l-4 border-[#b4bbf8]">
                  <h4 className="mb-1">Alumni Panel Discussion</h4>
                  <p className="text-sm text-gray-600 mb-2">Oct 20, 6:00 PM EST</p>
                  <p className="text-sm text-gray-700 mb-3">
                    Hear from successful IGA graduates about their career journeys.
                  </p>
                  <Button size="sm" className="w-full">Sign Up</Button>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>
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
