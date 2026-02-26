import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useAddComment } from "../../hooks/task/useAddComment";
import useGetComment from "../../hooks/task/useGetComment";

function CommentSection({ taskId }) {
  const [commentText, setCommentText] = useState("");

  // Add Comment Mutation
  const { mutate, isPending: isAdding } = useAddComment();

  // Get Comments Query
  const { data, isPending: isLoading } = useGetComment(taskId);

  // Safely handle comments array
  const comments = Array.isArray(data?.comments) ? data.comments : [];

  const handlePostComment = () => {
    const trimmed = commentText.trim();
    if (!trimmed) return;

    mutate(
      { taskId, text: trimmed },
      {
        onSuccess: () => setCommentText(""), // Clear input
      }
    );
  };

  return (
    <Card className="w-full h-[520px] flex flex-col">
      {/* Heading */}
      <CardHeader className="pb-3 shrink-0">
        <CardTitle className="text-lg font-semibold">Task Comments</CardTitle>
      </CardHeader>

      {/* Content */}
      <CardContent className="flex flex-col flex-1 p-0 overflow-hidden">
        {/* Scrollable Comment Area */}
        <ScrollArea className="flex-1 overflow-auto px-6 py-4">
          <div className="space-y-6">
            {isLoading ? (
              <p className="text-sm text-muted-foreground">Loading comments...</p>
            ) : comments.length === 0 ? (
              <p className="text-sm text-muted-foreground">No comments yet.</p>
            ) : (
              comments.map((comment) => (
                <div key={comment._id} className="flex gap-3">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback>{comment.author?.name?.charAt(0) || "U"}</AvatarFallback>
                  </Avatar>

                  <div className="flex flex-col">
                    <span className="text-sm font-medium">
                      {comment.author?.name || "Unknown"}
                    </span>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {comment.text}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </ScrollArea>

        {/* Input Section */}
        <div className="border-t px-6 py-4 space-y-3 shrink-0">
          <Textarea
            placeholder="Write your comment..."
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            className="resize-none min-h-[90px]"
          />
          <div className="flex justify-end">
            <Button onClick={handlePostComment} disabled={!commentText.trim() || isAdding}>
              {isAdding ? "Posting..." : "Post Comment"}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default CommentSection;