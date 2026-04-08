type SectionTitleProps = {
  eyebrow?: string;
  title: string;
  description?: string;
};

// Tanggung jawab:
// - Judul section reusable untuk banyak halaman
// - Menyatukan pola eyebrow, title, dan description
export function SectionTitle({
  eyebrow,
  title,
  description,
}: SectionTitleProps) {
  return (
    <div className="space-y-2">
      {eyebrow && (
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-slate-500">
          {eyebrow}
        </p>
      )}
      <h2 className="text-xl font-semibold text-slate-950">{title}</h2>
      {description && (
        <p className="max-w-2xl text-sm leading-6 text-slate-600">
          {description}
        </p>
      )}
    </div>
  );
}
