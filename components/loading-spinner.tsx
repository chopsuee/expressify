import React from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * LoadingSpinner Props
 * @property {string} size - Size of the spinner: 'sm', 'md', or 'lg'
 * @property {string} className - Additional CSS classes
 * @property {string} text - Optional text to display below the spinner
 */
interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  text?: string;
}

/**
 * Size mapping for the spinner
 */
const sizeMap = {
  sm: 'h-4 w-4',
  md: 'h-8 w-8',
  lg: 'h-12 w-12',
};

/**
 * LoadingSpinner - A configurable loading indicator component
 * 
 * This component displays a spinning loader with optional text.
 * It can be configured with different sizes and additional CSS classes.
 * 
 * @example
 * // Basic usage
 * <LoadingSpinner />
 * 
 * @example
 * // With size and text
 * <LoadingSpinner size="lg" text="Loading data..." />
 */
export function LoadingSpinner({ 
  size = 'md', 
  className,
  text
}: LoadingSpinnerProps) {
  return (
    <div className="flex flex-col items-center justify-center py-4">
      <Loader2 className={cn("animate-spin text-primary", sizeMap[size], className)} />
      {text && <p className="text-muted-foreground mt-2">{text}</p>}
    </div>
  );
}