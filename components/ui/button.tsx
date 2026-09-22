import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium transition-colors focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-neutral-950 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 cursor-pointer active:scale-[0.98]',
  {
    variants: {
      variant: {
        default:
          'bg-[#D4A017] text-neutral-950 font-semibold hover:bg-[#F4C430] shadow-xs',
        destructive:
          'bg-red-600 text-white hover:bg-red-700 shadow-xs',
        outline:
          'border border-neutral-300 bg-white hover:bg-neutral-100 text-neutral-900',
        secondary:
          'bg-neutral-100 text-neutral-900 hover:bg-neutral-200',
        ghost:
          'hover:bg-neutral-100 hover:text-neutral-950 text-neutral-700',
        link: 'text-neutral-900 underline-offset-4 hover:underline',
        goldOutline:
          'border border-[#D4A017] text-neutral-900 bg-amber-50/50 hover:bg-amber-100/50',
      },
      size: {
        default: 'h-10 px-4 py-2',
        sm: 'h-8 rounded-md px-3 text-xs',
        lg: 'h-11 rounded-lg px-8 text-base',
        icon: 'h-9 w-9',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = 'Button';

export { Button, buttonVariants };
