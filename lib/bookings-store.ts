import { sql } from "./db";
import { buildTimeSlots, timeToMinutes, rangesOverlap } from "./schedule";
import { getServiceBySlug } from "./services";

/**
 * Booking data store — backed by Neon Postgres (see lib/db.ts).
 *
 * The function signatures (getAllBookings, createBooking, etc.) are the
 * only contract the rest of the app depends on, so nothing else needs to
 * change if the storage backend changes again later.
 */

export type BookingStatus = "pending" | "confirmed" | "completed" | "cancelled";

export type Booking = {
  id: string;
  serviceSlug: string;
  serviceName: string;
  price: number;
  date: string; // YYYY-MM-DD
  time: string; // HH:mm
  name: string;
  phone: string;
  email: string;
  igUsername?: string;
  notes?: string;
  inspoImageUrl?: string;
  status: BookingStatus;
  createdAt: string;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function rowToBooking(row: any): Booking {
  return {
    id: row.id,
    serviceSlug: row.service_slug,
    serviceName: row.service_name,
    price: row.price,
    date: row.date,
    time: row.time,
    name: row.name,
    phone: row.phone,
    email: row.email,
    igUsername: row.ig_username ?? undefined,
    notes: row.notes ?? undefined,
    inspoImageUrl: row.inspo_image_url ?? undefined,
    status: row.status,
    createdAt: row.created_at instanceof Date ? row.created_at.toISOString() : row.created_at,
  };
}

export async function getAllBookings(): Promise<Booking[]> {
  const rows = await sql`
    SELECT * FROM bookings ORDER BY date ASC, time ASC
  `;
  return rows.map(rowToBooking);
}

export async function createBooking(
  input: Omit<Booking, "id" | "status" | "createdAt">
): Promise<Booking> {
  const id = crypto.randomUUID();
  const rows = await sql`
  INSERT INTO bookings (
    id, service_slug, service_name, price, date, time,
    name, phone, email, ig_username, notes, inspo_image_url, status
  ) VALUES (
    ${id}, ${input.serviceSlug}, ${input.serviceName}, ${input.price},
    ${input.date}, ${input.time}, ${input.name}, ${input.phone},
    ${input.email}, ${input.igUsername ?? null}, ${input.notes ?? null}, ${input.inspoImageUrl ?? null}, 'pending'
  )
  RETURNING *
`;
  return rowToBooking(rows[0]);
}

export async function updateBookingStatus(
  id: string,
  status: BookingStatus
): Promise<Booking | null> {
  const rows = await sql`
    UPDATE bookings SET status = ${status} WHERE id = ${id} RETURNING *
  `;
  if (rows.length === 0) return null;
  return rowToBooking(rows[0]);
}

export async function deleteBooking(id: string): Promise<boolean> {
  const rows = await sql`
    DELETE FROM bookings WHERE id = ${id} RETURNING id
  `;
  return rows.length > 0;
}

export async function isSlotTaken(
  date: string,
  time: string,
  duration: number
): Promise<boolean> {
  const startMinutes = timeToMinutes(time);
  const rows = await sql`
    SELECT service_slug, time FROM bookings
    WHERE date = ${date} AND status != 'cancelled'
  `;
  return rows.some((b) => {
    const existingDuration = getServiceBySlug(b.service_slug)?.duration ?? 60;
    return rangesOverlap(startMinutes, duration, timeToMinutes(b.time), existingDuration);
  });
}

export async function getBlockedSlots(date: string, duration: number): Promise<string[]> {
  const dayBookings = await sql`
    SELECT service_slug, time FROM bookings
    WHERE date = ${date} AND status != 'cancelled'
  `;
  return buildTimeSlots(duration).filter((slot) => {
    const slotStart = timeToMinutes(slot);
    return dayBookings.some((b) => {
      const existingDuration = getServiceBySlug(b.service_slug)?.duration ?? 60;
      return rangesOverlap(slotStart, duration, timeToMinutes(b.time), existingDuration);
    });
  });
}
