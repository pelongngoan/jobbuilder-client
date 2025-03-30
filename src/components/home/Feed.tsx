import { useQuery, useMutation } from "@tanstack/react-query";
import { Post } from "../../shared/schema";
import { apiRequest, queryClient } from "../../lib/queryClient";
import { useToast } from "../../context/use-toast";
import CreatePost from "./CreatePost";
import PostCard from "./PostCard";
import { Skeleton } from "../ui/skeleton";

export default function Feed() {
  const { toast } = useToast();

  const {
    data: posts,
    isLoading,
    error,
  } = useQuery<Post[]>({
    queryKey: ["/api/posts"],
  });

  const createPostMutation = useMutation({
    mutationFn: async (postData: { content: string; image?: string }) => {
      const res = await apiRequest("POST", "/api/posts", postData);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/posts"] });
      toast({
        title: "Post created",
        description: "Your post has been published successfully",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to create post",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  if (error) {
    return (
      <div className="lg:w-2/4 space-y-6">
        <div className="p-4 bg-red-50 text-red-500 rounded-lg">
          Error loading posts: {error.message}
        </div>
      </div>
    );
  }

  return (
    <div className="lg:w-2/4 space-y-6">
      <CreatePost
        onSubmit={(postData) => createPostMutation.mutate(postData)}
        isLoading={createPostMutation.isPending}
      />

      {isLoading && (
        <>
          <Skeleton className="w-full h-64 rounded-lg" />
          <Skeleton className="w-full h-48 rounded-lg" />
        </>
      )}

      {posts && posts.length > 0 ? (
        posts.map((post) => <PostCard key={post.id} post={post} />)
      ) : !isLoading ? (
        <div className="bg-white rounded-lg shadow p-6 text-center">
          <p className="text-secondary">No posts to show yet.</p>
          <p className="text-gray-500 mt-2">
            Be the first to share something with your network!
          </p>
        </div>
      ) : null}
    </div>
  );
}
