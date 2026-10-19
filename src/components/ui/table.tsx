"use client";

import { cn } from "@/lib/utils";
import { ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";

/* ===== Table ===== */

interface TableProps {
  children: React.ReactNode;
  className?: string;
  layout?: "auto" | "fixed";
}

export function Table({ children, className, layout }: TableProps) {
  return (
    <div className={cn("w-full overflow-x-auto bg-white", className)}>
      <table
        className={cn("w-full text-sm", layout === "fixed" && "table-fixed")}
      >
        {children}
      </table>
    </div>
  );
}

/* ===== Table Head ===== */

export function TableHead({ children, className }: TableProps) {
  return (
    <thead
      className={cn("border-b border-neutral-200 bg-neutral-50", className)}
    >
      {children}
    </thead>
  );
}

/* ===== Table Body ===== */

export function TableBody({ children, className }: TableProps) {
  return (
    <tbody className={cn("divide-y divide-neutral-200", className)}>
      {children}
    </tbody>
  );
}

/* ===== Table Row ===== */

interface TableRowProps {
  children?: React.ReactNode;
  className?: string;
  zebra?: boolean;
  noHover?: boolean;
}

export function TableRow({
  children,
  className,
  zebra = false,
  noHover = false,
}: TableRowProps) {
  return (
    <tr
      className={cn(
        "transition-colors",
        !noHover && (zebra ? "hover:bg-neutral-100" : "hover:bg-neutral-50"),
        zebra && "bg-neutral-50",
        className,
      )}
    >
      {children}
    </tr>
  );
}

/* ===== Table Header Cell ===== */

interface TableHeadCellProps {
  children?: React.ReactNode;
  className?: string;
  align?: "left" | "center" | "right";
  colSpan?: number;
}

export function TableHeadCell({
  children,
  className,
  align = "left",
  colSpan,
}: TableHeadCellProps) {
  return (
    <th
      colSpan={colSpan}
      className={cn(
        "px-4 py-3 text-xs font-semibold text-neutral-900 uppercase tracking-wider",
        align === "left" && "text-left",
        align === "center" && "text-center",
        align === "right" && "text-right",
        className,
      )}
    >
      {children}
    </th>
  );
}

/* ===== Table Cell ===== */

interface TableCellProps {
  children?: React.ReactNode;
  className?: string;
  align?: "left" | "center" | "right";
  colSpan?: number;
  title?: string;
}

export function TableCell({
  children,
  className,
  align = "left",
  colSpan,
  title,
}: TableCellProps) {
  return (
    <td
      colSpan={colSpan}
      title={title}
      className={cn(
        "px-4 py-4 text-sm text-neutral-900",
        align === "left" && "text-left",
        align === "center" && "text-center",
        align === "right" && "text-right",
        className,
      )}
    >
      {children}
    </td>
  );
}

/* ===== Pagination ===== */

interface PaginationProps {
  page: number;
  lastPage: number;
  total: number;
  perPage: number;
  onPageChange?: (page: number) => void;
  onPerPageChange?: (perPage: number) => void;
  perPageOptions?: number[];
  className?: string;
  /** Teks di depan pemilih jumlah item (default "Item per halaman"). */
  label?: string;
}

export function Pagination({
  page,
  lastPage,
  total,
  perPage,
  onPageChange,
  onPerPageChange,
  perPageOptions = [5, 10, 25, 50],
  className,
  label = "Item per halaman",
}: PaginationProps) {
  // Generate page numbers to display
  const getPageNumbers = (): (number | "...")[] => {
    const pages: (number | "...")[] = [];

    if (lastPage <= 5) {
      for (let i = 1; i <= lastPage; i++) pages.push(i);
    } else {
      if (page <= 3) {
        pages.push(1, 2, 3, "...", lastPage);
      } else if (page >= lastPage - 2) {
        pages.push(1, "...", lastPage - 2, lastPage - 1, lastPage);
      } else {
        pages.push(1, "...", page - 1, page, page + 1, "...", lastPage);
      }
    }

    return pages;
  };

  const pageNumbers = getPageNumbers();

  return (
    <div
      className={cn("flex items-center justify-between px-4 py-5", className)}
    >
      {/* Left: Items per page */}
      <div className="flex items-center gap-2 text-sm text-neutral-900">
        <span>{label}</span>
        <div className="relative">
          <select
            value={perPage}
            onChange={(e) => onPerPageChange?.(Number(e.target.value))}
            className="appearance-none bg-transparent border-b border-dark-200 pb-1 pr-7 pl-2 py-1 text-sm text-neutral-900 focus:outline-none cursor-pointer"
          >
            {perPageOptions.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-1 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-neutral-900 pointer-events-none" />
        </div>
        <span>dari {total}</span>
      </div>

      {/* Right: Page navigation */}
      <div className="flex items-center gap-2">
        {/* Previous arrow */}
        <button
          type="button"
          onClick={() => onPageChange?.(page - 1)}
          disabled={page <= 1}
          className="flex items-center justify-center h-8 w-8 text-neutral-900 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition-colors"
          aria-label="Previous page"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>

        {/* Page numbers */}
        {pageNumbers.map((p, i) =>
          p === "..." ? (
            <span
              key={`ellipsis-${i}`}
              className="px-1 text-sm text-neutral-400"
            >
              ...
            </span>
          ) : (
            <button
              key={p}
              type="button"
              onClick={() => onPageChange?.(p)}
              className={cn(
                "min-w-8 h-8 flex items-center justify-center rounded-lg text-sm font-medium transition-colors px-2 cursor-pointer",
                p === page ? "bg-brand-100 text-white" : "text-neutral-500",
              )}
            >
              {p}
            </button>
          ),
        )}

        {/* Next arrow */}
        <button
          type="button"
          onClick={() => onPageChange?.(page + 1)}
          disabled={page >= lastPage}
          className="flex items-center justify-center h-8 w-8 text-neutral-900 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition-colors"
          aria-label="Next page"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
