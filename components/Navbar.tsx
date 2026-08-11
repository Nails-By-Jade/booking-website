import Image from "next/image";
import Link from "next/link";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-40 border-b border-nude bg-cream/90 backdrop-blur">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center">
          <Image
            src="/logo.png"
            alt="Nails By Jade"
            width={90}
            height={56}
            className="h-10 w-auto"
            priority
          />
        </Link>
        <div className="hidden items-center gap-7 text-sm font-semibold text-ink lg:flex">
          <Link href="/" className="transition hover:text-coral">
            Home
          </Link>
          <Link href="/services" className="transition hover:text-coral">
            Services
          </Link>
          <Link href="/gallery" className="transition hover:text-coral">
            View My Nails
          </Link>
          <Link href="/about" className="transition hover:text-coral">
            About
          </Link>
          <Link href="/contact" className="transition hover:text-coral">
            Contact
          </Link>
        </div>
        <Link
          href="/booking"
          className="rounded-full bg-coral px-6 py-2.5 text-sm font-bold text-white transition hover:bg-coral-dark"
        >
          Book Now
        </Link>
      </nav>
    </header>
  );
}