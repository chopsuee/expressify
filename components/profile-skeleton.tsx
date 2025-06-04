import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from '@/components/ui/separator';

/**
 * ProfileSkeleton - A loading placeholder that mimics the structure of a user profile
 * 
 * This component displays a skeleton UI that matches the layout of the UserProfile component,
 * providing a better loading experience by showing the expected content structure
 * before the actual profile data loads.
 */
export function ProfileSkeleton() {
  return (
    <div className="flex flex-col w-full">
      {/* Profile Header Skeleton - Avatar, name, username and edit button */}
      <div className="flex items-center gap-4 mb-6">
        <Skeleton className="h-20 w-20 rounded-full" />
        <div className="space-y-2">
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-4 w-24" />
        </div>
        <Skeleton className="h-9 w-24 ml-auto" />
      </div>
      
      <Separator className="my-4" />
      
      {/* Profile Stats Skeleton - Posts, followers, following counts */}
      <div className="grid grid-cols-3 gap-4 mb-6 text-center">
        <div>
          <Skeleton className="h-8 w-8 mx-auto mb-1" />
          <Skeleton className="h-4 w-12 mx-auto" />
        </div>
        <div>
          <Skeleton className="h-8 w-8 mx-auto mb-1" />
          <Skeleton className="h-4 w-16 mx-auto" />
        </div>
        <div>
          <Skeleton className="h-8 w-8 mx-auto mb-1" />
          <Skeleton className="h-4 w-16 mx-auto" />
        </div>
      </div>
      
      <Separator className="my-4" />
      
      {/* Bio Skeleton - About section */}
      <div className="mb-6">
        <Skeleton className="h-5 w-16 mb-2" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4 mt-1" />
      </div>
    </div>
  );
}
}