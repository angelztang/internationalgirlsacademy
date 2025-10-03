import { motion } from "motion/react";
import { Lock, CheckCircle2, Circle } from "lucide-react";

interface PathStep {
  id: number;
  title: string;
  icon: string;
  completed: boolean;
  locked: boolean;
}

interface PathStepsProps {
  steps: PathStep[];
  currentStep: number;
  colors: { primary: string; secondary: string; accent: string };
  setCurrentStep: (idx: number) => void;
}

export default function PathSteps({
  steps,
  currentStep,
  colors,
  setCurrentStep,
}: PathStepsProps) {
  const positions = [
    { top: "0", left: "0%" },
    { top: "60px", left: "25%" },
    { top: "0px", left: "50%" },
    { top: "60px", left: "75%" },
    { top: "0px", left: "100%" },
  ];

  return (
    <div className="relative mb-12">
      <svg className="absolute inset-0 w-full h-full" style={{ zIndex: 0 }}>
        <path
          d={`M 100 50 Q 300 50 400 150 T 700 150 Q 900 150 1000 250`}
          stroke="#e5e7eb"
          strokeWidth="4"
          fill="none"
          strokeDasharray="8,8"
        />
      </svg>

      <div className="relative flex justify-between items-start flex-wrap gap-8 py-8">
        {steps.map((step, idx) => (
          <motion.div
            key={step.id}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: idx * 0.1 }}
            className="absolute"
            style={{
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
        ))}
      </div>
    </div>
  );
}
