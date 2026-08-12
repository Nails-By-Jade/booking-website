import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import GalleryGrid from "@/components/GalleryGrid";
import Sparkle from "@/components/Sparkle";
import { getAllGalleryPosts } from "@/lib/gallery-store";

export const metadata = {
  title: "Gallery | Nails By Jade",
  description:
    "Browse recent nail sets from Nails By Jade for inspiration for your next appointment.",
};

export const dynamic = "force-dynamic";

export default async function GalleryPage() {
  const posts = await getAllGalleryPosts();

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Hero */}
      <section className="bg-nude-light px-6 py-20 sm:py-24">
        <div className="mx-auto max-w-3xl text-center">
          <div className="flex items-center justify-center gap-3 text-coral">
            <Sparkle className="h-4 w-4" />

            <p className="text-xs font-medium uppercase tracking-[0.25em] text-berry/70">
              Our Gallery
            </p>

            <Sparkle className="h-4 w-4" />
          </div>

          <h1 className="mt-5 font-display text-4xl text-ink sm:text-5xl">
            View My Nails
          </h1>

          <p className="mx-auto mt-5 max-w-xl text-sm leading-6 text-ink/60 sm:text-base">
            Get inspired by our latest nail sets and find a look you&apos;ll
            love for your next appointment. Save your favorites and bring
            them along as your inspo. 
          </p>
        </div>
      </section>

      {/* Gallery */}
      <section className="mx-auto max-w-6xl px-6 py-20">
        {posts.length === 0 ? (
          <div className="relative overflow-hidden rounded-[2rem] bg-nude-light px-6 py-20 text-center">
            <div className="absolute right-8 top-8 text-coral/40">
              <Sparkle />
            </div>

            <div className="absolute bottom-8 left-8 text-coral/30">
              <Sparkle />
            </div>

            <h2 className="font-display text-2xl text-ink">
              Beautiful sets are coming soon
            </h2>

            <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-ink/60">
              We&apos;re getting ready to fill this gallery with our latest
              nail creations. Check back soon for more inspiration!
            </p>
          </div>
        ) : (
          <>
            <div className="mb-10 flex items-end justify-between">
              <div>
                <p className="text-xs font-medium uppercase tracking-[0.25em] text-coral">
                  Fresh Sets
                </p>

                <h2 className="mt-2 font-display text-2xl text-ink sm:text-3xl">
                  Recent Work
                </h2>
              </div>

              <p className="hidden text-sm text-ink/40 sm:block">
                {posts.length} {posts.length === 1 ? "set" : "sets"}
              </p>
            </div>

            <GalleryGrid posts={posts} />
          </>
        )}
      </section>

      {/* CTA */}
      <section className="px-6 pb-20">
        <div className="mx-auto max-w-4xl rounded-[2.5rem] bg-berry px-6 py-14 text-center shadow-[0_15px_40px_rgba(122,61,76,0.15)] sm:px-12">
          <div className="mx-auto flex w-fit items-center gap-2 text-white/70">
            <Sparkle className="h-4 w-4" />

            <span className="text-xs font-medium uppercase tracking-[0.25em]">
              Found your favorite?
            </span>

            <Sparkle className="h-4 w-4" />
          </div>

          <h2 className="mt-4 font-display text-3xl text-white sm:text-4xl">
            Let&apos;s recreate your look
          </h2>

          <p className="mx-auto mt-4 max-w-lg text-sm leading-6 text-white/70">
            Pick a service, choose your preferred schedule, and bring your
            favorite inspiration with you.
          </p>

          <a
            href="/booking"
            className="mt-7 inline-flex rounded-full bg-white px-7 py-3 text-sm font-semibold text-berry transition hover:bg-nude-light"
          >
            Book an Appointment
            <span className="ml-2">→</span>
          </a>
        </div>
      </section>

      <Footer />
    </div>
  );
}