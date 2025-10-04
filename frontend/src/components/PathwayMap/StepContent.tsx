import { Card } from "../ui/card";
import { Button } from "../ui/button";
import BusyBotReminder from "./BusyBotReminder";
import { CommentThread } from "../CommentThread/CommentThread";

interface PathStep {
  id: number;
  title: string;
  description: string;
  icon: string;
  completed: boolean;
  locked: boolean;
}

interface StepContentProps {
  currentStepData: PathStep;
  pathType: "student" | "volunteer" | "donate";
  colors: { primary: string; secondary: string; accent: string };
  currentStep: number;
  steps: PathStep[];
  completeStep: (stepId: number) => void;
  setCurrentStep: (idx: number) => void;
}

export default function StepContent({
  currentStepData,
  pathType,
  colors,
  currentStep,
  steps,
  completeStep,
  setCurrentStep,
}: StepContentProps) {
  return (
    <div className=" grid lg:grid-cols-3 gap-6 w-full ">
      <div className="lg:col-span-2">
        <Card className="p-8 shadow-xl">
          <div className="text-center mb-8">
            <div className="text-6xl mb-4">{currentStepData.icon}</div>
            <h2 className="text-3xl mb-3">{currentStepData.title}</h2>
            <p className="text-gray-600">{currentStepData.description}</p>
          </div>

          <div className="space-y-4">
            {pathType === "student" && currentStep === 0 && (
              <div className="space-y-3 text-gray-700">
                <p>
                  🎓 Welcome to International Girls Academy! We're so excited to
                  have you here.
                </p>
                <p>
                  ✨ You're about to embark on a journey of learning, growth,
                  and connection.
                </p>
                <p>
                  🌍 Join thousands of students worldwide in our supportive
                  community.
                </p>
              </div>
            )}
            {pathType === "volunteer" && currentStep === 0 && (
              <div className="space-y-3 text-gray-700">
                <p>💝 Thank you for choosing to give back to our community!</p>
                <p>👩‍🏫 Your experience and guidance will change lives.</p>
                <p>🤗 Let's get you set up to make a real impact.</p>
              </div>
            )}
            {pathType === "donate" && currentStep === 0 && (
              <div className="space-y-3 text-gray-700">
                <p>
                  💖 Your generosity helps us empower students around the world.
                </p>
                <p>
                  📈 100% transparency: see exactly where your donation goes.
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
                className={`bg-blue-primary text-white px-8`}
                onClick={() => completeStep(currentStep)}
              >
                {currentStep === steps.length - 1
                  ? "Complete Journey"
                  : "Next Step"}
              </Button>
            )}

            {currentStepData.completed && currentStep < steps.length - 1 && (
              <Button
                className={`bg-blue-primary text-white px-8`}
                onClick={() => setCurrentStep(currentStep + 1)}
              >
                Continue
              </Button>
            )}
          </div>

          <div className="mt-6 text-center text-sm text-gray-500">
            💡 Tip: Complete each step to unlock the next part of your journey
          </div>

          <BusyBotReminder />
        </Card>
      </div>
      <div>
        <CommentThread
          pathType={pathType}
          stepNumber={currentStep + 1}
          key={`${pathType}-step-${currentStep + 1}-comments`}
          stepTitle={currentStepData.title}
        />
      </div>
    </div>
  );
}
