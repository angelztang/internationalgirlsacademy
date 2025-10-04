"use client";

import { motion } from "framer-motion";
import { Rocket, Code, Gift, ArrowRight } from "lucide-react";

const programs = [
  {
    title: "Ujima Business Program",
    description: "12 weeks to launch your business",
    details: "Learn entrepreneurship, build a business plan, and launch your venture with mentor support",
    icon: Rocket,
    color: "text-pink",
    bgColor: "bg-pink",
    iconBg: "bg-pink",
  },
  {
    title: "Kumbathon",
    description: "Make coding cool through hackathons",
    details: "Join exciting coding challenges, build projects, and connect with tech enthusiasts",
    icon: Code,
    color: "text-lavender",
    bgColor: "bg-lavender",
    iconBg: "bg-lavender",
  },
  {
    title: "Box of Open Love",
    description: "Get essential items for school/college",
    details: "Receive supplies and resources to support your educational journey",
    icon: Gift,
    color: "text-blue-primary",
    bgColor: "bg-blue-primary",
    iconBg: "bg-blue-primary",
  },
]

export default function Programs() {
  return (
    <section className="py-20 px-6 bg-white">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-blue-primary">
            Our Programs
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Explore opportunities designed to empower, educate, and elevate your potential
          </p>
        </motion.div>

        {/* Program Cards */}
        <div className="grid md:grid-cols-3 gap-8">
          {programs.map((program, index) => {
            const Icon = program.icon;
            return (
              <motion.div
                key={program.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ y: -8, scale: 1.02 }}
                className="group relative bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden"
              >
                {/* Gradient Background on Hover */}
                <div className={`absolute inset-0 ${program.color.replace('from-','bg-')} opacity-5 transition-opacity`} />

                <div className="relative p-8">
                  {/* Icon */}
                  <div className={`w-16 h-16 ${program.iconBg} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                    <Icon className={`w-8 h-8 ${program.iconBg.replace('bg-','')} text-white`} strokeWidth={2.5} />
                  </div>

                  {/* Title */}
                  <h3 className={`text-2xl font-bold mb-3 ${program.color.replace('from-','text-')}`}>
                    {program.title}
                  </h3>

                  {/* Description */}
                  <p className="text-gray-600 mb-4 font-medium">
                    {program.description}
                  </p>

                  {/* Details */}
                  <p className="text-gray-500 text-sm mb-6">
                    {program.details}
                  </p>

                  {/* Learn More Link */}
                  <a
                    href="#"
                    className={`inline-flex items-center gap-2 font-semibold ${program.color.replace('from-','text-')} group-hover:gap-3 transition-all`}
                  >
                    Learn More
                    <ArrowRight className="w-5 h-5" strokeWidth={2.5} />
                  </a>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  )
}