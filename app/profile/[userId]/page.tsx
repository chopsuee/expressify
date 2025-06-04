'use client'
import NavigationBar from '@/components/navigation-bar'
import React from 'react'
import ViewCard from '@/components/ui/bgcard'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import PostCard from '@/components/post-card'
import { usePostsStore } from '@/lib/posts-store'
import CreatePostCompact from '@/components/create-post-compact'

function UserProfilePage({ params }: { params: { userId: string } }) {
  const { posts, authors, currentUser } = usePostsStore()
  const userId = params.userId
  const user = authors[userId]
  const [refreshKey, setRefreshKey] = React.useState(0)
  
  // Force refresh when posts are modified - same as home page
  const refreshPosts = () => {
    setRefreshKey(prevKey => prevKey + 1);
  };
  
  const userPosts = React.useMemo(() => {
    return posts.filter(post => post.authorId === userId)
  }, [posts, userId, refreshKey])
  
  const isCurrentUser = userId === currentUser

  if (!user) {
    return (
      <div>
        <NavigationBar />
        <ViewCard>
          <div className="flex flex-col items-center justify-center h-64">
            <h1 className="text-2xl font-bold">User not found</h1>
            <p className="text-muted-foreground">The user you're looking for doesn't exist</p>
          </div>
        </ViewCard>
      </div>
    )
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
            {!isCurrentUser && (
              <Button variant="outline" className="ml-auto">Follow</Button>
            )}
          </div>
          
          <Separator className="my-4" />
          
          {/* Profile Stats */}
          <div className="grid grid-cols-3 gap-4 mb-6 text-center">
            <div>
              <p className="text-2xl font-bold">{user.posts}</p>
              <p className="text-muted-foreground">Posts</p>
            </div>
            <div>
              <p className="text-2xl font-bold">{user.followers}</p>
              <p className="text-muted-foreground">Followers</p>
            </div>
            <div>
              <p className="text-2xl font-bold">{user.following}</p>
              <p className="text-muted-foreground">Following</p>
            </div>
          </div>
          
          <Separator className="my-4" />
          
          {/* Bio */}
          <div className="mb-6">
            <h2 className="font-semibold mb-2">About</h2>
            <p>{user.bio}</p>
          </div>
          
          <Separator className="my-4" />
          
          {/* Create Post (only for current user) */}
          {isCurrentUser && (
            <>
              <div className="mb-6">
                <h2 className="font-semibold mb-2">Create Post</h2>
                <CreatePostCompact onPostCreated={refreshPosts} />
              </div>
              <Separator className="my-4" />
            </>
          )}
          
          {/* User Posts */}
          <div>
            <h2 className="font-semibold mb-4">Posts</h2>
            {userPosts.length > 0 ? (
              <div className="space-y-4">
                {userPosts.map(post => (
                  <PostCard 
                    key={`${post.id}-${refreshKey}`}
                    post={{
                      id: post.id,
                      content: post.content,
                      author: user,
                      created_at: post.timestamp,
                      likes: post.likes
                    }}
                    onPostUpdated={refreshPosts}
                    onPostDeleted={refreshPosts}
                    onPostLiked={refreshPosts}
                  />
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground text-center py-8">No posts yet</p>
            )}
          </div>
        </div>
      </ViewCard>
    </div>
  )
}

export default UserProfilePage