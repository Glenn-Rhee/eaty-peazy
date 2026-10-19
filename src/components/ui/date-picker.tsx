"use client";

import { useState, useMemo } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

/* ===== Types ===== */

interface DatePickerProps {
  mode?: "single" | "range";
  size?: "sm" | "md";
  value?: Date | null;
  startDate?: Date | null;
  endDate?: Date | null;
  /** Latest selectable day (inclusive). Days after it are disabled. */
  maxDate?: Date | null;
  onChange?: (date: Date) => void;
  onRangeChange?: (start: Date | null, end: Date | null) => void;
  onConfirm?: () => void;
  onCancel?: () => void;
  className?: string;
  label?: string;
}

/* ===== Helpers ===== */

const DAYS = ["S", "M", "T", "W", "T", "F", "S"];
const MONTHS_ID = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "Mei",
  "Jun",
  "Jul",
  "Agu",
  "Sep",
  "Okt",
  "Nov",
  "Des",
];
const DAYS_ID_SHORT = ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"];

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfMonth(year: number, month: number) {
  return new Date(year, month, 1).getDay();
}

function isSameDay(a: Date | null | undefined, b: Date | null | undefined) {
  if (!a || !b) return false;
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function isInRange(date: Date, start: Date | null, end: Date | null) {
  if (!start || !end) return false;
  const time = date.getTime();
  const s = start.getTime();
  const e = end.getTime();
  return time > Math.min(s, e) && time < Math.max(s, e);
}

/** True when the day is strictly after the maxDate day (time-of-day ignored) */
function isAfterMaxDate(date: Date, maxDate: Date | null | undefined) {
  if (!maxDate) return false;
  const endOfMaxDay = new Date(
    maxDate.getFullYear(),
    maxDate.getMonth(),
    maxDate.getDate(),
    23,
    59,
    59,
    999,
  );
  return date.getTime() > endOfMaxDay.getTime();
}

function formatHeaderDate(
  date: Date | null,
  mode: "single" | "range",
  endDate?: Date | null,
) {
  if (!date) return "Pilih tanggal";
  const dayName = DAYS_ID_SHORT[date.getDay()];
  const day = date.getDate();
  const month = MONTHS_ID[date.getMonth()];

  if (mode === "single" || !endDate) {
    return `${dayName}, ${day} ${month}`;
  }

  const endDayName = DAYS_ID_SHORT[endDate.getDay()];
  const endDay = endDate.getDate();
  const endMonth = MONTHS_ID[endDate.getMonth()];
  return `${dayName}, ${day} ${month} – ${endDayName}, ${endDay} ${endMonth}`;
}

/* ===== Component ===== */

export function DatePicker({
  mode = "single",
  size = "md",
  value = null,
  startDate = null,
  endDate = null,
  maxDate = null,
  onChange,
  onRangeChange,
  onConfirm,
  onCancel,
  className,
  label = "Pilih Tanggal",
}: DatePickerProps) {
  const initialDate = value || startDate || new Date();
  const [viewYear, setViewYear] = useState(initialDate.getFullYear());
  const [viewMonth, setViewMonth] = useState(initialDate.getMonth());

  // For range selection internal state
  const [rangeStart, setRangeStart] = useState<Date | null>(startDate);
  const [rangeEnd, setRangeEnd] = useState<Date | null>(endDate);
  const [selectedDate, setSelectedDate] = useState<Date | null>(value);

  const daysInMonth = useMemo(
    () => getDaysInMonth(viewYear, viewMonth),
    [viewYear, viewMonth],
  );
  const firstDay = useMemo(
    () => getFirstDayOfMonth(viewYear, viewMonth),
    [viewYear, viewMonth],
  );

  // Previous month days to fill the first row
  const prevMonthDays = useMemo(() => {
    const prevDays = getDaysInMonth(viewYear, viewMonth - 1);
    const days: number[] = [];
    for (let i = firstDay - 1; i >= 0; i--) {
      days.push(prevDays - i);
    }
    return days;
  }, [viewYear, viewMonth, firstDay]);

  // Next month days to fill the last row
  const nextMonthDays = useMemo(() => {
    const totalCells = prevMonthDays.length + daysInMonth;
    const remaining = totalCells % 7 === 0 ? 0 : 7 - (totalCells % 7);
    const days: number[] = [];
    for (let i = 1; i <= remaining; i++) {
      days.push(i);
    }
    return days;
  }, [prevMonthDays, daysInMonth]);

  const handlePrevMonth = () => {
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear(viewYear - 1);
    } else {
      setViewMonth(viewMonth - 1);
    }
  };

  /** Navigation is capped at the month of maxDate */
  const isNextMonthDisabled =
    !!maxDate &&
    (viewYear > maxDate.getFullYear() ||
      (viewYear === maxDate.getFullYear() && viewMonth >= maxDate.getMonth()));

  const handleNextMonth = () => {
    if (isNextMonthDisabled) return;
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear(viewYear + 1);
    } else {
      setViewMonth(viewMonth + 1);
    }
  };

  const handleDayClick = (day: number) => {
    const clickedDate = new Date(viewYear, viewMonth, day);
    if (isAfterMaxDate(clickedDate, maxDate)) return;

    if (mode === "single") {
      // Only highlight; panel stays open until OK is pressed (commit on OK)
      setSelectedDate(clickedDate);
    } else {
      // Range mode
      if (!rangeStart || (rangeStart && rangeEnd)) {
        // Start new range
        setRangeStart(clickedDate);
        setRangeEnd(null);
        onRangeChange?.(clickedDate, null);
      } else {
        // Complete range
        const newEnd = clickedDate;
        if (clickedDate.getTime() < rangeStart.getTime()) {
          setRangeStart(clickedDate);
          setRangeEnd(rangeStart);
          onRangeChange?.(clickedDate, rangeStart);
        } else {
          setRangeEnd(newEnd);
          onRangeChange?.(rangeStart, newEnd);
        }
      }
    }
  };

  const displayDate = mode === "single" ? selectedDate : rangeStart;
  const displayEndDate = mode === "range" ? rangeEnd : null;

  /** OK is blocked while the selection itself is out of range (e.g. legacy value) */
  const isConfirmDisabled =
    mode === "single" &&
    !!selectedDate &&
    isAfterMaxDate(selectedDate, maxDate);

  const isSmall = size === "sm";

  return (
    <div
      className={cn(
        "rounded-2xl bg-white shadow-lg border border-neutral-200",
        isSmall ? "w-[280px]" : "w-[328px]",
        className,
      )}
    >
      {/* Header */}
      <div className={cn("px-6 pt-5 pb-4", isSmall && "px-4 pt-3 pb-2")}>
        <p className={cn("text-sm text-neutral-500", isSmall && "text-xs")}>
          {label}
        </p>
        <p
          className={cn(
            "text-xl font-semibold text-neutral-900 mt-1",
            isSmall && "text-base mt-0.5",
          )}
        >
          {formatHeaderDate(displayDate, mode, displayEndDate)}
        </p>
      </div>

      {/* Month Navigation */}
      <div
        className={cn(
          "flex items-center justify-between px-6 pb-3",
          isSmall && "px-4 pb-2",
        )}
      >
        <button
          type="button"
          onClick={handlePrevMonth}
          className="p-1 rounded-full hover:bg-neutral-100 transition-colors"
          aria-label="Previous month"
        >
          <ChevronLeft
            className={cn("h-5 w-5 text-neutral-600", isSmall && "h-4 w-4")}
          />
        </button>
        <span
          className={cn(
            "text-sm font-medium text-neutral-900",
            isSmall && "text-xs",
          )}
        >
          {MONTHS_ID[viewMonth]} {viewYear}
        </span>
        <button
          type="button"
          onClick={handleNextMonth}
          disabled={isNextMonthDisabled}
          className={cn(
            "p-1 rounded-full transition-colors",
            isNextMonthDisabled
              ? "cursor-not-allowed opacity-40"
              : "hover:bg-neutral-100",
          )}
          aria-label="Next month"
        >
          <ChevronRight
            className={cn("h-5 w-5 text-neutral-600", isSmall && "h-4 w-4")}
          />
        </button>
      </div>

      {/* Calendar Grid */}
      <div className={cn("px-4 pb-2", isSmall && "px-3 pb-1")}>
        {/* Day headers */}
        <div className="grid grid-cols-7 mb-1">
          {DAYS.map((day, i) => (
            <div
              key={`header-${i}`}
              className={cn(
                "flex items-center justify-center text-xs font-medium text-neutral-500",
                isSmall ? "h-7" : "h-10",
              )}
            >
              {day}
            </div>
          ))}
        </div>

        {/* Previous month days */}
        <div className="grid grid-cols-7">
          {prevMonthDays.map((day, i) => (
            <div
              key={`prev-${i}`}
              className={cn(
                "flex items-center justify-center text-neutral-300",
                isSmall ? "h-7 text-xs" : "h-10 text-sm",
              )}
            >
              {day}
            </div>
          ))}

          {/* Current month days */}
          {Array.from({ length: daysInMonth }, (_, i) => i + 1).map((day) => {
            const date = new Date(viewYear, viewMonth, day);
            const isDisabled = isAfterMaxDate(date, maxDate);
            const isSelected =
              mode === "single"
                ? isSameDay(date, selectedDate)
                : isSameDay(date, rangeStart) || isSameDay(date, rangeEnd);
            const inRange =
              mode === "range" && isInRange(date, rangeStart, rangeEnd);
            const isRangeStart =
              mode === "range" && isSameDay(date, rangeStart);
            const isRangeEnd = mode === "range" && isSameDay(date, rangeEnd);
            const hasCompleteRange =
              mode === "range" && !!rangeStart && !!rangeEnd;
            const showBar =
              mode === "range" &&
              hasCompleteRange &&
              (inRange || isRangeStart || isRangeEnd);

            return (
              <div
                key={`day-${day}`}
                className={cn(
                  "relative flex items-center justify-center",
                  isSmall ? "h-7" : "h-10",
                )}
              >
                {showBar && (
                  <span
                    className={cn(
                      "absolute bg-brand-300",
                      isSmall ? "inset-y-0" : "inset-y-0.5",
                      isSmall
                        ? isRangeStart && isRangeEnd
                          ? "left-[calc(50%-14px)] right-[calc(50%-14px)]"
                          : isRangeStart
                            ? "left-[calc(50%-14px)] right-0"
                            : isRangeEnd
                              ? "left-0 right-[calc(50%-14px)]"
                              : "left-0 right-0"
                        : isRangeStart && isRangeEnd
                          ? "left-[calc(50%-18px)] right-[calc(50%-18px)]"
                          : isRangeStart
                            ? "left-[calc(50%-18px)] right-0"
                            : isRangeEnd
                              ? "left-0 right-[calc(50%-18px)]"
                              : "left-0 right-0",
                      isRangeStart && isRangeEnd && "rounded-full",
                      isRangeStart && !isRangeEnd && "rounded-l-full",
                      isRangeEnd && !isRangeStart && "rounded-r-full",
                    )}
                  />
                )}
                <button
                  type="button"
                  onClick={() => handleDayClick(day)}
                  disabled={isDisabled}
                  className={cn(
                    "relative rounded-full transition-colors",
                    isSmall ? "h-7 w-7 text-xs" : "h-9 w-9 text-sm",
                    isDisabled
                      ? "cursor-not-allowed text-neutral-300"
                      : isSelected
                        ? "bg-brand-100 text-white hover:bg-brand-200 font-medium z-10"
                        : "text-neutral-900 hover:bg-brand-100 hover:text-white",
                  )}
                >
                  {day}
                </button>
              </div>
            );
          })}

          {/* Next month days */}
          {nextMonthDays.map((day, i) => (
            <div
              key={`next-${i}`}
              className={cn(
                "flex items-center justify-center text-neutral-300",
                isSmall ? "h-7 text-xs" : "h-10 text-sm",
              )}
            >
              {day}
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div
        className={cn(
          "flex items-center justify-end gap-6 px-6 py-3 border-t border-neutral-300",
          isSmall && "px-4 py-2 gap-4",
        )}
      >
        <button
          type="button"
          onClick={onCancel}
          className={cn(
            "font-medium text-neutral-500 hover:text-neutral-900 transition-colors cursor-pointer",
            isSmall ? "text-xs" : "text-sm",
          )}
        >
          Batal
        </button>
        <button
          type="button"
          onClick={() => {
            if (mode === "single" && selectedDate) {
              onChange?.(selectedDate);
            }
            onConfirm?.();
          }}
          disabled={isConfirmDisabled}
          className={cn(
            "font-medium transition-colors",
            isConfirmDisabled
              ? "cursor-not-allowed text-neutral-300"
              : "cursor-pointer text-neutral-900 hover:text-black",
            isSmall ? "text-xs" : "text-sm",
          )}
        >
          OK
        </button>
      </div>
    </div>
  );
}
