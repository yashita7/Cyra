import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[11px] font-semibold transition-colors",
  {
    variants: {
      variant: {
        default: "border-slate/70 bg-squid text-muted",
        orange: "border-orange/40 bg-orange/10 text-orange",
        sky: "border-sky/40 bg-sky/10 text-sky",
        success: "border-success/40 bg-success/10 text-success",
        danger: "border-danger/40 bg-danger/10 text-danger",
        gold: "border-gold/40 bg-gold/10 text-gold",
      },
    },
    defaultVariants: { variant: "default" },
  },
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
