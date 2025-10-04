import { MessageCircle } from "lucide-react";

export default function BusyBotReminder() {
  return (
    <div className="mt-4 p-4 bg-[#b4bbf8]/20 rounded-lg border border-[#b4bbf8]">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-[#4455f0] rounded-full flex items-center justify-center flex-shrink-0">
          <MessageCircle className="w-5 h-5 text-white" />
        </div>
        <div className="flex-1">
          <h4 className="text-sm mb-1">Need Help?</h4>
          <p className="text-xs text-gray-600">
            Click the BusyBot 🤖 in the bottom right to ask questions about this
            step!
          </p>
        </div>
      </div>
    </div>
  );
}
