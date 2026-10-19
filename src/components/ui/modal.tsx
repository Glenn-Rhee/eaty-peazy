"use client";

import { useEffect, useId, useState } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

// Custom Info Icon component matching the design reference
const InfoIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="12" r="10" />
    <line x1="12" y1="16" x2="12" y2="12" />
    <line x1="12" y1="8" x2="12.01" y2="8" />
  </svg>
);

type ModalSize = "sm" | "md" | "lg" | "xl" | "2xl";
type ModalVariant = "default" | "danger" | "success" | "warning" | "info";
type ModalHeaderStyle = "white" | "colored";
type ModalLayout = "standard" | "centered";

const SIZES: Record<ModalSize, string> = {
  sm: "max-w-sm",
  md: "max-w-md",
  lg: "max-w-lg",
  xl: "max-w-2xl",
  "2xl": "max-w-4xl",
};

const VARIANT_COLORS: Record<
  ModalVariant,
  { header?: string; button?: string; iconBg?: string }
> = {
  default: {},
  danger: {
    header: "bg-error-600",
    button: "bg-error-600",
    iconBg: "bg-error-600",
  },
  success: {
    header: "bg-success-600",
    button: "bg-success-600",
    iconBg: "bg-success-600",
  },
  warning: {
    header: "bg-warning-500",
    button: "bg-warning-500",
    iconBg: "bg-warning-500",
  },
  info: {
    header: "bg-brand-150",
    button: "bg-brand-150",
    iconBg: "bg-brand-150",
  },
};

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: string | React.ReactNode;
  description?: string;
  children?: React.ReactNode;
  footer?: React.ReactNode;
  size?: ModalSize;
  className?: string;
  zIndexClass?: string;
  variant?: ModalVariant;
  headerStyle?: ModalHeaderStyle;
  layout?: ModalLayout;
  showCheckbox?: boolean;
  checkboxLabel?: string;
  icon?: React.ReactNode | false;
  iconCentered?: boolean;
  closeButtonClassName?: string;
}

export function Modal({
  open,
  onClose,
  title,
  description,
  children,
  footer,
  size = "md",
  className,
  zIndexClass = "z-50",
  variant = "default",
  headerStyle = "white",
  layout = "standard",
  showCheckbox = false,
  checkboxLabel = "Don't show again",
  icon,
  iconCentered = false,
  closeButtonClassName,
}: ModalProps) {
  const [checked, setChecked] = useState(false);
  const checkboxId = useId();

  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", handler);
    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", handler);
    };
  }, [open, onClose]);

  if (!open) return null;

  const isColoredHeader = headerStyle === "colored" || variant !== "default";
  const headerBg = isColoredHeader
    ? VARIANT_COLORS[variant].header || "bg-brand-150"
    : "bg-white";
  const headerText = isColoredHeader ? "text-white" : "text-neutral-800";
  // Icon circle: green for white header, white for colored header
  const iconBg = "bg-brand-150";
  const iconColor = "text-white";

  // Centered layout (untuk info-only / single button modal)
  if (layout === "centered") {
    return (
      <div
        className={cn(
          "fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4",
          zIndexClass,
        )}
        onClick={onClose}
        role="dialog"
        aria-modal="true"
        aria-label={typeof title === "string" ? title : undefined}
      >
        <div
          className={cn(
            "w-full bg-white rounded-2xl shadow-2xl border-2 border-neutral-600",
            SIZES[size],
            className,
          )}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Centered icon */}
          <div className="flex justify-center pt-8 pb-4">
            <div
              className={cn(
                "flex h-10 w-10 items-center justify-center rounded-full",
                iconBg,
              )}
            >
              {iconCentered ? (
                icon || <InfoIcon className={cn("h-5 w-5", iconColor)} />
              ) : (
                <InfoIcon className="h-5 w-5 text-white" />
              )}
            </div>
          </div>

          {/* Title & Description - centered */}
          <div className="px-8 pb-6 text-center">
            {title && (
              <h3 className="text-2xl font-bold text-neutral-800">{title}</h3>
            )}
            {description && (
              <p className="mt-2 text-sm text-neutral-500">{description}</p>
            )}
          </div>

          {/* Footer - single or dual button */}
          <div className={cn("px-8 pb-8", footer ? "flex flex-col gap-3" : "")}>
            {footer ? (
              <div className="flex flex-col gap-3">{footer}</div>
            ) : (
              <button
                type="button"
                className={cn(
                  "w-full rounded-xl py-3 text-sm font-medium transition-colors",
                  VARIANT_COLORS[variant].button || "bg-brand-150",
                  "text-white hover:opacity-90",
                )}
                onClick={onClose}
              >
                Mengerti
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Standard layout
  return (
    <div
      className={cn(
        "fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4",
        zIndexClass,
      )}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={typeof title === "string" ? title : undefined}
    >
      <div
        className={cn(
          "w-full bg-white rounded-2xl border border-neutral-600",
          SIZES[size],
          className,
        )}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          className={cn(
            "flex items-center justify-between px-6 py-4 rounded-t-2xl",
            headerBg,
          )}
        >
          <div className="flex items-center gap-2">
            {/* Icon */}
            {icon === undefined && (
              <div
                className={cn(
                  "flex h-6 w-6 items-center justify-center rounded-full",
                  iconBg,
                )}
              >
                <InfoIcon className={cn("h-4 w-4", iconColor)} />
              </div>
            )}
            {icon && typeof icon !== "boolean" && (
              <span className="shrink-0">{icon}</span>
            )}
            {title && (
              <h3 className={cn("text-lg font-bold", headerText)}>{title}</h3>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            className={cn(
              "rounded-md p-1.5 transition-colors cursor-pointer",
              closeButtonClassName ||
                (isColoredHeader
                  ? "text-white/80"
                  : "text-neutral-400 hover:bg-neutral-100 hover:text-neutral-600"),
            )}
            aria-label="Close modal"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Body */}
        <div className={cn("px-6 py-4", isColoredHeader ? "pb-2" : "")}>
          {description && (
            <p className={cn("text-base", "text-neutral-600")}>{description}</p>
          )}

          {/* Checkbox */}
          {showCheckbox && (
            <div className="mt-4 flex items-center gap-2">
              <input
                type="checkbox"
                id={checkboxId}
                checked={checked}
                onChange={(e) => setChecked(e.target.checked)}
                className="h-4 w-4 rounded border-neutral-300 text-brand-150 focus:ring-brand-150"
              />
              <label
                htmlFor={checkboxId}
                className={cn("text-sm", "text-neutral-700")}
              >
                {checkboxLabel}
              </label>
            </div>
          )}

          {children && <div className="mt-4">{children}</div>}
        </div>

        {/* Footer */}
        {footer && (
          <div
            className={cn(
              "flex flex-col gap-3 px-6 py-4",
              isColoredHeader ? "pt-2" : "",
            )}
          >
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}
