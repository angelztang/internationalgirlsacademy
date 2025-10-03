"use client";

import { useState, useEffect } from "react";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { ArrowLeft, Trophy, Target, ShoppingBag, Star } from "lucide-react";
import { motion } from "motion/react";
import PathSteps from "../../components/PathwayMap/PathSteps";
import StepContent from "../../components/PathwayMap/StepContent";
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

export default function PathwayMap({
  pathType,
  onBack,
  onStepChange,
  onComplete,
}: PathwayMapProps) {
  pathType = pathType || "student";

  // Inline step data
  const studentSteps: PathStep[] = [
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
  ];

  const volunteerSteps: PathStep[] = [
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
  ];

  const donateSteps: PathStep[] = [
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
  ];

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

  const steps =
    pathType === "student"
      ? studentSteps
      : pathType === "volunteer"
      ? volunteerSteps
      : donateSteps;

  const [currentSteps, setCurrentSteps] = useState<PathStep[]>(steps);
  const [currentStep, setCurrentStep] = useState(0);
  const [showShop, setShowShop] = useState(false);
  const [studentPoints, setStudentPoints] = useState(0);
  const [purchasedItems, setPurchasedItems] = useState<string[]>([]);

  // Calculate student points
  useEffect(() => {
    const completedSteps = currentSteps.filter((s) => s.completed).length;
    setStudentPoints(Math.round((completedSteps / currentSteps.length) * 100));
  }, [currentSteps]);

  // Notify parent when step changes
  useEffect(() => {
    if (onStepChange) {
      onStepChange({
        pathType,
        currentStep,
        stepTitle: currentSteps[currentStep].title,
      });
    }
  }, [currentStep, currentSteps, onStepChange, pathType]);

  const completeStep = (stepId: number) => {
    setCurrentSteps((prev) =>
      prev.map((s, idx) => ({
        ...s,
        completed: idx === stepId ? true : s.completed,
        locked: idx === stepId + 1 ? false : s.locked,
      }))
    );
    if (stepId < currentSteps.length - 1) setCurrentStep(stepId + 1);
    else if (
      (pathType === "student" || pathType === "volunteer") &&
      onComplete
    ) {
      setTimeout(onComplete, 500);
    }
  };

  const handlePurchase = (itemId: string) =>
    setPurchasedItems([...purchasedItems, itemId]);

  return (
    <div className="min-h-screen bg-[#b4bbf8]/10">
      <div className="bg-white shadow-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Button variant="ghost" onClick={onBack} className="gap-2">
            <ArrowLeft className="w-4 h-4" /> Back
          </Button>

          {pathType === "student" && (
            <Button
              onClick={() => setShowShop(true)}
              className="bg-[#4455f0] gap-2 relative hover:bg-[#3344df] transition-all text-white"
            >
              <ShoppingBag className="w-4 h-4" /> Shop
              <Badge className="bg-white text-[#4455f0] ml-1 border-0">
                <Star className="w-3 h-3 mr-1" />
                {studentPoints}
              </Badge>
            </Button>
          )}
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <PathSteps
          steps={currentSteps}
          currentStep={currentStep}
          colors={pathColors[pathType]}
          setCurrentStep={setCurrentStep}
        />
        <StepContent
          currentStepData={currentSteps[currentStep]}
          pathType={pathType}
          colors={pathColors[pathType]}
          currentStep={currentStep}
          steps={currentSteps}
          completeStep={completeStep}
          setCurrentStep={setCurrentStep}
        />
      </div>

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
