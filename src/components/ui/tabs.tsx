"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

/* ===== Types ===== */

export interface TabItem {
  label: ReactNode;
  content?: ReactNode;
  disabled?: boolean;
  icon?: ReactNode;
}

export interface TabsProps {
  tabs: TabItem[];
  defaultValue?: number;
  size?: "sm" | "md";
  className?: string;
  /** Perataan deretan tab. */
  align?: "start" | "center" | "stretch";
  /** Kelas untuk wrapper konten tab. */
  contentClassName?: string;
}

/* ===== Component (Carbon Design System - Line Tabs) ===== */

export function Tabs({
  tabs,
  defaultValue = 0,
  size = "md",
  className,
  align = "start",
  contentClassName,
}: TabsProps) {
  const [activeIndex, setActiveIndex] = useState(defaultValue);

  return (
    <div className={cn("w-full", className)}>
      <div
        role="tablist"
        aria-orientation="horizontal"
        className={cn(
          "flex items-center overflow-x-auto border-b border-neutral-200 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
          align === "center" && "justify-center",
          align === "stretch" && "w-full",
        )}
      >
        {tabs.map((tab, index) => {
          const isActive = index === activeIndex && !tab.disabled;

          return (
            <button
              key={`${tab.label}-${index}`}
              type="button"
              role="tab"
              aria-selected={isActive}
              disabled={tab.disabled}
              onClick={() => {
                if (!tab.disabled) setActiveIndex(index);
              }}
              className={cn(
                "relative -mb-px inline-flex items-center justify-center gap-2 whitespace-nowrap border-b-2 px-4 transition-colors select-none",
                "focus:outline-none focus-visible:outline-none focus:ring-0",
                align === "stretch" && "flex-1",
                size === "sm" ? "h-8 text-xs" : "h-10 text-sm",
                tab.disabled
                  ? "border-neutral-200 text-neutral-300 cursor-not-allowed font-normal"
                  : isActive
                    ? "border-brand-100 text-brand-100 font-semibold cursor-pointer"
                    : "border-transparent text-neutral-600 font-normal hover:border-neutral-400 hover:text-neutral-900 cursor-pointer",
              )}
            >
              <span>{tab.label}</span>
              {tab.icon && <span className="shrink-0">{tab.icon}</span>}
            </button>
          );
        })}
      </div>

      {tabs[activeIndex]?.content && (
        <div role="tabpanel" className={cn("pt-4", contentClassName)}>
          {tabs[activeIndex].content}
        </div>
      )}
    </div>
  );
}
