'use client'
import NavigationBar from '@/components/navigation-bar'
import React, { useEffect, useState } from 'react'
import ViewCard from '@/components/ui/bgcard'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import CreatePostCompact from '@/components/create-post-compact'
import PostCard from '@/components/post-card'
import { useAuth } from '@/lib/auth-context'
import { usePosts } from '@/lib/posts-context'
import { Post } from '@/lib/types'
import { Loader2 } from 'lucide-react'
import { PostSkeleton } from '@/components/post-skeleton'
import { LoadingSpinner } from '@/components/loading-spinner'
import { ProfileSkeleton } from '@/components/profile-skeleton'

function UserProfile() {
  const { user } = useAuth();
  const { fetchUserPosts } = usePosts();
  const [userPosts, setUserPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshKey, setRefreshKey] = React.useState(0);
  
  /**
   * Refreshes the user's posts and updates the UI
   * 
   * This function fetches the latest posts for the current user,
   * updates the state, and increments the refresh key to force
   * a re-render of the post components.
   */
  const refreshPosts = async () => {
    if (user) {
      setLoading(true);
      const posts = await fetchUserPosts(user.id);
      setUserPosts(posts);
      setLoading(false);
      setRefreshKey(prevKey => prevKey + 1);
    }
  };
  
  useEffect(() => {
    refreshPosts();
  }, [user, fetchUserPosts]);

  if (!user) {
    return (
      <div>
        <NavigationBar />
        <ViewCard>
          <ProfileSkeleton />
        </ViewCard>
      </div>
    );
  }
 
  return (
    <div>
      <NavigationBar />
      <ViewCard>
        <div className="flex flex-col w-full">
          {/* Profile Header */}
          <div className="flex items-center gap-4 mb-6">
            <Avatar className="h-20 w-20">
              <AvatarImage src={user.avatar} />
              <AvatarFallback>{user.name.substring(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-2xl font-bold">{user.name}</h1>
              <p className="text-muted-foreground">@{user.username}</p>
            </div>
            <Button variant="outline" className="ml-auto">Edit Profile</Button>
          </div>
          
          <Separator className="my-4" />
          
          {/* Profile Stats */}
          <div className="grid grid-cols-3 gap-4 mb-6 text-center">
            <div>
              <p className="text-2xl font-bold">{user.posts_count || 0}</p>
              <p className="text-muted-foreground">Posts</p>
            </div>
            <div>
              <p className="text-2xl font-bold">{user.followers_count || 0}</p>
              <p className="text-muted-foreground">Followers</p>
            </div>
            <div>
              <p className="text-2xl font-bold">{user.following_count || 0}</p>
              <p className="text-muted-foreground">Following</p>
            </div>
          </div>
          
          <Separator className="my-4" />
          
          {/* Bio */}
          <div className="mb-6">
            <h2 className="font-semibold mb-2">About</h2>
            <p>{user.bio || "No bio yet."}</p>
          </div>
          
          <Separator className="my-4" />
          
          {/* Create Post - With refreshPosts callback to update UI after post creation */}
          <div className="mb-6">
            <h2 className="font-semibold mb-2">Create Post</h2>
            <CreatePostCompact onPostCreated={refreshPosts} />
          </div>
          
          <Separator className="my-4" />
          
          {/* User Posts */}
          <div className="mb-6">
            <h2 className="font-semibold mb-4">My Posts</h2>
            {loading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <PostSkeleton key={i} />
                ))}
              </div>
            ) : userPosts.length > 0 ? (
              <div className="space-y-4">
                {userPosts.map(post => (
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
              <p className="text-muted-foreground text-center py-4">No posts yet</p>
            )}
          </div>
        </div>
      </ViewCard>
    </div>
  )
}

export default UserProfile