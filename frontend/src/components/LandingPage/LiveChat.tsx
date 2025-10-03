import { useState } from "react";
import { Card } from "../../lib/ui/card";
import { Button } from "../../lib/ui/button";
import { Input } from "../../lib/ui/input";
import { Badge } from "../../lib/ui/badge";
import { ScrollArea } from "../../lib/ui/scroll-area";
import { Radio, Users, Send, Maximize2, Volume2, VolumeX, Heart, Share2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface LiveStreamProps {
  isLive?: boolean;
  eventType?: 'hackathon' | 'pitch' | 'workshop';
  eventTitle?: string;
  viewerCount?: number;
}

interface ChatMessage {
  id: number;
  user: string;
  message: string;
  timestamp: Date;
}

export function LiveStream({ 
  isLive = true, 
  eventType = 'pitch',
  eventTitle = "IGA Entrepreneurship Pitch Competition",
  viewerCount = 247
}: LiveStreamProps) {
  const [isMuted, setIsMuted] = useState(false);
  const [chatMessage, setChatMessage] = useState("");
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    { id: 1, user: "Sarah_M", message: "This is amazing! 🎉", timestamp: new Date() },
    { id: 2, user: "Alex_K", message: "Great pitch!", timestamp: new Date() },
    { id: 3, user: "Maria_R", message: "Love the idea 💡", timestamp: new Date() },
    { id: 4, user: "Jordan_P", message: "How did you come up with this?", timestamp: new Date() },
  ]);
  const [likes, setLikes] = useState(342);
  const [hasLiked, setHasLiked] = useState(false);

  if (!isLive) return null;

  const handleSendMessage = () => {
    if (!chatMessage.trim()) return;
    
    const newMessage: ChatMessage = {
      id: chatMessages.length + 1,
      user: "You",
      message: chatMessage,
      timestamp: new Date(),
    };
    
    setChatMessages(prev => [...prev, newMessage]);
    setChatMessage("");
  };

  const handleLike = () => {
    if (hasLiked) {
      setLikes(likes - 1);
    } else {
      setLikes(likes + 1);
    }
    setHasLiked(!hasLiked);
  };

  const eventIcons = {
    hackathon: "💻",
    pitch: "🎤",
    workshop: "🎓"
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full"
    >
      <Card className="overflow-hidden border-2 border-red-500 shadow-2xl">
        {/* Live Badge Header */}
        <div className="bg-gradient-to-r from-red-500 to-pink-500 px-4 py-2 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
              className="flex items-center gap-2"
            >
              <Radio className="w-5 h-5 text-white" />
              <Badge className="bg-white text-red-600">LIVE</Badge>
            </motion.div>
            <div className="flex items-center gap-2 text-white text-sm">
              <Users className="w-4 h-4" />
              <span>{viewerCount.toLocaleString()} watching</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-white text-sm">{eventIcons[eventType]}</span>
            <Badge variant="secondary" className="bg-white/20 text-white border-0">
              {eventType.charAt(0).toUpperCase() + eventType.slice(1)}
            </Badge>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-0">
          {/* Video Area */}
          <div className="lg:col-span-2 bg-black relative group">
            {/* Video Placeholder */}
            <div className="aspect-video bg-gradient-to-br from-purple-900 via-pink-900 to-blue-900 flex items-center justify-center relative overflow-hidden">
              {/* Simulated video content */}
              <div className="absolute inset-0 opacity-30">
                <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-purple-500 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute bottom-1/4 right-1/4 w-40 h-40 bg-pink-500 rounded-full blur-3xl animate-pulse animation-delay-1000"></div>
              </div>
              
              <div className="relative z-10 text-center text-white space-y-4">
                <div className="text-6xl mb-4">{eventIcons[eventType]}</div>
                <h3 className="text-2xl px-4">{eventTitle}</h3>
                <p className="text-sm text-purple-200">Live Now</p>
              </div>

              {/* Video Controls Overlay */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setIsMuted(!isMuted)}
                      className="text-white hover:bg-white/20"
                    >
                      {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                    </Button>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-white hover:bg-white/20"
                  >
                    <Maximize2 className="w-5 h-5" />
                  </Button>
                </div>
              </div>

              {/* Live indicator pulse */}
              <div className="absolute top-4 left-4">
                <div className="flex items-center gap-2 bg-red-500 px-3 py-1 rounded-full">
                  <motion.div
                    className="w-2 h-2 bg-white rounded-full"
                    animate={{ opacity: [1, 0.3, 1] }}
                    transition={{ repeat: Infinity, duration: 1.5 }}
                  />
                  <span className="text-white text-sm">LIVE</span>
                </div>
              </div>
            </div>

            {/* Action Buttons Below Video */}
            <div className="bg-gray-900 px-4 py-3 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <button
                  onClick={handleLike}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all ${
                    hasLiked 
                      ? 'bg-red-500 text-white' 
                      : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                  }`}
                >
                  <Heart className={`w-4 h-4 ${hasLiked ? 'fill-current' : ''}`} />
                  <span className="text-sm">{likes}</span>
                </button>
                <Button variant="ghost" size="sm" className="text-gray-300 hover:bg-gray-800">
                  <Share2 className="w-4 h-4 mr-2" />
                  Share
                </Button>
              </div>
            </div>
          </div>

          {/* Live Chat */}
          <div className="bg-gray-50 flex flex-col h-[500px]">
            <div className="bg-gradient-to-r from-purple-600 to-pink-600 px-4 py-3 text-white">
              <h4 className="text-sm">Live Chat</h4>
              <p className="text-xs text-purple-100">Join the conversation</p>
            </div>

            <ScrollArea className="flex-1 p-4">
              <div className="space-y-3">
                {chatMessages.map((msg) => (
                  <div key={msg.id} className="space-y-1">
                    <div className="flex items-baseline gap-2">
                      <span className="text-sm text-purple-600">{msg.user}</span>
                      <span className="text-xs text-gray-400">
                        {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <p className="text-sm text-gray-700">{msg.message}</p>
                  </div>
                ))}
              </div>
            </ScrollArea>

            <div className="p-4 border-t border-gray-200 bg-white">
              <div className="flex gap-2">
                <Input
                  value={chatMessage}
                  onChange={(e) => setChatMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="Send a message..."
                  className="flex-1"
                />
                <Button
                  onClick={handleSendMessage}
                  className="bg-gradient-to-r from-purple-500 to-pink-500"
                  size="icon"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                Be respectful and supportive! 💜
              </p>
            </div>
          </div>
        </div>

        {/* Event Info Footer */}
        <div className="bg-gradient-to-r from-purple-50 to-pink-50 px-4 py-3 border-t border-gray-200">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <h4 className="mb-1">About This Event</h4>
              <p className="text-sm text-gray-600">
                {eventType === 'pitch' && "Watch our talented students pitch their innovative business ideas to a panel of judges and investors. Vote for your favorite!"}
                {eventType === 'hackathon' && "Students are coding live to solve real-world problems. See creativity and collaboration in action!"}
                {eventType === 'workshop' && "Join our live workshop and learn alongside students from around the world."}
              </p>
            </div>
            <div className="flex gap-2">
              <Badge className="bg-purple-100 text-purple-700">Entrepreneurship</Badge>
              <Badge className="bg-pink-100 text-pink-700">Live Event</Badge>
            </div>
          </div>
        </div>
      </Card>

      <style>{`
        .animation-delay-1000 {
          animation-delay: 1s;
        }
      `}</style>
    </motion.div>
  );
}