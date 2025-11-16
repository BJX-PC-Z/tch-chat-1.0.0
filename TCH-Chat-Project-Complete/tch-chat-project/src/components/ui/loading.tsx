import * as React from "react"
import { cn } from "@/utils"

interface LoadingSpinnerProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: 'sm' | 'md' | 'lg';
  color?: 'primary' | 'secondary' | 'white';
}

const LoadingSpinner = React.forwardRef<HTMLDivElement, LoadingSpinnerProps>(
  ({ className, size = 'md', color = 'primary', ...props }, ref) => {
    const sizeClasses = {
      sm: 'w-4 h-4',
      md: 'w-6 h-6',
      lg: 'w-8 h-8'
    };

    const colorClasses = {
      primary: 'border-t-tch-primary',
      secondary: 'border-t-gray-600',
      white: 'border-t-white'
    };

    return (
      <div
        ref={ref}
        className={cn(
          'animate-spin rounded-full border-2 border-gray-300',
          sizeClasses[size],
          colorClasses[color],
          className
        )}
        {...props}
      />
    )
  }
)
LoadingSpinner.displayName = "LoadingSpinner"

interface LoadingProps extends React.HTMLAttributes<HTMLDivElement> {
  text?: string;
  variant?: 'spinner' | 'dots' | 'pulse';
}

const Loading = React.forwardRef<HTMLDivElement, LoadingProps>(
  ({ className, text = "加载中...", variant = 'spinner', ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'flex items-center justify-center gap-3 p-4',
          className
        )}
        {...props}
      >
        {variant === 'spinner' && <LoadingSpinner />}
        {variant === 'dots' && <LoadingDots />}
        {variant === 'pulse' && <LoadingPulse />}
        {text && <span className="text-sm text-muted-foreground">{text}</span>}
      </div>
    )
  }
)
Loading.displayName = "Loading"

const LoadingDots = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('flex space-x-1', className)} {...props}>
      <div className="w-2 h-2 bg-tch-primary rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
      <div className="w-2 h-2 bg-tch-primary rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
      <div className="w-2 h-2 bg-tch-primary rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
    </div>
  )
)
LoadingDots.displayName = "LoadingDots"

const LoadingPulse = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('flex space-x-2', className)}
      {...props}
    >
      <div className="w-3 h-3 bg-tch-primary rounded-full animate-pulse" />
      <div className="w-3 h-3 bg-tch-accent rounded-full animate-pulse" style={{ animationDelay: '0.5s' }} />
      <div className="w-3 h-3 bg-tch-secondary rounded-full animate-pulse" style={{ animationDelay: '1s' }} />
    </div>
  )
)
LoadingPulse.displayName = "LoadingPulse"

interface LoadingOverlayProps extends React.HTMLAttributes<HTMLDivElement> {
  text?: string;
}

const LoadingOverlay = React.forwardRef<HTMLDivElement, LoadingOverlayProps>(
  ({ className, text = "处理中...", ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        'fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50',
        className
      )}
      {...props}
    >
      <div className="bg-tch-bg-card rounded-lg p-6 shadow-xl">
        <Loading text={text} />
      </div>
    </div>
  )
)
LoadingOverlay.displayName = "LoadingOverlay"

export {
  LoadingSpinner,
  Loading,
  LoadingDots,
  LoadingPulse,
  LoadingOverlay
}