import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { X } from "lucide-react"

import { cn } from "@/utils"

const alertVariants = cva(
  "relative w-full rounded-lg border p-4 [&>svg~*]:pl-7 [&>svg+div]:translate-y-[-3px] [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg]:text-foreground",
  {
    variants: {
      variant: {
        default: "bg-background text-foreground",
        destructive:
          "border-destructive/50 text-destructive dark:border-destructive [&>svg]:text-destructive",
        warning:
          "border-yellow-500/50 text-yellow-700 bg-yellow-50 dark:bg-yellow-900/20 dark:text-yellow-300 [&>svg]:text-yellow-600 dark:[&>svg]:text-yellow-400",
        success:
          "border-green-500/50 text-green-700 bg-green-50 dark:bg-green-900/20 dark:text-green-300 [&>svg]:text-green-600 dark:[&>svg]:text-green-400",
        info:
          "border-blue-500/50 text-blue-700 bg-blue-50 dark:bg-blue-900/20 dark:text-blue-300 [&>svg]:text-blue-600 dark:[&>svg]:text-blue-400",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

const Alert = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof alertVariants>
>(({ className, variant, ...props }, ref) => (
  <div
    ref={ref}
    role="alert"
    className={cn(alertVariants({ variant }), className)}
    {...props}
  />
))
Alert.displayName = "Alert"

const AlertTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h5
    ref={ref}
    className={cn("mb-1 font-medium leading-none tracking-tight", className)}
    {...props}
  />
))
AlertTitle.displayName = "AlertTitle"

const AlertDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("text-sm [&_p]:leading-relaxed", className)}
    {...props}
  />
))
AlertDescription.displayName = "AlertDescription"

interface DismissibleAlertProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: VariantProps<typeof alertVariants>["variant"];
  title?: string;
  description?: string;
  onDismiss?: () => void;
}

const DismissibleAlert = React.forwardRef<HTMLDivElement, DismissibleAlertProps>(
  ({ className, variant = "default", title, description, onDismiss, children, ...props }, ref) => {
    return (
      <Alert ref={ref} variant={variant} className={className} {...props}>
        <div className="flex justify-between items-start">
          <div className="flex-1">
            {title && <AlertTitle>{title}</AlertTitle>}
            {(description || children) && (
              <AlertDescription>
                {description || children}
              </AlertDescription>
            )}
          </div>
          {onDismiss && (
            <button
              onClick={onDismiss}
              className="ml-4 -mr-2 -mt-2 p-1 rounded-md hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
              aria-label="关闭提示"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </Alert>
    )
  }
)
DismissibleAlert.displayName = "DismissibleAlert"

export { Alert, AlertTitle, AlertDescription, DismissibleAlert }