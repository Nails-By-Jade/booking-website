import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SwatchStrip from "@/components/SwatchStrip";
import Sparkle from "@/components/Sparkle";
import GallerySection from "@/components/GallerySection";
import { services } from "@/lib/services";
import { formatPHP } from "@/lib/format";
import { getAllGalleryPosts } from "@/lib/gallery-store";

// Gallery posts change via the admin panel, so render fresh on each request
// instead of baking the list in at build time.
export const dynamic = "force-dynamic";



const steps = [
  {
    n: "01",
    title: "Choose your service",
    body: "Browse our nail services and pick the set that matches your style.",
  },
  {
    n: "02",
    title: "Pick your schedule",
    body: "Choose an available date and time that's perfect for you.",
  },
  {
    n: "03",
    title: "Come & get pampered",
    body: "Show up, relax, and let us create your dream nails.",
  },
];

export default async function Home() {
  const galleryPosts = (await getAllGalleryPosts()).slice(0, 6);

  return (
    <div className="min-h-screen">
      <Navbar />

{/* Hero */}
<section className="relative overflow-hidden px-6 pt-20 pb-24 text-center sm:pt-28">
  <div
    aria-hidden
    className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[520px] bg-gradient-to-b from-nude-light via-cream to-cream"
  />

  <div className="mx-auto max-w-3xl">
    {/* Eyebrow */}
    <div className="flex items-center justify-center gap-3 text-coral">
      <Sparkle className="h-4 w-4" />

      <p className="text-xs font-medium uppercase tracking-[0.25em] text-berry/70">
        Your next favorite set starts here
      </p>

      <Sparkle className="h-4 w-4" />
    </div>

    {/* Heading */}
    <h1 className="mt-5 font-display text-5xl leading-[1.1] text-ink sm:text-6xl">
      Nails made to
      <br />
      <span className="text-coral">make you smile.</span>
    </h1>

    {/* Description */}
    <p className="mx-auto mt-6 max-w-xl text-base leading-7 text-ink/60">
      Cute, creative, and made with love. Choose your favorite service,
      find a time that works for you, and let&apos;s create a set you&apos;ll
      love showing off.
    </p>

    {/* Buttons */}
    <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row sm:gap-4">
      <Link
        href="/booking"
        className="rounded-full bg-coral px-7 py-3 text-sm font-bold text-white shadow-md shadow-coral/30 transition hover:-translate-y-0.5 hover:bg-coral-dark"
      >
        Book an Appointment 
      </Link>

      <Link
        href="/services"
        className="rounded-full border-2 border-berry/15 px-7 py-3 text-sm font-bold text-ink transition hover:border-coral hover:text-coral"
      >
        Explore Services
      </Link>
    </div>
  </div>

  {/* Nail Swatches */}
  <div className="mt-14">
    <SwatchStrip />
  </div>
</section>

{/* How It Works */}
<section className="bg-nude-light py-20">
  <div className="mx-auto max-w-6xl px-6">
    {/* Section Header */}
    <div className="mx-auto max-w-2xl text-center">
      <p className="text-xs font-medium uppercase tracking-[0.25em] text-coral">
        Simple &amp; Easy
      </p>

      <h2 className="mt-3 font-display text-3xl text-ink sm:text-4xl">
        Your perfect nails are just a few clicks away
      </h2>

      <p className="mt-4 text-sm leading-6 text-ink/60 sm:text-base">
        Choose your favorite service, find a time that works for you,
        and let us take care of the rest. 
      </p>
    </div>

    {/* Steps */}
    <div className="mt-14 grid gap-6 md:grid-cols-3">
      {steps.map((step) => (
        <div
          key={step.n}
          className="group relative rounded-[2rem] bg-white p-8 text-center shadow-[0_8px_30px_rgba(122,61,76,0.07)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_14px_35px_rgba(122,61,76,0.12)]"
        >
          {/* Number */}
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-nude-light">
            <span className="font-display text-lg text-coral">
              {step.n}
            </span>
          </div>

          {/* Content */}
          <h3 className="mt-6 font-display text-xl text-ink">
            {step.title}
          </h3>

          <p className="mx-auto mt-3 max-w-xs text-sm leading-6 text-ink/60">
            {step.body}
          </p>

          <div className="absolute right-5 top-5 text-pink-300/70 transition duration-300 group-hover:scale-125 group-hover:rotate-12">
  <Sparkle />
</div>
        </div>
      ))}
    </div>
  </div>
</section>

 {/* Services Preview */}
<section className="bg-nude-light py-20">
  <div className="mx-auto max-w-6xl px-6">
    {/* Header */}
    <div className="mx-auto max-w-2xl text-center">
      <p className="text-xs font-medium uppercase tracking-[0.25em] text-coral">
        Our Services
      </p>

      <h2 className="mt-3 font-display text-3xl text-ink sm:text-4xl">
        Find your perfect set
      </h2>

      <p className="mt-4 text-sm leading-6 text-ink/60 sm:text-base">
        From simple and elegant to cute and creative, choose a nail service
        made just for your style.
      </p>
    </div>

    {/* Service Cards */}
    <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {services.map((s) => (
        <Link
          key={s.slug}
          href={`/booking?service=${s.slug}`}
          className="group relative overflow-hidden rounded-[2rem] bg-white p-7 shadow-[0_8px_24px_rgba(122,61,76,0.07)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_14px_35px_rgba(122,61,76,0.13)]"
        >
          {/* Decorative Sparkle */}
          <div className="absolute right-5 top-5 text-coral/40 transition duration-300 group-hover:scale-125 group-hover:rotate-12">
            <Sparkle />
          </div>

          {/* Service Swatch */}
          <div
            className="swatch mx-auto flex h-20 w-20 items-center justify-center rounded-full shadow-sm transition duration-300 group-hover:scale-105"
            style={{ backgroundColor: s.swatch }}
          >
            <span className="text-white/80">✦</span>
          </div>

          {/* Service Info */}
          <div className="mt-6 text-center">
            <h3 className="font-display text-xl text-ink">
              {s.name}
            </h3>

            <p className="mx-auto mt-2 max-w-xs text-sm leading-6 text-ink/60">
              {s.description}
            </p>

            {/* Details */}
            <div className="mt-5 flex items-center justify-center gap-3 text-sm">
              <span className="rounded-full bg-nude-light px-3 py-1 text-ink/50">
                {s.duration} min
              </span>

              <span className="text-ink/20">•</span>

              <span className="font-semibold text-berry">
                {s.priceLabel ? (
                  s.priceLabel
                ) : (
                  <>
                    {s.startingAt && (
                      <span className="mr-1 text-xs font-normal text-ink/50">
                        starts at
                      </span>
                    )}
                    {formatPHP(s.price)}
                  </>
                )}
              </span>
            </div>

            {/* Book Link */}
            <div className="mt-6 text-sm font-semibold text-coral transition group-hover:text-berry">
              Book this service
              <span className="ml-1 inline-block transition group-hover:translate-x-1">
                →
              </span>
            </div>
          </div>
        </Link>
      ))}
    </div>

    {/* Full Menu */}
    <div className="mt-12 text-center">
      <Link
        href="/services"
        className="inline-flex items-center rounded-full border border-berry/20 bg-white px-6 py-3 text-sm font-semibold text-berry transition hover:border-coral hover:text-coral"
      >
        View Full Menu
        <span className="ml-2 transition-transform hover:translate-x-1">
          →
        </span>
      </Link>
    </div>
  </div>
</section>

      <GallerySection posts={galleryPosts} />

      <Footer />
    </div>
  );
}