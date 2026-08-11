"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import type { GalleryPost } from "@/lib/gallery-store";
import { getServiceBySlug } from "@/lib/services";
import Sparkle from "@/components/Sparkle";

export default function GalleryGrid({
  posts,
}: {
  posts: GalleryPost[];
}) {
  const [selected, setSelected] = useState<GalleryPost | null>(null);

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setSelected(null);
      }
    }

    window.addEventListener("keydown", onKeyDown);

    return () => {
      window.removeEventListener("keydown", onKeyDown);
    };
  }, []);

  const selectedService = selected?.serviceSlug
    ? getServiceBySlug(selected.serviceSlug)
    : undefined;

  return (
    <>
      {/* Masonry Gallery */}
      <div className="columns-1 gap-5 sm:columns-2 lg:columns-3">
        {posts.map((p) => (
          <button
            key={p.id}
            onClick={() => setSelected(p)}
            className="group mb-5 block w-full break-inside-avoid overflow-hidden rounded-[1.5rem] bg-white text-left shadow-[0_8px_24px_rgba(122,61,76,0.06)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_14px_32px_rgba(122,61,76,0.12)]"
          >
            {/* Image */}
            <div className="relative overflow-hidden">
              <Image
                src={p.imageUrl}
                alt={p.title}
                width={600}
                height={800}
                className="h-auto w-full object-cover transition duration-500 group-hover:scale-105"
              />

              {/* Hover Overlay */}
              <div className="absolute inset-0 flex items-end bg-gradient-to-t from-berry/70 via-transparent to-transparent opacity-0 transition duration-300 group-hover:opacity-100">
                <div className="flex w-full items-center justify-between p-5">
                  <span className="text-sm font-medium text-white">
                    View Look
                  </span>

                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-berry">
                    →
                  </span>
                </div>
              </div>

              {/* Sparkle */}
              <div className="absolute right-4 top-4 text-white opacity-0 transition duration-300 group-hover:opacity-90">
                <Sparkle className="h-5 w-5" />
              </div>
            </div>

            {/* Info */}
            <div className="p-5">
              <h2 className="font-display text-lg text-ink">
                {p.title}
              </h2>

              {p.description && (
                <p className="mt-1 line-clamp-2 text-sm leading-5 text-ink/60">
                  {p.description}
                </p>
              )}
            </div>
          </button>
        ))}
      </div>

      {/* Modal */}
      {selected && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={selected.title}
          onClick={() => setSelected(null)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-ink/60 px-4 py-6 backdrop-blur-sm sm:px-6"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-[2rem] bg-white shadow-2xl"
          >
            {/* Close */}
            <button
              onClick={() => setSelected(null)}
              aria-label="Close gallery image"
              className="absolute right-4 top-4 z-20 flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-xl text-ink shadow-md transition hover:bg-white hover:text-coral"
            >
              &times;
            </button>

            {/* Image */}
            <div className="relative overflow-hidden bg-nude-light">
              <Image
                src={selected.imageUrl}
                alt={selected.title}
                width={800}
                height={1000}
                className="h-auto max-h-[65vh] w-full object-contain"
              />
            </div>

            {/* Content */}
            <div className="p-6 sm:p-7">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-medium uppercase tracking-[0.2em] text-coral">
                    Nail Set
                  </p>

                  <h2 className="mt-2 font-display text-2xl text-ink">
                    {selected.title}
                  </h2>
                </div>

                <div className="mt-1 text-coral/60">
                  <Sparkle className="h-5 w-5" />
                </div>
              </div>

              {selected.description && (
                <p className="mt-3 text-sm leading-6 text-ink/60">
                  {selected.description}
                </p>
              )}

              {selectedService && (
                <Link
                  href={`/booking?service=${selectedService.slug}`}
                  onClick={() => setSelected(null)}
                  className="mt-6 flex items-center justify-center rounded-full bg-coral px-6 py-3 text-sm font-semibold text-white transition hover:bg-coral-dark"
                >
                  Book This Look
                  <span className="ml-2">→</span>
                </Link>
              )}

              {!selectedService && (
                <Link
                  href="/booking"
                  onClick={() => setSelected(null)}
                  className="mt-6 flex items-center justify-center rounded-full bg-coral px-6 py-3 text-sm font-semibold text-white transition hover:bg-coral-dark"
                >
                  Book an Appointment
                  <span className="ml-2">→</span>
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}