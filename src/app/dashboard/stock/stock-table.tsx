"use client";

import { useState, useTransition } from "react";
import { Modal } from "@/components/ui/modal";
import { addStock } from "./actions";

type Stock = {
  id: string;
  quantity: number;
  product: {
    id: string;
    name: string;
    imageUrl?: string | null;
  };
};

function resolveProductImage(name: string, imageUrl?: string | null) {
  if (imageUrl) return imageUrl;

  const slug = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

  return `/seed/products/${slug || "default-product"}.svg`;
}

function StockModal({ stock, onClose }: { stock: Stock | null; onClose: () => void }) {
  const [amount, setAmount] = useState("");
  const [isPending, startTransition] = useTransition();

  const parsed = parseInt(amount, 10);
  const canSubmit = !!stock && !isPending && !isNaN(parsed) && parsed > 0;

  function submit() {
    if (!canSubmit || !stock) return;

    startTransition(async () => {
      await addStock(stock.id, parsed);
      setAmount("");
      onClose();
    });
  }

  function handleClose() {
    setAmount("");
    onClose();
  }

  return (
    <Modal
      open={!!stock}
      onClose={handleClose}
      title="Ubah Stok"
      icon={false}
      size="sm"
      footer={
        <>
          <button
            type="button"
            onClick={submit}
            disabled={!canSubmit}
            className="w-full rounded-xl bg-brand-500 py-3 text-sm font-semibold text-white hover:bg-brand-hover disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isPending ? "Menyimpan..." : "Tambah Stok"}
          </button>
          <button
            type="button"
            onClick={handleClose}
            className="w-full rounded-xl border border-border py-3 text-sm font-medium hover:bg-muted"
          >
            Batal
          </button>
        </>
      }
    >
      <div className="space-y-4">
        <div className="flex items-center justify-between rounded-lg bg-neutral-50 px-4 py-3">
          <span className="text-sm font-medium text-neutral-700">
            {stock?.product.name}
          </span>
          <span className="text-sm font-semibold text-neutral-900">
            Stok: {stock?.quantity ?? 0}
          </span>
        </div>

        <label className="block text-sm font-medium text-neutral-800">
          Jumlah tambahan
          <input
            type="number"
            min="1"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") submit();
            }}
            placeholder="0"
            autoFocus
            className="mt-1.5 w-full rounded-lg border border-input bg-white px-3 py-2 text-sm text-neutral-900 placeholder:text-neutral-500 outline-none focus:border-ring focus:ring-2 focus:ring-ring/30 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
          />
        </label>

        {amount && canSubmit && (
          <p className="text-sm text-neutral-600">
            Stok menjadi{" "}
            <span className="font-semibold text-neutral-900">
              {(stock?.quantity ?? 0) + parsed}
            </span>
          </p>
        )}
      </div>
    </Modal>
  );
}

export function StockTable({ stocks }: { stocks: Stock[] }) {
  const [activeStock, setActiveStock] = useState<Stock | null>(null);

  return (
    <>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {stocks.map((stock) => {
        const productImage = resolveProductImage(
          stock.product.name,
          stock.product.imageUrl
        );

        return (
          <div
            key={stock.id}
            className="overflow-hidden rounded-2xl border-2 border-neutral-200 bg-white shadow-sm"
          >
            {/* Product Image */}
            <div className="border-b border-neutral-100 bg-neutral-50 p-3">
              <div className="overflow-hidden rounded-xl">
                <img
                  src={productImage}
                  alt={stock.product.name}
                  className="h-[160px] w-full rounded-xl object-cover"
                />
              </div>
            </div>

            {/* Product Info */}
            <div className="space-y-3 p-4 text-center">
              <h3 className="text-lg font-bold text-neutral-900">
                {stock.product.name}
              </h3>

              <p className="text-sm font-semibold text-neutral-600">
                Stok : <span className="text-neutral-900">{stock.quantity}</span>
              </p>

              <div className="flex justify-center">
                <button
                  type="button"
                  onClick={() => setActiveStock(stock)}
                  className="rounded-lg bg-brand-500 px-5 py-2 text-sm font-bold text-white shadow-sm transition-colors hover:bg-brand-hover active:scale-95"
                >
                  Ubah Stok
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </div>

      <StockModal stock={activeStock} onClose={() => setActiveStock(null)} />
    </>
  );
}
