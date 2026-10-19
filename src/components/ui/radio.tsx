"use client";

import { cn } from "@/lib/utils";

/* ===== Types ===== */

interface RadioProps {
  checked?: boolean;
  disabled?: boolean;
  focused?: boolean;
  color?: "brand" | "danger";
  onChange?: (checked: boolean) => void;
  onFocus?: () => void;
  onBlur?: () => void;
  className?: string;
  label?: string;
  id?: string;
  name?: string;
  value?: string;
}

/* ===== Component ===== */

export function Radio({
  checked = false,
  disabled = false,
  focused = false,
  color = "brand",
  onChange,
  onFocus,
  onBlur,
  className,
  label,
  id,
  name,
  value,
}: RadioProps) {
  const handleClick = () => {
    if (disabled) return;
    onChange?.(!checked);
  };

  const handleFocus = () => {
    onFocus?.();
  };

  const handleBlur = () => {
    onBlur?.();
  };

  return (
    <div className={cn("inline-flex items-center gap-2", className)}>
      <button
        type="button"
        id={id}
        role="radio"
        aria-checked={checked}
        aria-disabled={disabled}
        data-name={name}
        data-value={value}
        onClick={handleClick}
        disabled={disabled}
        onFocus={handleFocus}
        onBlur={handleBlur}
        tabIndex={0}
        className={cn(
          "flex h-5 w-5 items-center justify-center rounded-full border-2 transition-colors focus:outline-none",
          // Checked states
          checked && !disabled && !focused && (color === "danger" ? "bg-red-500 border-red-500" : "bg-brand-200 border-brand-200"),
          checked && focused && !disabled && (color === "danger" ? "bg-red-500 border-red-500" : "bg-brand-200 border-brand-200"),
          // Unchecked enabled (default outline)
          !checked && !disabled && !focused && "border-brand-200 bg-white",
          !checked && focused && !disabled && "border-brand-200 bg-white",
          // Disabled states (neutral gray)
          disabled && "bg-neutral-200 border-neutral-200",
          disabled ? "cursor-not-allowed" : "cursor-pointer"
        )}
      >
        {(checked || focused) && !disabled && (
          <div className={cn(
            "h-1.5 w-1.5 rounded-full",
            focused ? (color === "danger" ? "bg-red-200" : "bg-brand-300") : "bg-white"
          )} />
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

/* ===== Radio Group ===== */

export interface RadioGroupOption {
  label: string;
  value: string;
  color?: "brand" | "danger";
  disabled?: boolean;
}

export interface RadioGroupProps {
  options: RadioGroupOption[];
  value?: string;
  onChange?: (value: string) => void;
  name?: string;
  disabled?: boolean;
  direction?: "horizontal" | "vertical";
  className?: string;
}

export function RadioGroup({
  options,
  value,
  onChange,
  name,
  disabled = false,
  direction = "vertical",
  className,
}: RadioGroupProps) {
  return (
    <div
      role="radiogroup"
      className={cn(
        "flex gap-3",
        direction === "vertical" ? "flex-col" : "flex-row items-center",
        className
      )}
    >
      {options.map((option) => {
        // Auto-detect danger color for standard negative labels if not explicitly defined
        const isDanger =
          option.color === "danger" ||
          (!option.color && (option.value === "Tidak" || option.value === "Rusak" || option.label === "Tidak" || option.label === "Rusak"));

        return (
          <Radio
            key={option.value}
            checked={value === option.value}
            disabled={disabled || option.disabled}
            onChange={() => onChange?.(option.value)}
            label={option.label}
            name={name}
            value={option.value}
            color={isDanger ? "danger" : (option.color ?? "brand")}
            focused={value === option.value}
          />
        );
      })}
    </div>
  );
}
