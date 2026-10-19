import { forwardRef, useState } from "react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

/* ===== Types ===== */

interface InputProps extends Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "prefix"
> {
  label?: React.ReactNode;
  rightLabel?: React.ReactNode;
  error?: string;
  hint?: string;
  prefix?: React.ReactNode;
  endElement?: React.ReactNode;
  unit?: React.ReactNode;
  status?: "default" | "error" | "success";
  statusText?: React.ReactNode;
}

function WarningTriangleIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="none"
      className={cn("h-3.5 w-3.5 shrink-0", className)}
    >
      <path
        d="M7.134 2.5a1 1 0 0 1 1.732 0l5.196 9A1 1 0 0 1 13.196 13H2.804a1 1 0 0 1-.866-1.5l5.196-9Z"
        fill="currentColor"
      />
      <path d="M8 6v3" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="8" cy="11" r="0.8" fill="white" />
    </svg>
  );
}

/* ===== Component ===== */

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      rightLabel,
      error,
      hint,
      className,
      id,
      disabled,
      prefix,
      endElement,
      unit,
      status,
      statusText,
      ...props
    },
    ref,
  ) => {
    const isUnitInput = unit !== undefined;
    const isStatusError = status === "error";
    const isStatusSuccess = status === "success";

    const inputElement = (
      <input
        ref={ref}
        id={id}
        disabled={disabled}
        className={cn(
          "w-full border border-neutral-300 px-4 py-3 text-sm text-neutral-900 placeholder:text-neutral-400 transition-colors [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none",
          isUnitInput
            ? "rounded-l-xl rounded-r-none border-neutral-200"
            : "rounded-md",
          "focus:outline-none focus:ring-1 focus:ring-brand-200 focus:border-brand-200",
          disabled && "bg-neutral-50 text-neutral-400 cursor-not-allowed",
          className,
          endElement && "pr-10",
          prefix && "min-w-0 flex-1 rounded-l-none border-l-0",
          error &&
            "border-error-500 focus:ring-error-500 focus:border-error-500",
          isStatusError &&
            "border-error-700 bg-error-50 focus:ring-error-700 focus:border-error-700",
          isStatusSuccess &&
            "border-brand-150 bg-white focus:ring-brand-150 focus:border-brand-150",
        )}
        {...props}
      />
    );

    let control: React.ReactNode = inputElement;

    if (isUnitInput) {
      control = (
        <div className="flex w-full items-stretch">
          <div className="min-w-0 flex-1">{inputElement}</div>
          <span className="flex shrink-0 items-center justify-center rounded-r-xl border border-l-0 border-neutral-200 bg-neutral-100 px-4 text-xs text-neutral-500 select-none">
            {unit}
          </span>
        </div>
      );
    } else if (prefix && endElement) {
      control = (
        <div className="flex w-full">
          <span className="flex shrink-0 items-center">{prefix}</span>
          <div className="relative min-w-0 flex-1">
            {inputElement}
            <span className="absolute right-3 top-1/2 -translate-y-2">
              {endElement}
            </span>
          </div>
        </div>
      );
    } else if (prefix) {
      control = (
        <div className="flex w-full">
          <span className="flex shrink-0 items-center">{prefix}</span>
          {inputElement}
        </div>
      );
    } else if (endElement) {
      control = (
        <div className="relative w-full">
          {inputElement}
          <span className="absolute right-3 top-1/2 -translate-y-2">
            {endElement}
          </span>
        </div>
      );
    }

    return (
      <div className="space-y-1.5">
        {(label || rightLabel) && (
          <div className="flex items-center justify-between gap-2">
            {label && (
              <label
                htmlFor={id}
                className={cn(
                  "block text-sm font-medium",
                  isUnitInput && "text-xs font-semibold text-neutral-800",
                  disabled
                    ? "text-neutral-400"
                    : !isUnitInput && "text-neutral-900",
                )}
              >
                {label}
              </label>
            )}
            {rightLabel && (
              <span className="text-xs font-normal text-neutral-500">
                {rightLabel}
              </span>
            )}
          </div>
        )}
        {control}
        {statusText !== undefined ? (
          isStatusError ? (
            <div className="flex items-center gap-1.5 mt-1 text-xs text-error-700">
              <WarningTriangleIcon />
              <span>{statusText}</span>
            </div>
          ) : isStatusSuccess ? (
            <div className="flex items-center gap-1.5 mt-1 text-xs text-success-700">
              <Check className="h-3.5 w-3.5 shrink-0 stroke-[2.2]" />
              <span>{statusText}</span>
            </div>
          ) : (
            <p className="text-xs text-neutral-400 mt-1">{statusText}</p>
          )
        ) : (
          <>
            {error && <p className="text-xs text-error-600 mt-1">{error}</p>}
            {hint && !error && (
              <p className="text-xs text-neutral-500 mt-1">{hint}</p>
            )}
          </>
        )}
      </div>
    );
  },
);

Input.displayName = "Input";

/* ===== Textarea ===== */

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: React.ReactNode;
  error?: string;
  hint?: string;
  maxLength?: number;
  showCount?: boolean;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      label,
      error,
      hint,
      className,
      id,
      disabled,
      maxLength,
      showCount = false,
      value,
      defaultValue,
      onChange,
      ...props
    },
    ref,
  ) => {
    const [internalCount, setInternalCount] = useState(() => {
      const initial = (value as string) || (defaultValue as string) || "";
      return initial.length;
    });
    const charCount =
      value !== undefined ? (value as string).length : internalCount;

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setInternalCount(e.target.value.length);
      onChange?.(e);
    };

    return (
      <div className="space-y-1.5">
        {label && (
          <label
            htmlFor={id}
            className={cn(
              "block text-sm font-medium",
              disabled ? "text-neutral-400" : "text-neutral-900",
            )}
          >
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          id={id}
          disabled={disabled}
          maxLength={maxLength}
          value={value}
          defaultValue={defaultValue}
          onChange={handleChange}
          className={cn(
            "w-full rounded-md border px-4 py-3 text-sm text-neutral-900 placeholder:text-neutral-400 transition-colors resize-none min-h-[80px]",
            "focus:outline-none focus:ring-1 focus:ring-brand-200 focus:border-brand-200",
            error
              ? "border-error-500 focus:ring-error-500 focus:border-error-500"
              : "border-neutral-300",
            disabled && "bg-neutral-50 text-neutral-400 cursor-not-allowed",
            className,
          )}
          {...props}
        />
        <div className="flex items-center justify-between mt-1">
          <div>
            {error && <p className="text-xs text-error-600">{error}</p>}
            {hint && !error && (
              <p className="text-xs text-neutral-500">{hint}</p>
            )}
          </div>
          {(showCount || maxLength) && (
            <p className="text-xs text-neutral-400">
              {charCount}
              {maxLength ? `/${maxLength}` : ""}
            </p>
          )}
        </div>
      </div>
    );
  },
);

Textarea.displayName = "Textarea";
