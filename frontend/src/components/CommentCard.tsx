/**
 * @copyright 2025 Dhrubajyoti Bhattacharjee
 * @license Apache-2.0
 */

import type { BlogDocument, UserDocument } from "@/types";

interface CommentCardProps {
  user: UserDocument | null;
  blog: BlogDocument;
  content: string;
  likeCount: number;
  createdAt: string;
}

function CommentCard({
  user,
  blog,
  content,
  likeCount,
  createdAt,
}: CommentCardProps) {
  console.log(user);

  return <div>CommentCard</div>;
}

export default CommentCard;
