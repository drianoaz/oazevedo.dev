import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Combines CSS classes using clsx and tailwind-merge
 *
 * @param {...ClassValue} inputs - The classes to be combined
 * @returns {string} - A string containing the combined classes
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
