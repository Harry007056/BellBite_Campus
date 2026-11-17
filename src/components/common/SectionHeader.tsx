type SectionHeaderProps = {
  eyebrow: string;
  title: string;
  description?: string;
  align?: 'left' | 'center';
};

export function SectionHeader({
  eyebrow,
  title,
  description,
  align = 'left'
}: SectionHeaderProps) {
  return (
    <div className={align === 'center' ? 'mx-auto max-w-2xl text-center' : 'max-w-2xl'}>
      <p className="mb-3 text-sm font-bold uppercase tracking-[0.2em] text-[#963F2B]">{eyebrow}</p>
      <h2 className="font-display text-3xl font-semibold text-[#4A2922] md:text-4xl">{title}</h2>
      {description ? <p className="mt-4 text-base text-[#603C35] md:text-lg">{description}</p> : null}
    </div>
  );
}
