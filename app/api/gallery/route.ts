import { NextRequest, NextResponse } from "next/server";
import { createGalleryPost, getAllGalleryPosts } from "@/lib/gallery-store";
import { verifySessionToken, SESSION_COOKIE_NAME } from "@/lib/auth";

// Public: anyone can view "View My Nails" designs.
export async function GET() {
  const posts = await getAllGalleryPosts();
  return NextResponse.json({ posts });
}

// Admin-only: publish a new design post.
export async function POST(request: NextRequest) {
  const token = request.cookies.get(SESSION_COOKIE_NAME)?.value;
  if (!verifySessionToken(token)) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const { title, imageUrl, description, serviceSlug } = await request.json();
  if (!title || !imageUrl) {
    return NextResponse.json(
      { error: "Title and image are required." },
      { status: 400 }
    );
  }

  const post = await createGalleryPost({ title, imageUrl, description, serviceSlug });
  return NextResponse.json({ post }, { status: 201 });
}
