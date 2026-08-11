import { sql } from "./db";

/**
 * "View My Nails" gallery data store — backed by Neon Postgres (see lib/db.ts).
 */

export type GalleryPost = {
  id: string;
  title: string;
  imageUrl: string;
  description?: string;
  serviceSlug?: string;
  createdAt: string;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function rowToPost(row: any): GalleryPost {
  return {
    id: row.id,
    title: row.title,
    imageUrl: row.image_url,
    description: row.description ?? undefined,
    serviceSlug: row.service_slug ?? undefined,
    createdAt: row.created_at instanceof Date ? row.created_at.toISOString() : row.created_at,
  };
}

export async function getAllGalleryPosts(): Promise<GalleryPost[]> {
  const rows = await sql`
    SELECT * FROM gallery_posts ORDER BY created_at DESC
  `;
  return rows.map(rowToPost);
}

export async function createGalleryPost(
  input: Omit<GalleryPost, "id" | "createdAt">
): Promise<GalleryPost> {
  const id = crypto.randomUUID();
  const rows = await sql`
    INSERT INTO gallery_posts (id, title, image_url, description, service_slug)
    VALUES (${id}, ${input.title}, ${input.imageUrl}, ${input.description ?? null}, ${input.serviceSlug ?? null})
    RETURNING *
  `;
  return rowToPost(rows[0]);
}

export async function deleteGalleryPost(id: string): Promise<boolean> {
  const rows = await sql`
    DELETE FROM gallery_posts WHERE id = ${id} RETURNING id
  `;
  return rows.length > 0;
}
