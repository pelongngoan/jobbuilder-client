import { Card, CardContent } from "../ui/card";
import { Post } from "../../shared/schema";
import { useQuery } from "@tanstack/react-query";
import { User } from "../../shared/schema";
import { ThumbsUp, MessageCircle, Share } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface PostCardProps {
  post: Post;
}

export default function PostCard({ post }: PostCardProps) {
  const { data: user } = useQuery<User>({
    queryKey: [`/api/users/${post.userId}`],
  });

  if (!user) {
    return null;
  }

  const timeAgo = formatDistanceToNow(new Date(post.createdAt), {
    addSuffix: true,
  });

  return (
    <Card className="overflow-hidden">
      <CardContent className="px-4 pt-5 sm:px-6 pb-0">
        <div className="flex">
          <img
            className="h-10 w-10 rounded-full"
            src={
              user.profilePicture ||
              "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
            }
            alt={user.name || "User profile"}
          />
          <div className="ml-3">
            <p className="text-sm font-medium text-secondary">
              {user.name || user.username}{" "}
              <span className="text-gray-500">• 2nd</span>
            </p>
            <p className="text-xs text-gray-500">
              {user.headline || "JobConnect User"}
            </p>
            <p className="text-xs text-gray-500">{timeAgo}</p>
          </div>
        </div>
        <div className="mt-4">
          <p className="text-secondary">{post.content}</p>
        </div>
      </CardContent>
      {post.image && (
        <div className="mt-2">
          <img
            src={post.image}
            alt="Post image"
            className="w-full h-72 object-cover"
          />
        </div>
      )}
      <div className="px-4 py-4 sm:px-6">
        <div className="flex space-x-4 text-sm text-gray-500">
          <button className="flex items-center space-x-1 hover:text-primary">
            <ThumbsUp className="h-4 w-4" />
            <span>Like</span>
          </button>
          <button className="flex items-center space-x-1 hover:text-primary">
            <MessageCircle className="h-4 w-4" />
            <span>Comment</span>
          </button>
          <button className="flex items-center space-x-1 hover:text-primary">
            <Share className="h-4 w-4" />
            <span>Share</span>
          </button>
        </div>
      </div>
    </Card>
  );
}
