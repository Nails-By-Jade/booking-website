"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { Booking, BookingStatus } from "@/lib/bookings-store";
import { formatPHP } from "@/lib/format";
import AdminNav from "@/components/AdminNav";

const STATUS_STYLES: Record<BookingStatus, string> = {
  pending: "bg-gold/20 text-[#8a6a2c]",
  confirmed: "bg-coral/15 text-coral-dark",
  completed: "bg-green-100 text-green-700",
  cancelled: "bg-ink/10 text-ink/40 line-through",
};

const FILTERS: ("all" | BookingStatus)[] = [
  "all",
  "pending",
  "confirmed",
  "completed",
  "cancelled",
];

type View = "bookings" | "archive";

export default function AdminPage() {
  const router = useRouter();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | BookingStatus>("all");
  const [view, setView] = useState<View>("bookings");

  async function load() {
    setLoading(true);
    const res = await fetch("/api/bookings");
    if (res.status === 401) {
      router.push("/admin/login");
      return;
    }
    const data = await res.json();
    setBookings(data.bookings ?? []);
    setLoading(false);
  }

  useEffect(() => {

    load();

  }, []);

  async function setStatus(id: string, status: BookingStatus) {
    setBookings((prev) =>
      prev.map((b) => (b.id === id ? { ...b, status } : b))
    );
    await fetch(`/api/bookings/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
  }

  async function removeBooking(id: string) {
    if (!confirm("Delete this booking permanently? This can't be undone.")) {
      return;
    }
    setBookings((prev) => prev.filter((b) => b.id !== id));
    await fetch(`/api/bookings/${id}`, { method: "DELETE" });
  }

  // "Archive" = clients whose appointment is done, most recent first.
  const archived = bookings
    .filter((b) => b.status === "completed")
    .sort((a, b) => (b.date + b.time).localeCompare(a.date + a.time));

  const activeBookings = bookings.filter((b) => b.status !== "completed");
  const visible = activeBookings.filter(
    (b) => filter === "all" || b.status === filter
  );

  const now = new Date();
  const todayKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(
    2,
    "0"
  )}-${String(now.getDate()).padStart(2, "0")}`;

  const stats = {
    total: bookings.length,
    pending: bookings.filter((b) => b.status === "pending").length,
    today: bookings.filter((b) => b.date === todayKey && b.status !== "cancelled")
      .length,
    // Money actually earned
    totalIncome: bookings
      .filter((b) => b.status === "completed")
      .reduce((sum, b) => sum + b.price, 0),
    // Value of everything booked in for today 
    todayTotal: bookings
      .filter((b) => b.date === todayKey && b.status !== "cancelled")
      .reduce((sum, b) => sum + b.price, 0),
    // Confirmed/pending appointments 
    upcoming: bookings.filter(
      (b) =>
        b.date >= todayKey &&
        (b.status === "pending" || b.status === "confirmed")
    ).length,
  };

  return (
    <div className="min-h-screen bg-cream px-6 py-12">
      <div className="mx-auto max-w-5xl">
        <div className="flex items-center justify-between">
          <div>
            <p className=" text-xs uppercase tracking-[0.2em] text-berry/70">
              Admin
            </p>
            <h1 className="mt-1 font-display text-3xl text-ink">Bookings</h1>
          </div>
          <button
            onClick={load}
            className="rounded-full border border-ink/15 px-4 py-2 text-xs font-semibold text-ink hover:border-coral hover:text-coral"
          >
            Refresh
          </button>
        </div>

        <div className="mt-6">
          <AdminNav />
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-ink/10 bg-white p-5">
            <p className=" text-xs uppercase tracking-wide text-ink/40">
              Total bookings
            </p>
            <p className="mt-1 font-display text-3xl text-ink">{stats.total}</p>
          </div>
          <div className="rounded-2xl border border-ink/10 bg-white p-5">
            <p className="text-xs uppercase tracking-wide text-ink/40">
              Awaiting confirmation
            </p>
            <p className="mt-1 font-display text-3xl text-ink">{stats.pending}</p>
          </div>
          <div className="rounded-2xl border border-ink/10 bg-white p-5">
            <p className=" text-xs uppercase tracking-wide text-ink/40">
              Today&apos;s appointments
            </p>
            <p className="mt-1 font-display text-3xl text-ink">{stats.today}</p>
          </div>
          <div className="rounded-2xl border border-ink/10 bg-white p-5">
            <p className="text-xs uppercase tracking-wide text-ink/40">
              Total income
            </p>
            <p className="mt-1 font-display text-3xl text-berry">
              {formatPHP(stats.totalIncome)}
            </p>
            <p className="mt-1 text-xs text-ink/40">From completed appointments</p>
          </div>
          <div className="rounded-2xl border border-ink/10 bg-white p-5">
            <p className="text-xs uppercase tracking-wide text-ink/40">
              Booked for today
            </p>
            <p className="mt-1 font-display text-3xl text-berry">
              {formatPHP(stats.todayTotal)}
            </p>
          </div>
          <div className="rounded-2xl border border-ink/10 bg-white p-5">
            <p className="text-xs uppercase tracking-wide text-ink/40">
              Incoming bookings
            </p>
            <p className="mt-1 font-display text-3xl text-ink">{stats.upcoming}</p>
            <p className="mt-1 text-xs text-ink/40">Pending + confirmed, upcoming</p>
          </div>
        </div>

        <div className="mt-8 flex gap-2">
          <button
            onClick={() => setView("bookings")}
            className={`nail-tip px-5 py-2 text-xs font-semibold transition ${
              view === "bookings" ? "bg-coral text-white" : "bg-white text-ink/60"
            }`}
          >
            Bookings
          </button>
          <button
            onClick={() => setView("archive")}
            className={`nail-tip px-5 py-2 text-xs font-semibold transition ${
              view === "archive" ? "bg-coral text-white" : "bg-white text-ink/60"
            }`}
          >
            Archive ({archived.length})
          </button>
        </div>

        {view === "bookings" ? (
          <>
            <div className="mt-6 flex flex-wrap gap-2">
              {FILTERS.map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`nail-tip px-4 py-1.5 text-xs font-semibold capitalize transition ${
                    filter === f ? "bg-coral text-white" : "bg-white text-ink/60"
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>

            <div className="mt-8 overflow-x-auto rounded-2xl border border-ink/10 bg-white">
              {loading ? (
                <p className="p-8 text-center text-sm text-ink/50">Loading…</p>
              ) : visible.length === 0 ? (
                <p className="p-8 text-center text-sm text-ink/50">
                  No bookings here yet.
                </p>
              ) : (
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="border-b border-ink/10 text-xs uppercase tracking-wide text-ink/40">
                      <th className="px-5 py-3">Client</th>
                      <th className="px-5 py-3">Service</th>
                      <th className="px-5 py-3">When</th>
                      <th className="px-5 py-3">Contact</th>
                      <th className="px-5 py-3">Inspo</th>
                      <th className="px-5 py-3">Status</th>
                      <th className="px-5 py-3">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {visible.map((b) => (
                      <tr key={b.id} className="border-b border-ink/5 last:border-0">
                        <td className="px-5 py-4 font-medium">{b.name}</td>
                        <td className="px-5 py-4">
                          {b.serviceName}
                          <span className="ml-2  text-xs text-berry">
                            {formatPHP(b.price)}
                          </span>
                        </td>
                        <td className="px-5 py-4  text-xs">
                          {b.date} · {b.time}
                        </td>
                        <td className="px-5 py-4 text-xs text-ink/60">
                          <div>{b.phone}</div>
                          <div>{b.email}</div>
                          {b.igUsername && (
                            <a
                              href={`https://instagram.com/${b.igUsername.replace(/^@/, "")}`}
                              target="_blank"
                              rel="noreferrer"
                              className="text-coral hover:underline"
                            >
                              @{b.igUsername.replace(/^@/, "")}
                            </a>
                          )}
                        </td>
                        <td className="px-5 py-4">
                          {b.inspoImageUrl ? (
                            <a
                              href={b.inspoImageUrl}
                              target="_blank"
                              rel="noreferrer"
                            >
                             
                              <img
                                src={b.inspoImageUrl}
                                alt={`${b.name}'s inspo photo`}
                                className="h-10 w-10 rounded-lg object-cover"
                              />
                            </a>
                          ) : (
                            <span className="text-xs text-ink/30">—</span>
                          )}
                        </td>
                        <td className="px-5 py-4">
                          <span
                            className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${STATUS_STYLES[b.status]}`}
                          >
                            {b.status}
                          </span>
                        </td>
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-2">
                            <select
                              value={b.status}
                              onChange={(e) =>
                                setStatus(b.id, e.target.value as BookingStatus)
                              }
                              className="rounded-lg border border-ink/15 px-2 py-1 text-xs"
                            >
                              <option value="pending">Pending</option>
                              <option value="confirmed">Confirmed</option>
                              <option value="completed">Completed</option>
                              <option value="cancelled">Cancelled</option>
                            </select>
                            <button
                              onClick={() => removeBooking(b.id)}
                              title="Delete permanently"
                              className="rounded-lg border border-ink/15 px-2 py-1 text-xs font-semibold text-berry hover:border-berry"
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </>
        ) : (
          <div className="mt-6 overflow-x-auto rounded-2xl border border-ink/10 bg-white">
            <p className="border-b border-ink/10 px-5 py-4 text-xs text-ink/50">
              Clients whose appointment is done. Delete an entry to remove it
              for good.
            </p>
            {loading ? (
              <p className="p-8 text-center text-sm text-ink/50">Loading…</p>
            ) : archived.length === 0 ? (
              <p className="p-8 text-center text-sm text-ink/50">
                No completed appointments yet.
              </p>
            ) : (
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-ink/10 text-xs uppercase tracking-wide text-ink/40">
                    <th className="px-5 py-3">Client</th>
                    <th className="px-5 py-3">Service</th>
                    <th className="px-5 py-3">When</th>
                    <th className="px-5 py-3">Contact</th>
                    <th className="px-5 py-3">Paid</th>
                    <th className="px-5 py-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {archived.map((b) => (
                    <tr key={b.id} className="border-b border-ink/5 last:border-0">
                      <td className="px-5 py-4 font-medium">{b.name}</td>
                      <td className="px-5 py-4">{b.serviceName}</td>
                      <td className="px-5 py-4 text-xs">
                        {b.date} · {b.time}
                      </td>
                      <td className="px-5 py-4 text-xs text-ink/60">
                        <div>{b.phone}</div>
                        <div>{b.email}</div>
                        {b.igUsername && (
                          <a
                            href={`https://instagram.com/${b.igUsername.replace(/^@/, "")}`}
                            target="_blank"
                            rel="noreferrer"
                            className="text-coral hover:underline"
                          >
                            @{b.igUsername.replace(/^@/, "")}
                          </a>
                        )}
                      </td>
                      <td className="px-5 py-4 text-xs text-berry">
                        {formatPHP(b.price)}
                      </td>
                      <td className="px-5 py-4">
                        <button
                          onClick={() => removeBooking(b.id)}
                          title="Delete permanently"
                          className="rounded-lg border border-ink/15 px-3 py-1.5 text-xs font-semibold text-berry hover:border-berry"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
