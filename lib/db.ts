import { neon } from "@neondatabase/serverless";

/**
 * Shared Neon Postgres connection.
 *
 * Requires the DATABASE_URL env var (set automatically when you add the
 * Neon integration in the Vercel dashboard, or manually in .env.local for
 * local dev — see README.md).
 */
function getConnectionString(): string {
  const url = process.env.DATABASE_URL;
  if (!url) {
    throw new Error(
      "DATABASE_URL is not set. Add the Neon integration in your Vercel project " +
        "(Storage tab) or set DATABASE_URL in .env.local for local dev."
    );
  }
  return url;
}

export const sql = neon(getConnectionString());
