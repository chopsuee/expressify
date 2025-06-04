import React from 'react'
import { Input } from '@/components/ui/input'
import { Search } from 'lucide-react'

function SearchBar() {
  return (
    <div className="relative w-full max-w-[200px]">
      <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <Input 
        placeholder="Search..." 
        className="pl-8 h-8 bg-background/60 focus-visible:ring-1"
      />
    </div>
  )
}

export default SearchBar