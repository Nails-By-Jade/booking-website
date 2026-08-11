import { NextRequest, NextResponse } from "next/server";
import { deleteGalleryPost } from "@/lib/gallery-store";
import { verifySessionToken, SESSION_COOKIE_NAME } from "@/lib/auth";

// Admin-only: remove a design post.
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const token = request.cookies.get(SESSION_COOKIE_NAME)?.value;
  if (!verifySessionToken(token)) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const { id } = await params;
  const removed = deleteGalleryPost(id);
  if (!removed) {
    return NextResponse.json({ error: "Post not found." }, { status: 404 });
  }

  return NextResponse.json({ ok: true });
}
