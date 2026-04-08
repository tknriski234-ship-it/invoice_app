// Tanggung jawab:
// - Footer landing page
// - Tempat copyright, link tambahan, atau catatan kecil
// - Tetap terpisah dari main content
export function PageFooter() {
  return (
    <footer className="border-t border-slate-200">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <p className="text-sm text-slate-500">&copy; 2026 Invoice App</p>
        <p className="text-sm text-slate-400">Built for a clean invoicing workflow.</p>
      </div>
    </footer>
  );
}
