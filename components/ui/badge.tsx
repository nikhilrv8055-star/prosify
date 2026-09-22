import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const badgeVariants = cva(
  'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-hidden',
  {
    variants: {
      variant: {
        default:
          'border-transparent bg-neutral-900 text-white shadow-xs',
        secondary:
          'border-transparent bg-neutral-100 text-neutral-900',
        destructive:
          'border-transparent bg-red-100 text-red-800 border-red-200',
        outline: 'text-neutral-950 border-neutral-300',
        gold: 'border-[#D4A017]/40 bg-amber-50 text-[#9A7209]',
        emerald: 'border-emerald-200 bg-emerald-50 text-emerald-800',
        blue: 'border-blue-200 bg-blue-50 text-blue-800',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
