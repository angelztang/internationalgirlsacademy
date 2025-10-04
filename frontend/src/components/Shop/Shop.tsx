"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent } from "../../components/ui/dialog";
import { ShopHeader } from "./ShopHeader";
import { InfoCard } from "./InfoCard";
import { ConfettiEffect } from "./ConfettiEffect";
import { ShopTabs } from "./ShopTabs";
import { ProgressCard } from "./ProgressCard";
import { useAuth } from "@/context/AuthContext";
import {
  ShoppingBag,
  Star,
  Lock,
  Check,
  Sparkles,
  Trophy,
  Crown,
  Zap,
  Heart,
  Award,
  Gift,
  Palette,
  Music,
  Rocket,
  Camera,
  Book,
  Paintbrush,
  Headphones,
  Laptop,
} from "lucide-react";
import {
  getAllItems,
  getUserInventory,
  purchaseItem,
  Item as APIItem,
} from "@/lib/api/shop";

export default function Shop({
  isOpen,
  onClose,
  availablePoints,
  onPurchase,
}: any) {
  const [activeCategory, setActiveCategory] = useState("all");
  const [purchasedItems, setPurchasedItems] = useState<string[]>([]);
  const [showConfetti, setShowConfetti] = useState(false);
  const [justPurchased, setJustPurchased] = useState<string | null>(null);
  // new state variables
  const [apiItems, setApiItems] = useState<APIItem[]>([]);
  const [userInventory, setUserInventory] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();
  const userId = user?.id; // Get UUID from auth context

  // useEffect to fetch data
  useEffect(() => {
    if (isOpen && userId) {
      loadShopData();
    }
  }, [isOpen, userId]);

  const loadShopData = async () => {
    if (!userId) return; // Guard against undefined userId

    try {
      setIsLoading(true);
      const [items, inventory] = await Promise.all([
        getAllItems(),
        getUserInventory(userId),
      ]);
      setApiItems(items);
      setUserInventory(inventory);
    } catch (error) {
      console.error("Failed to load shop data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  interface ShopItem {
    id: string;
    name: string;
    description: string;
    cost: number;
    category: "avatar" | "badge" | "perk" | "exclusive";
    icon: any;
    color: string;
    requiresProgress?: number;
  }

  const shopItems: ShopItem[] = [
    // Avatar Items
    {
      id: "avatar-crown",
      name: "Golden Crown",
      description: "Show everyone you're royalty in learning!",
      cost: 20,
      category: "avatar",
      icon: Crown,
      color: "bg-[#f7a1c0]",
    },
    {
      id: "avatar-star",
      name: "Shining Star",
      description: "Sparkle on your profile picture",
      cost: 15,
      category: "avatar",
      icon: Star,
      color: "bg-[#b4bbf8]",
    },
    {
      id: "avatar-rocket",
      name: "Rocket Badge",
      description: "You're going places! 🚀",
      cost: 25,
      category: "avatar",
      icon: Rocket,
      color: "bg-[#4455f0]",
    },
    {
      id: "avatar-palette",
      name: "Artist Palette",
      description: "For the creative minds",
      cost: 20,
      category: "avatar",
      icon: Palette,
      color: "bg-[#f7a1c0]",
    },

    // Achievement Badges
    {
      id: "badge-early-bird",
      name: "Early Bird",
      description: "Awarded to dedicated learners",
      cost: 30,
      category: "badge",
      icon: Award,
      color: "bg-[#b4bbf8]",
    },
    {
      id: "badge-champion",
      name: "Champion Badge",
      description: "Show off your achievements!",
      cost: 40,
      category: "badge",
      icon: Trophy,
      color: "bg-[#f7a1c0]",
      requiresProgress: 50,
    },
    {
      id: "badge-genius",
      name: "Genius Badge",
      description: "For brilliant minds only",
      cost: 50,
      category: "badge",
      icon: Zap,
      color: "bg-[#4455f0]",
      requiresProgress: 75,
    },
    {
      id: "badge-mentor",
      name: "Mentor Badge",
      description: "Help others and earn this badge",
      cost: 35,
      category: "badge",
      icon: Heart,
      color: "bg-[#f7a1c0]",
    },

    // Perks
    {
      id: "perk-skip",
      name: "Quiz Skip Pass",
      description: "Skip one quiz (use wisely!)",
      cost: 45,
      category: "perk",
      icon: Sparkles,
      color: "bg-[#b4bbf8]",
      requiresProgress: 40,
    },
    {
      id: "perk-priority",
      name: "Priority Support",
      description: "Get faster mentor responses for 1 week",
      cost: 35,
      category: "perk",
      icon: Zap,
      color: "bg-[#4455f0]",
    },
    {
      id: "perk-custom",
      name: "Custom Profile Theme",
      description: "Unlock custom colors for your dashboard",
      cost: 55,
      category: "perk",
      icon: Paintbrush,
      color: "bg-[#f7a1c0]",
      requiresProgress: 60,
    },

    // Exclusive Items
    {
      id: "exclusive-concert",
      name: "Virtual Concert Access",
      description: "Exclusive IGA community concert ticket",
      cost: 70,
      category: "exclusive",
      icon: Music,
      color: "bg-[#4455f0]",
      requiresProgress: 80,
    },
    {
      id: "exclusive-workshop",
      name: "Premium Workshop",
      description: "1-on-1 session with industry expert",
      cost: 90,
      category: "exclusive",
      icon: Laptop,
      color: "bg-[#b4bbf8]",
      requiresProgress: 85,
    },
    {
      id: "exclusive-merch",
      name: "IGA Swag Package",
      description: "Physical merch shipped to you!",
      cost: 100,
      category: "exclusive",
      icon: Gift,
      color: "bg-[#4455f0]",
      requiresProgress: 90,
    },
  ];

  const handlePurchase = async (item: any) => {
    if (!userId) {
      console.error("User not authenticated");
      return;
    }

    try {
      const response = await purchaseItem(userId, {
        item_id: item.item_id || item.id,
        quantity: 1,
      });

      setPurchasedItems([...purchasedItems, item.id]);
      setJustPurchased(item.id);
      setShowConfetti(true);

      // Reload inventory
      await loadShopData();

      setTimeout(() => {
        setShowConfetti(false);
        setJustPurchased(null);
      }, 2000);
    } catch (error: any) {
      alert(error.message || "Failed to purchase item");
    }
  };

  const canPurchase = (item: any) => {
    if (purchasedItems.includes(item.id)) return false;
    if (availablePoints < item.cost) return false;
    if (item.requiresProgress && availablePoints < item.requiresProgress)
      return false;
    return true;
  };

  const filteredItems =
    activeCategory === "all"
      ? shopItems
      : shopItems.filter((item) => item.category === activeCategory);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl  overflow-hidden absolute">
        <ShopHeader availablePoints={availablePoints} />
        <InfoCard />
        <ConfettiEffect show={showConfetti} />
        <ShopTabs
          activeCategory={activeCategory}
          setActiveCategory={setActiveCategory}
          filteredItems={filteredItems}
          purchasedItems={purchasedItems}
          canPurchase={canPurchase}
          onPurchase={handlePurchase}
          justPurchased={justPurchased}
        />
        <ProgressCard
          purchasedCount={purchasedItems.length}
          progress={availablePoints}
        />
      </DialogContent>
    </Dialog>
  );
}
