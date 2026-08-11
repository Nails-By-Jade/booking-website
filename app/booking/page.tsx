"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Calendar from "@/components/Calendar";
import { services } from "@/lib/services";
import { formatPHP, formatTime12h } from "@/lib/format";
import { buildTimeSlots } from "@/lib/schedule";

function BookingFlow() {
  const searchParams = useSearchParams();
  const preselected = searchParams.get("service") ?? "";

  const [step, setStep] = useState(1);
  const [serviceSlug, setServiceSlug] = useState(preselected);
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [takenSlots, setTakenSlots] = useState<string[]>([]);
  const [form, setForm] = useState({ name: "", phone: "", email: "", notes: "" });
  const [inspoFile, setInspoFile] = useState<File | null>(null);
  const [inspoPreview, setInspoPreview] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [confirmed, setConfirmed] = useState(false);

  const service = services.find((s) => s.slug === serviceSlug);
  const slots = useMemo(
    () => (service ? buildTimeSlots(service.duration) : []),
    [service]
  );

  useEffect(() => {
    if (!date || !serviceSlug) return;
    fetch(`/api/availability?date=${date}&service=${serviceSlug}`)
      .then((r) => r.json())
      .then((data) => setTakenSlots(data.takenSlots ?? []))
      .catch(() => setTakenSlots([]));
  }, [date, serviceSlug]);

  function handleInspoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setInspoFile(file);
    setInspoPreview(URL.createObjectURL(file));
  }

  async function handleSubmit() {
    setSubmitting(true);
    setError("");
    try {
      let inspoImageUrl: string | undefined;
      if (inspoFile) {
        const uploadForm = new FormData();
        uploadForm.append("file", inspoFile);
        const uploadRes = await fetch("/api/uploads", {
          method: "POST",
          body: uploadForm,
        });
        const uploadData = await uploadRes.json();
        if (!uploadRes.ok) {
          throw new Error(uploadData.error ?? "Couldn't upload your photo.");
        }
        inspoImageUrl = uploadData.url;
      }

      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ serviceSlug, date, time, ...form, inspoImageUrl }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Something went wrong.");
      setConfirmed(true);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  }

  if (confirmed) {
    return (
      <div className="mx-auto max-w-lg px-6 py-24 text-center">
        <span className="swatch mx-auto mb-6 block h-16 w-16 bg-coral" />
        <h1 className="font-display text-3xl text-ink">You&apos;re booked!</h1>
        <p className="mt-3 text-ink/70">
        {service?.name} on {date} at {formatTime12h(time)}. We&apos;ll text you a reminder
          the day before.
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-6 py-16">
      <p className="font-mono text-xs uppercase tracking-[0.2em] text-berry/70">
        Step {step} of 4
      </p>
      <h1 className="mt-2 font-display text-3xl text-ink">Book an appointment</h1>

      {/* Step 1: Service */}
      {step === 1 && (
        <div className="mt-8 space-y-3">
          {services.map((s) => (
            <button
              key={s.slug}
              onClick={() => setServiceSlug(s.slug)}
              className={`flex w-full items-center gap-4 rounded-2xl border p-4 text-left transition ${
                serviceSlug === s.slug
                  ? "border-coral bg-nude-light"
                  : "border-ink/10 hover:border-coral/50"
              }`}
            >
              <span
                className="swatch h-9 w-9 shrink-0"
                style={{ backgroundColor: s.swatch }}
              />
              <span className="flex-1">
                <span className="block font-display text-lg text-ink">{s.name}</span>
                <span className="block text-xs text-ink/50">{s.duration} min</span>
              </span>
              <span className="font-mono text-sm font-semibold text-berry">
              {s.priceLabel ? (
                  s.priceLabel
                ) : (
                  <>
                    {s.startingAt && (
                      <span className="text-xs font-normal text-ink/50">starts at </span>
                    )}
                    {formatPHP(s.price)}
                  </>
                )}
              </span>
            </button>
          ))}
          <button
            disabled={!serviceSlug}
            onClick={() => setStep(2)}
            className="mt-4 w-full rounded-full bg-coral py-3 text-sm font-semibold text-white transition disabled:opacity-30"
          >
            Continue
          </button>
        </div>
      )}

      {/* Step 2: Date & time */}
      {step === 2 && (
        <div className="mt-8">
          <p className="mb-2 text-sm font-semibold text-ink">Choose a date</p>
          <Calendar
            selected={date}
            onSelect={(d) => {
              setDate(d);
              setTime("");
            }}
          />

          {date && (
            <>
              <p className="mb-2 mt-8 text-sm font-semibold text-ink">
                Choose a time
              </p>
              <div className="grid grid-cols-4 gap-2 sm:grid-cols-6">
                {slots.map((s) => {
                  const isTaken = takenSlots.includes(s);
                  return (
                    <button
                      key={formatTime12h(s)}
                      disabled={isTaken}
                      onClick={() => setTime(s)}
                      className={`nail-tip py-2 text-xs font-mono transition ${
                        isTaken
                          ? "cursor-not-allowed bg-ink/5 text-ink/25 line-through"
                          : time === s
                          ? "bg-coral text-white"
                          : "bg-nude-light text-ink hover:bg-nude"
                      }`}
                    >
                      {formatTime12h(s)}
                    </button>
                  );
                })}
              </div>
            </>
          )}

          <div className="mt-8 flex gap-3">
            <button
              onClick={() => setStep(1)}
              className="rounded-full border border-ink/15 px-6 py-3 text-sm font-semibold text-ink"
            >
              Back
            </button>
            <button
              disabled={!date || !time}
              onClick={() => setStep(3)}
              className="flex-1 rounded-full bg-coral py-3 text-sm font-semibold text-white transition disabled:opacity-30"
            >
              Continue
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Contact info */}
      {step === 3 && (
        <div className="mt-8 space-y-4">
          <input
            placeholder="Full name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="w-full rounded-xl border border-ink/15 px-4 py-3 text-sm focus:border-coral focus:outline-none"
          />
          <input
            placeholder="Phone number"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            className="w-full rounded-xl border border-ink/15 px-4 py-3 text-sm focus:border-coral focus:outline-none"
          />
          <input
            placeholder="Email"
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="w-full rounded-xl border border-ink/15 px-4 py-3 text-sm focus:border-coral focus:outline-none"
          />
          <textarea
            placeholder="Notes (optional) — color ideas, allergies, etc."
            value={form.notes}
            onChange={(e) => setForm({ ...form, notes: e.target.value })}
            rows={3}
            className="w-full rounded-xl border border-ink/15 px-4 py-3 text-sm focus:border-coral focus:outline-none"
          />
          <div>
            <p className="mb-2 text-sm font-semibold text-ink">
              Inspo photo{" "}
              <span className="font-normal text-ink/40">(optional)</span>
            </p>
            <label className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-ink/20 px-4 py-6 text-center text-xs text-ink/50 transition hover:border-coral">
              {inspoPreview ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={inspoPreview}
                  alt="Inspiration preview"
                  className="h-24 w-24 rounded-lg object-cover"
                />
              ) : (
                <span>Upload a photo of the design you want</span>
              )}
              <input
                type="file"
                accept="image/*"
                onChange={handleInspoChange}
                className="hidden"
              />
            </label>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => setStep(2)}
              className="rounded-full border border-ink/15 px-6 py-3 text-sm font-semibold text-ink"
            >
              Back
            </button>
            <button
              disabled={!form.name || !form.phone || !form.email}
              onClick={() => setStep(4)}
              className="flex-1 rounded-full bg-coral py-3 text-sm font-semibold text-white transition disabled:opacity-30"
            >
              Review
            </button>
          </div>
        </div>
      )}

      {/* Step 4: Confirm */}
      {step === 4 && service && (
        <div className="mt-8">
          <div className="rounded-2xl border border-ink/10 bg-white p-6 text-sm">
            <div className="flex justify-between py-2">
              <span className="text-ink/50">Service</span>
              <span className="font-semibold">{service.name}</span>
            </div>
            <div className="flex justify-between border-t border-ink/10 py-2">
              <span className="text-ink/50">When</span>
              <span className="font-semibold">
              {date} at {formatTime12h(time)}
              </span>
            </div>
            <div className="flex justify-between border-t border-ink/10 py-2">
              <span className="text-ink/50">Name</span>
              <span className="font-semibold">{form.name}</span>
            </div>
            <div className="flex justify-between border-t border-ink/10 py-2">
              <span className="text-ink/50">Price</span>
              <span className="font-semibold text-berry">
              {service.priceLabel ? (
                  service.priceLabel
                ) : (
                  <>
                    {service.startingAt && (
                      <span className="text-xs font-normal text-ink/50">starts at </span>
                    )}
                    {formatPHP(service.price)}
                  </>
                )}
              </span>
            </div>
          </div>
          {service.startingAt && (
            <p className="mt-3 text-xs text-ink/50">
              Final price depends on the design — your tech will confirm
              before starting.
            </p>
          )}
          {error && <p className="mt-4 text-sm text-berry">{error}</p>}
          <div className="mt-8 flex gap-3">
            <button
              onClick={() => setStep(3)}
              className="rounded-full border border-ink/15 px-6 py-3 text-sm font-semibold text-ink"
            >
              Back
            </button>
            <button
              disabled={submitting}
              onClick={handleSubmit}
              className="flex-1 rounded-full bg-coral py-3 text-sm font-semibold text-white transition disabled:opacity-50"
            >
              {submitting ? "Booking…" : "Confirm booking"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function BookingPage() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <Suspense fallback={null}>
        <BookingFlow />
      </Suspense>
      <Footer />
    </div>
  );
}
