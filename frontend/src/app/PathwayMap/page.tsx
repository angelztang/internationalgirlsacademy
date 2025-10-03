"use client";

import { useState, useEffect } from "react";
import { Button } from "../../components/ui/button";
import { Card } from "../../components/ui/card";
import { Progress } from "../../components/ui/progress";
import { Badge } from "../../components/ui/badge";
import {
  CheckCircle2,
  Circle,
  Lock,
  ArrowLeft,
  Sparkles,
  MessageCircle,
  Trophy,
  Target,
  ShoppingBag,
  Star,
} from "lucide-react";
import { motion } from "motion/react";
import Shop from "../../components/Shop/Shop";

interface PathStep {
  id: number;
  title: string;
  description: string;
  icon: string;
  completed: boolean;
  locked: boolean;
}

interface PathwayMapProps {
  pathType: "student" | "volunteer" | "donate";
  onBack: () => void;
  onStepChange?: (stepInfo: {
    pathType: "student" | "volunteer" | "donate";
    currentStep: number;
    stepTitle: string;
  }) => void;
  onComplete?: () => void;
}

const pathwayData = {
  student: [
    {
      id: 1,
      title: "Welcome!",
      description: "Get to know IGA and what we offer",
      icon: "👋",
      completed: false,
      locked: false,
    },
    {
      id: 2,
      title: "Intro Modules",
      description: "Learn about our community values",
      icon: "📚",
      completed: false,
      locked: true,
    },
    {
      id: 3,
      title: "Balance & Time",
      description: "Master your schedule and priorities",
      icon: "⏰",
      completed: false,
      locked: true,
    },
    {
      id: 4,
      title: "Program Selection",
      description: "Choose: After School, Entrepreneurship, or Alumni",
      icon: "🎯",
      completed: false,
      locked: true,
    },
    {
      id: 5,
      title: "Connect with Mentors",
      description: "Meet your mentor and start your journey",
      icon: "🤝",
      completed: false,
      locked: true,
    },
  ],
  volunteer: [
    {
      id: 1,
      title: "Welcome!",
      description: "Thank you for wanting to give back",
      icon: "💝",
      completed: false,
      locked: false,
    },
    {
      id: 2,
      title: "Training Modules",
      description: "Learn how to support and mentor",
      icon: "🎓",
      completed: false,
      locked: true,
    },
    {
      id: 3,
      title: "Choose Your Role",
      description: "Pick how you want to contribute",
      icon: "✨",
      completed: false,
      locked: true,
    },
    {
      id: 4,
      title: "Alumni System",
      description: "Connect with current students",
      icon: "🌟",
      completed: false,
      locked: true,
    },
    {
      id: 5,
      title: "Start Mentoring",
      description: "Begin your impact journey",
      icon: "🚀",
      completed: false,
      locked: true,
    },
  ],
  donate: [
    {
      id: 1,
      title: "Welcome!",
      description: "Every contribution makes a difference",
      icon: "💖",
      completed: false,
      locked: false,
    },
    {
      id: 2,
      title: "Our Impact",
      description: "See where your donation goes",
      icon: "📊",
      completed: false,
      locked: true,
    },
    {
      id: 3,
      title: "Student Stories",
      description: "Read real stories from our community",
      icon: "📖",
      completed: false,
      locked: true,
    },
    {
      id: 4,
      title: "Choose Your Impact",
      description: "Select donation amount and frequency",
      icon: "💰",
      completed: false,
      locked: true,
    },
    {
      id: 5,
      title: "Thank You!",
      description: "Join our donor community",
      icon: "🎉",
      completed: false,
      locked: true,
    },
  ],
};

const pathColors = {
  student: {
    primary: "bg-[#4455f0]",
    secondary: "bg-[#b4bbf8]/20",
    accent: "border-[#4455f0]",
  },
  volunteer: {
    primary: "bg-[#f7a1c0]",
    secondary: "bg-[#f7a1c0]/20",
    accent: "border-[#f7a1c0]",
  },
  donate: {
    primary: "bg-[#b4bbf8]",
    secondary: "bg-[#b4bbf8]/20",
    accent: "border-[#b4bbf8]",
  },
};

export default function PathwayMap({
  pathType,
  onBack,
  onStepChange,
  onComplete,
}: PathwayMapProps) {
  pathType = pathType || "student"; // Default to student if not provided
  const [steps, setSteps] = useState<PathStep[]>(pathwayData[pathType]);
  const [currentStep, setCurrentStep] = useState(0);
  const [showShop, setShowShop] = useState(false);
  const [studentPoints, setStudentPoints] = useState(0);
  const [purchasedItems, setPurchasedItems] = useState<string[]>([]);

  // Calculate student points based on progress
  useEffect(() => {
    const completedSteps = steps.filter((step) => step.completed).length;
    const points = Math.round((completedSteps / steps.length) * 100);
    setStudentPoints(points);
  }, [steps]);

  // Notify parent component when step changes
  useEffect(() => {
    if (onStepChange) {
      onStepChange({
        pathType,
        currentStep,
        stepTitle: steps[currentStep].title,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentStep]);

  const completeStep = (stepId: number) => {
    setSteps((prev) =>
      prev.map((step, idx) => ({
        ...step,
        completed: idx === stepId ? true : step.completed,
        locked: idx === stepId + 1 ? false : step.locked,
      }))
    );

    if (stepId < steps.length - 1) {
      setCurrentStep(stepId + 1);
    } else {
      // Last step completed - trigger onComplete for student and volunteer paths
      if ((pathType === "student" || pathType === "volunteer") && onComplete) {
        setTimeout(() => {
          onComplete();
        }, 1000); // Small delay to show completion animation
      }
    }
  };

  const handlePurchase = (itemId: string, cost: number) => {
    // In production, this would update the backend
    setPurchasedItems([...purchasedItems, itemId]);
    // Note: We don't deduct points as they represent progress, not a spendable currency
    // The shop uses points as a "unlock threshold" rather than spending them
  };

  const colors = pathColors[pathType];
  const currentStepData = steps[currentStep];

  // Calculate progress percentage
  const completedSteps = steps.filter((step) => step.completed).length;
  const progressPercentage = (completedSteps / steps.length) * 100;
  const currentProgressPercentage = ((currentStep + 1) / steps.length) * 100;

  return (
    <div className="min-h-screen bg-[#b4bbf8]/10">
      {/* Header with Progress Bar */}
      <div className="bg-white shadow-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <Button variant="ghost" onClick={onBack} className="gap-2">
              <ArrowLeft className="w-4 h-4" />
              Back to Home
            </Button>
            <div className="flex items-center gap-4">
              {/* Shop Button - Only for students */}
              {pathType === "student" && (
                <Button
                  onClick={() => setShowShop(true)}
                  className="bg-[#4455f0] gap-2 relative hover:bg-[#3344df] transition-all text-white"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Shop</span>
                  <Badge className="bg-white text-[#4455f0] ml-1 border-0">
                    <Star className="w-3 h-3 mr-1" />
                    {studentPoints}
                  </Badge>
                  {studentPoints >= 20 && (
                    <motion.div
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ repeat: Infinity, duration: 2 }}
                      className="absolute -top-1 -right-1 w-3 h-3 bg-[#f7a1c0] rounded-full shadow-lg"
                    />
                  )}
                </Button>
              )}

              <div className="flex items-center gap-2">
                <Target className="w-5 h-5 text-[#4455f0]" />
                <span className="text-sm">
                  Module {currentStep + 1} of {steps.length}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Trophy className="w-5 h-5 text-[#f7a1c0]" />
                <span className="text-sm">{completedSteps} completed</span>
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Your Progress</span>
              <span
                className={`bg-gradient-to-r ${colors.primary} bg-clip-text text-transparent`}
              >
                {Math.round(progressPercentage)}% Complete
              </span>
            </div>

            {/* Dual Progress Bar - Shows both current position and completed modules */}
            <div className="relative">
              {/* Background */}
              <div className="h-4 bg-gray-200 rounded-full overflow-hidden">
                {/* Completed progress (solid) */}
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${progressPercentage}%` }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                  className={`h-full bg-gradient-to-r ${colors.primary} relative`}
                >
                  {/* Shine effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse" />
                </motion.div>

                {/* Current position indicator (lighter shade) */}
                {currentProgressPercentage > progressPercentage && (
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{
                      width: `${
                        currentProgressPercentage - progressPercentage
                      }%`,
                    }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                    className={`h-full ${colors.secondary} opacity-60`}
                    style={{ marginTop: "-100%" }}
                  />
                )}
              </div>

              {/* Module Markers */}
              <div className="absolute inset-0 flex justify-between items-center px-1">
                {steps.map((step, idx) => {
                  const position = ((idx + 1) / steps.length) * 100;
                  return (
                    <div
                      key={step.id}
                      className="relative"
                      style={{
                        position: "absolute",
                        left: `${position}%`,
                        transform: "translateX(-50%)",
                      }}
                    >
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: idx * 0.1 }}
                        className={`
                          w-6 h-6 rounded-full border-2 border-white flex items-center justify-center
                          ${
                            step.completed
                              ? `bg-gradient-to-br ${colors.primary} shadow-md`
                              : currentStep === idx
                              ? "bg-yellow-400 ring-2 ring-yellow-300 animate-pulse"
                              : step.locked
                              ? "bg-gray-300"
                              : `${colors.secondary} border-4`
                          }
                        `}
                      >
                        {step.completed ? (
                          <CheckCircle2 className="w-4 h-4 text-white" />
                        ) : step.locked ? (
                          <Lock className="w-3 h-3 text-gray-500" />
                        ) : currentStep === idx ? (
                          <Circle className="w-3 h-3 text-white fill-white" />
                        ) : (
                          <Circle className="w-3 h-3 text-gray-400" />
                        )}
                      </motion.div>

                      {/* Tooltip on hover */}
                      <div className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 opacity-0 hover:opacity-100 transition-opacity pointer-events-none">
                        <div className="bg-gray-900 text-white text-xs rounded py-1 px-2 whitespace-nowrap">
                          {step.title}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Module Labels */}
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>Start</span>
              <span
                className={
                  completedSteps === steps.length
                    ? "text-green-600 font-medium"
                    : ""
                }
              >
                {completedSteps === steps.length ? "Complete! 🎉" : "Finish"}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          {/* Progress Path - Candy Crush Style */}
          <div className="relative mb-12">
            <svg
              className="absolute inset-0 w-full h-full"
              style={{ zIndex: 0 }}
            >
              <path
                d={`M 100 50 Q 300 50 400 150 T 700 150 Q 900 150 1000 250`}
                stroke="#e5e7eb"
                strokeWidth="4"
                fill="none"
                strokeDasharray="8,8"
              />
            </svg>

            <div className="relative flex justify-between items-start flex-wrap gap-8 py-8">
              {steps.map((step, idx) => {
                const positions = [
                  { top: "0", left: "0%" },
                  { top: "60px", left: "25%" },
                  { top: "0px", left: "50%" },
                  { top: "60px", left: "75%" },
                  { top: "0px", left: "100%" },
                ];

                return (
                  <motion.div
                    key={step.id}
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: idx * 0.1 }}
                    className="relative"
                    style={{
                      position: "absolute",
                      top: positions[idx]?.top || "0",
                      left: positions[idx]?.left || `${idx * 20}%`,
                      transform: "translateX(-50%)",
                    }}
                  >
                    <div className="flex flex-col items-center gap-2">
                      <button
                        onClick={() => !step.locked && setCurrentStep(idx)}
                        disabled={step.locked}
                        className={`
                          w-20 h-20 rounded-full flex items-center justify-center text-3xl
                          transition-all duration-300 shadow-lg
                          ${
                            step.completed
                              ? `bg-gradient-to-br ${colors.primary} text-white scale-110`
                              : step.locked
                              ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                              : `${colors.secondary} border-4 ${colors.accent} hover:scale-110 cursor-pointer`
                          }
                          ${
                            currentStep === idx
                              ? "ring-4 ring-yellow-400 animate-pulse"
                              : ""
                          }
                        `}
                      >
                        {step.locked ? (
                          <Lock className="w-8 h-8" />
                        ) : step.completed ? (
                          <CheckCircle2 className="w-10 h-10" />
                        ) : (
                          <span>{step.icon}</span>
                        )}
                      </button>
                      <div className="text-center max-w-[100px]">
                        <p className="text-xs">{step.title}</p>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Current Step Content with Comments */}
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-32"
          >
            <div className="grid lg:grid-cols-3 gap-6">
              {/* Main Module Content */}
              <div className="lg:col-span-2">
                <Card className="p-8 shadow-xl">
                  <div className="text-center mb-8">
                    <div className="text-6xl mb-4">{currentStepData.icon}</div>
                    <h2 className="text-3xl mb-3">{currentStepData.title}</h2>
                    <p className="text-gray-600">
                      {currentStepData.description}
                    </p>
                  </div>

                  <div className="space-y-4">
                    {pathType === "student" && currentStep === 0 && (
                      <div className="space-y-3 text-gray-700">
                        <p>
                          🎓 Welcome to International Girls Academy! We're so
                          excited to have you here.
                        </p>
                        <p>
                          ✨ You're about to embark on a journey of learning,
                          growth, and connection.
                        </p>
                        <p>
                          🌍 Join thousands of students worldwide in our
                          supportive community.
                        </p>
                      </div>
                    )}

                    {pathType === "volunteer" && currentStep === 0 && (
                      <div className="space-y-3 text-gray-700">
                        <p>
                          💝 Thank you for choosing to give back to our
                          community!
                        </p>
                        <p>
                          👩‍🏫 Your experience and guidance will change lives.
                        </p>
                        <p>🤗 Let's get you set up to make a real impact.</p>
                      </div>
                    )}

                    {pathType === "donate" && currentStep === 0 && (
                      <div className="space-y-3 text-gray-700">
                        <p>
                          💖 Your generosity helps us empower students around
                          the world.
                        </p>
                        <p>
                          📈 100% transparency: see exactly where your donation
                          goes.
                        </p>
                        <p>
                          🌟 Join our community of supporters making education
                          accessible.
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="mt-8 flex gap-4 justify-center">
                    {currentStep > 0 && (
                      <Button
                        variant="outline"
                        onClick={() => setCurrentStep(currentStep - 1)}
                      >
                        Previous
                      </Button>
                    )}

                    {!currentStepData.completed && (
                      <Button
                        className={`bg-gradient-to-r ${colors.primary} text-white px-8`}
                        onClick={() => completeStep(currentStep)}
                      >
                        {currentStep === steps.length - 1
                          ? "Complete Journey"
                          : "Next Step"}
                      </Button>
                    )}

                    {currentStepData.completed &&
                      currentStep < steps.length - 1 && (
                        <Button
                          className={`bg-gradient-to-r ${colors.primary} text-white px-8`}
                          onClick={() => setCurrentStep(currentStep + 1)}
                        >
                          Continue
                        </Button>
                      )}
                  </div>

                  {/* Helper text */}
                  <div className="mt-6 text-center text-sm text-gray-500">
                    💡 Tip: Complete each step to unlock the next part of your
                    journey
                  </div>

                  {/* BusyBot reminder */}
                  <div className="mt-4 p-4 bg-[#b4bbf8]/20 rounded-lg border border-[#b4bbf8]">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-[#4455f0] rounded-full flex items-center justify-center flex-shrink-0">
                        <MessageCircle className="w-5 h-5 text-white" />
                      </div>
                      <div className="flex-1">
                        <h4 className="text-sm mb-1">Need Help?</h4>
                        <p className="text-xs text-gray-600">
                          Click the BusyBot 🤖 in the bottom right to ask
                          questions about this step!
                        </p>
                      </div>
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
      {/* Shop Modal */}
      {pathType === "student" && (
        <Shop
          isOpen={showShop}
          onClose={() => setShowShop(false)}
          availablePoints={studentPoints}
          onPurchase={handlePurchase}
        />
      )}
    </div>
  );
}
