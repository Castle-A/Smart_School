import * as React from "react"
import { cn } from "../../lib/utils"

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'default' | 'outline' | 'ghost' | 'destructive';
    size?: 'default' | 'sm' | 'lg' | 'icon';
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant = 'default', size = 'default', ...props }, ref) => {
        return (
            <button
                ref={ref}
                className={cn(
                    "inline-flex items-center justify-center rounded-xl font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-blue-500 disabled:pointer-events-none disabled:opacity-50",
                    // Variants
                    variant === 'default' && "bg-blue-600 text-white shadow hover:bg-blue-500",
                    variant === 'destructive' && "bg-red-500 text-white shadow-sm hover:bg-red-400",
                    variant === 'outline' && "border border-slate-700 bg-transparent shadow-sm hover:bg-slate-800 hover:text-white",
                    variant === 'ghost' && "hover:bg-slate-800 hover:text-white",

                    // Sizes
                    size === 'default' && "h-9 px-4 py-2",
                    size === 'sm' && "h-8 rounded-lg px-3 text-xs",
                    size === 'lg' && "h-11 rounded-xl px-8 text-base",
                    size === 'icon' && "h-9 w-9",
                    className
                )}
                {...props}
            />
        )
    }
)
Button.displayName = "Button"

export { Button }
