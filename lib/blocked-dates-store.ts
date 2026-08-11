import { sql } from "./db";

/** Admin-blocked calendar dates — backed by Neon Postgres (see lib/db.ts). */

export type BlockedDate = {
  id: string;
  date: string; // YYYY-MM-DD
  reason: string;
  createdAt: string;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function rowToBlockedDate(row: any): BlockedDate {
  return {
    id: row.id,
    date: row.date,
    reason: row.reason,
    createdAt: row.created_at instanceof Date ? row.created_at.toISOString() : row.created_at,
  };
}

export async function getAllBlockedDates(): Promise<BlockedDate[]> {
  const rows = await sql`
    SELECT * FROM blocked_dates ORDER BY date ASC
  `;
  return rows.map(rowToBlockedDate);
}

export async function isDateBlocked(date: string): Promise<boolean> {
  const rows = await sql`
    SELECT id FROM blocked_dates WHERE date = ${date} LIMIT 1
  `;
  return rows.length > 0;
}

export async function addBlockedDates(
  dates: string[],
  reason: string
): Promise<BlockedDate[]> {
  for (const date of dates) {
    const id = crypto.randomUUID();
    await sql`
      INSERT INTO blocked_dates (id, date, reason)
      VALUES (${id}, ${date}, ${reason})
      ON CONFLICT (date) DO NOTHING
    `;
  }
  return getAllBlockedDates();
}

export async function deleteBlockedDate(id: string): Promise<boolean> {
  const rows = await sql`
    DELETE FROM blocked_dates WHERE id = ${id} RETURNING id
  `;
  return rows.length > 0;
}
