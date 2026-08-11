"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import AdminNav from "@/components/AdminNav";
import type { BlockedDate } from "@/lib/blocked-dates-store";

const WEEKDAY_LABELS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

function toKey(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function startOfDay(d: Date): Date {
  const c = new Date(d);
  c.setHours(0, 0, 0, 0);
  return c;
}

export default function AdminAvailabilityPage() {
  const router = useRouter();
  const [blockedDates, setBlockedDates] = useState<BlockedDate[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [reason, setReason] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const today = startOfDay(new Date());
  const [viewMonth, setViewMonth] = useState(
    new Date(today.getFullYear(), today.getMonth(), 1)
  );

  async function load() {
    setLoading(true);
    const res = await fetch("/api/admin/blocked-dates");
    if (res.status === 401) {
      router.push("/admin/login");
      return;
    }
    const data = await res.json();
    setBlockedDates(data.blockedDates ?? []);
    setLoading(false);
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const blockedMap = useMemo(() => {
    const m = new Map<string, BlockedDate>();
    for (const b of blockedDates) m.set(b.date, b);
    return m;
  }, [blockedDates]);

  function toggleDate(key: string) {
    if (blockedMap.has(key)) return; // already blocked — unblock via the list below
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  }

  async function handleBlock() {
    if (selected.size === 0 || !reason.trim()) return;
    setSubmitting(true);
    setError("");
    try {
      const res = await fetch("/api/admin/blocked-dates", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ dates: Array.from(selected), reason }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Something went wrong.");
      setBlockedDates(data.blockedDates);
      setSelected(new Set());
      setReason("");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleUnblock(id: string) {
    setBlockedDates((prev) => prev.filter((b) => b.id !== id));
    await fetch(`/api/admin/blocked-dates/${id}`, { method: "DELETE" });
  }

  const monthLabel = viewMonth.toLocaleDateString(undefined, {
    month: "long",
    year: "numeric",
  });
  const firstOfMonth = new Date(viewMonth.getFullYear(), viewMonth.getMonth(), 1);
  const startOffset = firstOfMonth.getDay();
  const daysInMonth = new Date(
    viewMonth.getFullYear(),
    viewMonth.getMonth() + 1,
    0
  ).getDate();
  const cells: (Date | null)[] = [
    ...Array(startOffset).fill(null),
    ...Array.from(
      { length: daysInMonth },
      (_, i) => new Date(viewMonth.getFullYear(), viewMonth.getMonth(), i + 1)
    ),
  ];
  const canGoBack =
    viewMonth.getFullYear() > today.getFullYear() ||
    (viewMonth.getFullYear() === today.getFullYear() &&
      viewMonth.getMonth() > today.getMonth());

  return (
    <div className="mx-auto max-w-5xl px-6 py-10">
      <AdminNav />
      <h1 className="mt-6 font-display text-2xl text-ink">Availability</h1>
      <p className="mt-1 text-sm text-ink/60">
        Tap a date to select it, pick multiple, then block them all at once
        with one reason (vacation, fully booked, holiday, etc). Blocked dates
        can&apos;t be picked on the booking page.
      </p>

      <div className="mt-6 grid gap-8 lg:grid-cols-[minmax(0,360px)_1fr]">
        <div className="rounded-2xl border border-ink/10 bg-white p-5">
          <div className="flex items-center justify-between">
            <button
              type="button"
              disabled={!canGoBack}
              onClick={() =>
                setViewMonth((m) => new Date(m.getFullYear(), m.getMonth() - 1, 1))
              }
              aria-label="Previous month"
              className="rounded-full border border-ink/15 px-3 py-1 text-sm font-bold text-ink transition hover:border-coral hover:text-coral disabled:opacity-20"
            >
              &larr;
            </button>
            <p className="font-display text-lg text-ink">{monthLabel}</p>
            <button
              type="button"
              onClick={() =>
                setViewMonth((m) => new Date(m.getFullYear(), m.getMonth() + 1, 1))
              }
              aria-label="Next month"
              className="rounded-full border border-ink/15 px-3 py-1 text-sm font-bold text-ink transition hover:border-coral hover:text-coral"
            >
              &rarr;
            </button>
          </div>

          <div className="mt-4 grid grid-cols-7 gap-1 text-center font-mono text-[11px] uppercase text-ink/40">
            {WEEKDAY_LABELS.map((d) => (
              <span key={d}>{d}</span>
            ))}
          </div>

          <div className="mt-1 grid grid-cols-7 gap-1">
            {cells.map((d, i) => {
              if (!d) return <span key={`empty-${i}`} />;
              const key = toKey(d);
              const isPast = d < today;
              const isBlocked = blockedMap.has(key);
              const isSelected = selected.has(key);
              const disabled = isPast || isBlocked;
              return (
                <button
                  type="button"
                  key={key}
                  disabled={disabled}
                  onClick={() => toggleDate(key)}
                  title={isBlocked ? blockedMap.get(key)?.reason : undefined}
                  className={`aspect-square rounded-full text-xs font-semibold transition ${
                    disabled
                      ? isBlocked
                        ? "cursor-not-allowed bg-ink/10 text-ink/30 line-through"
                        : "cursor-not-allowed text-ink/20"
                      : isSelected
                      ? "bg-coral text-white"
                      : "text-ink hover:bg-nude-light"
                  }`}
                >
                  {d.getDate()}
                </button>
              );
            })}
          </div>

          <div className="mt-5 space-y-3">
            <input
              placeholder="Reason (e.g. Vacation, Fully booked)"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full rounded-xl border border-ink/15 px-4 py-2.5 text-sm focus:border-coral focus:outline-none"
            />
            {error && <p className="text-sm text-berry">{error}</p>}
            <button
              type="button"
              disabled={submitting || selected.size === 0 || !reason.trim()}
              onClick={handleBlock}
              className="w-full rounded-full bg-coral py-2.5 text-sm font-semibold text-white transition disabled:opacity-40"
            >
              {submitting
                ? "Blocking…"
                : `Block ${selected.size || ""} date${selected.size === 1 ? "" : "s"}`.trim()}
            </button>
          </div>
        </div>

        <div className="rounded-2xl border border-ink/10 bg-white p-5">
          <h2 className="font-display text-lg text-ink">Currently unavailable</h2>
          {loading ? (
            <p className="mt-4 text-sm text-ink/50">Loading…</p>
          ) : blockedDates.length === 0 ? (
            <p className="mt-4 text-sm text-ink/50">
              No dates blocked yet — every day is open.
            </p>
          ) : (
            <ul className="mt-4 divide-y divide-ink/10">
              {blockedDates.map((b) => (
                <li key={b.id} className="flex items-center justify-between py-3">
                  <div>
                    <p className="text-sm font-semibold text-ink">{b.date}</p>
                    <p className="text-xs text-ink/50">{b.reason}</p>
                  </div>
                  <button
                    onClick={() => handleUnblock(b.id)}
                    className="rounded-full border border-ink/15 px-3 py-1.5 text-xs font-semibold text-ink hover:border-berry hover:text-berry"
                  >
                    Unblock
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}