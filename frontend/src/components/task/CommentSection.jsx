import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {useAddComment} from '../../hooks/task/useAddComment.js'

function CommentSection({ taskId, members }) {
  const [commentText, setCommentText] = useState("");
  const queryClient = useQueryClient();

  const comments = [
    { id: 1, user: "Ali", message: "This task needs clarification." },
    { id: 2, user: "Ahmed", message: "I will complete it by tomorrow." },
    { id: 3, user: "Sara", message: "Design part is done." },
  ];

  // 🔥 Mutation
  const { mutate, isPending } = useAddComment()
  const handlePostComment = () => {

    if (!commentText.trim()) return;
      console.log('comment added : ',taskId,commentText)

    mutate({
      taskId,
      text: commentText,
    },
  {
    onSuccess : () => {
    setCommentText('')
                      }
}
  );
  };

  return (
    <Card className="w-full h-[520px] flex flex-col overflow-hidden">
      {/* Heading */}
      <CardHeader className="pb-3 shrink-0">
        <CardTitle className="text-lg font-semibold">
          Task Comments
        </CardTitle>
      </CardHeader>

      <CardContent className="flex flex-col flex-1 p-0 overflow-hidden">
        {/* Scrollable Comment Area */}
        <ScrollArea className="flex-1 px-6">
          <div className="space-y-6 py-4">
            {comments.map((comment) => (
              <div key={comment.id} className="flex gap-3">
                <Avatar className="h-8 w-8">
                  <AvatarFallback>
                    {comment.user.charAt(0)}
                  </AvatarFallback>
                </Avatar>

                <div className="flex flex-col">
                  <span className="text-sm font-medium">
                    {comment.user}
                  </span>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {comment.message}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>

        {/* Bottom Input Section */}
        <div className="border-t px-6 py-4 space-y-3 shrink-0">
          <Textarea
            placeholder="Write your comment..."
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            className="resize-none min-h-[90px]"
          />

          <div className="flex justify-end">
            <Button
              onClick={handlePostComment}
              disabled={!commentText.trim() || isPending}
            >
              {isPending ? "Posting..." : "Post Comment"}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default CommentSection;