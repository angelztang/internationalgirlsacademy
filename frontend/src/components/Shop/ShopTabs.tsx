import { Tabs, TabsList, TabsTrigger } from "../components/../ui/tabs";
import { ScrollArea } from "../../components/ui/scroll-area";
import { ShopItemCard } from "./ShopItemCard";

interface ShopTabsProps {
  activeCategory: string;
  setActiveCategory: (val: string) => void;
  filteredItems: any[];
  purchasedItems: string[];
  canPurchase: (item: any) => boolean;
  onPurchase: (item: any) => void;
  justPurchased: string | null;
}

export function ShopTabs({
  activeCategory,
  setActiveCategory,
  filteredItems,
  purchasedItems,
  canPurchase,
  onPurchase,
  justPurchased,
}: ShopTabsProps) {
  return (
    <Tabs
      value={activeCategory}
      onValueChange={setActiveCategory}
      className="mt-4"
    >
      <TabsList className="grid grid-cols-5 w-full">
        <TabsTrigger value="all">All Items</TabsTrigger>
        <TabsTrigger value="avatar">Avatars</TabsTrigger>
        <TabsTrigger value="badge">Badges</TabsTrigger>
        <TabsTrigger value="perk">Perks</TabsTrigger>
        <TabsTrigger value="exclusive">Exclusive</TabsTrigger>
      </TabsList>

      <ScrollArea className="h-[500px] mt-6 pr-4">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredItems.map((item) => (
            <ShopItemCard
              key={item.id}
              item={item}
              isPurchased={purchasedItems.includes(item.id)}
              canPurchase={canPurchase(item)}
              isLocked={item.requiresProgress && item.requiresProgress > 0}
              onPurchase={onPurchase}
              justPurchased={justPurchased}
            />
          ))}
        </div>

        {filteredItems.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-600">No items in this category yet</p>
          </div>
        )}
      </ScrollArea>
    </Tabs>
  );
}
