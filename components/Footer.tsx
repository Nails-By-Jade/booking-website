import Link from "next/link";
import Image from "next/image";
import { IconInstagram, IconMapPin } from "./Icons";

export default function Footer() {
  return (
    <footer className="bg-nude-light">
      <div className="mx-auto max-w-6xl px-6 py-16">
        {/* Main Footer */}
        <div className="grid gap-12 md:grid-cols-[1.5fr_1fr_1fr]">
          
          {/* Brand */}
          <div>
            <Link href="/" className="inline-block">
              <Image
                src="/logo.png"
                alt="Nails By Jade"
                width={160}
                height={60}
                className="h-auto w-[160px]"
              />
            </Link>

            <p className="mt-4 max-w-sm text-sm leading-6 text-ink/60">
              Nails By Jade is where creativity meets self-care, creating
              cute and beautiful nail sets made with love to make every client
              feel confident and extra special.
            </p>

            <Link
              href="/booking"
              className="mt-6 inline-flex items-center rounded-full bg-berry px-6 py-3 text-sm font-medium text-white transition hover:bg-coral"
            >
              Book an Appointment
            </Link>
          </div>

          {/* Quick Links */}
          <div>
            <p className="mb-5 font-display text-sm text-ink">
              Quick Links
            </p>

            <nav className="flex flex-col gap-3 text-sm text-ink/60">
              <Link
                href="/"
                className="w-fit transition hover:text-coral"
              >
                Home
              </Link>

              <Link
                href="/services"
                className="w-fit transition hover:text-coral"
              >
                Services
              </Link>

              <Link
                href="/gallery"
                className="w-fit transition hover:text-coral"
              >
                View My Nails
              </Link>

              <Link
                href="/about"
                className="w-fit transition hover:text-coral"
              >
                About
              </Link>

              <Link
                href="/contact"
                className="w-fit transition hover:text-coral"
              >
                Contact
              </Link>

              
            </nav>
          </div>

          {/* Contact */}
          <div>
            <p className="mb-5 font-display text-sm text-ink">
              Find Us
            </p>

            <div className="space-y-4">
              {/* Location */}
              <div className="flex items-start gap-3 text-sm text-ink/60">
                <IconMapPin className="mt-0.5 h-4 w-4 shrink-0 text-coral" />

                <span>
                  Calamba &amp; Manila
                </span>
              </div>

              {/* Instagram */}
              <a
                href="https://www.instagram.com/nails.by__jade/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 text-sm text-ink/60 transition hover:text-coral"
              >
                <IconInstagram className="h-4 w-4 shrink-0 text-coral" />

                <span>@nails.by__jade</span>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-14 flex flex-col gap-3 border-t border-white pt-6 text-xs text-ink/40 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} Nails By Jade. All rights reserved.
          </p>

          <p>
  Made By{" "}
  <a
    href="https://onlyteyl.github.io"
    target="_blank"
    rel="noopener noreferrer"
    className="font-medium text-berry transition hover:text-coral"
  >
    Onlyteyl
  </a>
</p>
        </div>
      </div>
    </footer>
  );
}