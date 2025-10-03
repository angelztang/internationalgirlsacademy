import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { ArrowLeft, ShoppingBag, Star, Target, Trophy } from "lucide-react";
import { motion } from "motion/react";

export default function Header({
  pathType,
  onBack,
  studentPoints,
  currentStep,
  totalSteps,
  completedSteps,
  onShopOpen,
}: any) {
  return (
    <div className="bg-white shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Button variant="ghost" onClick={onBack} className="gap-2">
          <ArrowLeft className="w-4 h-4" /> Back to Home
        </Button>

        <div className="flex items-center gap-4">
          {pathType === "student" && (
            <Button
              onClick={onShopOpen}
              className="bg-[#4455f0] gap-2 text-white relative"
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
              Module {currentStep + 1} of {totalSteps}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-[#f7a1c0]" />
            <span className="text-sm">{completedSteps} completed</span>
          </div>
        </div>
      </div>
    </div>
  );
}
