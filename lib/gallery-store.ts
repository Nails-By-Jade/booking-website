import fs from "fs";
import path from "path";

/**
 * "View My Nails" gallery data store.
 *
 * Same file-on-disk approach as bookings-store.ts — fine for local dev,
 * won't persist on Vercel's read-only filesystem in production. Swap the
 * internals for a DB query later; getAllGalleryPosts/createGalleryPost/
 * deleteGalleryPost is the only contract the rest of the app depends on.
 */

export type GalleryPost = {
  id: string;
  title: string;
  imageUrl: string;
  description?: string;
  serviceSlug?: string;
  createdAt: string;
};

const DATA_FILE = path.join(process.cwd(), "data", "gallery.json");

function readFile(): GalleryPost[] {
  try {
    const raw = fs.readFileSync(DATA_FILE, "utf-8");
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

function writeFile(posts: GalleryPost[]) {
  fs.mkdirSync(path.dirname(DATA_FILE), { recursive: true });
  fs.writeFileSync(DATA_FILE, JSON.stringify(posts, null, 2), "utf-8");
}

export function getAllGalleryPosts(): GalleryPost[] {
  return readFile().sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export function createGalleryPost(
  input: Omit<GalleryPost, "id" | "createdAt">
): GalleryPost {
  const posts = readFile();

  const post: GalleryPost = {
    ...input,
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
  };

  posts.push(post);
  writeFile(posts);
  return post;
}

export function deleteGalleryPost(id: string): boolean {
  const posts = readFile();
  const next = posts.filter((p) => p.id !== id);
  if (next.length === posts.length) return false;
  writeFile(next);
  return true;
}
