"use client"

import * as React from "react"
import { createPortal } from "react-dom"
import { XIcon, CheckCircle2Icon, AlertCircleIcon, InfoIcon, ShieldAlertIcon, SparklesIcon, Loader2Icon } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

export interface HeroModalProps {
  open: boolean
  onClose: () => void
  title?: React.ReactNode
  description?: React.ReactNode
  children?: React.ReactNode
  
  // Design & Style Variants
  variant?: "default" | "gradient" | "glass" | "creative" | "success" | "danger" | "warning" | "info"
  size?: "sm" | "md" | "lg" | "xl" | "2xl" | "full"
  
  // Custom Icon
  icon?: React.ReactNode
  
  // Behavior
  closeOnOverlayClick?: boolean
  closeOnEsc?: boolean
  showCloseButton?: boolean
  
  // Action Buttons
  primaryAction?: {
    label: string
    onClick: () => void | Promise<void>
    isLoading?: boolean
    disabled?: boolean
    variant?: "default" | "outline" | "secondary" | "ghost" | "destructive" | "link"
  }
  secondaryAction?: {
    label: string
    onClick: () => void
    disabled?: boolean
  }
  footerContent?: React.ReactNode
}

function useModalTransition(open: boolean, durationMs = 300) {
  const [shouldRender, setShouldRender] = React.useState(open)
  const [animate, setAnimate] = React.useState(false)

  React.useEffect(() => {
    let timeoutId: NodeJS.Timeout

    if (open) {
      setShouldRender(true)
      // trigger animation in next frame
      timeoutId = setTimeout(() => {
        setAnimate(true)
      }, 10)
    } else {
      setAnimate(false)
      timeoutId = setTimeout(() => {
        setShouldRender(false)
      }, durationMs)
    }

    return () => clearTimeout(timeoutId)
  }, [open, durationMs])

  return { shouldRender, animate }
}

export function HeroModal({
  open,
  onClose,
  title,
  description,
  children,
  variant = "default",
  size = "md",
  icon,
  closeOnOverlayClick = true,
  closeOnEsc = true,
  showCloseButton = true,
  primaryAction,
  secondaryAction,
  footerContent
}: HeroModalProps) {
  const { shouldRender, animate } = useModalTransition(open, 300)
  const [mounted, setMounted] = React.useState(false)
  const panelRef = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  // Close on Escape key
  React.useEffect(() => {
    if (!open || !closeOnEsc) return
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
    }
    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [open, closeOnEsc, onClose])

  // Prevent body scroll when open
  React.useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }
    return () => {
      document.body.style.overflow = ""
    }
  }, [open])

  if (!mounted || !shouldRender) return null

  // Size mapping
  const sizeClasses = {
    sm: "max-w-sm w-full",
    md: "max-w-md w-full",
    lg: "max-w-lg w-full",
    xl: "max-w-xl w-full",
    "2xl": "max-w-2xl w-full",
    full: "max-w-[95vw] w-full h-[95vh]"
  }[size]

  // Default icons for variants
  const defaultIcons: Record<string, React.ReactNode> = {
    success: <CheckCircle2Icon className="size-6 text-emerald-500" />,
    danger: <ShieldAlertIcon className="size-6 text-rose-500" />,
    warning: <AlertCircleIcon className="size-6 text-amber-500" />,
    info: <InfoIcon className="size-6 text-sky-500" />,
    creative: <SparklesIcon className="size-6 text-violet-500 animate-pulse" />
  }

  const modalIcon = icon || (variant && defaultIcons[variant])

  // Custom Primary Button action wrapper to handle loading state
  const handlePrimaryClick = async () => {
    if (primaryAction && primaryAction.onClick) {
      await primaryAction.onClick()
    }
  }

  // Define layout structures based on variant
  const isAlertVariant = ["success", "danger", "warning", "info"].includes(variant)

  return createPortal(
    <div
      className={cn(
        "fixed inset-0 z-50 flex items-center justify-center p-4 transition-all duration-300 ease-out",
        animate ? "bg-black/60 backdrop-blur-xs opacity-100" : "bg-black/0 backdrop-blur-none opacity-0"
      )}
      onClick={(e) => {
        if (closeOnOverlayClick && e.target === e.currentTarget) {
          onClose()
        }
      }}
      role="presentation"
    >
      {/* Glow Effect for Gradient/Glass variants */}
      {(variant === "gradient" || variant === "glass") && (
        <div
          className={cn(
            "absolute pointer-events-none rounded-full blur-[120px] opacity-30 transition-all duration-500",
            variant === "gradient" ? "bg-indigo-500 size-[400px]" : "bg-violet-600 size-[300px]",
            animate ? "scale-100 opacity-30" : "scale-75 opacity-0"
          )}
        />
      )}

      <div
        ref={panelRef}
        className={cn(
          "relative flex flex-col overflow-hidden bg-background text-foreground shadow-2xl border transition-all duration-300 ease-out",
          sizeClasses,
          
          // Panel enter/leave states
          animate 
            ? "translate-y-0 scale-100 opacity-100" 
            : "translate-y-4 scale-95 opacity-0",

          // Variant styling
          variant === "glass" && "bg-background/80 backdrop-blur-xl border-white/10 dark:border-white/5",
          variant === "creative" && "mt-8 overflow-visible",
          isAlertVariant && "border-l-4",
          variant === "success" && "border-l-emerald-500",
          variant === "danger" && "border-l-rose-500",
          variant === "warning" && "border-l-amber-500",
          variant === "info" && "border-l-sky-500"
        )}
        role="dialog"
        aria-modal="true"
      >
        {/* Floating circular icon for creative variant */}
        {variant === "creative" && (
          <div className="absolute -top-10 left-1/2 -translate-x-1/2 z-10 flex size-20 items-center justify-center rounded-full border bg-background shadow-lg">
            <div className="flex size-16 items-center justify-center rounded-full bg-linear-to-tr from-violet-500/10 to-indigo-500/10 text-violet-600 dark:text-violet-400">
              {modalIcon || <SparklesIcon className="size-8 animate-pulse" />}
            </div>
          </div>
        )}

        {/* Close Button */}
        {showCloseButton && (
          <button
            onClick={onClose}
            className={cn(
              "absolute right-4 top-4 z-20 flex size-8 items-center justify-center rounded-full border border-transparent bg-muted/40 hover:bg-muted/80 text-muted-foreground hover:text-foreground transition-all duration-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-ring/50",
              variant === "gradient" && "text-white/80 hover:text-white bg-white/10 hover:bg-white/20"
            )}
            aria-label="Close modal"
          >
            <XIcon className="size-4" />
          </button>
        )}

        {/* Header Section */}
        {variant === "gradient" ? (
          <div className="relative bg-gradient-to-r from-violet-600 via-indigo-600 to-blue-600 text-white p-6 pb-8 overflow-hidden">
            {/* Ambient pattern / lighting overlay */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.15),transparent)] pointer-events-none" />
            <div className="relative flex items-center gap-3">
              {modalIcon && <div className="text-white drop-shadow-md">{modalIcon}</div>}
              <div>
                {title && <h2 className="text-lg font-semibold tracking-tight">{title}</h2>}
                {description && <p className="text-xs text-white/80 mt-1">{description}</p>}
              </div>
            </div>
          </div>
        ) : (
          <div className={cn(
            "p-6 flex flex-col gap-1.5",
            variant === "creative" && "pt-12 text-center items-center"
          )}>
            <div className={cn(
              "flex gap-3",
              variant === "creative" ? "flex-col items-center" : "items-start"
            )}>
              {/* Render icon next to title in standard/alert variants if present */}
              {modalIcon && variant !== "creative" && (
                <div className="shrink-0 mt-0.5">{modalIcon}</div>
              )}
              <div className={cn(variant === "creative" && "text-center")}>
                {title && <h2 className="text-base font-semibold leading-none tracking-tight">{title}</h2>}
                {description && <p className="text-xs text-muted-foreground mt-1.5 leading-normal">{description}</p>}
              </div>
            </div>
          </div>
        )}

        {/* Body Section */}
        <div className={cn(
          "px-6 py-4 flex-1 text-xs/relaxed text-muted-foreground overflow-y-auto",
          variant === "glass" && "text-foreground/90"
        )}>
          {children}
        </div>

        {/* Footer Section */}
        {(primaryAction || secondaryAction || footerContent) && (
          <div className={cn(
            "p-6 pt-4 border-t flex flex-col-reverse sm:flex-row sm:justify-end gap-2 bg-muted/20",
            variant === "glass" && "border-white/10 dark:border-white/5",
            variant === "creative" && "justify-center"
          )}>
            {footerContent}
            
            {/* Cancel/Secondary Action */}
            {secondaryAction && (
              <Button
                variant="outline"
                onClick={secondaryAction.onClick}
                disabled={secondaryAction.disabled || primaryAction?.isLoading}
                className="cursor-pointer"
              >
                {secondaryAction.label}
              </Button>
            )}

            {/* Confirm/Primary Action */}
            {primaryAction && (
              <Button
                variant={primaryAction.variant || "default"}
                onClick={handlePrimaryClick}
                disabled={primaryAction.disabled || primaryAction.isLoading}
                className={cn(
                  "cursor-pointer font-medium shadow-sm transition-all duration-200",
                  primaryAction.variant === "gradient" && "bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white border-0"
                )}
              >
                {primaryAction.isLoading ? (
                  <>
                    <Loader2Icon className="mr-2 size-3 animate-spin" />
                    <span>Loading...</span>
                  </>
                ) : (
                  primaryAction.label
                )}
              </Button>
            )}
          </div>
        )}
      </div>
    </div>,
    document.body
  )
}
