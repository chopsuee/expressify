'use client'
import React, { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from '@/components/ui/input'
import { Search } from 'lucide-react'
import { usePostsStore } from '@/lib/posts-store'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import Link from 'next/link'

export default function SearchModal() {
  const [query, setQuery] = useState('')
  const [isOpen, setIsOpen] = useState(false)
  const { authors } = usePostsStore()
  
  // Filter authors based on search query
  const filteredAuthors = query.trim() !== '' 
    ? Object.values(authors).filter(author => 
        author.name.toLowerCase().includes(query.toLowerCase()) || 
        author.username.toLowerCase().includes(query.toLowerCase())
      )
    : []

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <div className="relative w-full cursor-pointer">
          <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input 
            placeholder="Search..." 
            className="pl-8 h-8 bg-background/60 focus-visible:ring-1 rounded-full border-muted"
            onClick={() => setIsOpen(true)}
            readOnly
          />
        </div>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Search</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Input 
            placeholder="Search for people..." 
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
            className="border-muted"
          />
          
          <div className="max-h-[300px] overflow-y-auto space-y-2">
            {filteredAuthors.length > 0 ? (
              filteredAuthors.map(author => (
                <Link 
                  key={author.id} 
                  href={`/profile/${author.id}`}
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-3 p-2 rounded-md hover:bg-muted transition-colors"
                >
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={author.avatar} />
                    <AvatarFallback>{author.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{author.name}</p>
                    <p className="text-xs text-muted-foreground">@{author.username}</p>
                  </div>
                </Link>
              ))
            ) : query.trim() !== '' ? (
              <p className="text-center text-muted-foreground py-4">No results found</p>
            ) : null}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}