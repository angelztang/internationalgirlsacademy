import { useState } from "react";
import { Card } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Textarea } from "../../components/ui/textarea";
import { ScrollArea } from "../../components/ui/scroll-area";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "../../components/ui/avatar";
import { Badge } from "../../components/ui/badge";
import { MessageCircle, Heart, Reply, Send, Users } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export interface Comment {
  id: number;
  user: string;
  avatar?: string;
  role: "student" | "volunteer" | "mentor" | "alumni";
  timestamp: Date;
  content: string;
  likes: number;
  replies?: Comment[];
}

interface CommentThreadProps {
  stepTitle: string;
  pathType: "student" | "volunteer" | "donate";
  stepNumber: number;
}

// Mock comments for demo purposes
const getMockComments = (pathType: string, stepNumber: number): Comment[] => {
  const commentSets: Record<string, Record<number, Comment[]>> = {
    student: {
      1: [
        {
          id: 1,
          user: "Sarah M.",
          role: "student",
          timestamp: new Date(Date.now() - 3600000),
          content:
            "Super excited to start this journey! The welcome video was really inspiring 💜",
          likes: 12,
        },
        {
          id: 2,
          user: "Alex Chen",
          role: "alumni",
          timestamp: new Date(Date.now() - 7200000),
          content:
            "Welcome everyone! I started here 2 years ago and it changed my life. Don't hesitate to ask questions!",
          likes: 24,
          replies: [
            {
              id: 3,
              user: "Maria R.",
              role: "student",
              timestamp: new Date(Date.now() - 5400000),
              content: "That's so encouraging! What was your favorite part?",
              likes: 5,
            },
          ],
        },
      ],
      2: [
        {
          id: 4,
          user: "Jordan P.",
          role: "student",
          timestamp: new Date(Date.now() - 1800000),
          content:
            "The values really resonate with me. Community over competition! 🌟",
          likes: 8,
        },
        {
          id: 5,
          user: "Dr. Lisa K.",
          role: "mentor",
          timestamp: new Date(Date.now() - 3600000),
          content:
            "These values are what make IGA special. Take your time with each module and really reflect on how they apply to your life.",
          likes: 15,
        },
      ],
      3: [
        {
          id: 6,
          user: "Emily S.",
          role: "student",
          timestamp: new Date(Date.now() - 2700000),
          content:
            "The time management tips are SO helpful! Already planning my week differently 📅",
          likes: 10,
        },
      ],
    },
    volunteer: {
      1: [
        {
          id: 7,
          user: "Michael T.",
          role: "volunteer",
          timestamp: new Date(Date.now() - 4500000),
          content:
            "Happy to be giving back! Looking forward to making a difference.",
          likes: 18,
        },
      ],
      2: [
        {
          id: 8,
          user: "Rachel N.",
          role: "alumni",
          timestamp: new Date(Date.now() - 5400000),
          content:
            "These training modules are excellent. They really prepared me to be an effective mentor!",
          likes: 22,
        },
      ],
    },
    donate: {
      1: [
        {
          id: 9,
          user: "David L.",
          role: "alumni",
          timestamp: new Date(Date.now() - 7200000),
          content:
            "As a former student, I know firsthand how much these donations help. Thank you for supporting!",
          likes: 30,
        },
      ],
    },
  };

  return commentSets[pathType]?.[stepNumber] || [];
};

export const roleColors = {
  student: { bg: "bg-purple-100", text: "text-purple-700", badge: "Student" },
  volunteer: { bg: "bg-pink-100", text: "text-pink-700", badge: "Volunteer" },
  mentor: { bg: "bg-blue-100", text: "text-blue-700", badge: "Mentor" },
  alumni: { bg: "bg-green-100", text: "text-green-700", badge: "Alumni" },
};

export function CommentThread({
  stepTitle,
  pathType,
  stepNumber,
}: CommentThreadProps) {
  const [comments, setComments] = useState<Comment[]>(
    getMockComments(pathType, stepNumber)
  );
  const [newComment, setNewComment] = useState("");
  const [replyingTo, setReplyingTo] = useState<number | null>(null);
  const [likedComments, setLikedComments] = useState<Set<number>>(new Set());

  const handleAddComment = () => {
    if (!newComment.trim()) return;

    const comment: Comment = {
      id: Date.now(),
      user: "You",
      role: pathType === "donate" ? "alumni" : pathType,
      timestamp: new Date(),
      content: newComment,
      likes: 0,
      replies: [],
    };

    if (replyingTo) {
      setComments((prev) =>
        prev.map((c) =>
          c.id === replyingTo
            ? { ...c, replies: [...(c.replies || []), comment] }
            : c
        )
      );
      setReplyingTo(null);
    } else {
      setComments((prev) => [comment, ...prev]);
    }

    setNewComment("");
  };

  const handleLike = (commentId: number) => {
    setLikedComments((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(commentId)) {
        newSet.delete(commentId);
      } else {
        newSet.add(commentId);
      }
      return newSet;
    });

    setComments((prev) =>
      prev.map((c) =>
        c.id === commentId
          ? {
              ...c,
              likes: likedComments.has(commentId) ? c.likes - 1 : c.likes + 1,
            }
          : c
      )
    );
  };

  const getTimeAgo = (date: Date) => {
    const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
    if (seconds < 60) return "just now";
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  };

  const CommentCard = ({
    comment,
    isReply = false,
  }: {
    comment: Comment;
    isReply?: boolean;
  }) => {
    const roleColor = roleColors[comment.role];

    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className={`${isReply ? "ml-8 mt-3" : ""}`}
      >
        <div className="flex gap-3">
          <Avatar className="w-8 h-8 flex-shrink-0">
            <AvatarFallback
              className={`${roleColor.bg} ${roleColor.text} text-xs`}
            >
              {comment.user.charAt(0)}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <span className="text-sm">{comment.user}</span>
              <Badge
                variant="secondary"
                className={`text-xs ${roleColor.bg} ${roleColor.text} border-0`}
              >
                {roleColor.badge}
              </Badge>
              <span className="text-xs text-gray-500">
                {getTimeAgo(comment.timestamp)}
              </span>
            </div>

            <p className="text-sm text-gray-700 mb-2 break-words">
              {comment.content}
            </p>

            <div className="flex items-center gap-4">
              <button
                onClick={() => handleLike(comment.id)}
                className={`flex items-center gap-1 text-xs transition-colors ${
                  likedComments.has(comment.id)
                    ? "text-red-500"
                    : "text-gray-500 hover:text-red-500"
                }`}
              >
                <Heart
                  className={`w-3 h-3 ${
                    likedComments.has(comment.id) ? "fill-current" : ""
                  }`}
                />
                <span>{comment.likes}</span>
              </button>

              {!isReply && (
                <button
                  onClick={() => setReplyingTo(comment.id)}
                  className="flex items-center gap-1 text-xs text-gray-500 hover:text-purple-600 transition-colors"
                >
                  <Reply className="w-3 h-3" />
                  Reply
                </button>
              )}
            </div>

            {/* Replies */}
            {comment.replies && comment.replies.length > 0 && (
              <div className="mt-3 space-y-3">
                {comment.replies.map((reply) => (
                  <CommentCard key={reply.id} comment={reply} isReply={true} />
                ))}
              </div>
            )}

            {/* Reply Form */}
            {replyingTo === comment.id && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="mt-3"
              >
                <div className="flex gap-2">
                  <Textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Write a reply..."
                    className="min-h-[60px] text-sm"
                  />
                  <div className="flex flex-col gap-2">
                    <Button
                      size="sm"
                      onClick={handleAddComment}
                      className="bg-gradient-to-r bg-[#4455F0]"
                    >
                      <Send className="w-3 h-3" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => {
                        setReplyingTo(null);
                        setNewComment("");
                      }}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </motion.div>
    );
  };

  return (
    <Card className="h-full flex flex-col overflow-hidden w-full">
      {/* Header */}
      <div className="bg-gradient-to-r bg-[#4455F0] text-white p-4">
        <div className="flex items-center gap-2 mb-1">
          <MessageCircle className="w-5 h-5" />
          <h3 className="text-lg">Community Discussion</h3>
        </div>
        <p className="text-sm text-purple-100">
          Share your thoughts about: {stepTitle}
        </p>
        <div className="flex items-center gap-2 mt-2">
          <Users className="w-4 h-4" />
          <span className="text-sm">
            {comments.length} {comments.length === 1 ? "comment" : "comments"}
          </span>
        </div>
      </div>

      {/* Comments List */}
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-6">
          <AnimatePresence>
            {comments.length > 0 ? (
              comments.map((comment) => (
                <CommentCard key={comment.id} comment={comment} />
              ))
            ) : (
              <div className="text-center py-12 text-gray-500">
                <MessageCircle className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p className="text-sm">
                  No comments yet. Be the first to share!
                </p>
              </div>
            )}
          </AnimatePresence>
        </div>
      </ScrollArea>

      {/* Add Comment Form */}
      {!replyingTo && (
        <div className="p-4 border-t border-gray-200 bg-white">
          <div className="flex gap-2">
            <Avatar className="w-8 h-8 flex-shrink-0">
              <AvatarFallback className="bg-gradient-to-r bg-[#4455F0] text-white text-xs">
                You
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 flex gap-2">
              <Textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleAddComment();
                  }
                }}
                placeholder="Share your experience or ask a question..."
                className="min-h-[80px] text-sm"
              />
              <Button
                onClick={handleAddComment}
                disabled={!newComment.trim()}
                className="bg-gradient-to-r bg-[#4455F0] self-end"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-2 ml-10">
            💜 Be respectful and supportive of fellow community members
          </p>
        </div>
      )}
    </Card>
  );
}
