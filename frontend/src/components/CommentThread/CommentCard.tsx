import { motion } from "motion/react";
import { Avatar, AvatarFallback } from "../../components/ui/avatar";
import { Badge } from "../../components/ui/badge";
import { Heart, Reply } from "lucide-react";
import { CommentForm } from "./CommentForm";
import { Comment, roleColors } from "./CommentThread";

interface CommentCardProps {
  comment: Comment;
  isReply?: boolean;
  replyingTo: number | null;
  setReplyingTo: (id: number | null) => void;
  likedComments: Set<number>;
  setLikedComments: React.Dispatch<React.SetStateAction<Set<number>>>;
  newComment: string;
  setNewComment: React.Dispatch<React.SetStateAction<string>>;
  setComments: React.Dispatch<React.SetStateAction<Comment[]>>;
  roleColors: any;
}

export function CommentCard({
  comment,
  isReply = false,
  replyingTo,
  setReplyingTo,
  likedComments,
  setLikedComments,
  newComment,
  setNewComment,
  setComments,
  roleColors,
}: CommentCardProps) {
  const handleLike = () => {
    setLikedComments((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(comment.id)) newSet.delete(comment.id);
      else newSet.add(comment.id);
      return newSet;
    });

    setComments((prev) =>
      prev.map((c) =>
        c.id === comment.id
          ? {
              ...c,
              likes: likedComments.has(comment.id) ? c.likes - 1 : c.likes + 1,
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
              onClick={handleLike}
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
          {comment.replies?.map((reply) => (
            <CommentCard
              key={reply.id}
              comment={reply}
              isReply
              replyingTo={replyingTo}
              setReplyingTo={setReplyingTo}
              likedComments={likedComments}
              setLikedComments={setLikedComments}
              newComment={newComment}
              setNewComment={setNewComment}
              setComments={setComments}
              roleColors={roleColors}
            />
          ))}

          {/* Reply Form */}
          {replyingTo === comment.id && (
            <CommentForm
              value={newComment}
              onChange={setNewComment}
              onSubmit={(content) => {
                const reply: Comment = {
                  id: Date.now(),
                  user: "You",
                  role: comment.role,
                  timestamp: new Date(),
                  content,
                  likes: 0,
                  replies: [],
                };
                setComments((prev) =>
                  prev.map((c) =>
                    c.id === comment.id
                      ? { ...c, replies: [...(c.replies || []), reply] }
                      : c
                  )
                );
                setReplyingTo(null);
                setNewComment("");
              }}
              onCancel={() => setReplyingTo(null)}
              isReply
            />
          )}
        </div>
      </div>
    </motion.div>
  );
}
