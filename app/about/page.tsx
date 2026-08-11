import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Sparkle from "@/components/Sparkle";

export const metadata = {
  title: "About | Nails By Jade",
  description:
    "Get to know Jade and the story behind Nails By Jade.",
};

const values = [
  {
    number: "01",
    title: "Made with intention",
    body: "Every set is created with care, from choosing the perfect colors to placing every little detail. Your nails should feel personal to you.",
  },
  {
    number: "02",
    title: "Clean & careful",
    body: "Tools and work areas are cleaned and sanitized between appointments because your comfort, safety, and peace of mind always come first.",
  },
  {
    number: "03",
    title: "Your vibe, your nails",
    body: "Bring a photo, a color, or simply a mood. We'll work together to create a set that feels uniquely yours.",
  },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Hero */}
      <section className="bg-nude-light px-6 py-20 sm:py-24">
        <div className="mx-auto max-w-3xl text-center">
          <div className="flex items-center justify-center gap-3 text-coral">
            <Sparkle className="h-4 w-4" />

            <p className="text-xs font-medium uppercase tracking-[0.25em] text-berry/70">
              About Nails By Jade
            </p>

            <Sparkle className="h-4 w-4" />
          </div>

          <h1 className="mt-5 font-display text-4xl text-ink sm:text-5xl">
            Hi, I&apos;m Jade. ♡
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-sm leading-7 text-ink/60 sm:text-base">
            Nails By Jade started with a love for art, creativity, and the
            little details that make someone feel beautiful and confident.
          </p>
        </div>
      </section>

      {/* Story */}
      <section className="mx-auto max-w-6xl px-6 py-20 sm:py-24">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
          
          {/* Logo */}
          <div className="relative flex justify-center">
            <div className="absolute -left-4 top-8 text-coral/30 sm:left-8">
              <Sparkle className="h-5 w-5" />
            </div>

            <div className="absolute -bottom-4 right-4 text-coral/30 sm:right-12">
              <Sparkle className="h-4 w-4" />
            </div>

            <div className="flex min-h-[320px] w-full max-w-md items-center justify-center rounded-[2.5rem] bg-nude-light p-10">
              <Image
                src="/logo.png"
                alt="Nails By Jade"
                width={280}
                height={174}
                className="h-auto w-[220px] sm:w-[280px]"
              />
            </div>
          </div>

          {/* Story */}
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.25em] text-coral">
              The story
            </p>

            <h2 className="mt-3 font-display text-3xl text-ink sm:text-4xl">
              More than just nails
            </h2>

            <div className="mt-6 space-y-4 text-sm leading-7 text-ink/60 sm:text-base">
              <p>
                Nails By Jade started as a simple dream — to turn a love for
                creativity and nail art into something I could share with
                others.
              </p>

              <p>
                What began as a passion for creating beautiful nail sets has
                grown into a space where creativity, self-expression, and
                self-care come together.
              </p>

              <p>
                I believe nails are more than just a beauty service. They&apos;re
                a small way to treat yourself, express your personality, and
                leave an appointment feeling a little more confident than when
                you arrived.
              </p>

              <p>
                Whether you already know exactly what you want or you&apos;re
                still looking for inspiration, I&apos;d love to create
                something that feels like <span className="font-semibold text-berry">you</span>.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* What to Expect */}
      <section className="bg-nude-light py-20 sm:py-24">
        <div className="mx-auto max-w-6xl px-6">
          <div className="mx-auto max-w-2xl text-center">
            <div className="flex items-center justify-center gap-3 text-coral">
              <Sparkle className="h-4 w-4" />

              <p className="text-xs font-medium uppercase tracking-[0.25em] text-berry/70">
                Your experience
              </p>

              <Sparkle className="h-4 w-4" />
            </div>

            <h2 className="mt-4 font-display text-3xl text-ink sm:text-4xl">
              What you can expect
            </h2>

            <p className="mt-4 text-sm leading-6 text-ink/60">
              Your appointment should feel just as good as the finished set.
            </p>
          </div>

          <div className="mt-12 grid gap-6 sm:grid-cols-3">
            {values.map((value) => (
              <div
                key={value.number}
                className="group relative rounded-[2rem] bg-white p-7 shadow-[0_8px_24px_rgba(122,61,76,0.06)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_14px_30px_rgba(122,61,76,0.10)]"
              >
                {/* Number */}
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold tracking-[0.2em] text-coral">
                    {value.number}
                  </span>

                  <Sparkle className="h-4 w-4 text-coral/40 transition group-hover:scale-125" />
                </div>

                <h3 className="mt-7 font-display text-xl text-ink">
                  {value.title}
                </h3>

                <p className="mt-3 text-sm leading-6 text-ink/60">
                  {value.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Philosophy */}
      <section className="px-6 py-20 sm:py-24">
        <div className="mx-auto max-w-4xl text-center">
          <p className="text-xs font-medium uppercase tracking-[0.25em] text-coral">
            A little reminder
          </p>

          <h2 className="mt-4 font-display text-3xl leading-tight text-ink sm:text-4xl">
            You deserve to feel pretty,
            <br className="hidden sm:block" />
            confident, and completely yourself.
          </h2>

          <p className="mx-auto mt-5 max-w-xl text-sm leading-6 text-ink/60">
            Whether it&apos;s a simple everyday set or something extra for a
            special occasion, every appointment is a chance to slow down,
            have fun, and do something for yourself.
          </p>
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 pb-20">
        <div className="mx-auto max-w-4xl rounded-[2.5rem] bg-berry px-6 py-14 text-center shadow-[0_15px_40px_rgba(122,61,76,0.15)] sm:px-12">
          <div className="mx-auto flex w-fit items-center gap-2 text-white/70">
            <Sparkle className="h-4 w-4" />

            <span className="text-xs font-medium uppercase tracking-[0.25em]">
              Let&apos;s create together
            </span>

            <Sparkle className="h-4 w-4" />
          </div>

          <h2 className="mt-4 font-display text-3xl text-white sm:text-4xl">
            Ready for your next set?
          </h2>

          <p className="mx-auto mt-4 max-w-lg text-sm leading-6 text-white/70">
            Browse our latest work for inspiration or book your appointment
            and let&apos;s bring your nail ideas to life.
          </p>

          <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
            <Link
              href="/gallery"
              className="rounded-full border border-white/20 px-7 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
            >
              View My Nails
            </Link>

            <Link
              href="/booking"
              className="rounded-full bg-white px-7 py-3 text-sm font-semibold text-berry transition hover:bg-nude-light"
            >
              Book an Appointment →
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}