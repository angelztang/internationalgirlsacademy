import { motion } from "motion/react";
import { CheckCircle2, Lock, Circle } from "lucide-react";

interface PathStep {
  id: number;
  title: string;
  completed: boolean;
  locked: boolean;
}

interface ProgressBarProps {
  steps: PathStep[];
  currentStep: number;
  colors: { primary: string; secondary: string };
}

export default function ProgressBar({
  steps,
  currentStep,
  colors,
}: ProgressBarProps) {
  const completedSteps = steps.filter((s) => s.completed).length;
  const progressPercentage = (completedSteps / steps.length) * 100;
  const currentProgressPercentage = ((currentStep + 1) / steps.length) * 100;

  return (
    <div className="space-y-2 w-full">
      {/* Header */}
      <div className="flex items-center justify-between text-sm">
        <span className="text-gray-600">Your Progress</span>
        <span className={`text-blue-primary`}>
          {Math.round(progressPercentage)}% Complete
        </span>
      </div>

      {/* Progress Bar */}
      <div className="relative">
        {/* Background */}
        <div className="h-4 bg-gray-200 rounded-full overflow-hidden">
          {/* Completed progress */}
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progressPercentage}%` }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className={`h-full bg-gradient-to-r ${colors.primary} relative`}
          >
            {/* Shine effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse" />
          </motion.div>

          {/* Current position indicator */}
          {currentProgressPercentage > progressPercentage && (
            <motion.div
              initial={{ width: 0 }}
              animate={{
                width: `${currentProgressPercentage - progressPercentage}%`,
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

                {/* Tooltip */}
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

      {/* Labels */}
      <div className="flex justify-between text-xs text-gray-500 mt-1">
        <span>Start</span>
        <span
          className={
            completedSteps === steps.length ? "text-green-600 font-medium" : ""
          }
        >
          {completedSteps === steps.length ? "Complete! 🎉" : "Finish"}
        </span>
      </div>
    </div>
  );
}
