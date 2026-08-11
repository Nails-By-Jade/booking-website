"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AdminNav from "@/components/AdminNav";
import type { ContactMessage } from "@/lib/messages-store";

export default function AdminMessagesPage() {
  const router = useRouter();
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    const res = await fetch("/api/contact");
    if (res.status === 401) {
      router.push("/admin/login");
      return;
    }
    const data = await res.json();
    setMessages(data.messages ?? []);
    setLoading(false);
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="min-h-screen bg-cream px-6 py-12">
      <div className="mx-auto max-w-4xl">
        <div className="flex items-center justify-between">
          <div>
            <p className=" text-xs uppercase tracking-[0.2em] text-berry/70">
              Admin
            </p>
            <h1 className="mt-1 font-display text-3xl text-ink">Messages</h1>
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

        <div className="mt-8 space-y-4">
          {loading ? (
            <p className="text-sm text-ink/50">Loading…</p>
          ) : messages.length === 0 ? (
            <p className="rounded-2xl border border-ink/10 bg-white p-8 text-center text-sm text-ink/50">
              No messages yet.
            </p>
          ) : (
            messages.map((m) => (
              <div
                key={m.id}
                className="rounded-2xl border border-ink/10 bg-white p-5"
              >
                <div className="flex items-center justify-between">
                  <p className="font-display text-base text-ink">{m.name}</p>
                  <p className=" text-xs text-ink/40">
                    {new Date(m.createdAt).toLocaleString()}
                  </p>
                </div>
                <p className="text-xs text-berry">{m.email}</p>
                <p className="mt-3 text-sm text-ink/70">{m.message}</p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
