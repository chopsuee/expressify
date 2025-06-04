'use client'
import NavigationBar from '@/components/navigation-bar'
import React, { useEffect } from 'react'
import ViewCard from '@/components/ui/bgcard'
import { useUsers } from '@/lib/users-context'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Loader2 } from 'lucide-react'

function FriendsPage() {
  const { users, loading, fetchUsers, toggleFriendship } = useUsers()
  
  // Get users who are not friends
  const nonFriends = users.filter(user => !user.isFriend)

  useEffect(() => {
    fetchUsers()
  }, [])

  const handleToggleFriendship = async (id: string | number) => {
    await toggleFriendship(id)
  }

  return (
    <div>
      <NavigationBar />
      <ViewCard>
        <div className="w-full">
          <h1 className="text-2xl font-bold mb-6">Discover People</h1>
          
          {loading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : nonFriends.length > 0 ? (
            <div className="space-y-4">
              {nonFriends.map(user => (
                <Card key={user.id} className="bg-background/50 border-muted">
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-12 w-12">
                          <AvatarImage src={user.avatar} />
                          <AvatarFallback>{user.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{user.name}</p>
                          <p className="text-xs text-muted-foreground">@{user.username}</p>
                        </div>
                      </div>
                      <Button 
                        onClick={() => handleToggleFriendship(user.id)}
                        variant="outline"
                        disabled={loading}
                      >
                        {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                        Add Friend
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm">{user.bio}</p>
                    <div className="flex gap-4 mt-2 text-xs text-muted-foreground">
                      <span>{user.posts_count || 0} posts</span>
                      <span>{user.followers_count || 0} followers</span>
                      <span>{user.following_count || 0} following</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <p className="text-center text-muted-foreground py-8">
              No new people to discover right now.
            </p>
          )}
        </div>
      </ViewCard>
    </div>
  )
}

export default FriendsPage