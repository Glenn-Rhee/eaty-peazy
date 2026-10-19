"use client";

import { cn } from "@/lib/utils";

/* ===== Types ===== */

interface SwitchProps {
  checked?: boolean;
  disabled?: boolean;
  onChange?: (checked: boolean) => void;
  className?: string;
  label?: string;
  id?: string;
}

/* ===== Component ===== */

export function Switch({
  checked = false,
  disabled = false,
  onChange,
  className,
  label,
  id,
}: SwitchProps) {
  const handleClick = () => {
    if (disabled) return;
    onChange?.(!checked);
  };

  return (
    <div className={cn("inline-flex items-center gap-2.5", className)}>
      <button
        type="button"
        id={id}
        role="switch"
        aria-checked={checked}
        aria-disabled={disabled}
        onClick={handleClick}
        disabled={disabled}
        className={cn(
          "relative inline-flex h-6 w-12 items-center rounded-full p-[3px] transition-colors",
          // Checked (on) states (green)
          checked && !disabled && "bg-brand-200",
          // Unchecked (off) states (gray)
          !checked && !disabled && "bg-neutral-300",
          // Disabled states
          checked && disabled && "bg-brand-100",
          !checked && disabled && "bg-neutral-200",
          disabled ? "cursor-not-allowed" : "cursor-pointer"
        )}
      >
        <span
          className={cn(
            "inline-block h-[18px] w-[18px] rounded-full bg-white transition-transform",
            checked ? "translate-x-[24px]" : "translate-x-0"
          )}
        />
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