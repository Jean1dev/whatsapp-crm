
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Helper functions for font styles
export const fontStyles = {
  title: "font-bricolage font-bold",
  subtitle: "font-bricolage font-semibold",
  heading: "font-bricolage font-bold",
  body: "font-sans",
}
