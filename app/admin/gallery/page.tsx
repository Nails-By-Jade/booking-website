"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AdminNav from "@/components/AdminNav";
import type { GalleryPost } from "@/lib/gallery-store";
import { services } from "@/lib/services";

export default function AdminGalleryPage() {
  const router = useRouter();
  const [posts, setPosts] = useState<GalleryPost[]>([]);
  const [loading, setLoading] = useState(true);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [serviceSlug, setServiceSlug] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function checkAuthAndLoad() {
    const session = await fetch("/api/admin/session");
    if (session.status === 401) {
      router.push("/admin/login");
      return;
    }
    const res = await fetch("/api/gallery");
    const data = await res.json();
    setPosts(data.posts ?? []);
    setLoading(false);
  }

  useEffect(() => {

    checkAuthAndLoad();

  }, []);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;
    setFile(f);
    setPreview(URL.createObjectURL(f));
  }

  async function handleAddPost(e: React.FormEvent) {
    e.preventDefault();
    if (!file || !title) {
      setError("A title and an image are required.");
      return;
    }
    setSaving(true);
    setError("");
    try {
      const uploadForm = new FormData();
      uploadForm.append("file", file);
      const uploadRes = await fetch("/api/uploads", {
        method: "POST",
        body: uploadForm,
      });
      const uploadData = await uploadRes.json();
      if (!uploadRes.ok) throw new Error(uploadData.error ?? "Upload failed.");

      const postRes = await fetch("/api/gallery", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          description,
          serviceSlug: serviceSlug || undefined,
          imageUrl: uploadData.url,
        }),
      });
      const postData = await postRes.json();
      if (!postRes.ok) throw new Error(postData.error ?? "Couldn't save post.");

      setPosts((prev) => [postData.post, ...prev]);
      setTitle("");
      setDescription("");
      setServiceSlug("");
      setFile(null);
      setPreview("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    setPosts((prev) => prev.filter((p) => p.id !== id));
    await fetch(`/api/gallery/${id}`, { method: "DELETE" });
  }

  return (
    <div className="min-h-screen bg-cream px-6 py-12">
      <div className="mx-auto max-w-5xl">
        <div>
          <p className=" text-xs uppercase tracking-[0.2em] text-berry/70">
            Admin
          </p>
          <h1 className="mt-1 font-display text-3xl text-ink">
            View My Nails — Gallery
          </h1>
        </div>

        <div className="mt-6">
          <AdminNav />
        </div>

        <form
          onSubmit={handleAddPost}
          className="mt-8 rounded-2xl border border-ink/10 bg-white p-6"
        >
          <h2 className="font-display text-xl text-ink">Post a new design</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-ink/20 px-4 py-8 text-center text-xs text-ink/50 transition hover:border-coral">
                {preview ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={preview}
                    alt="New design preview"
                    className="h-28 w-28 rounded-lg object-cover"
                  />
                ) : (
                  <span>Upload a photo of the finished set</span>
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>
            </div>
            <input
              placeholder="Title (e.g. Chrome French Tips)"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="rounded-xl border border-ink/15 px-4 py-3 text-sm focus:border-coral focus:outline-none"
            />
            <select
              value={serviceSlug}
              onChange={(e) => setServiceSlug(e.target.value)}
              className="rounded-xl border border-ink/15 px-4 py-3 text-sm focus:border-coral focus:outline-none"
            >
              <option value="">Related service (optional)</option>
              {services.map((s) => (
                <option key={s.slug} value={s.slug}>
                  {s.name}
                </option>
              ))}
            </select>
            <textarea
              placeholder="Description (optional)"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={2}
              className="rounded-xl border border-ink/15 px-4 py-3 text-sm focus:border-coral focus:outline-none sm:col-span-2"
            />
          </div>
          {error && <p className="mt-3 text-sm text-berry">{error}</p>}
          <button
            disabled={saving}
            type="submit"
            className="mt-4 rounded-full bg-coral px-6 py-3 text-sm font-semibold text-white transition disabled:opacity-50"
          >
            {saving ? "Posting…" : "Post design"}
          </button>
        </form>

        <div className="mt-10">
          <h2 className="font-display text-xl text-ink">Published designs</h2>
          {loading ? (
            <p className="mt-4 text-sm text-ink/50">Loading…</p>
          ) : posts.length === 0 ? (
            <p className="mt-4 text-sm text-ink/50">
              Nothing posted yet — add your first design above.
            </p>
          ) : (
            <div className="mt-4 grid gap-5 sm:grid-cols-3 lg:grid-cols-4">
              {posts.map((p) => (
                <div
                  key={p.id}
                  className="overflow-hidden rounded-2xl border border-ink/10 bg-white"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={p.imageUrl}
                    alt={p.title}
                    className="h-40 w-full object-cover"
                  />
                  <div className="p-3">
                    <p className="font-display text-sm text-ink">{p.title}</p>
                    {p.description && (
                      <p className="mt-1 text-xs text-ink/60">{p.description}</p>
                    )}
                    <button
                      onClick={() => handleDelete(p.id)}
                      className="mt-3 text-xs font-semibold text-berry hover:underline"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
