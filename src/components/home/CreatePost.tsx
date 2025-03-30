import { useState } from "react";
import { Card, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import { useAuth } from "../../context/useAuth";
import { Image, Video, Calendar, Newspaper } from "lucide-react";
import { Textarea } from "../ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";

interface CreatePostProps {
  onSubmit: (postData: { content: string; image?: string }) => void;
  isLoading: boolean;
}

export default function CreatePost({ onSubmit, isLoading }: CreatePostProps) {
  const { user } = useAuth();
  const [content, setContent] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleSubmit = () => {
    if (content.trim()) {
      onSubmit({ content });
      setContent("");
      setIsDialogOpen(false);
    }
  };

  return (
    <Card>
      <CardContent className="px-4 py-5 sm:p-6">
        <div className="flex">
          <img
            className="h-10 w-10 rounded-full"
            src={
              user?.profilePicture ||
              "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
            }
            alt={user?.name || "User profile"}
          />
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button
                variant="outline"
                className="ml-2 flex-1 text-left bg-[#f3f2ef] hover:bg-[#e0e0e0] text-secondary rounded-full justify-start"
              >
                Start a post
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create a post</DialogTitle>
              </DialogHeader>
              <div className="mt-4">
                <Textarea
                  placeholder="What do you want to talk about?"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="min-h-32"
                />
              </div>
              <div className="mt-4 flex justify-end">
                <Button
                  onClick={handleSubmit}
                  disabled={!content.trim() || isLoading}
                >
                  {isLoading ? "Posting..." : "Post"}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
        <div className="mt-3 flex justify-between">
          <Button
            variant="ghost"
            size="sm"
            className="flex items-center text-secondary rounded"
          >
            <Image className="text-primary mr-1 h-4 w-4" />
            <span className="text-sm">Photo</span>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="flex items-center text-secondary rounded"
          >
            <Video className="text-green-600 mr-1 h-4 w-4" />
            <span className="text-sm">Video</span>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="flex items-center text-secondary rounded"
          >
            <Calendar className="text-yellow-500 mr-1 h-4 w-4" />
            <span className="text-sm">Event</span>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="flex items-center text-secondary rounded"
          >
            <Newspaper className="text-red-500 mr-1 h-4 w-4" />
            <span className="text-sm">Article</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
