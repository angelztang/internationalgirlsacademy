import { Card } from "../../components/ui/card";
import { Badge } from "../ui/badge";
import { Sparkles } from "lucide-react";

export function ProgressCard({
  purchasedCount,
  progress,
}: {
  purchasedCount: number;
  progress: number;
}) {
  return (
    <Card className="mt-4 p-4 bg-[#b4bbf8]/20 border border-[#b4bbf8]">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Sparkles className="w-5 h-5 text-[#4455f0]" />
          <div>
            <p className="text-sm">
              Keep completing modules to earn more points!
            </p>
            <p className="text-xs text-gray-600">
              You've unlocked {purchasedCount} items so far
            </p>
          </div>
        </div>
        <Badge className="bg-[#4455f0] text-white border-0">
          {progress}% Progress
        </Badge>
      </div>
    </Card>
  );
}
