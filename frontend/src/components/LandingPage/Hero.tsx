"use client";

import { Play } from "lucide-react";
import { motion } from "framer-motion";

export default function Hero() {
  return (
    <header className="relative flex items-center justify-center bg-white overflow-hidden py-20 min-h-[85vh]">
      {/* Animated background blobs (using palette colors) */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            x: [0, 50, 0],
            y: [0, -30, 0],
          }}
          transition={{ duration: 20, repeat: Infinity }}
          className="absolute top-20 left-20 w-96 h-96 bg-lavender rounded-full mix-blend-multiply filter blur-3xl opacity-70"
        />
        <motion.div
          animate={{
            scale: [1, 1.1, 1],
            x: [0, -30, 0],
            y: [0, 50, 0],
          }}
          transition={{ duration: 15, repeat: Infinity }}
          className="absolute top-40 right-20 w-96 h-96 bg-pink rounded-full mix-blend-multiply filter blur-3xl opacity-70"
        />
      </div>

      <div className="max-w-5xl mx-auto px-6 relative z-10">
        {/* Text Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl md:text-7xl font-bold mb-6 text-blue-primary leading-tight">
            Welcome to International Girls Academy
          </h1>
          <p className="text-xl md:text-2xl text-gray-700">
            Empowering students worldwide through mentorship, learning, and community
          </p>
        </motion.div>

        {/* Video Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="max-w-3xl mx-auto mb-12"
        >
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl p-6 md:p-10">
            <div className="relative aspect-video bg-lavender rounded-2xl overflow-hidden group cursor-pointer">
              <div className="absolute inset-0 flex items-center justify-center">
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-xl"
                >
                  <Play className="w-10 h-10 text-blue-primary ml-1" fill="currentColor" />
                </motion.div>
              </div>
            </div>
            <p className="text-center text-gray-600 mt-6 text-lg">1-Minute Intro Video</p>
          </div>
        </motion.div>

        {/* Arrow + Text */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-center"
        >
          <p className="text-gray-600 mb-3 text-lg">Choose your journey</p>
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="text-gray-400 text-3xl"
          >
            ↓
          </motion.div>
        </motion.div>
      </div>
    </header>
  );
}