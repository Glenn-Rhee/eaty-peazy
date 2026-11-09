// Data contoh untuk template. Ganti dengan query Prisma saat backend siap.

export interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  stock: number;
}

export type OrderStatus = "pending" | "process" | "completed" | "canceled";

export interface OrderItem {
  name: string;
  quantity: number;
  price: number;
}

export interface Order {
  id: string;
  customerName: string;
  phoneNumber: string;
  requestedDate: string;
  deliveryMethod: "delivery" | "pickup";
  status: OrderStatus;
  totalAmount: number;
  address?: string;
  items: OrderItem[];
}

export const products: Product[] = [
  { id: "1", name: "Kue Lapis Legit", price: 85000, stock: 24, description: "Lapis legit dengan tekstur lembut dan aroma rempah yang khas. Cocok untuk hampers dan acara keluarga." },
  { id: "2", name: "Brownies Panggang", price: 55000, stock: 8, description: "Brownies panggang dengan cokelat pekat dan bagian atas yang renyah." },
  { id: "3", name: "Bolu Pandan", price: 35000, stock: 40, description: "Bolu pandan lembut dengan aroma alami, dibuat setiap hari." },
  { id: "4", name: "Nastar Premium", price: 120000, stock: 15, description: "Nastar isi selai nanas homemade dengan mentega pilihan." },
  { id: "5", name: "Cheese Roll", price: 65000, stock: 0, description: "Roll keju gurih dengan lapisan renyah di luar dan lembut di dalam." },
  { id: "6", name: "Donat Kentang", price: 45000, stock: 30, description: "Donat kentang empuk dengan berbagai pilihan topping." },
];

export const orders: Order[] = [
  {
    id: "ORD-001",
    customerName: "Budi Santoso",
    phoneNumber: "081234567890",
    requestedDate: "2026-10-22",
    deliveryMethod: "delivery",
    status: "pending",
    totalAmount: 170000,
    address: "Jl. Melati No. 12, Bandung",
    items: [
      { name: "Kue Lapis Legit", quantity: 1, price: 85000 },
      { name: "Brownies Panggang", quantity: 1, price: 55000 },
      { name: "Bolu Pandan", quantity: 1, price: 30000 },
    ],
  },
  {
    id: "ORD-002",
    customerName: "Siti Aminah",
    phoneNumber: "082198765432",
    requestedDate: "2026-10-23",
    deliveryMethod: "pickup",
    status: "process",
    totalAmount: 120000,
    items: [{ name: "Nastar Premium", quantity: 1, price: 120000 }],
  },
  {
    id: "ORD-003",
    customerName: "Andi Wijaya",
    phoneNumber: "085212345678",
    requestedDate: "2026-10-18",
    deliveryMethod: "delivery",
    status: "completed",
    totalAmount: 255000,
    address: "Jl. Kenanga No. 4, Bandung",
    items: [
      { name: "Kue Lapis Legit", quantity: 2, price: 85000 },
      { name: "Donat Kentang", quantity: 1, price: 45000 },
      { name: "Brownies Panggang", quantity: 1, price: 40000 },
    ],
  },
  {
    id: "ORD-004",
    customerName: "Dewi Lestari",
    phoneNumber: "081377788899",
    requestedDate: "2026-10-15",
    deliveryMethod: "pickup",
    status: "completed",
    totalAmount: 90000,
    items: [{ name: "Donat Kentang", quantity: 2, price: 45000 }],
  },
  {
    id: "ORD-005",
    customerName: "Rudi Hartono",
    phoneNumber: "087855566677",
    requestedDate: "2026-10-12",
    deliveryMethod: "delivery",
    status: "canceled",
    totalAmount: 65000,
    address: "Jl. Anggrek No. 8, Bandung",
    items: [{ name: "Cheese Roll", quantity: 1, price: 65000 }],
  },
];

export const orderStatusLabel: Record<OrderStatus, string> = {
  pending: "Menunggu",
  process: "Diproses",
  completed: "Selesai",
  canceled: "Dibatalkan",
};

export const orderStatusClass: Record<OrderStatus, string> = {
  pending: "bg-warning-100 text-warning-800",
  process: "bg-info-100 text-info-800",
  completed: "bg-success-100 text-success-800",
  canceled: "bg-error-100 text-error-800",
};

export function formatRupiah(value: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatDate(value: string) {
  return new Date(value).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}
