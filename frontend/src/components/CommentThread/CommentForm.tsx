import { Button } from "../../components/ui/button";
import { Textarea } from "../../components/ui/textarea";
import { Send } from "lucide-react";

interface CommentFormProps {
  value: string;
  onChange: (val: string) => void;
  onSubmit: (content: string) => void;
  onCancel?: () => void;
  isReply?: boolean;
}

export function CommentForm({
  value,
  onChange,
  onSubmit,
  onCancel,
  isReply = false,
}: CommentFormProps) {
  return (
    <div
      className={`flex gap-2 ${
        isReply ? "" : "border-t border-gray-200 bg-white p-4"
      }`}
    >
      <Textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            onSubmit(value);
          }
        }}
        placeholder={
          isReply
            ? "Write a reply..."
            : "Share your experience or ask a question..."
        }
        className={`min-h-[${isReply ? "60px" : "80px"}] text-sm flex-1`}
      />
      <div className="flex flex-col gap-2">
        <Button
          size="sm"
          onClick={() => onSubmit(value)}
          className="bg-gradient-to-r from-purple-500 to-pink-500"
          disabled={!value.trim()}
        >
          <Send className="w-3 h-3" />
        </Button>
        {onCancel && (
          <Button size="sm" variant="ghost" onClick={onCancel}>
            Cancel
          </Button>
        )}
      </div>
    </div>
  );
}
