"use client";

import { ArrowRight, Play, Users } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/lib/ui/button";

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center bg-white px-6">
      <div className="max-w-7xl w-full flex flex-col lg:flex-row items-center gap-12">
        {/* Left Column - Text */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="flex-1 space-y-6"
        >
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-[#4455FF] leading-tight">
            Uniting, Uplifting, & Empowering Girls Worldwide
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl text-[#B4BBF8] max-w-xl">
            Through the Nguzo Saba, we help girls create their own table.
          </p>
          <div className="flex gap-4 flex-wrap mt-4">
            <Button
              size="lg"
              className="bg-[#4455FF] text-white px-6 py-3 rounded-lg flex items-center gap-2"
            >
              Start Your Journey <ArrowRight className="w-5 h-5" />
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="border-[#F7A1C0] text-[#F7A1C0] px-6 py-3 rounded-lg flex items-center gap-2"
            >
              <Play className="w-5 h-5" />
              Watch Video
            </Button>
          </div>
        </motion.div>

        {/* Right Column - Video */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="flex-1 w-full"
        >
          <div className="relative aspect-video rounded-xl overflow-hidden shadow-lg border border-gray-200">
            <iframe
              className="w-full h-full"
              src="https://www.youtube.com/embed/YOUR_VIDEO_ID"
              title="IGA Introduction"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
            <div className="absolute top-4 left-4 bg-[#F7A1C0] text-white px-2 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
              <Users className="w-3 h-3" /> Live
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
