"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

export default function AdminLoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Something went wrong.");
      router.push("/admin");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-cream px-6">
      <div className="w-full max-w-sm">
      <div className="text-center">
          <Link href="/" className="inline-flex items-center justify-center">
            <Image
              src="/logo.png"
              alt="Nails By Jade"
              width={90}
              height={56}
              className="mx-auto h-14 w-auto"
              priority
            />
          </Link>
          <p className="mt-3 font-mono text-xs uppercase tracking-[0.2em] text-berry/70">
            Admin
          </p>
          <h1 className="mt-1 font-display text-3xl text-ink">Sign in</h1>
          <p className="mt-2 text-sm text-ink/60">
            Studio dashboard — bookings, gallery &amp; messages.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="mt-8 space-y-4 rounded-2xl border border-ink/10 bg-white p-6"
        >
          <div>
            <label className="mb-1 block text-xs font-semibold text-ink/60">
              Username
            </label>
            <input
              autoFocus
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full rounded-xl border border-ink/15 px-4 py-3 text-sm focus:border-coral focus:outline-none"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold text-ink/60">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-xl border border-ink/15 px-4 py-3 text-sm focus:border-coral focus:outline-none"
            />
          </div>
          {error && <p className="text-sm text-berry">{error}</p>}
          <button
            disabled={submitting || !username || !password}
            type="submit"
            className="w-full rounded-full bg-coral py-3 text-sm font-semibold text-white transition disabled:opacity-40"
          >
            {submitting ? "Signing in…" : "Sign in"}
          </button>
        </form>
      </div>
    </div>
  );
}
