import { NextRequest, NextResponse } from "next/server";
import { createBooking, getAllBookings, isSlotTaken } from "@/lib/bookings-store";
import { getServiceBySlug } from "@/lib/services";
import { verifySessionToken, SESSION_COOKIE_NAME } from "@/lib/auth";
import { isDateBlocked } from "@/lib/blocked-dates-store";
import { timeToMinutes, CLOSE_HOUR } from "@/lib/schedule";

// Admin-only: full booking list, including customer contact details.
export async function GET(request: NextRequest) {
  const token = request.cookies.get(SESSION_COOKIE_NAME)?.value;
  if (!verifySessionToken(token)) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const bookings = await getAllBookings();
  return NextResponse.json({ bookings });
}

// Public: customers create their own bookings.
export async function POST(request: NextRequest) {
  const body = await request.json();
  const { serviceSlug, date, time, name, phone, email, igUsername, notes, inspoImageUrl } = body;

  if (!serviceSlug || !date || !time || !name || !phone || !email) {
    return NextResponse.json(
      { error: "Missing required fields." },
      { status: 400 }
    );
  }

  const service = getServiceBySlug(serviceSlug);
  if (!service) {
    return NextResponse.json({ error: "Unknown service." }, { status: 400 });
  }

  if (await isDateBlocked(date)) {
    return NextResponse.json(
      { error: "That date isn't available. Pick another." },
      { status: 400 }
    );
  }

  if (await isSlotTaken(date, time, service.duration)) {
    return NextResponse.json(
      { error: "That time slot was just booked. Pick another." },
      { status: 409 }
    );
  }

  const endMinutes = timeToMinutes(time) + service.duration;
  if (endMinutes > CLOSE_HOUR * 60) {
    return NextResponse.json(
      { error: "That service won't finish before closing. Pick an earlier time." },
      { status: 400 }
    );
  }

  const booking = await createBooking({
    serviceSlug,
    serviceName: service.name,
    price: service.price,
    date,
    time,
    name,
    phone,
    email,
    igUsername,
    notes,
    inspoImageUrl,
  });
  return NextResponse.json({ booking }, { status: 201 });
}
