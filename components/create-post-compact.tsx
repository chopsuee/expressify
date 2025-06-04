'use client'
import React, { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { usePosts } from "@/lib/posts-context";
import { Loader2 } from "lucide-react";

interface CreatePostCompactProps {
  onPostCreated?: () => void;
}

function CreatePostCompact({ onPostCreated }: CreatePostCompactProps) {
  const [content, setContent] = useState("");
  const { addPost, loading } = usePosts();

  const handlePost = async () => {
    if (content.trim()) {
      await addPost(content);
      setContent("");
      if (onPostCreated) {
        onPostCreated();
      }
    }
  };

  return (
    <div className="w-full bg-background/50 rounded-xl p-4 border mb-6">
      <Textarea
        placeholder="Share what's on your mind..."
        className="w-full outline-none focus:outline-none focus:ring-0 focus:ring-transparent hover:ring-0 mb-3"
        rows={3}
        value={content}
        onChange={(e) => setContent(e.target.value)}
        disabled={loading}
      />
      <div className="flex justify-end">
        <Button 
          size="sm" 
          onClick={handlePost} 
          disabled={!content.trim() || loading}
        >
          {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
          Post
        </Button>
      </div>
    </div>
  );
}

export default CreatePostCompact;