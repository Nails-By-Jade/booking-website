import Image from "next/image";
import Link from "next/link";
import type { GalleryPost } from "@/lib/gallery-store";
import Sparkle from "@/components/Sparkle";

export default function GallerySection({
  posts,
}: {
  posts: GalleryPost[];
}) {
  return (
    <section className="bg-white py-20">
      <div className="mx-auto max-w-6xl px-6">
        {/* Header */}
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-medium uppercase tracking-[0.25em] text-coral">
            Fresh Sets
          </p>

          <h2 className="mt-3 font-display text-3xl text-ink sm:text-4xl">
            View My Nails
          </h2>

          <p className="mx-auto mt-4 max-w-lg text-sm leading-6 text-ink/60 sm:text-base">
            Take a little inspiration from some of our recent nail sets and
            find your next favorite look. 
          </p>
        </div>

        {/* Gallery */}
        {posts.length === 0 ? (
          <div className="relative mt-12 overflow-hidden rounded-[2rem] bg-nude-light px-6 py-16 text-center">
            <div className="absolute right-8 top-8 text-coral/40">
              <Sparkle />
            </div>

            <div className="mx-auto max-w-md">
              <h3 className="font-display text-xl text-ink">
                Beautiful sets are coming soon
              </h3>

              <p className="mt-3 text-sm leading-6 text-ink/60">
                We're getting ready to fill this space with our latest nail
                creations. Check back soon for more inspiration!
              </p>

              <Link
                href="/booking"
                className="mt-6 inline-flex rounded-full bg-berry px-6 py-3 text-sm font-medium text-white transition hover:bg-coral"
              >
                Book an Appointment
              </Link>
            </div>
          </div>
        ) : (
          <div className="mt-12 grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4">
            {posts.slice(0, 8).map((p) => (
              <div
                key={p.id}
                className="group relative aspect-square overflow-hidden rounded-[1.5rem] bg-nude-light shadow-[0_6px_20px_rgba(122,61,76,0.06)]"
              >
                <Image
                  src={p.imageUrl}
                  alt={p.title}
                  fill
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                  className="object-cover transition duration-500 group-hover:scale-105"
                />

                {/* Hover Overlay */}
                <div className="absolute inset-0 flex items-end bg-gradient-to-t from-berry/70 via-transparent to-transparent opacity-0 transition duration-300 group-hover:opacity-100">
                  <div className="w-full p-4">
                    <p className="text-sm font-medium text-white">
                      {p.title}
                    </p>
                  </div>
                </div>

                {/* Sparkle */}
                <div className="absolute right-3 top-3 text-white/80 opacity-0 transition duration-300 group-hover:opacity-100">
                  <Sparkle />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Gallery Button */}
        <div className="mt-12 text-center">
          <Link
            href="/gallery"
            className="inline-flex items-center rounded-full border border-berry/20 bg-nude-light px-6 py-3 text-sm font-semibold text-berry transition hover:border-coral hover:text-coral"
          >
            See Full Gallery
            <span className="ml-2 transition-transform group-hover:translate-x-1">
              →
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
}