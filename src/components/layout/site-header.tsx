import Image from "next/image";
import Link from "next/link";

const links = [
  { href: "/", label: "Beranda" },
  { href: "/shop", label: "Belanja" },
  { href: "/cart", label: "Keranjang" },
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-white/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <Link href="/" className="shrink-0">
          <Image src="/logo.png" alt="EatyPeazy" width={120} height={22} priority />
        </Link>

        <nav className="flex items-center gap-4 text-sm font-medium sm:gap-6">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-neutral-600 transition-colors hover:text-brand-700"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <Link
          href="/auth/login"
          className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-neutral-900 transition-colors hover:bg-primary-hover"
        >
          Masuk
        </Link>
      </div>
    </header>
  );
}
