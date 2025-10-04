"use client";

import { motion } from "framer-motion";
import { Heart, DollarSign, Users, TrendingUp, Check, ArrowLeft } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";

const donationTiers = [
  {
    amount: 25,
    title: "Supporter",
    description: "Provides school supplies for one student",
    impact: "1 student supported",
    icon: Heart,
  },
  {
    amount: 100,
    title: "Advocate",
    description: "Sponsors a month of after-school programs",
    impact: "5 students impacted",
    icon: Users,
    popular: true,
  },
  {
    amount: 500,
    title: "Champion",
    description: "Funds a complete entrepreneurship workshop",
    impact: "20+ students empowered",
    icon: TrendingUp,
  },
];

const impactStats = [
  { value: "2,000+", label: "Students Empowered" },
  { value: "$500K+", label: "Raised This Year" },
  { value: "15+", label: "Countries Reached" },
  { value: "95%", label: "Go Directly to Programs" },
];

export default function DonationPage() {
  const [customAmount, setCustomAmount] = useState("");
  const [selectedTier, setSelectedTier] = useState<number | null>(null);
  const router = useRouter();

  return (
  <div className="min-h-screen bg-lavender/10">
      {/* Hero Section */}
  <section className="relative py-20 px-6 bg-white overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              x: [0, 50, 0],
              y: [0, -30, 0],
            }}
            transition={{ duration: 20, repeat: Infinity }}
            className="absolute top-20 left-20 w-96 h-96 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-70"
          />
          <motion.div
            animate={{
              scale: [1, 1.1, 1],
              x: [0, -30, 0],
              y: [0, 50, 0],
            }}
            transition={{ duration: 15, repeat: Infinity }}
            className="absolute top-40 right-20 w-96 h-96 bg-pink-200 rounded-full mix-blend-multiply filter blur-3xl opacity-70"
          />
        </div>

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="mb-6 text-left">
            <button
              type="button"
              onClick={() => router.push('/')}
              className="inline-flex items-center gap-2 text-sm text-blue-primary hover:underline"
            >
              <ArrowLeft className="w-4 h-4" /> Back
            </button>
          </div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl md:text-6xl font-bold mb-6 text-blue-primary">
              Empower the Next Generation
            </h1>
            <p className="text-xl md:text-2xl text-gray-700 mb-8">
              Your donation directly supports girls worldwide in their journey to success
            </p>
          </motion.div>
        </div>
      </section>

      {/* Impact Stats */}
      <section className="py-16 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            {impactStats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="text-center"
              >
                <div className="text-4xl font-bold text-blue-primary mb-2">{stat.value}</div>
                <div className="text-gray-600">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Donation Tiers */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4 text-blue-primary">
              Choose Your Impact
            </h2>
            <p className="text-gray-600 text-lg">
              Every contribution makes a difference in a student&apos;s life
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-12">
            {donationTiers.map((tier, index) => {
              const Icon = tier.icon;
              return (
                <motion.div
                  key={tier.amount}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  whileHover={{ scale: 1.05 }}
                  onClick={() => setSelectedTier(tier.amount)}
                  className={`relative cursor-pointer bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all p-8 ${
                    selectedTier === tier.amount
                      ? "ring-4 ring-blue-primary"
                      : ""
                  } ${tier.popular ? "border-4 border-blue-primary" : ""}`}
                >
                  {tier.popular && (
                    <div className="absolute top-0 right-0 bg-blue-primary text-white px-4 py-1 rounded-bl-2xl rounded-tr-2xl text-sm font-semibold">
                      Most Popular
                    </div>
                  )}

                  <div className="w-16 h-16 bg-lavender rounded-2xl flex items-center justify-center mb-6">
                    <Icon className="w-8 h-8 text-blue-primary" strokeWidth={2.5} />
                  </div>

                  <div className="text-4xl font-bold mb-2 text-blue-primary">${tier.amount}</div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">
                    {tier.title}
                  </h3>
                  <p className="text-gray-600 mb-4">{tier.description}</p>
                  <div className="flex items-center gap-2 text-pink font-semibold">
                    <Check className="w-5 h-5" />
                    <span>{tier.impact}</span>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Custom Amount */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-2xl mx-auto bg-white rounded-3xl shadow-lg p-8"
          >
            <h3 className="text-2xl font-bold text-center mb-6 text-gray-900">
              Or Enter a Custom Amount
            </h3>
            <div className="flex items-center gap-4">
              <div className="relative flex-1">
                <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-6 h-6" />
                <input
                  type="number"
                  placeholder="Enter amount"
                  value={customAmount}
                  onChange={(e) => setCustomAmount(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 text-2xl border-2 border-gray-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-primary/20 focus:border-blue-primary"
                />
              </div>
              <button className="bg-blue-primary text-white px-10 py-4 rounded-2xl font-bold text-lg hover:shadow-xl hover:scale-105 transition-all">
                Donate Now
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Trust Section */}
  <section className="py-20 px-6 bg-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6 text-gray-900">
            Your Donation is Secure & Tax-Deductible
          </h2>
          <p className="text-gray-600 text-lg mb-8">
            International Girls Academy is a registered 501(c)(3) nonprofit organization.
            Your contribution is tax-deductible to the fullest extent permitted by law.
          </p>
          <div className="flex flex-wrap justify-center gap-6 text-gray-500">
            <div className="flex items-center gap-2">
              <Check className="w-5 h-5 text-green-600" />
              <span>Secure Payment</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-5 h-5 text-green-600" />
              <span>Tax Receipt Provided</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-5 h-5 text-green-600" />
              <span>100% Transparent</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
