import { Card } from "../ui/card";
import { Star } from "lucide-react";
import { motion } from "motion/react";

interface RecommendedBannerProps {
  programName: string;
}

export function RecommendedBanner({ programName }: RecommendedBannerProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-8"
    >
      <Card className="p-6 bg-gradient-to-r from-purple-500 to-pink-500 text-white border-0">
        <div className="flex items-center gap-4">
          <Star className="w-8 h-8" />
          <div className="flex-1">
            <h3 className="text-2xl mb-1">Recommended for You!</h3>
            <p>
              Based on your answers, we think <strong>{programName}</strong>{" "}
              would be a great fit!
            </p>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
