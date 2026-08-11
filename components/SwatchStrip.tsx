import { services } from "@/lib/services";

export default function SwatchStrip() {
  return (
    <div className="flex items-center justify-center gap-3">
      {services.map((s) => (
        <span
          key={s.slug}
          title={s.name}
          className="swatch h-8 w-8 shadow-sm ring-2 ring-white"
          style={{ backgroundColor: s.swatch }}
        />
      ))}
    </div>
  );
}
