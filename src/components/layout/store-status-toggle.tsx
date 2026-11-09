"use client";

import { useEffect, useState, type ReactNode } from "react";

const STORE_STATUS_KEY = "eaty-peazy-store-open";

export function getStoreOpenStatus() {
  if (typeof window === "undefined") return true;

  const value = window.localStorage.getItem(STORE_STATUS_KEY);
  return value === null ? true : value === "true";
}

export function setStoreOpenStatus(open: boolean) {
  if (typeof window === "undefined") return;

  window.localStorage.setItem(STORE_STATUS_KEY, String(open));
  window.dispatchEvent(
    new CustomEvent("eaty-peazy-store-status-change", {
      detail: { open },
    }),
  );
}

export function StoreStatusToggle() {
  const [isOpen, setIsOpen] = useState(true);

  useEffect(() => {
    setIsOpen(getStoreOpenStatus());

    const handleStatusChange = () => setIsOpen(getStoreOpenStatus());
    window.addEventListener("eaty-peazy-store-status-change", handleStatusChange);

    return () => {
      window.removeEventListener("eaty-peazy-store-status-change", handleStatusChange);
    };
  }, []);

  const handleToggle = () => {
    const next = !isOpen;
    setIsOpen(next);
    setStoreOpenStatus(next);
  };

  return (
    <div className="flex items-center gap-3">
      <span className="text-sm font-semibold text-[#1d1d1d]">
        {isOpen ? "Open" : "Closed"}
      </span>

      <button
        type="button"
        aria-label={isOpen ? "Tutup toko" : "Buka toko"}
        onClick={handleToggle}
        className={[
          "relative h-7 w-14 rounded-full border border-[#d9d2c3] transition-all duration-200",
          isOpen ? "bg-[#ff9d1d]" : "bg-[#c8c1b6]",
        ].join(" ")}
      >
        <span
          className={[
            "absolute top-1 h-5 w-5 rounded-full bg-white shadow-sm transition-all duration-200",
            isOpen ? "left-8" : "left-1",
          ].join(" ")}
        />
      </button>
    </div>
  );
}

export function StorefrontAvailability({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(true);

  useEffect(() => {
    setIsOpen(getStoreOpenStatus());

    const handleStatusChange = () => setIsOpen(getStoreOpenStatus());
    window.addEventListener("eaty-peazy-store-status-change", handleStatusChange);

    return () => {
      window.removeEventListener("eaty-peazy-store-status-change", handleStatusChange);
    };
  }, []);

  return (
    <div className={isOpen ? "" : "pointer-events-none select-none opacity-60 grayscale-[0.85]"}>
      {!isOpen && (
        <div className="border-b border-[#e2d9c9] bg-[#171717] px-4 py-3 text-center text-sm font-medium text-white">
          Pre-order saat ini ditutup. Semua menu tampak tidak aktif untuk pelanggan.
        </div>
      )}
      {children}
    </div>
  );
}
