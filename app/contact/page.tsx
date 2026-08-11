"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Sparkle from "@/components/Sparkle";
import {
  IconInstagram,
  IconMapPin,
  IconCalendar,
} from "@/components/Icons";

export default function ContactPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    setSubmitting(true);
    setError("");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error ?? "Something went wrong.");
      }

      setSent(true);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong."
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Hero */}
      <section className="bg-nude-light px-6 py-20 sm:py-24">
        <div className="mx-auto max-w-3xl text-center">
          <div className="flex items-center justify-center gap-3 text-coral">
            <Sparkle className="h-4 w-4" />

            <p className="text-xs font-medium uppercase tracking-[0.25em] text-berry/70">
              Get In Touch
            </p>

            <Sparkle className="h-4 w-4" />
          </div>

          <h1 className="mt-5 font-display text-4xl text-ink sm:text-5xl">
            Let&apos;s chat
          </h1>

          <p className="mx-auto mt-5 max-w-xl text-sm leading-6 text-ink/60 sm:text-base">
            Have a question about our services, need help choosing a set, or
            have an idea you&apos;d love to bring to life? Send us a message
            and we&apos;ll get back to you soon. 
          </p>
        </div>
      </section>

      {/* Contact Content */}
      <section className="mx-auto max-w-6xl px-6 py-20">
        <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          
          {/* Form */}
          {sent ? (
            <div className="flex min-h-[500px] items-center justify-center rounded-[2rem] bg-white p-8 text-center shadow-[0_8px_24px_rgba(122,61,76,0.07)]">
              <div className="max-w-md">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-nude-light text-coral">
                  <Sparkle className="h-6 w-6" />
                </div>

                <h2 className="mt-6 font-display text-2xl text-ink">
                  Message sent! ♡
                </h2>

                <p className="mt-3 text-sm leading-6 text-ink/60">
                  Thanks for reaching out! We&apos;ve received your message
                  and will get back to you as soon as we can.
                </p>

                <button
                  onClick={() => {
                    setSent(false);
                    setForm({
                      name: "",
                      email: "",
                      message: "",
                    });
                  }}
                  className="mt-7 rounded-full border border-berry/20 px-6 py-3 text-sm font-semibold text-berry transition hover:border-coral hover:text-coral"
                >
                  Send another message
                </button>
              </div>
            </div>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="rounded-[2rem] bg-white p-7 shadow-[0_8px_24px_rgba(122,61,76,0.07)] sm:p-9"
            >
              <div className="mb-7">
                <p className="text-xs font-medium uppercase tracking-[0.2em] text-coral">
                  Send a message
                </p>

                <h2 className="mt-2 font-display text-2xl text-ink">
                  How can we help?
                </h2>

                <p className="mt-2 text-sm text-ink/60">
                  Fill out the form below and we&apos;ll get back to you.
                </p>
              </div>

              <div className="space-y-5">
                {/* Name */}
                <div>
                  <label
                    htmlFor="name"
                    className="mb-2 block text-sm font-medium text-ink"
                  >
                    Full name
                  </label>

                  <input
                    id="name"
                    type="text"
                    placeholder="Your name"
                    value={form.name}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        name: e.target.value,
                      })
                    }
                    required
                    className="w-full rounded-2xl border border-ink/10 bg-nude-light/40 px-4 py-3 text-sm text-ink outline-none transition placeholder:text-ink/30 focus:border-coral focus:bg-white"
                  />
                </div>

                {/* Email */}
                <div>
                  <label
                    htmlFor="email"
                    className="mb-2 block text-sm font-medium text-ink"
                  >
                    Email address
                  </label>

                  <input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    value={form.email}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        email: e.target.value,
                      })
                    }
                    required
                    className="w-full rounded-2xl border border-ink/10 bg-nude-light/40 px-4 py-3 text-sm text-ink outline-none transition placeholder:text-ink/30 focus:border-coral focus:bg-white"
                  />
                </div>

                {/* Message */}
                <div>
                  <label
                    htmlFor="message"
                    className="mb-2 block text-sm font-medium text-ink"
                  >
                    Message
                  </label>

                  <textarea
                    id="message"
                    placeholder="Tell us what you're thinking..."
                    value={form.message}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        message: e.target.value,
                      })
                    }
                    rows={6}
                    required
                    className="w-full resize-none rounded-2xl border border-ink/10 bg-nude-light/40 px-4 py-3 text-sm text-ink outline-none transition placeholder:text-ink/30 focus:border-coral focus:bg-white"
                  />
                </div>

                {error && (
                  <div className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">
                    {error}
                  </div>
                )}

                <button
                  disabled={
                    submitting ||
                    !form.name ||
                    !form.email ||
                    !form.message
                  }
                  type="submit"
                  className="flex w-full items-center justify-center rounded-full bg-coral py-3.5 text-sm font-semibold text-white shadow-sm shadow-coral/20 transition hover:bg-coral-dark disabled:cursor-not-allowed disabled:opacity-40"
                >
                  {submitting ? "Sending..." : "Send Message →"}
                </button>
              </div>
            </form>
          )}

          {/* Contact Information */}
          <div className="space-y-5">
            {/* Opening Hours */}
            <div className="rounded-[2rem] bg-nude-light p-7">
              <div className="flex items-start gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white text-coral">
                  <IconCalendar className="h-5 w-5" />
                </div>

                <div>
                  <p className="font-display text-lg text-ink">
                    Opening Hours
                  </p>

                  <p className="mt-1 text-sm text-ink/60">
                    10:00 AM – 6:00 PM
                  </p>

                  <p className="mt-2 text-xs uppercase tracking-[0.12em] text-ink/40">
                    By appointment
                  </p>
                </div>
              </div>
            </div>

            {/* Instagram */}
            <div className="rounded-[2rem] bg-nude-light p-7">
              <div className="flex items-start gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white text-coral">
                  <IconInstagram className="h-5 w-5" />
                </div>

                <div>
                  <p className="font-display text-lg text-ink">
                    Follow us
                  </p>

                  <a
                    href="https://www.instagram.com/nails.by__jade/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-1 block text-sm text-ink/60 transition hover:text-coral"
                  >
                    @nails.by__jade
                  </a>

                  <p className="mt-2 text-xs text-ink/40">
                    Follow along for our latest nail sets.
                  </p>
                </div>
              </div>
            </div>

            {/* Location */}
            <div className="rounded-[2rem] bg-nude-light p-7">
              <div className="flex items-start gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white text-coral">
                  <IconMapPin className="h-5 w-5" />
                </div>

                <div>
                  <p className="font-display text-lg text-ink">
                    Find us
                  </p>

                  <p className="mt-1 text-sm leading-6 text-ink/60">
                    Purok 2, Brgy. Bunggo,
                    <br />
                    Calamba, Laguna
                  </p>

                  <p className="mt-3 text-xs uppercase tracking-[0.12em] text-ink/40">
                    Calamba &amp; Manila based
                  </p>
                </div>
              </div>
            </div>

          
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}