import { sql } from "./db";

/** Contact-form submissions — backed by Neon Postgres (see lib/db.ts). */

export type ContactMessage = {
  id: string;
  name: string;
  email: string;
  message: string;
  createdAt: string;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function rowToMessage(row: any): ContactMessage {
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    message: row.message,
    createdAt: row.created_at instanceof Date ? row.created_at.toISOString() : row.created_at,
  };
}

export async function getAllMessages(): Promise<ContactMessage[]> {
  const rows = await sql`
    SELECT * FROM messages ORDER BY created_at DESC
  `;
  return rows.map(rowToMessage);
}

export async function createMessage(
  input: Omit<ContactMessage, "id" | "createdAt">
): Promise<ContactMessage> {
  const id = crypto.randomUUID();
  const rows = await sql`
    INSERT INTO messages (id, name, email, message)
    VALUES (${id}, ${input.name}, ${input.email}, ${input.message})
    RETURNING *
  `;
  return rowToMessage(rows[0]);
}
