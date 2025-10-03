import { motion } from "motion/react";

export default function ProgressBar({ steps, currentStep, colors }: any) {
  const completedSteps = steps.filter((s: any) => s.completed).length;
  const progressPercentage = (completedSteps / steps.length) * 100;
  const currentProgressPercentage = ((currentStep + 1) / steps.length) * 100;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-sm">
        <span className="text-gray-600">Your Progress</span>
        <span
          className={`bg-gradient-to-r ${colors.primary} bg-clip-text text-transparent`}
        >
          {Math.round(progressPercentage)}% Complete
        </span>
      </div>

      <div className="relative h-4 bg-gray-200 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${progressPercentage}%` }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className={`h-full bg-gradient-to-r ${colors.primary}`}
        />

        {currentProgressPercentage > progressPercentage && (
          <motion.div
            initial={{ width: 0 }}
            animate={{
              width: `${currentProgressPercentage - progressPercentage}%`,
            }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className={`h-full ${colors.secondary} opacity-60`}
          />
        )}
      </div>
    </div>
  );
}
