import { AnimatePresence, motion } from "motion/react";
import { Button } from "../ui/button";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { Label } from "../ui/label";

interface QuizModalProps {
  open: boolean;
  questions: any[];
  answers: Record<string, string>;
  onChange: (questionId: string, value: string) => void;
  onClose: () => void;
  onSubmit: () => void;
}

export function QuizModal({
  open,
  questions,
  answers,
  onChange,
  onClose,
  onSubmit,
}: QuizModalProps) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-2xl p-8 max-w-2xl w-full max-h-[80vh] overflow-y-auto"
          >
            <h2 className="text-3xl mb-2">Program Match Quiz</h2>
            <p className="text-gray-600 mb-6">
              Answer a few questions to find your perfect program
            </p>

            <div className="space-y-8">
              {questions.map((q, i) => (
                <div key={q.id}>
                  <h3 className="mb-4">
                    {i + 1}. {q.question}
                  </h3>
                  <RadioGroup
                    value={answers[q.id]}
                    onValueChange={(value) => onChange(q.id, value)}
                  >
                    <div className="space-y-3">
                      {q.options.map((opt: any) => (
                        <div
                          key={opt.value}
                          className="flex items-center space-x-2"
                        >
                          <RadioGroupItem value={opt.value} id={opt.value} />
                          <Label htmlFor={opt.value} className="cursor-pointer">
                            {opt.label}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </RadioGroup>
                </div>
              ))}
            </div>

            <div className="flex gap-3 mt-8">
              <Button
                onClick={onSubmit}
                disabled={Object.keys(answers).length < questions.length}
                className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500"
              >
                Get My Recommendation
              </Button>
              <Button variant="outline" onClick={onClose}>
                Cancel
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
