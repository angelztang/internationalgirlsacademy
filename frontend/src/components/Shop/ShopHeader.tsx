import { ShoppingBag, Star } from "lucide-react";
import { Card } from "../../components/ui/card";
import {
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "../../components/ui/dialog";

interface ShopHeaderProps {
  availablePoints: number;
}

export function ShopHeader({ availablePoints }: ShopHeaderProps) {
  return (
    <DialogHeader>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-[#4455f0] flex items-center justify-center">
            <ShoppingBag className="w-6 h-6 text-white" />
          </div>
          <div>
            <DialogTitle className="text-2xl">IGA Points Shop</DialogTitle>
            <DialogDescription>
              Use your progress points to unlock awesome rewards!
            </DialogDescription>
          </div>
        </div>

        {/* Points Display */}
        <Card className="bg-[#4455f0] p-4 shadow-lg border-0">
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-1">
              <Star className="w-5 h-5 text-white" />
              <span className="text-2xl text-white">{availablePoints}</span>
            </div>
            <p className="text-xs text-white/90">Points Available</p>
          </div>
        </Card>
      </div>
    </DialogHeader>
  );
}
