// Utilitaire pour combiner les classes CSS (cn helper)
import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: any[]) {
    return twMerge(clsx(inputs))
}
