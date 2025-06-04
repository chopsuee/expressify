import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';

/**
 * PostSkeleton - A loading placeholder that mimics the structure of a post card
 * 
 * This component displays a skeleton UI that matches the layout of the PostCard component,
 * providing a better loading experience by showing the expected content structure
 * before the actual data loads.
 */
export function PostSkeleton() {
  return (
    <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-4">
      {/* Author info skeleton */}
      <div className="flex items-center gap-3 mb-4">
        <Skeleton className="h-10 w-10 rounded-full" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-3 w-16" />
        </div>
      </div>
      
      {/* Post content skeleton */}
      <div className="space-y-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
        <Skeleton className="h-4 w-4/6" />
      </div>
      
      {/* Post actions skeleton */}
      <div className="flex justify-between mt-4">
        <Skeleton className="h-8 w-16" />
        <Skeleton className="h-8 w-16" />
      </div>
    </div>
  );
}