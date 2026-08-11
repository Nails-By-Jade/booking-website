import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads");
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
 * Files are written to /public/uploads on local disk — like
 * bookings-store.ts, this WILL NOT persist on Vercel's read-only
 * filesystem in production. Point this at S3/Cloudinary/Vercel Blob
 * before you deploy there.
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

  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
  const ext = file.type.split("/")[1];
  const filename = `${crypto.randomUUID()}.${ext}`;
  const buffer = Buffer.from(await file.arrayBuffer());
  fs.writeFileSync(path.join(UPLOAD_DIR, filename), buffer);

  return NextResponse.json({ url: `/uploads/${filename}` });
}
