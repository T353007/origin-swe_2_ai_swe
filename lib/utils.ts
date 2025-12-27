import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatTime(minutes: number): string {
  // Round to nearest integer to avoid floating point precision issues
  const roundedMinutes = Math.round(minutes);
  
  if (roundedMinutes < 60) {
    return `${roundedMinutes} min`;
  }
  const hours = Math.floor(roundedMinutes / 60);
  const mins = Math.round(roundedMinutes % 60);
  return mins > 0 ? `${hours}h ${mins}min` : `${hours}h`;
}

export function estimateReadingTime(content: string): number {
  const wordsPerMinute = 200;
  const words = content.trim().split(/\s+/).length;
  return Math.ceil(words / wordsPerMinute);
}

