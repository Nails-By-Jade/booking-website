import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Sparkle from "@/components/Sparkle";
import { services, addOns } from "@/lib/services";
import { formatPHP } from "@/lib/format";

export const metadata = {
  title: "Services & Pricing | Nails By Jade",
  description:
    "Explore Nails By Jade's nail services, pricing, and available add-ons.",
};

export default function ServicesPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Hero */}
      <section className="bg-nude-light px-6 py-20 sm:py-24">
        <div className="mx-auto max-w-3xl text-center">
          <div className="flex items-center justify-center gap-3 text-coral">
            <Sparkle className="h-4 w-4" />

            <p className="text-xs font-medium uppercase tracking-[0.25em] text-berry/70">
              The Menu
            </p>

            <Sparkle className="h-4 w-4" />
          </div>

          <h1 className="mt-5 font-display text-4xl text-ink sm:text-5xl">
            Services &amp; Pricing
          </h1>

          <p className="mx-auto mt-5 max-w-xl text-sm leading-6 text-ink/60 sm:text-base">
            Find the perfect service for your next set. Choose your favorite
            look, pick a schedule, and let us create something beautiful for
            you.
          </p>
        </div>
      </section>

      {/* Services */}
      <section className="mx-auto max-w-6xl px-6 py-20">
        <div className="mb-10">
          <p className="text-xs font-medium uppercase tracking-[0.25em] text-coral">
            Choose your set
          </p>

          <h2 className="mt-2 font-display text-3xl text-ink">
            Our Services
          </h2>

          <p className="mt-3 max-w-xl text-sm leading-6 text-ink/60">
            From simple and clean to detailed and creative, there's a set for
            every mood and occasion.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((s) => (
            <div
              key={s.slug}
              className="group relative flex flex-col overflow-hidden rounded-[2rem] border border-ink/5 bg-white p-7 shadow-[0_8px_24px_rgba(122,61,76,0.06)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_14px_35px_rgba(122,61,76,0.12)]"
            >
              {/* Decorative Sparkle */}
              <div className="absolute right-5 top-5 text-coral/40 transition duration-300 group-hover:scale-125 group-hover:rotate-12">
                <Sparkle />
              </div>

              {/* Color Swatch */}
              <div
                className="swatch flex h-16 w-16 items-center justify-center rounded-full shadow-sm transition duration-300 group-hover:scale-105"
                style={{ backgroundColor: s.swatch }}
              >
                <span className="text-white/70">✦</span>
              </div>

              {/* Service Name */}
              <h2 className="mt-6 font-display text-xl text-ink">
                {s.name}
              </h2>

              {/* Description */}
              <p className="mt-2 flex-1 text-sm leading-6 text-ink/60">
                {s.description}
              </p>

              {/* Price + Duration */}
              <div className="mt-6 flex items-center justify-between border-t border-ink/5 pt-5">
                <span className="rounded-full bg-nude-light px-3 py-1 text-xs text-ink/50">
                  {s.duration} min
                </span>

                <span className="text-base font-semibold text-berry">
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

              {/* Add-ons */}
              <Link
                href="#add-ons"
                className="mt-4 inline-flex w-fit items-center text-xs font-semibold text-coral transition hover:text-berry"
              >
                + Add-ons available
              </Link>

              {/* Booking */}
              <Link
                href={`/booking?service=${s.slug}`}
                className="mt-5 inline-flex items-center justify-center rounded-full bg-coral px-5 py-3 text-sm font-semibold text-white shadow-sm shadow-coral/20 transition hover:bg-coral-dark"
              >
                Book This Service
                <span className="ml-2 transition-transform group-hover:translate-x-1">
                  →
                </span>
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* Add-ons */}
      <section
        id="add-ons"
        className="scroll-mt-24 bg-nude-light py-20"
      >
        <div className="mx-auto max-w-6xl px-6">
          <div className="mx-auto max-w-2xl text-center">
            <div className="mx-auto flex w-fit items-center gap-2 text-coral">
              <Sparkle className="h-4 w-4" />

              <p className="text-xs font-medium uppercase tracking-[0.25em] text-berry/70">
                Make it yours
              </p>

              <Sparkle className="h-4 w-4" />
            </div>

            <h2 className="mt-4 font-display text-3xl text-ink">
              Customize your set
            </h2>

            <p className="mt-3 text-sm leading-6 text-ink/60">
              Add a little something extra to make your nails uniquely yours.
              Simply mention your preferred add-ons when booking.
            </p>
          </div>

          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {addOns.map((a) => (
              <div
                key={a.name}
                className="group rounded-[1.5rem] bg-white p-6 shadow-[0_6px_20px_rgba(122,61,76,0.05)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_10px_25px_rgba(122,61,76,0.09)]"
              >
                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-nude-light text-coral transition group-hover:scale-105">
                    <Sparkle className="h-4 w-4" />
                  </div>

                  <div>
                    <h3 className="font-display text-base text-ink">
                      {a.name}
                    </h3>

                    <p className="mt-1 text-sm leading-6 text-ink/60">
                      {a.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Add-on Note */}
          <p className="mt-8 text-center text-xs text-ink/40">
            Add-ons can be requested during the booking process or discussed
            during your appointment.
          </p>
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 py-20">
        <div className="mx-auto max-w-4xl overflow-hidden rounded-[2.5rem] bg-berry px-6 py-14 text-center shadow-[0_15px_40px_rgba(122,61,76,0.15)] sm:px-12">
          <div className="mx-auto flex w-fit items-center gap-2 text-white/70">
            <Sparkle className="h-4 w-4" />

            <span className="text-xs font-medium uppercase tracking-[0.25em]">
              Ready when you are
            </span>

            <Sparkle className="h-4 w-4" />
          </div>

          <h2 className="mt-4 font-display text-3xl text-white sm:text-4xl">
            Let's create your dream nails
          </h2>

          <p className="mx-auto mt-4 max-w-lg text-sm leading-6 text-white/70">
            Choose your service, find a time that works for you, and get ready
            for a little self-care.
          </p>

          <Link
            href="/booking"
            className="mt-7 inline-flex rounded-full bg-white px-7 py-3 text-sm font-semibold text-berry transition hover:bg-nude-light"
          >
            Book an Appointment
            <span className="ml-2">→</span>
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}