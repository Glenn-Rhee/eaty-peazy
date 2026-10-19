"use client";

import { Check, Minus } from "lucide-react";
import { cn } from "@/lib/utils";

/* ===== Types ===== */

type CheckboxValue = "checked" | "unchecked" | "indeterminate";
type CheckboxVariant = "fill" | "outline";

interface CheckboxProps {
  checked?: CheckboxValue | boolean;
  variant?: CheckboxVariant;
  disabled?: boolean;
  focused?: boolean;
  onChange?: (checked: boolean) => void;
  className?: string;
  label?: string;
  id?: string;
}

/* ===== Component ===== */

export function Checkbox({
  checked = false,
  variant = "fill",
  disabled = false,
  focused = false,
  onChange,
  className,
  label,
  id,
}: CheckboxProps) {
  // Normalize boolean to CheckboxValue
  const value: CheckboxValue =
    typeof checked === "boolean"
      ? checked
        ? "checked"
        : "unchecked"
      : checked;

  const isChecked = value === "checked";
  const isIndeterminate = value === "indeterminate";
  const isActive = isChecked || isIndeterminate;

  const handleClick = () => {
    if (disabled) return;
    onChange?.(!isChecked);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleClick();
    }
  };

  return (
    <div className={cn("inline-flex items-center gap-2", className)}>
      <button
        type="button"
        id={id}
        role="checkbox"
        aria-checked={isIndeterminate ? "mixed" : isChecked}
        aria-disabled={disabled}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        disabled={disabled}
        className={cn(
          "flex h-4 w-4 items-center justify-center rounded transition-colors",
          // Fill variant
          variant === "fill" && isActive && "bg-brand-150",
          variant === "fill" && isActive && focused && !disabled && "ring-2 ring-brand-300 ring-offset-1",
          variant === "fill" && !isActive && "border border-neutral-400 bg-neutral-100",
          variant === "fill" && !isActive && focused && !disabled && "ring-2 ring-brand-300 ring-offset-1",
          // Outline variant
          variant === "outline" && isActive && !disabled && !focused && "border-2 border-brand-200 bg-white",
          variant === "outline" && isActive && focused && !disabled && "border-2 border-brand-300 bg-white ring-2 ring-brand-300 ring-offset-1",
          variant === "outline" && !isActive && !disabled && !focused && "border-2 border-brand-300 bg-white",
          variant === "outline" && !isActive && focused && !disabled && "border-2 border-brand-300 bg-white ring-2 ring-brand-300 ring-offset-1",
          variant === "outline" && isActive && disabled && "border-2 border-brand-100 bg-white",
          variant === "outline" && !isActive && disabled && "border-2 border-neutral-200 bg-white",
          // Cursor
          disabled ? "cursor-not-allowed" : "cursor-pointer"
        )}
      >
        {isChecked && (
          <Check
            className={cn(
              "h-3 w-3",
              variant === "fill" && "text-white",
              variant === "outline" && !disabled && "text-brand-200",
              variant === "outline" && disabled && "text-brand-100"
            )}
            strokeWidth={3}
          />
        )}
        {isIndeterminate && (
          <Minus
            className={cn(
              "h-3 w-3",
              variant === "fill" && "text-white",
              variant === "outline" && !disabled && "text-brand-200",
              variant === "outline" && disabled && "text-brand-100"
            )}
            strokeWidth={3}
          />
        )}
      </button>
      {label && (
        <label
          htmlFor={id}
          className={cn(
            "text-sm select-none",
            disabled ? "text-neutral-400 cursor-not-allowed" : "text-neutral-900 cursor-pointer"
          )}
          onClick={handleClick}
        >
          {label}
        </label>
      )}
    </div>
  );
}
