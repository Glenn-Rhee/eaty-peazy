"use client";

import { forwardRef, type ButtonHTMLAttributes } from "react";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

type ButtonVariant =
  | "primary"
  | "secondary"
  | "danger"
  | "blue"
  | "outline"
  | "ghost"
  | "tertiary"
  | "link";

type ButtonSize = "sm" | "md" | "lg" | "icon" | "link";

const variants: Record<ButtonVariant, string> = {
  primary:
    "bg-brand-150 text-white hover:bg-brand-hover focus-visible:ring-brand-150/40",
  secondary:
    "bg-gray-100 text-gray-900 hover:bg-gray-200 focus-visible:ring-gray-400/30",
  danger:
    "bg-red-600 text-white hover:bg-red-700 focus-visible:ring-red-600/40",
  blue: "bg-blue-600 text-white hover:bg-blue-700 focus-visible:ring-blue-600/40",
  outline:
    "border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 hover:text-gray-900 focus-visible:ring-gray-300",
  ghost:
    "text-brand-150 hover:bg-emerald-50 hover:text-brand-hover focus-visible:ring-brand-150/30",
  tertiary:
    "bg-white border border-emerald-200 text-brand-150 hover:bg-emerald-50/50 focus-visible:ring-brand-150/30",
  link: "bg-transparent text-brand-150 hover:text-brand-hover hover:underline focus-visible:ring-brand-150/40",
};

const sizes: Record<ButtonSize, string> = {
  sm: "h-8 px-3 text-xs gap-1.5",
  md: "h-10 px-4 text-sm gap-2",
  lg: "h-12 px-6 text-base gap-2.5",
  icon: "h-10 w-10 justify-center",
  link: "h-auto px-0 text-sm align-baseline",
};

const base =
  "inline-flex items-center justify-center rounded-lg font-semibold transition-colors cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 select-none";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = "primary",
      size = variant === "link" ? "link" : "md",
      loading = false,
      className,
      children,
      disabled,
      ...props
    },
    ref,
  ) => {
    return (
      <button
        ref={ref}
        type="button"
        disabled={disabled || loading}
        aria-busy={loading}
        className={cn(
          base,
          variants[variant],
          sizes[size],
          variant === "link" && size === "md" && "h-auto px-0",
          className,
        )}
        {...props}
      >
        {loading && <Loader2 className="h-4 w-4 animate-spin" />}
        {children}
      </button>
    );
  },
);

Button.displayName = "Button";
