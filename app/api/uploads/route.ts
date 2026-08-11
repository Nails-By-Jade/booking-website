import { NextRequest, NextResponse } from "next/server";
import { put } from "@vercel/blob";

const MAX_BYTES = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
]);

/**
 * Handles both customer inspo-photo uploads (booking step 3) and admin
 * gallery-post images. Deliberately public — customers need to upload
 * before they're "logged in" anywhere.
 *
 * Files are stored in Vercel Blob (persistent, CDN-backed). Requires the
 * BLOB_READ_WRITE_TOKEN env var — set automatically when you add the Blob
 * store in your Vercel project (Storage tab), or manually in .env.local
 * for local dev.
 */
export async function POST(request: NextRequest) {
  const form = await request.formData();
  const file = form.get("file");

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "No file uploaded." }, { status: 400 });
  }
  if (!ALLOWED_TYPES.has(file.type)) {
    return NextResponse.json(
      { error: "Please upload a JPG, PNG, WEBP, or GIF." },
      { status: 400 }
    );
  }
  if (file.size > MAX_BYTES) {
    return NextResponse.json(
      { error: "That file is too large (5MB max)." },
      { status: 400 }
    );
  }

  const ext = file.type.split("/")[1];
  const filename = `${crypto.randomUUID()}.${ext}`;

  const blob = await put(`uploads/${filename}`, file, {
    access: "public",
    contentType: file.type,
  });

  return NextResponse.json({ url: blob.url });
}
