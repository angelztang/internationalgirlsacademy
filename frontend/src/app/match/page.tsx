"use client";

import Navbar from "@/components/LandingPage/Navbar";
import Footer from "@/components/LandingPage/Footer";
import { Card } from "@/lib/ui/card";
import { Button } from "@/lib/ui/button";
import { Input } from "@/lib/ui/input";
import { Textarea } from "@/lib/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/lib/ui/select";
import { Calendar, Users } from "lucide-react";
import { useState } from "react";

export default function MentorshipMatchingPage() {
  const [submitted, setSubmitted] = useState(false);
  const [match, setMatch] = useState<{
    name: string;
    role: string;
    bio: string;
  } | null>(null);

  function handleSubmit() {
    // In real app: call API to get best mentor match
    // Mocking one match here
    setMatch({
      name: "Sarah Johnson",
      role: "Software Engineer at Google",
      bio: "Passionate about guiding students in tech and career growth.",
    });
    setSubmitted(true);
  }

  return (
    <div className="min-h-screen bg-lavender">
      <Navbar />

      {/* Hero */}
      <section className="py-16 px-4 bg-white">
        <div className="container mx-auto max-w-3xl text-center">
          <h1 className="text-4xl font-bold mb-4">Mentorship Matching</h1>
          <p className="text-gray-600 text-lg">
            Enter your interests and availability, and we’ll match you with the
            best mentor for your journey.
          </p>
        </div>
      </section>

      {/* Matching Form */}
      {!submitted && (
        <section className="py-20 px-4 bg-white">
          <div className="container mx-auto max-w-3xl">
            <Card className="p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-[#4455f0] rounded-full flex items-center justify-center">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-2xl">Tell Us About You</h3>
              </div>

              <div className="grid gap-4">
                <div className="space-y-2">
                  <label className="text-sm">Your Name</label>
                  <Input type="text" placeholder="Jane Doe" />
                </div>

                <div className="space-y-2">
                  <label className="text-sm">Your Email</label>
                  <Input type="email" placeholder="you@example.com" />
                </div>

                <div className="space-y-2">
                  <label className="text-sm">Area of Interest</label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select interest" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="tech">
                        Technology & Software
                      </SelectItem>
                      <SelectItem value="entrepreneurship">
                        Entrepreneurship
                      </SelectItem>
                      <SelectItem value="research">
                        Research & Innovation
                      </SelectItem>
                      <SelectItem value="career">Career Development</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm">Availability</label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="When are you available?" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="weekdays">
                        Weekdays (Evenings)
                      </SelectItem>
                      <SelectItem value="weekends">Weekends</SelectItem>
                      <SelectItem value="flexible">Flexible</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm">Goals</label>
                  <Textarea
                    placeholder="What would you like to achieve with mentorship?"
                    rows={4}
                  />
                </div>

                <Button
                  className="w-full bg-pink text-white hover:bg-[#f690b0]"
                  onClick={handleSubmit}
                >
                  Find My Match
                </Button>
              </div>
            </Card>
          </div>
        </section>
      )}

      {/* Match Result */}
      {submitted && match && (
        <section className="py-20 px-4 bg-white">
          <div className="container mx-auto max-w-3xl">
            <Card className="p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-pink rounded-full flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-2xl">We Found a Match!</h3>
              </div>

              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-[#4455f0] rounded-full flex items-center justify-center text-white font-bold">
                  {match.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </div>
                <div>
                  <h4 className="text-lg font-semibold">{match.name}</h4>
                  <p className="text-sm text-gray-600">{match.role}</p>
                </div>
              </div>

              <p className="text-gray-700 mb-4">{match.bio}</p>
              <Button className="w-full bg-[#4455f0] text-white hover:bg-[#3344df]">
                Connect with {match.name}
              </Button>
            </Card>
          </div>
        </section>
      )}

      <Footer />
    </div>
  );
}
