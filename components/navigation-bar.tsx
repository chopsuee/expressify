"use client";
import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import { MdPeople, MdLogout } from "react-icons/md";
import { GoHomeFill } from "react-icons/go";
import { IoPerson } from "react-icons/io5";
import { ModeToggle } from "@/components/ModeToggle";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, X } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { useUsers } from "@/lib/users-context";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Author } from "@/lib/types";

function NavigationBar() {
  const pathname = usePathname();
  const router = useRouter();
  const { logout } = useAuth();
  const { users } = useUsers();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Author[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  // Handle click outside search results
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsSearching(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Filter users based on search query
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setSearchResults([]);
      return;
    }

    const query = searchQuery.toLowerCase();
    const filteredUsers = users.filter(user => 
      user.name.toLowerCase().includes(query) || 
      user.username.toLowerCase().includes(query)
    );
    setSearchResults(filteredUsers);
  }, [searchQuery, users]);

  const handleLogout = () => {
    logout();
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setIsSearching(true);
  };

  const handleUserClick = (userId: string | number) => {
    router.push(`/profile/${userId}`);
    setIsSearching(false);
    setSearchQuery("");
  };

  return (
    <div className="w-full">
      {/* Top bar with search and controls */}
      <div className="fixed top-0 left-0 right-0 bg-background/80 backdrop-blur-sm border-b p-2 flex justify-between items-center z-50">
        <div className="w-64 ml-4" ref={searchRef}>
          <div className="relative w-full">
            <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input 
              placeholder="Search users..." 
              className="pl-8 h-8 bg-background/60 focus-visible:ring-1 rounded-full border-muted"
              value={searchQuery}
              onChange={handleSearch}
              onFocus={() => setIsSearching(true)}
            />
            {searchQuery && (
              <button 
              title="search"
                className="absolute right-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
                onClick={() => {
                  setSearchQuery("");
                  setSearchResults([]);
                }}
              >
                <X size={16} />
              </button>
            )}
            
            {/* Search Results Dropdown */}
            {isSearching && searchResults.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-background border rounded-md shadow-md z-50 max-h-60 overflow-y-auto">
                {searchResults.map(user => (
                  <div 
                    key={user.id} 
                    className="flex items-center gap-2 p-2 hover:bg-muted cursor-pointer"
                    onClick={() => handleUserClick(user.id)}
                  >
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user.avatar} />
                      <AvatarFallback>{user.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium">{user.name}</p>
                      <p className="text-xs text-muted-foreground">@{user.username}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            {/* No Results Message */}
            {isSearching && searchQuery && searchResults.length === 0 && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-background border rounded-md shadow-md z-50 p-2">
                <p className="text-sm text-muted-foreground">No users found</p>
              </div>
            )}
          </div>
        </div>
        
        <div className="flex items-center gap-2 mr-4">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={handleLogout} 
            className="text-muted-foreground"
            title="Logout"
          >
            <MdLogout className="h-5 w-5" />
          </Button>
          <ModeToggle />
        </div>
      </div>
      
      {/* Bottom navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-background/80 backdrop-blur-sm border-t p-2 z-50">
        <NavigationMenu className="w-full">
          <NavigationMenuList className="flex justify-center space-x-12 w-full">
            <NavigationMenuItem>
              <NavigationMenuLink asChild>
                <Link
                  href="/profile"
                  className={
                    pathname === "/profile" 
                      ? "flex flex-col items-center text-primary" 
                      : "flex flex-col items-center text-muted-foreground"
                  }
                >
                  <IoPerson className="h-6 w-6" />
                  <span className="text-xs mt-1">Profile</span>
                </Link>
              </NavigationMenuLink>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <NavigationMenuLink asChild>
                <Link
                  href="/home"
                  className={
                    pathname === "/home" || pathname === "/" 
                      ? "flex flex-col items-center text-primary" 
                      : "flex flex-col items-center text-muted-foreground"
                  }
                >
                  <GoHomeFill className="h-6 w-6" />
                  <span className="text-xs mt-1">Home</span>
                </Link>
              </NavigationMenuLink>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <NavigationMenuLink asChild>
                <Link
                  href="/friends"
                  className={
                    pathname === "/friends" 
                      ? "flex flex-col items-center text-primary" 
                      : "flex flex-col items-center text-muted-foreground"
                  }
                >
                  <MdPeople className="h-6 w-6" />
                  <span className="text-xs mt-1">Friends</span>
                </Link>
              </NavigationMenuLink>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      </div>
      
      {/* Spacer for fixed elements */}
      <div className="h-12"></div>
    </div>
  );
}

export default NavigationBar;