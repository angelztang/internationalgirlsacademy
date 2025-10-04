'use client';

import { useRouter } from "next/navigation";
import { Button } from "@/lib/ui/button";
import { GraduationCap, Heart, HandHeart } from "lucide-react";

interface CTAButtonsProps {
  onSelectPath?: (path: 'student' | 'volunteer' | 'donate') => void;
}

export function CTAButtons({ onSelectPath }: CTAButtonsProps) {
  const router = useRouter();
  return (
    <section className="py-20 px-4 bg-white">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-12">
          <h2 className="text-4xl mb-4 text-blue-primary">
            Start Your Journey
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Choose the path that&apos;s right for you. Each journey is designed to guide you step-by-step.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Student Button */}
          <button
            onClick={() => onSelectPath('student')}
            className="group relative bg-blue-primary p-8 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 text-white overflow-hidden"
          >
            <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity"></div>
            <div className="relative z-10">
              <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mb-4 mx-auto backdrop-blur-sm">
                <GraduationCap className="w-8 h-8" />
              </div>
              <h3 className="text-2xl mb-3">Student</h3>
              <p className="text-purple-100 text-sm">
                Explore programs, connect with mentors, and build your future
              </p>
              <div className="mt-6 inline-flex items-center gap-2 text-sm">
                <span>Start Learning</span>
                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          </button>a

          {/* Volunteer Button */}
          <button
            onClick={() => onSelectPath('volunteer')}
            className="group relative bg-pink p-8 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 text-white overflow-hidden"
          >
            <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity"></div>
            <div className="relative z-10">
              <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mb-4 mx-auto backdrop-blur-sm">
                <Heart className="w-8 h-8" />
              </div>
              <h3 className="text-2xl mb-3">Volunteer</h3>
              <p className="text-pink-100 text-sm">
                Share your skills, mentor students, and make an impact
              </p>
              <div className="mt-6 inline-flex items-center gap-2 text-sm">
                <span>Get Involved</span>
                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          </button>

          {/* Donate Button */}
          <button
            onClick={() => {
              if (onSelectPath) {
                onSelectPath('donate');
              }
              router.push('/donations');
            }}
            className="group relative bg-gradient-to-br from-blue-500 to-indigo-700 p-8 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 text-white overflow-hidden"
          >
            <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity"></div>
            <div className="relative z-10">
              <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mb-4 mx-auto backdrop-blur-sm">
                <HandHeart className="w-8 h-8" />
              </div>
              <h3 className="text-2xl mb-3">Donate</h3>
              <p className="text-blue-100 text-sm">
                Support our mission and see the real impact of your contribution
              </p>
              <div className="mt-6 inline-flex items-center gap-2 text-sm">
                <span>Make a Difference</span>
                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          </button>
        </div>
      </div>
    </section>
  );
}