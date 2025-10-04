import { CommentCard } from "./CommentCard";
import { Comment } from "./CommentThread";
import { MessageCircle } from "lucide-react";

interface CommentListProps {
  comments: Comment[];
  replyingTo: number | null;
  setReplyingTo: (id: number | null) => void;
  likedComments: Set<number>;
  setLikedComments: React.Dispatch<React.SetStateAction<Set<number>>>;
  newComment: string;
  setNewComment: React.Dispatch<React.SetStateAction<string>>;
  setComments: React.Dispatch<React.SetStateAction<Comment[]>>;
  roleColors: any;
}

export function CommentList({
  comments,
  replyingTo,
  setReplyingTo,
  likedComments,
  setLikedComments,
  newComment,
  setNewComment,
  setComments,
  roleColors,
}: CommentListProps) {
  return comments.length > 0 ? (
    <div className="space-y-6">
      {comments.map((comment) => (
        <CommentCard
          key={comment.id}
          comment={comment}
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
    </div>
  ) : (
    <div className="text-center py-12 text-gray-500">
      <MessageCircle className="w-12 h-12 mx-auto mb-3 opacity-50" />
      <p className="text-sm">No comments yet. Be the first to share!</p>
    </div>
  );
}
