import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatIndianPrice(amount: number): string {
  if (!amount || amount === 0) return 'Price on Request';
  if (amount >= 10000000) {
    const cr = amount / 10000000;
    return `₹${cr.toFixed(cr % 1 === 0 ? 0 : 2)} Cr`;
  }
  if (amount >= 100000) {
    const lakh = amount / 100000;
    return `₹${lakh.toFixed(lakh % 1 === 0 ? 0 : 1)} Lakh`;
  }
  return `₹${amount.toLocaleString('en-IN')}`;
}

export function formatPricePerSqFt(price: number, area: number): string {
  if (!price || !area || area === 0) return '';
  const rate = Math.round(price / area);
  return `₹${rate.toLocaleString('en-IN')}/sq.ft`;
}

export function formatIndianNumber(num: number): string {
  return num.toLocaleString('en-IN');
}
