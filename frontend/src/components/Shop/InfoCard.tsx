import { Card } from "../../components/ui/card";
import { Sparkles } from "lucide-react";

export function InfoCard() {
  return (
    <Card className="mt-4 p-4 bg-[#b4bbf8]/20 border-2 border-[#b4bbf8]">
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-full bg-[#4455f0] flex items-center justify-center flex-shrink-0">
          <Sparkles className="w-5 h-5 text-white" />
        </div>
        <div>
          <h4 className="mb-1">How Points Work</h4>
          <p className="text-sm text-gray-600">
            Your points = your progress! Each completed module earns you ~20
            points. Points unlock items but don't get spent - keep progressing
            to unlock everything! 🎉
          </p>
        </div>
      </div>
    </Card>
  );
}
