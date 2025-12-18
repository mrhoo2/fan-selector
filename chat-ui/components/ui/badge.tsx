import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-bv-blue-400 focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-bv-blue-400 text-white hover:bg-bv-blue-300",
        secondary:
          "border-transparent bg-neutral-100 text-neutral-800 hover:bg-neutral-200",
        destructive:
          "border-transparent bg-red-400 text-white hover:bg-red-700",
        success:
          "border-transparent bg-green-400 text-white hover:bg-green-700",
        warning:
          "border-transparent bg-yellow-400 text-neutral-800 hover:bg-yellow-700",
        outline: "text-neutral-800 border-neutral-200",
      },
    },
    defaultVariants: {
      variant: "default",
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
