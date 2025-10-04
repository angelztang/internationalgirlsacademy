import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { CheckCircle2, Clock, Heart, Users, Star } from "lucide-react";
import { motion } from "motion/react";

interface ProgramCardProps {
  program: any;
  recommended: boolean;
  selected: boolean;
  onSelect: (id: string) => void;
}

export function ProgramCard({
  program,
  recommended,
  selected,
  onSelect,
}: ProgramCardProps) {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      <Card
        className={`overflow-hidden hover:shadow-xl transition-all h-full flex flex-col
        ${recommended ? "ring-2 ring-purple-500 ring-offset-2" : ""} 
        ${selected ? "ring-2 ring-green-500 ring-offset-2" : ""}`}
      >
        {/* Header */}
        <div className={`bg-${program.color} text-white p-6 h-48`}>
          <div className="flex items-start justify-between mb-3">
            <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
              <program.icon className="w-6 h-6" />
            </div>
            {recommended && (
              <Badge className="bg-yellow-400 text-yellow-900 flex items-center gap-1">
                <Star className="w-3 h-3" /> Match
              </Badge>
            )}
          </div>
          <h3 className="text-2xl mb-2">{program.name}</h3>
          <p className="text-sm opacity-90">{program.tagline}</p>
        </div>

        {/* Content */}
        <div className="p-6 flex-1 flex flex-col">
          <p className="text-sm text-gray-600 mb-4">{program.description}</p>

          <div className="space-y-2 mb-4 text-sm">
            <div className="flex items-center gap-2 text-gray-600">
              <Clock className="w-4 h-4" />{" "}
              <span>
                <strong>Duration:</strong> {program.duration}
              </span>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <Heart className="w-4 h-4" />{" "}
              <span>
                <strong>Commitment:</strong> {program.commitment}
              </span>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <Users className="w-4 h-4" />{" "}
              <span>
                <strong>Ages:</strong> {program.ageRange}
              </span>
            </div>
          </div>

          <div className="mb-4">
            <h4 className="text-sm mb-2">What You'll Get:</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              {program.benefits
                .slice(0, 3)
                .map((benefit: string, i: number) => (
                  <li key={i} className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                    <span>{benefit}</span>
                  </li>
                ))}
            </ul>
          </div>

          <div className="mb-4">
            <h4 className="text-sm mb-2">Best For:</h4>
            <div className="flex flex-wrap gap-2">
              {program.bestFor.slice(0, 2).map((tag: string, i: number) => (
                <Badge key={i} variant="secondary" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>

          <div className="mt-auto pt-4">
            <Button
              onClick={() => onSelect(program.id)}
              className={`w-full bg-${program.color} text-white hover:brightness-110`}
            >
              {selected ? "Selected ✓" : "Choose This Program"}
            </Button>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
