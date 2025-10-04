import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import {
  ArrowLeft,
  Link,
  ShoppingBag,
  Star,
  Target,
  Trophy,
} from "lucide-react";
import { motion } from "motion/react";
import ProgressBar from "./ProgressBar";

interface PathStep {
  id: number;
  title: string;
  description: string;
  icon: string;
  completed: boolean;
  locked: boolean;
}

type PathType = "student" | "volunteer" | "donate";

interface HeaderProps {
  pathType: PathType;
  onBack: () => void;
  studentPoints: number;
  currentStep: number;
  totalSteps: PathStep[];
  completedSteps: number;
  onShopOpen: () => void;
}

export default function Header({
  pathType,
  onBack,
  studentPoints,
  currentStep,
  totalSteps,
  completedSteps,
  onShopOpen,
}: HeaderProps) {
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

  const colors = pathColors[pathType] || pathColors.student;

  return (
    <div className="bg-white shadow-sm sticky top-0 z-50 w-full">
      <div className="flex flex-wrap gap-4 sm:gap-6 items-center px-4 sm:px-10 py-3 sm:py-4 w-full">
        {/* Back Button */}
        <Link href="/home">
          <Button variant="ghost" className="gap-2 flex-shrink-0">
            <ArrowLeft className="w-4 h-4" /> Back
          </Button>
        </Link>

        {/* Progress Bar - takes full width */}
        <div className="flex-1 w-full max-w-full ">
          <ProgressBar
            steps={totalSteps}
            currentStep={completedSteps}
            colors={colors}
          />
        </div>

        {/* Shop Button (student only) */}
        {pathType === "student" && (
          <Button
            onClick={onShopOpen}
            className="bg-[#4455f0] gap-2 text-white relative flex-shrink-0"
          >
            <ShoppingBag className="w-4 h-4" />
            <span className="hidden sm:inline">Shop</span>
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

        {/* Module Info */}
        <Button
          onClick={onShopOpen}
          className="bg-[#4455f0] gap-2 relative hover:bg-[#3344df] transition-all text-white"
        >
          <ShoppingBag className="w-4 h-4" /> Shop
          <Badge className="bg-white text-[#4455f0] ml-1 border-0">
            <Star className="w-3 h-3 mr-1" />
            {studentPoints}
          </Badge>
        </Button>
      </div>
    </div>
  );
}
