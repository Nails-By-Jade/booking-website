"use client";

import { useEffect, useState } from "react";

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

export default function Calendar({
  selected,
  onSelect,
}: {
  selected: string;
  onSelect: (date: string) => void;
}) {
  const today = startOfDay(new Date());
  const [viewMonth, setViewMonth] = useState(
    new Date(today.getFullYear(), today.getMonth(), 1)
  );
  const [blockedDates, setBlockedDates] = useState<Record<string, string>>({});

  useEffect(() => {
    fetch("/api/blocked-dates")
      .then((r) => r.json())
      .then((data) => {
        const map: Record<string, string> = {};
        for (const b of data.blockedDates ?? []) map[b.date] = b.reason;
        setBlockedDates(map);
      })
      .catch(() => setBlockedDates({}));
  }, []);

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

  function changeMonth(delta: number) {
    setViewMonth((m) => new Date(m.getFullYear(), m.getMonth() + delta, 1));
  }

  return (
    <div className="rounded-2xl border border-ink/10 bg-white p-5">
      <div className="flex items-center justify-between">
        <button
          type="button"
          disabled={!canGoBack}
          onClick={() => changeMonth(-1)}
          aria-label="Previous month"
          className="rounded-full border border-ink/15 px-3 py-1 text-sm font-bold text-ink transition hover:border-coral hover:text-coral disabled:opacity-20 disabled:hover:border-ink/15 disabled:hover:text-ink"
        >
          &larr;
        </button>
        <p className="font-display text-lg text-ink">{monthLabel}</p>
        <button
          type="button"
          onClick={() => changeMonth(1)}
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
          const isBlocked = key in blockedDates;
          const disabled = isPast || isBlocked;
          const isSelected = selected === key;
          return (
            <button
              type="button"
              key={key}
              disabled={disabled}
              onClick={() => onSelect(key)}
              title={isBlocked ? blockedDates[key] : undefined}
              className={`aspect-square rounded-full text-xs font-semibold transition ${
                disabled
                  ? "cursor-not-allowed text-ink/20"
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
    </div>
  );
}
