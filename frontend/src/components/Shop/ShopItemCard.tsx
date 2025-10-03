import { Card } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import { Check, Lock, Star, ShoppingBag } from "lucide-react";
import { motion } from "motion/react";

interface ShopItemCardProps {
  item: any;
  canPurchase: boolean;
  isPurchased: boolean;
  isLocked: boolean;
  onPurchase: (item: any) => void;
  justPurchased: string | null;
}

export function ShopItemCard({
  item,
  canPurchase,
  isPurchased,
  isLocked,
  onPurchase,
  justPurchased,
}: ShopItemCardProps) {
  const Icon = item.icon;

  return (
    <motion.div
      key={item.id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={justPurchased === item.id ? "scale-105" : ""}
    >
      <Card
        className={`
          p-4 relative overflow-hidden transition-all
          ${isPurchased ? "border-[#4455f0] border-2 shadow-lg" : ""}
          ${
            canPurchase && !isPurchased
              ? "hover:shadow-lg hover:border-[#b4bbf8] cursor-pointer"
              : ""
          }
          ${isLocked ? "opacity-50" : ""}
        `}
      >
        <div className={`absolute inset-0 ${item.color} opacity-10`} />
        <div className="relative">
          <div className="flex items-start justify-between mb-3">
            <div
              className={`w-12 h-12 rounded-full ${item.color} flex items-center justify-center`}
            >
              <Icon className="w-6 h-6 text-white" />
            </div>

            {isPurchased && (
              <Badge className="bg-[#4455f0] text-white border-0">
                <Check className="w-3 h-3 mr-1" /> Owned
              </Badge>
            )}
            {isLocked && (
              <Badge className="bg-[#b4bbf8] text-[#4455f0] border-0">
                <Lock className="w-3 h-3 mr-1" /> {item.requiresProgress}%
              </Badge>
            )}
          </div>

          <h3 className="text-lg mb-1">{item.name}</h3>
          <p className="text-sm text-gray-600 mb-4">{item.description}</p>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Star className="w-4 h-4 text-[#f7a1c0]" />
              <span className="text-lg">{item.cost}</span>
            </div>

            {isPurchased ? (
              <Button
                size="sm"
                disabled
                className="bg-[#4455f0] text-white border-0"
              >
                <Check className="w-4 h-4 mr-1" /> Purchased
              </Button>
            ) : isLocked ? (
              <Button size="sm" disabled variant="secondary">
                <Lock className="w-4 h-4 mr-1" /> Locked
              </Button>
            ) : canPurchase ? (
              <Button
                size="sm"
                onClick={() => onPurchase(item)}
                className={`${item.color} text-white border-0 hover:opacity-90 transition-opacity`}
              >
                <ShoppingBag className="w-4 h-4 mr-1" /> Buy
              </Button>
            ) : (
              <Button size="sm" disabled variant="secondary">
                Not Enough
              </Button>
            )}
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
