'use client'
import React, { useEffect } from "react";
import NavigationBar from "@/components/navigation-bar";
import ViewCard from "@/components/ui/bgcard";
import CreatePostCompact from "@/components/create-post-compact";
import PostCard from "@/components/post-card";
import { usePosts } from "@/lib/posts-context";
import { useAuth } from "@/lib/auth-context";
import { PostSkeleton } from "@/components/post-skeleton";

function HomePage() {
  const { posts, loading, fetchPosts } = usePosts();
  const { user } = useAuth();
  const [refreshKey, setRefreshKey] = React.useState(0);
  
  /**
   * Refreshes the posts feed and updates the UI
   * 
   * This function fetches the latest posts and increments
   * the refresh key to force a re-render of the post components,
   * ensuring that any changes are immediately reflected in the UI.
   */
  const refreshPosts = () => {
    fetchPosts();
    setRefreshKey(prevKey => prevKey + 1);
  };
  
  useEffect(() => {
    fetchPosts();
  }, []);

  return (
    <div>
      <NavigationBar />
      <ViewCard>
        <div className="w-full">
          <h1 className="text-2xl font-bold mb-6">Home</h1>
          
          <CreatePostCompact onPostCreated={refreshPosts} />
          
          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <PostSkeleton key={i} />
              ))}
            </div>
          ) : posts.length > 0 ? (
            <div className="space-y-4">
              {posts.map(post => (
                <PostCard 
                  key={`${post.id}-${refreshKey}`} // Using refreshKey in the key to force re-render when posts are updated
                  post={post} 
                  onPostUpdated={refreshPosts}
                  onPostDeleted={refreshPosts}
                  onPostLiked={refreshPosts}
                />
              ))}
            </div>
          ) : (
            <p className="text-center text-muted-foreground py-8">
              No posts to show. Add some friends to see their posts here!
            </p>
          )}
        </div>
      </ViewCard>
    </div>
  );
}

export default HomePage;