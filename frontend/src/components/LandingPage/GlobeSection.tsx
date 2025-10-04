"use client";

import { motion } from "framer-motion";
import Globe3D from "./Globe3D";

export default function GlobeSection() {
  return (
    <section className="py-20 px-4 bg-white overflow-hidden">
      <div className="container mx-auto max-w-7xl">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-[#33333A] mb-6">
            Connecting Girls Worldwide
          </h2>
          <p className="text-xl text-[#33333A] max-w-3xl mx-auto">
            Our global network spans across continents, bringing together
            ambitious young women from the United States, Ghana, Liberia, and
            Guyana in a powerful community of mentorship and growth.
          </p>
        </motion.div>

        {/* 3D Globe Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.2 }}
          viewport={{ once: true }}
          className="relative h-[600px] lg:h-[700px] rounded-3xl overflow-hidden shadow-2xl"
        >
          <Globe3D />

          {/* Overlay Stats */}
          <div className="absolute bottom-6 left-6 right-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-[#4455F0]/40 backdrop-blur-sm rounded-xl p-4 text-center border border-white/20">
                <div className="text-2xl font-bold text-white">2.5K+</div>
                <div className="text-sm text-white">Active Students</div>
              </div>
              <div className="bg-[#4455F0]/40 backdrop-blur-sm rounded-xl p-4 text-center border border-white/20">
                <div className="text-2xl font-bold text-white">500+</div>
                <div className="text-sm text-white">Expert Mentors</div>
              </div>
              <div className="bg-[#4455F0]/40 backdrop-blur-sm rounded-xl p-4 text-center border border-white/20">
                <div className="text-2xl font-bold text-white">95%</div>
                <div className="text-sm text-white">Success Rate</div>
              </div>
              <div className="bg-[#4455F0]/40 backdrop-blur-sm rounded-xl p-4 text-center border border-white/20">
                <div className="text-2xl font-bold text-white">4</div>
                <div className="text-sm text-white">Countries</div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Country Highlights */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
          className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6"
        >
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">🇺🇸</span>
            </div>
            <h3 className="text-lg font-semibold text-[#33333A] mb-2">
              United States
            </h3>
            <p className="text-sm text-[#33333A]">
              Major cities across the nation
            </p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-orange-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">🇬🇭</span>
            </div>
            <h3 className="text-lg font-semibold text-[#33333A] mb-2">Ghana</h3>
            <p className="text-sm text-[#33333A]">Accra and Kumasi regions</p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">🇱🇷</span>
            </div>
            <h3 className="text-lg font-semibold text-[#33333A] mb-2">
              Liberia
            </h3>
            <p className="text-sm text-[#33333A]">Monrovia capital region</p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">🇬🇾</span>
            </div>
            <h3 className="text-lg font-semibold text-[#33333A] mb-2">
              Guyana
            </h3>
            <p className="text-sm text-[#33333A]">Georgetown capital region</p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
