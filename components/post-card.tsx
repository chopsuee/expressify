'use client'
import React, { useState } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Heart, MessageCircle, Share2, MoreVertical, Pencil, Trash2, Loader2 } from 'lucide-react'
import Link from 'next/link'
import { Textarea } from '@/components/ui/textarea'
import { usePosts } from '@/lib/posts-context'
import { useAuth } from '@/lib/auth-context'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Post } from '@/lib/types'

interface PostCardProps {
  post: Post;
  onPostUpdated?: () => void;
  onPostDeleted?: () => void;
  onPostLiked?: () => void;
}

function PostCard({ post, onPostUpdated, onPostDeleted, onPostLiked }: PostCardProps) {
  const { id, content, author, created_at, likes } = post;
  const { updatePost, deletePost, likePost, loading } = usePosts();
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(content);
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(likes || 0);
  const isAuthor = user?.id === author.id;

  const handleUpdate = async () => {
    await updatePost(id, editedContent);
    setIsEditing(false);
    if (onPostUpdated) {
      onPostUpdated();
    }
  };

  const handleDelete = async () => {
    await deletePost(id);
    if (onPostDeleted) {
      onPostDeleted();
    }
  };

  const handleLike = async () => {
    if (!isLiked) {
      await likePost(id);
      setIsLiked(true);
      setLikeCount(prev => prev + 1);
    } else {
      // If we had an unlike API, we would call it here
      // For now, just toggle the state
      setIsLiked(false);
      setLikeCount(prev => Math.max(0, prev - 1));
    }
    
    if (onPostLiked) {
      onPostLiked();
    }
  };

  // Format timestamp
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.round(diffMs / 60000);
    const diffHours = Math.round(diffMins / 60);
    const diffDays = Math.round(diffHours / 24);

    if (diffMins < 60) {
      return `${diffMins}m ago`;
    } else if (diffHours < 24) {
      return `${diffHours}h ago`;
    } else {
      return `${diffDays}d ago`;
    }
  };

  return (
    <Card className="mb-4 bg-background/50 border-muted">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <Link href={`/profile/${author.id}`} className="flex items-center gap-2">
            <Avatar className="h-10 w-10">
              <AvatarImage src={author.avatar} />
              <AvatarFallback>{author.name.substring(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium">{author.name}</p>
              <p className="text-xs text-muted-foreground">@{author.username} · {formatDate(created_at)}</p>
            </div>
          </Link>
          
          {isAuthor && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm">
                  <MoreVertical size={16} />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setIsEditing(true)}>
                  <Pencil className="mr-2 h-4 w-4" />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleDelete}>
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </CardHeader>
      
      <CardContent>
        {isEditing ? (
          <div>
            <Textarea 
              value={editedContent}
              onChange={(e) => setEditedContent(e.target.value)}
              className="mb-2"
              disabled={loading}
            />
            <div className="flex justify-end gap-2">
              <Button 
                size="sm" 
                variant="outline" 
                onClick={() => setIsEditing(false)}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button 
                size="sm" 
                onClick={handleUpdate}
                disabled={loading}
              >
                {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                Save
              </Button>
            </div>
          </div>
        ) : (
          <p>{content}</p>
        )}
      </CardContent>
      
      <CardFooter className="border-t pt-3 flex justify-between">
        <Button 
          variant={isLiked ? "default" : "ghost"}
          size="sm" 
          className={`flex gap-1 ${isLiked ? "bg-pink-500 hover:bg-pink-600" : ""}`}
          onClick={handleLike}
          disabled={loading}
        >
          <Heart size={16} className={isLiked ? "fill-white" : ""} /> <span>{likeCount}</span>
        </Button>
        <Button variant="ghost" size="sm">
          <MessageCircle size={16} />
        </Button>
        <Button variant="ghost" size="sm">
          <Share2 size={16} />
        </Button>
      </CardFooter>
    </Card>
  )
}

export default PostCard