import { cn } from "@/lib/utils"

/**
 * Skeleton - A base component for creating loading placeholder UI elements
 * 
 * This component provides a pulsing animation effect for skeleton loading states.
 * It can be customized with additional classes to create different shapes and sizes.
 * 
 * @example
 * // Basic usage
 * <Skeleton className="h-4 w-20" />
 * 
 * @example
 * // Creating a circular skeleton (avatar)
 * <Skeleton className="h-12 w-12 rounded-full" />
 */
function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("animate-pulse rounded-md bg-muted", className)}
      {...props}
    />
  )
}

export { Skeleton }