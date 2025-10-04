"use client";

export const dynamic = 'force-dynamic'

import { useState, useEffect, Suspense } from "react";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { ArrowLeft, Trophy, Target, ShoppingBag, Star } from "lucide-react";
import { motion } from "motion/react";
import { useRouter } from "next/navigation";
import PathSteps from "../../components/PathwayMap/PathSteps";
import StepContent from "../../components/PathwayMap/StepContent";
import Shop from "../../components/Shop/Shop";
import { ChatBot } from "@/components/Busybot/ChatBot";
import { useSearchParams } from "next/navigation";
import { CommentThread } from "@/components/CommentThread/CommentThread";
import Header from "@/components/PathwayMap/Header";
import { getUserModules, updateModuleProgress, createModule } from "@/lib/api/modules";
import { useAuth } from "@/context/AuthContext";

interface PathStep {
  id: number;
  title: string;
  description: string;
  icon: string;
  completed: boolean;
  locked: boolean;
}

interface PathwayMapProps {
  pathType?: "student" | "volunteer" | "donate";
  onBack?: () => void;
  onStepChange?: (stepInfo: {
    pathType: "student" | "volunteer" | "donate";
    currentStep: number;
    stepTitle: string;
  }) => void;
  onComplete?: () => void;
}

function PathwayMapContent({
  pathType,
  onBack = () => {},
  onStepChange,
  onComplete,
}: PathwayMapProps = {}) {
  // allow path to be passed via search params (e.g. /PathwayMap?path=volunteer)
  const searchParams = useSearchParams();
  const paramPath = searchParams?.get("path") as
    | "student"
    | "volunteer"
    | "donate"
    | null;

  // resolvedPathType prefers explicit prop, then search param, then default student
  const resolvedPathType: "student" | "volunteer" | "donate" =
    pathType || paramPath || "student";

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
    resolvedPathType === "student"
      ? studentSteps
      : resolvedPathType === "volunteer"
      ? volunteerSteps
      : donateSteps;

  const [currentSteps, setCurrentSteps] = useState<PathStep[]>(steps);
  const [currentStep, setCurrentStep] = useState(0);
  const [showShop, setShowShop] = useState(false);
  const [studentPoints, setStudentPoints] = useState(0);
  const [purchasedItems, setPurchasedItems] = useState<string[]>([]);
  const router = useRouter();
  const { user, isLoading } = useAuth();
  const userId = user?.id; // Get UUID from auth context
  const [userModules, setUserModules] = useState<Array<{module_id: number; user_id: string; progress: number}>>([]);
  const [isLoadingModules, setIsLoadingModules] = useState(false);

  // Protect route - require authentication
  useEffect(() => {
    if (!isLoading && !user) {
      // Store intended path for post-login redirect
      const currentPath = `/PathwayMap${paramPath ? `?path=${paramPath}` : ''}`;
      router.push(`/login?redirect=${encodeURIComponent(currentPath)}`);
    }
  }, [user, isLoading, router, paramPath]);

  // Calculate student points
  useEffect(() => {
    const completedSteps = currentSteps.filter((s) => s.completed).length;
    setStudentPoints(Math.round((completedSteps / currentSteps.length) * 100));
  }, [currentSteps]);

  // Fetch user modules on mount 
  useEffect(() => {
    if (!userId) return; // Wait for auth to load
    
    const loadModules = async () => {
      try {
        setIsLoadingModules(true);
        const data = await getUserModules(userId);
        setUserModules(data.modules);
      } catch (error) {
        console.error('Failed to load modules:', error);
      } finally {
        setIsLoadingModules(false);
      }
    };

    loadModules();
  }, [userId]);

  // Notify parent when step changes
  useEffect(() => {
    if (onStepChange) {
      onStepChange({
        pathType: resolvedPathType,
        currentStep,
        stepTitle: currentSteps[currentStep].title,
      });
    }
  }, [currentStep, currentSteps, onStepChange, pathType]);

  const completeStep = async (stepId: number) => {
    setCurrentSteps((prev) =>
      prev.map((s, idx) => ({
        ...s,
        completed: idx === stepId ? true : s.completed,
        locked: idx === stepId + 1 ? false : s.locked,
      }))
    );

    // Update progress in backend
    try {
      const newProgress = Math.round(((stepId + 1) / currentSteps.length) *
  100);

      // Find or create module for this user
      const existingModule = userModules.find(m => m.user_id === userId);

      if (existingModule) {
        await updateModuleProgress(existingModule.module_id, newProgress);
      }
      // If no module exists, create one
      else if (userId) {
        const newModule = await createModule({
          user_id: userId,
          progress: newProgress
        });
        setUserModules([...userModules, newModule]);
      }
    } catch (error) {
      console.error('Failed to update module progress:', error);
    }

    if (stepId < currentSteps.length - 1) setCurrentStep(stepId + 1);
    else if (
      (resolvedPathType === "student" || resolvedPathType === "volunteer") &&
      onComplete
    ) {
      setTimeout(onComplete, 500);
    }
  };

  const handlePurchase = (itemId: string) =>
    setPurchasedItems([...purchasedItems, itemId]);

  const colors = pathColors[resolvedPathType];
  const completedSteps = currentSteps.filter((step) => step.completed).length;
  return (
    <div className="min-h-screen bg-[#b4bbf8]/10">
      <Header
        pathType={resolvedPathType}
        onBack={onBack}
        studentPoints={studentPoints}
        currentStep={currentStep}
        totalSteps={steps}
        completedSteps={completedSteps}
        onShopOpen={() => setShowShop(true)}
      />

      <div className="container mx-auto px-4 py-12">
        <PathSteps
          steps={currentSteps}
          currentStep={currentStep}
          colors={pathColors[resolvedPathType]}
          setCurrentStep={setCurrentStep}
        />
        <div className="flex mt-32">
          <StepContent
            currentStepData={currentSteps[currentStep]}
            pathType={resolvedPathType}
            colors={pathColors[resolvedPathType]}
            currentStep={currentStep}
            steps={currentSteps}
            completeStep={completeStep}
            setCurrentStep={setCurrentStep}
          />
        </div>
      </div>

      {resolvedPathType === "student" && (
        <Shop
          isOpen={showShop}
          onClose={() => setShowShop(false)}
          availablePoints={studentPoints}
          onPurchase={handlePurchase}
        />
      )}
      {/* BusyBot chat button (same as homepage) */}
      <ChatBot />
    </div>
  );
}

export default function PathwayMap(props: PathwayMapProps = {}) {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#b4bbf8]/10 flex items-center justify-center">Loading...</div>}>
      <PathwayMapContent {...props} />
    </Suspense>
  );
}