"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { LogIn } from "lucide-react";
import Image from "next/image";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-white/95 backdrop-blur-md shadow-lg"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <Image
              src="/nonprofit-logo.png"
              alt="International Girls Academy Logo"
              width={50}
              height={50}
              className="object-contain"
              style={{ backgroundColor: 'transparent'}}
            />
            <span className={`font-bold text-xl transition-colors ${
              isScrolled ? "text-gray-900" : "text-gray-900"
            }`}>
              International Girls Academy
            </span>
          </div>

          {/* Login Button */}
          <a
            href="/login"
            className="flex items-center gap-2 bg-blue-primary text-white px-6 py-2.5 rounded-full font-semibold hover:shadow-lg hover:scale-105 transition-all duration-300"
          >
            <LogIn className="w-5 h-5" />
            Login
          </a>
        </div>
      </div>
    </motion.nav>
  );
}
