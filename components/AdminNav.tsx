"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

const TABS = [
  { href: "/admin", label: "Bookings" },
  { href: "/admin/availability", label: "Availability" },
  { href: "/admin/gallery", label: "Gallery" },
  { href: "/admin/messages", label: "Messages" },
];

export default function AdminNav() {
  const pathname = usePathname();
  const router = useRouter();

  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
  }

  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div className="flex flex-wrap gap-2">
        {TABS.map((t) => (
          <Link
            key={t.href}
            href={t.href}
            className={`rounded-full px-4 py-2 text-xs font-semibold transition ${
              pathname === t.href
                ? "bg-coral text-white"
                : "border border-ink/15 text-ink hover:border-coral hover:text-coral"
            }`}
          >
            {t.label}
          </Link>
        ))}
      </div>
      <button
        onClick={logout}
        className="rounded-full border border-ink/15 px-4 py-2 text-xs font-semibold text-ink hover:border-berry hover:text-berry"
      >
        Sign out
      </button>
    </div>
  );
}
