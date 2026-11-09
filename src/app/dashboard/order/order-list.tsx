"use client";

import Link from "next/link";
import { useMemo, useRef, useState, useTransition } from "react";
import {
  CalendarDays,
  Check,
  ChevronLeft,
  PackageCheck,
  SlidersHorizontal,
  X,
} from "lucide-react";
import { Modal } from "@/components/ui/modal";
import { cn } from "@/lib/utils";
import { DatePicker } from "@/components/ui/date-picker";
import { Popover } from "@/components/ui/popover";
import {
  formatDate,
  formatRupiah,
  orderStatusLabel,
  type Order,
  type OrderStatus,
} from "@/components/lib/mock-data";
import { updateOrderStatus } from "./actions";

type TabKey = "all" | "active" | "done";

type DateFilter =
  | { kind: "week" }
  | { kind: "month" }
  | { kind: "quarter" }
  | { kind: "day"; date: string };

const tabs: { key: TabKey; label: string }[] = [
  { key: "all", label: "Semua" },
  { key: "active", label: "Diproses" },
  { key: "done", label: "Selesai" },
];

const presets: { kind: "week" | "month" | "quarter"; label: string }[] = [
  { kind: "week", label: "Seminggu Ini" },
  { kind: "month", label: "1 Bulan Lalu" },
  { kind: "quarter", label: "3 Bulan Lalu" },
];

const pillClass: Record<OrderStatus, string> = {
  pending: "bg-[#044091] text-[#ff9100]",
  process: "bg-[#044091] text-[#ff9100]",
  completed: "bg-[#ff9100] text-[#044091]",
  canceled: "bg-neutral-200 text-neutral-600",
};

const INK = "text-[#391e10]";

function parseOrderDate(value: string) {
  const [year, month, day] = value.split("-").map(Number);
  return new Date(year, month - 1, day);
}

function isSameDay(a: Date, b: Date) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function matchesFilter(order: Order, filter: DateFilter | null) {
  if (!filter) return true;

  const date = parseOrderDate(order.requestedDate);

  if (filter.kind === "day") {
    return isSameDay(date, parseOrderDate(filter.date));
  }

  const end = new Date();
  end.setHours(23, 59, 59, 999);

  const start = new Date(end);
  if (filter.kind === "week") start.setDate(start.getDate() - 7);
  if (filter.kind === "month") start.setMonth(start.getMonth() - 1);
  if (filter.kind === "quarter") start.setMonth(start.getMonth() - 3);

  return date >= start && date <= end;
}

function FilterPanel({
  initial,
  onApply,
}: {
  initial: DateFilter | null;
  onApply: (filter: DateFilter | null) => void;
}) {
  const [preset, setPreset] = useState<
    "week" | "month" | "quarter" | null
  >(initial && initial.kind !== "day" ? initial.kind : null);
  const [custom, setCustom] = useState(
    initial?.kind === "day" ? parseOrderDate(initial.date) : null,
  );
  const [showCalendar, setShowCalendar] = useState(initial?.kind === "day");

  const canApply = !showCalendar || !!custom || !!preset;

  function apply() {
    if (showCalendar && custom) {
      const iso = `${custom.getFullYear()}-${String(custom.getMonth() + 1).padStart(2, "0")}-${String(custom.getDate()).padStart(2, "0")}`;
      onApply({ kind: "day", date: iso });
      return;
    }
    if (preset) {
      onApply({ kind: preset });
      return;
    }
    onApply(null);
  }

  return (
    <div className="w-[330px] rounded-xl border-2 border-[#044091] bg-white p-5 shadow-lg">
      <p className="text-base font-semibold text-[#ff9100]">Filter Aktivitas</p>
      <div className="my-3 h-0.5 bg-[#044091]" />

      <p className="text-sm font-semibold text-[#044091]">Tanggal</p>

      <div className="mt-3 flex gap-2">
        {presets.map((item) => (
          <button
            key={item.kind}
            type="button"
            onClick={() => {
              setPreset(item.kind);
              setShowCalendar(false);
            }}
            className={cn(
              "rounded-md border px-2 py-1.5 text-xs font-semibold transition-colors",
              preset === item.kind && !showCalendar
                ? "border-[#ff9100] bg-[#ff9100]/10 text-[#ff9100]"
                : "border-[#044091] text-[#ff9100] hover:bg-[#ff9100]/5",
            )}
          >
            {item.label}
          </button>
        ))}
      </div>

      <label className="mt-4 flex cursor-pointer items-center gap-2 text-xs font-medium text-[#044091]">
        <input
          type="checkbox"
          checked={showCalendar}
          onChange={(event) => {
            setShowCalendar(event.target.checked);
            if (event.target.checked) setPreset(null);
          }}
          className="h-4 w-4 accent-[#ff9100]"
        />
        Pilih Tanggal
        <CalendarDays className="h-4 w-4 text-[#044091]" />
      </label>

      {showCalendar && (
        <div className="mt-3">
          <DatePicker
            mode="single"
            size="sm"
            label="Tanggal pesanan"
            value={custom}
            onChange={(date) => setCustom(date)}
            onConfirm={() => setShowCalendar(true)}
            onCancel={() => setShowCalendar(false)}
            className="w-full shadow-none"
          />
        </div>
      )}

      <div className="mt-4 flex gap-3 border-t border-[#044091] pt-4">
        <button
          type="button"
          onClick={() => {
            setPreset(null);
            setCustom(null);
            setShowCalendar(false);
            onApply(null);
          }}
          className="flex-1 rounded-md border border-[#044091] py-2 text-sm font-semibold text-[#044091] transition-colors hover:bg-[#044091]/5"
        >
          Hapus
        </button>
        <button
          type="button"
          onClick={apply}
          disabled={!canApply}
          className="flex-1 rounded-md bg-[#044091] py-2 text-sm font-semibold text-white transition-colors hover:bg-[#033678] disabled:opacity-50"
        >
          Terapkan
        </button>
      </div>
    </div>
  );
}

function ActionButton({
  children,
  icon,
  onClick,
}: {
  children: React.ReactNode;
  icon: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex items-center gap-2 rounded-lg bg-[#044091] px-4 py-2 text-sm font-semibold text-[#fffff0] transition-colors hover:bg-[#03326f]"
    >
      {icon}
      {children}
    </button>
  );
}

export function OrderList({ orders }: { orders: Order[] }) {
  const [tab, setTab] = useState<TabKey>("all");
  const [filter, setFilter] = useState<DateFilter | null>(null);
  const [filterOpen, setFilterOpen] = useState(false);
  const [detailId, setDetailId] = useState<string | null>(null);
  const [statusOverride, setStatusOverride] = useState<
    Record<string, OrderStatus>
  >({});
  const [cancelTarget, setCancelTarget] = useState<Order | null>(null);
  const filterButtonRef = useRef<HTMLButtonElement>(null);

  const [, startTransition] = useTransition();

  function applyStatus(order: Order, status: OrderStatus) {
    setStatusOverride((prev) => ({ ...prev, [order.id]: status }));
    setCancelTarget(null);
    startTransition(() => {
      updateOrderStatus(order.id, status);
    });
  }

  const rows = useMemo(() => {
    return orders
      .map((order) => ({
        ...order,
        status: statusOverride[order.id] ?? order.status,
      }))
      .filter((order) => {
        if (!matchesFilter(order, filter)) return false;
        if (tab === "active") {
          return order.status === "pending" || order.status === "process";
        }
        if (tab === "done") return order.status === "completed";
        return true;
      });
  }, [orders, tab, filter, statusOverride]);

  const detailOrder = rows.find((order) => order.id === detailId) ?? null;
  const activeFilterLabel = filter
    ? filter.kind === "day"
      ? formatDate(filter.date)
      : presets.find((preset) => preset.kind === filter.kind)?.label
    : null;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Link
          href="/dashboard"
          className="flex h-8 w-8 items-center justify-center rounded-lg text-neutral-600 hover:bg-neutral-100"
        >
          <ChevronLeft className="h-5 w-5" />
        </Link>
        <h1 className="text-2xl font-bold text-secondary">Kelola Order PO</h1>

        <button
          ref={filterButtonRef}
          type="button"
          onClick={() => setFilterOpen((open) => !open)}
          className={cn(
            "ml-auto flex items-center gap-2 rounded-lg border border-[#044091] bg-white px-3 py-2 text-xs font-semibold text-[#044091] transition-colors",
            filterOpen && "bg-[#044091]/5",
          )}
        >
          {activeFilterLabel ?? "FILTER"}
          <SlidersHorizontal className="h-4 w-4" />
        </button>
      </div>

      <Popover
        open={filterOpen}
        onClose={() => setFilterOpen(false)}
        triggerRef={filterButtonRef}
        align="end"
      >
        <FilterPanel
          initial={filter}
          onApply={(next) => {
            setFilter(next);
            setFilterOpen(false);
          }}
        />
      </Popover>

      <div className="flex items-center gap-4 border-b border-[#391e10]/20">
        {tabs.map((item) => (
          <button
            key={item.key}
            type="button"
            onClick={() => setTab(item.key)}
            aria-pressed={tab === item.key}
            className={cn(
              "flex-1 py-2 text-center text-sm font-semibold transition-colors",
              tab === item.key
                ? "text-[#391e10]"
                : "text-[#391e10]/60 hover:text-[#391e10]",
            )}
          >
            <span
              className={cn(
                "inline-block rounded-lg px-6 py-2",
                tab === item.key && "bg-[#ff9100] text-[#fffff0]",
              )}
            >
              {item.label}
            </span>
          </button>
        ))}
      </div>

      <div className="space-y-5">
        {rows.map((order) => (
          <button
            key={order.id}
            type="button"
            onClick={() => setDetailId(order.id)}
            className="flex w-full items-center gap-3 border border-[#391e10] bg-white px-4 py-4 text-left shadow-[4px_4px_3px_rgba(0,0,0,0.25)] transition-colors hover:bg-[#391e10]/[0.03] sm:gap-5 sm:px-6 sm:py-5"
          >
            <div className="hidden h-14 w-14 shrink-0 items-center justify-center rounded-full bg-[#044091] sm:flex">
              <PackageCheck className="h-7 w-7 text-white" />
            </div>

            <div className={cn("min-w-0 flex-1", INK)}>
              <p className="truncate text-lg font-semibold">
                {order.customerName}
              </p>
              <p className="text-sm font-light">
                {order.deliveryMethod === "delivery" ? "Diantar" : "Diambil"}
              </p>
              <p className="text-lg font-semibold">
                {formatRupiah(order.totalAmount)}
              </p>
            </div>

            <div className="flex shrink-0 flex-col items-end gap-2 sm:gap-3">
              <span
                className={cn(
                  "rounded-lg px-2.5 py-1 text-xs font-semibold sm:px-3 sm:py-1.5 sm:text-sm",
                  pillClass[order.status],
                )}
              >
                {orderStatusLabel[order.status]}
              </span>
              <span className="text-[11px] font-extralight text-black sm:text-xs">
                {formatDate(order.requestedDate)}
              </span>
            </div>
          </button>
        ))}

        {rows.length === 0 && (
          <p className="border border-dashed border-[#391e10]/30 bg-white px-6 py-10 text-center text-sm text-neutral-500">
            Tidak ada pesanan pada tab ini.
          </p>
        )}
      </div>

      <Modal
        open={!!detailOrder}
        onClose={() => setDetailId(null)}
        title={detailOrder ? `Pesanan ${detailOrder.customerName}` : "Detail Pesanan"}
        size="lg"
      >
        {detailOrder && (
          <div className="space-y-5 text-sm">
            <div className="flex items-center justify-between gap-4">
              <span
                className={cn(
                  "rounded-lg px-3 py-1.5 text-sm font-semibold",
                  pillClass[detailOrder.status],
                )}
              >
                {orderStatusLabel[detailOrder.status]}
              </span>
              <span className="text-xs text-neutral-500">{detailOrder.id}</span>
            </div>

            <dl className="grid grid-cols-2 gap-x-6 gap-y-3">
              {[
                { label: "No. HP", value: detailOrder.phoneNumber },
                {
                  label: "Metode",
                  value:
                    detailOrder.deliveryMethod === "delivery"
                      ? "Diantar"
                      : "Diambil di toko",
                },
                {
                  label: "Tanggal Diminta",
                  value: formatDate(detailOrder.requestedDate),
                },
                ...(detailOrder.address
                  ? [{ label: "Alamat", value: detailOrder.address }]
                  : []),
              ].map((item) => (
                <div key={item.label}>
                  <dt className="text-xs uppercase tracking-wide text-neutral-500">
                    {item.label}
                  </dt>
                  <dd className={cn("mt-0.5 font-medium", INK)}>{item.value}</dd>
                </div>
              ))}
            </dl>

            <div className="space-y-2 border-t border-[#391e10]/10 pt-4">
              <p className="text-xs uppercase tracking-wide text-neutral-500">
                Item Pesanan
              </p>
              <ul className="space-y-1.5">
                {detailOrder.items.map((item) => (
                  <li
                    key={item.name}
                    className={cn(
                      "flex items-baseline justify-between gap-4",
                      INK,
                    )}
                  >
                    <span className="font-medium">
                      {item.quantity}× {item.name}
                    </span>
                    <span className="font-semibold">
                      {formatRupiah(item.price)}
                    </span>
                  </li>
                ))}
              </ul>
              <p
                className={cn(
                  "flex justify-between border-t border-[#391e10]/10 pt-2 font-bold",
                  INK,
                )}
              >
                <span>Total</span>
                <span>{formatRupiah(detailOrder.totalAmount)}</span>
              </p>
            </div>

            <div className="flex flex-wrap gap-3 border-t border-[#391e10]/10 pt-4">
              {detailOrder.status === "pending" && (
                <ActionButton
                  onClick={() => {
                    applyStatus(detailOrder, "process");
                    setDetailId(null);
                  }}
                  icon={<PackageCheck className="h-4 w-4" />}
                >
                  Proses Pesanan
                </ActionButton>
              )}
              {detailOrder.status === "process" && (
                <ActionButton
                  onClick={() => {
                    applyStatus(detailOrder, "completed");
                    setDetailId(null);
                  }}
                  icon={<Check className="h-4 w-4" />}
                >
                  Selesaikan
                </ActionButton>
              )}
              {(detailOrder.status === "pending" ||
                detailOrder.status === "process") && (
                <button
                  type="button"
                  onClick={() => {
                    setDetailId(null);
                    setCancelTarget(detailOrder);
                  }}
                  className="flex items-center gap-2 rounded-lg border border-[#391e10]/30 px-4 py-2 text-sm font-semibold text-[#391e10] transition-colors hover:bg-[#391e10]/5"
                >
                  <X className="h-4 w-4" />
                  Batalkan
                </button>
              )}
              {(detailOrder.status === "completed" ||
                detailOrder.status === "canceled") && (
                <p className="text-sm text-neutral-500">
                  Pesanan sudah final, tidak ada tindakan tersedia.
                </p>
              )}
            </div>
          </div>
        )}
      </Modal>

      <Modal
        open={!!cancelTarget}
        onClose={() => setCancelTarget(null)}
        title="Batalkan Pesanan"
        variant="danger"
        layout="centered"
        description={`Yakin membatalkan pesanan ${cancelTarget?.customerName}? Tindakan ini tidak bisa dibatalkan.`}
        footer={
          <>
            <button
              type="button"
              onClick={() =>
                cancelTarget && applyStatus(cancelTarget, "canceled")
              }
              className="w-full rounded-xl bg-error-600 py-3 text-sm font-semibold text-white hover:bg-error-700"
            >
              Ya, Batalkan
            </button>
            <button
              type="button"
              onClick={() => setCancelTarget(null)}
              className="w-full rounded-xl border border-border py-3 text-sm font-medium hover:bg-muted"
            >
              Kembali
            </button>
          </>
        }
      />
    </div>
  );
}
