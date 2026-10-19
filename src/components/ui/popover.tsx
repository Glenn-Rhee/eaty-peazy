"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

const GAP = 8;
const VIEWPORT_MARGIN = 8;

interface PopoverProps {
  open: boolean;
  onClose: () => void;
  /** Ref of the trigger element the panel anchors to */
  triggerRef: React.RefObject<HTMLElement | null>;
  children: React.ReactNode;
  className?: string;
  /**
   * Horizontal alignment relative to the trigger.
   * "start" (default): panel's left edge aligns with trigger's left edge, expands to the right.
   * "end": panel's right edge aligns with trigger's right edge, expands to the left.
   */
  align?: "start" | "end";
}

/**
 * Fixed-position popover panel anchored to a trigger element.
 * Flips above the trigger when there is not enough space below and
 * clamps itself inside the viewport so it is never clipped.
 */
export function Popover({
  open,
  onClose,
  triggerRef,
  children,
  className,
  align = "start",
}: PopoverProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState<{
    top: number;
    left: number;
  } | null>(null);

  const updatePosition = () => {
    const trigger = triggerRef.current;
    const panel = panelRef.current;
    if (!trigger || !panel) return;

    const rect = trigger.getBoundingClientRect();
    const panelWidth = panel.offsetWidth;
    const panelHeight = panel.offsetHeight;
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    const rawLeft = align === "end" ? rect.right - panelWidth : rect.left;

    const left = Math.min(
      Math.max(rawLeft, VIEWPORT_MARGIN),
      viewportWidth - panelWidth - VIEWPORT_MARGIN,
    );

    const spaceBelow = viewportHeight - rect.bottom;
    let top: number;
    if (spaceBelow >= panelHeight + GAP + VIEWPORT_MARGIN) {
      top = rect.bottom + GAP;
    } else {
      top = rect.top - panelHeight - GAP;
    }
    top = Math.max(
      VIEWPORT_MARGIN,
      Math.min(top, viewportHeight - VIEWPORT_MARGIN),
    );

    setPosition({ top, left });
  };

  // Measure panel before revealing to avoid flicker at unpositioned spot
  useIsomorphicLayoutEffect(() => {
    if (!open) {
      setPosition(null);
      return;
    }
    updatePosition();
  }, [open, align]);

  useEffect(() => {
    if (!open) return;
    const handleReposition = () => updatePosition();
    window.addEventListener("resize", handleReposition);
    window.addEventListener("scroll", handleReposition, true);
    return () => {
      window.removeEventListener("resize", handleReposition);
      window.removeEventListener("scroll", handleReposition, true);
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const handler = (event: MouseEvent) => {
      const target = event.target as Node;
      if (
        triggerRef.current?.contains(target) ||
        panelRef.current?.contains(target)
      )
        return;
      onClose();
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      ref={panelRef}
      // Always out-of-flow so the trigger rect is never measured with the panel inside it
      style={{
        position: "fixed",
        top: position ? position.top : -9999,
        left: position ? position.left : -9999,
      }}
      className={cn(
        "z-30 max-h-[calc(100vh-16px)] overflow-y-auto",
        !position && "invisible",
        className,
      )}
    >
      {children}
    </div>
  );
}
