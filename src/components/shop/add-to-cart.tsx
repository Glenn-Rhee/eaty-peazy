"use client";

import { useState } from "react";
import { useCart } from "@/lib/cart";

export function AddToCart({
  productId,
  name,
  price,
  maxQuantity,
}: {
  productId: string;
  name: string;
  price: number;
  maxQuantity: number;
}) {
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const add = useCart((state) => state.add);
  const step = (delta: number) =>
    setQuantity((q) => Math.min(Math.max(q + delta, 1), Math.max(maxQuantity, 1)));

  function handleAdd() {
    add({ productId, name, price }, quantity);
    setQuantity(1);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  }

  return (
    <>
      <div className="rounded-[18px] bg-[#f3f1ee] p-5 shadow-[0_4px_0_rgba(0,0,0,0.08)] ring-1 ring-black/10">
        <div className="mb-3 text-xl font-black text-[#2d2d2d]">Jumlah</div>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => step(-1)}
            disabled={maxQuantity === 0 || quantity <= 1}
            className="h-11 w-11 rounded-[10px] border border-[#d5d0c8] bg-white text-2xl font-medium text-neutral-700 hover:bg-neutral-100 disabled:cursor-not-allowed disabled:opacity-50"
            aria-label="Kurangi jumlah"
          >
            −
          </button>
          <span className="w-10 text-center text-xl font-bold text-neutral-800">
            {quantity}
          </span>
          <button
            type="button"
            onClick={() => step(1)}
            disabled={maxQuantity === 0 || quantity >= maxQuantity}
            className="h-11 w-11 rounded-[10px] border border-[#d5d0c8] bg-white text-2xl font-medium text-neutral-700 hover:bg-neutral-100 disabled:cursor-not-allowed disabled:opacity-50"
            aria-label="Tambah jumlah"
          >
            +
          </button>
        </div>

        <button
          type="button"
          onClick={handleAdd}
          disabled={maxQuantity === 0}
          className="mt-5 w-full rounded-[12px] bg-[#f39a1e] px-6 py-3 text-lg font-black text-white shadow-[0_4px_0_rgba(178,102,5,0.9)] transition hover:bg-[#e68d12] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {added ? "Ditambahkan ✓" : "Tambah ke Keranjang"}
        </button>
        {added && (
          <a
            href="/cart"
            className="mt-3 block text-center text-sm font-semibold text-[#f39a1e] hover:underline"
          >
            Lihat keranjang →
          </a>
        )}
      </div>
    </>
  );
}
