export async function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-neutral-50">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-2 px-4 py-8 text-sm text-muted-foreground sm:flex-row">
        <p>© {year} EatyPeazy. Seluruh hak cipta dilindungi.</p>
        <p>Dibuat dengan Next.js & Tailwind CSS</p>
      </div>
    </footer>
  );
}
