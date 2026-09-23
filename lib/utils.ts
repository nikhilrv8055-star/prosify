import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Formats price in Indian Lakhs and Crores (₹)
 * e.g. 4800000 -> ₹48.0 Lakh, 12500000 -> ₹1.25 Cr
 */
export function formatIndianPrice(amount: number, _isRent = false): string {
  if (!amount || amount === 0) return 'Price on Request';
  if (amount >= 10000000) {
    const cr = amount / 10000000;
    return `₹${cr.toFixed(cr % 1 === 0 ? 0 : 2)} Cr`;
  }
  if (amount >= 100000) {
    const lakh = amount / 100000;
    return `₹${lakh.toFixed(lakh % 1 === 0 ? 0 : 2)} Lakh`;
  }
  return `₹${amount.toLocaleString('en-IN')}`;
}

export const formatPrice = formatIndianPrice;

export function formatArea(sqft: number): string {
  if (!sqft) return 'N/A';
  return `${sqft.toLocaleString('en-IN')} sq.ft`;
}
