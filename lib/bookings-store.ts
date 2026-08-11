import fs from "fs";
import path from "path";
import { buildTimeSlots, timeToMinutes, rangesOverlap, CLOSE_HOUR } from "./schedule";
import { getServiceBySlug } from "./services";

/**
 * Booking data store.
 *
 * Currently backed by a JSON file on disk — fine for local development,
 * but Vercel's serverless filesystem is read-only in production, so this
 * WILL NOT persist once deployed there.
 *
 * When you're ready to add PostgreSQL (the plan in your flow diagram),
 * replace the file-read/file-write internals of the three functions
 * below with queries against your DB. The function signatures
 * (getAllBookings, createBooking, updateBookingStatus) are the only
 * contract the rest of the app depends on, so nothing else needs to change.
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
  notes?: string;
  inspoImageUrl?: string;
  status: BookingStatus;
  createdAt: string;
};

const DATA_FILE = path.join(process.cwd(), "data", "bookings.json");

function readFile(): Booking[] {
  try {
    const raw = fs.readFileSync(DATA_FILE, "utf-8");
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

function writeFile(bookings: Booking[]) {
  fs.mkdirSync(path.dirname(DATA_FILE), { recursive: true });
  fs.writeFileSync(DATA_FILE, JSON.stringify(bookings, null, 2), "utf-8");
}

export function getAllBookings(): Booking[] {
  return readFile().sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time));
}

export function createBooking(
  input: Omit<Booking, "id" | "status" | "createdAt">
): Booking {
  const bookings = readFile();

  const booking: Booking = {
    ...input,
    id: crypto.randomUUID(),
    status: "pending",
    createdAt: new Date().toISOString(),
  };

  bookings.push(booking);
  writeFile(bookings);
  return booking;
}

export function updateBookingStatus(id: string, status: BookingStatus): Booking | null {
  const bookings = readFile();
  const index = bookings.findIndex((b) => b.id === id);
  if (index === -1) return null;

  bookings[index].status = status;
  writeFile(bookings);
  return bookings[index];
}

export function deleteBooking(id: string): boolean {
  const bookings = readFile();
  const next = bookings.filter((b) => b.id !== id);
  if (next.length === bookings.length) return false;
  writeFile(next);
  return true;
}

export function isSlotTaken(date: string, time: string, duration: number): boolean {
  const startMinutes = timeToMinutes(time);
  return readFile().some((b) => {
    if (b.date !== date || b.status === "cancelled") return false;
    const existingDuration = getServiceBySlug(b.serviceSlug)?.duration ?? 60;
    return rangesOverlap(startMinutes, duration, timeToMinutes(b.time), existingDuration);
  });
}

export function getBlockedSlots(date: string, duration: number): string[] {
  const dayBookings = readFile().filter(
    (b) => b.date === date && b.status !== "cancelled"
  );
  return buildTimeSlots(duration).filter((slot) => {
    const slotStart = timeToMinutes(slot);
    return dayBookings.some((b) => {
      const existingDuration = getServiceBySlug(b.serviceSlug)?.duration ?? 60;
      return rangesOverlap(slotStart, duration, timeToMinutes(b.time), existingDuration);
    });
  });
}
