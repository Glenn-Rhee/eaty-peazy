"use client";

import { useState, useTransition, useRef, type ReactNode } from "react";
import { Modal } from "@/components/ui/modal";
import { createProduct, updateProduct, deleteProduct } from "./actions";

type Product = {
  id: string;
  name: string;
  price: number | string | { toString(): string };
  description: string | null;
  imageUrl?: string | null;
  stock: { id: string; quantity: number } | null;
};

function formatRupiah(value: number | string | { toString(): string }) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(Number(value));
}

function PhotoUploadBox({
  src,
  onFilesPicked,
  index,
  isPrimary = false,
}: {
  src?: string;
  onFilesPicked: (files: FileList | null, index: number) => void;
  index: number;
  isPrimary?: boolean;
}) {
  return (
    <label
      className={[
        "group relative flex cursor-pointer items-center justify-center overflow-hidden rounded-[18px] border-2 border-[#4b87d6] bg-[#eaf1ff] text-[#1e56b0] shadow-sm transition-all hover:scale-[1.01]",
        isPrimary ? "h-[240px] w-full" : "hidden",
      ].join(" ")}
    >
      <input
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(event) => onFilesPicked(event.target.files, index)}
      />

      {src ? (
        <img
          src={src}
          alt={isPrimary ? "Preview produk utama" : `Preview produk ${index + 1}`}
          className="h-full w-full object-cover"
        />
      ) : (
        <div className="flex flex-col items-center justify-center gap-2">
          <div className="relative flex h-14 w-14 items-center justify-center rounded-2xl bg-[#1f69d0] text-white shadow-md">
            <svg viewBox="0 0 24 24" className="h-8 w-8 fill-current" aria-hidden="true">
              <path d="M19 7h-1.586l-1.707-2.293A2 2 0 0 0 13.914 4H10.09a2 2 0 0 0-1.793 1.707L6.586 7H5a3 3 0 0 0-3 3v7a3 3 0 0 0 3 3h14a3 3 0 0 0 3-3v-7a3 3 0 0 0-3-3Zm-7 11a4.5 4.5 0 1 1 0-9 4.5 4.5 0 0 1 0 9Zm0-2a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z"/>
            </svg>
            <span className="absolute -right-1 -top-1 flex h-6 w-6 items-center justify-center rounded-full bg-[#f7b82a] text-xl leading-none text-white shadow-sm">+</span>
          </div>
          {isPrimary && (
            <span className="text-xl font-black tracking-wide text-[#1f69d0] uppercase">
              Add Photo
            </span>
          )}
        </div>
      )}
    </label>
  );
}

function ProductFormFields({
  mode,
  onSubmit,
  defaultValues,
  error,
  isPending,
}: {
  mode: "add" | "edit";
  onSubmit: (formData: FormData) => void;
  defaultValues?: Partial<Product>;
  error: string | null;
  isPending: boolean;
}) {
  const [images, setImages] = useState<string[]>([defaultValues?.imageUrl ?? ""]);

  const handleChange = (files: FileList | null, index: number) => {
    if (!files || files.length === 0) return;
    const file = files[0];
    const reader = new FileReader();
    reader.onload = () => {
      const next = [...images];
      next[index] = String(reader.result || "");
      setImages(next);
    };
    reader.readAsDataURL(file);
  };

  const primaryImage = images[0] || "";

  return (
    <form
      id={mode === "add" ? "add-product-form" : "edit-product-form"}
      action={onSubmit}
      className="space-y-6"
      noValidate
    >
      <input type="hidden" name="imageUrl" value={primaryImage} />
      <div className="grid gap-5 md:grid-cols-[320px_1fr]">
        <div className="space-y-3">
          <PhotoUploadBox
            src={primaryImage}
            index={0}
            onFilesPicked={handleChange}
            isPrimary
          />
        </div>

        <div className="space-y-3 pt-1">
          <div className="rounded-[14px] border-[2px] border-[#4b87d6] bg-[#f7f7f2] px-4 py-3 text-[11px] font-black uppercase tracking-[0.12em] text-[#f39a1e] shadow-[inset_0_0_0_1px_rgba(75,135,214,0.15)]">
            <input
              name="name"
              defaultValue={defaultValues?.name ?? ""}
              placeholder="NAMA PRODUK"
              className="w-full border-none bg-transparent text-[17px] font-black uppercase text-[#2e2f32] placeholder:text-[#2e2f32]/65 focus:outline-none"
              required
            />
          </div>

          <div className="rounded-[14px] border-[2px] border-[#4b87d6] bg-[#f7f7f2] px-4 py-3 text-[11px] font-black uppercase tracking-[0.12em] text-[#f39a1e] shadow-[inset_0_0_0_1px_rgba(75,135,214,0.15)]">
            <input
              name="price"
              type="number"
              min="0"
              defaultValue={defaultValues?.price ? Number(defaultValues.price) : ""}
              placeholder="HARGA PRODUK"
              className="w-full border-none bg-transparent text-[17px] font-black uppercase text-[#2e2f32] placeholder:text-[#2e2f32]/65 focus:outline-none"
              required
            />
          </div>

          <div className="rounded-[14px] border-[2px] border-[#4b87d6] bg-[#f7f7f2] px-4 py-3 text-[11px] font-black uppercase tracking-[0.12em] text-[#f39a1e] shadow-[inset_0_0_0_1px_rgba(75,135,214,0.15)]">
            <textarea
              name="description"
              defaultValue={defaultValues?.description ?? ""}
              rows={4}
              placeholder="DESKRIPSI PRODUK"
              className="w-full resize-none border-none bg-transparent text-[17px] font-black uppercase leading-relaxed text-[#2e2f32] placeholder:text-[#2e2f32]/65 focus:outline-none"
            />
          </div>

          {mode === "add" && (
            <input name="quantity" type="hidden" value="0" />
          )}

          {error && <p className="text-sm text-red-600">{error}</p>}

          <button
            type="submit"
            disabled={isPending}
            className="mt-2 w-full rounded-[16px] bg-[#f39a1e] px-6 py-3 text-[18px] font-black text-white shadow-[0_5px_0_rgba(175,103,11,0.9)] transition-transform hover:-translate-y-0.5 hover:bg-[#e68d10] disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isPending ? "Menyimpan..." : "Selesai"}
          </button>
        </div>
      </div>
    </form>
  );
}

export function ProductTable({
  products,
  title,
}: {
  products: Product[];
  title?: ReactNode;
}) {
  const [addOpen, setAddOpen] = useState(false);
  const [editProduct, setEditProduct] = useState<Product | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Product | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const addFormRef = useRef<HTMLFormElement>(null);
  const editFormRef = useRef<HTMLFormElement>(null);

  function handleAdd(formData: FormData) {
    setError(null);
    startTransition(async () => {
      const res = await createProduct(formData);
      if (res?.error) {
        setError(res.error);
        return;
      }
      setAddOpen(false);
      addFormRef.current?.reset();
    });
  }

  function handleEdit(formData: FormData) {
    if (!editProduct) return;
    setError(null);
    startTransition(async () => {
      const res = await updateProduct(editProduct.id, formData);
      if (res?.error) {
        setError(res.error);
        return;
      }
      setEditProduct(null);
    });
  }

  function handleDelete() {
    if (!deleteTarget) return;
    startTransition(async () => {
      await deleteProduct(deleteTarget.id);
      setDeleteTarget(null);
    });
  }

  const fallbackImage = "https://images.unsplash.com/photo-1551024601-bec78aea704b?auto=format&fit=crop&w=900&q=80";

  return (
    <>
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">{title}</div>

        <button
          type="button"
          onClick={() => {
            setAddOpen(true);
            setError(null);
          }}
          className="flex h-10 w-10 items-center justify-center rounded-full bg-[#1f1f1f] text-[1.9rem] font-thin leading-none text-white shadow-[0_3px_0_rgba(0,0,0,0.3)] transition-transform hover:scale-[1.02]"
          aria-label="Tambah produk"
        >
          <span className="mt-[-1px] block">+</span>
        </button>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {products.map((product) => {
          const productImage = product.imageUrl || fallbackImage;

          return (
            <div
              key={product.id}
              className="overflow-hidden rounded-2xl border-2 border-neutral-200 bg-white shadow-sm"
            >
              <div className="border-b border-neutral-100 bg-neutral-50 p-3">
                <div className="overflow-hidden rounded-xl">
                  <img
                    src={productImage}
                    alt={product.name}
                    className="h-[160px] w-full rounded-xl object-cover"
                  />
                </div>
              </div>

              <div className="space-y-3 p-4 text-center">
                <h3 className="text-lg font-bold text-neutral-900">
                  {product.name}
                </h3>
                <p className="text-sm font-semibold text-neutral-600">
                  {formatRupiah(product.price)}
                </p>

                <div className="space-y-2">
                  <button
                    type="button"
                    onClick={() => {
                      setEditProduct(product);
                      setError(null);
                    }}
                    className="w-full rounded-lg border-2 border-[#0d66c2] bg-[#1f69d0] px-5 py-2 text-sm font-black text-white shadow-sm transition-colors hover:bg-[#1a58b3]"
                  >
                    Edit
                  </button>

                  <button
                    type="button"
                    onClick={() => setDeleteTarget(product)}
                    className="w-full rounded-lg border-2 border-[#0d66c2] bg-[#f39a1e] px-5 py-2 text-sm font-black text-white shadow-sm transition-colors hover:bg-[#e68d10]"
                  >
                    Hapus
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <Modal
        open={addOpen}
        onClose={() => {
          setAddOpen(false);
          setError(null);
        }}
        title="Add Your Produk"
        icon={false}
        size="2xl"
      >
        <ProductFormFields
          mode="add"
          onSubmit={handleAdd}
          error={error}
          isPending={isPending}
        />
      </Modal>

      <Modal
        open={!!editProduct}
        onClose={() => {
          setEditProduct(null);
          setError(null);
        }}
        title="Edit Produk"
        icon={false}
        size="2xl"
      >
        <ProductFormFields
          mode="edit"
          onSubmit={handleEdit}
          defaultValues={editProduct ?? undefined}
          error={error}
          isPending={isPending}
        />
      </Modal>

      <Modal
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        title="Hapus Produk"
        variant="danger"
        layout="centered"
        description={`Yakin ingin menghapus "${deleteTarget?.name}"? Produk tidak akan muncul di toko.`}
        footer={
          <>
            <button
              type="button"
              onClick={handleDelete}
              disabled={isPending}
              className="w-full rounded-xl bg-error-600 py-3 text-sm font-semibold text-white hover:bg-error-700 disabled:opacity-60"
            >
              {isPending ? "Menghapus..." : "Hapus"}
            </button>
            <button
              type="button"
              onClick={() => setDeleteTarget(null)}
              className="w-full rounded-xl border border-border py-3 text-sm font-medium hover:bg-muted"
            >
              Batal
            </button>
          </>
        }
      />
    </>
  );
}
