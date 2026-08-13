"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/", label: "Home" },
  { href: "/services", label: "Services" },
  { href: "/gallery", label: "Gallery" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  return (
    <header className="sticky top-0 z-40 border-b border-berry/5 bg-cream/85 backdrop-blur-md">
      <nav className="mx-auto flex h-[76px] max-w-6xl items-center justify-between px-5 sm:px-6">
        
        {/* Logo */}
        <Link
          href="/"
          onClick={() => setOpen(false)}
          className="group flex items-center"
          aria-label="Nails By Jade Home"
        >
          <Image
            src="/logo.png"
            alt="Nails By Jade"
            width={100}
            height={62}
            className="h-11 w-auto transition duration-300 group-hover:scale-[1.03]"
            priority
          />
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden items-center gap-1 lg:flex">
          {links.map((link) => {
            const active = isActive(link.href);

            return (
              <Link
                key={link.href}
                href={link.href}
                className={`relative rounded-full px-4 py-2 text-sm font-semibold transition duration-200 ${
                  active
                    ? "text-coral"
                    : "text-ink/70 hover:bg-white/60 hover:text-coral"
                }`}
              >
                {link.label}

                {/* Active indicator */}
                {active && (
                  <span className="absolute bottom-0.5 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-coral" />
                )}
              </Link>
            );
          })}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2.5">
          {/* Desktop Book Button */}
          <Link
            href="/booking"
            className="hidden items-center rounded-full bg-coral px-6 py-2.5 text-sm font-bold text-white shadow-sm shadow-coral/20 transition duration-300 hover:-translate-y-0.5 hover:bg-coral-dark hover:shadow-md lg:inline-flex"
          >
            Book Now
            <span className="ml-1.5 transition-transform duration-300 group-hover:translate-x-1">
              →
            </span>
          </Link>

          {/* Mobile Book Button */}
          <Link
            href="/booking"
            onClick={() => setOpen(false)}
            className="rounded-full bg-coral px-5 py-2.5 text-xs font-bold text-white shadow-sm shadow-coral/20 transition hover:bg-coral-dark sm:text-sm lg:hidden"
          >
            Book Now
          </Link>

          {/* Mobile Menu Toggle */}
          <button
            type="button"
            onClick={() => setOpen((prev) => !prev)}
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            className="relative flex h-10 w-10 items-center justify-center rounded-full border border-berry/10 bg-white/50 text-ink transition duration-200 hover:border-coral/30 hover:text-coral lg:hidden"
          >
            <span className="sr-only">
              {open ? "Close menu" : "Open menu"}
            </span>

            <span className="relative block h-5 w-5">
              <span
                className={`absolute left-0 top-1/2 h-[1.5px] w-5 rounded-full bg-current transition duration-300 ${
                  open ? "rotate-45" : "-translate-y-1.5"
                }`}
              />

              <span
                className={`absolute left-0 top-1/2 h-[1.5px] w-5 rounded-full bg-current transition duration-300 ${
                  open ? "opacity-0" : "opacity-100"
                }`}
              />

              <span
                className={`absolute left-0 top-1/2 h-[1.5px] w-5 rounded-full bg-current transition duration-300 ${
                  open ? "-rotate-45" : "translate-y-1.5"
                }`}
              />
            </span>
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      <div
        className={`overflow-hidden border-t border-berry/5 bg-cream/95 transition-all duration-300 lg:hidden ${
          open ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="mx-auto max-w-6xl px-5 pb-5 pt-3 sm:px-6">
          <div className="rounded-2xl bg-white/60 p-2 shadow-sm">
            {links.map((link) => {
              const active = isActive(link.href);

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className={`flex items-center justify-between rounded-xl px-4 py-3.5 text-sm font-semibold transition ${
                    active
                      ? "bg-nude-light text-coral"
                      : "text-ink/70 hover:bg-nude-light hover:text-coral"
                  }`}
                >
                  <span>{link.label}</span>

                  {active && (
                    <span className="h-1.5 w-1.5 rounded-full bg-coral" />
                  )}
                </Link>
              );
            })}
          </div>

        </div>
      </div>
    </header>
  );
}